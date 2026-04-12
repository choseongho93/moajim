/**
 * 대출 대환(이자 비교) 계산 유틸리티
 *
 * 기존 대출과 변경(대환) 대출의 이자를 비교합니다.
 * 대환 대출 금액이 기존보다 작으면 일부 대환으로 봅니다.
 *
 * 상환 방식:
 * 1. bullet(만기일시) — 매월 이자만 납부, 만기에 원금 전액 상환
 * 2. equal-principal(원금균등분할) — 매월 동일 원금 + 잔금 기준 이자
 * 3. equal-payment(원리금균등분할) — 매월 동일 금액 납부
 * 4. graduated(체증식분할상환) — 상환액 점차 증가
 */

export type RefinanceRepaymentMethod = 'bullet' | 'equal-principal' | 'equal-payment' | 'graduated'

export interface RefinanceLoanInput {
  principal: number           // 대출 금액 (만원)
  totalMonths: number         // 대출 기간 (개월)
  annualRate: number          // 연 이자율 (%)
  method: RefinanceRepaymentMethod
}

export interface RefinanceMonthlyRow {
  month: number
  principalPayment: number    // 납입 원금
  interest: number            // 이자
  payment: number             // 월 상환금
  balance: number             // 잔금
}

export interface RefinanceLoanResult {
  schedule: RefinanceMonthlyRow[]
  totalPayment: number        // 총 상환금
  totalInterest: number       // 총 이자
  monthlyFirst: number        // 첫 달 상환금
  monthlyLast: number         // 마지막 달 상환금
  annualInterest: number      // 연간 이자 (첫 해 기준)
}

export interface RefinanceCompareResult {
  original: RefinanceLoanResult
  refinanced: RefinanceLoanResult
  // 일부 대환인 경우 기존 대출 잔여분
  remaining: RefinanceLoanResult | null
  // 대환 후 합산 (refinanced + remaining)
  totalAfter: {
    totalPayment: number
    totalInterest: number
    annualInterest: number      // 연간 이자 (첫 해 기준)
  }
  interestDiff: number          // 총 이자 차이 (음수 = 절약)
  annualInterestDiff: number    // 연간 이자 차이 (음수 = 절약)
  isPartial: boolean            // 일부 대환 여부
}

/** 만기일시 */
function calcBullet(principal: number, monthlyRate: number, totalMonths: number): RefinanceMonthlyRow[] {
  const rows: RefinanceMonthlyRow[] = []
  const balance = principal
  for (let m = 1; m <= totalMonths; m++) {
    const interest = Math.round(balance * monthlyRate)
    if (m === totalMonths) {
      rows.push({ month: m, principalPayment: principal, interest, payment: principal + interest, balance: 0 })
    } else {
      rows.push({ month: m, principalPayment: 0, interest, payment: interest, balance })
    }
  }
  return rows
}

/** 원금균등분할 */
function calcEqualPrincipal(principal: number, monthlyRate: number, totalMonths: number): RefinanceMonthlyRow[] {
  const rows: RefinanceMonthlyRow[] = []
  let balance = principal
  const monthlyPrincipal = totalMonths > 0 ? Math.round(principal / totalMonths) : 0
  for (let m = 1; m <= totalMonths; m++) {
    const interest = Math.round(balance * monthlyRate)
    if (m === totalMonths) {
      rows.push({ month: m, principalPayment: balance, interest, payment: balance + interest, balance: 0 })
    } else {
      const princ = Math.min(monthlyPrincipal, balance)
      balance -= princ
      rows.push({ month: m, principalPayment: princ, interest, payment: princ + interest, balance })
    }
  }
  return rows
}

