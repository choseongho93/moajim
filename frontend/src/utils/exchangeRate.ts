/**
 * 환율 계산 유틸리티
 * - 외화 ↔ KRW 양방향 환산
 * - 주요 18개국 통화 메타 (코드/한글명/국기 이모지/소수점)
 */

export interface CurrencyMeta {
  code: string       // ISO 4217 통화 코드 (e.g. 'USD')
  name: string       // 한글명 (e.g. '미국 달러')
  flag: string       // 국기 이모지
  symbol: string     // 통화 기호
  decimals: number   // 외화 표시 시 소수점 자리수
}

export const CURRENCIES: CurrencyMeta[] = [
  { code: 'USD', name: '미국 달러',       flag: '🇺🇸', symbol: '$',   decimals: 2 },
  { code: 'JPY', name: '일본 엔',         flag: '🇯🇵', symbol: '¥',   decimals: 2 },
  { code: 'CNY', name: '중국 위안',       flag: '🇨🇳', symbol: '¥',   decimals: 2 },
  { code: 'EUR', name: '유로',           flag: '🇪🇺', symbol: '€',   decimals: 2 },
  { code: 'GBP', name: '영국 파운드',     flag: '🇬🇧', symbol: '£',   decimals: 2 },
  { code: 'AUD', name: '호주 달러',       flag: '🇦🇺', symbol: 'A$',  decimals: 2 },
  { code: 'CAD', name: '캐나다 달러',     flag: '🇨🇦', symbol: 'C$',  decimals: 2 },
  { code: 'CHF', name: '스위스 프랑',     flag: '🇨🇭', symbol: 'CHF', decimals: 2 },
  { code: 'HKD', name: '홍콩 달러',       flag: '🇭🇰', symbol: 'HK$', decimals: 2 },
  { code: 'SGD', name: '싱가포르 달러',   flag: '🇸🇬', symbol: 'S$',  decimals: 2 },
  { code: 'TWD', name: '대만 달러',       flag: '🇹🇼', symbol: 'NT$', decimals: 2 },
  { code: 'THB', name: '태국 바트',       flag: '🇹🇭', symbol: '฿',   decimals: 2 },
  { code: 'VND', name: '베트남 동',       flag: '🇻🇳', symbol: '₫',   decimals: 0 },
  { code: 'IDR', name: '인도네시아 루피아', flag: '🇮🇩', symbol: 'Rp',  decimals: 0 },
  { code: 'PHP', name: '필리핀 페소',     flag: '🇵🇭', symbol: '₱',   decimals: 2 },
  { code: 'MYR', name: '말레이시아 링깃', flag: '🇲🇾', symbol: 'RM',  decimals: 2 },
  { code: 'INR', name: '인도 루피',       flag: '🇮🇳', symbol: '₹',   decimals: 2 },
  { code: 'NZD', name: '뉴질랜드 달러',   flag: '🇳🇿', symbol: 'NZ$', decimals: 2 },
]

export function getCurrency(code: string): CurrencyMeta | undefined {
  return CURRENCIES.find(c => c.code === code)
}

/** 외화 → KRW (rate = 1 [foreign] 당 KRW) */
export function toKrw(foreignAmount: number, rate: number): number {
  return foreignAmount * rate
}

/** KRW → 외화 (rate = 1 [foreign] 당 KRW) */
export function fromKrw(krwAmount: number, rate: number): number {
  if (rate <= 0) return 0
  return krwAmount / rate
}

/** KRW 금액 포맷 (원 단위, 정수 반올림 + 콤마) */
export function formatKrw(amount: number): string {
  if (!isFinite(amount)) return '0원'
  return Math.round(amount).toLocaleString() + '원'
}

/** 외화 금액 포맷 (통화별 소수점 + 콤마 + 기호) */
export function formatForeign(amount: number, meta: CurrencyMeta): string {
  if (!isFinite(amount)) return `${meta.symbol}0`
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: meta.decimals,
    maximumFractionDigits: meta.decimals,
  })
  return `${meta.symbol}${formatted}`
}

/** 환율 표시 (1 [code] = X원) - 소수점 2자리 + 콤마 */
export function formatRate(rate: number): string {
  if (!isFinite(rate)) return '0원'
  return rate.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }) + '원'
}
