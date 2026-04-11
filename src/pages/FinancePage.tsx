import { useState, useRef } from 'react'
import { calculateLoanInterest, type RepaymentMethod, type LoanResult } from '../utils/loanInterest'
import { calculateMortgageLoan, type PropertyCategory, type RegulationRegion, type BuyerType, type DepositRegion, type MortgageLoanResult } from '../utils/mortgageLoan'
import { calculateSavingsInterest, type SavingsResult } from '../utils/savingsInterest'
import { formatKoreanAmount } from '../utils/currency'
import ShareButtons from '../components/ShareButtons'
import PropertyTaxBanner from '../components/PropertyTaxBanner'
import CaptureButtons from '../components/CaptureButtons'

interface FinancePageProps {
  initialSubView?: string
}

export default function FinancePage({ initialSubView }: FinancePageProps) {
  if (initialSubView === 'loan-interest') {
    return <LoanInterestCalculator />
  }

  if (initialSubView === 'mortgage-loan') {
    return <MortgageLoanCalculator />
  }

  if (initialSubView === 'savings-interest') {
    return <SavingsInterestCalculator />
  }

  return <FinanceList />
}

// 금융 계산기 목록
function FinanceList() {
  const navigateTo = (sub: string) => {
    window.location.href = `/?view=finance&sub=${sub}`
  }

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-[42px] font-bold text-gray-900 mb-2 sm:mb-3">
            금융 계산기
          </h1>
          <p className="text-sm sm:text-base md:text-[17px] text-gray-600">
            대출, 이자 등 금융 계산을 쉽고 빠르게
          </p>
        </div>

        <PropertyTaxBanner />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <button
            onClick={() => navigateTo('loan-interest')}
            className="group text-left p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#F15F5F] transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🏦</span>
              <svg className="w-6 h-6 text-gray-300 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">대출 이자 계산기</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              상환방법별 월 상환금과 총 이자를 계산합니다.
            </p>
          </button>

          <button
            onClick={() => navigateTo('mortgage-loan')}
            className="group text-left p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#F15F5F] transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🏠</span>
              <svg className="w-6 h-6 text-gray-300 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">담보 대출 가능액</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              지역별 LTV 기준으로 담보 대출 가능 금액을 계산합니다.
            </p>
          </button>

          <button
            onClick={() => navigateTo('savings-interest')}
            className="group text-left p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#F15F5F] transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">💰</span>
              <svg className="w-6 h-6 text-gray-300 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">예적금 이자 계산기</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              예금·적금의 이자 수익을 단리/복리로 계산합니다.
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}

