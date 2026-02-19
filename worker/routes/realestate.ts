import { CORS_HEADERS } from '../middleware/cors'
import { fetchApartmentTrades, findRecentTrade } from '../services/realestate'

interface SearchRequest {
  lawdCd: string // 법정동 코드 5자리
  dealYmd?: string // 계약년월 (기본: 최근 3개월)
  aptName: string // 아파트명
  dong?: string // 동
  floor?: string // 층
}

/**
 * 아파트 실거래가 검색
 */
export async function handleSearchRealEstate(request: Request): Promise<Response> {
  try {
    const body = await request.json() as SearchRequest

    // 유효성 검사
    if (!body.lawdCd) {
      return new Response(
        JSON.stringify({ error: 'lawdCd는 필수입니다' }),
        {
          status: 400,
          headers: CORS_HEADERS,
        }
      )
    }

    // 기본값: 최근 5년 (60개월)
    const dealYmds = body.dealYmd ? [body.dealYmd] : getRecentMonths(60)

    let bestMatch = null
    let allTrades: any[] = []

    // 최근 5년 데이터 조회
    for (const ym of dealYmds) {
      try {
        const trades = await fetchApartmentTrades({
          lawdCd: body.lawdCd,
          dealYmd: ym,
        })

        allTrades = allTrades.concat(trades)

        // aptName이 제공된 경우에만 최근 거래 찾기
        if (body.aptName) {
          const match = findRecentTrade(trades, body.aptName, body.dong, body.floor)
          if (match && !bestMatch) {
            bestMatch = match
          }
        }
      } catch (error) {
        console.error(`Error fetching ${ym}:`, error)
      }
    }

    // aptName이 제공된 경우에만 정확한 매치 시도
    if (body.aptName && !bestMatch && allTrades.length > 0) {
      // 정확한 매치가 없으면 아파트명만으로 필터링
      const filtered = allTrades.filter(t =>
        t.aptNm.includes(body.aptName) || body.aptName.includes(t.aptNm)
      )
      if (filtered.length > 0) {
        bestMatch = filtered[0]
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        trade: bestMatch,
        similarTrades: body.aptName
          ? allTrades
              .filter(t => t.aptNm.includes(body.aptName) || body.aptName.includes(t.aptNm))
              .slice(0, 10)
          : allTrades, // aptName이 없으면 전체 반환
      }),
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    )
  } catch (error: any) {
    console.error('Search error:', error)
    return new Response(
      JSON.stringify({ error: error.message || '알 수 없는 오류' }),
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    )
  }
}

/**
 * 최근 N개월의 YYYYMM 배열 반환
 */
function getRecentMonths(count: number): string[] {
  const result: string[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    result.push(`${year}${month}`)
  }

  return result
}
