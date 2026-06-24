/**
 * 보유세(재산세 + 종부세) 시뮬레이션 유틸리티
 *
 * 3가지 시나리오:
 * - current: 2026.03 현행법
 * - past: 2021년 최고점 (문재인 정부)
 * - future: 사용자 커스텀 변수 + 2021년 산식
 */

// ================ Types ================

export type Owner = 'husband' | 'wife'
export type Scenario = 'current' | 'past' | 'future'
export type SurtaxCriteria = 'non-resident' | 'two-or-more' | 'regulated-two' | 'three-or-more'

export interface Asset {
  id: string
  name: string
  owner: Owner
  officialPrice: number    // 공시가격 (만원)
  acquisitionDate: string  // YYYY-MM-DD
  isRegulated: boolean     // 조정지역
  isResiding: boolean      // 실거주
}

export interface FutureSettings {
  realizationRate: number           // 공시 현실화율 (%), default 90
  comprehensiveFMVR: number         // 종부세 공정시장비율 (%), default 100
  multiHomeDeduction: number        // 다주택 공제액 (만), default 50000
  singleHomeTaxCreditLimit: number  // 1주택 세액공제 한도 (%), default 80
}

export interface HouseholdInfo {
  husbandAge: number
  wifeAge: number
  isMarried: boolean
}

export interface PropertyTaxDetail {
  assetName: string
  adjustedPrice: number   // 조정공시가
  taxBase: number         // 재산과표
  basicTax: number        // 재산본세
  educationTax: number    // 지방교육세
  urbanTax: number        // 도시지역분
  totalTax: number        // 재산세합계
  fmvr: number            // 적용 FMVR (%)
  taxRate: number         // 적용 최고 세율 (%)
}

export interface ComprehensiveTaxDetail {
  totalAdjustedPrice: number
  deduction: number
  taxBase: number
  fmvr: number
  taxRate: number
  basicTax: number
  propertyTaxCredit: number
  ageLongTermCredit: number          // 세액공제 비율 (%)
  ageLongTermCreditAmount: number    // 세액공제 금액
  finalTax: number                   // 최종 종부세(농특포함)
  isSurtaxed: boolean
}

export interface ScenarioResult {
  propertyDetails: PropertyTaxDetail[]
  comprehensiveTax: ComprehensiveTaxDetail
  totalPropertyTax: number
  totalComprehensiveTax: number
  totalTax: number
}

export interface PersonResult {
  current: ScenarioResult
  past: ScenarioResult
  future: ScenarioResult
}

export interface HouseholdSummary {
  totalTax: number
  totalPropertyTax: number
  totalComprehensiveTax: number
}

export interface SimulationResult {
  husband: PersonResult
  wife: PersonResult
  household: {
    current: HouseholdSummary
    past: HouseholdSummary
    future: HouseholdSummary
  }
}

// ================ Constants ================

const BASE_REALIZATION_RATE = 0.69
const PAST_REALIZATION_RATE = 0.75
const FUTURE_PROPERTY_TAX_FMVR = 80 // 재산세 미래 FMVR (%)

interface TaxBracket {
  upper: number
  rate: number
}

// 종부세 세율표 - 현행 (2026)
const CURRENT_NORMAL_BRACKETS: TaxBracket[] = [
  { upper: 30000, rate: 0.005 },
  { upper: 60000, rate: 0.007 },
  { upper: 120000, rate: 0.010 },
  { upper: 250000, rate: 0.013 },
  { upper: 500000, rate: 0.015 },
  { upper: 940000, rate: 0.020 },
  { upper: Infinity, rate: 0.027 },
]

const CURRENT_SURTAX_BRACKETS: TaxBracket[] = [
  { upper: 30000, rate: 0.005 },
  { upper: 60000, rate: 0.007 },
  { upper: 120000, rate: 0.010 },
  { upper: 250000, rate: 0.020 },
  { upper: 500000, rate: 0.030 },
  { upper: 940000, rate: 0.040 },
  { upper: Infinity, rate: 0.050 },
]

// 종부세 세율표 - 과거 (2021) / 미래 공통
const PAST_NORMAL_BRACKETS: TaxBracket[] = [
  { upper: 30000, rate: 0.006 },
  { upper: 60000, rate: 0.008 },
  { upper: 120000, rate: 0.012 },
  { upper: 250000, rate: 0.016 },
  { upper: 500000, rate: 0.022 },
  { upper: 940000, rate: 0.030 },
  { upper: Infinity, rate: 0.030 },
]

