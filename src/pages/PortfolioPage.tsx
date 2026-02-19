import { useState, useEffect } from 'react'
import type { Investor, Assets, AnalysisResult, DetailedAssets, CryptoHolding, RealEstateHolding } from '../types/portfolio'
import { fetchInvestors, analyzePortfolio } from '../api/portfolio'
import { formatKoreanAmount, formatTextWithCommas } from '../utils/currency'
import { getCryptoPrices, CRYPTO_LIST } from '../api/prices'
import { searchRealEstate, parseDealAmount } from '../api/realestate'
import { getCities, getDistricts, getLawdCode } from '../data/lawdCodes'
import { getDongList, hasDongData } from '../data/dongCodes'
import Toast from '../components/Toast'

interface PortfolioPageProps {
  initialSubView?: string
}

export default function PortfolioPage({ initialSubView }: PortfolioPageProps) {
  // 바로 자산 입력으로 시작
  const [step, setStep] = useState<'input-assets' | 'results'>('input-assets')
  const [investors, setInvestors] = useState<Investor[]>([])
  const [matchedInvestor, setMatchedInvestor] = useState<Investor | null>(null)
  const [matchRate, setMatchRate] = useState<number>(0)
  const [detailedAssets, setDetailedAssets] = useState<DetailedAssets>({
    deposit: 0,
    savings: 0,
    cma: 0,
    domesticStocks: 0,
    foreignStocks: 0,
    etf: 0,
    governmentBonds: 0,
    corporateBonds: 0,
    realEstateHoldings: [],
    residential: 0,
    commercial: 0,
    reits: 0,
    gold: 0,
    silver: 0,
    cryptoHoldings: [],
  })
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchInvestors()
      .then(data => setInvestors(data))
      .catch(err => console.error('Failed to load investors:', err))
  }, [])

  const handleAnalyze = async () => {
    // 암호화폐 총액 계산 (원화)
    const cryptoTotalKRW = detailedAssets.cryptoHoldings.reduce(
      (sum, holding) => sum + holding.quantity * holding.currentPrice,
      0
    )

    // 부동산 총액 계산 (만원)
    const realEstateTotalManwon = detailedAssets.realEstateHoldings.reduce(
      (sum, holding) => sum + holding.value,
      0
    ) + detailedAssets.residential + detailedAssets.commercial + detailedAssets.reits

    // 귀금속 총액 계산 (만원)
    const commodityTotalManwon = detailedAssets.gold + detailedAssets.silver

    // 세부 자산을 카테고리별로 합산
    const aggregatedAssets: Assets = {
      cash: (detailedAssets.deposit + detailedAssets.savings + detailedAssets.cma) * 10000,
      stocks: (detailedAssets.domesticStocks + detailedAssets.foreignStocks + detailedAssets.etf) * 10000,
      bonds: (detailedAssets.governmentBonds + detailedAssets.corporateBonds) * 10000,
      realEstate: realEstateTotalManwon * 10000,
      crypto: cryptoTotalKRW + (commodityTotalManwon * 10000), // 귀금속도 crypto에 포함
    }

    // 총 자산 계산
    const totalAssets = Object.values(aggregatedAssets).reduce((sum, val) => sum + val, 0)

    if (totalAssets === 0) {
      alert('자산을 입력해주세요')
      return
    }

    // 현재 자산 비중 계산
    const currentAllocation = {
      cash: (aggregatedAssets.cash / totalAssets) * 100,
      stocks: (aggregatedAssets.stocks / totalAssets) * 100,
      bonds: (aggregatedAssets.bonds / totalAssets) * 100,
      realEstate: (aggregatedAssets.realEstate / totalAssets) * 100,
      crypto: (aggregatedAssets.crypto / totalAssets) * 100,
    }

    // 모든 투자자와 비교하여 가장 유사한 투자자 찾기
    let bestMatch: Investor | null = null
    let bestMatchRate = 0

    investors.forEach(investor => {
      // 차이 계산 (절대값의 합)
      const diff =
        Math.abs(currentAllocation.cash - investor.allocation.cash) +
        Math.abs(currentAllocation.stocks - investor.allocation.stocks) +
        Math.abs(currentAllocation.bonds - investor.allocation.bonds) +
        Math.abs(currentAllocation.realEstate - investor.allocation.realEstate) +
        Math.abs(currentAllocation.crypto - (investor.allocation.crypto || 0))

      // 일치율 계산 (차이가 작을수록 일치율이 높음)
      const matchRate = Math.max(0, 100 - diff / 2)

      if (matchRate > bestMatchRate) {
        bestMatchRate = matchRate
        bestMatch = investor
      }
    })

    if (!bestMatch) return

    setMatchedInvestor(bestMatch)
    setMatchRate(bestMatchRate)

    setLoading(true)
    try {
      const data = await analyzePortfolio(aggregatedAssets, bestMatch.id)
      setAnalysisResult(data)
      setStep('results')
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'input-assets') {
    return (
      <AssetInputView
        detailedAssets={detailedAssets}
        setDetailedAssets={setDetailedAssets}
        loading={loading}
        onAnalyze={handleAnalyze}
      />
    )
  }

  if (step === 'results' && analysisResult && matchedInvestor) {
    return (
      <ResultsView
        analysisResult={analysisResult}
        matchedInvestor={matchedInvestor}
        matchRate={matchRate}
        onBack={() => setStep('input-assets')}
      />
    )
  }

  return null
}

