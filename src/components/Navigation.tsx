import { useState, useRef } from 'react'

interface NavigationProps {
  activeView: string
  activeSubView?: string
  onNavigate: (view: 'home' | 'portfolio' | 'calculator' | 'tools' | 'property-tax' | 'finance', subView?: string) => void
}

export default function Navigation({ activeView, activeSubView, onNavigate }: NavigationProps) {
  const [showPortfolioMenu, setShowPortfolioMenu] = useState(false)
  const [showTaxMenu, setShowTaxMenu] = useState(false)
  const [showToolsMenu, setShowToolsMenu] = useState(false)
  const [showFinanceMenu, setShowFinanceMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const portfolioTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const taxTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const toolsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const financeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  const handleToolsMouseEnter = () => {
    if (toolsTimeoutRef.current) {
      clearTimeout(toolsTimeoutRef.current)
    }
    setShowToolsMenu(true)
  }

  const handleToolsMouseLeave = () => {
    toolsTimeoutRef.current = setTimeout(() => {
      setShowToolsMenu(false)
    }, 200)
  }

  const handleFinanceMouseEnter = () => {
    if (financeTimeoutRef.current) {
      clearTimeout(financeTimeoutRef.current)
    }
    setShowFinanceMenu(true)
  }

  const handleFinanceMouseLeave = () => {
    financeTimeoutRef.current = setTimeout(() => {
      setShowFinanceMenu(false)
    }, 200)
  }

  const handleNavigation = (view: 'home' | 'portfolio' | 'calculator' | 'tools' | 'property-tax' | 'finance', subView?: string) => {
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
                  activeView === 'portfolio' ? 'text-[#F15F5F] bg-red-50 rounded-lg' : 'text-gray-400'
                } hover:text-[#F15F5F] hover:bg-red-50 hover:rounded-lg transition-colors text-[15px] font-medium flex items-center gap-1 px-3 py-1.5`}
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
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeView === 'portfolio' && activeSubView === 'analysis' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
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
                  activeView === 'calculator' ? 'text-[#F15F5F] bg-red-50 rounded-lg' : 'text-gray-400'
                } hover:text-[#F15F5F] hover:bg-red-50 hover:rounded-lg transition-colors text-[15px] font-medium flex items-center gap-1 px-3 py-1.5`}
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
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeView === 'calculator' && activeSubView === 'gift-tax' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
                  >
                    증여세 계산기
                  </button>
                  <button
                    onClick={() => handleNavigation('calculator', 'inheritance-tax')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeView === 'calculator' && activeSubView === 'inheritance-tax' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
                  >
                    상속세 계산기
                  </button>
                  <button
                    onClick={() => handleNavigation('calculator', 'acquisition-tax')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeView === 'calculator' && activeSubView === 'acquisition-tax' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
                  >
                    취득세 계산기
                  </button>
                  <button
                    onClick={() => handleNavigation('calculator', 'capital-gains-tax')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeView === 'calculator' && activeSubView === 'capital-gains-tax' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
                  >
                    양도세 계산기
                  </button>
                  <button
                    onClick={() => handleNavigation('calculator', 'holding-tax')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeView === 'calculator' && activeSubView === 'holding-tax' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
                  >
                    보유세 계산기
                  </button>
                </div>
              )}
            </div>

            {/* 부동산 도구 메뉴 */}
            <div
              className="relative"
              onMouseEnter={handleToolsMouseEnter}
              onMouseLeave={handleToolsMouseLeave}
            >
              <button
                onClick={() => handleNavigation('tools')}
                className={`${
                  activeView === 'tools' || activeView === 'property-tax' ? 'text-[#F15F5F] bg-red-50 rounded-lg' : 'text-gray-400'
                } hover:text-[#F15F5F] hover:bg-red-50 hover:rounded-lg transition-colors text-[15px] font-medium flex items-center gap-1 px-3 py-1.5`}
              >
                부동산 도구
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showToolsMenu && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <button
                    onClick={() => handleNavigation('property-tax')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${
                      activeView === 'property-tax' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
                  >
                    2026 보유세 예측하기
                    <span className="text-[10px] bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full font-bold">HOT</span>
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => handleNavigation('tools', 'brokerage-fee')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeView === 'tools' && activeSubView === 'brokerage-fee' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
                  >
                    중개보수 계산기
                  </button>
                  <button
                    onClick={() => handleNavigation('tools', 'lawyer-fee')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeView === 'tools' && activeSubView === 'lawyer-fee' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
                  >
                    법무사 보수료
                  </button>
                  <button
                    onClick={() => handleNavigation('tools', 'rent-conversion')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeView === 'tools' && activeSubView === 'rent-conversion' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
                  >
                    전월세 전환 계산기
                  </button>
                </div>
              )}
            </div>

            {/* 금융계산 메뉴 */}
            <div
              className="relative"
              onMouseEnter={handleFinanceMouseEnter}
              onMouseLeave={handleFinanceMouseLeave}
            >
              <button
                onClick={() => handleNavigation('finance')}
                className={`${
                  activeView === 'finance' ? 'text-[#F15F5F] bg-red-50 rounded-lg' : 'text-gray-400'
                } hover:text-[#F15F5F] hover:bg-red-50 hover:rounded-lg transition-colors text-[15px] font-medium flex items-center gap-1 px-3 py-1.5`}
              >
                금융계산
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showFinanceMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <button
                    onClick={() => handleNavigation('finance', 'loan-interest')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeView === 'finance' && activeSubView === 'loan-interest' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
                  >
                    대출 이자 계산기
                  </button>
                  <button
                    onClick={() => handleNavigation('finance', 'savings-interest')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeView === 'finance' && activeSubView === 'savings-interest' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
                  >
                    예적금 이자 계산기
                  </button>
                  <button
                    onClick={() => handleNavigation('finance', 'mortgage-loan')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeView === 'finance' && activeSubView === 'mortgage-loan' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
                  >
                    담보 대출 가능액
                  </button>
                  <button
                    onClick={() => handleNavigation('finance', 'early-repayment')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeView === 'finance' && activeSubView === 'early-repayment' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
                  >
                    중도상환수수료 계산기
                  </button>
                  <button
                    onClick={() => handleNavigation('finance', 'loan-refinance')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeView === 'finance' && activeSubView === 'loan-refinance' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
                  >
                    대출 대환 계산기
                  </button>
                  <button
                    onClick={() => handleNavigation('finance', 'estimated-income')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeView === 'finance' && activeSubView === 'estimated-income' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
                  >
                    추정소득 계산기
                  </button>
                  <button
                    onClick={() => handleNavigation('finance', 'auction-loan')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeView === 'finance' && activeSubView === 'auction-loan' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
                  >
                    경락잔금대출 한도
                  </button>
                  <button
                    onClick={() => handleNavigation('finance', 'jeonse-guarantee')}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeView === 'finance' && activeSubView === 'jeonse-guarantee' ? 'bg-red-50 text-[#F15F5F] font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-[#F15F5F]'
                    }`}
                  >
                    전세보증보험 계산기
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
                  onClick={() => handleNavigation('calculator', 'acquisition-tax')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#F15F5F] rounded-lg transition-colors"
                >
                  취득세 계산기
                </button>
                <button
                  onClick={() => handleNavigation('calculator', 'holding-tax')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#F15F5F] rounded-lg transition-colors"
                >
                  보유세 계산기
                </button>
              </div>

              <button
                onClick={() => handleNavigation('tools')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeView === 'tools' ? 'bg-red-50 text-[#F15F5F]' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                부동산 도구
              </button>
              <div className="pl-4 space-y-1">
                <button
                  onClick={() => handleNavigation('property-tax')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#F15F5F] rounded-lg transition-colors flex items-center justify-between"
                >
                  2026 보유세 예측하기
                  <span className="text-[10px] bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full font-bold">HOT</span>
                </button>
                <button
                  onClick={() => handleNavigation('tools', 'brokerage-fee')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#F15F5F] rounded-lg transition-colors"
                >
                  중개보수 계산기
                </button>
                <button
                  onClick={() => handleNavigation('tools', 'lawyer-fee')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#F15F5F] rounded-lg transition-colors"
                >
                  법무사 보수료
                </button>
                <button
                  onClick={() => handleNavigation('tools', 'rent-conversion')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#F15F5F] rounded-lg transition-colors"
                >
                  전월세 전환 계산기
                </button>
              </div>

              <button
                onClick={() => handleNavigation('finance')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeView === 'finance' ? 'bg-red-50 text-[#F15F5F]' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                금융계산
              </button>
              <div className="pl-4 space-y-1">
                <button
                  onClick={() => handleNavigation('finance', 'loan-interest')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#F15F5F] rounded-lg transition-colors"
                >
                  대출 이자 계산기
                </button>
                <button
                  onClick={() => handleNavigation('finance', 'savings-interest')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#F15F5F] rounded-lg transition-colors"
                >
                  예적금 이자 계산기
                </button>
                <button
                  onClick={() => handleNavigation('finance', 'mortgage-loan')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#F15F5F] rounded-lg transition-colors"
                >
                  담보 대출 가능액
                </button>
                <button
                  onClick={() => handleNavigation('finance', 'early-repayment')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#F15F5F] rounded-lg transition-colors"
                >
                  중도상환수수료 계산기
                </button>
                <button
                  onClick={() => handleNavigation('finance', 'loan-refinance')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#F15F5F] rounded-lg transition-colors"
                >
                  대출 대환 계산기
                </button>
                <button
                  onClick={() => handleNavigation('finance', 'estimated-income')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#F15F5F] rounded-lg transition-colors"
                >
                  추정소득 계산기
                </button>
                <button
                  onClick={() => handleNavigation('finance', 'auction-loan')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#F15F5F] rounded-lg transition-colors"
                >
                  경락잔금대출 한도
                </button>
                <button
                  onClick={() => handleNavigation('finance', 'jeonse-guarantee')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#F15F5F] rounded-lg transition-colors"
                >
                  전세보증보험 계산기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
