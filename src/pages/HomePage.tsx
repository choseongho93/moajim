// import AdBanner from '../components/AdBanner'
// import AdInfeed from '../components/AdInfeed'

interface HomePageProps {
  navigateTo: (view: 'home' | 'portfolio' | 'calculator', subView?: string) => void
}

export default function HomePage({ navigateTo }: HomePageProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-white to-pink-50/30 -z-10"></div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 bg-red-50 rounded-full">
              <p className="text-[#F15F5F] text-xs sm:text-sm font-medium">재테크 필수 도구를 한 곳에</p>
            </div>
            <h1 className="text-[36px] sm:text-[48px] md:text-[60px] leading-[1.1] font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
              재테크 도구가
              <br />
              <span className="text-[#F15F5F]">모아짐</span>
            </h1>
            <p className="text-base sm:text-lg md:text-[20px] text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              포트폴리오 분석부터 세금 계산까지,<br className="sm:hidden" />
              필요한 모든 재테크 도구를 무료로
            </p>
          </div>
        </div>
      </section>

      {/* Ad Banner - 상단 광고 영역 */}
      {/* 애드센스 승인 후 주석 해제 */}
      {/*
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
        <AdBanner slot="YOUR_AD_SLOT_ID" format="horizontal" responsive />
      </div>
      */}

      {/* Tools Grid */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-[36px] font-bold text-gray-900 mb-2 sm:mb-3">
              모아짐에서 할 수 있는 일
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              지금 바로 사용할 수 있는 재테크 도구들
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* 포트폴리오 분석 */}
            <button
              onClick={() => navigateTo('portfolio', 'analysis')}
              className="group text-left p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-[#F15F5F] hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[#F15F5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">자산 분석</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                보유 자산을 입력하면 투자 대가들의 포트폴리오와 비교하여 맞춤 조언을 제공합니다
              </p>
              <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                사용가능
              </span>
            </button>

            {/* 증여세 계산기 */}
            <button
              onClick={() => navigateTo('calculator', 'gift-tax')}
              className="group text-left p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-[#F15F5F] hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[#F15F5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">증여세 계산기</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                가족 간 증여 시 발생하는 증여세를 현행 세법에 맞춰 정확하게 계산합니다
              </p>
              <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                사용가능
              </span>
            </button>

            {/* 상속세 계산기 */}
            <button
              onClick={() => navigateTo('calculator', 'inheritance-tax')}
              className="group text-left p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-[#F15F5F] hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[#F15F5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">상속세 계산기</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                상속 재산에 대한 세금을 배우자, 자녀 등 상속인별로 상세하게 계산합니다
              </p>
              <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                사용가능
              </span>
            </button>

            {/* 취득세 계산기 - 준비중 */}
            <div className="p-6 rounded-2xl bg-gray-50 border-2 border-gray-200 opacity-60">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">취득세 계산기</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                부동산 구매 시 내야 하는 취득세를 간편하게 계산합니다
              </p>
              <span className="inline-block px-2 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                준비중
              </span>
            </div>

            {/* 양도세 계산기 - 준비중 */}
            <div className="p-6 rounded-2xl bg-gray-50 border-2 border-gray-200 opacity-60">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">양도세 계산기</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                부동산 매도 시 발생하는 양도소득세를 계산합니다
              </p>
              <span className="inline-block px-2 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                준비중
              </span>
            </div>

            {/* 종부세 계산기 - 준비중 */}
            <div className="p-6 rounded-2xl bg-gray-50 border-2 border-gray-200 opacity-60">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">종부세 계산기</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                고가 부동산 보유 시 발생하는 종합부동산세를 계산합니다
              </p>
              <span className="inline-block px-2 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                준비중
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Infeed - 중간 광고 영역 */}
      {/* 애드센스 승인 후 주석 해제 */}
      {/*
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <AdInfeed slot="YOUR_AD_SLOT_ID" />
      </div>
      */}

      {/* Features */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-white to-red-50/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-[36px] font-bold text-gray-900 mb-2 sm:mb-3">
              왜 모아짐인가요?
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#F15F5F] to-[#FFA7A7] flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">간편하고 빠르게</h3>
              <p className="text-sm text-gray-600">
                복잡한 계산 없이 필요한 정보만 입력하면 즉시 결과를 확인할 수 있습니다
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#F15F5F] to-[#FFA7A7] flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">정확한 계산</h3>
              <p className="text-sm text-gray-600">
                현행 세법을 정확히 반영하여 신뢰할 수 있는 계산 결과를 제공합니다
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#F15F5F] to-[#FFA7A7] flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">완전 무료</h3>
              <p className="text-sm text-gray-600">
                회원가입 없이 모든 기능을 무료로 제한 없이 사용할 수 있습니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#F15F5F] to-[#FFA7A7] rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-2xl shadow-red-500/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative text-center text-white">
              <h2 className="text-2xl sm:text-3xl md:text-[40px] font-bold mb-3 sm:mb-4 leading-tight">
                지금 바로 시작하세요
              </h2>
              <p className="text-sm sm:text-base md:text-[18px] text-red-50 mb-6 sm:mb-8">
                가입 없이 바로 사용 가능합니다
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigateTo('portfolio', 'analysis')}
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#F15F5F] rounded-xl font-bold hover:bg-red-50 transition-all shadow-xl"
                >
                  <span className="flex items-center gap-2 justify-center">
                    자산 분석하기
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
                <button
                  onClick={() => navigateTo('calculator', 'gift-tax')}
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/10 text-white rounded-xl font-bold border-2 border-white/30 hover:bg-white/20 transition-all"
                >
                  세금 계산하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
