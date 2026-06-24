import { CORS_HEADERS } from '../middleware/cors'
import { fetchApartmentTrades, findRecentTrade } from '../services/realestate'

interface SearchRequest {
  lawdCd: string // 법정동 코드 5자리
  dealYmd?: string // 계약년월 (기본: 최근 3개월)
  aptName: string // 아파트명
  dong?: string // 동
  floor?: string // 층
}

// 시/군/구 코드에서 시/도명과 시/군/구명 찾기 (D1 query)
async function getCityAndDistrict(env: any, lawdCd: string): Promise<{ city: string; district: string } | null> {
  if (!env.DB) return null
  const result = await env.DB.prepare(
    'SELECT DISTINCT city, district FROM dongs WHERE lawd_cd = ? LIMIT 1'
  ).bind(lawdCd).first()
  if (!result) return null
  return { city: (result as any).city, district: (result as any).district }
}

/**
 * 아파트 데이터를 D1에 UPSERT
 */
async function upsertApartments(env: any, lawdCd: string, trades: any[]) {
  if (!env.DB || trades.length === 0) return

  const location = await getCityAndDistrict(env, lawdCd)
  if (!location) return

  // 고유한 아파트-법정동 조합 추출
  const apartments = new Map<string, { aptNm: string; umdNm: string }>()
  const apartmentAreas = new Map<string, { aptNm: string; umdNm: string; area: string }>()

  for (const trade of trades) {
    if (trade.aptNm && trade.umdNm) {
      // 아파트 정보
      const aptKey = `${lawdCd}-${trade.umdNm}-${trade.aptNm}`
      apartments.set(aptKey, {
        aptNm: trade.aptNm,
        umdNm: trade.umdNm
      })

      // 평형(전용면적) 정보
      if (trade.excluUseAr) {
        const areaKey = `${lawdCd}-${trade.umdNm}-${trade.aptNm}-${trade.excluUseAr}`
        apartmentAreas.set(areaKey, {
          aptNm: trade.aptNm,
          umdNm: trade.umdNm,
          area: trade.excluUseAr
        })
      }
    }
  }

  // 아파트 UPSERT
  for (const apt of apartments.values()) {
    try {
      await env.DB.prepare(
        `INSERT OR REPLACE INTO apartments (lawd_cd, dong_name, apt_name, city, district, created_at)
         VALUES (?, ?, ?, ?, ?, datetime('now', '+9 hours'))`
      ).bind(lawdCd, apt.umdNm, apt.aptNm, location.city, location.district).run()
    } catch (error) {
      console.error('아파트 UPSERT 실패:', error)
    }
  }

  // 평형 UPSERT
  for (const area of apartmentAreas.values()) {
    try {
      await env.DB.prepare(
        `INSERT OR IGNORE INTO apartment_areas (lawd_cd, dong_name, apt_name, area, created_at)
         VALUES (?, ?, ?, ?, datetime('now', '+9 hours'))`
      ).bind(lawdCd, area.umdNm, area.aptNm, area.area).run()
    } catch (error) {
      console.error('평형 UPSERT 실패:', error)
    }
  }

  console.log(`✅ ${apartments.size}개 아파트, ${apartmentAreas.size}개 평형 정보 업데이트: ${location.city} ${location.district}`)
}

/**
 * 아파트 실거래가 검색
 */
export async function handleSearchRealEstate(request: Request, env: any): Promise<Response> {
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

    // 기본값: 최근 6개월
    const dealYmds = body.dealYmd ? [body.dealYmd] : getRecentMonths(6)

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

    // 🔥 아파트 정보를 D1에 자동 저장 (비동기, 응답 속도에 영향 없음)
    if (allTrades.length > 0) {
      upsertApartments(env, body.lawdCd, allTrades).catch(err =>
        console.error('아파트 저장 실패:', err)
      )
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
