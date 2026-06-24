/**
 * 보유세(재산세 + 종합부동산세) 계산 유틸리티
 * 2026년 현행법 기준
 */

export interface PropertyInput {
  id: string
  officialPrice: number     // 공시가격 (만원)
  isUrbanArea: boolean      // 도시지역
  isRegulatedArea: boolean  // 조정대상지역
  isJointOwnership: boolean // 공동명의
  ownershipShare: number    // 소유지분 (%) default 50
}

export interface HoldingTaxOptions {
  isCorporation: boolean
  isSingleHomeOwner: boolean
  isOver60: boolean
  ageGroup: 'age60' | 'age65' | 'age70'
  isOver5Years: boolean
  holdingGroup: 'year5' | 'year10' | 'year15'
}

export interface PropertyTaxDetail {
  index: number
  officialPrice: number
  appliedPrice: number
  fmvr: number
  taxBase: number
  propertyTax: number
  localEducationTax: number
  urbanAreaTax: number
  totalPropertyTax: number
}

export interface ComprehensiveTaxDetail {
  totalAppliedPrice: number
  deduction: number
  excessAmount: number
  fmvr: number
  taxBase: number
  grossTax: number
  propertyTaxCredit: number
  assessedTax: number
  ageCreditRate: number
  holdingCreditRate: number
  totalCreditRate: number
  creditAmount: number
  determinedTax: number
  ruralSpecialTax: number
  totalComprehensiveTax: number
  housingCount: number
}

export interface HoldingTaxResult {
  properties: PropertyTaxDetail[]
  totalPropertyTaxSum: number
  totalPropertyTaxBasic: number
  comprehensiveTax: ComprehensiveTaxDetail
  totalHoldingTax: number
}

/** 1세대1주택 공시가격별 재산세 공정시장가액비율 */
function getSingleHomeFMVR(officialPrice: number): number {
  if (officialPrice <= 30000) return 43
  if (officialPrice <= 60000) return 44
  if (officialPrice <= 90000) return 45
  return 60
}

/** 재산세 본세 누진 계산 (만원 단위) */
function calcPropertyBasicTax(taxBase: number, useSingleHomeRate: boolean): number {
  if (useSingleHomeRate) {
    if (taxBase <= 6000) return Math.round(taxBase * 0.0005)
    if (taxBase <= 15000) return Math.round(3 + (taxBase - 6000) * 0.001)
    if (taxBase <= 30000) return Math.round(12 + (taxBase - 15000) * 0.002)
    return Math.round(42 + (taxBase - 30000) * 0.0035)
  }
  if (taxBase <= 6000) return Math.round(taxBase * 0.001)
  if (taxBase <= 15000) return Math.round(6 + (taxBase - 6000) * 0.0015)
  if (taxBase <= 30000) return Math.round(19.5 + (taxBase - 15000) * 0.0025)
  return Math.round(57 + (taxBase - 30000) * 0.004)
}

interface TaxBracket { upper: number; rate: number }

/** 종부세 세율 - 2주택 이하 */
const NORMAL_BRACKETS: TaxBracket[] = [
  { upper: 30000, rate: 0.005 },
  { upper: 60000, rate: 0.007 },
  { upper: 120000, rate: 0.010 },
  { upper: 250000, rate: 0.013 },
  { upper: 500000, rate: 0.015 },
  { upper: 940000, rate: 0.020 },
  { upper: Infinity, rate: 0.027 },
]

/** 종부세 세율 - 3주택 이상 */
const SURTAX_BRACKETS: TaxBracket[] = [
  { upper: 30000, rate: 0.005 },
  { upper: 60000, rate: 0.007 },
  { upper: 120000, rate: 0.010 },
  { upper: 250000, rate: 0.020 },
  { upper: 500000, rate: 0.030 },
  { upper: 940000, rate: 0.040 },
  { upper: Infinity, rate: 0.050 },
]

/** 종부세 누진 세액 계산 */
function calcProgressiveTax(taxBase: number, brackets: TaxBracket[]): number {
  let tax = 0
  let prev = 0
  for (const b of brackets) {
    if (taxBase <= prev) break
    tax += (Math.min(taxBase, b.upper) - prev) * b.rate
    prev = b.upper
  }
  return Math.round(tax)
}

/** 고령자 세액공제율 (%) */
function getAgeCreditRate(ageGroup: string): number {
  if (ageGroup === 'age70') return 40
  if (ageGroup === 'age65') return 30
  return 20
}

