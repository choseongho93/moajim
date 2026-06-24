/**
 * 상속세 계산 유틸리티
 *
 * 계산 흐름:
 * 1. 상속세과세가액 = 상속재산 - 장례비용 - 채무 + 사전증여
 * 2. 상속공제 합계 = 일반공제 + 배우자공제 + 금융재산공제 + 동거주택공제 + 감정평가수수료
 * 3. 공제 종합한도 = 과세가액 - 세대생략분 - 사전증여과세표준
 * 4. 적용 공제 = MIN(상속공제 합계, 공제 종합한도)
 * 5. 과세표준 = 과세가액 - 적용 공제
 * 6. 산출세액 = 과세표준 × 세율 - 누진공제
 * 7. 세대생략할증 = 산출세액 × (세대생략액/상속재산) × 할증율(30%/40%)
 * 8. 납부세액 = (산출세액 + 할증) - 신고세액공제(3%)
 */

export type SpouseType = 'spouse-yes' | 'spouse-inherits' | 'no-spouse'
export type DeductionType = 'lump-sum' | 'personal'

export interface InheritanceTaxInput {
  spouseType: SpouseType       // 배우자 유/유(상속)/무
  deductionType: DeductionType // 일괄공제/인적공제
  inheritanceAmount: number    // 상속재산 (만원)
  funeralExpense: number       // 장례비용 (만원)
  spouseInheritance: number    // 배우자 실제 상속액 (만원)
  descendantCount: number      // 직계비속 수
  ascendantCount: number       // 직계존속 수
  childrenCount: number        // 자녀 수 (인적공제용)
  elderlyCount: number         // 고령자 수 (65세 이상)
  minorCount: number           // 미성년자 수
  disabledCount: number        // 장애인 수
  use2024Reform: boolean       // 2024 세법개정안 적용
  isGenerationSkip: boolean    // 세대생략 상속
  generationSkipAmount: number // 세대를 건너뛴 상속액 (만원)
  isMinorHeir: boolean         // 상속자 미성년자 여부 (세대생략 할증 40%)
  hasDebt: boolean
  debtAmount: number           // 채무액 (만원)
  hasAppraisal: boolean
  appraisalFee: number         // 감정평가 수수료 (만원)
  hasResidence: boolean
  residenceDeduction: number   // 동거주택 공제액 (만원)
  hasFinancial: boolean
  financialAmount: number      // 금융재산액 (만원)
  hasPastGift: boolean
  pastGiftAmount: number       // 사전증여 가산액 (만원)
}

export interface InheritanceTaxResult {
  inheritanceAmount: number
  funeralExpense: number
  debtAmount: number
  pastGiftAmount: number
  taxableInheritance: number       // 상속세과세가액
  basicDeduction: number           // 기초공제 (2억)
  personalDeduction: number        // 인적공제
  basicPlusPersonal: number        // 기초 + 인적
  lumpSumDeduction: number         // 일괄공제 (5억)
  generalDeduction: number         // 일반공제 (MAX)
  spouseDeduction: number          // 배우자공제
  financialDeduction: number       // 금융재산공제
  residenceDeduction: number       // 동거주택공제
  appraisalFee: number             // 감정평가수수료
  totalDeductions: number          // 상속공제 합계 (한도 적용 전)
  deductionCap: number             // 공제 종합한도
  appliedDeductions: number        // 적용 공제 (한도 적용 후)
  taxBase: number                  // 과세표준
  taxRate: number                  // 적용세율 (%)
  progressiveDeduction: number     // 누진공제액
  baseTax: number                  // 산출세액 (만원)
  generationSkipSurcharge: number  // 세대생략 할증액 (만원)
  calculatedTaxWon: number         // 산출세액 + 할증 (원)
  filingDeductionWon: number       // 신고세액공제 (원)
  finalTaxWon: number              // 최종 납부세액 (원)
}

/** 과세표준에 따른 세율·누진공제 (현행) */
function getCurrentBracket(taxBase: number): { rate: number; progressiveDeduction: number } {
  if (taxBase <= 10000)       return { rate: 10, progressiveDeduction: 0 }
  else if (taxBase <= 50000)  return { rate: 20, progressiveDeduction: 1000 }
  else if (taxBase <= 100000) return { rate: 30, progressiveDeduction: 6000 }
  else if (taxBase <= 300000) return { rate: 40, progressiveDeduction: 16000 }
  else                        return { rate: 50, progressiveDeduction: 46000 }
}

