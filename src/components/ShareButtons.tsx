import { useState, useRef, useEffect } from 'react'
import Toast from './Toast'

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean
      Share: {
        sendDefault: (options: {
          objectType: string
          content: {
            title: string
            description: string
            imageUrl: string
            link: { mobileWebUrl: string; webUrl: string }
          }
          buttons: Array<{
            title: string
            link: { mobileWebUrl: string; webUrl: string }
          }>
        }) => void
      }
    }
  }
}

interface ShareButtonsProps {
  url: string
  title?: string
  description?: string
}

const PAGE_META: Record<string, { title: string; description: string }> = {
  'view=calculator&sub=gift-tax': {
    title: '증여세 계산기 - 모아짐',
    description: '증여세를 쉽고 빠르게 계산해보세요',
  },
  'view=calculator&sub=inheritance-tax': {
    title: '상속세 계산기 - 모아짐',
    description: '상속세를 쉽고 빠르게 계산해보세요',
  },
  'view=calculator&sub=holding-tax': {
    title: '보유세 계산기 - 모아짐',
    description: '재산세와 종합부동산세를 쉽고 빠르게 계산해보세요',
  },
  'view=tools&sub=brokerage-fee': {
    title: '중개보수 계산기 - 모아짐',
    description: '부동산 중개수수료를 쉽고 빠르게 계산해보세요',
  },
  'view=tools&sub=lawyer-fee': {
    title: '법무사 보수료 계산기 - 모아짐',
    description: '부동산 등기 법무사 비용을 계산해보세요',
  },
  'view=tools&sub=rent-conversion': {
    title: '전월세 전환 계산기 - 모아짐',
    description: '전세 ↔ 월세 전환 적정 금액을 계산해보세요',
  },
  'view=calculator&sub=acquisition-tax': {
    title: '취득세 계산기 - 모아짐',
    description: '부동산 취득세를 쉽고 빠르게 계산해보세요',
  },
  'view=calculator&sub=capital-gains-tax': {
    title: '양도소득세 계산기 - 모아짐',
    description: '양도소득세를 쉽고 빠르게 계산해보세요',
  },
  'view=finance&sub=loan-interest': {
    title: '대출 이자 계산기 - 모아짐',
    description: '대출 이자와 월 상환금을 쉽고 빠르게 계산해보세요',
  },
  'view=finance&sub=savings-interest': {
    title: '예적금 이자 계산기 - 모아짐',
    description: '예금·적금 이자 수익을 단리/복리로 계산해보세요',
  },
  'view=finance&sub=mortgage-loan': {
    title: '담보 대출 가능액 계산기 - 모아짐',
    description: 'LTV 기준 담보 대출 가능 금액을 계산해보세요',
  },
  'view=finance&sub=early-repayment': {
    title: '중도상환수수료 계산기 - 모아짐',
    description: '대출 중도상환 시 발생하는 수수료를 빠르게 계산해보세요',
  },
  'view=finance&sub=loan-refinance': {
    title: '대출 대환 계산기 - 모아짐',
    description: '대출 대환 시 변경되는 이자를 비교해보세요',
  },
  'view=finance&sub=estimated-income': {
    title: '추정소득 계산기 - 모아짐',
    description: '인정소득·신고소득 기준으로 추정 연소득을 계산해보세요',
  },
  'view=finance&sub=auction-loan': {
    title: '경락잔금대출 한도 계산기 - 모아짐',
    description: '경매 낙찰 시 금융권별 대출 가능 한도를 계산해보세요',
  },
  'view=finance&sub=jeonse-guarantee': {
    title: '전세보증보험 계산기 - 모아짐',
    description: '전세금반환보증보험 가입 가능 여부와 보증료를 계산해보세요',
  },
  'view=portfolio': {
    title: '자산 포트폴리오 분석 - 모아짐',
    description: '내 자산을 분석하고 맞춤 투자 전략을 받아보세요',
  },
}

function getMeta(url: string) {
  const query = url.split('?')[1] || ''
  for (const key of Object.keys(PAGE_META)) {
    if (query.includes(key)) return PAGE_META[key]
  }
  return { title: '모아짐 - 스마트한 자산 관리', description: '포트폴리오 분석과 부동산 세금 계산을 쉽게' }
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const meta = getMeta(url)
  const shareTitle = title || meta.title
  const shareDesc = description || meta.description

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setToast({ message: '주소가 복사되었습니다', type: 'success' })
    } catch {
      setToast({ message: '복사에 실패했습니다', type: 'error' })
    }
    setOpen(false)
  }

  const handleKakao = () => {
    if (!window.Kakao) {
      setToast({ message: '카카오 SDK를 불러오지 못했습니다', type: 'error' })
      return
    }
    if (!window.Kakao.isInitialized()) {
      try {
        window.Kakao.init('69a66ff40037f9bb5a2d123d21b24bb6')
      } catch {
        setToast({ message: '카카오 초기화에 실패했습니다', type: 'error' })
        return
      }
    }
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: shareTitle,
        description: shareDesc,
        imageUrl: 'https://moajim.com/og-image.png',
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [{ title: '바로가기', link: { mobileWebUrl: url, webUrl: url } }],
    })
    setOpen(false)
  }

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'width=550,height=400'
    )
    setOpen(false)
  }

  const handleNaver = () => {
    window.open(
      `https://share.naver.com/web/shareView?url=${encodeURIComponent(url)}&title=${encodeURIComponent(shareTitle)}`,
      '_blank',
      'width=550,height=400'
    )
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        공유
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          <button
            onClick={handleCopy}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            주소 복사
          </button>
          <button
            onClick={handleKakao}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FEE500">
              <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.724 1.8 5.112 4.508 6.453-.198.738-1.276 4.674-1.307 4.808 0 0-.025.213.113.295.138.082.3.019.3.019.396-.055 4.588-3.006 5.318-3.52.349.05.706.076 1.068.076 5.523 0 10-3.463 10-7.691S17.523 3 12 3z"/>
            </svg>
            카카오톡
          </button>
          <button
            onClick={handleFacebook}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            페이스북
          </button>
          <button
            onClick={handleNaver}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#03C75A">
              <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
            </svg>
            네이버 블로그
          </button>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
