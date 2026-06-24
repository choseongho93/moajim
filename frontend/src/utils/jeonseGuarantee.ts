/**
 * 전세금반환보증보험 계산 유틸리티
 *
 * 3대 보증기관:
 * 1. HUG (주택도시보증공사) - 전세보증금반환보증
 * 2. HF (한국주택금융공사) - 전세지킴보증 (전세보증금반환보증)
 * 3. SGI (서울보증) - 전세금보장신용보험
 */

/** 보증료 우대 대상 */
export type DiscountType =
  | 'none'              // 해당없음
  | 'newlywed'          // 신혼부부 (결혼 7년 이내)
  | 'multi-child'       // 다자녀 (2자녀 이상)
  | 'single-parent'     // 한부모가정
  | 'disabled'          // 장애인
  | 'basic-livelihood'  // 기초생활수급자
  | 'elderly'           // 만 65세 이상

export interface JeonseGuaranteeInput {
  deposit: number            // 전세보증금 (만원)
  marketPrice: number        // 매매 시세 (만원)
  priorClaims: number        // 선순위채권 (만원)
  applicationDate: string    // 신청일자 (YYYYMMDD)
  contractStart: string      // 계약시작일 (YYYYMMDD)
  contractEnd: string        // 계약종료일 (YYYYMMDD)
  discountType: DiscountType // 우대 대상
}

export interface GuaranteeResult {
  institution: string        // 보증기관명
  productName: string        // 상품명
  eligible: boolean          // 가입 가능 여부
  reason: string             // 불가 사유 또는 가입 가능 안내
  debtRatio: number          // 부채비율 (%)
  maxDebtRatio: number       // 허용 부채비율 (%)
  guaranteeAmount: number    // 보증금액 (만원)
  guaranteeDays: number      // 보증일수
  baseRate: number           // 기본 보증료율 (연, %)
  discountRate: number       // 할인 후 보증료율 (연, %)
  guaranteeFee: number       // 보증료 (원)
}

export interface JeonseGuaranteeResult {
  hug: GuaranteeResult
  hf: GuaranteeResult
  sgi: GuaranteeResult
  debtRatio: number          // 공통 부채비율 (%)
}

/** 날짜 문자열(YYYYMMDD)을 Date로 변환 */
function parseDate(s: string): Date {
  const y = parseInt(s.substring(0, 4))
  const m = parseInt(s.substring(4, 6)) - 1
  const d = parseInt(s.substring(6, 8))
  return new Date(y, m, d)
}