/** 과세표준에 따른 세율·누진공제 (2024 개정안) */
function getReformBracket(taxBase: number): { rate: number; progressiveDeduction: number } {
  if (taxBase <= 20000)       return { rate: 10, progressiveDeduction: 0 }
  else if (taxBase <= 50000)  return { rate: 20, progressiveDeduction: 2000 }
  else if (taxBase <= 100000) return { rate: 30, progressiveDeduction: 7000 }
  else                        return { rate: 40, progressiveDeduction: 17000 }
}

/** 세율·누진공제 */
export function getInheritanceTaxBracket(taxBase: number, use2024Reform: boolean): { rate: number; progressiveDeduction: number } {
  return use2024Reform ? getReformBracket(taxBase) : getCurrentBracket(taxBase)
}

/** 인적공제 계산 */
export function calculatePersonalDeduction(input: {
  childrenCount: number
  elderlyCount: number
  minorCount: number
  disabledCount: number
  use2024Reform: boolean
}): number {
  // 자녀공제: 현행 1인당 5천만, 개정안 1인당 5억
  const childDeduction = input.use2024Reform
    ? input.childrenCount * 50000
    : input.childrenCount * 5000

  // 미성년자공제: 19세까지 연수 × 1천만원 (간이: 인당 1천만으로 계산)
  const minorDeduction = input.minorCount * 1000

  // 연로자공제: 1인당 5천만원
  const elderlyDeduction = input.elderlyCount * 5000

  // 장애인공제: 기대여명 × 1천만원 (간이: 인당 1천만으로 계산)
  const disabledDeduction = input.disabledCount * 1000

  return childDeduction + minorDeduction + elderlyDeduction + disabledDeduction
}

/**
 * 배우자공제 계산
 * 법정상속비율 = 1.5 / (1.5 + 직계비속수 + 직계존속수) — 직계비속이 있으면 존속 무시
 * 법정상속분 = 상속세과세가액 × 법정상속비율
 * 배우자공제 = MIN(실제상속액, 법정상속분), CLAMP(5억, 30억)
 */
export function calculateSpouseDeduction(
  taxableInheritance: number,
  spouseInheritance: number,
  descendantCount: number,
  ascendantCount: number,
): number {
  // 배우자만 단독 상속인인 경우
  if (descendantCount === 0 && ascendantCount === 0) {
    return Math.min(Math.max(spouseInheritance, 50000), 300000)
  }

  // 직계비속이 있으면 존속은 상속순위에서 밀려남
  const otherHeirs = descendantCount > 0 ? descendantCount : ascendantCount
  const spouseRatio = 1.5 / (1.5 + otherHeirs)
  const legalShare = Math.floor(taxableInheritance * spouseRatio)

  const rawDeduction = Math.min(spouseInheritance, legalShare)
  return Math.min(Math.max(rawDeduction, 50000), 300000)
}

/** 금융재산공제 */
export function calculateFinancialDeduction(financialAmount: number): number {
  if (financialAmount <= 0) return 0
  if (financialAmount <= 2000) return financialAmount // 2천만 이하: 전액
  if (financialAmount <= 100000) return Math.min(financialAmount * 0.2, 20000) // 20%, 최대 2억
  return 20000 // 10억 초과: 2억 고정
}

