import { INVESTORS } from '../data/investors'
import { analyzePortfolio } from '../services/portfolioService'
import { jsonResponse } from '../middleware/cors'

/**
 * 투자자 목록 조회
 */
export function handleGetInvestors(): Response {
  return jsonResponse({
    investors: Object.values(INVESTORS),
  })
}

/**
 * 포트폴리오 분석
 */
export async function handleAnalyzePortfolio(request: Request): Promise<Response> {
  try {
    const body = await request.json()
    const { assets, investorId, userProfile } = body

    // 입력 검증
    if (!assets || !investorId) {
      return jsonResponse(
        { error: 'Missing required fields: assets, investorId' },
        400
      )
    }

    // 포트폴리오 분석 수행
    const analysis = analyzePortfolio(assets, investorId)

    if ('error' in analysis) {
      return jsonResponse(analysis, 400)
    }

    // DB 저장 시뮬레이션 (실제로는 D1이나 KV에 저장)
    const analysisId = `analysis_${Date.now()}`

    return jsonResponse({
      id: analysisId,
      ...analysis,
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    return jsonResponse({ error: 'Invalid request body' }, 400)
  }
}