const PAST_SURTAX_BRACKETS: TaxBracket[] = [
  { upper: 30000, rate: 0.012 },
  { upper: 60000, rate: 0.016 },
  { upper: 120000, rate: 0.022 },
  { upper: 250000, rate: 0.036 },
  { upper: 500000, rate: 0.050 },
  { upper: 940000, rate: 0.060 },
  { upper: Infinity, rate: 0.060 },
]

// ================ Helpers ================

/** 현행 1세대1주택 재산세 FMVR (공시가격 기준) */
function getCurrentSingleHomeFMVR(officialPrice: number): number {
  if (officialPrice <= 30000) return 43
  if (officialPrice <= 60000) return 44
  if (officialPrice <= 90000) return 45
  return 60
}

/** 시나리오별 조정공시가 계산 */
export function getAdjustedPrice(officialPrice: number, scenario: Scenario, futureRate: number): number {
  switch (scenario) {
    case 'current':
      return officialPrice
    case 'past':
      return Math.round(officialPrice / BASE_REALIZATION_RATE * PAST_REALIZATION_RATE)
    case 'future':
      return Math.round(officialPrice / BASE_REALIZATION_RATE * (futureRate / 100))
  }
}

/** 시나리오별 재산세 공정시장가액비율 */
function getPropertyTaxFMVR(
  scenario: Scenario,
  isSingleHome: boolean,
  officialPrice: number,
): number {
  switch (scenario) {
    case 'current':
      if (isSingleHome && officialPrice <= 90000) {
        return getCurrentSingleHomeFMVR(officialPrice)
      }
      return 60
    case 'past':
      return 60
    case 'future':
      return FUTURE_PROPERTY_TAX_FMVR
  }
}

/** 시나리오별 종부세 공정시장가액비율 */
function getComprehensiveTaxFMVR(scenario: Scenario, futureFMVR: number): number {
  switch (scenario) {
    case 'current': return 60
    case 'past': return 95
    case 'future': return futureFMVR
  }
}

/** 시나리오별 종부세 기본공제 */
function getComprehensiveDeduction(
  scenario: Scenario,
  isSingleHome: boolean,
  futureMultiDeduction: number,
): number {
  switch (scenario) {
    case 'current':
      return isSingleHome ? 120000 : 90000
    case 'past':
      return isSingleHome ? 110000 : 60000
    case 'future':
      return isSingleHome ? 110000 : futureMultiDeduction
  }
}

/** 재산세 본세 누진 계산 */
function calculatePropertyBasicTax(
  taxBase: number,
  isSingleHomeSpecial: boolean,
): { tax: number; rate: number } {
  if (isSingleHomeSpecial) {
    // 1세대1주택 특례 (9억 이하)
    if (taxBase <= 6000) return { tax: Math.round(taxBase * 0.0005), rate: 0.05 }
    if (taxBase <= 15000) return { tax: Math.round(3 + (taxBase - 6000) * 0.001), rate: 0.10 }
    if (taxBase <= 30000) return { tax: Math.round(12 + (taxBase - 15000) * 0.002), rate: 0.20 }
    return { tax: Math.round(42 + (taxBase - 30000) * 0.0035), rate: 0.35 }
  } else {
    // 일반
    if (taxBase <= 6000) return { tax: Math.round(taxBase * 0.001), rate: 0.10 }
    if (taxBase <= 15000) return { tax: Math.round(6 + (taxBase - 6000) * 0.0015), rate: 0.15 }
    if (taxBase <= 30000) return { tax: Math.round(19.5 + (taxBase - 15000) * 0.0025), rate: 0.25 }
    return { tax: Math.round(57 + (taxBase - 30000) * 0.004), rate: 0.40 }
  }
}

/** 종부세 누진 계산 */
function calculateProgressiveTax(
  taxBase: number,
  brackets: TaxBracket[],
): { tax: number; rate: number } {
  let tax = 0
  let prevUpper = 0
  let appliedRate = 0

  for (const bracket of brackets) {
    if (taxBase <= prevUpper) break
    const taxable = Math.min(taxBase, bracket.upper) - prevUpper
    tax += taxable * bracket.rate
    appliedRate = bracket.rate
    prevUpper = bracket.upper
  }

  return { tax: Math.round(tax), rate: appliedRate * 100 }
}