// 대출 이자 계산기
function LoanInterestCalculator() {
  const resultRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'explanation' | 'calculator' | 'methods'>('calculator')

  // 상환 방식
  const [method, setMethod] = useState<RepaymentMethod>('equal-payment')

  // 입력
  const [principal, setPrincipal] = useState<number>(0)
  const [totalMonths, setTotalMonths] = useState<number>(0)
  const [annualRate, setAnnualRate] = useState<number>(0)

  // 거치기간
  const [hasGracePeriod, setHasGracePeriod] = useState(false)
  const [graceMonths, setGraceMonths] = useState<number>(0)

  // 상환 스케줄 펼치기
  const [showFullSchedule, setShowFullSchedule] = useState(false)

  const [result, setResult] = useState<LoanResult | null>(null)

  const handleCalculate = () => {
    if (principal <= 0 || totalMonths <= 0 || annualRate <= 0) return
    const grace = hasGracePeriod ? graceMonths : 0
    if (grace >= totalMonths) return
    setResult(calculateLoanInterest({
      principal,
      totalMonths,
      annualRate,
      method,
      graceMonths: grace,
    }))
    setShowFullSchedule(false)
  }

  return (
    <div className="min-h-screen bg-white py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => { window.location.href = '/?view=finance' }}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          금융 계산기 목록
        </button>

        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">대출 이자 계산</h1>
          <ShareButtons url="https://moajim.com/?view=finance&sub=loan-interest" />
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
            대출이자 계산
          </button>
          <button
            onClick={() => setActiveTab('methods')}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'methods'
                ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            상환 방법
          </button>
        </div>

        {/* 설명 탭 */}
        {activeTab === 'explanation' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed">
              대출 시 납부해야 할 이자를 계산합니다.
              상환방법, 대출기간, 이율에 따른 월별 상환 내역과 총 납부 이자를 확인할 수 있습니다.
            </p>
          </div>
        )}

        {/* 상환 방법 탭 */}
        {activeTab === 'methods' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">만기일시상환</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                원금은 만기에 전액 상환하고 그 전까지는 이자만 납입합니다.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">원금균등분할상환</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                매달 같은 비율로 원금을 상환합니다. 이자는 남은 잔액만큼 내므로 원금이 상환되는 만큼 점점 줄어듭니다.
                즉 시간이 지날수록 납부금액이 줄어드는 방식입니다.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">원리금균등분할상환</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                총 이자와 원금을 기간으로 나누어 매달 균등하게 같은 금액을 납부합니다.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">체증식분할상환</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                상환액을 일정하게 증가시키며 납부합니다. 초기엔 적은 금액을, 시간이 지날수록 많은 금액을 납부합니다.
                보금자리론 등 일부 특수 대출에만 적용되는 방식입니다.
              </p>
            </div>
          </div>
        )}

        {/* 대출이자 계산 탭 */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            {/* 상환 방식 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                상환 방식
              </label>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: 'bullet', label: '만기일시' },
                  { value: 'equal-principal', label: '원금균등' },
                  { value: 'equal-payment', label: '원리금균등' },
                  { value: 'graduated', label: '체증식' },
                ] as const).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => { setMethod(option.value); setResult(null) }}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      method === option.value
                        ? 'border-[#F15F5F] bg-red-50 text-[#F15F5F] font-medium'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 거치기간 */}
            {method !== 'bullet' && (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasGracePeriod}
                    onChange={(e) => { setHasGracePeriod(e.target.checked); setResult(null) }}
                    className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                  />
                  <span className="text-sm text-gray-700">거치기간 설정</span>
                </label>

                {hasGracePeriod && (
                  <div className="ml-7 relative">
                    <input
                      type="number"
                      value={graceMonths || ''}
                      onChange={(e) => setGraceMonths(Number(e.target.value))}
                      className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none"
                      placeholder="거치기간 입력"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                      개월
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 대출 금액 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                대출 금액
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={principal || ''}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                  placeholder="금액 입력"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  만원
                </span>
              </div>
              {principal > 0 && (
                <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(principal)}</p>
              )}
            </div>

            {/* 대출 기간 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                대출 기간
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={totalMonths || ''}
                  onChange={(e) => setTotalMonths(Number(e.target.value))}
                  className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                  placeholder="총 개월수 입력"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  개월
                </span>
              </div>
              {totalMonths > 0 && (
                <p className="text-xs text-gray-500 mt-1">= {Math.floor(totalMonths / 12)}년 {totalMonths % 12 > 0 ? `${totalMonths % 12}개월` : ''}</p>
              )}
            </div>

            {/* 연 이자율 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                연 이자율
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={annualRate || ''}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                  placeholder="% 입력"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  %
                </span>
              </div>
            </div>

            {/* 계산 버튼 */}
            <button
              onClick={handleCalculate}
              className="w-full py-4 bg-[#F15F5F] text-white rounded-xl font-bold hover:bg-[#E14E4E] transition-colors"
            >
              대출이자 계산
            </button>

            {/* 결과 */}
            {result && (
              <div className="mt-8 space-y-4">
                <div className="flex justify-end mb-2">
                  <CaptureButtons targetRef={resultRef} fileName="moajim-대출이자-결과" />
                </div>
                <div ref={resultRef} className="bg-gradient-to-br from-red-50 to-pink-50/30 rounded-2xl p-6 border border-red-100">
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 mb-2">총 납부 이자</p>
                    <p className="text-4xl font-bold text-[#F15F5F]">
                      {result.totalInterest.toLocaleString()}만원
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      ({(result.totalInterest * 10000).toLocaleString()}원)
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-red-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">대출 원금</span>
                      <span className="font-medium">{principal.toLocaleString()}만원</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">총 상환금</span>
                      <span className="font-medium">{result.totalPayment.toLocaleString()}만원</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-red-200 pt-3">
                      <span className="text-gray-900">총 이자</span>
                      <span className="text-[#F15F5F]">{result.totalInterest.toLocaleString()}만원</span>
                    </div>
                    {method !== 'bullet' && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">첫 달 상환금</span>
                          <span className="font-medium">{result.monthlyPaymentFirst.toLocaleString()}만원</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">마지막 달 상환금</span>
                          <span className="font-medium">{result.monthlyPaymentLast.toLocaleString()}만원</span>
                        </div>
                      </>
                    )}
                    {method === 'bullet' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">월 이자 납부금</span>
                        <span className="font-medium">{result.monthlyPaymentFirst.toLocaleString()}만원</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 월별 상환 스케줄 */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowFullSchedule(!showFullSchedule)}
                    className="w-full flex items-center justify-between px-6 py-4 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <span>월별 상환 내역</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${showFullSchedule ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showFullSchedule && (
                    <div className="overflow-x-auto border-t border-gray-200">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-center font-medium text-gray-700">회차</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">납입원금</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">이자</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">월상환금</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">잔금</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {result.schedule.map((row) => (
                            <tr key={row.month} className="hover:bg-gray-50">
                              <td className="px-4 py-2.5 text-center text-gray-600">{row.month}</td>
                              <td className="px-4 py-2.5 text-right">{row.principalPayment.toLocaleString()}</td>
                              <td className="px-4 py-2.5 text-right text-[#F15F5F]">{row.interest.toLocaleString()}</td>
                              <td className="px-4 py-2.5 text-right font-medium">{row.payment.toLocaleString()}</td>
                              <td className="px-4 py-2.5 text-right text-gray-600">{row.balance.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 주의사항 */}
            <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">⚠️ 주의사항</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                정해진 상환 계획과 다르게 원금을 중도에 상환하실 경우 은행에서는 일반적으로
                중도상환수수료라는 일종의 위약금을 부과합니다.
                중도상환수수료에 따라서 중도상환에 따른 이자 감소 효과가 일부 상쇄될 수 있습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 담보 대출 가능액 계산기
function MortgageLoanCalculator() {
  const resultRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'explanation' | 'calculator' | 'ltv' | 'deposit'>('calculator')

  const [propertyCategory, setPropertyCategory] = useState<PropertyCategory>('housing')
  const [regulationRegion, setRegulationRegion] = useState<RegulationRegion>('other')
  const [buyerType, setBuyerType] = useState<BuyerType>('non-owner')
  const [depositRegion, setDepositRegion] = useState<DepositRegion>('seoul')
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(false)

  const [hasRoomDeduction, setHasRoomDeduction] = useState(true)
  const [isRenting, setIsRenting] = useState(false)
  const [manualDeposit, setManualDeposit] = useState(false)
  const [manualDepositAmount, setManualDepositAmount] = useState<number>(0)

  const [collateralValue, setCollateralValue] = useState<number>(0)
  const [priorLoan, setPriorLoan] = useState<number>(0)
  const [roomCount, setRoomCount] = useState<number>(0)
  const [tenantDeposit, setTenantDeposit] = useState<number>(0)

  const [result, setResult] = useState<MortgageLoanResult | null>(null)

  const handleCalculate = () => {
    if (collateralValue <= 0) return
    setResult(calculateMortgageLoan({
      propertyCategory, regulationRegion, buyerType, isFirstTimeBuyer, depositRegion,
      hasRoomDeduction, isRenting, manualDeposit, manualDepositAmount,
      collateralValue, priorLoan, roomCount, tenantDeposit: isRenting ? tenantDeposit : 0,
    }))
  }

  return (
    <div className="min-h-screen bg-white py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => { window.location.href = '/?view=finance' }}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          금융 계산기 목록
        </button>

        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">담보 대출 가능액 계산</h1>
          <ShareButtons url="https://moajim.com/?view=finance&sub=mortgage-loan" />
        </div>

        <PropertyTaxBanner />

        {/* 탭 */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
          {([
            { value: 'explanation', label: '설명' },
            { value: 'calculator', label: '대출가능액 계산' },
            { value: 'ltv', label: '지역별 LTV' },
            { value: 'deposit', label: '임차보증금' },
          ] as const).map((tab) => (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)}
              className={`px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab.value ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]' : 'text-gray-500 hover:text-gray-700'
              }`}>{tab.label}</button>
          ))}
        </div>

        {/* 설명 탭 */}
        {activeTab === 'explanation' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              지역별 LTV(Loan to Value, 담보인정비율)를 기준으로 담보 대출 가능 금액을 계산합니다.
              실제 대출에서는 DTI, DSR, 개별 여신 상품별 한도 등이 추가로 적용되어 대출 금액이 달라질 수 있습니다.
            </p>
            <div className="bg-white rounded-lg p-4 text-sm text-gray-600 space-y-1">
              <p className="font-bold text-gray-900 mb-2">계산식</p>
              <p>담보인정비율(LTV) = (대출금액 + 선순위채권 + 임차보증금 등) / 담보가치</p>
              <p>선순위채권 = 본 대출 이전에 동일한 담보로 받은 대출 잔액 등</p>
              <p>임차보증금 등 = 전월세보증금, 소액보증금 최우선변제금액 등</p>
            </div>
          </div>
        )}

        {/* 지역별 LTV 탭 */}
        {activeTab === 'ltv' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>ℹ️</span> 2026년 지역별 LTV 기준 (2025.6.28 개정)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">구분</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-700">규제지역<br/><span className="text-[10px] text-gray-500">조정대상지역</span></th>
                    <th className="px-3 py-2 text-center font-medium text-gray-700">기타 지역</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  <tr><td className="px-3 py-2 text-gray-600">다주택자</td><td className="px-3 py-2 text-center">0%</td><td className="px-3 py-2 text-center">60%<br/><span className="text-xs text-gray-500">(수도권 0%)</span></td></tr>
                  <tr><td className="px-3 py-2 text-gray-600">무주택 (1주택 처분조건)</td><td className="px-3 py-2 text-center">50%</td><td className="px-3 py-2 text-center">70%</td></tr>
                  <tr><td className="px-3 py-2 text-gray-600">서민·실수요자</td><td className="px-3 py-2 text-center">70%</td><td className="px-3 py-2 text-center">70%</td></tr>
                  <tr><td className="px-3 py-2 text-gray-600">생애최초 구매자</td><td className="px-3 py-2 text-center">70%</td><td className="px-3 py-2 text-center">80%<br/><span className="text-xs text-gray-500">(수도권 70%)</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 임차보증금 탭 */}
        {activeTab === 'deposit' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                <strong>임차보증금</strong>: 대출 이전에 전입한 전월세 계약의 보증금입니다. 우선 변제 대상이므로 대출가능금액에서 차감됩니다.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>소액임차보증금 최우선변제금액</strong>: 대출 이후에도 누군가가 남는 방에 뒤늦게 전입하면, 후순위 권리자라도 법으로 정한 금액만큼은 최우선으로 변제해줘야 합니다.
                방 수만큼 최우선변제금액을 차감하여 대출가능금액을 계산합니다.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><span>ℹ️</span> 주택 소액보증금 최우선변제금액</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white"><tr><th className="px-3 py-2 text-left font-medium text-gray-700">구분</th><th className="px-3 py-2 text-right font-medium text-gray-700">기준 금액</th><th className="px-3 py-2 text-right font-medium text-gray-700">우선변제금액</th></tr></thead>
                  <tbody className="divide-y divide-blue-100">
                    <tr><td className="px-3 py-2 text-gray-600">서울특별시</td><td className="px-3 py-2 text-right">1억6,500만원 이하</td><td className="px-3 py-2 text-right font-medium">5,500만원</td></tr>
                    <tr><td className="px-3 py-2 text-gray-600 text-xs">과밀억제권역·세종·용인·화성·김포</td><td className="px-3 py-2 text-right">1억4,500만원 이하</td><td className="px-3 py-2 text-right font-medium">4,800만원</td></tr>
                    <tr><td className="px-3 py-2 text-gray-600 text-xs">광역시(일부 제외)·안산·광주·파주·이천·평택</td><td className="px-3 py-2 text-right">8,500만원 이하</td><td className="px-3 py-2 text-right font-medium">2,800만원</td></tr>
                    <tr><td className="px-3 py-2 text-gray-600">그 밖의 지역</td><td className="px-3 py-2 text-right">7,500만원 이하</td><td className="px-3 py-2 text-right font-medium">2,500만원</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><span>ℹ️</span> 상가 소액보증금 최우선변제금액</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white"><tr><th className="px-3 py-2 text-left font-medium text-gray-700">구분</th><th className="px-3 py-2 text-right font-medium text-gray-700">기준 금액</th><th className="px-3 py-2 text-right font-medium text-gray-700">우선변제금액</th></tr></thead>
                  <tbody className="divide-y divide-blue-100">
                    <tr><td className="px-3 py-2 text-gray-600">서울특별시</td><td className="px-3 py-2 text-right">6,500만원 이하</td><td className="px-3 py-2 text-right font-medium">2,200만원</td></tr>
                    <tr><td className="px-3 py-2 text-gray-600">과밀억제권역</td><td className="px-3 py-2 text-right">5,500만원 이하</td><td className="px-3 py-2 text-right font-medium">1,900만원</td></tr>
                    <tr><td className="px-3 py-2 text-gray-600 text-xs">광역시(일부 제외)·안산·용인·김포·광주</td><td className="px-3 py-2 text-right">3,800만원 이하</td><td className="px-3 py-2 text-right font-medium">1,300만원</td></tr>
                    <tr><td className="px-3 py-2 text-gray-600">그 밖의 지역</td><td className="px-3 py-2 text-right">3,000만원 이하</td><td className="px-3 py-2 text-right font-medium">1,000만원</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 대출가능액 계산 탭 */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            {/* 부동산 유형 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">부동산 유형</label>
              <div className="flex flex-wrap gap-2">
                {([{ value: 'housing', label: '주택' }, { value: 'commercial', label: '상가' }] as const).map((opt) => (
                  <button key={opt.value} onClick={() => { setPropertyCategory(opt.value); setResult(null) }}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${propertyCategory === opt.value ? 'border-[#F15F5F] bg-red-50 text-[#F15F5F] font-medium' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>{opt.label}</button>
                ))}
              </div>
            </div>

            {/* 지역 구분 (LTV) */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">지역 구분 (LTV 기준)</label>
              <div className="flex flex-wrap gap-2">
                {([{ value: 'regulated', label: '규제지역(조정대상)' }, { value: 'metropolitan', label: '수도권(비규제)' }, { value: 'other', label: '비수도권(비규제)' }] as const).map((opt) => (
                  <button key={opt.value} onClick={() => { setRegulationRegion(opt.value); setResult(null) }}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${regulationRegion === opt.value ? 'border-[#F15F5F] bg-red-50 text-[#F15F5F] font-medium' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>{opt.label}</button>
                ))}
              </div>
            </div>

            {/* 주택 소유 상태 */}
            {propertyCategory === 'housing' && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">주택 소유 상태</label>
                <div className="flex flex-wrap gap-2">
                  {([{ value: 'multi-owner', label: '다주택자' }, { value: 'non-owner', label: '무주택·1주택 처분조건' }, { value: 'low-income', label: '서민·실수요자' }] as const).map((opt) => (
                    <button key={opt.value} onClick={() => { setBuyerType(opt.value); setResult(null) }}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${buyerType === opt.value ? 'border-[#F15F5F] bg-red-50 text-[#F15F5F] font-medium' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>{opt.label}</button>
                  ))}
                </div>
              </div>
            )}

            {/* 소액보증금 지역 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">소액보증금 지역</label>
              <div className="flex flex-wrap gap-2">
                {([{ value: 'seoul', label: '서울특별시' }, { value: 'overcrowded', label: '과밀억제권역 등' }, { value: 'metro', label: '광역시 등' }, { value: 'etc', label: '그 밖의 지역' }] as const).map((opt) => (
                  <button key={opt.value} onClick={() => { setDepositRegion(opt.value); setResult(null) }}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${depositRegion === opt.value ? 'border-[#F15F5F] bg-red-50 text-[#F15F5F] font-medium' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>{opt.label}</button>
                ))}
              </div>
            </div>

            {/* 체크박스 옵션 */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              {propertyCategory === 'housing' && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={isFirstTimeBuyer} onChange={(e) => { setIsFirstTimeBuyer(e.target.checked); setResult(null) }} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
                  <span className="text-sm text-gray-700">생애최초 주택 구입</span>
                </label>
              )}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={hasRoomDeduction} onChange={(e) => { setHasRoomDeduction(e.target.checked); setResult(null) }} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
                <span className="text-sm text-gray-700">방 공제 (소액보증금 차감)</span>
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={isRenting} onChange={() => { setIsRenting(true); setResult(null) }} className="w-4 h-4 text-[#F15F5F] focus:ring-[#F15F5F]" />
                  <span className="text-sm text-gray-700">임대 중</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={!isRenting} onChange={() => { setIsRenting(false); setResult(null) }} className="w-4 h-4 text-[#F15F5F] focus:ring-[#F15F5F]" />
                  <span className="text-sm text-gray-700">거주 중</span>
                </label>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={manualDeposit} onChange={(e) => { setManualDeposit(e.target.checked); setResult(null) }} className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
                <span className="text-sm text-gray-700">소액보증금 직접입력</span>
              </label>
              {manualDeposit && (
                <div className="ml-7 relative">
                  <input type="number" value={manualDepositAmount || ''} onChange={(e) => setManualDepositAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none" placeholder="소액보증금 금액" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">만원</span>
                </div>
              )}
            </div>

            {/* 담보가치 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">담보가치 (감정가)</label>
              <div className="relative">
                <input type="number" value={collateralValue || ''} onChange={(e) => setCollateralValue(Number(e.target.value))}
                  className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="금액 입력" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
              </div>
              {collateralValue > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(collateralValue)}</p>}
            </div>

            {/* 선순위채권 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">선순위채권 (선순위 대출 등)</label>
              <div className="relative">
                <input type="number" value={priorLoan || ''} onChange={(e) => setPriorLoan(Number(e.target.value))}
                  className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="금액 입력" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
              </div>
              {priorLoan > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(priorLoan)}</p>}
            </div>

            {/* 임차보증금 */}
            {isRenting && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">임차보증금</label>
                <div className="relative">
                  <input type="number" value={tenantDeposit || ''} onChange={(e) => setTenantDeposit(Number(e.target.value))}
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="전월세 보증금" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
                </div>
                {tenantDeposit > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(tenantDeposit)}</p>}
              </div>
            )}

            {/* 방 수 */}
            {hasRoomDeduction && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">방 수 (소액보증금 계산용)</label>
                <div className="relative">
                  <input type="number" value={roomCount || ''} onChange={(e) => setRoomCount(Number(e.target.value))}
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="방 수 입력" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">개</span>
                </div>
              </div>
            )}

            {/* 계산 버튼 */}
            <button onClick={handleCalculate} className="w-full py-4 bg-[#F15F5F] text-white rounded-xl font-bold hover:bg-[#E14E4E] transition-colors">
              대출가능액 계산
            </button>

            {/* 결과 */}
            {result && (
              <div className="mt-8 space-y-4">
                <div className="flex justify-end mb-2">
                  <CaptureButtons targetRef={resultRef} fileName="moajim-담보대출-결과" />
                </div>
                <div ref={resultRef} className="bg-gradient-to-br from-red-50 to-pink-50/30 rounded-2xl p-6 border border-red-100">
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 mb-2">예상 대출 가능 금액</p>
                    <p className="text-4xl font-bold text-[#F15F5F]">{result.maxLoan.toLocaleString()}만원</p>
                    <p className="text-sm text-gray-500 mt-1">({(result.maxLoan * 10000).toLocaleString()}원)</p>
                    <p className="text-xs text-gray-400 mt-2">{result.description}</p>
                  </div>
                  <div className="space-y-3 border-t border-red-200 pt-4">
                    <div className="flex justify-between text-sm"><span className="text-gray-600">담보가치</span><span className="font-medium">{result.collateralValue.toLocaleString()}만원</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">적용 LTV</span><span className="font-medium">{result.ltvRate}%</span></div>
                    <div className="flex justify-between text-sm font-bold border-t border-red-200 pt-3"><span className="text-gray-900">담보인정금액</span><span>{result.ltvAmount.toLocaleString()}만원</span></div>
                    {result.priorLoan > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">선순위채권</span><span className="font-medium text-[#F15F5F]">-{result.priorLoan.toLocaleString()}만원</span></div>}
                    {result.tenantDeposit > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">임차보증금</span><span className="font-medium text-[#F15F5F]">-{result.tenantDeposit.toLocaleString()}만원</span></div>}
                    {result.smallDeposit > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">소액보증금 ({result.smallDepositPerRoom.toLocaleString()} x {roomCount}방)</span><span className="font-medium text-[#F15F5F]">-{result.smallDeposit.toLocaleString()}만원</span></div>}
                    <div className="flex justify-between text-sm font-bold border-t border-red-200 pt-3"><span className="text-gray-900">대출 가능 금액</span><span className="text-[#F15F5F]">{result.maxLoan.toLocaleString()}만원</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* 주의사항 */}
            <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">⚠️ 주의사항</h3>
              <ul className="text-sm text-gray-700 leading-relaxed space-y-2">
                <li>본 계산기는 참고용이며, 실제 대출 한도는 금융기관에 따라 다를 수 있습니다.</li>
                <li>DTI(총부채상환비율), DSR(총부채원리금상환비율) 등이 추가로 적용됩니다.</li>
                <li>아파트는 일반적으로 소액보증금을 차감하지 않으나, 금융회사마다 다를 수 있습니다.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 예적금 이자 계산기
function SavingsInterestCalculator() {
  const resultRef = useRef<HTMLDivElement>(null)
  const [depositAmount, setDepositAmount] = useState<number>(0)
  const [monthlyAmount, setMonthlyAmount] = useState<number>(0)
  const [totalMonths, setTotalMonths] = useState<number>(0)
  const [annualRate, setAnnualRate] = useState<number>(0)
  const [taxRate, setTaxRate] = useState<number>(15.4)
  const [showTaxInput, setShowTaxInput] = useState(false)
  const [result, setResult] = useState<SavingsResult | null>(null)

  const handleCalculate = () => {
    if (totalMonths <= 0 || annualRate <= 0) return
    if (depositAmount <= 0 && monthlyAmount <= 0) return
    const r = calculateSavingsInterest({ depositAmount, monthlyAmount, totalMonths, annualRate, taxRate })
    setResult(r)
    setTimeout(() => { resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 100)
  }

  const fmt = (v: number) => {
    if (v === 0) return '0원'
    const rounded = Math.round(v * 10000)
    return rounded.toLocaleString() + '원'
  }

  const fmtMan = (v: number) => {
    if (Math.abs(v) < 0.0001) return '0만원'
    if (v === Math.floor(v)) return v.toLocaleString() + '만원'
    return v.toFixed(4).replace(/0+$/, '').replace(/\.$/, '') + '만원'
  }

  return (
    <div className="min-h-screen bg-white py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => { window.location.href = '/?view=finance' }} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          금융 계산기 목록
        </button>

        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">예적금 이자 계산</h1>
          <ShareButtons url="https://moajim.com/?view=finance&sub=savings-interest" />
        </div>

        <PropertyTaxBanner />

        {/* 설명 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <p className="text-gray-700 leading-relaxed">
            예금 및 적금, 예적금이 혼합된 저축상품의 이자 수익을 계산할 수 있습니다.
            적립이 없는 예금인 경우 "월 적금액"을 입력하지 않으시면 됩니다.
          </p>
        </div>

        <div className="space-y-6">
          {/* 예금액 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">예금액</label>
            <div className="relative">
              <input type="number" value={depositAmount || ''} onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="금액 입력" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
            </div>
            {depositAmount > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(depositAmount)}</p>}
          </div>

          {/* 월 적금액 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">월 적금액</label>
            <div className="relative">
              <input type="number" value={monthlyAmount || ''} onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="금액 입력" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
            </div>
            {monthlyAmount > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(monthlyAmount)}</p>}
          </div>

          {/* 기간 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">기간</label>
            <div className="relative">
              <input type="number" value={totalMonths || ''} onChange={(e) => setTotalMonths(Number(e.target.value))}
                className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="총 개월수 입력" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">개월</span>
            </div>
            {totalMonths > 0 && <p className="text-xs text-gray-500 mt-1">= {Math.floor(totalMonths / 12)}년 {totalMonths % 12 > 0 ? `${totalMonths % 12}개월` : ''}</p>}
          </div>

          {/* 연 이자율 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">연 이자율</label>
            <div className="relative">
              <input type="number" step="0.01" value={annualRate || ''} onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg" placeholder="% 입력" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
            </div>
          </div>

          {/* 세율 */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input type="checkbox" checked={showTaxInput} onChange={(e) => { setShowTaxInput(e.target.checked); if (!e.target.checked) setTaxRate(15.4) }}
                className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]" />
              <span className="text-sm font-bold text-gray-900">세율 변경</span>
              <span className="text-xs text-gray-500">(기본 15.4%)</span>
            </label>
            {showTaxInput && (
              <div className="ml-7 relative">
                <input type="number" step="0.1" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">%</span>
              </div>
            )}
          </div>

          {/* 계산 버튼 */}
          <button onClick={handleCalculate} className="w-full py-4 bg-[#F15F5F] text-white rounded-xl font-bold text-lg hover:bg-[#E14E4E] transition-colors">
            이자 계산
          </button>

          {/* 결과 */}
          {result && (
            <div ref={resultRef} className="mt-8 space-y-6">
              <div className="flex justify-end mb-2">
                <CaptureButtons targetRef={resultRef} fileName="moajim-예적금이자-결과" />
              </div>

              {/* 단리 결과 */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50/30 rounded-2xl p-6 border border-red-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">단리</h3>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-1">세후 수령액</p>
                  <p className="text-[28px] sm:text-[36px] font-bold text-[#F15F5F]">{fmt(result.simple.totalReceived)}</p>
                </div>
                <div className="space-y-2 text-sm border-t border-red-200 pt-4">
                  <div className="flex justify-between"><span className="text-gray-600">총 원금</span><span className="font-medium">{fmt(result.simple.totalDeposit)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">세전이자</span><span className="font-medium">{fmt(result.simple.grossInterest)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">이자소득세 ({taxRate}%)</span><span className="font-medium">- {fmt(result.simple.tax)}</span></div>
                  <div className="h-px bg-red-200 my-1" />
                  <div className="flex justify-between font-bold"><span className="text-gray-900">세후이자</span><span className="text-[#F15F5F]">{fmt(result.simple.netInterest)}</span></div>
                  <div className="flex justify-between font-bold"><span className="text-gray-900">세후 수령액</span><span className="text-[#F15F5F]">{fmt(result.simple.totalReceived)}</span></div>
                </div>
              </div>

              {/* 복리 결과 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">복리 (월복리)</h3>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-1">세후 수령액</p>
                  <p className="text-[28px] sm:text-[36px] font-bold text-blue-600">{fmt(result.compound.totalReceived)}</p>
                </div>
                <div className="space-y-2 text-sm border-t border-blue-200 pt-4">
                  <div className="flex justify-between"><span className="text-gray-600">총 원금</span><span className="font-medium">{fmt(result.compound.totalDeposit)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">세전이자</span><span className="font-medium">{fmt(result.compound.grossInterest)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">이자소득세 ({taxRate}%)</span><span className="font-medium">- {fmt(result.compound.tax)}</span></div>
                  <div className="h-px bg-blue-200 my-1" />
                  <div className="flex justify-between font-bold"><span className="text-gray-900">세후이자</span><span className="text-blue-600">{fmt(result.compound.netInterest)}</span></div>
                  <div className="flex justify-between font-bold"><span className="text-gray-900">세후 수령액</span><span className="text-blue-600">{fmt(result.compound.totalReceived)}</span></div>
                </div>
              </div>

              {/* 단리 vs 복리 비교 */}
              <div className="rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">단리 vs 복리 비교</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">단리 세전이자</span><span className="font-medium">{fmt(result.simple.grossInterest)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">복리 세전이자</span><span className="font-medium">{fmt(result.compound.grossInterest)}</span></div>
                  <div className="h-px bg-gray-200 my-1" />
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-900">복리 이자 추가 수익</span>
                    <span className="text-blue-600">+ {fmt(result.compound.grossInterest - result.simple.grossInterest)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 주의사항 */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-3">⚠️ 참고사항</h3>
            <ul className="text-sm text-gray-700 leading-relaxed space-y-1">
              <li>이자소득세 기본세율: 소득세 14% + 지방소득세 1.4% = 15.4%</li>
              <li>비과세 상품은 세율을 0%로 변경하여 계산하세요.</li>
              <li>세금우대 상품은 세율을 9.5%로 변경하여 계산하세요.</li>
              <li>본 계산기는 참고용이며 실제 이자는 금융기관의 약정에 따릅니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
