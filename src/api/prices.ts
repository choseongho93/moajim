/**
 * 암호화폐 실시간 가격 조회 (CoinGecko API)
 */
export async function getCryptoPrice(coinId: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=krw`
    )
    const data = await response.json()
    return data[coinId]?.krw || 0
  } catch (error) {
    console.error('Failed to fetch crypto price:', error)
    return 0
  }
}

/**
 * 여러 암호화폐 가격 한번에 조회
 */
export async function getCryptoPrices(coinIds: string[]): Promise<Record<string, number>> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=krw`
    )
    const data = await response.json()
    const prices: Record<string, number> = {}
    coinIds.forEach(id => {
      prices[id] = data[id]?.krw || 0
    })
    return prices
  } catch (error) {
    console.error('Failed to fetch crypto prices:', error)
    return {}
  }
}

/**
 * 주식 실시간 가격 조회 (Finnhub API - 무료)
 * API 키: https://finnhub.io/ 에서 무료 발급
 */
export async function getStockPrice(ticker: string): Promise<number> {
  try {
    // Finnhub API 키 (환경변수나 설정에서 가져오기)
    const apiKey = 'demo' // 데모용. 실제로는 발급받은 키 사용

    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`
    )
    const data = await response.json()

    // c: current price
    return data.c || 0
  } catch (error) {
    console.error('Failed to fetch stock price:', error)
    return 0
  }
}

/**
 * 여러 주식 가격 한번에 조회
 */
export async function getStockPrices(tickers: string[]): Promise<Record<string, number>> {
  const prices: Record<string, number> = {}

  // Finnhub는 batch API가 없어서 순차 호출
  for (const ticker of tickers) {
    prices[ticker] = await getStockPrice(ticker)
    // Rate limit 방지 (무료: 60 calls/분)
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return prices
}

/**
 * Alpha Vantage로 환율 조회 (USD -> KRW)
 */
export async function getExchangeRate(): Promise<number> {
  try {
    // 데모용 고정값 (실제로는 API 호출)
    return 1300 // 1 USD = 1300 KRW
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error)
    return 1300
  }
}

// 지원하는 암호화폐 목록
export const CRYPTO_LIST = [
  { id: 'bitcoin', symbol: 'BTC', name: '비트코인' },
  { id: 'ethereum', symbol: 'ETH', name: '이더리움' },
  { id: 'ripple', symbol: 'XRP', name: '리플' },
  { id: 'cardano', symbol: 'ADA', name: '에이다' },
  { id: 'solana', symbol: 'SOL', name: '솔라나' },
  { id: 'dogecoin', symbol: 'DOGE', name: '도지코인' },
  { id: 'polkadot', symbol: 'DOT', name: '폴카닷' },
  { id: 'avalanche-2', symbol: 'AVAX', name: '아발란체' },
]

// 지원하는 주식 목록 (미국 주요 종목)
export const STOCK_LIST = [
  { ticker: 'AAPL', name: '애플', market: 'US' },
  { ticker: 'MSFT', name: '마이크로소프트', market: 'US' },
  { ticker: 'GOOGL', name: '구글', market: 'US' },
  { ticker: 'AMZN', name: '아마존', market: 'US' },
  { ticker: 'TSLA', name: '테슬라', market: 'US' },
  { ticker: 'NVDA', name: '엔비디아', market: 'US' },
  { ticker: 'META', name: '메타', market: 'US' },
  { ticker: 'NFLX', name: '넷플릭스', market: 'US' },
  { ticker: 'V', name: '비자', market: 'US' },
  { ticker: 'JPM', name: 'JP모건', market: 'US' },
  { ticker: 'DIS', name: '디즈니', market: 'US' },
  { ticker: 'BA', name: '보잉', market: 'US' },
]
