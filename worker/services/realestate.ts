// 실거래가 API 서비스
const API_KEY = '3f1f2c2bf9045370f2a379a9f3ff2d1af1fa91cefb44635549ce5a663a66c1d3'
const BASE_URL = 'http://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev'

// 간단한 메모리 캐시 (24시간)
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24시간

interface RealEstateParams {
  lawdCd: string // 법정동 코드 5자리
  dealYmd: string // 계약년월 6자리 (YYYYMM)
}

interface ApartmentTrade {
  aptNm: string // 아파트명
  aptDong?: string // 동
  floor: string // 층
  dealAmount: string // 거래금액
  excluUseAr: string // 전용면적
  dealYear: string
  dealMonth: string
  dealDay: string
  buildYear: string
  jibun: string // 지번
  umdNm: string // 법정동명
}

/**
 * 아파트 실거래가 조회
 */
export async function fetchApartmentTrades(params: RealEstateParams): Promise<ApartmentTrade[]> {
  const cacheKey = `${params.lawdCd}-${params.dealYmd}`

  // 캐시 확인
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Cache hit:', cacheKey)
    return cached.data
  }

  // API 호출
  const url = new URL(`${BASE_URL}/getRTMSDataSvcAptTradeDev`)
  url.searchParams.set('LAWD_CD', params.lawdCd)
  url.searchParams.set('DEAL_YMD', params.dealYmd)
  url.searchParams.set('serviceKey', API_KEY)
  url.searchParams.set('pageNo', '1')
  url.searchParams.set('numOfRows', '999') // 최대한 많이 가져오기

  const response = await fetch(url.toString())
  const text = await response.text()

  // XML 파싱 (간단한 정규식 사용)
  const items = parseXmlItems(text)

  // 캐시 저장
  cache.set(cacheKey, { data: items, timestamp: Date.now() })

  // 오래된 캐시 정리 (메모리 관리)
  cleanupCache()

  return items
}

/**
 * XML 파싱 (간단한 정규식 사용)
 */
function parseXmlItems(xml: string): ApartmentTrade[] {
  const items: ApartmentTrade[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1]

    const item: ApartmentTrade = {
      aptNm: extractTag(itemXml, 'aptNm'),
      aptDong: extractTag(itemXml, 'aptDong') || undefined,
      floor: extractTag(itemXml, 'floor'),
      dealAmount: extractTag(itemXml, 'dealAmount'),
      excluUseAr: extractTag(itemXml, 'excluUseAr'),
      dealYear: extractTag(itemXml, 'dealYear'),
      dealMonth: extractTag(itemXml, 'dealMonth'),
      dealDay: extractTag(itemXml, 'dealDay'),
      buildYear: extractTag(itemXml, 'buildYear'),
      jibun: extractTag(itemXml, 'jibun'),
      umdNm: extractTag(itemXml, 'umdNm'),
    }

    items.push(item)
  }

  return items
}

/**
 * XML 태그에서 값 추출
 */
function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}>([^<]*)<\/${tag}>`)
  const match = xml.match(regex)
  return match ? match[1].trim() : ''
}

/**
 * 오래된 캐시 정리
 */
function cleanupCache() {
  const now = Date.now()
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key)
    }
  }
}

/**
 * 최근 거래가 찾기 (아파트명, 동, 층으로 필터링)
 */
export function findRecentTrade(
  trades: ApartmentTrade[],
  aptName: string,
  dong?: string,
  floor?: string
): ApartmentTrade | null {
  let filtered = trades.filter(t =>
    t.aptNm.includes(aptName) || aptName.includes(t.aptNm)
  )

  // 동 필터
  if (dong && filtered.length > 1) {
    const withDong = filtered.filter(t => t.aptDong === dong)
    if (withDong.length > 0) filtered = withDong
  }

  // 층 필터
  if (floor && filtered.length > 1) {
    const withFloor = filtered.filter(t => t.floor === floor)
    if (withFloor.length > 0) filtered = withFloor
  }

  // 가장 최근 거래
  if (filtered.length > 0) {
    filtered.sort((a, b) => {
      const dateA = parseInt(a.dealYear + a.dealMonth.padStart(2, '0') + a.dealDay.padStart(2, '0'))
      const dateB = parseInt(b.dealYear + b.dealMonth.padStart(2, '0') + b.dealDay.padStart(2, '0'))
      return dateB - dateA
    })
    return filtered[0]
  }

  return null
}
