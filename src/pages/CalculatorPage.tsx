import { useState, useRef } from 'react'
import { calculateGiftTax, type DonorType, type GiftTaxResult } from '../utils/giftTax'
import { calculateInheritanceTax, type SpouseType, type DeductionType, type InheritanceTaxResult } from '../utils/inheritanceTax'
import { calculateAcquisitionTax, type AcquisitionType, type PropertyType, type AreaType, type HouseCount, type AcquisitionTaxResult } from '../utils/acquisitionTax'
import { formatKoreanAmount } from '../utils/currency'
import ShareButtons from '../components/ShareButtons'
import PropertyTaxBanner from '../components/PropertyTaxBanner'
import CaptureButtons from '../components/CaptureButtons'
import { calculateHoldingTax, type PropertyInput as HoldingPropertyInput, type HoldingTaxResult } from '../utils/holdingTax'
import { calculateCapitalGainsTax, type CGTPropertyType, type CapitalGainsTaxResult } from '../utils/capitalGainsTax'

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

  if (initialSubView === 'acquisition-tax') {
    return <AcquisitionTaxCalculator />
  }

  if (initialSubView === 'holding-tax') {
    return <HoldingTaxCalculator />
  }

  if (initialSubView === 'capital-gains-tax') {
    return <CapitalGainsTaxCalculator />
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

        <PropertyTaxBanner />

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

          <button
            onClick={() => navigateTo('acquisition-tax')}
            className="group text-left p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#F15F5F] transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🏠</span>
              <svg className="w-6 h-6 text-gray-300 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">취득세 계산기</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              부동산 취득 시 발생하는 취득세를 계산합니다.
            </p>
          </button>

          <button
            onClick={() => navigateTo('holding-tax')}
            className="group text-left p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#F15F5F] transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🏘️</span>
              <svg className="w-6 h-6 text-gray-300 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">보유세 계산기</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              재산세와 종합부동산세를 함께 계산합니다.
            </p>
          </button>

          <button
            onClick={() => navigateTo('capital-gains-tax')}
            className="group text-left p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#F15F5F] transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">💰</span>
              <svg className="w-6 h-6 text-gray-300 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">양도소득세 계산기</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              부동산 양도 시 발생하는 양도소득세를 계산합니다.
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}

