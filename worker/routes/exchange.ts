import { CORS_HEADERS } from '../middleware/cors'
import { fetchExchangeRates } from '../services/exchangeRate'

/**
 * GET /api/exchange/rates
 * 주요국 통화 → KRW 환율 반환 (30분 캐시)
 */
export async function handleGetExchangeRates(): Promise<Response> {
  try {
    const data = await fetchExchangeRates()

    return new Response(
      JSON.stringify({ success: true, ...data }),
      {
        headers: {
          ...CORS_HEADERS,
          // 클라이언트/CDN 캐시도 30분 (서버 캐시와 정합)
          'Cache-Control': 'public, max-age=1800',
        },
      }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fetching exchange rates:', message)
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 502, headers: CORS_HEADERS }
    )
  }
}