/** 상속세 전체 계산 */
export function calculateInheritanceTax(input: InheritanceTaxInput): InheritanceTaxResult {
  const funeralExpense = input.funeralExpense
  const debtAmount = input.hasDebt ? input.debtAmount : 0
  const pastGiftAmount = input.hasPastGift ? input.pastGiftAmount : 0
  const appraisalFee = input.hasAppraisal ? input.appraisalFee : 0
  const residenceDeduction = input.hasResidence ? input.residenceDeduction : 0
  const financialAmount = input.hasFinancial ? input.financialAmount : 0
  const genSkipAmount = input.isGenerationSkip ? input.generationSkipAmount : 0

  // ① 상속세과세가액 = 상속재산 - 장례비용 - 채무 + 사전증여
  const taxableInheritance = Math.max(0,
    input.inheritanceAmount - funeralExpense - debtAmount + pastGiftAmount
  )

  // ② 일반공제 (기초+인적 vs 일괄 중 큰 것)
  const basicDeduction = 20000 // 기초공제 2억
  let personalDeduction = 0
  let lumpSumDeduction = 50000 // 일괄공제 5억

  if (input.deductionType === 'personal') {
    personalDeduction = calculatePersonalDeduction({
      childrenCount: input.childrenCount,
      elderlyCount: input.elderlyCount,
      minorCount: input.minorCount,
      disabledCount: input.disabledCount,
      use2024Reform: input.use2024Reform,
    })
  }

  const basicPlusPersonal = basicDeduction + personalDeduction
  let generalDeduction: number

  if (input.deductionType === 'lump-sum') {
    generalDeduction = lumpSumDeduction
  } else {
    generalDeduction = Math.max(basicPlusPersonal, lumpSumDeduction)
    if (basicPlusPersonal > lumpSumDeduction) {
      lumpSumDeduction = 0
    }
  }

  // ③ 배우자공제
  let spouseDeduction = 0
  if (input.spouseType === 'spouse-yes') {
    spouseDeduction = 50000
  } else if (input.spouseType === 'spouse-inherits') {
    spouseDeduction = calculateSpouseDeduction(
      taxableInheritance,
      input.spouseInheritance,
      input.descendantCount,
      input.ascendantCount,
    )
  }

  // ④ 금융재산공제
  const financialDeduction = calculateFinancialDeduction(financialAmount)

  // ⑤ 상속공제 합계
  const totalDeductions = generalDeduction + spouseDeduction + financialDeduction + residenceDeduction + appraisalFee

  // ⑥ 공제 종합한도 (법 제24조)
  // = 과세가액 - 비상속인유증재산(세대생략분) - 사전증여재산과세표준
  const deductionCap = Math.max(0, taxableInheritance - genSkipAmount - pastGiftAmount)

  // ⑦ 적용 공제 = MIN(합계, 종합한도)
  const appliedDeductions = Math.min(totalDeductions, deductionCap)

  // ⑧ 과세표준
  const taxBase = Math.max(0, taxableInheritance - appliedDeductions)

  // ⑨ 세율·누진공제
  const { rate, progressiveDeduction } = getInheritanceTaxBracket(taxBase, input.use2024Reform)

  // ⑩ 산출세액
  const baseTax = Math.max(0, Math.floor(taxBase * (rate / 100) - progressiveDeduction))

  // ⑪ 세대생략 할증: 산출세액 × (세대생략액 / 상속재산가액) × 할증율
  let generationSkipSurcharge = 0
  if (input.isGenerationSkip && genSkipAmount > 0 && input.inheritanceAmount > 0) {
    const genSkipRatio = Math.min(genSkipAmount / input.inheritanceAmount, 1)
    const genSkipTax = baseTax * genSkipRatio
    const surchargeRate = input.isMinorHeir ? 0.4 : 0.3
    generationSkipSurcharge = Math.floor(genSkipTax * surchargeRate)
  }

  // ⑫ 원 단위로 정밀 계산 (신고세액공제·최종세액)
  const calculatedTaxWon = (baseTax + generationSkipSurcharge) * 10000
  const filingDeductionWon = Math.floor(calculatedTaxWon * 0.03)
  const finalTaxWon = Math.max(0, calculatedTaxWon - filingDeductionWon)

  return {
    inheritanceAmount: input.inheritanceAmount,
    funeralExpense,
    debtAmount,
    pastGiftAmount,
    taxableInheritance,
    basicDeduction,
    personalDeduction,
    basicPlusPersonal,
    lumpSumDeduction,
    generalDeduction,
    spouseDeduction,
    financialDeduction,
    residenceDeduction,
    appraisalFee,
    totalDeductions,
    deductionCap,
    appliedDeductions,
    taxBase,
    taxRate: rate,
    progressiveDeduction,
    baseTax,
    generationSkipSurcharge,
    calculatedTaxWon,
    filingDeductionWon,
    finalTaxWon,
  }
}
