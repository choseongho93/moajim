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

interface CalculatorPageProps {
  initialSubView?: string
}

export default function CalculatorPage({ initialSubView }: CalculatorPageProps) {
  // initialSubView에 따라 적절한 계산기 표시
  if (initialSubView === 'gift-tax') {
    return <GiftTaxCalculator />
  }

  if (initialSubView === 'inheritance-tax') {
    return <InheritanceTaxCalculator />
  }

  // 기본: 계산기 목록
  return <CalculatorList />
}

// 계산기 목록 화면
function CalculatorList() {
  const navigateTo = (sub: string) => {
    window.location.href = `/?view=calculator&sub=${sub}`
  }

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-[42px] font-bold text-gray-900 mb-2 sm:mb-3">
            세금 계산기
          </h1>
          <p className="text-sm sm:text-base md:text-[17px] text-gray-600">
            필요한 세금을 쉽고 빠르게 계산하세요
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <button
            onClick={() => navigateTo('gift-tax')}
            className="group text-left p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#F15F5F] transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🎁</span>
              <svg className="w-6 h-6 text-gray-300 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">증여세 계산기</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              타인으로부터 재산을 무상으로 받을 때 발생하는 증여세를 계산합니다.
            </p>
          </button>

          <button
            onClick={() => navigateTo('inheritance-tax')}
            className="group text-left p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#F15F5F] transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">📜</span>
              <svg className="w-6 h-6 text-gray-300 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">상속세 계산기</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              사망에 따른 재산 상속 시 부과되는 상속세를 계산합니다.
            </p>
          </button>

          <div className="text-left p-6 bg-gray-50 rounded-2xl border-2 border-gray-200 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🏠</span>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-medium">준비중</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">취득세 계산기</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              부동산 취득 시 발생하는 취득세를 계산합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 증여세 계산기
function GiftTaxCalculator() {
  const [activeTab, setActiveTab] = useState<'explanation' | 'gift' | 'burden' | 'acquisition'>('gift')
  const [donorType, setDonorType] = useState<DonorType>('spouse')
  const [giftAmount, setGiftAmount] = useState<number>(0)
  const [isMinor, setIsMinor] = useState(false)

  // 추가 입력 필드 (체크박스)
  const [hasAppraisalFee, setHasAppraisalFee] = useState(false)
  const [hasTaxExempt, setHasTaxExempt] = useState(false)
  const [hasDebt, setHasDebt] = useState(false)
  const [hasPastGift, setHasPastGift] = useState(false)
  const [hasTaxPayment, setHasTaxPayment] = useState(false)

  const [appraisalFee, setAppraisalFee] = useState<number>(0)
  const [taxExemptAmount, setTaxExemptAmount] = useState<number>(0)
  const [debtAmount, setDebtAmount] = useState<number>(0)
  const [pastGiftAmount, setPastGiftAmount] = useState<number>(0)
  const [giftTaxPaid, setGiftTaxPaid] = useState<number>(0)

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
    <div className="min-h-screen bg-white py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => {
            window.location.href = '/?view=calculator'
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          세금 계산기 목록
        </button>

        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">증여세 계산</h1>
        </div>

        {/* 탭 */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'explanation'
                ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            설명
          </button>
          <button
            onClick={() => setActiveTab('gift')}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'gift'
                ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            증여세 계산
          </button>
          <button
            onClick={() => setActiveTab('burden')}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'burden'
                ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            부담부증여
          </button>
          <button
            onClick={() => setActiveTab('acquisition')}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'acquisition'
                ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            증여취득세
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
                증여재산
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={giftAmount || ''}
                  onChange={(e) => setGiftAmount(Number(e.target.value))}
                  className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                  placeholder="금액 입력"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  만원
                </span>
              </div>
            </div>

            {/* 추가 옵션 체크박스 */}
            <div className="space-y-3 py-4 border-t border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAppraisalFee}
                  onChange={(e) => setHasAppraisalFee(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">감정평가수수료</span>
              </label>

              {hasAppraisalFee && (
                <div className="ml-6 relative">
                  <input
                    type="number"
                    value={appraisalFee || ''}
                    onChange={(e) => setAppraisalFee(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="금액 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    만원
                  </span>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasTaxExempt}
                  onChange={(e) => setHasTaxExempt(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">비과세액 등</span>
              </label>

              {hasTaxExempt && (
                <div className="ml-6 relative">
                  <input
                    type="number"
                    value={taxExemptAmount || ''}
                    onChange={(e) => setTaxExemptAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="금액 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    만원
                  </span>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasDebt}
                  onChange={(e) => setHasDebt(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">부채부담액</span>
              </label>

              {hasDebt && (
                <div className="ml-6 relative">
                  <input
                    type="number"
                    value={debtAmount || ''}
                    onChange={(e) => setDebtAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="금액 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    만원
                  </span>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPastGift}
                  onChange={(e) => setHasPastGift(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">과거 10년 동일인 증여</span>
              </label>

              {hasPastGift && (
                <div className="ml-6 relative">
                  <input
                    type="number"
                    value={pastGiftAmount || ''}
                    onChange={(e) => setPastGiftAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="금액 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    만원
                  </span>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasTaxPayment}
                  onChange={(e) => setHasTaxPayment(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">세금 대납</span>
              </label>

              {hasTaxPayment && (
                <div className="ml-6 relative">
                  <input
                    type="number"
                    value={giftTaxPaid || ''}
                    onChange={(e) => setGiftTaxPaid(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="금액 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    만원
                  </span>
                </div>
              )}
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              채무를 포함하여 증여를 하는 경우 부담부증여 계산방법에 따라 양도세를 함께 계산해야 합니다.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              채무자가 부담할 채무를 수증자에게 이전하는 경우, 증여가액은 (부동산시가 - 채무액)으로 계산되며
              증여세는 부담부증여 증여세율로 계산하게 됩니다.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              단, 채무액에 대해서는 양도소득세가 발생할 수 있으니 주의하시기 바랍니다.
            </p>
          </div>
        )}

        {/* 증여취득세 탭 */}
        {activeTab === 'acquisition' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              주택을 증여를 통해 취득(무상 취득)하는 경우 취득 세율이 3.5% 또는 12%로 고정세율이 적용됩니다.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              주택 증여 시 1세대 1주택자가 증여하는 경우 3.5%, 다주택자가 증여하는 경우 12%가 적용됩니다.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              농지를 증여받는 경우엔 농지 취득세율이 3%로 고정 적용됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// 상속세 계산기
function InheritanceTaxCalculator() {
  const [activeTab, setActiveTab] = useState<'explanation' | 'spouse' | 'deduction'>('spouse')

  // 상속 정보
  const [inheritanceAmount, setInheritanceAmount] = useState<number>(0)
  const [funeralExpense, setFuneralExpense] = useState<number>(0)

  // 체크박스 옵션
  const [use2024Reform, setUse2024Reform] = useState(false)
  const [isGenerationSkip, setIsGenerationSkip] = useState(false)
  const [isMinorHeir, setIsMinorHeir] = useState(false)
  const [hasDebt, setHasDebt] = useState(false)
  const [hasAppraisal, setHasAppraisal] = useState(false)
  const [hasResidence, setHasResidence] = useState(false)
  const [hasFinancial, setHasFinancial] = useState(false)
  const [hasPastGift, setHasPastGift] = useState(false)

  // 조건부 입력 필드
  const [generationSkipAmount, setGenerationSkipAmount] = useState<number>(0)
  const [debtAmount, setDebtAmount] = useState<number>(0)
  const [appraisalFee, setAppraisalFee] = useState<number>(0)
  const [residenceValue, setResidenceValue] = useState<number>(0)
  const [financialAmount, setFinancialAmount] = useState<number>(0)
  const [pastGiftAmount, setPastGiftAmount] = useState<number>(0)

  return (
    <div className="min-h-screen bg-white py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => {
            window.location.href = '/?view=calculator'
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          세금 계산기 목록
        </button>

        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">상속세 계산</h1>
        </div>

        {/* 탭 */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'explanation'
                ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            설명
          </button>
          <button
            onClick={() => setActiveTab('spouse')}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'spouse'
                ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            배우자 공제
          </button>
          <button
            onClick={() => setActiveTab('deduction')}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'deduction'
                ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            인적/일괄 공제
          </button>
        </div>

        {/* 설명 탭 */}
        {activeTab === 'explanation' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed mb-3">
              사망에 따른 재산 상속 시 부과되는 조세를 계산합니다.
            </p>
            <p className="text-sm text-gray-600">
              상단의 "배우자 공제"와 "인적/일괄공제"에 대한 설명을 꼭 읽어주시기 바랍니다.
            </p>
          </div>
        )}

        {/* 배우자 공제 탭 */}
        {activeTab === 'spouse' && (
          <div className="space-y-6">
            {/* 안내 문구 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-sm text-gray-700 leading-relaxed">
                배우자가 있는 경우, 배우자가 상속을 받지 않더라도 기본적으로 5억원을 공제 받을 수 있습니다.
                배우자가 직접 상속을 받는 경우엔 최대 30억원까지 공제를 받을 수 있습니다.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mt-3">
                배우자가 상속을 받지 않거나 5억원 이하로 상속 받는 경우엔 "배우자 유"를 선택하면 간단히 계산할 수 있습니다.
                배우자가 실제로 5억원 이상의 금액을 상속받는 경우엔 좀 더 복잡한 계산이 필요하므로 "배우자 유(상속)"을 클릭하십시오.
              </p>
            </div>

            {/* 옵션 체크박스 */}
            <div className="space-y-3 py-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={use2024Reform}
                  onChange={(e) => setUse2024Reform(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">2024 세법개정안 미리 적용</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGenerationSkip}
                  onChange={(e) => setIsGenerationSkip(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">세대를 건너뛴 상속</span>
              </label>

              {isGenerationSkip && (
                <div className="ml-6 relative">
                  <input
                    type="number"
                    value={generationSkipAmount || ''}
                    onChange={(e) => setGenerationSkipAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="금액 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    만원
                  </span>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMinorHeir}
                  onChange={(e) => setIsMinorHeir(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">상속자 미성년자 여부</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasDebt}
                  onChange={(e) => setHasDebt(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">채무상속</span>
              </label>

              {hasDebt && (
                <div className="ml-6 relative">
                  <input
                    type="number"
                    value={debtAmount || ''}
                    onChange={(e) => setDebtAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="금액 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    만원
                  </span>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAppraisal}
                  onChange={(e) => setHasAppraisal(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">감정평가 수수료</span>
              </label>

              {hasAppraisal && (
                <div className="ml-6 relative">
                  <input
                    type="number"
                    value={appraisalFee || ''}
                    onChange={(e) => setAppraisalFee(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="금액 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    만원
                  </span>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasResidence}
                  onChange={(e) => setHasResidence(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">동거주택 공제</span>
              </label>

              {hasResidence && (
                <div className="ml-6 relative">
                  <input
                    type="number"
                    value={residenceValue || ''}
                    onChange={(e) => setResidenceValue(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="금액 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    만원
                  </span>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasFinancial}
                  onChange={(e) => setHasFinancial(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">금융재산 공제</span>
              </label>

              {hasFinancial && (
                <div className="ml-6 relative">
                  <input
                    type="number"
                    value={financialAmount || ''}
                    onChange={(e) => setFinancialAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="금액 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    만원
                  </span>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPastGift}
                  onChange={(e) => setHasPastGift(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">과거 5년 증여 존재</span>
              </label>

              {hasPastGift && (
                <div className="ml-6 relative">
                  <input
                    type="number"
                    value={pastGiftAmount || ''}
                    onChange={(e) => setPastGiftAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="금액 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    만원
                  </span>
                </div>
              )}
            </div>

            {/* 상속재산 입력 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                상속재산
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inheritanceAmount || ''}
                  onChange={(e) => setInheritanceAmount(Number(e.target.value))}
                  className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                  placeholder="금액 입력"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  만원
                </span>
              </div>
            </div>

            {/* 장례비용 입력 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                장례비용 등
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={funeralExpense || ''}
                  onChange={(e) => setFuneralExpense(Number(e.target.value))}
                  className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                  placeholder="금액 입력"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  만원
                </span>
              </div>
            </div>

            {/* 계산 버튼 */}
            <button
              className="w-full py-4 bg-[#F15F5F] text-white rounded-xl font-bold hover:bg-[#E14E4E] transition-colors"
            >
              상속세 계산
            </button>

            {/* 참고사항 */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>ℹ️</span>
                상속세 과세 기준표
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

            {/* 주의사항 */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">⚠️ 주의사항</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                본 계산기는 대략적인 금액을 예측하는 참고용으로만 사용하여야 하며
                실제 상속세 납부시에는 세무사의 도움을 받으셔야 합니다.
              </p>
            </div>
          </div>
        )}

        {/* 인적/일괄 공제 탭 */}
        {activeTab === 'deduction' && (
          <div className="space-y-6">
            {/* 안내 문구 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                기초공제(2억원) + 인적공제(자녀, 연로자, 장애인 등)와 일괄공제(5억원) 중 큰 금액을 선택하여 공제받을 수 있습니다.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                "일괄공제 적용"을 클릭하면 복잡한 인적공제 정보를 입력하지 않고 일괄공제를 적용하여 계산하실 수 있습니다.
                어린 자녀가 있거나 연로자, 장애인이 상속을 받는 경우엔 "인적공제 계산"를 선택해서 정확히 계산해보시길 권장드립니다.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                단, 배우자 단독상속인 경우엔 기초공제 + 인적공제만 적용 가능하므로 "인적공제 계산"를 클릭하여 모든 정보를 입력해주셔야 합니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
