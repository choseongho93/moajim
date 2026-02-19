import { useState, useRef } from 'react'

interface NavigationProps {
  activeView: 'home' | 'portfolio' | 'calculator'
  onNavigate: (view: 'home' | 'portfolio' | 'calculator', subView?: string) => void
}

export default function Navigation({ activeView, onNavigate }: NavigationProps) {
  const [showPortfolioMenu, setShowPortfolioMenu] = useState(false)
  const [showTaxMenu, setShowTaxMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const portfolioTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const taxTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handlePortfolioMouseEnter = () => {
    if (portfolioTimeoutRef.current) {
      clearTimeout(portfolioTimeoutRef.current)
    }
    setShowPortfolioMenu(true)
  }

  const handlePortfolioMouseLeave = () => {
    portfolioTimeoutRef.current = setTimeout(() => {
      setShowPortfolioMenu(false)
    }, 200)
  }

  const handleTaxMouseEnter = () => {
    if (taxTimeoutRef.current) {
      clearTimeout(taxTimeoutRef.current)
    }
    setShowTaxMenu(true)
  }

  const handleTaxMouseLeave = () => {
    taxTimeoutRef.current = setTimeout(() => {
      setShowTaxMenu(false)
    }, 200)
  }

  const handleNavigation = (view: 'home' | 'portfolio' | 'calculator', subView?: string) => {
    onNavigate(view, subView)
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-red-50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <button
            onClick={() => handleNavigation('home')}
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#F15F5F] hover:text-[#FFA7A7] transition-colors"
          >
            모아짐
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 lg:gap-10">
            {/* 포트폴리오 메뉴 */}
            <div
              className="relative"
              onMouseEnter={handlePortfolioMouseEnter}
              onMouseLeave={handlePortfolioMouseLeave}
            >
              <button
                onClick={() => handleNavigation('portfolio')}
                className={`${
                  activeView === 'portfolio' ? 'text-[#F15F5F]' : 'text-gray-400'
                } hover:text-[#F15F5F] transition-colors text-[15px] font-medium flex items-center gap-1`}
              >
                포트폴리오
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showPortfolioMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <button
                    onClick={() => handleNavigation('portfolio', 'analysis')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-[#F15F5F] transition-colors"
                  >
                    자산 분석하기
                  </button>
                </div>
              )}
            </div>

            {/* 세금계산 메뉴 */}
            <div
              className="relative"
              onMouseEnter={handleTaxMouseEnter}
              onMouseLeave={handleTaxMouseLeave}
            >
              <button
                onClick={() => handleNavigation('calculator')}
                className={`${
                  activeView === 'calculator' ? 'text-[#F15F5F]' : 'text-gray-400'
                } hover:text-[#F15F5F] transition-colors text-[15px] font-medium flex items-center gap-1`}
              >
                세금계산
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showTaxMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <button
                    onClick={() => handleNavigation('calculator', 'gift-tax')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-[#F15F5F] transition-colors"
                  >
                    증여세 계산기
                  </button>
                  <button
                    onClick={() => handleNavigation('calculator', 'inheritance-tax')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-[#F15F5F] transition-colors"
                  >
                    상속세 계산기
                  </button>
                  <button
                    disabled
                    className="w-full text-left px-4 py-3 text-sm text-gray-400 cursor-not-allowed flex items-center justify-between"
                  >
                    취득세 계산기
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">준비중</span>
                  </button>
                  <button
                    disabled
                    className="w-full text-left px-4 py-3 text-sm text-gray-400 cursor-not-allowed flex items-center justify-between"
                  >
                    양도세 계산기
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">준비중</span>
                  </button>
                  <button
                    disabled
                    className="w-full text-left px-4 py-3 text-sm text-gray-400 cursor-not-allowed flex items-center justify-between"
                  >
                    종부세 계산기
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">준비중</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-[#F15F5F] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="space-y-1">
              <button
                onClick={() => handleNavigation('portfolio')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeView === 'portfolio' ? 'bg-red-50 text-[#F15F5F]' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                포트폴리오
              </button>
              <div className="pl-4 space-y-1">
                <button
                  onClick={() => handleNavigation('portfolio', 'analysis')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#F15F5F] rounded-lg transition-colors"
                >
                  자산 분석하기
                </button>
              </div>

              <button
                onClick={() => handleNavigation('calculator')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeView === 'calculator' ? 'bg-red-50 text-[#F15F5F]' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                세금계산
              </button>
              <div className="pl-4 space-y-1">
                <button
                  onClick={() => handleNavigation('calculator', 'gift-tax')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#F15F5F] rounded-lg transition-colors"
                >
                  증여세 계산기
                </button>
                <button
                  onClick={() => handleNavigation('calculator', 'inheritance-tax')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#F15F5F] rounded-lg transition-colors"
                >
                  상속세 계산기
                </button>
                <button
                  disabled
                  className="w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed flex items-center justify-between"
                >
                  취득세 계산기
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">준비중</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
