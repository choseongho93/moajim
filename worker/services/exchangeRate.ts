/**
 * 환율 서비스 - open.er-api.com 무료 환율 API 호출 + 인메모리 캐시
 *
 * - 소스: https://open.er-api.com/v6/latest/USD (무인증, 매일 갱신, KRW 포함)
 * - 캐시: 30분 TTL (모듈 메모리 - 워커 재시작 시 소실되나 정상 동작 무관)
 * - 반환: 1 [외화] = N KRW (외화 → 원화 환산용)
 */

const TTL_MS = 30 * 60 * 1000 // 30분
const API_URL = 'https://open.er-api.com/v6/latest/USD'

// 지원 통화 목록 (USD 베이스에서 cross-rate 계산)
const SUPPORTED_CURRENCIES = [
  'USD', 'JPY', 'CNY', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF',
  'HKD', 'SGD', 'TWD', 'THB', 'VND', 'IDR', 'PHP', 'MYR', 'INR', 'NZD',
]

export interface ExchangeRatesResponse {
  base: 'KRW'
  rates: Record<string, number>  // 1 [code] = N KRW
  timestamp: number              // unix seconds, 외부 API의 마지막 갱신 시각
  nextUpdate: number             // unix seconds, 외부 API의 다음 갱신 예정 시각
  fetchedAt: number              // unix ms, 우리 서버가 마지막으로 가져온 시각
}

interface OpenErApiResponse {
  result: string
  time_last_update_unix: number
  time_next_update_unix: number
  base_code: string
  rates: Record<string, number>
}

let cache: { data: ExchangeRatesResponse; expiresAt: number } | null = null

/**
 * 환율 조회 (캐시 우선, 만료 시 외부 API 재호출)
 */
export async function fetchExchangeRates(): Promise<ExchangeRatesResponse> {
  const now = Date.now()
  if (cache && cache.expiresAt > now) {
    return cache.data
  }

  const response = await fetch(API_URL, {
    cf: { cacheTtl: 1800, cacheEverything: true },
  } as RequestInit)

  if (!response.ok) {
    // 캐시가 있으면 stale이라도 반환 (외부 API 장애 대비)
    if (cache) return cache.data
    throw new Error(`Exchange rate API error: HTTP ${response.status}`)
  }

  const data = (await response.json()) as OpenErApiResponse

  if (data.result !== 'success' || !data.rates || !data.rates.KRW) {
    if (cache) return cache.data
    throw new Error('Exchange rate API returned invalid data')
  }

  const krwPerUsd = data.rates.KRW

  // USD 베이스를 KRW 베이스로 변환: 1 [code] = (KRW/USD) / (code/USD) KRW
  const rates: Record<string, number> = {}
  for (const code of SUPPORTED_CURRENCIES) {
    const codePerUsd = data.rates[code]
    if (typeof codePerUsd === 'number' && codePerUsd > 0) {
      rates[code] = Math.round((krwPerUsd / codePerUsd) * 10000) / 10000
    }
  }

  const result: ExchangeRatesResponse = {
    base: 'KRW',
    rates,
    timestamp: data.time_last_update_unix,
    nextUpdate: data.time_next_update_unix,
    fetchedAt: Math.floor(now / 1000),
  }

  cache = { data: result, expiresAt: now + TTL_MS }
  return result
}