// 투자자 선택 화면
function InvestorSelectionView({
  investors,
  onSelect,
}: {
  investors: Investor[]
  onSelect: (investor: Investor) => void
}) {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-[42px] font-bold text-gray-900 mb-3">
            투자 전략 선택
          </h1>
          <p className="text-[17px] text-gray-600">
            투자 대가의 전략으로
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {investors.map((investor) => (
            <button
              key={investor.id}
              onClick={() => onSelect(investor)}
              className="group text-left p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#F15F5F] transition-all hover:shadow-lg"
            >
              <div className="mb-3">
                <h3 className="text-[20px] font-bold text-gray-900 mb-1">
                  {investor.name}
                </h3>
                <p className="text-xs text-gray-500">{investor.nameEn}</p>
              </div>
              <p className="text-xs px-2 py-1 bg-red-50 text-[#F15F5F] rounded-full inline-block mb-3 font-medium">
                {investor.style}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {investor.description}
              </p>
              <div className="flex items-center text-[#F15F5F] text-sm font-medium">
                선택하기
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// 자산 입력 화면
function AssetInputView({
  detailedAssets,
  setDetailedAssets,
  loading,
  onAnalyze,
}: {
  detailedAssets: DetailedAssets
  setDetailedAssets: (assets: DetailedAssets) => void
  loading: boolean
  onAnalyze: () => void
}) {
  const [activeCategory, setActiveCategory] = useState<'cash' | 'stocks' | 'bonds' | 'realEstate' | 'commodity' | 'crypto'>('cash')
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({})
  const [priceLoading, setPriceLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  // 부동산 입력 모드
  const [realEstateInputMode, setRealEstateInputMode] = useState<'manual' | 'search'>('manual')

  // 실거래가 조회
  const [realEstateSearch, setRealEstateSearch] = useState({
    city: '',
    district: '',
    aptName: '',
    dong: '',
    floor: '',
  })
  const [realEstateLoading, setRealEstateLoading] = useState(false)
  const [realEstateResult, setRealEstateResult] = useState<any>(null)
  const [allTrades, setAllTrades] = useState<any[]>([]) // 전체 거래 내역
  const [dongList, setDongList] = useState<string[]>([]) // 법정동 목록
  const [apiCache, setApiCache] = useState<Record<string, any[]>>({}) // API 응답 캐시
  const [selectedDong, setSelectedDong] = useState<string>('') // 선택된 법정동
  const [apartmentList, setApartmentList] = useState<string[]>([]) // 단지 목록
  const [areaList, setAreaList] = useState<string[]>([]) // 평형 목록
  const [selectedArea, setSelectedArea] = useState<string>('') // 선택된 평형

  // 코인 가격 가져오기
  useEffect(() => {
    if (activeCategory === 'crypto') {
      setPriceLoading(true)
      getCryptoPrices(CRYPTO_LIST.map(c => c.id))
        .then(prices => setCryptoPrices(prices))
        .finally(() => setPriceLoading(false))
    }
  }, [activeCategory])

  const categories = {
    cash: {
      label: '현금성 자산',
      icon: '💰',
      fields: [
        { key: 'deposit', label: '예금', placeholder: '1000' },
        { key: 'savings', label: '적금', placeholder: '500' },
      ],
    },
    stocks: {
      label: '주식',
      icon: '📈',
      fields: [
        { key: 'domesticStocks', label: '국내주식', placeholder: '2000' },
        { key: 'foreignStocks', label: '해외주식', placeholder: '1500' },
      ],
    },
    bonds: {
      label: '채권',
      icon: '📄',
      fields: [
        { key: 'governmentBonds', label: '국채', placeholder: '1000' },
        { key: 'corporateBonds', label: '회사채', placeholder: '500' },
      ],
    },
    realEstate: {
      label: '부동산 (실거래가 기준)',
      icon: '🏠',
      fields: [
        { key: 'residential', label: '주거용', placeholder: '10000' },
        { key: 'commercial', label: '상업용', placeholder: '5000' },
      ],
    },
    commodity: {
      label: '귀금속',
      icon: '🪙',
      fields: [
        { key: 'gold', label: '금', placeholder: '1000' },
        { key: 'silver', label: '은', placeholder: '500' },
      ],
    },
    crypto: {
      label: '암호화폐',
      icon: '₿',
      fields: [],
    },
  }

  // 코인 추가
  const addCrypto = (coin: typeof CRYPTO_LIST[0]) => {
    const price = cryptoPrices[coin.id] || 0
    const newHolding: CryptoHolding = {
      coinId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      quantity: 0,
      currentPrice: price,
    }
    setDetailedAssets({
      ...detailedAssets,
      cryptoHoldings: [...detailedAssets.cryptoHoldings, newHolding],
    })
  }

  // 코인 수량 업데이트
  const updateCryptoQuantity = (index: number, quantity: number) => {
    const newHoldings = [...detailedAssets.cryptoHoldings]
    newHoldings[index].quantity = quantity
    setDetailedAssets({ ...detailedAssets, cryptoHoldings: newHoldings })
  }

  // 코인 삭제
  const removeCrypto = (index: number) => {
    const newHoldings = detailedAssets.cryptoHoldings.filter((_, i) => i !== index)
    setDetailedAssets({ ...detailedAssets, cryptoHoldings: newHoldings })
  }

  // 부동산 추가 (직접 입력)
  const addRealEstateManual = () => {
    const newHolding: RealEstateHolding = {
      id: Date.now().toString(),
      type: 'residential',
      name: '',
      value: 0,
    }
    setDetailedAssets({
      ...detailedAssets,
      realEstateHoldings: [...detailedAssets.realEstateHoldings, newHolding],
    })
  }

  // 부동산 업데이트
  const updateRealEstate = (index: number, updates: Partial<RealEstateHolding>) => {
    const newHoldings = [...detailedAssets.realEstateHoldings]
    newHoldings[index] = { ...newHoldings[index], ...updates }
    setDetailedAssets({ ...detailedAssets, realEstateHoldings: newHoldings })
  }

  // 부동산 삭제
  const removeRealEstate = (index: number) => {
    const newHoldings = detailedAssets.realEstateHoldings.filter((_, i) => i !== index)
    setDetailedAssets({ ...detailedAssets, realEstateHoldings: newHoldings })
  }

  // 1단계: 구 선택 시 전체 거래 조회 및 법정동 목록 추출
  const handleSearchApartments = async () => {
    if (!realEstateSearch.city || !realEstateSearch.district) {
      setToast({ message: '시/도, 시/군/구를 선택해주세요', type: 'error' })
      return
    }

    const lawdCd = getLawdCode(realEstateSearch.city, realEstateSearch.district)
    if (!lawdCd) {
      setToast({ message: '법정동 코드를 찾을 수 없습니다', type: 'error' })
      return
    }

    setRealEstateLoading(true)
    setAllTrades([])
    setDongList([])
    setSelectedDong('')
    setApartmentList([])
    setAreaList([])
    setRealEstateResult(null)

    try {
      // 최근 거래 전체 조회
      const result = await searchRealEstate({
        lawdCd,
        aptName: '', // 빈 문자열로 전체 조회
      })

      setAllTrades(result.similarTrades || [])

      // 법정동 목록 추출 (중복 제거)
      const dongs = [...new Set(result.similarTrades.map((t: any) => t.umdNm))].sort()
      setDongList(dongs as string[])
    } catch (error: any) {
      setToast({ message: `조회 실패: ${error.message}`, type: 'error' })
    } finally {
      setRealEstateLoading(false)
    }
  }

  // 2단계: 법정동 선택 시 아파트 단지 목록 가져오기 (캐시 활용)
  const handleSelectDong = async (dong: string) => {
    setSelectedDong(dong)
    setRealEstateSearch({ ...realEstateSearch, aptName: '' })
    setAreaList([])
    setRealEstateResult(null)
    setApartmentList([])

    if (!dong || !realEstateSearch.city || !realEstateSearch.district) return

    const lawdCd = getLawdCode(realEstateSearch.city, realEstateSearch.district)
    if (!lawdCd) return

    const cacheKey = `${lawdCd}-${dong}`

    // 캐시 확인
    if (apiCache[cacheKey]) {
      // 캐시에서 가져오기 (즉시)
      const trades = apiCache[cacheKey]
      setAllTrades(trades)
      const apartments = [...new Set(trades.map((t: any) => t.aptNm))].sort((a, b) => a.localeCompare(b, 'ko-KR'))
      setApartmentList(apartments as string[])
      return
    }

    // 캐시에 없으면 API로 조회
    setRealEstateLoading(true)
    try {
      const result = await searchRealEstate({
        lawdCd,
        aptName: '',
      })

      setAllTrades(result.similarTrades || [])

      // 선택한 법정동의 아파트 단지 목록 추출
      const trades = result.similarTrades.filter((t: any) => t.umdNm === dong)
      const apartments = [...new Set(trades.map((t: any) => t.aptNm))].sort((a, b) => a.localeCompare(b, 'ko-KR'))
      setApartmentList(apartments as string[])

      // 캐시에 저장
      setApiCache({ ...apiCache, [cacheKey]: result.similarTrades || [] })
    } catch (error: any) {
      setToast({ message: `조회 실패: ${error.message}`, type: 'error' })
    } finally {
      setRealEstateLoading(false)
    }
  }

  // 3단계: 단지 선택 시 평형 목록 추출
  const handleSelectApartment = (aptName: string) => {
    setRealEstateSearch({ ...realEstateSearch, aptName })
    setSelectedArea('')
    setRealEstateResult(null)

    // 선택한 법정동과 아파트의 평형 목록 추출
    const trades = allTrades.filter((t: any) => t.umdNm === selectedDong && t.aptNm === aptName)
    const areas = [...new Set(trades.map((t: any) => t.excluUseAr))].sort((a, b) => parseFloat(a) - parseFloat(b))
    setAreaList(areas as string[])
  }

  // 4단계: 평형 선택 시 최근 거래가 조회
  const handleSelectArea = (area: string) => {
    setSelectedArea(area)

    // 선택한 법정동, 단지, 평형에 맞는 최근 거래 찾기
    const trades = allTrades.filter(
      (t: any) => t.umdNm === selectedDong && t.aptNm === realEstateSearch.aptName && t.excluUseAr === area
    )

    if (trades.length > 0) {
      // 가장 최근 거래
      trades.sort((a: any, b: any) => {
        const dateA = parseInt(a.dealYear + a.dealMonth.padStart(2, '0') + a.dealDay.padStart(2, '0'))
        const dateB = parseInt(b.dealYear + b.dealMonth.padStart(2, '0') + b.dealDay.padStart(2, '0'))
        return dateB - dateA
      })
      setRealEstateResult({ trade: trades[0] })
    }
  }

  // 5단계: 부동산 추가하기
  const handleAddRealEstate = () => {
    if (!realEstateResult || !realEstateResult.trade) {
      setToast({ message: '거래 정보가 없습니다', type: 'error' })
      return
    }

    const trade = realEstateResult.trade
    const amount = parseDealAmount(trade.dealAmount)
    const address = `${realEstateSearch.city} ${realEstateSearch.district}`
    const dealDate = `${trade.dealYear}.${trade.dealMonth.padStart(2, '0')}.${trade.dealDay.padStart(2, '0')}`

    const newHolding: RealEstateHolding = {
      id: Date.now().toString(),
      type: 'residential',
      name: `${trade.aptNm} (${trade.excluUseAr}㎡)`,
      address: address,
      value: amount,
      dealDate: dealDate,
    }

    setDetailedAssets({
      ...detailedAssets,
      realEstateHoldings: [...detailedAssets.realEstateHoldings, newHolding],
    })

    // 초기화
    setRealEstateSearch({
      city: realEstateSearch.city,
      district: realEstateSearch.district,
      aptName: '',
      dong: '',
      floor: '',
    })
    setAllTrades([])
    setApartmentList([])
    setAreaList([])
    setSelectedArea('')
    setRealEstateResult(null)

    // 직접 입력 탭으로 전환하여 추가된 부동산 확인
    setRealEstateInputMode('manual')
    setToast({ message: '부동산이 추가되었습니다!', type: 'success' })
  }

  const cryptoTotalKRW = detailedAssets.cryptoHoldings.reduce(
    (sum, holding) => sum + holding.quantity * holding.currentPrice,
    0
  )
  const cryptoTotalManwon = Math.round(cryptoTotalKRW / 10000)

  const realEstateTotalManwon = detailedAssets.realEstateHoldings.reduce(
    (sum, holding) => sum + holding.value,
    0
  ) + detailedAssets.residential + detailedAssets.commercial + detailedAssets.reits

  const totalAssets =
    detailedAssets.deposit +
    detailedAssets.savings +
    detailedAssets.cma +
    detailedAssets.domesticStocks +
    detailedAssets.foreignStocks +
    detailedAssets.etf +
    detailedAssets.governmentBonds +
    detailedAssets.corporateBonds +
    detailedAssets.gold +
    detailedAssets.silver +
    realEstateTotalManwon +
    cryptoTotalManwon

  const categoryTotals = {
    cash: detailedAssets.deposit + detailedAssets.savings + detailedAssets.cma,
    stocks: detailedAssets.domesticStocks + detailedAssets.foreignStocks + detailedAssets.etf,
    bonds: detailedAssets.governmentBonds + detailedAssets.corporateBonds,
    realEstate: realEstateTotalManwon,
    commodity: detailedAssets.gold + detailedAssets.silver,
    crypto: cryptoTotalManwon,
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="pb-5 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">자산 입력</h2>
            <p className="text-sm text-gray-500 mt-1">보유하신 자산을 입력하고 분석해보세요</p>
          </div>

          <div className="mt-5">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                보유 자산 입력
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>입력하신 자산 정보는 DB에 저장되지 않으며, 분석에만 사용됩니다</span>
              </div>
            </div>

            {/* 카테고리 탭 */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeCategory === key
                      ? 'bg-[#F15F5F] text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span className="text-sm font-medium">{category.label}</span>
                  {categoryTotals[key as keyof typeof categoryTotals] > 0 && (
                    <span className="text-xs opacity-75">
                      {categoryTotals[key as keyof typeof categoryTotals]}만
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* 부동산 입력 모드 선택 */}
            {activeCategory === 'realEstate' && (
              <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setRealEstateInputMode('manual')}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                    realEstateInputMode === 'manual'
                      ? 'bg-white text-[#F15F5F] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  직접 입력
                </button>
                <button
                  onClick={() => setRealEstateInputMode('search')}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                    realEstateInputMode === 'search'
                      ? 'bg-white text-[#F15F5F] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  실거래가 조회
                </button>
              </div>
            )}

            {/* 일반 자산 입력 필드 */}
            {activeCategory !== 'crypto' && activeCategory !== 'realEstate' && (
              <div className="space-y-4">
                {categories[activeCategory].fields.map((field) => (
                  <div key={field.key}>
                    <div className="flex justify-between items-baseline mb-1">
                      <label className="text-sm font-medium text-gray-700">
                        {field.label}
                      </label>
                      <span className="text-sm font-bold text-[#F15F5F]">
                        {formatKoreanAmount(detailedAssets[field.key as keyof DetailedAssets] as number)}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={(detailedAssets[field.key as keyof DetailedAssets] as number) ? (detailedAssets[field.key as keyof DetailedAssets] as number).toLocaleString() : ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/,/g, '')
                          const numValue = value === '' ? 0 : Number(value)
                          if (!isNaN(numValue)) {
                            setDetailedAssets({ ...detailedAssets, [field.key]: numValue })
                          }
                        }}
                        className="w-full px-3 py-3 pr-14 rounded-lg border border-gray-200 focus:border-[#F15F5F] focus:outline-none transition-colors"
                        placeholder={field.placeholder}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                        만원
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 부동산 - 직접 입력 */}
            {activeCategory === 'realEstate' && realEstateInputMode === 'manual' && (
              <div className="space-y-4">
                {/* 보유 부동산 목록 */}
                {detailedAssets.realEstateHoldings.map((holding, index) => (
                  <div key={holding.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={holding.name}
                          onChange={(e) => updateRealEstate(index, { name: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                          placeholder="건물명 (예: 래미안자이)"
                        />
                        <select
                          value={holding.type}
                          onChange={(e) => updateRealEstate(index, { type: e.target.value as 'residential' | 'commercial' })}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                        >
                          <option value="residential">주거용</option>
                          <option value="commercial">상업용</option>
                        </select>
                        <div className="relative">
                          <input
                            type="text"
                            value={holding.value ? holding.value.toLocaleString() : ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/,/g, '')
                              const numValue = value === '' ? 0 : Number(value)
                              if (!isNaN(numValue)) {
                                updateRealEstate(index, { value: numValue })
                              }
                            }}
                            className="w-full px-3 py-2 pr-14 text-sm rounded-lg border border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                            placeholder="가액"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                            만원
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeRealEstate(index)}
                        className="ml-3 text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {holding.dealDate && (
                      <p className="text-xs text-gray-500">거래일: {holding.dealDate}</p>
                    )}
                  </div>
                ))}

                {/* 부동산 추가 버튼 */}
                <button
                  onClick={addRealEstateManual}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#F15F5F] hover:text-[#F15F5F] transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  부동산 추가
                </button>
              </div>
            )}

            {/* 부동산 - 실거래가 조회 */}
            {activeCategory === 'realEstate' && realEstateInputMode === 'search' && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800 leading-relaxed">
                    시/군/구 → 법정동 → 아파트 단지 → 평형 순서로 선택하세요.
                    법정동 선택 시 해당 지역의 최근 5년 거래 데이터를 조회합니다.
                  </p>
                </div>

                {/* Step 1: 시/도, 시/군/구 선택 */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">시/도</label>
                    <select
                      value={realEstateSearch.city}
                      onChange={(e) => {
                        setRealEstateSearch({ ...realEstateSearch, city: e.target.value, district: '', aptName: '' })
                        setApartmentList([])
                        setAreaList([])
                        setRealEstateResult(null)
                      }}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    >
                      <option value="">선택하세요</option>
                      {getCities().map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">시/군/구</label>
                    <select
                      value={realEstateSearch.district}
                      onChange={async (e) => {
                        const newDistrict = e.target.value
                        setRealEstateSearch({ ...realEstateSearch, district: newDistrict, aptName: '' })
                        setDongList([])
                        setSelectedDong('')
                        setApartmentList([])
                        setAreaList([])
                        setRealEstateResult(null)

                        // 구를 선택하면 상수에서 법정동 목록 로드 (즉시)
                        if (newDistrict && realEstateSearch.city) {
                          const lawdCd = getLawdCode(realEstateSearch.city, newDistrict)
                          if (lawdCd && hasDongData(lawdCd)) {
                            const dongs = getDongList(lawdCd)
                            setDongList(dongs)
                          } else {
                            setDongList([])
                          }
                        }
                      }}
                      disabled={!realEstateSearch.city}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-[#F15F5F] focus:outline-none disabled:bg-gray-100"
                    >
                      <option value="">선택하세요</option>
                      {realEstateSearch.city && getDistricts(realEstateSearch.city).map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Step 2: 법정동 선택 */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    법정동
                    {dongList.length > 0 && <span className="text-gray-500"> ({dongList.length}개)</span>}
                  </label>
                  <select
                    value={selectedDong}
                    onChange={(e) => handleSelectDong(e.target.value)}
                    disabled={!realEstateSearch.district || dongList.length === 0}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-[#F15F5F] focus:outline-none disabled:bg-gray-100"
                  >
                    <option value="">
                      {!realEstateSearch.district ? '구를 먼저 선택하세요' :
                       dongList.length === 0 ? '해당 지역 데이터가 없습니다' :
                       '법정동을 선택하세요 (선택 시 조회 시작)'}
                    </option>
                    {dongList.map(dong => (
                      <option key={dong} value={dong}>{dong}</option>
                    ))}
                  </select>
                </div>

                {/* Step 3: 아파트 선택 */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    아파트 단지
                    {realEstateLoading && <span className="text-gray-500 ml-1">(조회 중...)</span>}
                    {!realEstateLoading && apartmentList.length > 0 && <span className="text-gray-500"> ({apartmentList.length}개)</span>}
                  </label>
                  <select
                    value={realEstateSearch.aptName}
                    onChange={(e) => handleSelectApartment(e.target.value)}
                    disabled={!selectedDong || realEstateLoading || apartmentList.length === 0}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-[#F15F5F] focus:outline-none disabled:bg-gray-100"
                  >
                    <option value="">
                      {!selectedDong ? '법정동을 먼저 선택하세요' :
                       realEstateLoading ? '단지 목록 조회 중...' :
                       apartmentList.length === 0 ? '거래 데이터가 없습니다' :
                       '단지를 선택하세요'}
                    </option>
                    {apartmentList.map(apt => (
                      <option key={apt} value={apt}>{apt}</option>
                    ))}
                  </select>
                </div>

                {/* Step 4: 평형 선택 */}
                {areaList.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      전용면적 <span className="text-gray-500">({areaList.length}개)</span>
                    </label>
                    <select
                      value={selectedArea}
                      onChange={(e) => handleSelectArea(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    >
                      <option value="">평형을 선택하세요</option>
                      {areaList.map(area => (
                        <option key={area} value={area}>
                          {area}㎡ (약 {Math.round(parseFloat(area) * 0.3025)}평)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Step 5: 거래 결과 및 추가하기 버튼 */}
                {realEstateResult && realEstateResult.trade && (
                  <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-green-700 font-medium mb-1">✓ 최근 거래가</p>
                        <p className="text-2xl font-bold text-green-900">
                          {parseDealAmount(realEstateResult.trade.dealAmount).toLocaleString()}
                          <span className="text-sm font-normal text-green-700 ml-1">만원</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-green-800 space-y-1.5 pt-3 border-t border-green-200">
                      <p className="font-medium">{realEstateResult.trade.aptNm}</p>
                      <p className="text-green-600">
                        {realEstateSearch.city} {realEstateSearch.district} {realEstateResult.trade.umdNm}
                      </p>
                      <div className="flex gap-3 text-green-700">
                        {realEstateResult.trade.aptDong && <span>{realEstateResult.trade.aptDong}동</span>}
                        <span>{realEstateResult.trade.floor}층</span>
                        <span>{realEstateResult.trade.excluUseAr}㎡ (약 {Math.round(parseFloat(realEstateResult.trade.excluUseAr) * 0.3025)}평)</span>
                      </div>
                      <p className="text-green-600">
                        거래일: {realEstateResult.trade.dealYear}.{realEstateResult.trade.dealMonth.padStart(2, '0')}.{realEstateResult.trade.dealDay.padStart(2, '0')}
                      </p>
                    </div>
                    <button
                      onClick={handleAddRealEstate}
                      className="w-full mt-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-sm"
                    >
                      추가하기
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 암호화폐 입력 */}
            {activeCategory === 'crypto' && (
              <div className="space-y-4">
                {priceLoading && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    가격 정보를 불러오는 중...
                  </p>
                )}

                {/* 보유 중인 코인 */}
                {detailedAssets.cryptoHoldings.map((holding, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-gray-900">{holding.name}</p>
                        <p className="text-xs text-gray-500">
                          현재가: {holding.currentPrice.toLocaleString()}원
                        </p>
                      </div>
                      <button
                        onClick={() => removeCrypto(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="number"
                          step="0.000001"
                          value={holding.quantity || ''}
                          onChange={(e) => updateCryptoQuantity(index, Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                          placeholder="수량"
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">평가금액</p>
                        <p className="font-bold text-[#F15F5F]">
                          {Math.round((holding.quantity * holding.currentPrice) / 10000).toLocaleString()}만원
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 코인 추가 버튼 */}
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">코인 추가</p>
                  <div className="grid grid-cols-2 gap-2">
                    {CRYPTO_LIST.filter(
                      coin => !detailedAssets.cryptoHoldings.some(h => h.coinId === coin.id)
                    ).map(coin => (
                      <button
                        key={coin.id}
                        onClick={() => addCrypto(coin)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-[#F15F5F] hover:bg-red-50 transition-colors text-sm"
                      >
                        {coin.symbol} ({coin.name})
                      </button>
                    ))}
                  </div>
                </div>

                {detailedAssets.cryptoHoldings.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">암호화폐 총액</span>
                      <span className="text-lg font-bold text-[#F15F5F]">
                        {formatKoreanAmount(cryptoTotalManwon)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 총 자산 & 분석 버튼 */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium">총 자산</span>
            <span className="text-2xl font-bold text-[#F15F5F]">
              {formatKoreanAmount(totalAssets)}
            </span>
          </div>

          <button
            onClick={onAnalyze}
            disabled={loading || totalAssets === 0}
            className="w-full py-4 bg-[#F15F5F] text-white rounded-xl font-bold hover:bg-[#E14E4E] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '분석 중...' : '분석 시작'}
          </button>
        </div>
      </div>
    </div>
  )
}

// 결과 화면
function ResultsView({
  analysisResult,
  matchedInvestor,
  matchRate,
  onBack,
}: {
  analysisResult: AnalysisResult
  matchedInvestor: Investor
  matchRate: number
  onBack: () => void
}) {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          자산 다시 입력
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F15F5F] to-[#FFA7A7] mb-3">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              분석 완료
            </h1>
            <div className="mb-2">
              <p className="text-lg text-gray-700">
                <span className="text-2xl font-bold text-[#F15F5F] bg-[#FFF5F5] px-3 py-1 rounded-lg">
                  {matchedInvestor.name}
                </span>
                <span className="font-semibold ml-2">스타일과 가장 유사합니다</span>
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-[#F15F5F]">{matchRate.toFixed(1)}%</span>
              <span className="text-sm text-gray-600">일치</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-5 bg-gray-50 rounded-xl">
              <h3 className="text-sm font-bold text-gray-900 mb-3">현재</h3>
              <div className="space-y-2">
                {Object.entries(analysisResult.currentAllocation).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600">{key === 'realEstate' ? '부동산' : key === 'stocks' ? '주식' : key === 'bonds' ? '채권' : key === 'cash' ? '현금' : key === 'crypto' ? '암호화폐' : key}</span>
                    <span className="font-semibold text-gray-900">{value.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 bg-red-50 rounded-xl">
              <h3 className="text-sm font-bold text-gray-900 mb-3">추천</h3>
              <div className="space-y-2">
                {Object.entries(analysisResult.investor.allocation).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600">{key === 'realEstate' ? '부동산' : key === 'stocks' ? '주식' : key === 'bonds' ? '채권' : key === 'cash' ? '현금' : key === 'crypto' ? '암호화폐' : key}</span>
                    <span className="font-semibold text-[#F15F5F]">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl mb-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">조정 가이드</h3>
            <div className="space-y-2">
              {analysisResult.summary.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#F15F5F] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-sm text-gray-700">{formatTextWithCommas(item)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              {analysisResult.investor.name} 특징
            </h3>
            <div className="grid md:grid-cols-2 gap-2">
              {analysisResult.investor.characteristics.map((char, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-600 text-sm">
                  <svg className="w-4 h-4 text-[#F15F5F]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{char}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// 투자 성향 퀴즈 화면
function QuizView({
  investors,
  onComplete,
}: {
  investors: Investor[]
  onComplete: (investor: Investor) => void
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  const questions = [
    {
      question: '투자 손실을 얼마나 감수할 수 있나요?',
      icon: '📉',
      options: [
        { text: '5-10% 손실도 부담스럽다', score: [2, 0, 1, 3, 2] },
        { text: '20-30% 손실은 감수 가능', score: [3, 2, 3, 1, 1] },
        { text: '50% 이상 손실도 괜찮다', score: [1, 3, 2, 0, 0] },
      ],
    },
    {
      question: '투자 목표는 무엇인가요?',
      icon: '🎯',
      options: [
        { text: '안정적인 수익', score: [2, 0, 2, 3, 3] },
        { text: '균형 잡힌 성장', score: [3, 1, 3, 2, 2] },
        { text: '높은 수익률', score: [2, 3, 1, 0, 0] },
      ],
    },
    {
      question: '투자 기간은 어느 정도 생각하시나요?',
      icon: '⏰',
      options: [
        { text: '5년 이하 단기', score: [0, 2, 1, 1, 2] },
        { text: '5-10년 중기', score: [2, 2, 2, 2, 2] },
        { text: '10년 이상 장기', score: [3, 1, 2, 3, 2] },
      ],
    },
    {
      question: '선호하는 투자 스타일은?',
      icon: '💼',
      options: [
        { text: '시장 전체를 따라가는 인덱스', score: [1, 0, 2, 3, 1] },
        { text: '저평가된 우량 기업 발굴', score: [3, 1, 1, 1, 3] },
        { text: '성장 가능성 높은 기업', score: [1, 3, 1, 0, 0] },
        { text: '다양한 자산에 분산 투자', score: [1, 0, 3, 2, 1] },
      ],
    },
  ]

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // 퀴즈 완료 - 점수 계산
      const scores = [0, 0, 0, 0, 0]
      questions.forEach((q, qIndex) => {
        const answerIndex = newAnswers[qIndex]
        const optionScores = q.options[answerIndex].score
        optionScores.forEach((s, i) => {
          scores[i] += s
        })
      })

      const maxScore = Math.max(...scores)
      const recommendedIndex = scores.indexOf(maxScore)
      const investorIds = ['warren-buffett', 'peter-lynch', 'ray-dalio', 'john-bogle', 'benjamin-graham']
      const recommendedInvestor = investors.find(inv => inv.id === investorIds[recommendedIndex])

      if (recommendedInvestor) {
        onComplete(recommendedInvestor)
      } else if (investors.length > 0) {
        onComplete(investors[0])
      }
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-[42px] font-bold text-gray-900 mb-3">
            나와 맞는 투자 스타일 찾기
          </h1>
          <p className="text-[17px] text-gray-600">
            간단한 질문으로 투자 성향을 파악해드려요
          </p>
        </div>

        {/* 진행률 바 */}
        <div className="mb-8">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F15F5F] to-[#FFA7A7] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            {currentQuestion + 1} / {questions.length}
          </p>
        </div>

        {/* 질문 카드 */}
        <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{questions[currentQuestion].icon}</div>
            <h2 className="text-2xl font-bold text-gray-900">
              {questions[currentQuestion].question}
            </h2>
          </div>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full p-5 text-left rounded-xl border-2 border-gray-200 hover:border-[#F15F5F] hover:bg-red-50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-900 group-hover:text-[#F15F5F]">
                    {option.text}
                  </span>
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-[#F15F5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 뒤로가기 */}
        {currentQuestion > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setCurrentQuestion(currentQuestion - 1)
                setAnswers(answers.slice(0, -1))
              }}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← 이전 질문
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