/** 종부세 세율표 선택 */
function getComprehensiveBrackets(scenario: Scenario, isSurtaxed: boolean): TaxBracket[] {
  if (scenario === 'current') {
    return isSurtaxed ? CURRENT_SURTAX_BRACKETS : CURRENT_NORMAL_BRACKETS
  }
  return isSurtaxed ? PAST_SURTAX_BRACKETS : PAST_NORMAL_BRACKETS
}

/** 중과 여부 판단 */
function determineSurtax(
  scenario: Scenario,
  personAssets: Asset[],
  allAssets: Asset[],
  isMarried: boolean,
  surtaxCriteria: SurtaxCriteria,
): boolean {
  const relevantAssets = isMarried ? allAssets : personAssets
  const totalCount = relevantAssets.length

  if (scenario === 'current') {
    return totalCount >= 3
  }

  if (scenario === 'past') {
    if (totalCount >= 3) return true
    if (totalCount >= 2 && relevantAssets.some(a => a.isRegulated)) return true
    return false
  }

  // Future
  switch (surtaxCriteria) {
    case 'non-resident':
      return totalCount >= 2 && relevantAssets.some(a => !a.isResiding)
    case 'two-or-more':
      return totalCount >= 2
    case 'regulated-two':
      return totalCount >= 2 && relevantAssets.some(a => a.isRegulated)
    case 'three-or-more':
      return totalCount >= 3
  }
}

/** 고령자 세액공제율 */
function getAgeTaxCredit(age: number): number {
  if (age >= 70) return 40
  if (age >= 65) return 30
  if (age >= 60) return 20
  return 0
}

/** 장기보유 세액공제율 */
function getHoldingYearsCredit(acquisitionDate: string): number {
  const acqDate = new Date(acquisitionDate)
  const now = new Date('2026-03-01')
  const years = (now.getTime() - acqDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)

  if (years >= 15) return 50
  if (years >= 10) return 40
  if (years >= 5) return 20
  return 0
}

// ================ Main Calculation ================

