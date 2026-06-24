const API_BASE = import.meta.env.DEV ? '/api' : 'https://moajim.com/api'

export interface ExchangeRatesPayload {
  success: boolean
  base: 'KRW'
  rates: Record<string, number>
  timestamp: number
  nextUpdate: number
  fetchedAt: number
  error?: string
}

export async function fetchExchangeRates(): Promise<ExchangeRatesPayload> {
  const response = await fetch(`${API_BASE}/exchange/rates`)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  const data = await response.json() as ExchangeRatesPayload
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch exchange rates')
  }
  return data
}
