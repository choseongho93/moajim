import { useState } from 'react'
import { calculateGiftTax, type DonorType, type GiftTaxResult } from '../utils/giftTax'
import { calculateInheritanceTax, type InheritanceTabType, type InheritanceTaxResult } from '../utils/inheritanceTax'
import { formatKoreanAmount } from '../utils/currency'
import ShareButtons from '../components/ShareButtons'

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
  const [isGenerationSkip, setIsGenerationSkip] = useState(false)
  const [isMarriageGift, setIsMarriageGift] = useState(false)
  const [marriageGiftAmount, setMarriageGiftAmount] = useState<number>(0)

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

  const handleCalculate = () => {
    setResult(calculateGiftTax({
      giftAmount,
      donorType,
      isMinor,
      isGenerationSkip,
      isMarriageGift,
      marriageGiftAmount,
      debtAmount: hasDebt ? debtAmount : 0,
      taxExemptAmount: hasTaxExempt ? taxExemptAmount : 0,
      appraisalFee: hasAppraisalFee ? appraisalFee : 0,
      pastGiftAmount: hasPastGift ? pastGiftAmount : 0,
      giftTaxPaid: hasTaxPayment ? giftTaxPaid : 0,
    }))
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
          <ShareButtons url="https://moajim.com/?view=calculator&sub=gift-tax" />
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
              {giftAmount > 0 && (
                <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(giftAmount)}</p>
              )}
            </div>

            {/* 직계존속 전용 옵션 */}
            {donorType === 'ascendant' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-amber-700 tracking-wide mb-2">직계존속 증여 특수 항목</p>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGenerationSkip}
                    onChange={(e) => setIsGenerationSkip(e.target.checked)}
                    className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                  />
                  <div>
                    <span className="text-sm text-gray-800 font-medium">세대생략 증여</span>
                    <span className="text-xs text-amber-600 ml-2">할증 30%</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMinor}
                    onChange={(e) => setIsMinor(e.target.checked)}
                    className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                  />
                  <div>
                    <span className="text-sm text-gray-800 font-medium">수증자가 미성년자</span>
                    <span className="text-xs text-gray-500 ml-2">공제 2천만원 적용</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMarriageGift}
                    onChange={(e) => setIsMarriageGift(e.target.checked)}
                    className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                  />
                  <div>
                    <span className="text-sm text-gray-800 font-medium">결혼·출산 증여공제</span>
                    <span className="text-xs text-amber-600 ml-2">추가 1억원 공제</span>
                  </div>
                </label>

                {isMarriageGift && (
                  <>
                    <div className="ml-7 relative">
                      <input
                        type="number"
                        value={marriageGiftAmount || ''}
                        onChange={(e) => setMarriageGiftAmount(Number(e.target.value))}
                        className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-amber-200 focus:border-[#F15F5F] focus:outline-none text-sm"
                        placeholder="결혼·출산 증여 금액"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                        만원
                      </span>
                    </div>
                    {marriageGiftAmount > 0 && (
                      <p className="ml-7 text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(marriageGiftAmount)}</p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* 공제·차감 항목 */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <p className="text-xs font-bold text-gray-500 tracking-wide">공제·차감 항목</p>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasDebt}
                  onChange={(e) => setHasDebt(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">증여재산에 담보된 채무 인수액</span>
              </label>

              {hasDebt && (
                <>
                  <div className="ml-7 relative">
                    <input
                      type="number"
                      value={debtAmount || ''}
                      onChange={(e) => setDebtAmount(Number(e.target.value))}
                      className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                      placeholder="인수한 채무 금액"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                      만원
                    </span>
                  </div>
                  {debtAmount > 0 && (
                    <p className="ml-7 text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(debtAmount)}</p>
                  )}
                </>
              )}

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasTaxExempt}
                  onChange={(e) => setHasTaxExempt(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">비과세·과세불산입액</span>
              </label>

              {hasTaxExempt && (
                <>
                  <div className="ml-7 relative">
                    <input
                      type="number"
                      value={taxExemptAmount || ''}
                      onChange={(e) => setTaxExemptAmount(Number(e.target.value))}
                      className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                      placeholder="비과세 해당 금액"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                      만원
                    </span>
                  </div>
                  {taxExemptAmount > 0 && (
                    <p className="ml-7 text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(taxExemptAmount)}</p>
                  )}
                </>
              )}

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAppraisalFee}
                  onChange={(e) => setHasAppraisalFee(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">감정평가 수수료 공제</span>
              </label>

              {hasAppraisalFee && (
                <>
                  <div className="ml-7 relative">
                    <input
                      type="number"
                      value={appraisalFee || ''}
                      onChange={(e) => setAppraisalFee(Number(e.target.value))}
                      className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                      placeholder="감정평가 수수료"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                      만원
                    </span>
                  </div>
                  {appraisalFee > 0 && (
                    <p className="ml-7 text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(appraisalFee)}</p>
                  )}
                </>
              )}
            </div>

            {/* 기신고·납부 항목 */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <p className="text-xs font-bold text-gray-500 tracking-wide">기신고·납부 항목</p>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPastGift}
                  onChange={(e) => setHasPastGift(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">10년 내 동일인으로부터 사전증여</span>
              </label>

              {hasPastGift && (
                <>
                  <div className="ml-7 relative">
                    <input
                      type="number"
                      value={pastGiftAmount || ''}
                      onChange={(e) => setPastGiftAmount(Number(e.target.value))}
                      className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                      placeholder="사전증여 재산가액 합계"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                      만원
                    </span>
                  </div>
                  {pastGiftAmount > 0 && (
                    <p className="ml-7 text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(pastGiftAmount)}</p>
                  )}
                </>
              )}

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasTaxPayment}
                  onChange={(e) => setHasTaxPayment(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">증여세 기납부세액 (대납 포함)</span>
              </label>

              {hasTaxPayment && (
                <div className="ml-7 relative">
                  <input
                    type="number"
                    value={giftTaxPaid || ''}
                    onChange={(e) => setGiftTaxPaid(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="이미 납부한 증여세액"
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
                      {result.finalTax.toLocaleString()}만원
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      ({(result.finalTax * 10000).toLocaleString()}원)
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-red-200 pt-4">
                    {/* 증여세과세가액 산출 */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">증여재산 가액</span>
                      <span className="font-medium">{result.giftAmount.toLocaleString()}만원</span>
                    </div>
                    {result.debtAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">채무 인수액</span>
                        <span className="font-medium text-[#F15F5F]">-{result.debtAmount.toLocaleString()}만원</span>
                      </div>
                    )}
                    {result.taxExemptAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">비과세·과세불산입</span>
                        <span className="font-medium text-[#F15F5F]">-{result.taxExemptAmount.toLocaleString()}만원</span>
                      </div>
                    )}
                    {result.pastGiftAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">사전증여 가산</span>
                        <span className="font-medium">+{result.pastGiftAmount.toLocaleString()}만원</span>
                      </div>
                    )}

                    {/* 공제 */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">증여재산공제</span>
                      <span className="font-medium text-[#F15F5F]">-{result.personalDeduction.toLocaleString()}만원</span>
                    </div>
                    {result.marriageDeduction > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">결혼·출산 공제</span>
                        <span className="font-medium text-[#F15F5F]">-{result.marriageDeduction.toLocaleString()}만원</span>
                      </div>
                    )}
                    {result.appraisalFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">감정평가 수수료</span>
                        <span className="font-medium text-[#F15F5F]">-{result.appraisalFee.toLocaleString()}만원</span>
                      </div>
                    )}

                    {/* 과세표준·세율 */}
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

                    {/* 산출세액·공제 */}
                    <div className="flex justify-between text-sm font-bold border-t border-red-200 pt-3">
                      <span className="text-gray-900">산출세액</span>
                      <span>{result.calculatedTax.toLocaleString()}만원</span>
                    </div>
                    {result.generationSkipSurcharge > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">세대생략 할증 (30%)</span>
                        <span className="font-medium">포함</span>
                      </div>
                    )}
                    {result.giftTaxPaid > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">기납부세액</span>
                        <span className="font-medium text-[#F15F5F]">-{result.giftTaxPaid.toLocaleString()}만원</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">신고세액공제 (3%)</span>
                      <span className="font-medium text-[#F15F5F]">-{result.filingDeduction.toLocaleString()}만원</span>
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
  const [activeTab, setActiveTab] = useState<InheritanceTabType>('spouse-simple')

  // 상속 정보
  const [inheritanceAmount, setInheritanceAmount] = useState<number>(0)
  const [funeralExpense, setFuneralExpense] = useState<number>(0)
  const [spouseInheritance, setSpouseInheritance] = useState<number>(0)

  // 상속인 수
  const [descendantCount, setDescendantCount] = useState<number>(0)
  const [ascendantCount, setAscendantCount] = useState<number>(0)
  const [childrenCount, setChildrenCount] = useState<number>(0)
  const [elderlyCount, setElderlyCount] = useState<number>(0)
  const [minorCount, setMinorCount] = useState<number>(0)
  const [disabledCount, setDisabledCount] = useState<number>(0)

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
  const [residenceDeduction, setResidenceDeduction] = useState<number>(0)
  const [financialAmount, setFinancialAmount] = useState<number>(0)
  const [pastGiftAmount, setPastGiftAmount] = useState<number>(0)

  const [result, setResult] = useState<InheritanceTaxResult | null>(null)

  const handleCalculate = () => {
    setResult(calculateInheritanceTax({
      tabType: activeTab,
      inheritanceAmount,
      funeralExpense,
      spouseInheritance: activeTab !== 'no-spouse' ? spouseInheritance : 0,
      descendantCount: activeTab !== 'no-spouse' ? descendantCount : 0,
      ascendantCount: activeTab !== 'no-spouse' ? ascendantCount : 0,
      childrenCount: activeTab !== 'spouse-simple' ? childrenCount : 0,
      elderlyCount: activeTab !== 'spouse-simple' ? elderlyCount : 0,
      minorCount: activeTab !== 'spouse-simple' ? minorCount : 0,
      disabledCount: activeTab !== 'spouse-simple' ? disabledCount : 0,
      use2024Reform,
      isGenerationSkip,
      generationSkipAmount: isGenerationSkip ? generationSkipAmount : 0,
      isMinorHeir,
      hasDebt,
      debtAmount,
      hasAppraisal,
      appraisalFee,
      hasResidence,
      residenceDeduction,
      hasFinancial,
      financialAmount,
      hasPastGift,
      pastGiftAmount,
    }))
  }

  const tabStyle = (tab: InheritanceTabType) =>
    `px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
      activeTab === tab
        ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
        : 'text-gray-500 hover:text-gray-700'
    }`

  const showSpouseFields = activeTab !== 'no-spouse'
  const showPersonalFields = activeTab !== 'spouse-simple'

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
          <ShareButtons url="https://moajim.com/?view=calculator&sub=inheritance-tax" />
        </div>

        {/* 탭 */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
          <button onClick={() => { setActiveTab('spouse-simple'); setResult(null) }} className={tabStyle('spouse-simple')}>
            배우자 유
          </button>
          <button onClick={() => { setActiveTab('spouse-detail'); setResult(null) }} className={tabStyle('spouse-detail')}>
            배우자 유(상속)
          </button>
          <button onClick={() => { setActiveTab('no-spouse'); setResult(null) }} className={tabStyle('no-spouse')}>
            배우자 무
          </button>
        </div>

        {/* 안내 문구 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          {activeTab === 'spouse-simple' && (
            <p className="text-sm text-gray-700 leading-relaxed">
              배우자가 있지만 상속을 받지 않거나 5억원 이하로 상속받는 경우에 사용합니다.
              배우자공제 5억원 + 일괄공제 5억원이 자동 적용됩니다.
            </p>
          )}
          {activeTab === 'spouse-detail' && (
            <p className="text-sm text-gray-700 leading-relaxed">
              배우자가 실제로 5억원 이상 상속받는 경우, 법정상속분에 따라 배우자공제를 정확히 계산합니다.
              배우자 실제 상속액과 직계비속/존속 수를 입력해주세요.
            </p>
          )}
          {activeTab === 'no-spouse' && (
            <p className="text-sm text-gray-700 leading-relaxed">
              배우자가 없는 경우입니다. 배우자공제가 적용되지 않으며, 일괄공제(5억) 또는 기초공제+인적공제 중 큰 금액이 적용됩니다.
            </p>
          )}
        </div>

        <div className="space-y-6">
          {/* 옵션 체크박스 */}
          <div className="space-y-3 py-4 border-t border-gray-200">
            <p className="text-xs font-bold text-gray-500 tracking-wide">옵션</p>

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
              <>
                <div className="ml-6 relative">
                  <input
                    type="number"
                    value={generationSkipAmount || ''}
                    onChange={(e) => setGenerationSkipAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="세대생략 상속액"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">만원</span>
                </div>
                {generationSkipAmount > 0 && (
                  <p className="ml-6 text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(generationSkipAmount)}</p>
                )}
                <label className="ml-6 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMinorHeir}
                    onChange={(e) => setIsMinorHeir(e.target.checked)}
                    className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                  />
                  <span className="text-sm text-gray-700">상속자 미성년자 여부 <span className="text-xs text-gray-500">(할증 40%, 그 외 30%)</span></span>
                </label>
              </>
            )}

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
              <>
                <div className="ml-6 relative">
                  <input
                    type="number"
                    value={debtAmount || ''}
                    onChange={(e) => setDebtAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="채무 금액"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">만원</span>
                </div>
                {debtAmount > 0 && (
                  <p className="ml-6 text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(debtAmount)}</p>
                )}
              </>
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
              <>
                <div className="ml-6 relative">
                  <input
                    type="number"
                    value={appraisalFee || ''}
                    onChange={(e) => setAppraisalFee(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="수수료 금액"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">만원</span>
                </div>
                {appraisalFee > 0 && (
                  <p className="ml-6 text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(appraisalFee)}</p>
                )}
              </>
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
              <>
                <div className="ml-6 relative">
                  <input
                    type="number"
                    value={residenceDeduction || ''}
                    onChange={(e) => setResidenceDeduction(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="공제 금액"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">만원</span>
                </div>
                {residenceDeduction > 0 && (
                  <p className="ml-6 text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(residenceDeduction)}</p>
                )}
              </>
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
              <>
                <div className="ml-6 relative">
                  <input
                    type="number"
                    value={financialAmount || ''}
                    onChange={(e) => setFinancialAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="금융재산 금액"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">만원</span>
                </div>
                {financialAmount > 0 && (
                  <p className="ml-6 text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(financialAmount)}</p>
                )}
              </>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPastGift}
                onChange={(e) => setHasPastGift(e.target.checked)}
                className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
              />
              <span className="text-sm text-gray-700">과거 5년 증여</span>
            </label>
            {hasPastGift && (
              <>
                <div className="ml-6 relative">
                  <input
                    type="number"
                    value={pastGiftAmount || ''}
                    onChange={(e) => setPastGiftAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="증여 금액"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">만원</span>
                </div>
                {pastGiftAmount > 0 && (
                  <p className="ml-6 text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(pastGiftAmount)}</p>
                )}
              </>
            )}
          </div>

          {/* 상속재산 입력 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">상속재산</label>
            <div className="relative">
              <input
                type="number"
                value={inheritanceAmount || ''}
                onChange={(e) => setInheritanceAmount(Number(e.target.value))}
                className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                placeholder="금액 입력"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
            </div>
            {inheritanceAmount > 0 && (
              <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(inheritanceAmount)}</p>
            )}
          </div>

          {/* 장례비용 */}
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
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
            </div>
            {funeralExpense > 0 && (
              <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(funeralExpense)}</p>
            )}
          </div>

          {/* 배우자 상속액 (배우자 유 탭만) */}
          {showSpouseFields && activeTab === 'spouse-detail' && (
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">배우자 실제 상속액</label>
              <div className="relative">
                <input
                  type="number"
                  value={spouseInheritance || ''}
                  onChange={(e) => setSpouseInheritance(Number(e.target.value))}
                  className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                  placeholder="금액 입력"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
              </div>
              {spouseInheritance > 0 && (
                <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(spouseInheritance)}</p>
              )}
            </div>
          )}

          {/* 직계비속/존속 수 (배우자 유 탭만) */}
          {showSpouseFields && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">직계비속 (명)</label>
                <input
                  type="number"
                  min={0}
                  value={descendantCount || ''}
                  onChange={(e) => setDescendantCount(Number(e.target.value))}
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">직계존속 (명)</label>
                <input
                  type="number"
                  min={0}
                  value={ascendantCount || ''}
                  onChange={(e) => setAscendantCount(Number(e.target.value))}
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                  placeholder="0"
                />
              </div>
            </div>
          )}

          {/* 인적공제 입력 (배우자유(상속), 배우자무) */}
          {showPersonalFields && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-4">
              <p className="text-xs font-bold text-amber-700 tracking-wide">인적공제 항목</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">자녀 (명)</label>
                  <input
                    type="number"
                    min={0}
                    value={childrenCount || ''}
                    onChange={(e) => setChildrenCount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="0"
                  />
                  <p className="text-xs text-amber-600 mt-1">
                    {use2024Reform ? '1인당 5억 공제' : '1인당 5천만 공제'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">고령자 (명)</label>
                  <input
                    type="number"
                    min={0}
                    value={elderlyCount || ''}
                    onChange={(e) => setElderlyCount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="0"
                  />
                  <p className="text-xs text-amber-600 mt-1">1인당 5천만 공제</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">미성년 (명)</label>
                  <input
                    type="number"
                    min={0}
                    value={minorCount || ''}
                    onChange={(e) => setMinorCount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="0"
                  />
                  <p className="text-xs text-amber-600 mt-1">1인당 1천만 공제</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">장애인 (명)</label>
                  <input
                    type="number"
                    min={0}
                    value={disabledCount || ''}
                    onChange={(e) => setDisabledCount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:border-[#F15F5F] focus:outline-none"
                    placeholder="0"
                  />
                  <p className="text-xs text-amber-600 mt-1">1인당 1천만 공제</p>
                </div>
              </div>
            </div>
          )}

          {/* 계산 버튼 */}
          <button
            onClick={handleCalculate}
            className="w-full py-4 bg-[#F15F5F] text-white rounded-xl font-bold hover:bg-[#E14E4E] transition-colors"
          >
            상속세 계산
          </button>

          {/* 결과 */}
          {result && (
            <div className="mt-8 space-y-4">
              <div className="bg-gradient-to-br from-red-50 to-pink-50/30 rounded-2xl p-6 border border-red-100">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 mb-2">예상 상속세</p>
                  <p className="text-4xl font-bold text-[#F15F5F]">
                    {result.finalTaxWon.toLocaleString()}원
                  </p>
                </div>

                <div className="space-y-3 border-t border-red-200 pt-4">
                  {/* 상속세과세가액 산출 */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">상속재산</span>
                    <span className="font-medium">{result.inheritanceAmount.toLocaleString()}만원</span>
                  </div>
                  {result.funeralExpense > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">장례비용 등</span>
                      <span className="font-medium text-[#F15F5F]">-{result.funeralExpense.toLocaleString()}만원</span>
                    </div>
                  )}
                  {result.debtAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">채무</span>
                      <span className="font-medium text-[#F15F5F]">-{result.debtAmount.toLocaleString()}만원</span>
                    </div>
                  )}
                  {result.pastGiftAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">사전증여 가산</span>
                      <span className="font-medium">+{result.pastGiftAmount.toLocaleString()}만원</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold border-t border-red-200 pt-3">
                    <span className="text-gray-900">상속세과세가액</span>
                    <span>{result.taxableInheritance.toLocaleString()}만원</span>
                  </div>

                  {/* 공제 항목 */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {activeTab === 'spouse-simple'
                        ? '일괄공제'
                        : result.generalDeduction === result.lumpSumDeduction || result.lumpSumDeduction > 0
                          ? '일괄공제'
                          : `기초공제(${result.basicDeduction.toLocaleString()}만) + 인적공제(${result.personalDeduction.toLocaleString()}만)`}
                    </span>
                    <span className="font-medium">{result.generalDeduction.toLocaleString()}만원</span>
                  </div>
                  {result.spouseDeduction > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">배우자공제</span>
                      <span className="font-medium">{result.spouseDeduction.toLocaleString()}만원</span>
                    </div>
                  )}
                  {result.financialDeduction > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">금융재산공제</span>
                      <span className="font-medium">{result.financialDeduction.toLocaleString()}만원</span>
                    </div>
                  )}
                  {result.residenceDeduction > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">동거주택공제</span>
                      <span className="font-medium">{result.residenceDeduction.toLocaleString()}만원</span>
                    </div>
                  )}
                  {result.appraisalFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">감정평가수수료</span>
                      <span className="font-medium">{result.appraisalFee.toLocaleString()}만원</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">상속공제 소계</span>
                    <span className="font-medium">{result.totalDeductions.toLocaleString()}만원</span>
                  </div>
                  {result.appliedDeductions < result.totalDeductions && (
                    <div className="flex justify-between text-sm font-medium text-amber-700">
                      <span>공제 종합한도 적용</span>
                      <span>-{result.appliedDeductions.toLocaleString()}만원</span>
                    </div>
                  )}
                  {result.appliedDeductions >= result.totalDeductions && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">적용 공제</span>
                      <span className="font-medium text-[#F15F5F]">-{result.appliedDeductions.toLocaleString()}만원</span>
                    </div>
                  )}

                  {/* 과세표준·세율 */}
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

                  {/* 산출세액·공제 */}
                  <div className="flex justify-between text-sm font-bold border-t border-red-200 pt-3">
                    <span className="text-gray-900">산출세액</span>
                    <span>{(result.baseTax * 10000).toLocaleString()}원</span>
                  </div>
                  {result.generationSkipSurcharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">세대생략가산액 ({isMinorHeir ? '40%' : '30%'})</span>
                      <span className="font-medium">{(result.generationSkipSurcharge * 10000).toLocaleString()}원</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">신고세액공제 (3%)</span>
                    <span className="font-medium text-[#F15F5F]">-{result.filingDeductionWon.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 참고사항 */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>ℹ️</span>
              상속세 과세 기준표 {use2024Reform ? '(2024 개정안)' : '(현행)'}
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
                  {use2024Reform ? (
                    <>
                      <tr>
                        <td className="px-4 py-2 text-gray-600">2억원 이하</td>
                        <td className="px-4 py-2 text-center">10%</td>
                        <td className="px-4 py-2 text-right">0원</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-gray-600">5억원 이하</td>
                        <td className="px-4 py-2 text-center">20%</td>
                        <td className="px-4 py-2 text-right">2천만원</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-gray-600">10억원 이하</td>
                        <td className="px-4 py-2 text-center">30%</td>
                        <td className="px-4 py-2 text-right">7천만원</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-gray-600">10억원 초과</td>
                        <td className="px-4 py-2 text-center">40%</td>
                        <td className="px-4 py-2 text-right">1억7천만원</td>
                      </tr>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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
      </div>
    </div>
  )
}

