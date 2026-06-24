import { INVESTORS, type InvestorProfile } from '../data/investors'
import { formatCurrency } from '../utils/currency'

export interface Assets {
  cash: number
  stocks: number
  bonds: number
  realEstate: number
  crypto?: number
}

export interface AnalysisResult {
  investor: InvestorProfile
  totalAssets: number
  currentAllocation: Record<string, number>
  recommendations: Record<string, number>
  adjustments: Record<string, number>
  summary: string[]
}

/**
 * 포트폴리오 분석
 */
export function analyzePortfolio(assets: Assets, investorId: string): AnalysisResult | { error: string } {
  const investor = INVESTORS[investorId]
  if (!investor) {
    return { error: 'Invalid investor ID' }
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

/**
 * 조정 가이드 생성
 */
function generateSummary(adjustments: Record<string, number>, investor: InvestorProfile): string[] {
  const actions: string[] = []

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

  return actions.length > 0 ? actions : ['현재 포트폴리오가 적절합니다']
}
