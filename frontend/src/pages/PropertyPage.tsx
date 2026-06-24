/**
 * PropertyPage — /property 부동산 서비스 (신규)
 *
 * 현재는 플레이스홀더. 추후 지도·실거래·공시지가 화면과
 * Python 백엔드 API를 여기에 연결한다.
 */
export default function PropertyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <a
        href="/tax"
        className="text-2xl font-bold tracking-tight text-[#F15F5F] hover:text-[#FFA7A7] transition-colors mb-6"
      >
        모아짐
      </a>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
        부동산 서비스 준비 중
      </h1>
      <p className="text-gray-500 max-w-md leading-relaxed">
        실거래가·공시지가·지도 기반 부동산 분석 서비스를 준비하고 있습니다.
      </p>
      <a
        href="/tax"
        className="mt-8 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#F15F5F] transition-colors"
      >
        ← 세무·금융 계산기로 돌아가기
      </a>
    </div>
  )
}
