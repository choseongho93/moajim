/**
 * 경락잔금대출 한도 계산 유틸리티
 *
 * 경매 낙찰 후 금융기관에서 대출 가능한 한도를 산출합니다.
 * 기준: MIN(적용 기준별 산출 금액)
 */

export type AuctionLoanMode = 'first-tier' | 'second-tier' | 'custom'

export interface AuctionLoanCriterion {
  enabled: boolean
  rate: number  // %
}

export interface AuctionLoanInput {
  appraisalValue: number   // 감정가 (만원)
  winningBid: number       // 낙찰가 (만원)
  marketPrice: number      // 현재 시세 (만원)
  mode: AuctionLoanMode
  // 자체 기준 시 사용
  customCriteria?: {
    winningBidBasis: AuctionLoanCriterion      // 낙찰가 기준
    appraisalBasis: AuctionLoanCriterion       // 감정가 기준
    marketPriceBasis: AuctionLoanCriterion     // 현재시세 기준
    winningBidRatioBasis: AuctionLoanCriterion // 낙찰가 × (낙찰가/감정가) 기준
  }
}

export interface CriterionResult {
  label: string
  formula: string
  amount: number  // 만원
  enabled: boolean
}

export interface AuctionLoanResult {
  criteria: CriterionResult[]
  loanLimit: number       // 대출 한도 (만원)
  bidRate: number          // 낙찰가율 (%)
}

// 1금융권 기본 기준
const FIRST_TIER_DEFAULTS = {
  winningBidRate: 90,
  appraisalRate: 80,
  marketPriceRate: 80,
}

// 2금융권 기본 기준
const SECOND_TIER_DEFAULTS = {
  winningBidRate: 95,
  appraisalRate: 90,
  marketPriceRate: 90,
}

export function calculateAuctionLoan(input: AuctionLoanInput): AuctionLoanResult {
  const { appraisalValue, winningBid, marketPrice, mode, customCriteria } = input

  const bidRate = appraisalValue > 0 ? Math.round(winningBid / appraisalValue * 10000) / 100 : 0

  const criteria: CriterionResult[] = []

  if (mode === 'custom' && customCriteria) {
    // 자체 기준
    const { winningBidBasis, appraisalBasis, marketPriceBasis, winningBidRatioBasis } = customCriteria

    criteria.push({
      label: '낙찰가 기준',
      formula: `${winningBid.toLocaleString()} × ${winningBidBasis.rate}%`,
      amount: Math.round(winningBid * winningBidBasis.rate / 100),
      enabled: winningBidBasis.enabled,
    })

    criteria.push({
      label: '감정가 기준',
      formula: `${appraisalValue.toLocaleString()} × ${appraisalBasis.rate}%`,
      amount: Math.round(appraisalValue * appraisalBasis.rate / 100),
      enabled: appraisalBasis.enabled,
    })

    criteria.push({
      label: '현재시세 기준',
      formula: `${marketPrice.toLocaleString()} × ${marketPriceBasis.rate}%`,
      amount: Math.round(marketPrice * marketPriceBasis.rate / 100),
      enabled: marketPriceBasis.enabled,
    })

    // 낙찰가 × (낙찰가/감정가)
    const ratioAmount = appraisalValue > 0
      ? Math.round(winningBid * (winningBid / appraisalValue) * winningBidRatioBasis.rate / 100)
      : 0
    criteria.push({
      label: '낙찰가×낙찰가율 기준',
      formula: `${winningBid.toLocaleString()} × ${bidRate}% × ${winningBidRatioBasis.rate}%`,
      amount: ratioAmount,
      enabled: winningBidRatioBasis.enabled,
    })
  } else {
    // 1금융권 / 2금융권
    const defaults = mode === 'first-tier' ? FIRST_TIER_DEFAULTS : SECOND_TIER_DEFAULTS

    criteria.push({
      label: '낙찰가 기준',
      formula: `${winningBid.toLocaleString()} × ${defaults.winningBidRate}%`,
      amount: Math.round(winningBid * defaults.winningBidRate / 100),
      enabled: true,
    })

    criteria.push({
      label: '감정가 기준',
      formula: `${appraisalValue.toLocaleString()} × ${defaults.appraisalRate}%`,
      amount: Math.round(appraisalValue * defaults.appraisalRate / 100),
      enabled: true,
    })

    criteria.push({
      label: '현재시세 기준',
      formula: `${marketPrice.toLocaleString()} × ${defaults.marketPriceRate}%`,
      amount: Math.round(marketPrice * defaults.marketPriceRate / 100),
      enabled: true,
    })
  }

  const enabledAmounts = criteria.filter(c => c.enabled).map(c => c.amount)
  const loanLimit = enabledAmounts.length > 0 ? Math.min(...enabledAmounts) : 0

  return {
    criteria,
    loanLimit,
    bidRate,
  }
}
