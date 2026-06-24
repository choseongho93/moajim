/**
 * 양도소득세 계산 유틸리티
 *
 * 계산 흐름:
 * 1. 양도차익 = 양도가액 - 취득가액 - 필요경비
 * 2. 1세대1주택 비과세 판정 (12억 기준)
 * 3. 장기보유특별공제 계산
 * 4. 양도소득금액 = 과세대상 양도차익 - 장기보유특별공제
 * 5. 과세표준 = 양도소득금액 - 기본공제(250만원)
 * 6. 산출세액 = 과세표준 × 세율 - 누진공제
 * 7. 지방소득세 = 산출세액 × 10%
 * 8. 총 납부세액 = 산출세액 + 지방소득세
 */

export type CGTPropertyType = 'single-home' | 'general' | 'pre-sale' | 'land'

export interface CapitalGainsTaxInput {
  propertyType: CGTPropertyType
  acquisitionPrice: number       // 취득가액 (만원)
  transferPrice: number          // 양도가액 (만원)
  expenses: number               // 필요경비 (만원)
  acquisitionDate: string        // YYYYMMDD
  transferDate: string           // YYYYMMDD
  useBasicDeduction: boolean     // 기본공제 250만원
  isJointOwnership: boolean      // 공동명의
  ownershipRatio: number         // 지분율 (%)
  isRegulatedArea: boolean       // 조정대상지역
  hasLivedTwoYears: boolean      // 2년 이상 거주 (1세대1주택)
  isNonBusinessLand: boolean     // 비사업토지
}

export interface CapitalGainsTaxResult {
  acquisitionPrice: number
  transferPrice: number
  expenses: number
  effectiveAcquisitionPrice: number
  effectiveTransferPrice: number
  effectiveExpenses: number
  capitalGain: number            // 양도차익
  taxExemptGain: number          // 비과세 양도차익
  taxableGain: number            // 과세대상 양도차익
  holdingMonths: number
  holdingYears: number
  longTermRate: number           // 장기보유특별공제율 (%)
  longTermDeduction: number      // 장기보유특별공제액
  taxableIncome: number          // 양도소득금액
  basicDeduction: number         // 기본공제
  taxBase: number                // 과세표준
  taxRate: number                // 적용 세율 (%)
  progressiveDeduction: number   // 누진공제 (만원)
  surchargeRate: number          // 중과세율 (%)
  calculatedTax: number          // 산출세액 (만원)
  localTax: number               // 지방소득세 (만원)
  totalTaxWon: number            // 총 납부세액 (원)
  isTaxExempt: boolean           // 전액 비과세 여부
}

/** 날짜 문자열 파싱 (YYYYMMDD) */
function parseDate(dateStr: string): Date | null {
  if (dateStr.length !== 8) return null
  const year = parseInt(dateStr.substring(0, 4))
  const month = parseInt(dateStr.substring(4, 6)) - 1
  const day = parseInt(dateStr.substring(6, 8))
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null
  return new Date(year, month, day)
}

/** 보유기간 계산 (월) */
function getHoldingMonths(acqDate: Date, transDate: Date): number {
  const years = transDate.getFullYear() - acqDate.getFullYear()
  const months = transDate.getMonth() - acqDate.getMonth()
  const days = transDate.getDate() - acqDate.getDate()
  let totalMonths = years * 12 + months
  if (days < 0) totalMonths--
  return Math.max(0, totalMonths)
}

/** 2026년 양도소득세 기본세율 */
export function getTaxBracket(taxBase: number): { rate: number; progressiveDeduction: number } {
  if (taxBase <= 1400) return { rate: 6, progressiveDeduction: 0 }
  if (taxBase <= 5000) return { rate: 15, progressiveDeduction: 126 }
  if (taxBase <= 8800) return { rate: 24, progressiveDeduction: 576 }
  if (taxBase <= 15000) return { rate: 35, progressiveDeduction: 1544 }
  if (taxBase <= 30000) return { rate: 38, progressiveDeduction: 1994 }
  if (taxBase <= 50000) return { rate: 40, progressiveDeduction: 2594 }
  if (taxBase <= 100000) return { rate: 42, progressiveDeduction: 3594 }
  return { rate: 45, progressiveDeduction: 6594 }
}

/**
 * 장기보유특별공제율 계산
 * - 1세대1주택: 보유 연4%(최대40%) + 거주 연4%(최대40%) = 최대 80%
 * - 일반/토지: 연 2%, 최대 30% (3년부터)
 * - 분양권: 없음
 * - 조정대상 다주택(일반): 배제 (중과유예 중 기본 적용)
 */
