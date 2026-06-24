import { useState } from 'react'
import { toPng, toBlob } from 'html-to-image'
import Toast from './Toast'

interface CaptureButtonsProps {
  targetRef: React.RefObject<HTMLElement | null>
  fileName?: string
}

export default function CaptureButtons({ targetRef, fileName = 'moajim-result' }: CaptureButtonsProps) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(false)

  const getNode = (): HTMLElement | null => {
    const el = targetRef.current
    if (!el) {
      setToast({ message: '캡처 대상을 찾을 수 없습니다', type: 'error' })
      return null
    }
    return el
  }

  const captureOptions = {
    backgroundColor: '#ffffff',
    pixelRatio: 2,
    cacheBust: true,
    style: {
      // 캡처 시 overflow 잘림 방지
      overflow: 'visible',
    },
  }

  const handleSave = async () => {
    if (loading) return
    const el = getNode()
    if (!el) return

    setLoading(true)
    try {
      const dataUrl = await toPng(el, captureOptions)
      const link = document.createElement('a')
      link.download = `${fileName}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setToast({ message: '이미지가 저장되었습니다', type: 'success' })
    } catch (err) {
      console.error('캡처 저장 실패:', err)
      setToast({ message: '이미지 저장에 실패했습니다', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (loading) return
    const el = getNode()
    if (!el) return

    setLoading(true)
    try {
      const blob = await toBlob(el, captureOptions)
      if (!blob) {
        setToast({ message: '이미지 변환에 실패했습니다', type: 'error' })
        return
      }

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ])
      setToast({ message: '클립보드에 복사되었습니다', type: 'success' })
    } catch (err) {
      console.error('캡처 복사 실패:', err)
      setToast({ message: '복사 실패 — 저장 버튼을 이용해주세요', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleCopy}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs text-gray-600 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          )}
          화면 캡쳐(복사)
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs text-gray-600 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
          화면 캡쳐(저장)
        </button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
