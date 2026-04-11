// import AdBanner from '../components/AdBanner'
// import AdInfeed from '../components/AdInfeed'

interface HomePageProps {
  navigateTo: (view: 'home' | 'portfolio' | 'calculator' | 'tools' | 'property-tax' | 'finance', subView?: string) => void
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

      {/* HOT 배너 - 2026 보유세 예측하기 */}
      <section className="px-4 sm:px-6 -mt-8 sm:-mt-10 mb-8 sm:mb-12 relative z-10">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
        <AdBanner slot="YOUR_AD_SLOT_ID" format="horizontal" responsive />
      </div>
      */}

      {/* 인기 도구 TOP 9 */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
              <h2 className="text-2xl sm:text-3xl md:text-[36px] font-bold text-gray-900">
                인기 도구 TOP 9
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              가장 많이 사용되는 재테크 도구를 모았습니다
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* 1. 보유세 예측 */}
            <ToolCard
              onClick={() => navigateTo('property-tax')}
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
              title="2026 보유세 예측"
              desc="현행법과 과거 최고점을 비교하고 미래 보유세를 모의 계산합니다"
              badge="HOT"
            />

            {/* 2. 자산 분석 */}
            <ToolCard
              onClick={() => navigateTo('portfolio', 'analysis')}
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
              title="자산 분석"
              desc="보유 자산을 투자 대가들의 포트폴리오와 비교하여 맞춤 조언을 제공합니다"
            />

            {/* 3. 증여세 계산기 */}
            <ToolCard
              onClick={() => navigateTo('calculator', 'gift-tax')}
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
              title="증여세 계산기"
              desc="가족 간 증여 시 발생하는 증여세를 현행 세법에 맞춰 정확하게 계산합니다"
            />

            {/* 4. 상속세 계산기 */}
            <ToolCard
              onClick={() => navigateTo('calculator', 'inheritance-tax')}
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />}
              title="상속세 계산기"
              desc="상속 재산에 대한 세금을 배우자, 자녀 등 상속인별로 상세하게 계산합니다"
            />

            {/* 5. 중개보수 계산기 */}
            <ToolCard
              onClick={() => navigateTo('tools', 'brokerage-fee')}
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
              title="중개보수 계산기"
              desc="부동산 매매·임대차 계약 시 공인중개사에 지불하는 중개보수를 계산합니다"
            />

            {/* 6. 법무사 보수료 */}
            <ToolCard
              onClick={() => navigateTo('tools', 'lawyer-fee')}
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />}
              title="법무사 보수료"
              desc="부동산 등기 시 법무사 기본보수, 부가세, 인지세 등을 계산합니다"
            />

            {/* 7. 취득세 계산기 */}
            <ToolCard
              onClick={() => navigateTo('calculator', 'acquisition-tax')}
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
              title="취득세 계산기"
              desc="부동산 구매 시 내야 하는 취득세를 간편하게 계산합니다"
            />

            {/* 8. 대출 이자 계산기 */}
            <ToolCard
              onClick={() => navigateTo('finance', 'loan-interest')}
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />}
              title="대출 이자 계산기"
              desc="상환방법별 월 상환금과 총 이자를 계산합니다"
            />

            {/* 9. 담보 대출 가능액 */}
            <ToolCard
              onClick={() => navigateTo('finance', 'mortgage-loan')}
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
              title="담보 대출 가능액"
              desc="지역별 LTV 기준으로 담보 대출 가능 금액을 계산합니다"
            />


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
                  onClick={() => navigateTo('property-tax')}
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#F15F5F] rounded-xl font-bold hover:bg-red-50 transition-all shadow-xl"
                >
                  <span className="flex items-center gap-2 justify-center">
                    보유세 예측하기
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

// 도구 카드 컴포넌트
function ToolCard({ onClick, icon, title, desc, badge }: {
  onClick: () => void
  icon: React.ReactElement
  title: string
  desc: string
  badge?: string
}) {
  return (
    <button
      onClick={onClick}
      className="group text-left p-5 sm:p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-[#F15F5F] hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#F15F5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {icon}
          </svg>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-full">
              {badge}
            </span>
          )}
          <svg className="w-5 h-5 text-gray-400 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{desc}</p>
    </button>
  )
}

function ToolCardDisabled({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gray-50 border-2 border-gray-200 opacity-60">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gray-200 flex items-center justify-center">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <span className="px-2 py-0.5 bg-gray-200 text-gray-500 text-[10px] font-medium rounded-full">
          준비중
        </span>
      </div>
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{desc}</p>
    </div>
  )
}
