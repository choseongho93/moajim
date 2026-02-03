/**
 * 금액을 "만원" 단위로 포맷
 * @param amount 원 단위 금액
 * @returns "1000만원" 형식
 */
export function formatCurrency(amount: number): string {
  return `${(amount / 10000).toFixed(0)}만원`
}
