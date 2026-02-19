import { useEffect } from 'react'

interface AdInfeedProps {
  slot: string // 애드센스 광고 슬롯 ID
  layout?: string
  layoutKey?: string
  className?: string
}

/**
 * 구글 애드센스 인피드 광고 컴포넌트
 * 콘텐츠 사이에 자연스럽게 배치되는 광고
 *
 * 사용 예시:
 * <AdInfeed slot="9876543210" />
 */
export default function AdInfeed({
  slot,
  layout = 'in-article',
  layoutKey = '',
  className = ''
}: AdInfeedProps) {
  useEffect(() => {
    try {
      // 애드센스 광고 로드
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  return (
    <div className={`ad-infeed ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="ca-pub-6210490551545139"
        data-ad-slot={slot}
        data-ad-layout={layout}
        data-ad-layout-key={layoutKey}
        data-ad-format="fluid"
      />
    </div>
  )
}
