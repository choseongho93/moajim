import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import PortfolioPage from './pages/PortfolioPage'
import CalculatorPage from './pages/CalculatorPage'

function App() {
  const [activeView, setActiveView] = useState<'home' | 'portfolio' | 'calculator'>('home')

  // URL 파라미터 기반 라우팅
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const view = params.get('view')
    if (view === 'portfolio' || view === 'calculator') {
      setActiveView(view)
    } else {
      setActiveView('home')
    }
  }, [])

  const navigateTo = (view: 'home' | 'portfolio' | 'calculator') => {
    setActiveView(view)
    if (view === 'home') {
      window.history.pushState({}, '', '/')
    } else {
      window.history.pushState({}, '', `/?view=${view}`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation activeView={activeView} onNavigate={navigateTo} />

      <main>
        {activeView === 'home' && <HomePage navigateTo={navigateTo} />}
        {activeView === 'portfolio' && <PortfolioPage />}
        {activeView === 'calculator' && <CalculatorPage />}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  )
}

export default App
