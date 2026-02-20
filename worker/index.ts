import { AutoRouter } from 'itty-router'
import { handleCorsOptions, CORS_HEADERS } from './middleware/cors'
import { handleHealthCheck } from './routes/health'
import { handleGetInvestors, handleAnalyzePortfolio } from './routes/portfolio'
import { handleSearchRealEstate } from './routes/realestate'
import { fetchApartmentTrades } from './services/realestate'
const router = AutoRouter()

// Helper function to get city and district from lawdCd (D1 query)
async function getCityAndDistrict(env: any, lawdCd: string): Promise<{ city: string; district: string } | null> {
  if (!env.DB) return null
  const result = await env.DB.prepare(
    'SELECT DISTINCT city, district FROM dongs WHERE lawd_cd = ? LIMIT 1'
  ).bind(lawdCd).first()
  if (!result) return null
  return { city: (result as any).city, district: (result as any).district }
}

/**
 * 최근 N개월 거래 데이터 가져오기 (캐시 활용)
 */
async function fetchRecentTrades(lawdCd: string, months: number) {
  const now = new Date()
  let allTrades: any[] = []

  for (let i = 0; i < months; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const ym = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`
    try {
      const trades = await fetchApartmentTrades({ lawdCd, dealYmd: ym })
      allTrades = allTrades.concat(trades)
    } catch (error) {
      console.error(`Error fetching ${ym}:`, error)
    }
  }

  return allTrades
}

/**
 * 거래 데이터에서 아파트/평형 정보를 D1에 저장
 */
async function saveApartmentsToD1(env: any, lawdCd: string, location: { city: string; district: string }, trades: any[]) {
  if (!env.DB || trades.length === 0) return

  const apartments = new Map<string, { aptNm: string; umdNm: string }>()
  const areas = new Map<string, { aptNm: string; umdNm: string; area: string }>()

  for (const trade of trades) {
    if (!trade.aptNm || !trade.umdNm) continue

    apartments.set(`${lawdCd}-${trade.umdNm}-${trade.aptNm}`, {
      aptNm: trade.aptNm,
      umdNm: trade.umdNm,
    })

    if (trade.excluUseAr) {
      areas.set(`${lawdCd}-${trade.umdNm}-${trade.aptNm}-${trade.excluUseAr}`, {
        aptNm: trade.aptNm,
        umdNm: trade.umdNm,
        area: trade.excluUseAr,
      })
    }
  }

  for (const apt of apartments.values()) {
    try {
      await env.DB.prepare(
        `INSERT OR REPLACE INTO apartments (lawd_cd, dong_name, apt_name, city, district, created_at)
         VALUES (?, ?, ?, ?, ?, datetime('now', '+9 hours'))`
      ).bind(lawdCd, apt.umdNm, apt.aptNm, location.city, location.district).run()
    } catch (e) { /* ignore */ }
  }

  for (const area of areas.values()) {
    try {
      await env.DB.prepare(
        `INSERT OR IGNORE INTO apartment_areas (lawd_cd, dong_name, apt_name, area, created_at)
         VALUES (?, ?, ?, ?, datetime('now', '+9 hours'))`
      ).bind(lawdCd, area.umdNm, area.aptNm, area.area).run()
    } catch (e) { /* ignore */ }
  }

  console.log(`D1 populated: ${apartments.size} apartments, ${areas.size} areas for ${location.city} ${location.district}`)
}

// CORS preflight
router.options('*', () => handleCorsOptions())

// Health check
router.get('/api/health', () => handleHealthCheck())

// Portfolio routes
router.get('/api/portfolio/investors', () => handleGetInvestors())
router.post('/api/portfolio/analyze', (request) => handleAnalyzePortfolio(request))

// Real estate search
router.post('/api/realestate/search', (request, env) => handleSearchRealEstate(request, env))

// Admin: Get dong count
router.get('/api/admin/dong-count', async (request, env) => {
  try {
    const result = await env.DB.prepare('SELECT COUNT(*) as count FROM dongs').first()

    return new Response(
      JSON.stringify({
        success: true,
        count: result?.count || 0
      }),
      {
        headers: CORS_HEADERS
      }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: CORS_HEADERS
      }
    )
  }
})

// Regions: Get dongs by lawdCd
router.get('/api/regions/dongs', async (request, env) => {
  try {
    const url = new URL(request.url)
    const lawdCd = url.searchParams.get('lawdCd')

    if (!lawdCd) {
      return new Response(
        JSON.stringify({ error: 'lawdCd parameter is required' }),
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const result = await env.DB.prepare(
      `SELECT dong_name, dong_code FROM dongs WHERE lawd_cd = ? ORDER BY dong_name COLLATE NOCASE`
    ).bind(lawdCd).all()

    const dongs = result.results.map((row: any) => row.dong_name)

    return new Response(
      JSON.stringify({
        success: true,
        lawdCd,
        dongs,
        count: dongs.length
      }),
      {
        headers: {
          ...CORS_HEADERS,
          'Cache-Control': 'no-cache'
        }
      }
    )
  } catch (error: any) {
    console.error('Error fetching dongs:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: CORS_HEADERS
      }
    )
  }
})

// Regions: Get apartments by lawdCd and dong (D1, auto-populate from API if empty)
router.get('/api/regions/apartments', async (request, env) => {
  try {
    const url = new URL(request.url)
    const lawdCd = url.searchParams.get('lawdCd')
    const dongName = url.searchParams.get('dong')

    if (!lawdCd || !dongName) {
      return new Response(
        JSON.stringify({ error: 'lawdCd and dong parameters are required' }),
        { status: 400, headers: CORS_HEADERS }
      )
    }

    // 1. D1에서 조회
    let result = await env.DB.prepare(
      `SELECT DISTINCT apt_name FROM apartments
       WHERE lawd_cd = ? AND dong_name = ?
       ORDER BY apt_name COLLATE NOCASE`
    ).bind(lawdCd, dongName).all()

    // 2. D1에 데이터 없으면 정부 API 최근 3개월 조회 후 D1에 저장
    if (result.results.length === 0) {
      const location = await getCityAndDistrict(env, lawdCd)
      if (location) {
        const trades = await fetchRecentTrades(lawdCd, 3)
        await saveApartmentsToD1(env, lawdCd, location, trades)

        // D1 다시 조회
        result = await env.DB.prepare(
          `SELECT DISTINCT apt_name FROM apartments
           WHERE lawd_cd = ? AND dong_name = ?
           ORDER BY apt_name COLLATE NOCASE`
        ).bind(lawdCd, dongName).all()
      }
    }

    const apartments = result.results.map((row: any) => row.apt_name)

    return new Response(
      JSON.stringify({
        success: true,
        lawdCd,
        dongName,
        apartments,
        count: apartments.length
      }),
      {
        headers: {
          ...CORS_HEADERS,
          'Cache-Control': 'no-cache'
        }
      }
    )
  } catch (error: any) {
    console.error('Error fetching apartments:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: CORS_HEADERS
      }
    )
  }
})

// Regions: Get areas (평형) by lawdCd, dong, and apartment (D1, auto-populate from API if empty)
router.get('/api/regions/areas', async (request, env) => {
  try {
    const url = new URL(request.url)
    const lawdCd = url.searchParams.get('lawdCd')
    const dongName = url.searchParams.get('dong')
    const aptName = url.searchParams.get('apt')

    if (!lawdCd || !dongName || !aptName) {
      return new Response(
        JSON.stringify({ error: 'lawdCd, dong, and apt parameters are required' }),
        { status: 400, headers: CORS_HEADERS }
      )
    }

    // 1. D1에서 조회
    let result = await env.DB.prepare(
      `SELECT DISTINCT area FROM apartment_areas
       WHERE lawd_cd = ? AND dong_name = ? AND apt_name = ?
       ORDER BY CAST(area AS REAL)`
    ).bind(lawdCd, dongName, aptName).all()

    // 2. D1에 데이터 없으면 정부 API 최근 3개월 조회 후 D1에 저장
    if (result.results.length === 0) {
      const location = await getCityAndDistrict(env, lawdCd)
      if (location) {
        const trades = await fetchRecentTrades(lawdCd, 3)
        await saveApartmentsToD1(env, lawdCd, location, trades)

        // D1 다시 조회
        result = await env.DB.prepare(
          `SELECT DISTINCT area FROM apartment_areas
           WHERE lawd_cd = ? AND dong_name = ? AND apt_name = ?
           ORDER BY CAST(area AS REAL)`
        ).bind(lawdCd, dongName, aptName).all()
      }
    }

    const areas = result.results.map((row: any) => row.area)

    return new Response(
      JSON.stringify({
        success: true,
        lawdCd,
        dongName,
        aptName,
        areas,
        count: areas.length
      }),
      {
        headers: {
          ...CORS_HEADERS,
          'Cache-Control': 'no-cache'
        }
      }
    )
  } catch (error: any) {
    console.error('Error fetching areas:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: CORS_HEADERS
      }
    )
  }
})

// Regions: Get cities list (from D1)
router.get('/api/regions/cities', async (request, env) => {
  try {
    const result = await env.DB.prepare(
      `SELECT DISTINCT city FROM dongs ORDER BY city`
    ).all()

    const cities = result.results.map((row: any) => row.city)

    return new Response(
      JSON.stringify({
        success: true,
        cities,
        count: cities.length
      }),
      {
        headers: {
          ...CORS_HEADERS,
          'Cache-Control': 'no-cache'
        }
      }
    )
  } catch (error: any) {
    console.error('Error fetching cities:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: CORS_HEADERS }
    )
  }
})

// Regions: Get districts by city (from D1)
router.get('/api/regions/districts', async (request, env) => {
  try {
    const url = new URL(request.url)
    const city = url.searchParams.get('city')

    if (!city) {
      return new Response(
        JSON.stringify({ error: 'city parameter is required' }),
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const result = await env.DB.prepare(
      `SELECT DISTINCT district, lawd_cd FROM dongs WHERE city = ? ORDER BY district`
    ).bind(city).all()

    const districts = result.results.map((row: any) => ({
      district: row.district,
      lawdCd: row.lawd_cd
    }))

    return new Response(
      JSON.stringify({
        success: true,
        city,
        districts,
        count: districts.length
      }),
      {
        headers: {
          ...CORS_HEADERS,
          'Cache-Control': 'no-cache'
        }
      }
    )
  } catch (error: any) {
    console.error('Error fetching districts:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: CORS_HEADERS }
    )
  }
})

// 404
router.all('*', () => new Response('Not Found', { status: 404 }))

export default router
