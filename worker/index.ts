import { handleCorsOptions } from './middleware/cors'
import { handleHealthCheck } from './routes/health'
import { handleGetInvestors, handleAnalyzePortfolio } from './routes/portfolio'
import { handleSearchRealEstate } from './routes/realestate'

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)

    // CORS preflight 요청 처리
    if (request.method === 'OPTIONS') {
      return handleCorsOptions()
    }

    // 헬스체크
    if (url.pathname === '/api/health') {
      return handleHealthCheck()
    }

    // 투자자 목록 조회
    if (url.pathname === '/api/portfolio/investors' && request.method === 'GET') {
      return handleGetInvestors()
    }

    // 포트폴리오 분석
    if (url.pathname === '/api/portfolio/analyze' && request.method === 'POST') {
      return handleAnalyzePortfolio(request)
    }

    // 부동산 실거래가 검색
    if (url.pathname === '/api/realestate/search' && request.method === 'POST') {
      return handleSearchRealEstate(request)
    }

    // 404
    return new Response('Not Found', { status: 404 })
  },
}
