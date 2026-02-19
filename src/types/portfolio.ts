export interface Investor {
  id: string
  name: string
  nameEn: string
  description: string
  style: string
  allocation: {
    stocks: number
    bonds: number
    cash: number
    realEstate: number
    crypto?: number
    gold?: number
  }
  characteristics: string[]
}

export interface CryptoHolding {
  coinId: string
  symbol: string
  name: string
  quantity: number
  currentPrice: number
}

export interface StockHolding {
  ticker: string
  name: string
  market: string
  quantity: number
  currentPriceUSD: number
  exchangeRate: number
}

export interface DetailedAssets {
  // 현금성 자산 (만원)
  deposit: number          // 예금
  savings: number          // 적금
  cma: number             // CMA/MMF

  // 주식 (만원)
  domesticStocks: number  // 국내주식
  foreignStocks: number   // 해외주식
  etf: number            // ETF

  // 채권 (만원)
  governmentBonds: number // 국채
  corporateBonds: number  // 회사채

  // 부동산 (만원)
  residential: number     // 주거용
  commercial: number      // 상업용
  reits: number          // REITs

  // 귀금속 (만원)
  gold: number           // 금
  silver: number         // 은

  // 암호화폐 (실시간 계산)
  cryptoHoldings: CryptoHolding[]
}

export interface Assets {
  cash: number
  stocks: number
  bonds: number
  realEstate: number
  crypto: number
}

export interface AnalysisResult {
  investor: Investor
  totalAssets: number
  currentAllocation: {
    stocks: number
    bonds: number
    cash: number
    realEstate: number
    crypto: number
  }
  recommendations: Assets
  adjustments: Assets
  summary: string[]
}
