import { useEffect } from 'react'

interface AdBannerProps {
  slot: string // 애드센스 광고 슬롯 ID
  format?: 'horizontal' | 'rectangle' | 'vertical'
  responsive?: boolean
  className?: string
}

/**
 * 구글 애드센스 배너 광고 컴포넌트
 *
 * 사용 예시:
 * <AdBanner slot="1234567890" format="horizontal" responsive />
 */
export default function AdBanner({
  slot,
  format = 'horizontal',
  responsive = true,
  className = ''
}: AdBannerProps) {
  useEffect(() => {
    try {
      // 애드센스 광고 로드
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  return (
    <div className={`ad-banner ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6210490551545139"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}
