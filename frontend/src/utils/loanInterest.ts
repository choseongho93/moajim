/**
 * 대출 이자 계산 유틸리티
 *
 * 상환 방식:
 * 1. 만기일시 — 매월 이자만 납부, 만기에 원금 전액 상환
 * 2. 원금균등분할 — 매월 동일 원금 + 잔금 기준 이자 (총 납부액 점차 감소)
 * 3. 원리금균등분할 — 매월 동일 금액 납부 (원금·이자 비율 변동)
 * 4. 체증식분할상환 — 초기 적은 금액, 점차 증가 (보금자리론 등)
 */

export type RepaymentMethod = 'bullet' | 'equal-principal' | 'equal-payment' | 'graduated'

export interface LoanInput {
  principal: number          // 대출 금액 (만원)
  totalMonths: number        // 대출 기간 (개월)
  annualRate: number         // 연 이자율 (%)
  method: RepaymentMethod    // 상환 방식
  graceMonths: number        // 거치 기간 (개월)
}

export interface MonthlyRow {
  month: number              // 회차
  principalPayment: number   // 납입 원금
  interest: number           // 이자
  payment: number            // 월 상환금
  balance: number            // 잔금
}

export interface LoanResult {
  schedule: MonthlyRow[]
  totalPayment: number       // 총 상환금
  totalInterest: number      // 총 이자
  monthlyPaymentFirst: number // 첫 달 상환금
  monthlyPaymentLast: number  // 마지막 달 상환금
}

/** 만기일시 */
function calcBullet(principal: number, monthlyRate: number, totalMonths: number, graceMonths: number): MonthlyRow[] {
  const rows: MonthlyRow[] = []
  let balance = principal

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
function calcEqualPrincipal(principal: number, monthlyRate: number, totalMonths: number, graceMonths: number): MonthlyRow[] {
  const rows: MonthlyRow[] = []
  let balance = principal
  const repayMonths = totalMonths - graceMonths
  const monthlyPrincipal = repayMonths > 0 ? Math.round(principal / repayMonths) : 0

  for (let m = 1; m <= totalMonths; m++) {
    const interest = Math.round(balance * monthlyRate)

    if (m <= graceMonths) {
      // 거치 기간: 이자만
      rows.push({ month: m, principalPayment: 0, interest, payment: interest, balance })
    } else if (m === totalMonths) {
      // 마지막 달: 잔금 전부
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
function calcEqualPayment(principal: number, monthlyRate: number, totalMonths: number, graceMonths: number): MonthlyRow[] {
  const rows: MonthlyRow[] = []
  let balance = principal
  const repayMonths = totalMonths - graceMonths

  // PMT 공식: P × r × (1+r)^n / ((1+r)^n - 1)
  let fixedPayment = 0
  if (repayMonths > 0 && monthlyRate > 0) {
    const factor = Math.pow(1 + monthlyRate, repayMonths)
    fixedPayment = Math.round(principal * monthlyRate * factor / (factor - 1))
  } else if (repayMonths > 0 && monthlyRate === 0) {
    fixedPayment = Math.round(principal / repayMonths)
  }

  for (let m = 1; m <= totalMonths; m++) {
    const interest = Math.round(balance * monthlyRate)

    if (m <= graceMonths) {
      rows.push({ month: m, principalPayment: 0, interest, payment: interest, balance })
    } else if (m === totalMonths) {
      rows.push({ month: m, principalPayment: balance, interest, payment: balance + interest, balance: 0 })
    } else {
      const princ = Math.min(fixedPayment - interest, balance)
      balance -= princ
      rows.push({ month: m, principalPayment: princ, interest, payment: fixedPayment, balance })
    }
  }
  return rows
}

/** 체증식분할상환 — 원금 상환액이 선형으로 증가 */
function calcGraduated(principal: number, monthlyRate: number, totalMonths: number, graceMonths: number): MonthlyRow[] {
  const rows: MonthlyRow[] = []
  let balance = principal
  const repayMonths = totalMonths - graceMonths

  // k번째(1-based) 상환 회차의 원금 = 2P × k / (n(n+1))
  // 합산하면 정확히 P
  for (let m = 1; m <= totalMonths; m++) {
    const interest = Math.round(balance * monthlyRate)

    if (m <= graceMonths) {
      rows.push({ month: m, principalPayment: 0, interest, payment: interest, balance })
    } else {
      const k = m - graceMonths // 상환 회차 (1-based)
      if (m === totalMonths) {
        // 마지막 달: 잔금 전부
        rows.push({ month: m, principalPayment: balance, interest, payment: balance + interest, balance: 0 })
      } else {
        const princ = Math.round(2 * principal * k / (repayMonths * (repayMonths + 1)))
        const actualPrinc = Math.min(princ, balance)
        balance -= actualPrinc
        rows.push({ month: m, principalPayment: actualPrinc, interest, payment: actualPrinc + interest, balance })
      }
    }
  }
  return rows
}

/** 대출 이자 계산 */
export function calculateLoanInterest(input: LoanInput): LoanResult {
  const { principal, totalMonths, annualRate, method, graceMonths } = input
  const monthlyRate = annualRate / 100 / 12

  let schedule: MonthlyRow[]

  switch (method) {
    case 'bullet':
      schedule = calcBullet(principal, monthlyRate, totalMonths, graceMonths)
      break
    case 'equal-principal':
      schedule = calcEqualPrincipal(principal, monthlyRate, totalMonths, graceMonths)
      break
    case 'equal-payment':
      schedule = calcEqualPayment(principal, monthlyRate, totalMonths, graceMonths)
      break
    case 'graduated':
      schedule = calcGraduated(principal, monthlyRate, totalMonths, graceMonths)
      break
  }

  const totalPayment = schedule.reduce((sum, r) => sum + r.payment, 0)
  const totalInterest = schedule.reduce((sum, r) => sum + r.interest, 0)

  return {
    schedule,
    totalPayment,
    totalInterest,
    monthlyPaymentFirst: schedule[0]?.payment ?? 0,
    monthlyPaymentLast: schedule[schedule.length - 1]?.payment ?? 0,
  }
}
