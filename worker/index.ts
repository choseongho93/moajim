// 투자자 프로필 정의
const INVESTORS = {
  "warren-buffett": {
    id: "warren-buffett",
    name: "워렌 버핏",
    nameEn: "Warren Buffett",
    description: "가치투자의 대가. 저평가된 우량주를 장기 보유하며, 안정적인 현금흐름을 중시합니다.",
    style: "가치투자 · 장기투자",
    allocation: {
      stocks: 70,
      bonds: 10,
      cash: 15,
      realEstate: 5,
      crypto: 0,
    },
    characteristics: [
      "저평가된 우량주 중심",
      "장기 보유 전략",
      "안정적인 배당주 선호",
      "높은 현금 비중 유지",
    ],
  },
  "peter-lynch": {
    id: "peter-lynch",
    name: "피터 린치",
    nameEn: "Peter Lynch",
    description: "성장주 투자의 달인. 이해할 수 있는 기업에 투자하며, 적극적인 분산투자를 추구합니다.",
    style: "성장주 투자 · 분산투자",
    allocation: {
      stocks: 85,
      bonds: 5,
      cash: 5,
      realEstate: 5,
      crypto: 0,
    },
    characteristics: [
      "성장 가능성이 높은 기업",
      "10~20개 종목 분산투자",
      "이해하는 산업에 집중",
      "적극적인 포트폴리오 관리",
    ],
  },
  "ray-dalio": {
    id: "ray-dalio",
    name: "레이 달리오",
    nameEn: "Ray Dalio",
    description: "올웨더 포트폴리오 창시자. 모든 경제 환경에서 안정적인 수익을 추구하는 분산투자 전략입니다.",
    style: "자산배분 · 리스크 패리티",
    allocation: {
      stocks: 30,
      bonds: 40,
      cash: 5,
      realEstate: 15,
      crypto: 0,
      gold: 10,
    },
    characteristics: [
      "극도의 분산투자",
      "자산 간 상관관계 최소화",
      "경제 사이클 대응",
      "안정적인 수익 추구",
    ],
  },
  "john-bogle": {
    id: "john-bogle",
    name: "존 보글",
    nameEn: "John Bogle",
    description: "인덱스 펀드의 아버지. 저비용 인덱스 펀드를 통한 시장 수익률 추종을 강조합니다.",
    style: "인덱스 투자 · 패시브",
    allocation: {
      stocks: 60,
      bonds: 30,
      cash: 5,
      realEstate: 5,
      crypto: 0,
    },
    characteristics: [
      "저비용 인덱스 펀드",
      "시장 수익률 추종",
      "장기 보유 전략",
      "최소한의 거래",
    ],
  },
  "benjamin-graham": {
    id: "benjamin-graham",
    name: "벤저민 그레이엄",
    nameEn: "Benjamin Graham",
    description: "가치투자의 아버지. 안전마진을 확보한 저평가 자산에 투자하는 보수적 전략입니다.",
    style: "가치투자 · 안전마진",
    allocation: {
      stocks: 50,
      bonds: 35,
      cash: 10,
      realEstate: 5,
      crypto: 0,
    },
    characteristics: [
      "철저한 안전마진 확보",
      "저평가 자산 발굴",
      "보수적인 접근",
      "리스크 최소화",
    ],
  },
}

