/**
 * 만원을 간결한 형식으로 변환하는 함수
 * @param manwon 만원 단위 금액
 * @returns 간결한 표시 (예: "4,000만원" 또는 "1.5억원")
 */
export function formatKoreanAmount(manwon: number): string {
  if (manwon === 0) return '0원'

  const eok = Math.floor(manwon / 10000)
  const remainder = manwon % 10000

  // 1억 이상
  if (eok > 0) {
    if (remainder === 0) {
      // 정확히 억 단위 (예: 1억, 2억)
      return `${eok.toLocaleString()}억원`
    } else if (remainder >= 1000) {
      // 억 + 천만 이상 (예: 1.5억, 2.3억)
      const decimal = Math.round((remainder / 10000) * 10) / 10
      return `${eok.toLocaleString()}.${Math.round(decimal * 10)}억원`
    } else {
      // 억 + 천만 미만 (예: 1억 500만원)
      return `${eok.toLocaleString()}억 ${remainder.toLocaleString()}만원`
    }
  }

  // 1억 미만 - 천 단위 구분 쉼표로 표시
  return `${manwon.toLocaleString()}만원`
}

/**
 * 금액을 "만원" 단위로 포맷
 * @param amount 원 단위 금액
 * @returns "1000만원" 형식
 */
export function formatCurrency(amount: number): string {
  return `${(amount / 10000).toFixed(0)}만원`
}

/**
 * 텍스트 내의 숫자+만원 패턴을 찾아서 쉼표 추가
 * @param text 원본 텍스트
 * @returns 쉼표가 추가된 텍스트 (예: "77000만원" → "77,000만원")
 */
export function formatTextWithCommas(text: string): string {
  return text.replace(/(\d+)(만원|억원)/g, (match, number, unit) => {
    return `${parseInt(number).toLocaleString()}${unit}`
  })
}
