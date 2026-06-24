/**
 * 예적금 이자 계산 유틸리티
 * 예금(거치식) + 적금(적립식) 이자 계산
 */

export interface SavingsInput {
  depositAmount: number   // 예금액 (만원)
  monthlyAmount: number   // 월 적금액 (만원)
  totalMonths: number     // 기간 (개월)
  annualRate: number      // 연 이자율 (%)
  taxRate: number         // 세율 (%) - default 15.4
}

export interface InterestDetail {
  grossInterest: number   // 세전이자 (만원)
  tax: number             // 이자소득세 (만원)
  netInterest: number     // 세후이자 (만원)
  totalDeposit: number    // 총 원금 (만원)
  totalReceived: number   // 세후 수령액 (만원)
}

export interface SavingsResult {
  simple: InterestDetail   // 단리
  compound: InterestDetail // 복리 (월복리)
  totalDeposit: number     // 총 납입 원금
}

/** 예적금 이자 계산 */
export function calculateSavingsInterest(input: SavingsInput): SavingsResult {
  const { depositAmount, monthlyAmount, totalMonths, annualRate, taxRate } = input
  const monthlyRate = annualRate / 100 / 12
  const totalDeposit = depositAmount + monthlyAmount * totalMonths

  // ── 단리 ──
  // 예금 단리: 원금 × 연이율 × 기간(년)
  const simpleDepositInterest = depositAmount * (annualRate / 100) * (totalMonths / 12)
  // 적금 단리: 월납입액 × 월이율 × 개월수 × (개월수+1) / 2
  const simpleSavingsInterest = monthlyAmount * monthlyRate * totalMonths * (totalMonths + 1) / 2
  const simpleGross = Math.round((simpleDepositInterest + simpleSavingsInterest) * 10000) / 10000

  // ── 복리 (월복리) ──
  // 예금 복리: 원금 × (1 + 월이율)^개월수 - 원금
  let compoundDepositInterest = 0
  if (depositAmount > 0 && monthlyRate > 0) {
    compoundDepositInterest = depositAmount * (Math.pow(1 + monthlyRate, totalMonths) - 1)
  }
  // 적금 복리: 매월 납입분이 남은 기간만큼 복리
  let compoundSavingsInterest = 0
  if (monthlyAmount > 0 && monthlyRate > 0) {
    // FV = monthly × [(1+r)^n - 1] / r  (기말 납입 기준)
    const fv = monthlyAmount * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate
    compoundSavingsInterest = fv - monthlyAmount * totalMonths
  }
  const compoundGross = Math.round((compoundDepositInterest + compoundSavingsInterest) * 10000) / 10000

  const makeDetail = (grossInterest: number): InterestDetail => {
    const rounded = Math.round(grossInterest * 10000) / 10000
    const tax = Math.round(rounded * taxRate / 100 * 10000) / 10000
    const netInterest = rounded - tax
    return {
      grossInterest: rounded,
      tax,
      netInterest,
      totalDeposit,
      totalReceived: totalDeposit + netInterest,
    }
  }

  return {
    simple: makeDetail(simpleGross),
    compound: makeDetail(compoundGross),
    totalDeposit,
  }
}
