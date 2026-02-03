import { useState } from 'react'

type DonorType = 'spouse' | 'ascendant' | 'descendant' | 'relative' | 'other'

interface GiftTaxResult {
  giftAmount: number
  deduction: number
  taxBase: number
  taxRate: number
  progressiveDeduction: number
  calculatedTax: number
}

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<'explanation' | 'gift' | 'burden'>('gift')
  const [donorType, setDonorType] = useState<DonorType>('spouse')
  const [giftAmount, setGiftAmount] = useState<number>(0)
  const [isMinor, setIsMinor] = useState(false)
  const [result, setResult] = useState<GiftTaxResult | null>(null)

  // 증여재산공제액 계산
  const getDeduction = (type: DonorType, isMinor: boolean): number => {
    switch (type) {
      case 'spouse':
        return 60000 // 6억
      case 'ascendant':
        return isMinor ? 2000 : 5000 // 미성년자 2천만원, 성인 5천만원
      case 'descendant':
        return 5000 // 5천만원
      case 'relative':
        return 1000 // 1천만원
      case 'other':
        return 0
      default:
        return 0
    }
  }

  // 증여세율 계산
  const calculateTax = (taxBase: number): { rate: number; progressiveDeduction: number; tax: number } => {
    if (taxBase <= 10000) {
      return { rate: 10, progressiveDeduction: 0, tax: taxBase * 0.1 }
    } else if (taxBase <= 50000) {
      return { rate: 20, progressiveDeduction: 1000, tax: taxBase * 0.2 - 1000 }
    } else if (taxBase <= 100000) {
      return { rate: 30, progressiveDeduction: 6000, tax: taxBase * 0.3 - 6000 }
    } else if (taxBase <= 300000) {
      return { rate: 40, progressiveDeduction: 16000, tax: taxBase * 0.4 - 16000 }
    } else {
      return { rate: 50, progressiveDeduction: 46000, tax: taxBase * 0.5 - 46000 }
    }
  }

  const handleCalculate = () => {
    const deduction = getDeduction(donorType, isMinor)
    const taxBase = Math.max(0, giftAmount - deduction)
    const { rate, progressiveDeduction, tax } = calculateTax(taxBase)

    setResult({
      giftAmount,
      deduction,
      taxBase,
      taxRate: rate,
      progressiveDeduction,
      calculatedTax: Math.max(0, tax),
    })
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🎁</span>
          <h1 className="text-3xl font-bold text-gray-900">증여세 계산</h1>
        </div>

        {/* 탭 */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'explanation'
                ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            설명
          </button>
          <button
            onClick={() => setActiveTab('gift')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'gift'
                ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            증여세 계산
          </button>
          <button
            onClick={() => setActiveTab('burden')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'burden'
                ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            부담부증여
          </button>
        </div>

        {/* 설명 탭 */}
        {activeTab === 'explanation' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed">
              증여세란 타인으로부터 재산을 무상으로 받거나 현저히 낮은 가액으로 재산을 취득한 경우 부과되는 세금입니다.
              증여 신고는 증여일이 속하는 달의 말일부터 3개월 이내에 관할세무서에 제출해야 합니다.
            </p>
          </div>
        )}

        {/* 증여세 계산 탭 */}
        {activeTab === 'gift' && (
          <div className="space-y-6">
            {/* 증여자 선택 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                증여자(주는 사람)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'spouse', label: '배우자' },
                  { value: 'ascendant', label: '직계존속' },
                  { value: 'descendant', label: '직계비속' },
                  { value: 'relative', label: '그 외 친족' },
                  { value: 'other', label: '기타' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDonorType(option.value as DonorType)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      donorType === option.value
                        ? 'border-[#F15F5F] bg-red-50 text-[#F15F5F] font-medium'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 미성년자 체크 */}
            {donorType === 'ascendant' && (
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMinor}
                    onChange={(e) => setIsMinor(e.target.checked)}
                    className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                  />
                  <span className="text-sm text-gray-700">미성년자 (공제액 2천만원)</span>
                </label>
              </div>
            )}

            {/* 증여재산 금액 입력 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                증여재산 가액
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={giftAmount || ''}
                  onChange={(e) => setGiftAmount(Number(e.target.value))}
                  className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                  placeholder="10000"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  만원
                </span>
              </div>
            </div>

            {/* 계산 버튼 */}
            <button
              onClick={handleCalculate}
              className="w-full py-4 bg-[#F15F5F] text-white rounded-xl font-bold hover:bg-[#E14E4E] transition-colors"
            >
              증여세 계산
            </button>

            {/* 결과 */}
            {result && (
              <div className="mt-8 space-y-4">
                <div className="bg-gradient-to-br from-red-50 to-pink-50/30 rounded-2xl p-6 border border-red-100">
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 mb-2">예상 증여세</p>
                    <p className="text-4xl font-bold text-[#F15F5F]">
                      {result.calculatedTax.toLocaleString()}만원
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      ({(result.calculatedTax * 10000).toLocaleString()}원)
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-red-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">증여재산 가액</span>
                      <span className="font-medium">{result.giftAmount.toLocaleString()}만원</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">증여재산공제</span>
                      <span className="font-medium text-[#F15F5F]">-{result.deduction.toLocaleString()}만원</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-red-200 pt-3">
                      <span className="text-gray-900">과세표준</span>
                      <span>{result.taxBase.toLocaleString()}만원</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">세율</span>
                      <span className="font-medium">{result.taxRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">누진공제</span>
                      <span className="font-medium text-[#F15F5F]">-{result.progressiveDeduction.toLocaleString()}만원</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 참고사항 */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>ℹ️</span>
                증여세 과세 기준표
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">과세표준</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700">세율</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-700">누진공제액</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    <tr>
                      <td className="px-4 py-2 text-gray-600">1억원 이하</td>
                      <td className="px-4 py-2 text-center">10%</td>
                      <td className="px-4 py-2 text-right">0원</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-gray-600">5억원 이하</td>
                      <td className="px-4 py-2 text-center">20%</td>
                      <td className="px-4 py-2 text-right">1천만원</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-gray-600">10억원 이하</td>
                      <td className="px-4 py-2 text-center">30%</td>
                      <td className="px-4 py-2 text-right">6천만원</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-gray-600">30억원 이하</td>
                      <td className="px-4 py-2 text-center">40%</td>
                      <td className="px-4 py-2 text-right">1억6천만원</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-gray-600">30억원 초과</td>
                      <td className="px-4 py-2 text-center">50%</td>
                      <td className="px-4 py-2 text-right">4억6천만원</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 추의사항 */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">⚠️ 주의사항</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                부동산 증여 시 취득세(증여 취득세) 및 양도세(부담부 증여인 경우) 또한 발생할 수 있습니다.
                증여 취득세는 <span className="text-[#F15F5F] font-medium">취득세 계산기</span>,
                양도세는 <span className="text-[#F15F5F] font-medium">양도세 계산기</span>에서 확인하세요.
              </p>
            </div>
          </div>
        )}

        {/* 부담부증여 탭 */}
        {activeTab === 'burden' && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-600">부담부증여 계산 기능은 곧 추가됩니다...</p>
          </div>
        )}
      </div>
    </div>
  )
}
