/**
 * 법무사 보수료 계산 유틸리티
 *
 * 소유권이전등기 기준 (2024.9.12 개정)
 * - 기본보수 + 부가가치세(10%) + 교통비(80,000원)
 * - 공공비용: 인지세(수입인지) + 등기신청수수료(증지, 18,000원)
 */

export interface LawyerFeeInput {
  taxBase: number           // 과세표준 (만원)
  includePublicCost: boolean // 공공비용(인지·증지) 포함
}

export interface LawyerFeeResult {
  baseFee: number           // 기본보수 (원)
  vat: number               // 부가가치세 (원)
  transportFee: number      // 교통비 (원)
  stampTax: number           // 인지세 (원)
  registrationFee: number   // 등기신청수수료 (원)
  totalFee: number           // 합계 (원)
}

/** 기본보수 계산 (소유권이전등기, 2024.9.12 개정) */
export function getBaseFee(taxBaseMan: number): number {
  const amount = taxBaseMan * 10000 // 만원 → 원
  if (amount <= 50000000) {
    return 210000
  } else if (amount <= 100000000) {
    return 210000 + Math.round((amount - 50000000) * 0.001)
  } else {
    return 260000 + Math.round((amount - 100000000) * 0.0009)
  }
}

/** 인지세 (수입인지) 계산 */
export function getStampTax(taxBaseMan: number): number {
  const amount = taxBaseMan * 10000
  if (amount <= 10000000) return 0
  if (amount <= 30000000) return 20000
  if (amount <= 50000000) return 40000
  if (amount < 100000000) return 70000
  if (amount <= 1000000000) return 150000
  return 350000
}

/** 법무사 보수료 전체 계산 */
export function calculateLawyerFee(input: LawyerFeeInput): LawyerFeeResult {
  const baseFee = getBaseFee(input.taxBase)
  const vat = Math.round(baseFee * 0.1)
  const transportFee = 80000
  const stampTax = input.includePublicCost ? getStampTax(input.taxBase) : 0
  const registrationFee = input.includePublicCost ? 18000 : 0

  const totalFee = baseFee + vat + transportFee + stampTax + registrationFee

  return {
    baseFee,
    vat,
    transportFee,
    stampTax,
    registrationFee,
    totalFee,
  }
}
