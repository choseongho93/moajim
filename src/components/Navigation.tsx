interface NavigationProps {
  activeView: 'home' | 'portfolio' | 'calculator'
  onNavigate: (view: 'home' | 'portfolio' | 'calculator') => void
}

export default function Navigation({ activeView, onNavigate }: NavigationProps) {
  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-red-50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button
            onClick={() => onNavigate('home')}
            className="text-2xl font-bold tracking-tight text-[#F15F5F] hover:text-[#FFA7A7] transition-colors"
          >
            모아짐
          </button>
          <div className="flex gap-10">
            <button
              onClick={() => onNavigate('portfolio')}
              className={`${
                activeView === 'portfolio' ? 'text-[#F15F5F]' : 'text-gray-400'
              } hover:text-[#F15F5F] transition-colors text-[15px] font-medium`}
            >
              포트폴리오
            </button>
            <button
              onClick={() => onNavigate('calculator')}
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
  )
}
