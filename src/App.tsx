import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import PortfolioPage from './pages/PortfolioPage'
import CalculatorPage from './pages/CalculatorPage'

function App() {
  const [activeView, setActiveView] = useState<'home' | 'portfolio' | 'calculator'>('home')
  const [subView, setSubView] = useState<string>('')

  // URL 파라미터 기반 라우팅
  const updateFromURL = () => {
    const params = new URLSearchParams(window.location.search)
    const view = params.get('view')
    const sub = params.get('sub')
    if (view === 'portfolio' || view === 'calculator') {
      setActiveView(view)
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

  const navigateTo = (view: 'home' | 'portfolio' | 'calculator', sub?: string) => {
    setActiveView(view)
    setSubView(sub || '')
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
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  )
}

export default App