function getLongTermDeductionRate(
  propertyType: CGTPropertyType,
  holdingYears: number,
  hasLivedTwoYears: boolean,
  isRegulatedArea: boolean,
  transDate: Date | null,
): number {
  if (propertyType === 'pre-sale') return 0

  // 조정대상지역 다주택 중과 시 장특공제 배제 (중과유예 기간 제외)
  if (propertyType === 'general' && isRegulatedArea) {
    const isSuspended = transDate && isSurchargeSuspended(transDate)
    if (!isSuspended) return 0
  }

  if (holdingYears < 3) return 0

  if (propertyType === 'single-home') {
    const holdingRate = Math.min(holdingYears * 4, 40)
    let livingRate = 0
    if (hasLivedTwoYears) {
      livingRate = Math.min(holdingYears * 4, 40)
    }
    return Math.min(holdingRate + livingRate, 80)
  }

  // 일반, 토지
  return Math.min(holdingYears * 2, 30)
}

/** 다주택 중과유예 기간 판정 (2022.05.10 ~ 2025.05.09) */
function isSurchargeSuspended(transDate: Date): boolean {
  const start = new Date(2022, 4, 10)
  const end = new Date(2025, 4, 9)
  return transDate >= start && transDate <= end
}

/** 1세대1주택 비과세 판정 (12억 기준) */
function calculateTaxExempt(
  transferPrice: number,
  capitalGain: number,
  holdingYears: number,
  isRegulatedArea: boolean,
  hasLivedTwoYears: boolean,
): { taxExemptGain: number; isTaxExempt: boolean } {
  // 2년 미만 보유: 비과세 불가
  if (holdingYears < 2) return { taxExemptGain: 0, isTaxExempt: false }

  // 조정대상지역: 2년 거주 필요
  if (isRegulatedArea && !hasLivedTwoYears) {
    return { taxExemptGain: 0, isTaxExempt: false }
  }

  // 양도가액 12억 이하: 전액 비과세
  if (transferPrice <= 120000) {
    return { taxExemptGain: capitalGain, isTaxExempt: true }
  }

  // 양도가액 12억 초과: 12억 초과분만 과세
  const taxableRatio = (transferPrice - 120000) / transferPrice
  const taxableGain = Math.floor(capitalGain * taxableRatio)
  return { taxExemptGain: capitalGain - taxableGain, isTaxExempt: false }
}

/** 분양권 세율 (보유기간별) */
function getPreSaleTaxRate(holdingMonths: number): { rate: number; isFlat: boolean } {
  if (holdingMonths < 12) return { rate: 70, isFlat: true }
  if (holdingMonths < 24) return { rate: 60, isFlat: true }
  return { rate: 0, isFlat: false } // 기본세율 적용
}

