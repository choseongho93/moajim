// import AdBanner from '../components/AdBanner'
// import AdInfeed from '../components/AdInfeed'

interface HomePageProps {
  navigateTo: (view: 'home' | 'portfolio' | 'calculator' | 'tools' | 'property-tax' | 'finance', subView?: string) => void
}

export default function HomePage({ navigateTo }: HomePageProps) {
  return (
    <>
      {/* Hero — 컴팩트 */}
      <section className="pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-[32px] sm:text-[44px] md:text-[52px] leading-[1.1] font-bold text-gray-900 mb-2 tracking-tight">
            재테크 도구가 <span className="text-[#F15F5F]">모아짐</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            세금 계산부터 대출 비교까지, 가입 없이 무료로
          </p>
        </div>
      </section>

      {/* HOT 배너 */}
      <section className="px-4 sm:px-6 mb-8 sm:mb-10">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigateTo('property-tax')}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-[#F15F5F] to-[#FF8A8A] rounded-2xl p-5 sm:p-6 shadow-lg shadow-red-500/15 hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="inline-block px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] sm:text-xs font-bold rounded-full">
                      HOT
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">2026 보유세 예측하기</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-red-100">
                    현행법 vs 2021년 최고점 비교 + 미래 시나리오 모의 계산
                  </p>
                </div>
              </div>
              <svg className="w-6 h-6 text-white/70 group-hover:translate-x-1 group-hover:text-white transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </section>

      {/* Ad Banner - 상단 광고 영역 */}
      {/* 애드센스 승인 후 주석 해제 */}
      {/*
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <AdBanner slot="YOUR_AD_SLOT_ID" format="horizontal" responsive />
      </div>
      */}

      {/* 세금 계산기 */}
      <section className="px-4 sm:px-6 mb-8 sm:mb-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">세금 계산기</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <MiniCard onClick={() => navigateTo('calculator', 'gift-tax')} label="증여세" />
            <MiniCard onClick={() => navigateTo('calculator', 'inheritance-tax')} label="상속세" />
            <MiniCard onClick={() => navigateTo('calculator', 'acquisition-tax')} label="취득세" />
            <MiniCard onClick={() => navigateTo('calculator', 'holding-tax')} label="보유세" />
            <MiniCard onClick={() => navigateTo('calculator', 'capital-gains-tax')} label="양도소득세" />
          </div>
        </div>
      </section>

      {/* 부동산 도구 */}
      <section className="px-4 sm:px-6 mb-8 sm:mb-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">부동산 도구</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <MiniCard onClick={() => navigateTo('tools', 'brokerage-fee')} label="중개보수" />
            <MiniCard onClick={() => navigateTo('tools', 'lawyer-fee')} label="법무사 보수료" />
            <MiniCard onClick={() => navigateTo('tools', 'rent-conversion')} label="전월세 전환" />
            <MiniCard onClick={() => navigateTo('property-tax')} label="2026 보유세 예측" badge="HOT" />
          </div>
        </div>
      </section>

      {/* Ad Infeed - 중간 광고 영역 */}
      {/* 애드센스 승인 후 주석 해제 */}
      {/*
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <AdInfeed slot="YOUR_AD_SLOT_ID" />
      </div>
      */}

      {/* 금융 계산기 */}
      <section className="px-4 sm:px-6 mb-8 sm:mb-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">금융 계산기</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <MiniCard onClick={() => navigateTo('finance', 'loan-interest')} label="대출 이자" />
            <MiniCard onClick={() => navigateTo('finance', 'mortgage-loan')} label="담보 대출 가능액" />
            <MiniCard onClick={() => navigateTo('finance', 'savings-interest')} label="예적금 이자" />
            <MiniCard onClick={() => navigateTo('finance', 'early-repayment')} label="중도상환수수료" />
            <MiniCard onClick={() => navigateTo('finance', 'loan-refinance')} label="대출 대환" badge="NEW" />
            <MiniCard onClick={() => navigateTo('finance', 'estimated-income')} label="추정소득" />
            <MiniCard onClick={() => navigateTo('finance', 'auction-loan')} label="경락잔금대출 한도" />
            <MiniCard onClick={() => navigateTo('finance', 'jeonse-guarantee')} label="전세보증보험" />
          </div>
        </div>
      </section>

      {/* 자산 분석 */}
      <section className="px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigateTo('portfolio', 'analysis')}
            className="w-full group text-left p-5 sm:p-6 rounded-2xl border-2 border-gray-200 hover:border-[#F15F5F] hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[#F15F5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">자산 포트폴리오 분석</h3>
                  <p className="text-xs sm:text-sm text-gray-500">보유 자산을 투자 대가들의 포트폴리오와 비교 분석</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </section>
    </>
  )
}

// 컴팩트 카드 컴포넌트
function MiniCard({ onClick, label, badge }: {
  onClick: () => void
  label: string
  badge?: string
}) {
  return (
    <button
      onClick={onClick}
      className="group relative px-4 py-3.5 sm:py-4 rounded-xl bg-white border border-gray-200 hover:border-[#F15F5F] hover:shadow-md transition-all text-left"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm sm:text-[15px] font-medium text-gray-800 group-hover:text-[#F15F5F] transition-colors">{label}</span>
        {badge && (
          <span className={`flex-shrink-0 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
            badge === 'HOT' ? 'bg-yellow-400 text-yellow-900' : 'bg-blue-100 text-blue-600'
          }`}>
            {badge}
          </span>
        )}
      </div>
    </button>
  )
}
