import { useState, useEffect } from "react"

function App() {
  const [activeView, setActiveView] = useState<'home' | 'portfolio' | 'calculator'>('home')

  // URL 파라미터 기반 라우팅
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const view = params.get('view')
    if (view === 'portfolio' || view === 'calculator') {
      setActiveView(view)
    } else {
      setActiveView('home')
    }
  }, [])

  const navigateTo = (view: 'home' | 'portfolio' | 'calculator') => {
    setActiveView(view)
    if (view === 'home') {
      window.history.pushState({}, '', '/')
    } else {
      window.history.pushState({}, '', `/?view=${view}`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-red-50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button
              onClick={() => navigateTo('home')}
              className="text-2xl font-bold tracking-tight text-[#F15F5F] hover:text-[#FFA7A7] transition-colors"
            >
              모아짐
            </button>
            <div className="flex gap-10">
              <button
                onClick={() => navigateTo('portfolio')}
                className={`${
                  activeView === 'portfolio' ? 'text-[#F15F5F]' : 'text-gray-400'
                } hover:text-[#F15F5F] transition-colors text-[15px] font-medium`}
              >
                포트폴리오
              </button>
              <button
                onClick={() => navigateTo('calculator')}
                className={`${
                  activeView === 'calculator' ? 'text-[#F15F5F]' : 'text-gray-400'
                } hover:text-[#F15F5F] transition-colors text-[15px] font-medium`}
              >
                세금계산
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {activeView === 'home' && <HomePage navigateTo={navigateTo} />}
        {activeView === 'portfolio' && <PortfolioPage />}
        {activeView === 'calculator' && <CalculatorPage />}
      </main>

      {/* Footer */}
      <footer className="border-t border-red-50 py-20 mt-40 bg-gradient-to-b from-white to-red-50/30">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div>
              <p className="text-2xl font-bold text-[#F15F5F] mb-2">모아짐</p>
              <p className="text-sm text-gray-500">스마트한 재테크의 시작</p>
            </div>
            <div className="flex gap-10 text-sm text-gray-500">
              <button onClick={() => setActiveView('portfolio')} className="hover:text-[#F15F5F] transition-colors font-medium">
                포트폴리오
              </button>
              <button onClick={() => setActiveView('calculator')} className="hover:text-[#F15F5F] transition-colors font-medium">
                세금계산
              </button>
            </div>
          </div>
          <div className="pt-8 border-t border-red-100">
            <p className="text-xs text-gray-400">© 2026 모아짐. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HomePage({ navigateTo }: { navigateTo: (view: 'home' | 'portfolio' | 'calculator') => void }) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-40 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-white to-pink-50/30 -z-10"></div>
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl">
            <div className="inline-block mb-6 px-4 py-2 bg-red-50 rounded-full">
              <p className="text-[#F15F5F] text-sm font-medium">당신의 자산을 스마트하게</p>
            </div>
            <h1 className="text-[64px] md:text-[84px] leading-[1.05] font-bold text-gray-900 mb-8 tracking-tight">
              재테크가
              <br />
              <span className="text-[#F15F5F]">쉬워집니다</span>
            </h1>
            <p className="text-[22px] text-gray-600 mb-14 leading-relaxed max-w-2xl">
              복잡한 포트폴리오 분석과 세금 계산을
              <br />
              단 몇 번의 클릭으로 해결하세요
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigateTo('portfolio')}
                className="group px-9 py-5 bg-[#F15F5F] text-white rounded-2xl font-semibold hover:bg-[#E14E4E] transition-all shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2">
                  포트폴리오 분석
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              <button
                onClick={() => navigateTo('calculator')}
                className="px-9 py-5 bg-white text-gray-700 rounded-2xl font-semibold border-2 border-gray-200 hover:border-[#FFA7A7] hover:text-[#F15F5F] transition-all"
              >
                세금 계산기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[42px] font-bold text-gray-900 mb-4">
              필요한 모든 기능
            </h2>
            <p className="text-[18px] text-gray-600">
              전문가 수준의 분석을 누구나 쉽게
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-red-50 to-pink-50/30 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-[#F15F5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-[22px] font-bold text-gray-900 mb-3">
                맞춤 포트폴리오
              </h3>
              <p className="text-gray-600 leading-relaxed">
                현재 자산과 개인 상황을 분석해 최적의 투자 배분을 제안합니다
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-gradient-to-br from-red-50 to-pink-50/30 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-[#F15F5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
              <h3 className="text-[22px] font-bold text-gray-900 mb-3">
                부동산 세금
              </h3>
              <p className="text-gray-600 leading-relaxed">
                양도세, 취득세 등 복잡한 부동산 세금을 현행법에 맞춰 계산합니다
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-gradient-to-br from-red-50 to-pink-50/30 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-[#F15F5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-[22px] font-bold text-gray-900 mb-3">
                즉시 결과
              </h3>
              <p className="text-gray-600 leading-relaxed">
                입력과 동시에 즉각적인 분석 결과를 확인할 수 있습니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-28 px-6 bg-gradient-to-b from-white to-red-50/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            <div>
              <p className="text-[56px] font-bold text-[#F15F5F] mb-3">간단</p>
              <p className="text-[17px] text-gray-600">복잡한 계산 없이</p>
            </div>
            <div>
              <p className="text-[56px] font-bold text-[#F15F5F] mb-3">정확</p>
              <p className="text-[17px] text-gray-600">현행 세법 반영</p>
            </div>
            <div>
              <p className="text-[56px] font-bold text-[#F15F5F] mb-3">무료</p>
              <p className="text-[17px] text-gray-600">모든 기능 무료</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#F15F5F] to-[#FFA7A7] rounded-[32px] p-16 shadow-2xl shadow-red-500/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-0"></div>
            <div className="relative z-10 text-center text-white">
              <h2 className="text-[48px] md:text-[56px] font-bold mb-6 leading-tight">
                지금 바로 시작하세요
              </h2>
              <p className="text-[20px] text-red-50 mb-12 max-w-2xl mx-auto">
                가입 없이 바로 사용 가능합니다
              </p>
              <button
                onClick={() => navigateTo('portfolio')}
                className="group px-12 py-5 bg-white text-[#F15F5F] rounded-2xl font-bold text-lg hover:bg-red-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <span className="flex items-center gap-2 justify-center">
                  시작하기
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

interface Investor {
  id: string
  name: string
  nameEn: string
  description: string
  style: string
  allocation: any
  characteristics: string[]
}

interface AnalysisResult {
  investor: Investor
  totalAssets: number
  currentAllocation: any
  recommendations: any
  adjustments: any
  summary: string[]
}

function PortfolioPage() {
  const [step, setStep] = useState<'select-investor' | 'input-assets' | 'results'>('select-investor')
  const [investors, setInvestors] = useState<Investor[]>([])
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null)
  // 만원 단위로 저장
  const [assetsInManwon, setAssetsInManwon] = useState({
    cash: 0,
    stocks: 0,
    bonds: 0,
    realEstate: 0,
    crypto: 0,
  })
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)

  // 만원을 한국어로 변환하는 함수
  const formatKoreanAmount = (manwon: number): string => {
    if (manwon === 0) return '0원'

    const eok = Math.floor(manwon / 10000)
    const man = manwon % 10000
    const cheon = Math.floor(man / 1000)
    const baek = Math.floor((man % 1000) / 100)
    const sip = Math.floor((man % 100) / 10)
    const il = man % 10

    let result = ''

    if (eok > 0) {
      if (eok === 1) result += '1억'
      else result += `${eok}억`
    }

    if (cheon > 0) {
      if (result) result += ' '
      if (cheon === 1) result += '1천만'
      else result += `${cheon}천만`
    }

    if (baek > 0) {
      if (result) result += ' '
      if (baek === 1) result += '1백만'
      else result += `${baek}백만`
    }

    if (sip > 0) {
      if (result) result += ' '
      if (sip === 1) result += '10만'
      else result += `${sip * 10}만`
    }

    if (il > 0 || (!eok && !cheon && !baek && !sip)) {
      if (result) result += ' '
      if (il > 0) result += `${il}만`
    }

    return result + '원'
  }

  // 투자자 목록 불러오기
  useEffect(() => {
    fetch('/api/portfolio/investors')
      .then(res => res.json())
      .then(data => setInvestors(data.investors))
      .catch(err => console.error('Failed to load investors:', err))
  }, [])

  const handleInvestorSelect = (investor: Investor) => {
    setSelectedInvestor(investor)
    setStep('input-assets')
  }

  const handleAnalyze = async () => {
    if (!selectedInvestor) return

    // 만원을 원으로 변환
    const assetsInWon = {
      cash: assetsInManwon.cash * 10000,
      stocks: assetsInManwon.stocks * 10000,
      bonds: assetsInManwon.bonds * 10000,
      realEstate: assetsInManwon.realEstate * 10000,
      crypto: assetsInManwon.crypto * 10000,
    }

    setLoading(true)
    try {
      const response = await fetch('/api/portfolio/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assets: assetsInWon,
          investorId: selectedInvestor.id,
        }),
      })

      const data = await response.json()
      setAnalysisResult(data)
      setStep('results')
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `${(amount / 10000).toFixed(0)}만원`
  }

  if (step === 'select-investor') {
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
                onClick={() => handleInvestorSelect(investor)}
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

  if (step === 'input-assets') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-red-50/20 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setStep('select-investor')}
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
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    현금
                  </label>
                  <span className="text-lg font-bold text-[#F15F5F]">
                    {formatKoreanAmount(assetsInManwon.cash)}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={assetsInManwon.cash || ''}
                    onChange={(e) => setAssetsInManwon({ ...assetsInManwon, cash: Number(e.target.value) })}
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg transition-colors"
                    placeholder="1000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    만원
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    주식
                  </label>
                  <span className="text-lg font-bold text-[#F15F5F]">
                    {formatKoreanAmount(assetsInManwon.stocks)}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={assetsInManwon.stocks || ''}
                    onChange={(e) => setAssetsInManwon({ ...assetsInManwon, stocks: Number(e.target.value) })}
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg transition-colors"
                    placeholder="5000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    만원
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    채권
                  </label>
                  <span className="text-lg font-bold text-[#F15F5F]">
                    {formatKoreanAmount(assetsInManwon.bonds)}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={assetsInManwon.bonds || ''}
                    onChange={(e) => setAssetsInManwon({ ...assetsInManwon, bonds: Number(e.target.value) })}
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg transition-colors"
                    placeholder="2000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    만원
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    부동산
                  </label>
                  <span className="text-lg font-bold text-[#F15F5F]">
                    {formatKoreanAmount(assetsInManwon.realEstate)}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={assetsInManwon.realEstate || ''}
                    onChange={(e) => setAssetsInManwon({ ...assetsInManwon, realEstate: Number(e.target.value) })}
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg transition-colors"
                    placeholder="10000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    만원
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    암호화폐
                  </label>
                  <span className="text-lg font-bold text-[#F15F5F]">
                    {formatKoreanAmount(assetsInManwon.crypto)}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={assetsInManwon.crypto || ''}
                    onChange={(e) => setAssetsInManwon({ ...assetsInManwon, crypto: Number(e.target.value) })}
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg transition-colors"
                    placeholder="500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    만원
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600 font-medium">총 자산</span>
                <span className="text-[28px] font-bold text-[#F15F5F]">
                  {formatKoreanAmount(Object.values(assetsInManwon).reduce((a, b) => a + b, 0))}
                </span>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading || Object.values(assetsInManwon).reduce((a, b) => a + b, 0) === 0}
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

  if (step === 'results' && analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-red-50/20 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setStep('input-assets')}
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
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">주식</span>
                    <span className="font-bold text-gray-900">{analysisResult.currentAllocation.stocks.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">채권</span>
                    <span className="font-bold text-gray-900">{analysisResult.currentAllocation.bonds.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">현금</span>
                    <span className="font-bold text-gray-900">{analysisResult.currentAllocation.cash.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">부동산</span>
                    <span className="font-bold text-gray-900">{analysisResult.currentAllocation.realEstate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-[#F15F5F]/10 to-[#FFA7A7]/10 rounded-2xl border-2 border-[#F15F5F]/20">
                <h3 className="text-lg font-bold text-gray-900 mb-4">추천 자산 배분</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">주식</span>
                    <span className="font-bold text-[#F15F5F]">{analysisResult.investor.allocation.stocks}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">채권</span>
                    <span className="font-bold text-[#F15F5F]">{analysisResult.investor.allocation.bonds}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">현금</span>
                    <span className="font-bold text-[#F15F5F]">{analysisResult.investor.allocation.cash}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">부동산</span>
                    <span className="font-bold text-[#F15F5F]">{analysisResult.investor.allocation.realEstate}%</span>
                  </div>
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
              onClick={() => {
                setStep('select-investor')
                setAnalysisResult(null)
              }}
              className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-[#F15F5F] hover:text-[#F15F5F] transition-all"
            >
              새로운 분석 시작
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

function CalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">부동산 세금 계산기</h1>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <p className="text-gray-600 text-center py-12">
          부동산 계산기 기능은 곧 추가됩니다...
        </p>
      </div>
    </div>
  )
}

export default App