/** 양도소득세 전체 계산 */
export function calculateCapitalGainsTax(input: CapitalGainsTaxInput): CapitalGainsTaxResult {
  const acqDate = parseDate(input.acquisitionDate)
  const transDate = parseDate(input.transferDate)

  let holdingMonths = 0
  let holdingYears = 0
  if (acqDate && transDate && transDate > acqDate) {
    holdingMonths = getHoldingMonths(acqDate, transDate)
    holdingYears = Math.floor(holdingMonths / 12)
  }

  // 공동명의 지분율 적용
  const ratio = input.isJointOwnership ? (input.ownershipRatio / 100) : 1
  const effectiveAcqPrice = Math.floor(input.acquisitionPrice * ratio)
  const effectiveTransPrice = Math.floor(input.transferPrice * ratio)
  const effectiveExpenses = Math.floor(input.expenses * ratio)

  // ① 양도차익
  const capitalGain = Math.max(0, effectiveTransPrice - effectiveAcqPrice - effectiveExpenses)

  // ② 비과세 판정 (1세대1주택)
  let taxExemptGain = 0
  let isTaxExempt = false
  let taxableGain = capitalGain

  if (input.propertyType === 'single-home' && capitalGain > 0) {
    const exempt = calculateTaxExempt(
      effectiveTransPrice, capitalGain, holdingYears,
      input.isRegulatedArea, input.hasLivedTwoYears,
    )
    taxExemptGain = exempt.taxExemptGain
    isTaxExempt = exempt.isTaxExempt
    taxableGain = capitalGain - taxExemptGain
  }

  // 전액 비과세 시 0원 반환
  if (isTaxExempt || taxableGain <= 0) {
    return {
      acquisitionPrice: input.acquisitionPrice,
      transferPrice: input.transferPrice,
      expenses: input.expenses,
      effectiveAcquisitionPrice: effectiveAcqPrice,
      effectiveTransferPrice: effectiveTransPrice,
      effectiveExpenses: effectiveExpenses,
      capitalGain, taxExemptGain, taxableGain: Math.max(0, taxableGain),
      holdingMonths, holdingYears,
      longTermRate: 0, longTermDeduction: 0,
      taxableIncome: 0, basicDeduction: 0, taxBase: 0,
      taxRate: 0, progressiveDeduction: 0, surchargeRate: 0,
      calculatedTax: 0, localTax: 0, totalTaxWon: 0,
      isTaxExempt: isTaxExempt || taxableGain <= 0,
    }
  }

  // ③ 장기보유특별공제
  const longTermRate = getLongTermDeductionRate(
    input.propertyType, holdingYears,
    input.hasLivedTwoYears, input.isRegulatedArea, transDate,
  )
  const longTermDeduction = Math.floor(taxableGain * longTermRate / 100)

  // ④ 양도소득금액
  const taxableIncome = Math.max(0, taxableGain - longTermDeduction)

  // ⑤ 기본공제
  const basicDeduction = input.useBasicDeduction ? Math.min(250, taxableIncome) : 0

  // ⑥ 과세표준
  const taxBase = Math.max(0, taxableIncome - basicDeduction)

  if (taxBase <= 0) {
    return {
      acquisitionPrice: input.acquisitionPrice,
      transferPrice: input.transferPrice,
      expenses: input.expenses,
      effectiveAcquisitionPrice: effectiveAcqPrice,
      effectiveTransferPrice: effectiveTransPrice,
      effectiveExpenses: effectiveExpenses,
      capitalGain, taxExemptGain, taxableGain,
      holdingMonths, holdingYears, longTermRate, longTermDeduction,
      taxableIncome, basicDeduction, taxBase: 0,
      taxRate: 0, progressiveDeduction: 0, surchargeRate: 0,
      calculatedTax: 0, localTax: 0, totalTaxWon: 0,
      isTaxExempt: false,
    }
  }

  // ⑦ 세율 결정 및 산출세액
  let taxRate: number
  let progressiveDeduction: number
  let surchargeRate = 0
  let calculatedTax: number

  if (input.propertyType === 'pre-sale') {
    // 분양권: 보유기간별 단일세율 또는 기본세율
    const preSale = getPreSaleTaxRate(holdingMonths)
    if (preSale.isFlat) {
      taxRate = preSale.rate
      progressiveDeduction = 0
      calculatedTax = Math.floor(taxBase * taxRate / 100)
    } else {
      const bracket = getTaxBracket(taxBase)
      taxRate = bracket.rate
      progressiveDeduction = bracket.progressiveDeduction
      calculatedTax = Math.max(0, Math.floor(taxBase * taxRate / 100 - progressiveDeduction))
    }
  } else if (input.propertyType === 'land' && input.isNonBusinessLand) {
    // 비사업토지: 기본세율 + 10%
    const bracket = getTaxBracket(taxBase)
    taxRate = bracket.rate
    progressiveDeduction = bracket.progressiveDeduction
    surchargeRate = 10
    calculatedTax = Math.max(0, Math.floor(taxBase * (taxRate + surchargeRate) / 100 - progressiveDeduction))
  } else if (input.propertyType === 'general' && input.isRegulatedArea) {
    // 조정대상지역 다주택: 기본세율 + 20% (중과유예 기간 제외)
    const bracket = getTaxBracket(taxBase)
    taxRate = bracket.rate
    progressiveDeduction = bracket.progressiveDeduction
    if (transDate && !isSurchargeSuspended(transDate)) {
      surchargeRate = 20
    }
    calculatedTax = Math.max(0, Math.floor(taxBase * (taxRate + surchargeRate) / 100 - progressiveDeduction))
  } else {
    // 기본세율
    const bracket = getTaxBracket(taxBase)
    taxRate = bracket.rate
    progressiveDeduction = bracket.progressiveDeduction
    calculatedTax = Math.max(0, Math.floor(taxBase * taxRate / 100 - progressiveDeduction))
  }

  // ⑧ 지방소득세 (10%)
  const localTax = Math.floor(calculatedTax * 0.1)

  // ⑨ 총 납부세액 (원)
  const totalTaxWon = (calculatedTax + localTax) * 10000

  return {
    acquisitionPrice: input.acquisitionPrice,
    transferPrice: input.transferPrice,
    expenses: input.expenses,
    effectiveAcquisitionPrice: effectiveAcqPrice,
    effectiveTransferPrice: effectiveTransPrice,
    effectiveExpenses: effectiveExpenses,
    capitalGain, taxExemptGain, taxableGain,
    holdingMonths, holdingYears,
    longTermRate, longTermDeduction,
    taxableIncome, basicDeduction, taxBase,
    taxRate, progressiveDeduction, surchargeRate,
    calculatedTax, localTax, totalTaxWon,
    isTaxExempt: false,
  }
}