// 포트폴리오 분석 함수
function analyzePortfolio(assets: any, investorId: string) {
  const investor = INVESTORS[investorId as keyof typeof INVESTORS]
  if (!investor) {
    return { error: "Invalid investor ID" }
  }

  const totalAssets = assets.cash + assets.stocks + assets.bonds + assets.realEstate + (assets.crypto || 0)

  // 현재 자산 배분 계산
  const currentAllocation = {
    stocks: (assets.stocks / totalAssets) * 100,
    bonds: (assets.bonds / totalAssets) * 100,
    cash: (assets.cash / totalAssets) * 100,
    realEstate: (assets.realEstate / totalAssets) * 100,
    crypto: ((assets.crypto || 0) / totalAssets) * 100,
  }

  // 추천 자산 배분 계산
  const recommendations = {
    stocks: Math.round((totalAssets * investor.allocation.stocks) / 100),
    bonds: Math.round((totalAssets * investor.allocation.bonds) / 100),
    cash: Math.round((totalAssets * investor.allocation.cash) / 100),
    realEstate: Math.round((totalAssets * investor.allocation.realEstate) / 100),
    crypto: Math.round((totalAssets * (investor.allocation.crypto || 0)) / 100),
  }

  // 조정이 필요한 항목 계산
  const adjustments = {
    stocks: recommendations.stocks - assets.stocks,
    bonds: recommendations.bonds - assets.bonds,
    cash: recommendations.cash - assets.cash,
    realEstate: recommendations.realEstate - assets.realEstate,
    crypto: recommendations.crypto - (assets.crypto || 0),
  }

  return {
    investor,
    totalAssets,
    currentAllocation,
    recommendations,
    adjustments,
    summary: generateSummary(adjustments, investor),
  }
}

function generateSummary(adjustments: any, investor: any) {
  const actions = []

  if (adjustments.stocks > 0) {
    actions.push(`주식을 ${formatCurrency(adjustments.stocks)} 추가 매수하세요`)
  } else if (adjustments.stocks < 0) {
    actions.push(`주식을 ${formatCurrency(Math.abs(adjustments.stocks))} 매도하세요`)
  }

  if (adjustments.bonds > 0) {
    actions.push(`채권을 ${formatCurrency(adjustments.bonds)} 추가 매수하세요`)
  } else if (adjustments.bonds < 0) {
    actions.push(`채권을 ${formatCurrency(Math.abs(adjustments.bonds))} 매도하세요`)
  }

  if (adjustments.cash > 0) {
    actions.push(`현금을 ${formatCurrency(adjustments.cash)} 추가 확보하세요`)
  } else if (adjustments.cash < 0) {
    actions.push(`현금 ${formatCurrency(Math.abs(adjustments.cash))}를 투자에 활용하세요`)
  }

  if (adjustments.realEstate > 0) {
    actions.push(`부동산을 ${formatCurrency(adjustments.realEstate)} 추가 투자하세요`)
  }

  return actions.length > 0 ? actions : ["현재 포트폴리오가 적절합니다"]
}

function formatCurrency(amount: number) {
  return `${(amount / 10000).toFixed(0)}만원`
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)

    // CORS 헤더
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    }

    // OPTIONS 요청 처리 (CORS preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders })
    }

    // 헬스체크
    if (url.pathname === "/api/health") {
      return new Response(
        JSON.stringify({
          status: "ok",
          service: "moajim",
        }),
        { headers: corsHeaders }
      )
    }

    // 투자자 목록 조회
    if (url.pathname === "/api/portfolio/investors" && request.method === "GET") {
      return new Response(
        JSON.stringify({
          investors: Object.values(INVESTORS),
        }),
        { headers: corsHeaders }
      )
    }

    // 포트폴리오 분석
    if (url.pathname === "/api/portfolio/analyze" && request.method === "POST") {
      try {
        const body = await request.json()
        const { assets, investorId, userProfile } = body

        // 입력 검증
        if (!assets || !investorId) {
          return new Response(
            JSON.stringify({ error: "Missing required fields: assets, investorId" }),
            { status: 400, headers: corsHeaders }
          )
        }

        // 포트폴리오 분석 수행
        const analysis = analyzePortfolio(assets, investorId)

        if (analysis.error) {
          return new Response(
            JSON.stringify(analysis),
            { status: 400, headers: corsHeaders }
          )
        }

        // DB 저장 시뮬레이션 (실제로는 D1이나 KV에 저장)
        const analysisId = `analysis_${Date.now()}`

        return new Response(
          JSON.stringify({
            id: analysisId,
            ...analysis,
            createdAt: new Date().toISOString(),
          }),
          { headers: corsHeaders }
        )
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Invalid request body" }),
          { status: 400, headers: corsHeaders }
        )
      }
    }

    // 나머지 요청
    return new Response("Not Found", { status: 404 })
  },
}
