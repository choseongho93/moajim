/**
 * 증여세 계산 유틸리티
 *
 * 계산 흐름:
 * 1. 증여세과세가액 = 증여재산가액 - 채무부담액 - 비과세액 + 사전증여가산액
 * 2. 과세표준 = 증여세과세가액 - 증여재산공제(인적공제) - 감정평가수수료
 * 3. 산출세액 = 과세표준 × 세율 - 누진공제 (+ 세대생략 할증 30%)
 * 4. 납부세액 = 산출세액 - 기납부세액 - 신고세액공제(3%)
 */

export type DonorType = 'spouse' | 'ascendant' | 'descendant' | 'relative' | 'other'

export interface GiftTaxInput {
  giftAmount: number          // 증여재산가액 (만원)
  donorType: DonorType        // 증여자 관계
  isMinor: boolean            // 수증자 미성년자 여부
  isGenerationSkip: boolean   // 세대생략 증여 여부
  isMarriageGift: boolean     // 결혼·출산 증여공제 여부
  marriageGiftAmount: number  // 결혼·출산 증여공제액 (만원, 최대 1억)
  debtAmount: number          // 채무 인수액 (만원)
  taxExemptAmount: number     // 비과세·과세불산입액 (만원)
  appraisalFee: number        // 감정평가 수수료 (만원)
  pastGiftAmount: number      // 사전증여 재산가액 (만원)
  giftTaxPaid: number         // 기납부 증여세액 (만원)
}

export interface GiftTaxResult {
  giftAmount: number          // 증여재산가액
  debtAmount: number          // 채무 인수액
  taxExemptAmount: number     // 비과세액
  pastGiftAmount: number      // 사전증여 가산액
  taxableGiftAmount: number   // 증여세과세가액
  personalDeduction: number   // 인적공제 (증여재산공제)
  marriageDeduction: number   // 결혼·출산 공제
  appraisalFee: number        // 감정평가 수수료
  taxBase: number             // 과세표준
  taxRate: number             // 적용세율 (%)
  progressiveDeduction: number // 누진공제액
  calculatedTax: number       // 산출세액
  generationSkipSurcharge: number // 세대생략 할증액
  giftTaxPaid: number         // 기납부세액
  filingDeduction: number     // 신고세액공제 (3%)
  finalTax: number            // 최종 납부세액
}

/** 증여재산공제(인적공제) 계산 */
export function getPersonalDeduction(donorType: DonorType, isMinor: boolean): number {
  switch (donorType) {
    case 'spouse':     return 60000  // 6억
    case 'ascendant':  return isMinor ? 2000 : 5000  // 미성년 2천만, 성인 5천만
    case 'descendant': return 5000   // 5천만
    case 'relative':   return 1000   // 1천만
    case 'other':      return 0
    default:           return 0
  }
}

/** 과세표준에 따른 세율·누진공제 */
export function getTaxBracket(taxBase: number): { rate: number; progressiveDeduction: number } {
  if (taxBase <= 10000)       return { rate: 10, progressiveDeduction: 0 }
  else if (taxBase <= 50000)  return { rate: 20, progressiveDeduction: 1000 }
  else if (taxBase <= 100000) return { rate: 30, progressiveDeduction: 6000 }
  else if (taxBase <= 300000) return { rate: 40, progressiveDeduction: 16000 }
  else                        return { rate: 50, progressiveDeduction: 46000 }
}

/** 증여세 전체 계산 */
export function calculateGiftTax(input: GiftTaxInput): GiftTaxResult {
  // 1. 증여세과세가액 = 증여재산가액 - 채무 - 비과세 + 사전증여
  const taxableGiftAmount = Math.max(0,
    input.giftAmount - input.debtAmount - input.taxExemptAmount + input.pastGiftAmount
  )

  // 2. 공제 합산
  const personalDeduction = getPersonalDeduction(input.donorType, input.isMinor)
  const marriageDeduction = input.isMarriageGift
    ? Math.min(input.marriageGiftAmount, 10000)  // 최대 1억
    : 0

  // 3. 과세표준 = 증여세과세가액 - 인적공제 - 결혼출산공제 - 감정평가수수료
  const taxBase = Math.max(0,
    taxableGiftAmount - personalDeduction - marriageDeduction - input.appraisalFee
  )

  // 4. 산출세액
  const { rate, progressiveDeduction } = getTaxBracket(taxBase)
  let calculatedTax = Math.max(0, taxBase * (rate / 100) - progressiveDeduction)

  // 5. 세대생략 할증 30%
  const generationSkipSurcharge = input.isGenerationSkip
    ? Math.round(calculatedTax * 0.3)
    : 0
  calculatedTax += generationSkipSurcharge

  // 6. 기납부세액 차감
  const afterPaid = Math.max(0, calculatedTax - input.giftTaxPaid)

  // 7. 신고세액공제 3%
  const filingDeduction = Math.round(afterPaid * 0.03)

  // 8. 최종 납부세액
  const finalTax = Math.max(0, afterPaid - filingDeduction)

  return {
    giftAmount: input.giftAmount,
    debtAmount: input.debtAmount,
    taxExemptAmount: input.taxExemptAmount,
    pastGiftAmount: input.pastGiftAmount,
    taxableGiftAmount,
    personalDeduction,
    marriageDeduction,
    appraisalFee: input.appraisalFee,
    taxBase,
    taxRate: rate,
    progressiveDeduction,
    calculatedTax,
    generationSkipSurcharge,
    giftTaxPaid: input.giftTaxPaid,
    filingDeduction,
    finalTax,
  }
}
