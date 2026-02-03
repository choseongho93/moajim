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

  // 주식 (실시간 계산)
  stockHoldings: StockHolding[]
  domesticStocks: number  // 국내주식 (수동 입력)
  etf: number            // ETF (수동 입력)

  // 채권 (만원)
  governmentBonds: number // 국채
  corporateBonds: number  // 회사채

  // 부동산 (만원)
  residential: number     // 주거용
  commercial: number      // 상업용
  reits: number          // REITs

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