/** 원리금균등분할 */
function calcEqualPayment(principal: number, monthlyRate: number, totalMonths: number): RefinanceMonthlyRow[] {
  const rows: RefinanceMonthlyRow[] = []
  let balance = principal

  let fixedPayment = 0
  if (totalMonths > 0 && monthlyRate > 0) {
    const factor = Math.pow(1 + monthlyRate, totalMonths)
    fixedPayment = Math.round(principal * monthlyRate * factor / (factor - 1))
  } else if (totalMonths > 0 && monthlyRate === 0) {
    fixedPayment = Math.round(principal / totalMonths)
  }

  for (let m = 1; m <= totalMonths; m++) {
    const interest = Math.round(balance * monthlyRate)
    if (m === totalMonths) {
      rows.push({ month: m, principalPayment: balance, interest, payment: balance + interest, balance: 0 })
    } else {
      const princ = Math.min(fixedPayment - interest, balance)
      balance -= princ
      rows.push({ month: m, principalPayment: princ, interest, payment: fixedPayment, balance })
    }
  }
  return rows
}

/** 체증식분할상환 */
function calcGraduated(principal: number, monthlyRate: number, totalMonths: number): RefinanceMonthlyRow[] {
  const rows: RefinanceMonthlyRow[] = []
  let balance = principal
  for (let m = 1; m <= totalMonths; m++) {
    const interest = Math.round(balance * monthlyRate)
    if (m === totalMonths) {
      rows.push({ month: m, principalPayment: balance, interest, payment: balance + interest, balance: 0 })
    } else {
      const princ = Math.round(2 * principal * m / (totalMonths * (totalMonths + 1)))
      const actualPrinc = Math.min(princ, balance)
      balance -= actualPrinc
      rows.push({ month: m, principalPayment: actualPrinc, interest, payment: actualPrinc + interest, balance })
    }
  }
  return rows
}

function calcLoan(input: RefinanceLoanInput): RefinanceLoanResult {
  const { principal, totalMonths, annualRate, method } = input
  const monthlyRate = annualRate / 100 / 12

  let schedule: RefinanceMonthlyRow[]
  switch (method) {
    case 'bullet':
      schedule = calcBullet(principal, monthlyRate, totalMonths)
      break
    case 'equal-principal':
      schedule = calcEqualPrincipal(principal, monthlyRate, totalMonths)
      break
    case 'equal-payment':
      schedule = calcEqualPayment(principal, monthlyRate, totalMonths)
      break
    case 'graduated':
      schedule = calcGraduated(principal, monthlyRate, totalMonths)
      break
  }

  const totalPayment = schedule.reduce((s, r) => s + r.payment, 0)
  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0)
  // 첫 해 이자 (최대 12개월)
  const firstYearMonths = Math.min(12, schedule.length)
  const annualInterest = schedule.slice(0, firstYearMonths).reduce((s, r) => s + r.interest, 0)

  return {
    schedule,
    totalPayment,
    totalInterest,
    monthlyFirst: schedule[0]?.payment ?? 0,
    monthlyLast: schedule[schedule.length - 1]?.payment ?? 0,
    annualInterest,
  }
}

/** 대출 대환 비교 계산 */
export function calculateLoanRefinance(
  original: RefinanceLoanInput,
  refinanced: RefinanceLoanInput,
  originalMethod: RefinanceRepaymentMethod,
  refinancedMethod: RefinanceRepaymentMethod,
): RefinanceCompareResult {
  const origResult = calcLoan({ ...original, method: originalMethod })
  const refiResult = calcLoan({ ...refinanced, method: refinancedMethod })

  const isPartial = refinanced.principal < original.principal

  let remaining: RefinanceLoanResult | null = null
  if (isPartial) {
    const remainingPrincipal = original.principal - refinanced.principal
    remaining = calcLoan({
      principal: remainingPrincipal,
      totalMonths: original.totalMonths,
      annualRate: original.annualRate,
      method: originalMethod,
    })
  }

  const totalAfterPayment = refiResult.totalPayment + (remaining?.totalPayment ?? 0)
  const totalAfterInterest = refiResult.totalInterest + (remaining?.totalInterest ?? 0)
  const totalAfterAnnual = refiResult.annualInterest + (remaining?.annualInterest ?? 0)

  return {
    original: origResult,
    refinanced: refiResult,
    remaining,
    totalAfter: {
      totalPayment: totalAfterPayment,
      totalInterest: totalAfterInterest,
      annualInterest: totalAfterAnnual,
    },
    interestDiff: totalAfterInterest - origResult.totalInterest,
    annualInterestDiff: totalAfterAnnual - origResult.annualInterest,
    isPartial,
  }
}
