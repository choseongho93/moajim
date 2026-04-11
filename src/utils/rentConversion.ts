/**
 * 전월세 전환 계산 유틸리티
 * 전세 ↔ 월세 전환, 전월세전환율 계산
 */

export type ConversionMode = 'jeonse-to-wolse' | 'wolse-to-jeonse' | 'conversion-rate'

export interface RentConversionInput {
  mode: ConversionMode
  conversionRate: number   // 전월세전환율 (%)
  jeonseDeposit: number    // 전세보증금 (만원)
  wolseDeposit: number     // 월세보증금 (만원)
  monthlyRent: number      // 월세 (만원)
}

export interface RentConversionResult {
  conversionRate: number   // 전월세전환율 (%)
  jeonseDeposit: number    // 전세보증금 (만원)
  wolseDeposit: number     // 월세보증금 (만원)
  monthlyRent: number      // 월세 (만원)
  yearlyRent: number       // 연 월세 (만원)
}

/**
 * 전월세 전환 계산
 *
 * 공식: 월세 = (전세보증금 - 월세보증금) × 전월세전환율 / 12 / 100
 * 역산: 전세보증금 = 월세보증금 + (월세 × 12 / 전월세전환율 × 100)
 * 전환율: 전월세전환율 = (월세 × 12) / (전세보증금 - 월세보증금) × 100
 */
export function calculateRentConversion(input: RentConversionInput): RentConversionResult | null {
  const { mode, conversionRate, jeonseDeposit, wolseDeposit, monthlyRent } = input

  switch (mode) {
    case 'jeonse-to-wolse': {
      // 전세→월세: 전세보증금 + 전환율 → 월세보증금 + 월세 계산
      // 월세보증금이 입력되면 차액으로 월세 계산, 아니면 보증금 0으로 전액 월세
      if (conversionRate <= 0 || jeonseDeposit <= 0) return null
      const deposit = wolseDeposit >= 0 ? wolseDeposit : 0
      if (deposit >= jeonseDeposit) return null
      const diff = jeonseDeposit - deposit
      const monthly = Math.round(diff * conversionRate / 100 / 12 * 10000) / 10000
      return {
        conversionRate,
        jeonseDeposit,
        wolseDeposit: deposit,
        monthlyRent: monthly,
        yearlyRent: Math.round(monthly * 12 * 10000) / 10000,
      }
    }

    case 'wolse-to-jeonse': {
      // 월세→전세: 월세보증금 + 월세 + 전환율 → 전세보증금 계산
      if (conversionRate <= 0 || monthlyRent <= 0) return null
      const deposit = wolseDeposit >= 0 ? wolseDeposit : 0
      const jeonse = Math.round((deposit + monthlyRent * 12 / (conversionRate / 100)) * 10000) / 10000
      return {
        conversionRate,
        jeonseDeposit: jeonse,
        wolseDeposit: deposit,
        monthlyRent,
        yearlyRent: Math.round(monthlyRent * 12 * 10000) / 10000,
      }
    }

    case 'conversion-rate': {
      // 전월세전환율 계산: 전세보증금 + 월세보증금 + 월세 → 전환율
      if (jeonseDeposit <= 0 || monthlyRent <= 0) return null
      const deposit = wolseDeposit >= 0 ? wolseDeposit : 0
      const diff = jeonseDeposit - deposit
      if (diff <= 0) return null
      const rate = Math.round(monthlyRent * 12 / diff * 100 * 100) / 100
      return {
        conversionRate: rate,
        jeonseDeposit,
        wolseDeposit: deposit,
        monthlyRent,
        yearlyRent: Math.round(monthlyRent * 12 * 10000) / 10000,
      }
    }
  }
}
