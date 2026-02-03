import type { Investor, Assets, AnalysisResult } from '../types/portfolio'

/**
 * 투자자 목록 조회
 */
export async function fetchInvestors(): Promise<Investor[]> {
  const response = await fetch('/api/portfolio/investors')
  const data = await response.json()
  return data.investors
}

/**
 * 포트폴리오 분석 요청
 */
export async function analyzePortfolio(
  assets: Assets,
  investorId: string
): Promise<AnalysisResult> {
  const response = await fetch('/api/portfolio/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      assets,
      investorId,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to analyze portfolio')
  }

  return await response.json()
}
