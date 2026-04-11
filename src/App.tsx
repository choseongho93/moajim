import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import PortfolioPage from './pages/PortfolioPage'
import CalculatorPage from './pages/CalculatorPage'
import ToolsPage from './pages/ToolsPage'
import PrivacyPage from './pages/PrivacyPage'
import PropertyTaxPage from './pages/PropertyTaxPage'
import FinancePage from './pages/FinancePage'

type ViewType = 'home' | 'portfolio' | 'calculator' | 'tools' | 'privacy' | 'property-tax' | 'finance'

function App() {
  const [activeView, setActiveView] = useState<ViewType>('home')
  const [subView, setSubView] = useState<string>('')

  // URL 파라미터 기반 라우팅
  const updateFromURL = () => {
    const params = new URLSearchParams(window.location.search)
    const view = params.get('view')
    const sub = params.get('sub')

    // 브라우저 뒤로가기/앞으로가기 시에도 스크롤 상단으로
    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (view === 'portfolio' || view === 'calculator' || view === 'tools' || view === 'privacy' || view === 'property-tax' || view === 'finance') {
      setActiveView(view as ViewType)
      setSubView(sub || '')
    } else {
      setActiveView('home')
      setSubView('')
    }
  }

  useEffect(() => {
    // 초기 로드 시 URL 읽기
    updateFromURL()

    // 브라우저 뒤로가기/앞으로가기 처리
    const handlePopState = () => {
      updateFromURL()
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const navigateTo = (view: ViewType, sub?: string) => {
    setActiveView(view)
    setSubView(sub || '')

    // 페이지 이동 시 스크롤 상단으로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (view === 'home') {
      window.history.pushState({}, '', '/')
    } else if (sub) {
      window.history.pushState({}, '', `/?view=${view}&sub=${sub}`)
    } else {
      window.history.pushState({}, '', `/?view=${view}`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation activeView={activeView} activeSubView={subView} onNavigate={navigateTo} />

      <main>
        {activeView === 'home' && <HomePage navigateTo={navigateTo} />}
        {activeView === 'portfolio' && <PortfolioPage key={subView} initialSubView={subView} />}
        {activeView === 'calculator' && <CalculatorPage key={subView} initialSubView={subView} />}
        {activeView === 'tools' && <ToolsPage key={subView} initialSubView={subView} />}
        {activeView === 'privacy' && <PrivacyPage />}
        {activeView === 'property-tax' && <PropertyTaxPage />}
        {activeView === 'finance' && <FinancePage key={subView} initialSubView={subView} />}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  )
}

export default App
