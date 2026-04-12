/**
 * 추정소득(인정소득, 신고소득) 계산 유틸리티
 *
 * 전국은행연합회 "여신심사 선진화를 위한 모범규준"에 따른 소득환산률 적용
 * DTI, DSR 및 대출 한도 계산 시 사용하는 추정소득을 계산합니다.
 */

/** 인정소득 입증 기준 */
export type RecognizedBasis =
  | 'national-pension'     // 국민연금
  | 'health-insurance'     // 건강보험료

/** 신고소득 입증 기준 */
export type DeclaredBasis =
  | 'card-usage'           // 카드사용액
  | 'interest-income'      // 이자소득
  | 'dividend-income'      // 배당소득
  | 'rental-income'        // 임대수입

/** 가입자 유형 */
export type SubscriberType = 'employee' | 'self-employed'  // 직장가입자 / 지역가입자

/** 소득 유형 */
export type IncomeType = 'recognized' | 'declared'  // 인정소득 / 신고소득

export interface EstimatedIncomeInput {
  incomeType: IncomeType
  // 인정소득
  recognizedBasis?: RecognizedBasis
  subscriberType?: SubscriberType
  monthlyPayment?: number       // 월 납부액 (원)
  // 신고소득
  declaredBasis?: DeclaredBasis
  annualAmount?: number         // 연간 금액 (만원)
}

export interface EstimatedIncomeResult {
  annualIncome: number          // 추정 연소득 (만원)
  monthlyIncome: number         // 추정 월소득 (만원)
  conversionRate: number        // 적용 환산률
  description: string           // 계산 설명
}

/**
 * 국민연금 기반 추정소득 계산
 * 월 납부액(원) → 기준소득월액 → 연소득
 *
 * 국민연금 보험료율: 9% (직장가입자는 사업주와 반반 → 본인부담 4.5%)
 * 직장가입자: 기준소득월액 = 월납부액 / 0.045
 * 지역가입자: 기준소득월액 = 월납부액 / 0.09
 */
function calcNationalPension(monthlyPayment: number, subscriberType: SubscriberType): EstimatedIncomeResult {
  const rate = subscriberType === 'employee' ? 0.045 : 0.09
  const monthlyBaseIncome = monthlyPayment / rate  // 원
  const annualIncome = monthlyBaseIncome * 12       // 원
  const annualIncomeMan = Math.round(annualIncome / 10000)  // 만원

  return {
    annualIncome: annualIncomeMan,
    monthlyIncome: Math.round(annualIncomeMan / 12),
    conversionRate: rate * 100,
    description: subscriberType === 'employee'
      ? `국민연금 직장가입자 본인부담률 ${rate * 100}% 적용`
      : `국민연금 지역가입자 보험료율 ${rate * 100}% 적용`,
  }
}

/**
 * 건강보험료 기반 추정소득 계산
 *
 * 2025년 건강보험료율: 7.09% (장기요양보험료 별도)
 * 직장가입자: 본인부담 3.545% (사업주 반반)
 *   보수월액 = 월납부액 / 0.03545
 * 지역가입자: 전액본인부담이나 부과체계가 다름
 *   소득환산: 월납부액 / 0.0709 (지역가입자 환산 기준)
 */
function calcHealthInsurance(monthlyPayment: number, subscriberType: SubscriberType): EstimatedIncomeResult {
  const rate = subscriberType === 'employee' ? 0.03545 : 0.0709
  const monthlyBaseIncome = monthlyPayment / rate
  const annualIncome = monthlyBaseIncome * 12
  const annualIncomeMan = Math.round(annualIncome / 10000)

  return {
    annualIncome: annualIncomeMan,
    monthlyIncome: Math.round(annualIncomeMan / 12),
    conversionRate: rate * 100,
    description: subscriberType === 'employee'
      ? `건강보험 직장가입자 본인부담률 ${rate * 100}% 적용`
      : `건강보험 지역가입자 보험료율 ${rate * 100}% 적용`,
  }
}

/**
 * 신고소득 계산
 *
 * 카드사용액: 연간 카드사용액 / 0.6 (소득환산률 60%)
 *   - 모범규준: 카드사용액은 소득의 약 60%로 추정
 * 이자소득: 연간 이자소득 / 0.04 (소득환산률 4%)
 *   - 모범규준: 이자수익률 약 4% 가정
 * 배당소득: 연간 배당소득 / 0.04 (소득환산률 4%)
 *   - 모범규준: 배당수익률 약 4% 가정
 * 임대수입: 연간 임대수입 / 0.04 (소득환산률 4%)
 *   - 모범규준: 임대수익률 약 4% 가정
 */
function calcDeclaredIncome(declaredBasis: DeclaredBasis, annualAmount: number): EstimatedIncomeResult {
  let conversionRate: number
  let description: string

  switch (declaredBasis) {
    case 'card-usage':
      conversionRate = 0.6
      description = '카드사용액 소득환산률 60% 적용'
      break
    case 'interest-income':
      conversionRate = 0.04
      description = '이자소득 소득환산률 4% 적용'
      break
    case 'dividend-income':
      conversionRate = 0.04
      description = '배당소득 소득환산률 4% 적용'
      break
    case 'rental-income':
      conversionRate = 0.04
      description = '임대수입 소득환산률 4% 적용'
      break
  }

  const annualIncome = Math.round(annualAmount / conversionRate)

  return {
    annualIncome,
    monthlyIncome: Math.round(annualIncome / 12),
    conversionRate: conversionRate * 100,
    description,
  }
}

/** 추정소득 계산 */
export function calculateEstimatedIncome(input: EstimatedIncomeInput): EstimatedIncomeResult {
  if (input.incomeType === 'recognized') {
    const monthlyPayment = input.monthlyPayment || 0
    const subscriberType = input.subscriberType || 'employee'

    if (input.recognizedBasis === 'health-insurance') {
      return calcHealthInsurance(monthlyPayment, subscriberType)
    }
    return calcNationalPension(monthlyPayment, subscriberType)
  }

  // 신고소득
  const declaredBasis = input.declaredBasis || 'card-usage'
  const annualAmount = input.annualAmount || 0
  return calcDeclaredIncome(declaredBasis, annualAmount)
}
