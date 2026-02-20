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
  umdNm: string
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
 * 법정동 목록 조회 (D1 데이터베이스)
 */
export async function getDongsByLawdCd(lawdCd: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/regions/dongs?lawdCd=${lawdCd}`, { cache: 'no-store' })

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.statusText}`)
    }

    const data = await response.json()
    return data.success ? data.dongs : []
  } catch (error) {
    console.error('법정동 조회 실패:', error)
    return []
  }
}

/**
 * 아파트 단지 목록 조회 (D1 데이터베이스, 없으면 자동 수집)
 */
export async function getApartmentsByDong(lawdCd: string, dong: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/regions/apartments?lawdCd=${lawdCd}&dong=${encodeURIComponent(dong)}`, { cache: 'no-store' })

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.statusText}`)
    }

    const data = await response.json()
    return data.success ? data.apartments : []
  } catch (error) {
    console.error('아파트 단지 조회 실패:', error)
    return []
  }
}

/**
 * 평형(전용면적) 목록 조회 (D1 데이터베이스, 없으면 자동 수집)
 */
export async function getAreasByApartment(lawdCd: string, dong: string, apt: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/regions/areas?lawdCd=${lawdCd}&dong=${encodeURIComponent(dong)}&apt=${encodeURIComponent(apt)}`, { cache: 'no-store' })

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.statusText}`)
    }

    const data = await response.json()
    return data.success ? data.areas : []
  } catch (error) {
    console.error('평형 조회 실패:', error)
    return []
  }
}

/**
 * 시/도 목록 조회 (D1 데이터베이스)
 */
export async function getCitiesFromAPI(): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/regions/cities`, { cache: 'no-store' })
    if (!response.ok) throw new Error(`API 요청 실패: ${response.statusText}`)
    const data = await response.json()
    return data.success ? data.cities : []
  } catch (error) {
    console.error('시/도 조회 실패:', error)
    return []
  }
}

/**
 * 시/군/구 목록 조회 (D1 데이터베이스)
 */
export async function getDistrictsFromAPI(city: string): Promise<{ district: string; lawdCd: string }[]> {
  try {
    const response = await fetch(`${API_URL}/regions/districts?city=${encodeURIComponent(city)}`, { cache: 'no-store' })
    if (!response.ok) throw new Error(`API 요청 실패: ${response.statusText}`)
    const data = await response.json()
    return data.success ? data.districts : []
  } catch (error) {
    console.error('시/군/구 조회 실패:', error)
    return []
  }
}

/**
 * 거래금액을 만원 단위 숫자로 변환
 * 예: "123,456" → 123456
 */
export function parseDealAmount(dealAmount: string): number {
  return parseInt(dealAmount.replace(/,/g, '').trim())
}
