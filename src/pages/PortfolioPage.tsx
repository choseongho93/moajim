import { useState, useEffect } from 'react'
import type { Investor, Assets, AnalysisResult, DetailedAssets, CryptoHolding } from '../types/portfolio'
import { fetchInvestors, analyzePortfolio } from '../api/portfolio'
import { formatKoreanAmount } from '../utils/currency'
import { getCryptoPrices, CRYPTO_LIST } from '../api/prices'

interface PortfolioPageProps {
  initialSubView?: string
}

export default function PortfolioPage({ initialSubView }: PortfolioPageProps) {
  // initialSubView가 quiz면 quiz, 아니면 select-investor
  const getInitialStep = () => {
    if (initialSubView === 'quiz') return 'quiz'
    return 'select-investor'
  }

  const [step, setStep] = useState<'quiz' | 'select-investor' | 'input-assets' | 'results'>(getInitialStep())
  const [investors, setInvestors] = useState<Investor[]>([])
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null)
  const [detailedAssets, setDetailedAssets] = useState<DetailedAssets>({
    deposit: 0,
    savings: 0,
    cma: 0,
    domesticStocks: 0,
    foreignStocks: 0,
    etf: 0,
    governmentBonds: 0,
    corporateBonds: 0,
    residential: 0,
    commercial: 0,
    reits: 0,
    cryptoHoldings: [],
  })
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchInvestors()
      .then(data => setInvestors(data))
      .catch(err => console.error('Failed to load investors:', err))
  }, [])

  const handleInvestorSelect = (investor: Investor) => {
    setSelectedInvestor(investor)
    setStep('input-assets')
  }

  const handleAnalyze = async () => {
    if (!selectedInvestor) return

    // 암호화폐 총액 계산 (원화)
    const cryptoTotalKRW = detailedAssets.cryptoHoldings.reduce(
      (sum, holding) => sum + holding.quantity * holding.currentPrice,
      0
    )

    // 세부 자산을 카테고리별로 합산
    const aggregatedAssets: Assets = {
      cash: (detailedAssets.deposit + detailedAssets.savings + detailedAssets.cma) * 10000,
      stocks: (detailedAssets.domesticStocks + detailedAssets.foreignStocks + detailedAssets.etf) * 10000,
      bonds: (detailedAssets.governmentBonds + detailedAssets.corporateBonds) * 10000,
      realEstate: (detailedAssets.residential + detailedAssets.commercial + detailedAssets.reits) * 10000,
      crypto: cryptoTotalKRW,
    }

    setLoading(true)
    try {
      const data = await analyzePortfolio(aggregatedAssets, selectedInvestor.id)
      setAnalysisResult(data)
      setStep('results')
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'quiz') {
    return <QuizView investors={investors} onComplete={handleInvestorSelect} />
  }

  if (step === 'select-investor') {
    return <InvestorSelectionView investors={investors} onSelect={handleInvestorSelect} />
  }

  if (step === 'input-assets') {
    return (
      <AssetInputView
        selectedInvestor={selectedInvestor}
        detailedAssets={detailedAssets}
        setDetailedAssets={setDetailedAssets}
        loading={loading}
        onAnalyze={handleAnalyze}
        onBack={() => setStep('select-investor')}
      />
    )
  }

  if (step === 'results' && analysisResult) {
    return (
      <ResultsView
        analysisResult={analysisResult}
        onBack={() => setStep('input-assets')}
        onRestart={() => {
          setStep('select-investor')
          setAnalysisResult(null)
        }}
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
  selectedInvestor,
  detailedAssets,
  setDetailedAssets,
  loading,
  onAnalyze,
  onBack,
}: {
  selectedInvestor: Investor | null
  detailedAssets: DetailedAssets
  setDetailedAssets: (assets: DetailedAssets) => void
  loading: boolean
  onAnalyze: () => void
  onBack: () => void
}) {
  const [activeCategory, setActiveCategory] = useState<'cash' | 'stocks' | 'bonds' | 'realEstate' | 'crypto'>('cash')
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({})
  const [priceLoading, setPriceLoading] = useState(false)

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
        { key: 'cma', label: 'CMA/MMF', placeholder: '200' },
      ],
    },
    stocks: {
      label: '주식',
      icon: '📈',
      fields: [
        { key: 'domesticStocks', label: '국내주식', placeholder: '2000' },
        { key: 'foreignStocks', label: '해외주식', placeholder: '1500' },
        { key: 'etf', label: 'ETF', placeholder: '1000' },
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
      label: '부동산',
      icon: '🏠',
      fields: [
        { key: 'residential', label: '주거용', placeholder: '10000' },
        { key: 'commercial', label: '상업용', placeholder: '5000' },
        { key: 'reits', label: 'REITs', placeholder: '500' },
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

  const cryptoTotalKRW = detailedAssets.cryptoHoldings.reduce(
    (sum, holding) => sum + holding.quantity * holding.currentPrice,
    0
  )
  const cryptoTotalManwon = Math.round(cryptoTotalKRW / 10000)

  const totalAssets =
    detailedAssets.deposit +
    detailedAssets.savings +
    detailedAssets.cma +
    detailedAssets.domesticStocks +
    detailedAssets.foreignStocks +
    detailedAssets.etf +
    detailedAssets.governmentBonds +
    detailedAssets.corporateBonds +
    detailedAssets.residential +
    detailedAssets.commercial +
    detailedAssets.reits +
    cryptoTotalManwon

  const categoryTotals = {
    cash: detailedAssets.deposit + detailedAssets.savings + detailedAssets.cma,
    stocks: detailedAssets.domesticStocks + detailedAssets.foreignStocks + detailedAssets.etf,
    bonds: detailedAssets.governmentBonds + detailedAssets.corporateBonds,
    realEstate: detailedAssets.residential + detailedAssets.commercial + detailedAssets.reits,
    crypto: cryptoTotalManwon,
  }

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
          전략 다시 선택
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F15F5F] to-[#FFA7A7] flex items-center justify-center">
              <span className="text-lg text-white font-bold">
                {selectedInvestor?.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {selectedInvestor?.name}
              </h2>
              <p className="text-xs text-gray-500">{selectedInvestor?.style}</p>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              보유 자산 입력
            </h3>

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

            {/* 일반 자산 입력 필드 */}
            {activeCategory !== 'crypto' && (
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
                        type="number"
                        value={(detailedAssets[field.key as keyof DetailedAssets] as number) || ''}
                        onChange={(e) =>
                          setDetailedAssets({ ...detailedAssets, [field.key]: Number(e.target.value) })
                        }
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
                          {Math.round((holding.quantity * holding.currentPrice) / 10000)}만원
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

// 결과 화면 (동일)
function ResultsView({
  analysisResult,
  onBack,
  onRestart,
}: {
  analysisResult: AnalysisResult
  onBack: () => void
  onRestart: () => void
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              분석 완료
            </h1>
            <p className="text-sm text-gray-600">
              {analysisResult.investor.name} 전략 기반
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-5 bg-gray-50 rounded-xl">
              <h3 className="text-sm font-bold text-gray-900 mb-3">현재</h3>
              <div className="space-y-2">
                {Object.entries(analysisResult.currentAllocation).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600">{key === 'realEstate' ? '부동산' : key === 'stocks' ? '주식' : key === 'bonds' ? '채권' : key === 'cash' ? '현금' : key}</span>
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
                    <span className="text-gray-600">{key === 'realEstate' ? '부동산' : key === 'stocks' ? '주식' : key === 'bonds' ? '채권' : key === 'cash' ? '현금' : key}</span>
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
                  <p className="text-sm text-gray-700">{item}</p>
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

        <div className="text-center mt-6">
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:border-[#F15F5F] hover:text-[#F15F5F] transition-all text-sm"
          >
            새로운 분석
          </button>
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
