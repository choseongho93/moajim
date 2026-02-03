import { useState, useEffect } from 'react'
import type { Investor, Assets, AnalysisResult } from '../types/portfolio'
import { fetchInvestors, analyzePortfolio } from '../api/portfolio'
import { formatKoreanAmount, formatCurrency } from '../utils/currency'

export default function PortfolioPage() {
  const [step, setStep] = useState<'select-investor' | 'input-assets' | 'results'>('select-investor')
  const [investors, setInvestors] = useState<Investor[]>([])
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null)
  const [assetsInManwon, setAssetsInManwon] = useState<Assets>({
    cash: 0,
    stocks: 0,
    bonds: 0,
    realEstate: 0,
    crypto: 0,
  })
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)

  // 투자자 목록 불러오기
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

    // 만원을 원으로 변환
    const assetsInWon: Assets = {
      cash: assetsInManwon.cash * 10000,
      stocks: assetsInManwon.stocks * 10000,
      bonds: assetsInManwon.bonds * 10000,
      realEstate: assetsInManwon.realEstate * 10000,
      crypto: assetsInManwon.crypto * 10000,
    }

    setLoading(true)
    try {
      const data = await analyzePortfolio(assetsInWon, selectedInvestor.id)
      setAnalysisResult(data)
      setStep('results')
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'select-investor') {
    return <InvestorSelectionView investors={investors} onSelect={handleInvestorSelect} />
  }

  if (step === 'input-assets') {
    return (
      <AssetInputView
        selectedInvestor={selectedInvestor}
        assetsInManwon={assetsInManwon}
        setAssetsInManwon={setAssetsInManwon}
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
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50/20 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-[48px] font-bold text-gray-900 mb-4">
            투자 스타일 선택
          </h1>
          <p className="text-[18px] text-gray-600">
            세계적인 투자자의 전략을 따라 포트폴리오를 구성하세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investors.map((investor) => (
            <button
              key={investor.id}
              onClick={() => onSelect(investor)}
              className="group text-left p-8 bg-white rounded-3xl border-2 border-gray-100 hover:border-[#F15F5F] transition-all hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1"
            >
              <div className="mb-4">
                <h3 className="text-[24px] font-bold text-gray-900 mb-1">
                  {investor.name}
                </h3>
                <p className="text-sm text-gray-500">{investor.nameEn}</p>
              </div>
              <p className="text-[13px] px-3 py-1 bg-red-50 text-[#F15F5F] rounded-full inline-block mb-4 font-medium">
                {investor.style}
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                {investor.description}
              </p>
              <div className="flex items-center text-[#F15F5F] font-medium group-hover:gap-2 transition-all">
                선택하기
                <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  assetsInManwon,
  setAssetsInManwon,
  loading,
  onAnalyze,
  onBack,
}: {
  selectedInvestor: Investor | null
  assetsInManwon: Assets
  setAssetsInManwon: (assets: Assets) => void
  loading: boolean
  onAnalyze: () => void
  onBack: () => void
}) {
  const totalAssets = Object.values(assetsInManwon).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50/20 py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#F15F5F] mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          투자자 다시 선택
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F15F5F] to-[#FFA7A7] flex items-center justify-center">
              <span className="text-2xl text-white font-bold">
                {selectedInvestor?.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-[28px] font-bold text-gray-900">
                {selectedInvestor?.name}
              </h2>
              <p className="text-sm text-gray-500">{selectedInvestor?.style}</p>
            </div>
          </div>

          <h3 className="text-[22px] font-bold text-gray-900 mb-6">
            보유 자산을 입력하세요
          </h3>

          <div className="space-y-6">
            {Object.entries({
              cash: '현금',
              stocks: '주식',
              bonds: '채권',
              realEstate: '부동산',
              crypto: '암호화폐',
            }).map(([key, label]) => (
              <div key={key}>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <span className="text-lg font-bold text-[#F15F5F]">
                    {formatKoreanAmount(assetsInManwon[key as keyof Assets])}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={assetsInManwon[key as keyof Assets] || ''}
                    onChange={(e) =>
                      setAssetsInManwon({ ...assetsInManwon, [key]: Number(e.target.value) })
                    }
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg transition-colors"
                    placeholder={key === 'realEstate' ? '10000' : key === 'stocks' ? '5000' : '1000'}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    만원
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 font-medium">총 자산</span>
              <span className="text-[28px] font-bold text-[#F15F5F]">
                {formatKoreanAmount(totalAssets)}
              </span>
            </div>

            <button
              onClick={onAnalyze}
              disabled={loading || totalAssets === 0}
              className="w-full py-5 bg-gradient-to-r from-[#F15F5F] to-[#FFA7A7] text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '분석 중...' : '포트폴리오 분석하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 결과 화면
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
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50/20 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#F15F5F] mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          자산 다시 입력
        </button>

        <div className="bg-white rounded-3xl p-10 shadow-xl mb-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#F15F5F] to-[#FFA7A7] mb-4">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-[42px] font-bold text-gray-900 mb-3">
              분석 완료
            </h1>
            <p className="text-[18px] text-gray-600">
              {analysisResult.investor.name} 스타일에 맞춘 포트폴리오 추천
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50/30 rounded-2xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4">현재 자산 배분</h3>
              <div className="space-y-3">
                {Object.entries(analysisResult.currentAllocation).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-gray-600 capitalize">{key === 'realEstate' ? '부동산' : key === 'stocks' ? '주식' : key === 'bonds' ? '채권' : key === 'cash' ? '현금' : key}</span>
                    <span className="font-bold text-gray-900">{value.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-[#F15F5F]/10 to-[#FFA7A7]/10 rounded-2xl border-2 border-[#F15F5F]/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">추천 자산 배분</h3>
              <div className="space-y-3">
                {Object.entries(analysisResult.investor.allocation).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-gray-600 capitalize">{key === 'realEstate' ? '부동산' : key === 'stocks' ? '주식' : key === 'bonds' ? '채권' : key === 'cash' ? '현금' : key}</span>
                    <span className="font-bold text-[#F15F5F]">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 bg-gray-50 rounded-2xl mb-8">
            <h3 className="text-[22px] font-bold text-gray-900 mb-6">조정 가이드</h3>
            <div className="space-y-3">
              {analysisResult.summary.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F15F5F] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 text-[15px]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {analysisResult.investor.name}의 투자 특징
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {analysisResult.investor.characteristics.map((char, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-[#F15F5F]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{char}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onRestart}
            className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-[#F15F5F] hover:text-[#F15F5F] transition-all"
          >
            새로운 분석 시작
          </button>
        </div>
      </div>
    </div>
  )
}
