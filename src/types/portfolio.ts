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
