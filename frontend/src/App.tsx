import { useState, useEffect } from 'react'
import { updateSeoMeta } from './utils/seo'
import {
  productFromPath,
  pathToState,
  stateToPath,
  legacyQueryToPath,
  type ProductId,
  type View,
} from './routes'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CalculatorPage from './pages/CalculatorPage'
import ToolsPage from './pages/ToolsPage'
import PrivacyPage from './pages/PrivacyPage'
import PropertyTaxPage from './pages/PropertyTaxPage'
import FinancePage from './pages/FinancePage'
import PropertyPage from './pages/PropertyPage'

function App() {
  const [product, setProduct] = useState<ProductId>('tax')
  const [activeView, setActiveView] = useState<View>('home')
  const [subView, setSubView] = useState<string>('')

  // 경로 기반 라우팅
  const updateFromURL = () => {
    // 레거시 ?view=&sub= URL 또는 루트(/) → 새 경로로 정규화
    // (엣지 함수가 301로 처리하지만, dev·직접진입 대비 클라이언트에서도 정규화)
    const legacyPath = legacyQueryToPath(window.location.search)
    if (legacyPath) {
      window.history.replaceState({}, '', legacyPath)
    } else if (window.location.pathname === '/') {
      window.history.replaceState({}, '', '/tax')
    }

    const pathname = window.location.pathname

    // 브라우저 뒤로가기/앞으로가기 시에도 스크롤 상단으로
    window.scrollTo({ top: 0, behavior: 'smooth' })

    const prod = productFromPath(pathname)
    setProduct(prod)

    if (prod === 'tax') {
      const { view, sub } = pathToState(pathname)
      setActiveView(view)
      setSubView(sub)
    }

    // SEO 메타 태그 업데이트
    updateSeoMeta()
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

  const navigateTo = (view: View, sub?: string) => {
    setProduct('tax')
    setActiveView(view)
    setSubView(sub || '')

    // 페이지 이동 시 스크롤 상단으로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' })

    window.history.pushState({}, '', stateToPath(view, sub))

    // SEO 메타 태그 업데이트
    updateSeoMeta()
  }

  if (product === 'property') {
    return <PropertyPage />
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation activeView={activeView} activeSubView={subView} onNavigate={navigateTo} />

      <main>
        {activeView === 'home' && <HomePage navigateTo={navigateTo} />}
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
