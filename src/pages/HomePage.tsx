interface HomePageProps {
  navigateTo: (view: 'home' | 'portfolio' | 'calculator') => void
}

export default function HomePage({ navigateTo }: HomePageProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 md:pt-32 pb-24 sm:pb-32 md:pb-40 px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-white to-pink-50/30 -z-10"></div>
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl">
            <div className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-50 rounded-full">
              <p className="text-[#F15F5F] text-xs sm:text-sm font-medium">당신의 자산을 스마트하게</p>
            </div>
            <h1 className="text-[40px] sm:text-[56px] md:text-[64px] lg:text-[84px] leading-[1.1] sm:leading-[1.05] font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 tracking-tight">
              재테크가
              <br />
              <span className="text-[#F15F5F]">쉬워집니다</span>
            </h1>
            <p className="text-base sm:text-lg md:text-[22px] text-gray-600 mb-8 sm:mb-12 md:mb-14 leading-relaxed max-w-2xl">
              포트폴리오 분석, 쉽고 빠르게
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => navigateTo('portfolio')}
                className="group px-6 sm:px-8 md:px-9 py-4 sm:py-5 bg-[#F15F5F] text-white rounded-xl sm:rounded-2xl font-semibold hover:bg-[#E14E4E] transition-all shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center gap-2">
                  포트폴리오 분석
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              <button
                onClick={() => navigateTo('calculator')}
                className="px-6 sm:px-8 md:px-9 py-4 sm:py-5 bg-white text-gray-700 rounded-xl sm:rounded-2xl font-semibold border-2 border-gray-200 hover:border-[#FFA7A7] hover:text-[#F15F5F] transition-all"
              >
                세금 계산기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-[42px] font-bold text-gray-900 mb-3 sm:mb-4">
              필요한 모든 기능
            </h2>
            <p className="text-sm sm:text-base md:text-[18px] text-gray-600">
              전문가 수준의 분석을 누구나 쉽게
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="group p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-50 to-pink-50/30 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#F15F5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-[22px] font-bold text-gray-900 mb-2 sm:mb-3">
                맞춤 포트폴리오
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                현재 자산과 개인 상황을 분석해 최적의 투자 배분을 제안합니다
              </p>
            </div>

            <div className="group p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-50 to-pink-50/30 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#F15F5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-[22px] font-bold text-gray-900 mb-2 sm:mb-3">
                부동산 세금
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                양도세, 취득세 등 복잡한 부동산 세금을 현행법에 맞춰 계산합니다
              </p>
            </div>

            <div className="group p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-50 to-pink-50/30 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#F15F5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-[22px] font-bold text-gray-900 mb-2 sm:mb-3">
                즉시 결과
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                입력과 동시에 즉각적인 분석 결과를 확인할 수 있습니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 bg-gradient-to-b from-white to-red-50/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-8 sm:gap-12 md:gap-16 text-center">
            <div>
              <p className="text-3xl sm:text-4xl md:text-[56px] font-bold text-[#F15F5F] mb-2 sm:mb-3">간단</p>
              <p className="text-xs sm:text-sm md:text-[17px] text-gray-600">복잡한 계산 없이</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl md:text-[56px] font-bold text-[#F15F5F] mb-2 sm:mb-3">정확</p>
              <p className="text-xs sm:text-sm md:text-[17px] text-gray-600">현행 세법 반영</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl md:text-[56px] font-bold text-[#F15F5F] mb-2 sm:mb-3">무료</p>
              <p className="text-xs sm:text-sm md:text-[17px] text-gray-600">모든 기능 무료</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#F15F5F] to-[#FFA7A7] rounded-2xl sm:rounded-3xl md:rounded-[32px] p-8 sm:p-12 md:p-16 shadow-2xl shadow-red-500/20">
            <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl -z-0"></div>
            <div className="relative z-10 text-center text-white">
              <h2 className="text-3xl sm:text-4xl md:text-[48px] lg:text-[56px] font-bold mb-4 sm:mb-6 leading-tight">
                지금 바로 시작하세요
              </h2>
              <p className="text-sm sm:text-base md:text-[20px] text-red-50 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto">
                가입 없이 바로 사용 가능합니다
              </p>
              <button
                onClick={() => navigateTo('portfolio')}
                className="group px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-white text-[#F15F5F] rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-red-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <span className="flex items-center gap-2 justify-center">
                  시작하기
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
