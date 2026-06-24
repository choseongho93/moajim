/**
 * 중도상환수수료 계산 유틸리티
 *
 * 공식: 중도상환수수료 = 중도상환원금 × 수수료율(%) × (잔존기간 ÷ 대출기간)
 */

export interface EarlyRepaymentFeeInput {
  repaymentAmount: number   // 중도상환 원금 (만원)
  feeRate: number           // 수수료율 (%)
  loanMonths: number        // 대출 기간 (개월)
  remainingMonths: number   // 잔존 기간 (개월)
}

export interface EarlyRepaymentFeeResult {
  fee: number               // 중도상환수수료 (만원)
  feeWon: number            // 중도상환수수료 (원)
  effectiveRate: number     // 실질 수수료율 (%)
}

/** 중도상환수수료 계산 */
export function calculateEarlyRepaymentFee(input: EarlyRepaymentFeeInput): EarlyRepaymentFeeResult {
  const { repaymentAmount, feeRate, loanMonths, remainingMonths } = input

  const fee = repaymentAmount * (feeRate / 100) * (remainingMonths / loanMonths)
  const feeRounded = Math.round(fee * 10000) / 10000
  const feeWon = Math.round(fee * 10000)
  const effectiveRate = loanMonths > 0 ? feeRate * (remainingMonths / loanMonths) : 0
  const effectiveRateRounded = Math.round(effectiveRate * 10000) / 10000

  return {
    fee: feeRounded,
    feeWon,
    effectiveRate: effectiveRateRounded,
  }
}
