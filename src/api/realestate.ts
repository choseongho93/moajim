const API_URL = import.meta.env.DEV ? '/api' : 'https://moajim.com/api'

interface SearchRealEstateParams {
  lawdCd: string // 법정동 코드
  aptName: string // 아파트명
  dong?: string // 동
  floor?: string // 층
}

interface ApartmentTrade {
  aptNm: string
  aptDong?: string
  floor: string
  dealAmount: string
  excluUseAr: string
  dealYear: string
  dealMonth: string
  dealDay: string
  buildYear: string
  jibun: string
}

interface SearchRealEstateResponse {
  success: boolean
  trade: ApartmentTrade | null
  similarTrades: ApartmentTrade[]
}

/**
 * 아파트 실거래가 검색
 */
export async function searchRealEstate(params: SearchRealEstateParams): Promise<SearchRealEstateResponse> {
  const response = await fetch(`${API_URL}/realestate/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 거래금액을 만원 단위 숫자로 변환
 * 예: "123,456" → 123456
 */
export function parseDealAmount(dealAmount: string): number {
  return parseInt(dealAmount.replace(/,/g, '').trim())
}