/** 장기보유 세액공제율 (%) */
function getHoldingCreditRate(holdingGroup: string): number {
  if (holdingGroup === 'year15') return 50
  if (holdingGroup === 'year10') return 40
  return 20
}

/** 보유세(재산세 + 종부세) 계산 */
export function calculateHoldingTax(
  properties: PropertyInput[],
  options: HoldingTaxOptions,
): HoldingTaxResult {
  const propertyCount = properties.length
  const isSingleHome = options.isSingleHomeOwner && propertyCount === 1 && !options.isCorporation

  // ① 재산세 (물건별)
  const propertyDetails: PropertyTaxDetail[] = properties.map((p, i) => {
    const appliedPrice = p.isJointOwnership
      ? Math.round(p.officialPrice * p.ownershipShare / 100)
      : p.officialPrice

    const fmvr = (isSingleHome && p.officialPrice <= 90000)
      ? getSingleHomeFMVR(p.officialPrice)
      : 60

    const taxBase = Math.round(appliedPrice * fmvr / 100)
    const useSingleHomeRate = isSingleHome && p.officialPrice <= 90000
    const propertyTax = calcPropertyBasicTax(taxBase, useSingleHomeRate)
    const localEducationTax = Math.round(propertyTax * 0.2)
    const urbanAreaTax = p.isUrbanArea ? Math.round(taxBase * 0.0014) : 0

    return {
      index: i,
      officialPrice: p.officialPrice,
      appliedPrice,
      fmvr,
      taxBase,
      propertyTax,
      localEducationTax,
      urbanAreaTax,
      totalPropertyTax: propertyTax + localEducationTax + urbanAreaTax,
    }
  })

  const totalPropertyTaxSum = propertyDetails.reduce((s, d) => s + d.totalPropertyTax, 0)
  const totalPropertyTaxBasic = propertyDetails.reduce((s, d) => s + d.propertyTax, 0)

  // ② 종합부동산세 (인별 합산)
  const totalAppliedPrice = propertyDetails.reduce((s, d) => s + d.appliedPrice, 0)
  const deduction = options.isCorporation ? 0 : (isSingleHome ? 120000 : 90000)
  const excessAmount = Math.max(0, totalAppliedPrice - deduction)
  const compFmvr = 60
  const taxBase = Math.round(excessAmount * compFmvr / 100)

  const useSurtaxRate = propertyCount >= 3 || options.isCorporation
  const brackets = useSurtaxRate ? SURTAX_BRACKETS : NORMAL_BRACKETS
  const grossTax = calcProgressiveTax(taxBase, brackets)

  // 공제할 재산세액 (공제가격 초과분에 해당하는 재산세)
  let propertyTaxCredit = 0
  if (taxBase > 0 && totalAppliedPrice > 0) {
    propertyTaxCredit = Math.round(totalPropertyTaxBasic * excessAmount / totalAppliedPrice)
  }

  const assessedTax = Math.max(0, grossTax - propertyTaxCredit)

  // 세액공제 (1세대1주택 개인만)
  let ageCreditRate = 0
  let holdingCreditRate = 0
  let totalCreditRate = 0
  let creditAmount = 0

  if (isSingleHome && !options.isCorporation && assessedTax > 0) {
    if (options.isOver60) ageCreditRate = getAgeCreditRate(options.ageGroup)
    if (options.isOver5Years) holdingCreditRate = getHoldingCreditRate(options.holdingGroup)
    totalCreditRate = Math.min(ageCreditRate + holdingCreditRate, 80)
    creditAmount = Math.round(assessedTax * totalCreditRate / 100)
  }

  const determinedTax = Math.max(0, assessedTax - creditAmount)
  const ruralSpecialTax = Math.round(determinedTax * 0.2)
  const totalComprehensiveTax = determinedTax + ruralSpecialTax

  return {
    properties: propertyDetails,
    totalPropertyTaxSum,
    totalPropertyTaxBasic,
    comprehensiveTax: {
      totalAppliedPrice,
      deduction,
      excessAmount,
      fmvr: compFmvr,
      taxBase,
      grossTax,
      propertyTaxCredit,
      assessedTax,
      ageCreditRate,
      holdingCreditRate,
      totalCreditRate,
      creditAmount,
      determinedTax,
      ruralSpecialTax,
      totalComprehensiveTax,
      housingCount: propertyCount,
    },
    totalHoldingTax: totalPropertyTaxSum + totalComprehensiveTax,
  }
}
