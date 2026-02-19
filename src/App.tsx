import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import PortfolioPage from './pages/PortfolioPage'
import CalculatorPage from './pages/CalculatorPage'
import PrivacyPage from './pages/PrivacyPage'

function App() {
  const [activeView, setActiveView] = useState<'home' | 'portfolio' | 'calculator' | 'privacy'>('home')
  const [subView, setSubView] = useState<string>('')

  // URL 파라미터 기반 라우팅
  const updateFromURL = () => {
    const params = new URLSearchParams(window.location.search)
    const view = params.get('view')
    const sub = params.get('sub')

    // 브라우저 뒤로가기/앞으로가기 시에도 스크롤 상단으로
    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (view === 'portfolio' || view === 'calculator' || view === 'privacy') {
      setActiveView(view as 'home' | 'portfolio' | 'calculator' | 'privacy')
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

  const navigateTo = (view: 'home' | 'portfolio' | 'calculator' | 'privacy', sub?: string) => {
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
      <Navigation activeView={activeView} onNavigate={navigateTo} />

      <main>
        {activeView === 'home' && <HomePage navigateTo={navigateTo} />}
        {activeView === 'portfolio' && <PortfolioPage key={subView} initialSubView={subView} />}
        {activeView === 'calculator' && <CalculatorPage key={subView} initialSubView={subView} />}
        {activeView === 'privacy' && <PrivacyPage />}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  )
}

export default App