/** 두 날짜 사이의 일수 */
function daysBetween(a: Date, b: Date): number {
  const diff = b.getTime() - a.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/** 부채비율 계산: (선순위채권 + 전세보증금) / 매매시세 × 100 */
function calcDebtRatio(deposit: number, priorClaims: number, marketPrice: number): number {
  if (marketPrice <= 0) return 999
  return (priorClaims + deposit) / marketPrice * 100
}

/** 보증일수 계산: 신청일 ~ 계약종료일 (신청일이 계약시작 전이면 계약시작일부터) */
function calcGuaranteeDays(applicationDate: string, contractStart: string, contractEnd: string): number {
  const appDate = parseDate(applicationDate)
  const startDate = parseDate(contractStart)
  const endDate = parseDate(contractEnd)
  const effectiveStart = appDate > startDate ? appDate : startDate
  return Math.max(daysBetween(effectiveStart, endDate), 0)
}

/** 보증료 계산: 보증금액(만원) × 보증료율(%) / 100 × 보증일수 / 365 → 원 */
function calcFee(guaranteeAmount: number, rate: number, days: number): number {
  return Math.round(guaranteeAmount * 10000 * (rate / 100) * (days / 365))
}

/**
 * HUG (주택도시보증공사) 전세보증금반환보증
 * - 부채비율 한도: 100% (선순위 + 전세보증금 ≤ 매매시세)
 * - 전세보증금 한도: 수도권 7억, 그 외 5억 (여기서는 7억으로 통일 - 보수적)
 * - 기본 보증료율: 연 0.115%
 * - 우대: 신혼부부·다자녀·한부모·장애인 등 → 연 0.092% (20% 할인)
 * - 잔여 계약기간 1개월(30일) 이상 ~ 계약종료 전까지 가입 가능
 */
function calcHUG(input: JeonseGuaranteeInput, debtRatio: number, days: number): GuaranteeResult {
  const maxDebtRatio = 100
  const eligible = debtRatio <= maxDebtRatio && input.deposit <= 70000
  const baseRate = 0.115
  const hasDiscount = input.discountType !== 'none'
  const discountRate = hasDiscount ? 0.092 : baseRate
  const guaranteeAmount = input.deposit

  let reason = ''
  if (!eligible) {
    if (debtRatio > maxDebtRatio) reason = `부채비율 ${debtRatio.toFixed(1)}%가 한도(${maxDebtRatio}%)를 초과합니다`
    else if (input.deposit > 70000) reason = '전세보증금이 7억원을 초과합니다'
  } else {
    reason = '가입 가능'
  }

  return {
    institution: 'HUG (주택도시보증공사)',
    productName: '전세보증금반환보증',
    eligible,
    reason,
    debtRatio,
    maxDebtRatio,
    guaranteeAmount,
    guaranteeDays: days,
    baseRate,
    discountRate,
    guaranteeFee: eligible ? calcFee(guaranteeAmount, discountRate, days) : 0,
  }
}

/**
 * HF (한국주택금융공사) 전세지킴보증
 * - 부채비율 한도: 100%
 * - 전세보증금 한도: 수도권 7억, 그 외 5억 (7억으로 통일)
 * - 기본 보증료율: 연 0.128%
 * - 우대: 신혼부부·다자녀 등 → 연 0.102% (약 20% 할인)
 */
function calcHF(input: JeonseGuaranteeInput, debtRatio: number, days: number): GuaranteeResult {
  const maxDebtRatio = 100
  const eligible = debtRatio <= maxDebtRatio && input.deposit <= 70000
  const baseRate = 0.128
  const hasDiscount = input.discountType !== 'none'
  const discountRate = hasDiscount ? 0.102 : baseRate
  const guaranteeAmount = input.deposit

  let reason = ''
  if (!eligible) {
    if (debtRatio > maxDebtRatio) reason = `부채비율 ${debtRatio.toFixed(1)}%가 한도(${maxDebtRatio}%)를 초과합니다`
    else if (input.deposit > 70000) reason = '전세보증금이 7억원을 초과합니다'
  } else {
    reason = '가입 가능'
  }

  return {
    institution: 'HF (한국주택금융공사)',
    productName: '전세지킴보증 (전세보증금반환보증)',
    eligible,
    reason,
    debtRatio,
    maxDebtRatio,
    guaranteeAmount,
    guaranteeDays: days,
    baseRate,
    discountRate,
    guaranteeFee: eligible ? calcFee(guaranteeAmount, discountRate, days) : 0,
  }
}

/**
 * SGI (서울보증) 전세금보장신용보험
 * - 부채비율 한도: 100%
 * - 전세보증금 한도: 제한 없음 (실무상 고액도 가능)
 * - 기본 보증료율: 연 0.183%
 * - 우대 할인 없음 (SGI는 일반적으로 우대 없음)
 * - 부채비율이 높아도 상대적으로 가입 가능 범위가 넓음
 */
function calcSGI(input: JeonseGuaranteeInput, debtRatio: number, days: number): GuaranteeResult {
  const maxDebtRatio = 100
  const eligible = debtRatio <= maxDebtRatio
  const baseRate = 0.183
  const discountRate = baseRate  // SGI는 우대 없음
  const guaranteeAmount = input.deposit

  let reason = ''
  if (!eligible) {
    reason = `부채비율 ${debtRatio.toFixed(1)}%가 한도(${maxDebtRatio}%)를 초과합니다`
  } else {
    reason = '가입 가능'
  }

  return {
    institution: 'SGI (서울보증)',
    productName: '전세금보장신용보험',
    eligible,
    reason,
    debtRatio,
    maxDebtRatio,
    guaranteeAmount,
    guaranteeDays: days,
    baseRate,
    discountRate,
    guaranteeFee: eligible ? calcFee(guaranteeAmount, discountRate, days) : 0,
  }
}

/** 전세금반환보증보험 계산 */
export function calculateJeonseGuarantee(input: JeonseGuaranteeInput): JeonseGuaranteeResult {
  const debtRatio = calcDebtRatio(input.deposit, input.priorClaims, input.marketPrice)
  const days = calcGuaranteeDays(input.applicationDate, input.contractStart, input.contractEnd)

  return {
    hug: calcHUG(input, debtRatio, days),
    hf: calcHF(input, debtRatio, days),
    sgi: calcSGI(input, debtRatio, days),
    debtRatio,
  }
}
