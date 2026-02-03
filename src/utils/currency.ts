/**
 * 만원을 한국어로 변환하는 함수
 * @param manwon 만원 단위 금액
 * @returns 한국어 표시 (예: "1억 5천만원")
 */
export function formatKoreanAmount(manwon: number): string {
  if (manwon === 0) return '0원'

  const eok = Math.floor(manwon / 10000)
  const man = manwon % 10000
  const cheon = Math.floor(man / 1000)
  const baek = Math.floor((man % 1000) / 100)
  const sip = Math.floor((man % 100) / 10)
  const il = man % 10

  let result = ''

  if (eok > 0) {
    if (eok === 1) result += '1억'
    else result += `${eok}억`
  }

  if (cheon > 0) {
    if (result) result += ' '
    if (cheon === 1) result += '1천만'
    else result += `${cheon}천만`
  }

  if (baek > 0) {
    if (result) result += ' '
    if (baek === 1) result += '1백만'
    else result += `${baek}백만`
  }

  if (sip > 0) {
    if (result) result += ' '
    if (sip === 1) result += '10만'
    else result += `${sip * 10}만`
  }

  if (il > 0 || (!eok && !cheon && !baek && !sip)) {
    if (result) result += ' '
    if (il > 0) result += `${il}만`
  }

  return result + '원'
}

/**
 * 금액을 "만원" 단위로 포맷
 * @param amount 원 단위 금액
 * @returns "1000만원" 형식
 */
export function formatCurrency(amount: number): string {
  return `${(amount / 10000).toFixed(0)}만원`
}