function calculatePersonScenario(
  personAssets: Asset[],
  allAssets: Asset[],
  owner: Owner,
  scenario: Scenario,
  household: HouseholdInfo,
  futureSettings: FutureSettings,
  surtaxCriteria: SurtaxCriteria,
): ScenarioResult {
  const emptyComprehensive: ComprehensiveTaxDetail = {
    totalAdjustedPrice: 0,
    deduction: 0,
    taxBase: 0,
    fmvr: 0,
    taxRate: 0,
    basicTax: 0,
    propertyTaxCredit: 0,
    ageLongTermCredit: 0,
    ageLongTermCreditAmount: 0,
    finalTax: 0,
    isSurtaxed: false,
  }

  if (personAssets.length === 0) {
    return {
      propertyDetails: [],
      comprehensiveTax: emptyComprehensive,
      totalPropertyTax: 0,
      totalComprehensiveTax: 0,
      totalTax: 0,
    }
  }

  const totalHouseholdCount = household.isMarried ? allAssets.length : personAssets.length
  const isSingleHome = totalHouseholdCount === 1

  // 현행법에서만 1주택 특례 적용
  const useSingleHomeSpecialRate = scenario === 'current' && isSingleHome

  // ① 재산세 3단 분리 산출 (물건별)
  const propertyDetails: PropertyTaxDetail[] = personAssets.map(asset => {
    const adjustedPrice = getAdjustedPrice(asset.officialPrice, scenario, futureSettings.realizationRate)
    const fmvr = getPropertyTaxFMVR(scenario, isSingleHome, asset.officialPrice)
    const taxBase = Math.round(adjustedPrice * fmvr / 100)

    const singleHomeSpecial = useSingleHomeSpecialRate && asset.officialPrice <= 90000
    const { tax: basicTax, rate: taxRate } = calculatePropertyBasicTax(taxBase, singleHomeSpecial)

    const educationTax = Math.round(basicTax * 0.20)
    const urbanTax = Math.round(taxBase * 0.0014)

    return {
      assetName: asset.name,
      adjustedPrice,
      taxBase,
      basicTax,
      educationTax,
      urbanTax,
      totalTax: basicTax + educationTax + urbanTax,
      fmvr,
      taxRate,
    }
  })

  const totalPropertyTax = propertyDetails.reduce((sum, d) => sum + d.totalTax, 0)
  const totalBasicTax = propertyDetails.reduce((sum, d) => sum + d.basicTax, 0)

  // ② 종합부동산세 역산 차감 (인별 합산)
  const totalAdjustedPrice = propertyDetails.reduce((sum, d) => sum + d.adjustedPrice, 0)
  const deduction = getComprehensiveDeduction(scenario, isSingleHome, futureSettings.multiHomeDeduction)
  const fmvr = getComprehensiveTaxFMVR(scenario, futureSettings.comprehensiveFMVR)
  const excessAmount = Math.max(0, totalAdjustedPrice - deduction)
  const taxBase = Math.round(excessAmount * fmvr / 100)

  const isSurtaxed = determineSurtax(scenario, personAssets, allAssets, household.isMarried, surtaxCriteria)
  const brackets = getComprehensiveBrackets(scenario, isSurtaxed)
  const { tax: basicCompTax, rate: compTaxRate } = calculateProgressiveTax(taxBase, brackets)

  // 재산세 차감
  let propertyTaxCredit = 0
  if (taxBase > 0 && totalAdjustedPrice > 0) {
    propertyTaxCredit = Math.round(totalBasicTax * excessAmount / totalAdjustedPrice)
  }

  const afterCredit = Math.max(0, basicCompTax - propertyTaxCredit)

  // 세액공제 (1세대1주택 고령+장기보유)
  let ageLongTermCredit = 0
  let ageLongTermCreditAmount = 0
  if (isSingleHome && afterCredit > 0) {
    const age = owner === 'husband' ? household.husbandAge : household.wifeAge
    const ageCredit = getAgeTaxCredit(age)
    const holdingCredit = personAssets.length > 0 ? getHoldingYearsCredit(personAssets[0].acquisitionDate) : 0
    const limit = scenario === 'future' ? futureSettings.singleHomeTaxCreditLimit : 80
    ageLongTermCredit = Math.min(ageCredit + holdingCredit, limit)
    ageLongTermCreditAmount = Math.round(afterCredit * ageLongTermCredit / 100)
  }

  const afterAllCredits = Math.max(0, afterCredit - ageLongTermCreditAmount)
  const finalCompTax = Math.round(afterAllCredits * 1.2) // 농특세 20% 포함

  return {
    propertyDetails,
    comprehensiveTax: {
      totalAdjustedPrice,
      deduction,
      taxBase,
      fmvr,
      taxRate: compTaxRate,
      basicTax: basicCompTax,
      propertyTaxCredit,
      ageLongTermCredit,
      ageLongTermCreditAmount,
      finalTax: finalCompTax,
      isSurtaxed,
    },
    totalPropertyTax,
    totalComprehensiveTax: finalCompTax,
    totalTax: totalPropertyTax + finalCompTax,
  }
}

/** 보유세 시뮬레이션 실행 */
export function runSimulation(
  assets: Asset[],
  household: HouseholdInfo,
  futureSettings: FutureSettings,
  surtaxCriteria: SurtaxCriteria,
): SimulationResult {
  const husbandAssets = assets.filter(a => a.owner === 'husband')
  const wifeAssets = assets.filter(a => a.owner === 'wife')

  const scenarios: Scenario[] = ['current', 'past', 'future']

  const husbandResults = {} as Record<Scenario, ScenarioResult>
  const wifeResults = {} as Record<Scenario, ScenarioResult>

  for (const scenario of scenarios) {
    husbandResults[scenario] = calculatePersonScenario(
      husbandAssets, assets, 'husband', scenario, household, futureSettings, surtaxCriteria,
    )
    wifeResults[scenario] = calculatePersonScenario(
      wifeAssets, assets, 'wife', scenario, household, futureSettings, surtaxCriteria,
    )
  }

  const makeHouseholdSummary = (s: Scenario): HouseholdSummary => ({
    totalTax: husbandResults[s].totalTax + wifeResults[s].totalTax,
    totalPropertyTax: husbandResults[s].totalPropertyTax + wifeResults[s].totalPropertyTax,
    totalComprehensiveTax: husbandResults[s].totalComprehensiveTax + wifeResults[s].totalComprehensiveTax,
  })

  return {
    husband: {
      current: husbandResults.current,
      past: husbandResults.past,
      future: husbandResults.future,
    },
    wife: {
      current: wifeResults.current,
      past: wifeResults.past,
      future: wifeResults.future,
    },
    household: {
      current: makeHouseholdSummary('current'),
      past: makeHouseholdSummary('past'),
      future: makeHouseholdSummary('future'),
    },
  }
}
