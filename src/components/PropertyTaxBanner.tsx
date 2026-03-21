export default function PropertyTaxBanner() {
  return (
    <a
      href="/?view=property-tax"
      className="block w-full bg-gradient-to-r from-[#F15F5F] to-[#FF8A8A] rounded-xl p-4 mb-6 hover:shadow-lg hover:shadow-red-500/15 transition-all group"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-[9px] font-bold rounded-full">HOT</span>
              <span className="text-sm font-bold text-white">2026 보유세 예측하기</span>
            </div>
            <p className="text-[11px] text-red-100 mt-0.5">현행법 vs 2021년 최고점 비교 + 미래 모의 계산</p>
          </div>
        </div>
        <svg className="w-5 h-5 text-white/70 group-hover:translate-x-1 group-hover:text-white transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  )
}