// 증여세 계산기
function GiftTaxCalculator() {
  const resultRef = useRef<HTMLDivElement>(null)
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

        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">증여세 계산</h1>
          <ShareButtons url="https://moajim.com/?view=calculator&sub=gift-tax" />
        </div>

        <PropertyTaxBanner />

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
                <div className="flex justify-end mb-2">
                  <CaptureButtons targetRef={resultRef} fileName="moajim-증여세-결과" />
                </div>
                <div ref={resultRef} className="bg-gradient-to-br from-red-50 to-pink-50/30 rounded-2xl p-6 border border-red-100">
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
  const resultRef = useRef<HTMLDivElement>(null)

  // 안내 탭
  const [infoTab, setInfoTab] = useState<'description' | 'spouse-info' | 'deduction-info'>('description')

  // 배우자 / 공제 선택 (독립적인 2개 탭 그룹)
  const [spouseTab, setSpouseTab] = useState<SpouseType>('spouse-yes')
  const [deductionTab, setDeductionTab] = useState<DeductionType>('lump-sum')

  // 상속 정보
  const [inheritanceAmount, setInheritanceAmount] = useState<number>(0)
  const [funeralExpense, setFuneralExpense] = useState<number>(0)
  const [spouseInheritance, setSpouseInheritance] = useState<number>(0)

  // 상속인 수 (배우자공제 법정상속분 계산용)
  const [descendantCount, setDescendantCount] = useState<number>(0)
  const [ascendantCount, setAscendantCount] = useState<number>(0)

  // 인적공제 항목
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

  // 결과 & 기록
  const [result, setResult] = useState<InheritanceTaxResult | null>(null)
  const [recordResult, setRecordResult] = useState(true)
  const [history, setHistory] = useState<Array<{ result: InheritanceTaxResult; label: string }>>([])

  const handleCalculate = () => {
    const calcResult = calculateInheritanceTax({
      spouseType: spouseTab,
      deductionType: deductionTab,
      inheritanceAmount,
      funeralExpense,
      spouseInheritance: spouseTab === 'spouse-inherits' ? spouseInheritance : 0,
      descendantCount: spouseTab === 'spouse-inherits' ? descendantCount : 0,
      ascendantCount: spouseTab === 'spouse-inherits' ? ascendantCount : 0,
      childrenCount: deductionTab === 'personal' ? childrenCount : 0,
      elderlyCount: deductionTab === 'personal' ? elderlyCount : 0,
      minorCount: deductionTab === 'personal' ? minorCount : 0,
      disabledCount: deductionTab === 'personal' ? disabledCount : 0,
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
    })
    setResult(calcResult)
    if (recordResult) {
      const spouseLabel = spouseTab === 'spouse-yes' ? '배우자유' : spouseTab === 'spouse-inherits' ? '배우자유(상속)' : '배우자무'
      const deductionLabel = deductionTab === 'lump-sum' ? '일괄공제' : '인적공제'
      setHistory(prev => [{
        result: calcResult,
        label: `${spouseLabel} · ${deductionLabel}`,
      }, ...prev])
    }
  }

  const infoTabStyle = (tab: typeof infoTab) =>
    `px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
      infoTab === tab
        ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
        : 'text-gray-500 hover:text-gray-700'
    }`

  const pillStyle = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
      active
        ? 'border-[#F15F5F] bg-[#F15F5F] text-white'
        : 'border-gray-300 text-gray-600 hover:border-gray-400'
    }`

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

        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">🪦 상속세 계산</h1>
          <ShareButtons url="https://moajim.com/?view=calculator&sub=inheritance-tax" />
        </div>

        <PropertyTaxBanner />

        {/* 안내 탭 */}
        <div className="flex gap-1 sm:gap-2 border-b border-gray-200 overflow-x-auto">
          <button onClick={() => setInfoTab('description')} className={infoTabStyle('description')}>
            설명
          </button>
          <button onClick={() => setInfoTab('spouse-info')} className={infoTabStyle('spouse-info')}>
            배우자 공제
          </button>
          <button onClick={() => setInfoTab('deduction-info')} className={infoTabStyle('deduction-info')}>
            인적/일괄 공제
          </button>
        </div>

        {/* 안내 탭 내용 */}
        <div className="bg-blue-50 border border-blue-200 border-t-0 rounded-b-xl p-6 mb-6">
          {infoTab === 'description' && (
            <p className="text-sm text-gray-700 leading-relaxed">
              사망에 따른 재산 상속 시 부과되는 조세를 계산합니다.<br />
              상단의 <strong>"배우자 공제"</strong>와 <strong>"인적/일괄공제"</strong>에 대한 설명을 꼭 읽어주시기 바랍니다.
            </p>
          )}
          {infoTab === 'spouse-info' && (
            <div className="text-sm text-gray-700 leading-relaxed space-y-3">
              <p>
                배우자가 있는 경우, 배우자가 상속을 받지 않더라도 기본적으로 <strong>5억원</strong>을 공제 받을 수 있습니다.
                배우자가 직접 상속을 받는 경우엔 최대 <strong>30억원</strong>까지 공제를 받을 수 있습니다.
              </p>
              <p>
                배우자가 상속을 받지 않거나 5억원 이하로 상속 받는 경우엔 <strong>"배우자 유"</strong>를 선택하면 간단히 계산할 수 있습니다.
                배우자가 실제로 5억원 이상의 금액을 상속받는 경우엔 좀 더 복잡한 계산이 필요하므로 <strong>"배우자 유(상속)"</strong>을 클릭하십시오.
              </p>
            </div>
          )}
          {infoTab === 'deduction-info' && (
            <div className="text-sm text-gray-700 leading-relaxed space-y-3">
              <p>
                기초공제(2억원) + 인적공제(자녀, 연로자, 장애인 등)와 일괄공제(5억원) 중 큰 금액을 선택하여 공제받을 수 있습니다.
              </p>
              <p>
                <strong>"일괄공제 적용"</strong>을 클릭하면 복잡한 인적공제 정보를 입력하지 않고 일괄공제를 적용하여 계산하실 수 있습니다.
                어린 자녀가 있거나 연로자, 장애인이 상속을 받는 경우엔 <strong>"인적공제 계산"</strong>을 선택해서 정확히 계산해보시길 권장드립니다.
              </p>
              <p className="text-amber-700 font-medium">
                단, 배우자 단독상속인 경우엔 기초공제 + 인적공제만 적용 가능하므로 <strong>"인적공제 계산"</strong>을 클릭하여 모든 정보를 입력해주셔야 합니다.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* 배우자 선택 */}
          <div>
            <p className="text-xs font-bold text-gray-500 tracking-wide mb-3">배우자 공제</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setSpouseTab('spouse-yes'); setResult(null) }}
                className={pillStyle(spouseTab === 'spouse-yes')}
              >
                배우자 유
              </button>
              <button
                onClick={() => { setSpouseTab('spouse-inherits'); setResult(null) }}
                className={pillStyle(spouseTab === 'spouse-inherits')}
              >
                배우자 유(상속)
              </button>
              <button
                onClick={() => { setSpouseTab('no-spouse'); setResult(null) }}
                className={pillStyle(spouseTab === 'no-spouse')}
              >
                배우자 무
              </button>
            </div>
          </div>

          {/* 공제 방식 선택 */}
          <div>
            <p className="text-xs font-bold text-gray-500 tracking-wide mb-3">일반 공제</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setDeductionTab('lump-sum'); setResult(null) }}
                className={pillStyle(deductionTab === 'lump-sum')}
              >
                일괄공제 적용
              </button>
              <button
                onClick={() => { setDeductionTab('personal'); setResult(null) }}
                className={pillStyle(deductionTab === 'personal')}
              >
                인적공제 계산
              </button>
            </div>
          </div>

          {/* 옵션 체크박스 */}
          <div className="space-y-3 py-4 border-t border-gray-200">
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

            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasDebt} onChange={(e) => setHasDebt(e.target.checked)} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
                <span className="text-sm text-gray-700">채무상속</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasAppraisal} onChange={(e) => setHasAppraisal(e.target.checked)} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
                <span className="text-sm text-gray-700">감정평가 수수료</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasResidence} onChange={(e) => setHasResidence(e.target.checked)} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
                <span className="text-sm text-gray-700">동거주택 공제</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasFinancial} onChange={(e) => setHasFinancial(e.target.checked)} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
                <span className="text-sm text-gray-700">금융재산 공제</span>
              </label>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={hasPastGift} onChange={(e) => setHasPastGift(e.target.checked)} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
              <span className="text-sm text-gray-700">과거 5년 증여 존재</span>
            </label>
          </div>

          {/* 상속재산 & 장례비용 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">장례비용 등</label>
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
          </div>

          {/* 조건부 금액 입력 (체크박스 활성화 시) */}
          {(hasDebt || hasAppraisal || hasResidence || hasFinancial || hasPastGift) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hasDebt && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">채무 금액</label>
                  <div className="relative">
                    <input type="number" value={debtAmount || ''} onChange={(e) => setDebtAmount(Number(e.target.value))} className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="금액 입력" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
                  </div>
                  {debtAmount > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(debtAmount)}</p>}
                </div>
              )}
              {hasAppraisal && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">감정평가 수수료</label>
                  <div className="relative">
                    <input type="number" value={appraisalFee || ''} onChange={(e) => setAppraisalFee(Number(e.target.value))} className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="금액 입력" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
                  </div>
                  {appraisalFee > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(appraisalFee)}</p>}
                </div>
              )}
              {hasResidence && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">동거주택 공제액</label>
                  <div className="relative">
                    <input type="number" value={residenceDeduction || ''} onChange={(e) => setResidenceDeduction(Number(e.target.value))} className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="금액 입력" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
                  </div>
                  {residenceDeduction > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(residenceDeduction)}</p>}
                </div>
              )}
              {hasFinancial && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">금융재산 금액</label>
                  <div className="relative">
                    <input type="number" value={financialAmount || ''} onChange={(e) => setFinancialAmount(Number(e.target.value))} className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="금액 입력" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
                  </div>
                  {financialAmount > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(financialAmount)}</p>}
                </div>
              )}
              {hasPastGift && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">사전증여 금액</label>
                  <div className="relative">
                    <input type="number" value={pastGiftAmount || ''} onChange={(e) => setPastGiftAmount(Number(e.target.value))} className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="금액 입력" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
                  </div>
                  {pastGiftAmount > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(pastGiftAmount)}</p>}
                </div>
              )}
            </div>
          )}

          {/* 배우자 상속 상세 입력 (배우자 유(상속) 선택 시) */}
          {spouseTab === 'spouse-inherits' && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">배우자 상속액</label>
                <div className="relative">
                  <input type="number" value={spouseInheritance || ''} onChange={(e) => setSpouseInheritance(Number(e.target.value))} className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="금액 입력" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
                </div>
                {spouseInheritance > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(spouseInheritance)}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">직계비속 (명)</label>
                  <input type="number" min={0} value={descendantCount || ''} onChange={(e) => setDescendantCount(Number(e.target.value))} className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">직계존속 (명)</label>
                  <input type="number" min={0} value={ascendantCount || ''} onChange={(e) => setAscendantCount(Number(e.target.value))} className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="0" />
                </div>
              </div>
            </>
          )}

          {/* 인적공제 입력 (인적공제 계산 선택 시) */}
          {deductionTab === 'personal' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-4">
              <p className="text-xs font-bold text-amber-700 tracking-wide">인적공제 항목</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">자녀 (명)</label>
                  <input type="number" min={0} value={childrenCount || ''} onChange={(e) => setChildrenCount(Number(e.target.value))} className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:border-[#F15F5F] focus:outline-none" placeholder="0" />
                  <p className="text-xs text-amber-600 mt-1">{use2024Reform ? '1인당 5억 공제' : '1인당 5천만 공제'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">고령자 (명)</label>
                  <input type="number" min={0} value={elderlyCount || ''} onChange={(e) => setElderlyCount(Number(e.target.value))} className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:border-[#F15F5F] focus:outline-none" placeholder="0" />
                  <p className="text-xs text-amber-600 mt-1">1인당 5천만 공제</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">미성년 (명)</label>
                  <input type="number" min={0} value={minorCount || ''} onChange={(e) => setMinorCount(Number(e.target.value))} className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:border-[#F15F5F] focus:outline-none" placeholder="0" />
                  <p className="text-xs text-amber-600 mt-1">1인당 1천만 공제</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">장애인 (명)</label>
                  <input type="number" min={0} value={disabledCount || ''} onChange={(e) => setDisabledCount(Number(e.target.value))} className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:border-[#F15F5F] focus:outline-none" placeholder="0" />
                  <p className="text-xs text-amber-600 mt-1">1인당 1천만 공제</p>
                </div>
              </div>
            </div>
          )}

          {/* 계산 버튼 + 기록 체크박스 */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleCalculate}
              className="flex-1 py-4 bg-[#F15F5F] text-white rounded-xl font-bold hover:bg-[#E14E4E] transition-colors"
            >
              상속세 계산
            </button>
            <label className="flex items-center gap-2 cursor-pointer shrink-0">
              <input type="checkbox" checked={recordResult} onChange={(e) => setRecordResult(e.target.checked)} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
              <span className="text-sm text-gray-600">기록</span>
            </label>
          </div>

          {/* 결과 */}
          {result && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-end mb-2">
                <CaptureButtons targetRef={resultRef} fileName="moajim-상속세-결과" />
              </div>
              <div ref={resultRef} className="bg-gradient-to-br from-red-50 to-pink-50/30 rounded-2xl p-6 border border-red-100">
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
                      {deductionTab === 'lump-sum'
                        ? '일괄공제'
                        : result.lumpSumDeduction > 0
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

          {/* 기록 히스토리 */}
          {history.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">계산 기록</h3>
                <button onClick={() => setHistory([])} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">전체 삭제</button>
              </div>
              <div className="space-y-2">
                {history.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 font-mono w-5">#{history.length - i}</span>
                      <span className="text-gray-600">{item.label}</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-600">상속재산 {item.result.inheritanceAmount.toLocaleString()}만원</span>
                    </div>
                    <span className="font-bold text-[#F15F5F]">{item.result.finalTaxWon.toLocaleString()}원</span>
                  </div>
                ))}
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
            <p className="text-xs text-gray-500 mt-4">검수) 부동산세금 전문 세무사 강동균</p>
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

// 취득세 계산기
function AcquisitionTaxCalculator() {
  const resultRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'explanation' | 'calculator' | 'registration'>('calculator')

  // 기본 선택
  const [acquisitionType, setAcquisitionType] = useState<AcquisitionType>('purchase')
  const [propertyType, setPropertyType] = useState<PropertyType>('housing')
  const [area, setArea] = useState<AreaType>('85')
  const [houseCount, setHouseCount] = useState<HouseCount>(1)

  // 체크박스 옵션
  const [isCorporation, setIsCorporation] = useState(false)
  const [isRentalFirstPurchase, setIsRentalFirstPurchase] = useState(false)
  const [isRegulatedArea, setIsRegulatedArea] = useState(false)
  const [isMetropolitan, setIsMetropolitan] = useState(false)
  const [isDepopulationArea, setIsDepopulationArea] = useState(false)
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(false)
  const [isSelfFarming, setIsSelfFarming] = useState(false)
  const [isSpouseDescendantGift, setIsSpouseDescendantGift] = useState(false)

  // 금액 입력
  const [acquisitionPrice, setAcquisitionPrice] = useState<number>(0)
  const [standardPrice, setStandardPrice] = useState<number>(0)

  const [result, setResult] = useState<AcquisitionTaxResult | null>(null)

  const handleCalculate = () => {
    if (acquisitionPrice <= 0 && standardPrice <= 0) return
    setResult(calculateAcquisitionTax({
      acquisitionType,
      propertyType,
      area,
      houseCount,
      isCorporation,
      isRentalFirstPurchase,
      isRegulatedArea,
      isMetropolitan,
      isDepopulationArea,
      isFirstTimeBuyer,
      acquisitionPrice,
      standardPrice,
      isSelfFarming,
      isSpouseDescendantGift,
    }))
  }

  const showHousingOptions = propertyType === 'housing'
  const showAreaSelector = propertyType === 'housing'
  const showHouseCount = propertyType === 'housing' && acquisitionType === 'purchase'
  const showFarmlandOption = propertyType === 'farmland' && acquisitionType === 'purchase'
  const showGiftOptions = acquisitionType === 'gift' && propertyType === 'housing'
  const showStandardPrice = acquisitionType === 'gift'
  const showFirstTimeBuyer = acquisitionType === 'purchase' && propertyType === 'housing' && houseCount === 1

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

        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">취득세 계산</h1>
          <ShareButtons url="https://moajim.com/?view=calculator&sub=acquisition-tax" />
        </div>

        <PropertyTaxBanner />

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
            onClick={() => setActiveTab('calculator')}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'calculator'
                ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            취득세 계산
          </button>
          <button
            onClick={() => setActiveTab('registration')}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'registration'
                ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            등기비용
          </button>
        </div>

        {/* 설명 탭 */}
        {activeTab === 'explanation' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">
                부동산 취득시 납부해야 하는 세금을 계산합니다. 과세표준은 취득자가 신고한 취득 당시 가액을 기준으로 하며,
                취득한 날로부터 60일(상속시는 6개월) 이내 신고·납부하여야 합니다.
              </p>
            </div>

            {/* 주택 취득세표 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>ℹ️</span>
                주택 취득세표
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">주택</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">구분</th>
                      <th className="px-3 py-2 text-center font-medium text-gray-700">취득세율</th>
                      <th className="px-3 py-2 text-center font-medium text-gray-700 text-xs">농어촌특별세<br/><span className="text-[10px] text-gray-500">(85m² 초과)</span></th>
                      <th className="px-3 py-2 text-center font-medium text-gray-700">지방교육세</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    <tr>
                      <td className="px-3 py-2 text-gray-600" rowSpan={3}>1주택자</td>
                      <td className="px-3 py-2 text-gray-600">6억 이하</td>
                      <td className="px-3 py-2 text-center">1%</td>
                      <td className="px-3 py-2 text-center" rowSpan={3}>0.2%</td>
                      <td className="px-3 py-2 text-center">0.1%</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-600">6억~9억</td>
                      <td className="px-3 py-2 text-center text-xs">1%~3%</td>
                      <td className="px-3 py-2 text-center text-xs">취득세의 1/10</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-600">9억 초과</td>
                      <td className="px-3 py-2 text-center">3%</td>
                      <td className="px-3 py-2 text-center">0.3%</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-600" rowSpan={2}>2주택자</td>
                      <td className="px-3 py-2 text-gray-600">조정대상지역</td>
                      <td className="px-3 py-2 text-center">8%</td>
                      <td className="px-3 py-2 text-center">0.6%</td>
                      <td className="px-3 py-2 text-center">0.4%</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-600">비조정지역</td>
                      <td className="px-3 py-2 text-center">1~3%</td>
                      <td className="px-3 py-2 text-center">0.2%</td>
                      <td className="px-3 py-2 text-center">0.1~0.3%</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-600" rowSpan={2}>3주택자</td>
                      <td className="px-3 py-2 text-gray-600">조정대상지역</td>
                      <td className="px-3 py-2 text-center">12%</td>
                      <td className="px-3 py-2 text-center">1%</td>
                      <td className="px-3 py-2 text-center">0.4%</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-600">비조정지역</td>
                      <td className="px-3 py-2 text-center">8%</td>
                      <td className="px-3 py-2 text-center">0.6%</td>
                      <td className="px-3 py-2 text-center">0.4%</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-600" rowSpan={2}>4주택 이상</td>
                      <td className="px-3 py-2 text-gray-600">조정대상지역</td>
                      <td className="px-3 py-2 text-center">12%</td>
                      <td className="px-3 py-2 text-center">1%</td>
                      <td className="px-3 py-2 text-center">0.4%</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-600">비조정지역</td>
                      <td className="px-3 py-2 text-center">12%</td>
                      <td className="px-3 py-2 text-center">1%</td>
                      <td className="px-3 py-2 text-center">0.4%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 주택 외 취득세표 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>ℹ️</span>
                주택 외 취득세표
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-700" colSpan={2}>주택 외</th>
                      <th className="px-3 py-2 text-center font-medium text-gray-700">취득세</th>
                      <th className="px-3 py-2 text-center font-medium text-gray-700">농어촌특별세</th>
                      <th className="px-3 py-2 text-center font-medium text-gray-700">지방교육세</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    <tr>
                      <td className="px-3 py-2 text-gray-600" colSpan={2}>주택 외 매매(토지, 건물 등)</td>
                      <td className="px-3 py-2 text-center">4%</td>
                      <td className="px-3 py-2 text-center">0.2%</td>
                      <td className="px-3 py-2 text-center">0.4%</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-600" colSpan={2}>원시취득(신축), 상속(농지 외)</td>
                      <td className="px-3 py-2 text-center">2.8%</td>
                      <td className="px-3 py-2 text-center">0.2%</td>
                      <td className="px-3 py-2 text-center">0.16%</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-600" colSpan={2}>무상취득(증여)</td>
                      <td className="px-3 py-2 text-center">3.5%</td>
                      <td className="px-3 py-2 text-center">0.2%</td>
                      <td className="px-3 py-2 text-center">0.3%</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-600" rowSpan={2}>농지 매매</td>
                      <td className="px-3 py-2 text-gray-600">신규</td>
                      <td className="px-3 py-2 text-center">3%</td>
                      <td className="px-3 py-2 text-center">0.2%</td>
                      <td className="px-3 py-2 text-center">0.2%</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-600">2년이상 자경</td>
                      <td className="px-3 py-2 text-center">1.5%</td>
                      <td className="px-3 py-2 text-center">-</td>
                      <td className="px-3 py-2 text-center">0.1%</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-600" colSpan={2}>농지 상속</td>
                      <td className="px-3 py-2 text-center">2.3%</td>
                      <td className="px-3 py-2 text-center">0.2%</td>
                      <td className="px-3 py-2 text-center">0.06%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 취득세 계산 탭 */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            {/* 취득유형 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                취득유형
              </label>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: 'purchase', label: '매매' },
                  { value: 'gift', label: '증여' },
                  { value: 'inheritance', label: '상속' },
                  { value: 'original', label: '원시' },
                ] as const).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setAcquisitionType(option.value)
                      setResult(null)
                    }}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      acquisitionType === option.value
                        ? 'border-[#F15F5F] bg-red-50 text-[#F15F5F] font-medium'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 부동산유형 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                부동산유형
              </label>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: 'housing', label: '주택' },
                  { value: 'officetel', label: '오피스텔' },
                  { value: 'farmland', label: '농지' },
                  { value: 'other', label: '그 외' },
                ] as const).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setPropertyType(option.value)
                      setResult(null)
                    }}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      propertyType === option.value
                        ? 'border-[#F15F5F] bg-red-50 text-[#F15F5F] font-medium'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 전용면적 (주택) */}
            {showAreaSelector && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  전용면적
                </label>
                <div className="flex flex-wrap gap-2">
                  {([
                    { value: '40', label: '40m² 이하' },
                    { value: '60', label: '60m² 이하' },
                    { value: '85', label: '85m² 이하' },
                    { value: '85+', label: '85m² 초과' },
                  ] as const).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setArea(option.value)
                        setResult(null)
                      }}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        area === option.value
                          ? 'border-[#F15F5F] bg-red-50 text-[#F15F5F] font-medium'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 주택수 (주택 매매) */}
            {showHouseCount && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  주택 수
                </label>
                <div className="flex flex-wrap gap-2">
                  {([
                    { value: 1, label: '1주택' },
                    { value: 2, label: '2주택' },
                    { value: 3, label: '3주택' },
                    { value: 4, label: '그 이상' },
                  ] as const).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setHouseCount(option.value)
                        setResult(null)
                      }}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        houseCount === option.value
                          ? 'border-[#F15F5F] bg-red-50 text-[#F15F5F] font-medium'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 옵션 체크박스 */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              {showHousingOptions && (
                <>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCorporation}
                      onChange={(e) => { setIsCorporation(e.target.checked); setResult(null) }}
                      className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                    />
                    <span className="text-sm text-gray-700">법인</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRentalFirstPurchase}
                      onChange={(e) => { setIsRentalFirstPurchase(e.target.checked); setResult(null) }}
                      className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                    />
                    <span className="text-sm text-gray-700">임대사업자 최초분양</span>
                  </label>
                </>
              )}

              {showHousingOptions && acquisitionType === 'purchase' && houseCount >= 2 && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRegulatedArea}
                    onChange={(e) => { setIsRegulatedArea(e.target.checked); setResult(null) }}
                    className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                  />
                  <span className="text-sm text-gray-700">조정대상지역</span>
                </label>
              )}

              {showGiftOptions && (
                <>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSpouseDescendantGift}
                      onChange={(e) => { setIsSpouseDescendantGift(e.target.checked); setResult(null) }}
                      className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                    />
                    <span className="text-sm text-gray-700">배우자·직계비속 증여</span>
                  </label>

                  {isSpouseDescendantGift && (
                    <label className="flex items-center gap-3 cursor-pointer ml-7">
                      <input
                        type="checkbox"
                        checked={isRegulatedArea}
                        onChange={(e) => { setIsRegulatedArea(e.target.checked); setResult(null) }}
                        className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                      />
                      <span className="text-sm text-gray-700">조정대상지역</span>
                    </label>
                  )}
                </>
              )}

              {showFarmlandOption && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelfFarming}
                    onChange={(e) => { setIsSelfFarming(e.target.checked); setResult(null) }}
                    className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                  />
                  <span className="text-sm text-gray-700">2년이상 자경</span>
                </label>
              )}

              {showHousingOptions && (
                <>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isMetropolitan}
                      onChange={(e) => { setIsMetropolitan(e.target.checked); setResult(null) }}
                      className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                    />
                    <span className="text-sm text-gray-700">수도권</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDepopulationArea}
                      onChange={(e) => { setIsDepopulationArea(e.target.checked); setResult(null) }}
                      className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                    />
                    <span className="text-sm text-gray-700">인구감소지역</span>
                  </label>
                </>
              )}

              {showFirstTimeBuyer && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFirstTimeBuyer}
                    onChange={(e) => { setIsFirstTimeBuyer(e.target.checked); setResult(null) }}
                    className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                  />
                  <div>
                    <span className="text-sm text-gray-700">생애최초 구입</span>
                    <span className="text-xs text-gray-500 ml-2">12억 이하, 최대 200만원 감면</span>
                  </div>
                </label>
              )}
            </div>

            {/* 취득가액 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                취득가액
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={acquisitionPrice || ''}
                  onChange={(e) => setAcquisitionPrice(Number(e.target.value))}
                  className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                  placeholder="금액 입력"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  만원
                </span>
              </div>
              {acquisitionPrice > 0 && (
                <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(acquisitionPrice)}</p>
              )}
            </div>

            {/* 시가표준액 (증여) */}
            {showStandardPrice && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  시가표준액
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={standardPrice || ''}
                    onChange={(e) => setStandardPrice(Number(e.target.value))}
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                    placeholder="금액 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    만원
                  </span>
                </div>
                {standardPrice > 0 && (
                  <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(standardPrice)}</p>
                )}
              </div>
            )}

            {/* 계산 버튼 */}
            <button
              onClick={handleCalculate}
              className="w-full py-4 bg-[#F15F5F] text-white rounded-xl font-bold hover:bg-[#E14E4E] transition-colors"
            >
              취득세 계산
            </button>

            {/* 결과 */}
            {result && (
              <div className="mt-8 space-y-4">
                <div className="flex justify-end mb-2">
                  <CaptureButtons targetRef={resultRef} fileName="moajim-취득세-결과" />
                </div>
                <div ref={resultRef} className="bg-gradient-to-br from-red-50 to-pink-50/30 rounded-2xl p-6 border border-red-100">
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 mb-2">예상 취득세 합계</p>
                    <p className="text-4xl font-bold text-[#F15F5F]">
                      {result.totalTax.toLocaleString()}만원
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      ({(result.totalTax * 10000).toLocaleString()}원)
                    </p>
                    <p className="text-xs text-gray-400 mt-2">{result.description}</p>
                  </div>

                  <div className="space-y-3 border-t border-red-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">과세표준</span>
                      <span className="font-medium">{result.taxBase.toLocaleString()}만원</span>
                    </div>

                    <div className="flex justify-between text-sm font-bold border-t border-red-200 pt-3">
                      <span className="text-gray-900">취득세 ({result.acquisitionTaxRate}%)</span>
                      <span>{result.acquisitionTax.toLocaleString()}만원</span>
                    </div>

                    {result.firstTimeBuyerReduction > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">생애최초 감면</span>
                        <span className="font-medium text-[#F15F5F]">-{result.firstTimeBuyerReduction.toLocaleString()}만원</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">농어촌특별세 ({result.ruralSpecialTaxRate}%)</span>
                      <span className="font-medium">{result.ruralSpecialTax.toLocaleString()}만원</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">지방교육세 ({result.localEducationTaxRate}%)</span>
                      <span className="font-medium">{result.localEducationTax.toLocaleString()}만원</span>
                    </div>

                    <div className="flex justify-between text-sm font-bold border-t border-red-200 pt-3">
                      <span className="text-gray-900">총 납부세액</span>
                      <span className="text-[#F15F5F]">{result.totalTax.toLocaleString()}만원</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 참고사항 */}
            <div className="mt-8 space-y-4">
              {/* 주택 취득세표 */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>ℹ️</span>
                  주택 취득세표
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">주택</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">구분</th>
                        <th className="px-3 py-2 text-center font-medium text-gray-700">취득세율</th>
                        <th className="px-3 py-2 text-center font-medium text-gray-700 text-xs">농어촌특별세<br/><span className="text-[10px] text-gray-500">(85m² 초과)</span></th>
                        <th className="px-3 py-2 text-center font-medium text-gray-700">지방교육세</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-100">
                      <tr>
                        <td className="px-3 py-2 text-gray-600" rowSpan={3}>1주택자</td>
                        <td className="px-3 py-2 text-gray-600">6억 이하</td>
                        <td className="px-3 py-2 text-center">1%</td>
                        <td className="px-3 py-2 text-center" rowSpan={3}>0.2%</td>
                        <td className="px-3 py-2 text-center">0.1%</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-gray-600">6억~9억</td>
                        <td className="px-3 py-2 text-center text-xs">1%~3%</td>
                        <td className="px-3 py-2 text-center text-xs">취득세의 1/10</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-gray-600">9억 초과</td>
                        <td className="px-3 py-2 text-center">3%</td>
                        <td className="px-3 py-2 text-center">0.3%</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-gray-600" rowSpan={2}>2주택자</td>
                        <td className="px-3 py-2 text-gray-600">조정대상지역</td>
                        <td className="px-3 py-2 text-center">8%</td>
                        <td className="px-3 py-2 text-center">0.6%</td>
                        <td className="px-3 py-2 text-center">0.4%</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-gray-600">비조정지역</td>
                        <td className="px-3 py-2 text-center">1~3%</td>
                        <td className="px-3 py-2 text-center">0.2%</td>
                        <td className="px-3 py-2 text-center">0.1~0.3%</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-gray-600" rowSpan={2}>3주택자</td>
                        <td className="px-3 py-2 text-gray-600">조정대상지역</td>
                        <td className="px-3 py-2 text-center">12%</td>
                        <td className="px-3 py-2 text-center">1%</td>
                        <td className="px-3 py-2 text-center">0.4%</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-gray-600">비조정지역</td>
                        <td className="px-3 py-2 text-center">8%</td>
                        <td className="px-3 py-2 text-center">0.6%</td>
                        <td className="px-3 py-2 text-center">0.4%</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-gray-600" rowSpan={2}>4주택 이상</td>
                        <td className="px-3 py-2 text-gray-600">조정대상지역</td>
                        <td className="px-3 py-2 text-center">12%</td>
                        <td className="px-3 py-2 text-center">1%</td>
                        <td className="px-3 py-2 text-center">0.4%</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-gray-600">비조정지역</td>
                        <td className="px-3 py-2 text-center">12%</td>
                        <td className="px-3 py-2 text-center">1%</td>
                        <td className="px-3 py-2 text-center">0.4%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 주택 외 취득세표 */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>ℹ️</span>
                  주택 외 취득세표
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-700" colSpan={2}>주택 외</th>
                        <th className="px-3 py-2 text-center font-medium text-gray-700">취득세</th>
                        <th className="px-3 py-2 text-center font-medium text-gray-700">농어촌특별세</th>
                        <th className="px-3 py-2 text-center font-medium text-gray-700">지방교육세</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-100">
                      <tr>
                        <td className="px-3 py-2 text-gray-600" colSpan={2}>주택 외 매매(토지, 건물 등)</td>
                        <td className="px-3 py-2 text-center">4%</td>
                        <td className="px-3 py-2 text-center">0.2%</td>
                        <td className="px-3 py-2 text-center">0.4%</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-gray-600" colSpan={2}>원시취득(신축), 상속(농지 외)</td>
                        <td className="px-3 py-2 text-center">2.8%</td>
                        <td className="px-3 py-2 text-center">0.2%</td>
                        <td className="px-3 py-2 text-center">0.16%</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-gray-600" colSpan={2}>무상취득(증여)</td>
                        <td className="px-3 py-2 text-center">3.5%</td>
                        <td className="px-3 py-2 text-center">0.2%</td>
                        <td className="px-3 py-2 text-center">0.3%</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-gray-600" rowSpan={2}>농지 매매</td>
                        <td className="px-3 py-2 text-gray-600">신규</td>
                        <td className="px-3 py-2 text-center">3%</td>
                        <td className="px-3 py-2 text-center">0.2%</td>
                        <td className="px-3 py-2 text-center">0.2%</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-gray-600">2년이상 자경</td>
                        <td className="px-3 py-2 text-center">1.5%</td>
                        <td className="px-3 py-2 text-center">-</td>
                        <td className="px-3 py-2 text-center">0.1%</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-gray-600" colSpan={2}>농지 상속</td>
                        <td className="px-3 py-2 text-center">2.3%</td>
                        <td className="px-3 py-2 text-center">0.2%</td>
                        <td className="px-3 py-2 text-center">0.06%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 주의사항 */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">⚠️ 주의사항</h3>
                <ul className="text-sm text-gray-700 leading-relaxed space-y-2">
                  <li>본 계산기는 대략적인 금액을 예측하는 참고용으로만 사용하여야 하며, 실제 세금 납부시에는 세무사의 도움을 받으셔야 합니다.</li>
                  <li>취득세는 취득한 날로부터 60일(상속시는 6개월) 이내에 신고·납부하여야 합니다.</li>
                  <li>부동산 증여 시 증여세 또한 발생할 수 있으니 <a href="/?view=calculator&sub=gift-tax" target="_blank" rel="noopener noreferrer" className="text-[#F15F5F] font-medium hover:underline">증여세 계산기</a>를 함께 확인하세요.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 등기비용 탭 */}
        {activeTab === 'registration' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              취득 신고 등기에 드는 비용, 그리고 이를 대행해 주는 법무사의 대행수수료까지 한번에 계산하시려면
              '등기비용 계산기'를 이용하세요.
            </p>
            <button
              onClick={() => { window.location.href = '/?view=tools&sub=lawyer-fee' }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F15F5F] text-white rounded-lg hover:bg-[#E14E4E] transition-colors text-sm font-medium"
            >
              법무사 보수료 계산기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// 보유세(재산세 + 종부세) 계산기
function HoldingTaxCalculator() {
  const resultRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'explanation' | 'joint' | 'base-values'>('explanation')
  const [isCorporation, setIsCorporation] = useState(false)
  const [isSingleHomeOwner, setIsSingleHomeOwner] = useState(true)
  const [isOver60, setIsOver60] = useState(false)
  const [ageGroup, setAgeGroup] = useState<'age60' | 'age65' | 'age70'>('age60')
  const [isOver5Years, setIsOver5Years] = useState(false)
  const [holdingGroup, setHoldingGroup] = useState<'year5' | 'year10' | 'year15'>('year5')
  const [properties, setProperties] = useState<HoldingPropertyInput[]>([{
    id: '1', officialPrice: 0, isUrbanArea: false, isRegulatedArea: false, isJointOwnership: false, ownershipShare: 50,
  }])
  const [result, setResult] = useState<HoldingTaxResult | null>(null)

  const addProperty = () => {
    setProperties(prev => [...prev, {
      id: String(Date.now()), officialPrice: 0, isUrbanArea: false, isRegulatedArea: false, isJointOwnership: false, ownershipShare: 50,
    }])
  }
  const removeProperty = (id: string) => {
    if (properties.length <= 1) return
    setProperties(prev => prev.filter(p => p.id !== id))
  }
  const updateProperty = (id: string, field: keyof HoldingPropertyInput, value: number | boolean | string) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }
  const handleCalculate = () => {
    const valid = properties.filter(p => p.officialPrice > 0)
    if (valid.length === 0) return
    const r = calculateHoldingTax(valid, {
      isCorporation,
      isSingleHomeOwner: !isCorporation && isSingleHomeOwner,
      isOver60: !isCorporation && isOver60, ageGroup,
      isOver5Years: !isCorporation && isOver5Years, holdingGroup,
    })
    setResult(r)
    setTimeout(() => { resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 100)
  }

  return (
    <div className="min-h-screen bg-white py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => { window.location.href = '/?view=calculator' }} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          세금 계산기 목록
        </button>

        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">보유세(재산세, 종부세) 계산</h1>
          <ShareButtons url="https://moajim.com/?view=calculator&sub=holding-tax" />
        </div>

        <PropertyTaxBanner />

        {/* 탭 */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
          {([
            { key: 'explanation', label: '설명' },
            { key: 'joint', label: '공동명의 계산' },
            { key: 'base-values', label: '기준값 변경' },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${activeTab === tab.key ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'explanation' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <p className="text-gray-700 leading-relaxed">
              매년 6월 1일을 기준으로 보유한 자산에 대해 부과되는 세금입니다.
              재산세는 개별 자산을 기준으로 과세하며, 종합부동산세는 개인이 가진 부동산의 합계액을 기준으로 과세합니다.
              재산세는 매년 7월, 9월에 납부하며 종부세는 12월에 한번 납부합니다.
            </p>
          </div>
        )}
        {activeTab === 'joint' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <p className="text-gray-700 leading-relaxed">
              각 물건마다 있는 "공동명의"에 체크하고 소유지분을 입력하면 지분을 감안하여 인별 재산세 및 종부세가 계산됩니다.
              세대 내 다른 가족이 다른 주택을 소유한 경우에는 '1세대1주택자' 체크를 해제하세요.
              다만 부부 공동명의 1주택, 혼인·상속 등 법정 예외는 1세대 1주택으로 볼 수 있으니 요건 확인 후 체크 바랍니다.
            </p>
          </div>
        )}
        {activeTab === 'base-values' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <p className="text-gray-700 leading-relaxed">
              현재 기준연도는 2026년입니다. 연도별로 적용되는 세법이 다르므로, 본 계산기는 2026년 현행법을 기준으로 계산합니다.
              공정시장가액비율: 재산세 60%(1세대1주택 특례 43~45%), 종부세 60%.
            </p>
          </div>
        )}

        {/* 옵션 */}
        <div className="space-y-3 mb-6">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isCorporation}
                onChange={(e) => { setIsCorporation(e.target.checked); if (e.target.checked) { setIsSingleHomeOwner(false); setIsOver60(false); setIsOver5Years(false) } }}
                className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
              <span className="text-sm text-gray-800 font-medium">법인</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isSingleHomeOwner} onChange={(e) => setIsSingleHomeOwner(e.target.checked)}
                disabled={isCorporation} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F] disabled:opacity-40" />
              <span className={`text-sm font-medium ${isCorporation ? 'text-gray-400' : 'text-gray-800'}`}>1세대1주택자</span>
            </label>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isOver60} onChange={(e) => setIsOver60(e.target.checked)}
                disabled={isCorporation} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F] disabled:opacity-40" />
              <span className={`text-sm font-medium ${isCorporation ? 'text-gray-400' : 'text-gray-800'}`}>만60세 이상</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isOver5Years} onChange={(e) => setIsOver5Years(e.target.checked)}
                disabled={isCorporation} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F] disabled:opacity-40" />
              <span className={`text-sm font-medium ${isCorporation ? 'text-gray-400' : 'text-gray-800'}`}>5년 이상 보유</span>
            </label>
          </div>
          {isOver60 && !isCorporation && (
            <div className="ml-6 flex flex-wrap gap-2">
              {([{ value: 'age60', label: '만60세~64세 (20%)' }, { value: 'age65', label: '만65세~69세 (30%)' }, { value: 'age70', label: '만70세 이상 (40%)' }] as const).map(opt => (
                <button key={opt.value} onClick={() => setAgeGroup(opt.value)}
                  className={`px-3 py-1.5 rounded-lg border-2 text-xs sm:text-sm transition-colors ${ageGroup === opt.value ? 'border-[#F15F5F] bg-red-50 text-[#F15F5F] font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
          {isOver5Years && !isCorporation && (
            <div className="ml-6 flex flex-wrap gap-2">
              {([{ value: 'year5', label: '5년~9년 (20%)' }, { value: 'year10', label: '10년~14년 (40%)' }, { value: 'year15', label: '15년 이상 (50%)' }] as const).map(opt => (
                <button key={opt.value} onClick={() => setHoldingGroup(opt.value)}
                  className={`px-3 py-1.5 rounded-lg border-2 text-xs sm:text-sm transition-colors ${holdingGroup === opt.value ? 'border-[#F15F5F] bg-red-50 text-[#F15F5F] font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 자산 입력 */}
        <div className="space-y-4 mb-6">
          {properties.map((p, i) => (
            <div key={p.id} className="rounded-xl border-2 border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-700">주택 {i + 1}</span>
                {properties.length > 1 && (
                  <button onClick={() => removeProperty(p.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-sm font-bold text-gray-900 mb-2">공시가격</label>
                <div className="relative">
                  <input type="number" value={p.officialPrice || ''} onChange={(e) => updateProperty(p.id, 'officialPrice', Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="금액 입력" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
                </div>
                {p.officialPrice > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(p.officialPrice)}</p>}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={p.isUrbanArea} onChange={(e) => updateProperty(p.id, 'isUrbanArea', e.target.checked)} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
                  <span className="text-sm text-gray-700">도시지역</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={p.isRegulatedArea} onChange={(e) => updateProperty(p.id, 'isRegulatedArea', e.target.checked)} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
                  <span className="text-sm text-gray-700">조정대상지역</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={p.isJointOwnership} onChange={(e) => updateProperty(p.id, 'isJointOwnership', e.target.checked)} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
                  <span className="text-sm text-gray-700">공동명의</span>
                </label>
              </div>
              {p.isJointOwnership && (
                <div className="mt-3 ml-6">
                  <label className="text-sm text-gray-700 font-medium">소유지분</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="number" value={p.ownershipShare} onChange={(e) => updateProperty(p.id, 'ownershipShare', Number(e.target.value))}
                      className="w-20 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-center" min={1} max={99} />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <button onClick={addProperty} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#F15F5F] hover:text-[#F15F5F] transition-colors font-medium text-sm">
            + 자산 추가
          </button>
        </div>

        <button onClick={handleCalculate} className="w-full py-4 bg-[#F15F5F] text-white rounded-xl font-bold text-lg hover:bg-[#E14E4E] transition-colors">
          보유세 계산
        </button>

        {/* 결과 */}
        {result && (
          <div ref={resultRef} className="mt-8 space-y-6">
            <div className="bg-gradient-to-br from-red-50 to-pink-50/30 rounded-2xl p-6 border border-red-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">보유세 합계</h3>
                <CaptureButtons targetRef={resultRef} />
              </div>
              <p className="text-[28px] sm:text-[36px] font-bold text-[#F15F5F]">{result.totalHoldingTax.toLocaleString()}만원</p>
              <p className="text-sm text-gray-600 mt-1">재산세 {result.totalPropertyTaxSum.toLocaleString()}만원 + 종부세 {result.comprehensiveTax.totalComprehensiveTax.toLocaleString()}만원</p>
            </div>

            {/* 재산세 내역 */}
            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">재산세 내역</h3>
              <div className="space-y-4">
                {result.properties.map((p, i) => (
                  <div key={i} className={i > 0 ? 'border-t border-gray-100 pt-4' : ''}>
                    {result.properties.length > 1 && <p className="text-sm font-bold text-gray-700 mb-2">주택 {i + 1}</p>}
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between"><span className="text-gray-600">공시가격</span><span className="font-medium">{p.officialPrice.toLocaleString()}만원</span></div>
                      {p.appliedPrice !== p.officialPrice && (
                        <div className="flex justify-between"><span className="text-gray-600">적용 공시가격 (지분 반영)</span><span className="font-medium">{p.appliedPrice.toLocaleString()}만원</span></div>
                      )}
                      <div className="flex justify-between"><span className="text-gray-600">공정시장가액비율</span><span className="font-medium">{p.fmvr}%</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">과세표준</span><span className="font-medium">{p.taxBase.toLocaleString()}만원</span></div>
                      <div className="h-px bg-gray-100 my-1" />
                      <div className="flex justify-between"><span className="text-gray-600">재산세</span><span className="font-medium">{p.propertyTax.toLocaleString()}만원</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">지방교육세 (재산세 × 20%)</span><span className="font-medium">{p.localEducationTax.toLocaleString()}만원</span></div>
                      {p.urbanAreaTax > 0 && <div className="flex justify-between"><span className="text-gray-600">도시지역분 (과세표준 × 0.14%)</span><span className="font-medium">{p.urbanAreaTax.toLocaleString()}만원</span></div>}
                      <div className="h-px bg-gray-200 my-1" />
                      <div className="flex justify-between font-bold"><span className="text-gray-900">재산세 소계</span><span className="text-[#F15F5F]">{p.totalPropertyTax.toLocaleString()}만원</span></div>
                    </div>
                  </div>
                ))}
                {result.properties.length > 1 && (
                  <div className="border-t-2 border-gray-200 pt-3">
                    <div className="flex justify-between font-bold text-base"><span className="text-gray-900">재산세 합계</span><span className="text-[#F15F5F]">{result.totalPropertyTaxSum.toLocaleString()}만원</span></div>
                  </div>
                )}
              </div>
            </div>

            {/* 종합부동산세 내역 */}
            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">종합부동산세 내역</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">공시가격 합계</span><span className="font-medium">{result.comprehensiveTax.totalAppliedPrice.toLocaleString()}만원</span></div>
                <div className="flex justify-between"><span className="text-gray-600">공제가격</span><span className="font-medium">- {result.comprehensiveTax.deduction.toLocaleString()}만원</span></div>
                <div className="flex justify-between"><span className="text-gray-600">초과금액</span><span className="font-medium">{result.comprehensiveTax.excessAmount.toLocaleString()}만원</span></div>
                <div className="flex justify-between"><span className="text-gray-600">공정시장가액비율</span><span className="font-medium">× {result.comprehensiveTax.fmvr}%</span></div>
                <div className="flex justify-between"><span className="text-gray-600">과세표준</span><span className="font-medium">{result.comprehensiveTax.taxBase.toLocaleString()}만원</span></div>
                <div className="h-px bg-gray-100 my-1" />
                <div className="flex justify-between"><span className="text-gray-600">종부세 세액 ({result.comprehensiveTax.housingCount >= 3 ? '3주택 이상' : '2주택 이하'} 세율)</span><span className="font-medium">{result.comprehensiveTax.grossTax.toLocaleString()}만원</span></div>
                <div className="flex justify-between"><span className="text-gray-600">공제할 재산세액</span><span className="font-medium">- {result.comprehensiveTax.propertyTaxCredit.toLocaleString()}만원</span></div>
                <div className="flex justify-between"><span className="text-gray-600">산출세액</span><span className="font-medium">{result.comprehensiveTax.assessedTax.toLocaleString()}만원</span></div>
                {result.comprehensiveTax.totalCreditRate > 0 && (<>
                  <div className="h-px bg-gray-100 my-1" />
                  <div className="flex justify-between">
                    <span className="text-gray-600">세액공제 ({result.comprehensiveTax.ageCreditRate > 0 ? `고령자 ${result.comprehensiveTax.ageCreditRate}%` : ''}{result.comprehensiveTax.ageCreditRate > 0 && result.comprehensiveTax.holdingCreditRate > 0 ? ' + ' : ''}{result.comprehensiveTax.holdingCreditRate > 0 ? `장기보유 ${result.comprehensiveTax.holdingCreditRate}%` : ''} = {result.comprehensiveTax.totalCreditRate}%)</span>
                    <span className="font-medium">- {result.comprehensiveTax.creditAmount.toLocaleString()}만원</span>
                  </div>
                </>)}
                <div className="flex justify-between"><span className="text-gray-600">결정세액</span><span className="font-medium">{result.comprehensiveTax.determinedTax.toLocaleString()}만원</span></div>
                <div className="flex justify-between"><span className="text-gray-600">농어촌특별세 (결정세액 × 20%)</span><span className="font-medium">+ {result.comprehensiveTax.ruralSpecialTax.toLocaleString()}만원</span></div>
                <div className="h-px bg-gray-200 my-1" />
                <div className="flex justify-between font-bold text-base"><span className="text-gray-900">종부세 합계</span><span className="text-[#F15F5F]">{result.comprehensiveTax.totalComprehensiveTax.toLocaleString()}만원</span></div>
              </div>
            </div>
          </div>
        )}

        {/* 재산세 과세 기준표 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-2">본 계산기에서는 주택을 기준으로만 산출합니다.</h3>
          <p className="text-sm text-gray-600 mb-4">그 외 물건은 아래 표를 참조하세요.</p>
          <h4 className="font-bold text-gray-900 mb-3">재산세 과세 기준표</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm"><thead className="bg-white"><tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700">과세대상</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">과세표준</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">일반</th>
              <th className="px-3 py-2 text-center font-medium text-[#0EA5E9]">9억 이하 1세대1주택 특례</th>
            </tr></thead><tbody className="divide-y divide-blue-100">
              <tr><td className="px-3 py-2 text-gray-600" rowSpan={4}>주택</td><td className="px-3 py-2 text-gray-600">6천만원 이하</td><td className="px-3 py-2 text-center">0.1%</td><td className="px-3 py-2 text-center">0.05%</td></tr>
              <tr><td className="px-3 py-2 text-gray-600">1.5억원 이하</td><td className="px-3 py-2 text-center">6만원+초과 0.15%</td><td className="px-3 py-2 text-center">3만원+초과 0.1%</td></tr>
              <tr><td className="px-3 py-2 text-gray-600">3억원 이하</td><td className="px-3 py-2 text-center">19.5만원+초과 0.25%</td><td className="px-3 py-2 text-center">12만원+초과 0.2%</td></tr>
              <tr><td className="px-3 py-2 text-gray-600">3억원 초과</td><td className="px-3 py-2 text-center">57만원+초과 0.4%</td><td className="px-3 py-2 text-center">42만원+초과 0.35%</td></tr>
            </tbody></table>
          </div>
        </div>

        {/* 종합부동산세 기준표 */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-bold text-gray-900 mb-3">종합부동산세 세율표</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm"><thead className="bg-white"><tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700">과세표준</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">2주택 이하</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">3주택 이상</th>
            </tr></thead><tbody className="divide-y divide-blue-100">
              <tr><td className="px-3 py-2 text-gray-600">3억원 이하</td><td className="px-3 py-2 text-center">0.5%</td><td className="px-3 py-2 text-center">0.5%</td></tr>
              <tr><td className="px-3 py-2 text-gray-600">6억원 이하</td><td className="px-3 py-2 text-center">0.7% (-60만)</td><td className="px-3 py-2 text-center">0.7% (-60만)</td></tr>
              <tr><td className="px-3 py-2 text-gray-600">12억원 이하</td><td className="px-3 py-2 text-center">1% (-240만)</td><td className="px-3 py-2 text-center">1% (-240만)</td></tr>
              <tr><td className="px-3 py-2 text-gray-600">25억원 이하</td><td className="px-3 py-2 text-center">1.3% (-600만)</td><td className="px-3 py-2 text-center">2% (-1,440만)</td></tr>
              <tr><td className="px-3 py-2 text-gray-600">50억원 이하</td><td className="px-3 py-2 text-center">1.5% (-1,100만)</td><td className="px-3 py-2 text-center">3% (-3,940만)</td></tr>
              <tr><td className="px-3 py-2 text-gray-600">94억원 이하</td><td className="px-3 py-2 text-center">2% (-3,600만)</td><td className="px-3 py-2 text-center">4% (-8,940만)</td></tr>
              <tr><td className="px-3 py-2 text-gray-600">94억원 초과</td><td className="px-3 py-2 text-center">2.7% (-1억180만)</td><td className="px-3 py-2 text-center">5% (-1억8,340만)</td></tr>
            </tbody></table>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-3">⚠️ 주의사항</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            본 계산기는 대략적인 금액을 예측하는 참고용으로만 사용하여야 하며, 실제 보유세 납부시에는 세무사의 도움을 받으셔야 합니다.
            재산세와 함께 부과되는 지역자원시설세는 별도로 계산되지 않습니다.
          </p>
        </div>
      </div>
    </div>
  )
}


// 양도소득세 계산기
function CapitalGainsTaxCalculator() {
  const resultRef = useRef<HTMLDivElement>(null)
  const [infoTab, setInfoTab] = useState<'description' | 'advanced' | 'reform'>('description')
  const [propertyType, setPropertyType] = useState<CGTPropertyType>('single-home')

  const [acquisitionPrice, setAcquisitionPrice] = useState<number>(0)
  const [transferPrice, setTransferPrice] = useState<number>(0)
  const [expenses, setExpenses] = useState<number>(0)
  const [acquisitionDate, setAcquisitionDate] = useState('')
  const [transferDate, setTransferDate] = useState('')

  const [useBasicDeduction, setUseBasicDeduction] = useState(true)
  const [isJointOwnership, setIsJointOwnership] = useState(false)
  const [ownershipRatio, setOwnershipRatio] = useState(50)
  const [isRegulatedArea, setIsRegulatedArea] = useState(false)
  const [hasLivedTwoYears, setHasLivedTwoYears] = useState(false)
  const [isNonBusinessLand, setIsNonBusinessLand] = useState(false)

  const [result, setResult] = useState<CapitalGainsTaxResult | null>(null)

  const handleCalculate = () => {
    const calcResult = calculateCapitalGainsTax({
      propertyType,
      acquisitionPrice,
      transferPrice,
      expenses,
      acquisitionDate,
      transferDate,
      useBasicDeduction,
      isJointOwnership,
      ownershipRatio,
      isRegulatedArea: (propertyType === 'single-home' || propertyType === 'general') ? isRegulatedArea : false,
      hasLivedTwoYears: propertyType === 'single-home' ? hasLivedTwoYears : false,
      isNonBusinessLand: propertyType === 'land' ? isNonBusinessLand : false,
    })
    setResult(calcResult)
  }

  const infoTabStyle = (tab: typeof infoTab) =>
    `px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
      infoTab === tab ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]' : 'text-gray-500 hover:text-gray-700'
    }`
  const pillStyle = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
      active ? 'border-[#F15F5F] bg-[#F15F5F] text-white' : 'border-gray-300 text-gray-600 hover:border-gray-400'
    }`

  return (
    <div className="min-h-screen bg-white py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => { window.location.href = '/?view=calculator' }} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          세금 계산기 목록
        </button>

        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">🏠 양도소득세 계산</h1>
          <ShareButtons url="https://moajim.com/?view=calculator&sub=capital-gains-tax" />
        </div>

        <PropertyTaxBanner />

        {/* 안내 탭 */}
        <div className="flex gap-1 sm:gap-2 border-b border-gray-200 overflow-x-auto">
          <button onClick={() => setInfoTab('description')} className={infoTabStyle('description')}>설명</button>
          <button onClick={() => setInfoTab('advanced')} className={infoTabStyle('advanced')}>고급 계산</button>
          <button onClick={() => setInfoTab('reform')} className={infoTabStyle('reform')}>개정법 적용</button>
        </div>
        <div className="bg-blue-50 border border-blue-200 border-t-0 rounded-b-xl p-6 mb-6">
          {infoTab === 'description' && (
            <div className="text-sm text-gray-700 leading-relaxed space-y-3">
              <p>주택·아파트, 분양권, 토지 등 부동산 양도시 그 차익에 대해 부과되는 세금으로, 매매거래 후 직접 신고·납부해야 합니다.</p>
              <p>부동산은 양도일이 속하는 달의 말일로부터 <strong>2개월 이내</strong> 납부하여야 하며 기한 내 납부하지 않을 경우 가산세가 부과될 수 있습니다.</p>
            </div>
          )}
          {infoTab === 'advanced' && (
            <div className="text-sm text-gray-700 leading-relaxed space-y-3">
              <p>일반적인 상황이 아닌, 세법상 예외적인 경우에 사용할 수 있는 다양한 옵션들이 제공됩니다.</p>
              <p><strong>공동명의</strong>: 지분율에 따라 양도차익을 안분하여 계산합니다.</p>
              <p><strong>조정대상지역</strong>: 다주택 중과세율(+20%)이 적용될 수 있습니다. 단, 중과유예 기간(2022.05~2025.05)에는 기본세율이 적용됩니다.</p>
              <p><strong>비사업토지</strong>: 기본세율에 10%를 가산하여 과세합니다.</p>
            </div>
          )}
          {infoTab === 'reform' && (
            <div className="text-sm text-gray-700 leading-relaxed space-y-3">
              <p>시행된 법령 및 시행이 확정된 예정 세법이 반영되어 있습니다.</p>
              <p>양도소득세 관련 규정은 <strong>양도일을 기준</strong>으로 적용되므로 입력하신 양도일자에 맞게 신규 규정 적용 여부가 자동으로 결정됩니다.</p>
              <p className="text-amber-700 font-medium">1세대1주택 비과세 기준금액: <strong>12억원</strong> (2021.01.01 이후 양도분)</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* 부동산 유형 선택 */}
          <div>
            <p className="text-xs font-bold text-gray-500 tracking-wide mb-3">부동산 유형</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setPropertyType('single-home'); setResult(null) }} className={pillStyle(propertyType === 'single-home')}>1세대 1주택</button>
              <button onClick={() => { setPropertyType('general'); setResult(null) }} className={pillStyle(propertyType === 'general')}>일반(다주택)</button>
              <button onClick={() => { setPropertyType('pre-sale'); setResult(null) }} className={pillStyle(propertyType === 'pre-sale')}>분양권</button>
              <button onClick={() => { setPropertyType('land'); setResult(null) }} className={pillStyle(propertyType === 'land')}>토지</button>
            </div>
          </div>

          {/* 옵션 체크박스 */}
          <div className="space-y-3 py-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={useBasicDeduction} onChange={(e) => setUseBasicDeduction(e.target.checked)} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
                <span className="text-sm text-gray-700">기본공제</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isJointOwnership} onChange={(e) => setIsJointOwnership(e.target.checked)} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
                <span className="text-sm text-gray-700">공동명의</span>
              </label>
              {(propertyType === 'single-home' || propertyType === 'general') && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isRegulatedArea} onChange={(e) => setIsRegulatedArea(e.target.checked)} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
                  <span className="text-sm text-gray-700">조정대상지역</span>
                </label>
              )}
              {propertyType === 'single-home' && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={hasLivedTwoYears} onChange={(e) => setHasLivedTwoYears(e.target.checked)} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
                  <span className="text-sm text-gray-700">2년 이상 거주</span>
                </label>
              )}
              {propertyType === 'land' && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isNonBusinessLand} onChange={(e) => setIsNonBusinessLand(e.target.checked)} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
                  <span className="text-sm text-gray-700">비사업토지</span>
                </label>
              )}
            </div>
          </div>

          {/* 공동명의 지분율 */}
          {isJointOwnership && (
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">지분율 (%)</label>
              <input type="number" min={1} max={99} value={ownershipRatio || ''} onChange={(e) => setOwnershipRatio(Number(e.target.value))} className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="50" />
            </div>
          )}

          {/* 금액 입력 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">취득가액</label>
              <div className="relative">
                <input type="number" value={acquisitionPrice || ''} onChange={(e) => setAcquisitionPrice(Number(e.target.value))} className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="금액 입력" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
              </div>
              {acquisitionPrice > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(acquisitionPrice)}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">양도가액</label>
              <div className="relative">
                <input type="number" value={transferPrice || ''} onChange={(e) => setTransferPrice(Number(e.target.value))} className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="금액 입력" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
              </div>
              {transferPrice > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(transferPrice)}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">필요경비</label>
            <div className="relative">
              <input type="number" value={expenses || ''} onChange={(e) => setExpenses(Number(e.target.value))} className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="금액 입력" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
            </div>
            {expenses > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(expenses)}</p>}
          </div>

          {/* 날짜 입력 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">취득일자</label>
              <input type="text" value={acquisitionDate} onChange={(e) => setAcquisitionDate(e.target.value.replace(/\D/g, '').slice(0, 8))} className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg font-mono" placeholder="20200101" maxLength={8} />
              {acquisitionDate.length === 8 && <p className="text-xs text-gray-500 mt-1">{acquisitionDate.slice(0, 4)}.{acquisitionDate.slice(4, 6)}.{acquisitionDate.slice(6, 8)}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">양도일자</label>
              <input type="text" value={transferDate} onChange={(e) => setTransferDate(e.target.value.replace(/\D/g, '').slice(0, 8))} className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg font-mono" placeholder="20260401" maxLength={8} />
              {transferDate.length === 8 && <p className="text-xs text-gray-500 mt-1">{transferDate.slice(0, 4)}.{transferDate.slice(4, 6)}.{transferDate.slice(6, 8)}</p>}
            </div>
          </div>

          {/* 계산 버튼 */}
          <button onClick={handleCalculate} className="w-full py-4 bg-[#F15F5F] text-white rounded-xl font-bold hover:bg-[#E14E4E] transition-colors">양도소득세 계산</button>

          {/* 결과 */}
          {result && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-end mb-2">
                <CaptureButtons targetRef={resultRef} fileName="moajim-양도세-결과" />
              </div>
              <div ref={resultRef} className="bg-gradient-to-br from-red-50 to-pink-50/30 rounded-2xl p-6 border border-red-100">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 mb-2">
                    {result.isTaxExempt ? '비과세 (세금 없음)' : '예상 양도소득세 + 지방소득세'}
                  </p>
                  <p className="text-4xl font-bold text-[#F15F5F]">
                    {result.totalTaxWon.toLocaleString()}원
                  </p>
                </div>

                <div className="space-y-3 border-t border-red-200 pt-4">
                  {isJointOwnership && (
                    <div className="flex justify-between text-sm text-amber-700 font-medium">
                      <span>공동명의 지분율 적용</span>
                      <span>{ownershipRatio}%</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">양도가액</span>
                    <span className="font-medium">{(isJointOwnership ? result.effectiveTransferPrice : result.transferPrice).toLocaleString()}만원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">취득가액</span>
                    <span className="font-medium text-[#F15F5F]">-{(isJointOwnership ? result.effectiveAcquisitionPrice : result.acquisitionPrice).toLocaleString()}만원</span>
                  </div>
                  {(isJointOwnership ? result.effectiveExpenses : result.expenses) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">필요경비</span>
                      <span className="font-medium text-[#F15F5F]">-{(isJointOwnership ? result.effectiveExpenses : result.expenses).toLocaleString()}만원</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold border-t border-red-200 pt-3">
                    <span className="text-gray-900">양도차익</span>
                    <span>{result.capitalGain.toLocaleString()}만원</span>
                  </div>

                  {result.taxExemptGain > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">1세대1주택 비과세</span>
                      <span className="font-medium text-[#F15F5F]">-{result.taxExemptGain.toLocaleString()}만원</span>
                    </div>
                  )}
                  {result.taxExemptGain > 0 && !result.isTaxExempt && (
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-gray-900">과세대상 양도차익</span>
                      <span>{result.taxableGain.toLocaleString()}만원</span>
                    </div>
                  )}

                  {!result.isTaxExempt && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">보유기간</span>
                        <span className="font-medium">{result.holdingYears}년 {result.holdingMonths % 12}개월</span>
                      </div>
                      {result.longTermDeduction > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">장기보유특별공제 ({result.longTermRate}%)</span>
                          <span className="font-medium text-[#F15F5F]">-{result.longTermDeduction.toLocaleString()}만원</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-bold border-t border-red-200 pt-3">
                        <span className="text-gray-900">양도소득금액</span>
                        <span>{result.taxableIncome.toLocaleString()}만원</span>
                      </div>
                      {result.basicDeduction > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">기본공제</span>
                          <span className="font-medium text-[#F15F5F]">-{result.basicDeduction.toLocaleString()}만원</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-bold border-t border-red-200 pt-3">
                        <span className="text-gray-900">과세표준</span>
                        <span>{result.taxBase.toLocaleString()}만원</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">세율</span>
                        <span className="font-medium">{result.taxRate}%{result.surchargeRate > 0 ? ` + ${result.surchargeRate}% (중과)` : ''}</span>
                      </div>
                      {result.progressiveDeduction > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">누진공제</span>
                          <span className="font-medium text-[#F15F5F]">-{result.progressiveDeduction.toLocaleString()}만원</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-bold border-t border-red-200 pt-3">
                        <span className="text-gray-900">산출세액</span>
                        <span>{(result.calculatedTax * 10000).toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">지방소득세 (10%)</span>
                        <span className="font-medium">{(result.localTax * 10000).toLocaleString()}원</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 참고사항 */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>ℹ️</span>
              2026년 양도소득세 과세 기준표
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">과세표준</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-700">세율</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-700">누진공제</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  <tr><td className="px-4 py-2 text-gray-600">1,400만원 이하</td><td className="px-4 py-2 text-center">6%</td><td className="px-4 py-2 text-right">-</td></tr>
                  <tr><td className="px-4 py-2 text-gray-600">5,000만원 이하</td><td className="px-4 py-2 text-center">15%</td><td className="px-4 py-2 text-right">126만원</td></tr>
                  <tr><td className="px-4 py-2 text-gray-600">8,800만원 이하</td><td className="px-4 py-2 text-center">24%</td><td className="px-4 py-2 text-right">576만원</td></tr>
                  <tr><td className="px-4 py-2 text-gray-600">1억5천만원 이하</td><td className="px-4 py-2 text-center">35%</td><td className="px-4 py-2 text-right">1,544만원</td></tr>
                  <tr><td className="px-4 py-2 text-gray-600">3억원 이하</td><td className="px-4 py-2 text-center">38%</td><td className="px-4 py-2 text-right">1,994만원</td></tr>
                  <tr><td className="px-4 py-2 text-gray-600">5억원 이하</td><td className="px-4 py-2 text-center">40%</td><td className="px-4 py-2 text-right">2,594만원</td></tr>
                  <tr><td className="px-4 py-2 text-gray-600">10억원 이하</td><td className="px-4 py-2 text-center">42%</td><td className="px-4 py-2 text-right">3,594만원</td></tr>
                  <tr><td className="px-4 py-2 text-gray-600">10억원 초과</td><td className="px-4 py-2 text-center">45%</td><td className="px-4 py-2 text-right">6,594만원</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-4">검수) 부동산세금 전문 세무사 강동균</p>
          </div>

          {/* 주의사항 */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-3">⚠️ 주의사항</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              본 계산기는 대략적인 금액을 예측하는 참고용으로만 사용하여야 하며
              실제 양도소득세 납부시에는 세무사의 도움을 받으셔야 합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
