interface FooterProps {
  onNavigate: (view: 'home' | 'portfolio' | 'calculator') => void
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-red-50 py-20 mt-40 bg-gradient-to-b from-white to-red-50/30">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <p className="text-2xl font-bold text-[#F15F5F] mb-2">모아짐</p>
            <p className="text-sm text-gray-500">스마트한 재테크의 시작</p>
          </div>
          <div className="flex gap-10 text-sm text-gray-500">
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
          </div>
        </div>
        <div className="pt-8 border-t border-red-100">
          <p className="text-xs text-gray-400">© 2026 모아짐. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
