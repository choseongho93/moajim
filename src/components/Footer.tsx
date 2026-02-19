interface FooterProps {
  onNavigate: (view: 'home' | 'portfolio' | 'calculator' | 'privacy') => void
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-red-50 py-12 sm:py-16 md:py-20 mt-16 sm:mt-24 md:mt-40 bg-gradient-to-b from-white to-red-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-[#F15F5F] mb-1 sm:mb-2">모아짐</p>
            <p className="text-xs sm:text-sm text-gray-500">스마트한 재테크의 시작</p>
          </div>
          <div className="flex gap-6 sm:gap-8 md:gap-10 text-xs sm:text-sm text-gray-500">
            <button
              onClick={() => onNavigate('portfolio')}
              className="hover:text-[#F15F5F] transition-colors font-medium"
            >
              포트폴리오
            </button>
            <button
              onClick={() => onNavigate('calculator')}
              className="hover:text-[#F15F5F] transition-colors font-medium"
            >
              세금계산
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-[#F15F5F] transition-colors font-medium"
            >
              개인정보처리방침
            </button>
          </div>
        </div>
        <div className="pt-6 sm:pt-8 border-t border-red-100">
          <p className="text-[10px] sm:text-xs text-gray-400">© 2026 모아짐. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
