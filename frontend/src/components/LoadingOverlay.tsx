interface LoadingOverlayProps {
  message: string
  tip?: string
  show: boolean
}

/**
 * 풀 오버레이 로딩 컴포넌트
 * 데이터 조회 중 사용자에게 친절한 피드백 제공
 */
export default function LoadingOverlay({ message, tip, show }: LoadingOverlayProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 animate-fade-in">
        {/* 스피너 */}
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-red-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#F15F5F] rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 border-4 border-red-200 rounded-full border-b-transparent animate-spin-slow"></div>
          </div>
        </div>

        {/* 메시지 */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{message}</h3>
          <div className="flex items-center justify-center gap-1 text-gray-500">
            <div className="w-2 h-2 bg-[#F15F5F] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-[#F15F5F] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-[#F15F5F] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>

        {/* 팁 */}
        {tip && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">알아두세요</p>
                <p className="text-sm text-blue-700">{tip}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  )
}
