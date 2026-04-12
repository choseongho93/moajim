import { useState, useRef } from 'react'
import { calculateLoanInterest, type RepaymentMethod, type LoanResult } from '../utils/loanInterest'
import { calculateMortgageLoan, type PropertyCategory, type RegulationRegion, type BuyerType, type DepositRegion, type MortgageLoanResult } from '../utils/mortgageLoan'
import { calculateSavingsInterest, type SavingsResult } from '../utils/savingsInterest'
import { calculateEarlyRepaymentFee, type EarlyRepaymentFeeResult } from '../utils/earlyRepaymentFee'
import { calculateAuctionLoan, type AuctionLoanMode, type AuctionLoanCriterion, type AuctionLoanResult } from '../utils/auctionLoan'
import { calculateLoanRefinance, type RefinanceRepaymentMethod, type RefinanceCompareResult } from '../utils/loanRefinance'
import { calculateEstimatedIncome, type IncomeType, type RecognizedBasis, type DeclaredBasis, type SubscriberType, type EstimatedIncomeResult } from '../utils/estimatedIncome'
import { calculateJeonseGuarantee, type DiscountType, type JeonseGuaranteeResult, type GuaranteeResult } from '../utils/jeonseGuarantee'
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

  if (initialSubView === 'early-repayment') {
    return <EarlyRepaymentFeeCalculator />
  }

  if (initialSubView === 'loan-refinance') {
    return <LoanRefinanceCalculator />
  }

  if (initialSubView === 'estimated-income') {
    return <EstimatedIncomeCalculator />
  }

  if (initialSubView === 'auction-loan') {
    return <AuctionLoanCalculator />
  }

  if (initialSubView === 'jeonse-guarantee') {
    return <JeonseGuaranteeCalculator />
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

          <button
            onClick={() => navigateTo('early-repayment')}
            className="group text-left p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#F15F5F] transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">💷</span>
              <svg className="w-6 h-6 text-gray-300 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">중도상환수수료 계산기</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              대출 중도상환 시 발생하는 수수료를 계산합니다.
            </p>
          </button>

          <button
            onClick={() => navigateTo('loan-refinance')}
            className="group text-left p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#F15F5F] transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">💱</span>
              <svg className="w-6 h-6 text-gray-300 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">대출 대환 계산기</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              대출 대환 시 변경되는 이자를 비교합니다.
            </p>
          </button>

          <button
            onClick={() => navigateTo('estimated-income')}
            className="group text-left p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#F15F5F] transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">💳</span>
              <svg className="w-6 h-6 text-gray-300 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">추정소득 계산기</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              인정소득·신고소득 기준으로 추정 연소득을 계산합니다.
            </p>
          </button>

          <button
            onClick={() => navigateTo('auction-loan')}
            className="group text-left p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#F15F5F] transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🏦</span>
              <svg className="w-6 h-6 text-gray-300 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">경락잔금대출 한도</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              경매 낙찰 시 금융권별 대출 가능 한도를 계산합니다.
            </p>
          </button>

          <button
            onClick={() => navigateTo('jeonse-guarantee')}
            className="group text-left p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#F15F5F] transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">☂️</span>
              <svg className="w-6 h-6 text-gray-300 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">전세보증보험 계산기</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              전세금반환보증보험 가입 가능 여부와 보증료를 계산합니다.
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

// 중도상환수수료 계산기
function EarlyRepaymentFeeCalculator() {
  const resultRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'explanation' | 'rates' | 'exemption'>('explanation')

  const [repaymentAmount, setRepaymentAmount] = useState<number>(0)
  const [feeRate, setFeeRate] = useState<number>(1.4)
  const [loanMonths, setLoanMonths] = useState<number>(0)
  const [remainingMonths, setRemainingMonths] = useState<number>(0)

  const [result, setResult] = useState<EarlyRepaymentFeeResult | null>(null)

  const handleCalculate = () => {
    if (repaymentAmount <= 0 || feeRate <= 0 || loanMonths <= 0 || remainingMonths <= 0) return
    if (remainingMonths > loanMonths) return
    setResult(calculateEarlyRepaymentFee({
      repaymentAmount,
      feeRate,
      loanMonths,
      remainingMonths,
    }))
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">중도상환수수료 계산</h1>
          <ShareButtons url="https://moajim.com/?view=finance&sub=early-repayment" />
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
            onClick={() => setActiveTab('rates')}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'rates'
                ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            요율
          </button>
          <button
            onClick={() => setActiveTab('exemption')}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'exemption'
                ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            면제 요건
          </button>
        </div>

        {/* 설명 탭 */}
        {activeTab === 'explanation' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">
                대출을 본래 정해진 기일보다 일찍 상환하는 경우 금융기관에서 고객에게 물리는 벌칙성 수수료입니다.
                잔존 기간, 상환 금액, 요율에 따라 계산됩니다.
              </p>
              <div className="mt-4 bg-white/70 rounded-lg p-4">
                <p className="text-sm font-bold text-gray-900 mb-1">계산 공식</p>
                <p className="text-sm text-gray-700">
                  중도상환수수료 = 중도상환원금 × 수수료율 × (잔존기간 ÷ 대출기간)
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                금융당국의 정책에 따라 2025년 1월 13일부터 중도상환 수수료의 대대적인 인하가 있었습니다.
                "요율" 탭을 참고해주세요.
              </p>
            </div>

            {/* 입력 폼 */}
            <div className="space-y-6">
              {/* 상환금액 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  상환금액
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={repaymentAmount || ''}
                    onChange={(e) => setRepaymentAmount(Number(e.target.value))}
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                    placeholder="금액 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    만원
                  </span>
                </div>
                {repaymentAmount > 0 && (
                  <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(repaymentAmount)}</p>
                )}
              </div>

              {/* 수수료율 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  수수료율
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={feeRate || ''}
                    onChange={(e) => setFeeRate(Number(e.target.value))}
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                    placeholder="% 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    %
                  </span>
                </div>
              </div>

              {/* 대출기간 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  대출기간
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={loanMonths || ''}
                    onChange={(e) => setLoanMonths(Number(e.target.value))}
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                    placeholder="총 개월수 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    개월
                  </span>
                </div>
                {loanMonths > 0 && (
                  <p className="text-xs text-gray-500 mt-1">= {Math.floor(loanMonths / 12)}년 {loanMonths % 12 > 0 ? `${loanMonths % 12}개월` : ''}</p>
                )}
              </div>

              {/* 잔존기간 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  잔존기간
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={remainingMonths || ''}
                    onChange={(e) => setRemainingMonths(Number(e.target.value))}
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                    placeholder="총 개월수 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    개월
                  </span>
                </div>
                {remainingMonths > 0 && (
                  <p className="text-xs text-gray-500 mt-1">= {Math.floor(remainingMonths / 12)}년 {remainingMonths % 12 > 0 ? `${remainingMonths % 12}개월` : ''}</p>
                )}
              </div>

              {/* 계산 버튼 */}
              <button
                onClick={handleCalculate}
                className="w-full py-4 bg-[#F15F5F] text-white rounded-xl font-bold hover:bg-[#E14E4E] transition-colors"
              >
                중도상환수수료 계산
              </button>

              {/* 결과 */}
              {result && (
                <div className="mt-8 space-y-4">
                  <div className="flex justify-end mb-2">
                    <CaptureButtons targetRef={resultRef} fileName="moajim-중도상환수수료-결과" />
                  </div>
                  <div ref={resultRef} className="bg-gradient-to-br from-red-50 to-pink-50/30 rounded-2xl p-6 border border-red-100">
                    <div className="text-center mb-6">
                      <p className="text-sm text-gray-600 mb-2">중도상환수수료</p>
                      <p className="text-4xl font-bold text-[#F15F5F]">
                        {result.fee.toLocaleString()}만원
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        ({result.feeWon.toLocaleString()}원)
                      </p>
                    </div>

                    <div className="space-y-3 border-t border-red-200 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">중도상환 원금</span>
                        <span className="font-medium">{repaymentAmount.toLocaleString()}만원</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">수수료율</span>
                        <span className="font-medium">{feeRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">대출기간</span>
                        <span className="font-medium">{loanMonths}개월</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">잔존기간</span>
                        <span className="font-medium">{remainingMonths}개월</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold border-t border-red-200 pt-3">
                        <span className="text-gray-900">실질 수수료율</span>
                        <span className="text-[#F15F5F]">{result.effectiveRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 주의사항 */}
              <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">⚠️ 주의사항</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  본 계산기는 참고용이며, 실제 수수료는 금융기관의 약정 내용에 따라 다를 수 있습니다.
                  정확한 수수료는 해당 금융기관에 문의하시기 바랍니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 요율 탭 */}
        {activeTab === 'rates' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                중도상환수수료율은 일반적으로 0.1% ~ 1.5% 사이입니다.
                금융기관 및 금융상품마다 다르며, 중도상환수수료가 없는 경우도 있습니다.
                아래는 특정 대형 시중은행의 예시입니다. 은행별 요율을 정확히 조회하는 것을 추천드립니다.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-white/70">
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border border-blue-200">구분 (대출일 기준)</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700 border border-blue-200">2025.1.12 이전</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700 border border-blue-200">2025.1.13 이후</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-900 border border-blue-200">주택담보대출</td>
                      <td className="px-4 py-3 text-center text-gray-700 border border-blue-200">
                        <p>변동금리: 1.20%</p>
                        <p>그 외: 1.40%</p>
                      </td>
                      <td className="px-4 py-3 text-center text-[#F15F5F] font-medium border border-blue-200">0.58%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-900 border border-blue-200">신용대출</td>
                      <td className="px-4 py-3 text-center text-gray-700 border border-blue-200">
                        <p>변동금리: 0.60%</p>
                        <p>그 외: 0.70%</p>
                      </td>
                      <td className="px-4 py-3 text-center text-[#F15F5F] font-medium border border-blue-200">0.02%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-900 border border-blue-200">기타대출</td>
                      <td className="px-4 py-3 text-center text-gray-700 border border-blue-200">
                        <p>변동금리: 0.60%</p>
                        <p>그 외: 0.70%</p>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700 border border-blue-200">
                        <p>변동금리: 0.59%</p>
                        <p>그 외: 0.79%</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 면제 요건 탭 */}
        {activeTab === 'exemption' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed">
              대출 실행 후 <span className="font-bold">3년</span>이 지나면 중도상환수수료가 면제되는 경우가 많습니다.
              또한 연간 대출총액의 <span className="font-bold">10% ~ 20%</span> 이내 상환하는 경우엔
              중도상환 수수료가 면제되기도 하니 금융기관에 문의하시거나 상품설명서, 약정서 등을 참고하시기 바랍니다.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// 경락잔금대출 한도 계산기
function AuctionLoanCalculator() {
  const resultRef = useRef<HTMLDivElement>(null)

  const [mode, setMode] = useState<AuctionLoanMode>('first-tier')
  const [appraisalValue, setAppraisalValue] = useState<number>(0)
  const [winningBid, setWinningBid] = useState<number>(0)
  const [marketPrice, setMarketPrice] = useState<number>(0)

  // 자체 기준
  const [winningBidBasis, setWinningBidBasis] = useState<AuctionLoanCriterion>({ enabled: true, rate: 90 })
  const [appraisalBasis, setAppraisalBasis] = useState<AuctionLoanCriterion>({ enabled: true, rate: 80 })
  const [marketPriceBasis, setMarketPriceBasis] = useState<AuctionLoanCriterion>({ enabled: true, rate: 80 })
  const [winningBidRatioBasis, setWinningBidRatioBasis] = useState<AuctionLoanCriterion>({ enabled: false, rate: 100 })

  const [result, setResult] = useState<AuctionLoanResult | null>(null)

  const handleCalculate = () => {
    if (appraisalValue <= 0 || winningBid <= 0 || marketPrice <= 0) return
    setResult(calculateAuctionLoan({
      appraisalValue,
      winningBid,
      marketPrice,
      mode,
      customCriteria: mode === 'custom' ? {
        winningBidBasis,
        appraisalBasis,
        marketPriceBasis,
        winningBidRatioBasis,
      } : undefined,
    }))
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">경락잔금대출 한도 계산</h1>
          <ShareButtons url="https://moajim.com/?view=finance&sub=auction-loan" />
        </div>

        <PropertyTaxBanner />

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <p className="text-gray-700 leading-relaxed">
            주택 등 부동산 경매 낙찰 시 1금융권, 2금융권에서 대출 가능한 한도 예상액을 산출합니다.
            대상 금융기관의 산출 공식을 알고 계신다면 '자체 기준'을 선택해 입력할 수 있습니다.
          </p>
        </div>

        <div className="space-y-6">
          {/* 금융권 선택 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              적용 기준
            </label>
            <div className="flex flex-wrap gap-2">
              {([
                { value: 'first-tier', label: '1금융권' },
                { value: 'second-tier', label: '2금융권' },
                { value: 'custom', label: '자체 기준' },
              ] as const).map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setMode(option.value); setResult(null) }}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    mode === option.value
                      ? 'border-[#F15F5F] bg-red-50 text-[#F15F5F] font-medium'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 자체 기준 테이블 */}
          {mode === 'custom' && (
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">선택</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">적용 기준</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={winningBidBasis.enabled}
                        onChange={(e) => setWinningBidBasis({ ...winningBidBasis, enabled: e.target.checked })}
                        className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">낙찰가 기준</span>
                        <div className="relative ml-auto">
                          <input
                            type="number"
                            value={winningBidBasis.rate || ''}
                            onChange={(e) => setWinningBidBasis({ ...winningBidBasis, rate: Number(e.target.value) })}
                            className="w-20 px-2 py-1 pr-7 rounded border border-gray-300 focus:border-[#F15F5F] focus:outline-none text-right text-sm"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">%</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={appraisalBasis.enabled}
                        onChange={(e) => setAppraisalBasis({ ...appraisalBasis, enabled: e.target.checked })}
                        className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">감정가 기준</span>
                        <div className="relative ml-auto">
                          <input
                            type="number"
                            value={appraisalBasis.rate || ''}
                            onChange={(e) => setAppraisalBasis({ ...appraisalBasis, rate: Number(e.target.value) })}
                            className="w-20 px-2 py-1 pr-7 rounded border border-gray-300 focus:border-[#F15F5F] focus:outline-none text-right text-sm"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">%</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={marketPriceBasis.enabled}
                        onChange={(e) => setMarketPriceBasis({ ...marketPriceBasis, enabled: e.target.checked })}
                        className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">현재시세 기준</span>
                        <div className="relative ml-auto">
                          <input
                            type="number"
                            value={marketPriceBasis.rate || ''}
                            onChange={(e) => setMarketPriceBasis({ ...marketPriceBasis, rate: Number(e.target.value) })}
                            className="w-20 px-2 py-1 pr-7 rounded border border-gray-300 focus:border-[#F15F5F] focus:outline-none text-right text-sm"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">%</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={winningBidRatioBasis.enabled}
                        onChange={(e) => setWinningBidRatioBasis({ ...winningBidRatioBasis, enabled: e.target.checked })}
                        className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">낙찰가 × 낙찰가율 기준</span>
                        <div className="relative ml-auto">
                          <input
                            type="number"
                            value={winningBidRatioBasis.rate || ''}
                            onChange={(e) => setWinningBidRatioBasis({ ...winningBidRatioBasis, rate: Number(e.target.value) })}
                            className="w-20 px-2 py-1 pr-7 rounded border border-gray-300 focus:border-[#F15F5F] focus:outline-none text-right text-sm"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">%</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 감정가 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              감정가
            </label>
            <div className="relative">
              <input
                type="number"
                value={appraisalValue || ''}
                onChange={(e) => setAppraisalValue(Number(e.target.value))}
                className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                placeholder="금액 입력"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                만원
              </span>
            </div>
            {appraisalValue > 0 && (
              <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(appraisalValue)}</p>
            )}
          </div>

          {/* 낙찰가 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              낙찰가
            </label>
            <div className="relative">
              <input
                type="number"
                value={winningBid || ''}
                onChange={(e) => setWinningBid(Number(e.target.value))}
                className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                placeholder="금액 입력"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                만원
              </span>
            </div>
            {winningBid > 0 && (
              <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(winningBid)}</p>
            )}
          </div>

          {/* 현재 시세 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              현재 시세
            </label>
            <div className="relative">
              <input
                type="number"
                value={marketPrice || ''}
                onChange={(e) => setMarketPrice(Number(e.target.value))}
                className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                placeholder="금액 입력"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                만원
              </span>
            </div>
            {marketPrice > 0 && (
              <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(marketPrice)}</p>
            )}
          </div>

          {/* 계산 버튼 */}
          <button
            onClick={handleCalculate}
            className="w-full py-4 bg-[#F15F5F] text-white rounded-xl font-bold hover:bg-[#E14E4E] transition-colors"
          >
            대출 한도 계산
          </button>

          {/* 결과 */}
          {result && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-end mb-2">
                <CaptureButtons targetRef={resultRef} fileName="moajim-경락잔금대출-결과" />
              </div>
              <div ref={resultRef} className="bg-gradient-to-br from-red-50 to-pink-50/30 rounded-2xl p-6 border border-red-100">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 mb-2">
                    예상 대출 한도 ({mode === 'first-tier' ? '1금융권' : mode === 'second-tier' ? '2금융권' : '자체 기준'})
                  </p>
                  <p className="text-4xl font-bold text-[#F15F5F]">
                    {result.loanLimit.toLocaleString()}만원
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ({formatKoreanAmount(result.loanLimit)})
                  </p>
                </div>

                <div className="space-y-3 border-t border-red-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">낙찰가율</span>
                    <span className="font-medium">{result.bidRate}%</span>
                  </div>
                  <div className="border-t border-red-200 pt-3">
                    <p className="text-sm font-bold text-gray-900 mb-2">기준별 산출 금액</p>
                    {result.criteria.map((c, i) => (
                      <div key={i} className={`flex justify-between text-sm py-1.5 ${!c.enabled ? 'opacity-40 line-through' : ''}`}>
                        <span className="text-gray-600">
                          {c.label}
                          <span className="text-xs text-gray-400 ml-1">({c.formula})</span>
                        </span>
                        <span className={`font-medium ${c.amount === result.loanLimit && c.enabled ? 'text-[#F15F5F]' : ''}`}>
                          {c.amount.toLocaleString()}만원
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-red-200 pt-3">
                    <span className="text-gray-900">최소값 (대출 한도)</span>
                    <span className="text-[#F15F5F]">{result.loanLimit.toLocaleString()}만원</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 참고사항 */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-3">⚠️ 참고사항</h3>
            <ul className="text-sm text-gray-700 leading-relaxed space-y-1">
              <li>본 계산기는 보편적으로 적용되는 금융권의 경락잔금대출 상품의 한도 산출 기준을 기반으로 계산합니다.</li>
              <li>실제 한도 산출 방법은 은행마다 차이가 있으며 이보다 더 복잡하니 참고용으로만 사용하시기 바랍니다.</li>
              <li>선순위 채권, 임차인 보증금, DSR 등에 따라 실제 대출 가능 금액은 달라질 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// 추정소득(인정소득, 신고소득) 계산기
function EstimatedIncomeCalculator() {
  const resultRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'explanation' | 'rates'>('explanation')

  const [incomeType, setIncomeType] = useState<IncomeType>('recognized')

  const [recognizedBasis, setRecognizedBasis] = useState<RecognizedBasis>('national-pension')
  const [subscriberType, setSubscriberType] = useState<SubscriberType>('employee')
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0)

  const [declaredBasis, setDeclaredBasis] = useState<DeclaredBasis>('card-usage')
  const [annualAmount, setAnnualAmount] = useState<number>(0)

  const [result, setResult] = useState<EstimatedIncomeResult | null>(null)

  const handleCalculate = () => {
    if (incomeType === 'recognized') {
      if (monthlyPayment <= 0) return
      setResult(calculateEstimatedIncome({
        incomeType,
        recognizedBasis,
        subscriberType,
        monthlyPayment,
      }))
    } else {
      if (annualAmount <= 0) return
      setResult(calculateEstimatedIncome({
        incomeType,
        declaredBasis,
        annualAmount,
      }))
    }
  }

  const fmtWon = (v: number) => (v * 10000).toLocaleString() + '원'

  return (
    <div className="min-h-screen bg-white py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => { window.location.href = '/?view=finance' }} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          금융 계산기 목록
        </button>

        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">추정소득 계산기</h1>
          <ShareButtons url="https://moajim.com/?view=finance&sub=estimated-income" />
        </div>

        <PropertyTaxBanner />

        {/* 탭 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'explanation' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            설명
          </button>
          <button
            onClick={() => setActiveTab('rates')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'rates' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            소득환산률
          </button>
        </div>

        {activeTab === 'explanation' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <p className="text-gray-700 leading-relaxed">
              금융회사에서 DTI, DSR 및 대출 한도 계산 시 사용하는 추정소득을 계산합니다.
              추정소득이란 원천징수영수증 및 소득금액증명원 등 공식적인 소득 증명서류로
              증빙이 불가능한 경우 대안 자료들을 통해 추정한 소득을 의미합니다.
            </p>
          </div>
        )}

        {activeTab === 'rates' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              소득환산률은 전국은행연합회의 "여신심사 선진화를 위한 모범규준"에 따라 적용됩니다.
              모범규준을 해석하는 기준에 따라 적용되는 환산률은 달라질 수 있습니다.
              정확한 추정소득은 거래하시는 은행 영업점에서 확인하여 주시기 바랍니다.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-200">
                    <th className="text-left py-2 pr-4 text-gray-700 font-bold">구분</th>
                    <th className="text-left py-2 pr-4 text-gray-700 font-bold">기준</th>
                    <th className="text-right py-2 text-gray-700 font-bold">환산률</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-blue-100">
                    <td className="py-2 pr-4" rowSpan={2}>인정소득</td>
                    <td className="py-2 pr-4">국민연금 (직장 4.5% / 지역 9%)</td>
                    <td className="text-right py-2">역산</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-2 pr-4">건강보험료 (직장 3.545% / 지역 7.09%)</td>
                    <td className="text-right py-2">역산</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-2 pr-4" rowSpan={4}>신고소득</td>
                    <td className="py-2 pr-4">카드사용액</td>
                    <td className="text-right py-2">60%</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-2 pr-4">이자소득</td>
                    <td className="text-right py-2">4%</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-2 pr-4">배당소득</td>
                    <td className="text-right py-2">4%</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">임대수입</td>
                    <td className="text-right py-2">4%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* 소득 유형 선택 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">소득 유형</label>
            <div className="flex gap-2">
              <button
                onClick={() => { setIncomeType('recognized'); setResult(null) }}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${incomeType === 'recognized' ? 'bg-[#F15F5F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                인정소득
              </button>
              <button
                onClick={() => { setIncomeType('declared'); setResult(null) }}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${incomeType === 'declared' ? 'bg-[#F15F5F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                신고소득
              </button>
            </div>
          </div>

          {incomeType === 'recognized' && (
            <>
              {/* 입증 기준 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">입증 기준</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setRecognizedBasis('national-pension'); setResult(null) }}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${recognizedBasis === 'national-pension' ? 'bg-[#F15F5F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    국민연금
                  </button>
                  <button
                    onClick={() => { setRecognizedBasis('health-insurance'); setResult(null) }}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${recognizedBasis === 'health-insurance' ? 'bg-[#F15F5F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    건강보험료
                  </button>
                </div>
              </div>

              {/* 가입자 유형 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">가입자 유형</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSubscriberType('employee'); setResult(null) }}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${subscriberType === 'employee' ? 'bg-[#F15F5F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    직장가입자
                  </button>
                  <button
                    onClick={() => { setSubscriberType('self-employed'); setResult(null) }}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${subscriberType === 'self-employed' ? 'bg-[#F15F5F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    지역가입자
                  </button>
                </div>
              </div>

              {/* 월 납부액 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  월 납부액
                  <span className="text-xs text-gray-500 font-normal ml-2">평균 3개월치</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={monthlyPayment || ''}
                    onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                    placeholder="금액 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">원</span>
                </div>
                {monthlyPayment > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {monthlyPayment.toLocaleString()}원</p>}
              </div>
            </>
          )}

          {incomeType === 'declared' && (
            <>
              {/* 신고 대상 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">신고 대상</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setDeclaredBasis('card-usage'); setResult(null) }}
                    className={`py-3 rounded-xl text-sm font-bold transition-colors ${declaredBasis === 'card-usage' ? 'bg-[#F15F5F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    카드사용액
                  </button>
                  <button
                    onClick={() => { setDeclaredBasis('interest-income'); setResult(null) }}
                    className={`py-3 rounded-xl text-sm font-bold transition-colors ${declaredBasis === 'interest-income' ? 'bg-[#F15F5F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    이자소득
                  </button>
                  <button
                    onClick={() => { setDeclaredBasis('dividend-income'); setResult(null) }}
                    className={`py-3 rounded-xl text-sm font-bold transition-colors ${declaredBasis === 'dividend-income' ? 'bg-[#F15F5F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    배당소득
                  </button>
                  <button
                    onClick={() => { setDeclaredBasis('rental-income'); setResult(null) }}
                    className={`py-3 rounded-xl text-sm font-bold transition-colors ${declaredBasis === 'rental-income' ? 'bg-[#F15F5F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    임대수입
                  </button>
                </div>
              </div>

              {/* 연간 금액 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  연간 {declaredBasis === 'card-usage' ? '카드사용액' : declaredBasis === 'interest-income' ? '이자소득' : declaredBasis === 'dividend-income' ? '배당소득' : '임대수입'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={annualAmount || ''}
                    onChange={(e) => setAnnualAmount(Number(e.target.value))}
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                    placeholder="금액 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
                </div>
                {annualAmount > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(annualAmount)}</p>}
              </div>
            </>
          )}

          {/* 계산 버튼 */}
          <button onClick={handleCalculate} className="w-full py-4 bg-[#F15F5F] text-white rounded-xl font-bold text-lg hover:bg-[#E14E4E] transition-colors">
            추정소득 계산
          </button>

          {/* 결과 */}
          {result && (
            <div ref={resultRef} className="mt-8 space-y-6">
              <div className="flex justify-end mb-2">
                <CaptureButtons targetRef={resultRef} fileName="moajim-추정소득-결과" />
              </div>

              <div className="bg-gradient-to-br from-red-50 to-pink-50/30 rounded-2xl p-6 border border-red-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">추정소득 결과</h3>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-1">추정 연소득</p>
                  <p className="text-[28px] sm:text-[36px] font-bold text-[#F15F5F]">{fmtWon(result.annualIncome)}</p>
                  {result.annualIncome > 0 && <p className="text-sm text-gray-500 mt-1">= {formatKoreanAmount(result.annualIncome)}</p>}
                </div>
                <div className="space-y-2 text-sm border-t border-red-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">추정 월소득</span>
                    <span className="font-medium">{fmtWon(result.monthlyIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">추정 연소득</span>
                    <span className="font-medium">{fmtWon(result.annualIncome)}</span>
                  </div>
                  <div className="h-px bg-red-200 my-1" />
                  <div className="flex justify-between">
                    <span className="text-gray-600">적용 기준</span>
                    <span className="font-medium">{result.description}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 참고사항 */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-3">참고사항</h3>
            <ul className="text-sm text-gray-700 leading-relaxed space-y-2">
              <li>인정소득 계산 시에는 평균 3개월치의 국민연금·건강보험료 '월 납부액'을 원 단위로 입력해주세요.</li>
              <li>신고소득 계산 시에는 '연간' 카드사용액, 또는 '연간' 이자소득·배당소득·임대수입 등을 입력해주세요.</li>
              <li>이자소득, 배당소득, 임대수입 등은 3개월 이상 1년 미만의 소득이 있는 경우 1년 환산금액으로 입력 가능합니다.</li>
              <li>카드사용액은 직전년도 연말정산용 확인서상의 소득공제금액 또는 대출신청일 현재 직전월기준 최근 1년간 개인신용카드(가족카드 포함) 사용 실적표를 대상으로 합니다.</li>
            </ul>
          </div>

          {/* 주의사항 */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-3">⚠️ 주의사항</h3>
            <ul className="text-sm text-gray-700 leading-relaxed space-y-1">
              <li>모든 대출에 동일한 기준이 적용되는 것이 아니며 은행마다 적용하는 비율이 조금씩 차이가 날 수 있습니다.</li>
              <li>금융회사에 따라 인정하지 않는 소득 항목이 있을 수 있습니다.</li>
              <li>본 계산기는 참고용이며, 정확한 추정소득은 거래하시는 은행 영업점에서 확인하시기 바랍니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// 대출 대환(이자 비교) 계산기
function LoanRefinanceCalculator() {
  const resultRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'explanation' | 'calculator' | 'methods'>('calculator')

  const [origMethod, setOrigMethod] = useState<RefinanceRepaymentMethod>('equal-payment')
  const [origPrincipal, setOrigPrincipal] = useState<number>(0)
  const [origMonths, setOrigMonths] = useState<number>(0)
  const [origRate, setOrigRate] = useState<number>(0)

  const [refiMethod, setRefiMethod] = useState<RefinanceRepaymentMethod>('equal-payment')
  const [refiPrincipal, setRefiPrincipal] = useState<number>(0)
  const [refiMonths, setRefiMonths] = useState<number>(0)
  const [refiRate, setRefiRate] = useState<number>(0)

  const [showOrigSchedule, setShowOrigSchedule] = useState(false)
  const [showRefiSchedule, setShowRefiSchedule] = useState(false)

  const [result, setResult] = useState<RefinanceCompareResult | null>(null)

  const handleCalculate = () => {
    if (origPrincipal <= 0 || origMonths <= 0 || origRate <= 0) return
    if (refiPrincipal <= 0 || refiMonths <= 0 || refiRate <= 0) return
    const r = calculateLoanRefinance(
      { principal: origPrincipal, totalMonths: origMonths, annualRate: origRate, method: origMethod },
      { principal: refiPrincipal, totalMonths: refiMonths, annualRate: refiRate, method: refiMethod },
      origMethod,
      refiMethod,
    )
    setResult(r)
    setShowOrigSchedule(false)
    setShowRefiSchedule(false)
    setTimeout(() => { resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 100)
  }

  const methodOptions: { value: RefinanceRepaymentMethod; label: string }[] = [
    { value: 'bullet', label: '만기일시' },
    { value: 'equal-principal', label: '원금균등' },
    { value: 'equal-payment', label: '원리금균등' },
    { value: 'graduated', label: '체증식' },
  ]

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">대출 대환(이자 비교) 계산</h1>
          <ShareButtons url="https://moajim.com/?view=finance&sub=loan-refinance" />
        </div>

        <PropertyTaxBanner />

        {/* 탭 */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'explanation' ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            설명
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'calculator' ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            대환 이자 비교
          </button>
          <button
            onClick={() => setActiveTab('methods')}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'methods' ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            상환 방법
          </button>
        </div>

        {/* 설명 탭 */}
        {activeTab === 'explanation' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed">
              금리가 높은 대출의 일부 또는 전부를 금리가 낮은 대출로 대환하는 경우 변경되는 이자를 계산합니다.
              대환 대출 기간에 따라서 연간 납부하는 이자액은 낮아지지만 전체 기간 동안 납부하는 총 이자는 더 높아질 수 있습니다.
              이를 비교해서 확인해보세요.
            </p>
            <p className="text-sm text-gray-500 mt-3">
              ※ 기존 대출보다 작은 금액을 입력하면 일부만 대환하는 것으로 봅니다.
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

        {/* 대환 이자 비교 탭 */}
        {activeTab === 'calculator' && (
          <div className="space-y-8">
            {/* 기존 대출 */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">기존 대출</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">상환 방식</label>
                  <div className="flex flex-wrap gap-2">
                    {methodOptions.map((opt) => (
                      <button key={opt.value} onClick={() => { setOrigMethod(opt.value); setResult(null) }}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          origMethod === opt.value ? 'border-[#F15F5F] bg-red-50 text-[#F15F5F] font-medium' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}>{opt.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">대출 금액</label>
                  <div className="relative">
                    <input type="number" value={origPrincipal || ''} onChange={(e) => setOrigPrincipal(Number(e.target.value))}
                      className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg bg-white" placeholder="금액 입력" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
                  </div>
                  {origPrincipal > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(origPrincipal)}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">대출 기간</label>
                  <div className="relative">
                    <input type="number" value={origMonths || ''} onChange={(e) => setOrigMonths(Number(e.target.value))}
                      className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg bg-white" placeholder="총 개월수 입력" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">개월</span>
                  </div>
                  {origMonths > 0 && <p className="text-xs text-gray-500 mt-1">= {Math.floor(origMonths / 12)}년 {origMonths % 12 > 0 ? `${origMonths % 12}개월` : ''}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">연 이자율</label>
                  <div className="relative">
                    <input type="number" step="0.01" value={origRate || ''} onChange={(e) => setOrigRate(Number(e.target.value))}
                      className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg bg-white" placeholder="% 입력" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 변경(대환) 대출 */}
            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">변경(대환) 대출</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">상환 방식</label>
                  <div className="flex flex-wrap gap-2">
                    {methodOptions.map((opt) => (
                      <button key={opt.value} onClick={() => { setRefiMethod(opt.value); setResult(null) }}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          refiMethod === opt.value ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}>{opt.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">대출 금액</label>
                  <div className="relative">
                    <input type="number" value={refiPrincipal || ''} onChange={(e) => setRefiPrincipal(Number(e.target.value))}
                      className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg bg-white" placeholder="금액 입력" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
                  </div>
                  {refiPrincipal > 0 && <p className="text-xs text-blue-600 mt-1">= {formatKoreanAmount(refiPrincipal)}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">대출 기간</label>
                  <div className="relative">
                    <input type="number" value={refiMonths || ''} onChange={(e) => setRefiMonths(Number(e.target.value))}
                      className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg bg-white" placeholder="총 개월수 입력" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">개월</span>
                  </div>
                  {refiMonths > 0 && <p className="text-xs text-gray-500 mt-1">= {Math.floor(refiMonths / 12)}년 {refiMonths % 12 > 0 ? `${refiMonths % 12}개월` : ''}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">연 이자율</label>
                  <div className="relative">
                    <input type="number" step="0.01" value={refiRate || ''} onChange={(e) => setRefiRate(Number(e.target.value))}
                      className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg bg-white" placeholder="% 입력" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 계산 버튼 */}
            <button onClick={handleCalculate}
              className="w-full py-4 bg-[#F15F5F] text-white rounded-xl font-bold hover:bg-[#E14E4E] transition-colors">
              대환 이자 비교
            </button>

            {/* 결과 */}
            {result && (
              <div ref={resultRef} className="mt-8 space-y-6">
                <div className="flex justify-end mb-2">
                  <CaptureButtons targetRef={resultRef} fileName="moajim-대출대환-결과" />
                </div>

                {result.isPartial && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                    기존 대출({origPrincipal.toLocaleString()}만원) 중 {refiPrincipal.toLocaleString()}만원만 대환하고,
                    나머지 {(origPrincipal - refiPrincipal).toLocaleString()}만원은 기존 조건으로 유지됩니다.
                  </div>
                )}

                {/* 비교 요약 */}
                <div className="bg-gradient-to-br from-red-50 to-pink-50/30 rounded-2xl p-6 border border-red-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">이자 비교 결과</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">기존 대출 총 이자</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{result.original.totalInterest.toLocaleString()}<span className="text-sm font-normal">만원</span></p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">대환 후 총 이자</p>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">{result.totalAfter.totalInterest.toLocaleString()}<span className="text-sm font-normal">만원</span></p>
                    </div>
                  </div>
                  <div className="text-center py-4 border-t border-red-200">
                    <p className="text-sm text-gray-600 mb-1">총 이자 차이</p>
                    <p className={`text-3xl font-bold ${result.interestDiff <= 0 ? 'text-blue-600' : 'text-[#F15F5F]'}`}>
                      {result.interestDiff <= 0 ? '' : '+'}{result.interestDiff.toLocaleString()}만원
                    </p>
                    <p className="text-xs text-gray-500 mt-1">({result.interestDiff <= 0 ? '절약' : '증가'})</p>
                  </div>
                  <div className="border-t border-red-200 pt-4 mt-4">
                    <p className="text-sm text-gray-600 mb-2 text-center">연간 이자 비교 (첫 해 기준)</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">기존</p>
                        <p className="text-lg font-bold text-gray-900">{result.original.annualInterest.toLocaleString()}<span className="text-xs font-normal">만원</span></p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">대환 후</p>
                        <p className="text-lg font-bold text-blue-600">{result.totalAfter.annualInterest.toLocaleString()}<span className="text-xs font-normal">만원</span></p>
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <p className={`text-sm font-bold ${result.annualInterestDiff <= 0 ? 'text-blue-600' : 'text-[#F15F5F]'}`}>
                        연간 {result.annualInterestDiff <= 0 ? '' : '+'}{result.annualInterestDiff.toLocaleString()}만원
                        ({result.annualInterestDiff <= 0 ? '절약' : '증가'})
                      </p>
                    </div>
                  </div>
                </div>

                {/* 기존 대출 상세 */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900">기존 대출 상세</h3>
                  </div>
                  <div className="p-6 space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">대출 원금</span><span className="font-medium">{origPrincipal.toLocaleString()}만원</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">대출 기간</span><span className="font-medium">{origMonths}개월 ({Math.floor(origMonths / 12)}년{origMonths % 12 > 0 ? ` ${origMonths % 12}개월` : ''})</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">연 이자율</span><span className="font-medium">{origRate}%</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">총 상환금</span><span className="font-medium">{result.original.totalPayment.toLocaleString()}만원</span></div>
                    <div className="flex justify-between font-bold border-t border-gray-200 pt-3"><span className="text-gray-900">총 이자</span><span className="text-[#F15F5F]">{result.original.totalInterest.toLocaleString()}만원</span></div>
                  </div>
                  <button onClick={() => setShowOrigSchedule(!showOrigSchedule)}
                    className="w-full flex items-center justify-between px-6 py-4 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors border-t border-gray-200">
                    <span>월별 상환 내역</span>
                    <svg className={`w-5 h-5 text-gray-500 transition-transform ${showOrigSchedule ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showOrigSchedule && (
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
                          {result.original.schedule.map((row) => (
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

                {/* 대환 대출 상세 */}
                <div className="bg-white border border-blue-200 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
                    <h3 className="font-bold text-gray-900">변경(대환) 대출 상세</h3>
                  </div>
                  <div className="p-6 space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">대출 원금</span><span className="font-medium">{refiPrincipal.toLocaleString()}만원</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">대출 기간</span><span className="font-medium">{refiMonths}개월 ({Math.floor(refiMonths / 12)}년{refiMonths % 12 > 0 ? ` ${refiMonths % 12}개월` : ''})</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">연 이자율</span><span className="font-medium">{refiRate}%</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">총 상환금</span><span className="font-medium">{result.refinanced.totalPayment.toLocaleString()}만원</span></div>
                    <div className="flex justify-between font-bold border-t border-blue-200 pt-3"><span className="text-gray-900">총 이자</span><span className="text-blue-600">{result.refinanced.totalInterest.toLocaleString()}만원</span></div>
                    {result.isPartial && result.remaining && (
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <p className="text-xs text-gray-500 mb-2">기존 대출 잔여분 ({(origPrincipal - refiPrincipal).toLocaleString()}만원)</p>
                        <div className="flex justify-between"><span className="text-gray-600">잔여분 총 이자</span><span className="font-medium">{result.remaining.totalInterest.toLocaleString()}만원</span></div>
                      </div>
                    )}
                  </div>
                  <button onClick={() => setShowRefiSchedule(!showRefiSchedule)}
                    className="w-full flex items-center justify-between px-6 py-4 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors border-t border-blue-200">
                    <span>월별 상환 내역</span>
                    <svg className={`w-5 h-5 text-gray-500 transition-transform ${showRefiSchedule ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showRefiSchedule && (
                    <div className="overflow-x-auto border-t border-blue-200">
                      <table className="w-full text-sm">
                        <thead className="bg-blue-50">
                          <tr>
                            <th className="px-4 py-3 text-center font-medium text-gray-700">회차</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">납입원금</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">이자</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">월상환금</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">잔금</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {result.refinanced.schedule.map((row) => (
                            <tr key={row.month} className="hover:bg-gray-50">
                              <td className="px-4 py-2.5 text-center text-gray-600">{row.month}</td>
                              <td className="px-4 py-2.5 text-right">{row.principalPayment.toLocaleString()}</td>
                              <td className="px-4 py-2.5 text-right text-blue-600">{row.interest.toLocaleString()}</td>
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
              <ul className="text-sm text-gray-700 leading-relaxed space-y-2">
                <li>정해진 상환 계획과 다르게 원금을 중도에 상환하실 경우 은행에서는 일반적으로 중도상환수수료라는 일종의 위약금을 부과합니다. 중도상환수수료에 따라서 대환에 따른 이자 감소 효과가 일부 상쇄될 수 있습니다.</li>
                <li>대환 대출 기간이 기존보다 길 경우, 연간 이자는 줄어들더라도 전체 기간의 총 이자는 더 높아질 수 있으니 유의하세요.</li>
                <li>본 계산기는 참고용이며, 실제 대출 조건은 금융기관에 따라 다를 수 있습니다.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 전세금반환보증보험 계산기
function JeonseGuaranteeCalculator() {
  const resultRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'explanation' | 'products'>('explanation')

  const [deposit, setDeposit] = useState<number>(0)
  const [marketPrice, setMarketPrice] = useState<number>(0)
  const [priorClaims, setPriorClaims] = useState<number>(0)
  const [applicationDate, setApplicationDate] = useState('')
  const [contractStart, setContractStart] = useState('')
  const [contractEnd, setContractEnd] = useState('')
  const [discountType, setDiscountType] = useState<DiscountType>('none')

  const [result, setResult] = useState<JeonseGuaranteeResult | null>(null)

  const isValidDate = (s: string) => /^\d{8}$/.test(s)

  const handleCalculate = () => {
    if (deposit <= 0 || marketPrice <= 0) return
    if (!isValidDate(applicationDate) || !isValidDate(contractStart) || !isValidDate(contractEnd)) return
    setResult(calculateJeonseGuarantee({
      deposit,
      marketPrice,
      priorClaims,
      applicationDate,
      contractStart,
      contractEnd,
      discountType,
    }))
  }

  const fmtWon = (v: number) => v.toLocaleString() + '원'

  const renderResultCard = (r: GuaranteeResult) => (
    <div className={`rounded-2xl p-6 border ${r.eligible ? 'bg-gradient-to-br from-green-50 to-emerald-50/30 border-green-200' : 'bg-gradient-to-br from-gray-50 to-gray-100/30 border-gray-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-gray-900">{r.institution}</h3>
        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${r.eligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {r.eligible ? '가입 가능' : '가입 불가'}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-3">{r.productName}</p>

      {r.eligible ? (
        <>
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-1">예상 보증료</p>
            <p className="text-[24px] sm:text-[30px] font-bold text-[#F15F5F]">{fmtWon(r.guaranteeFee)}</p>
          </div>
          <div className="space-y-2 text-sm border-t border-gray-200 pt-3">
            <div className="flex justify-between"><span className="text-gray-600">보증금액</span><span className="font-medium">{formatKoreanAmount(r.guaranteeAmount)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">보증일수</span><span className="font-medium">{r.guaranteeDays.toLocaleString()}일</span></div>
            <div className="flex justify-between"><span className="text-gray-600">기본 보증료율</span><span className="font-medium">연 {r.baseRate}%</span></div>
            {r.discountRate !== r.baseRate && (
              <div className="flex justify-between"><span className="text-gray-600">우대 적용 보증료율</span><span className="font-medium text-blue-600">연 {r.discountRate}%</span></div>
            )}
            <div className="flex justify-between"><span className="text-gray-600">부채비율</span><span className="font-medium">{r.debtRatio.toFixed(1)}% / {r.maxDebtRatio}%</span></div>
          </div>
        </>
      ) : (
        <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
          {r.reason}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-white py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => { window.location.href = '/?view=finance' }} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          금융 계산기 목록
        </button>

        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">전세보증보험 계산기</h1>
          <ShareButtons url="https://moajim.com/?view=finance&sub=jeonse-guarantee" />
        </div>

        <PropertyTaxBanner />

        {/* 탭 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'explanation' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            설명
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            전세금반환보증 상품
          </button>
        </div>

        {activeTab === 'explanation' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <p className="text-gray-700 leading-relaxed">
              전세금반환보증보험은 임대인이 임차인의 보증금을 돌려주지 못하는 상황에 보증 기관이 이를 대신 돌려주는 상품으로,
              전세사기 피해를 방지하기 위한 안전장치입니다. 보증 기관별로 보험 가능 여부를 확인하고 보증료를 계산합니다.
            </p>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              전세금반환보증은 전세보증보험, 전세보증금반환보증 등 다양한 이름으로 불립니다.
              대부분 아래 3개 기관의 상품 중 하나를 선택하여 가입합니다.
            </p>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <p className="font-bold text-gray-900 text-sm">HUG (주택도시보증공사)</p>
                <p className="text-xs text-gray-600 mt-1">전세보증금반환보증 | 보증료율 연 0.115% | 우대 시 연 0.092%</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-bold text-gray-900 text-sm">HF (한국주택금융공사)</p>
                <p className="text-xs text-gray-600 mt-1">전세지킴보증 (전세보증금반환보증) | 보증료율 연 0.128% | 우대 시 연 0.102%</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-bold text-gray-900 text-sm">SGI (서울보증)</p>
                <p className="text-xs text-gray-600 mt-1">전세금보장신용보험 | 보증료율 연 0.183%</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* 보증료 우대 대상 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">보증료 우대대상</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                ['none', '해당없음'],
                ['newlywed', '신혼부부'],
                ['multi-child', '다자녀'],
                ['single-parent', '한부모가정'],
                ['disabled', '장애인'],
                ['basic-livelihood', '기초수급자'],
                ['elderly', '만65세이상'],
              ] as [DiscountType, string][]).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => { setDiscountType(value); setResult(null) }}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-colors ${discountType === value ? 'bg-[#F15F5F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 전세보증금 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">전세보증금</label>
            <div className="relative">
              <input
                type="number"
                value={deposit || ''}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                placeholder="금액 입력"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
            </div>
            {deposit > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(deposit)}</p>}
          </div>

          {/* 매매 시세 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">매매 시세</label>
            <div className="relative">
              <input
                type="number"
                value={marketPrice || ''}
                onChange={(e) => setMarketPrice(Number(e.target.value))}
                className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                placeholder="금액 입력"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
            </div>
            {marketPrice > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(marketPrice)}</p>}
          </div>

          {/* 선순위채권 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">선순위채권</label>
            <div className="relative">
              <input
                type="number"
                value={priorClaims || ''}
                onChange={(e) => setPriorClaims(Number(e.target.value))}
                className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                placeholder="금액 입력"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
            </div>
            {priorClaims > 0 && <p className="text-xs text-[#F15F5F] mt-1">= {formatKoreanAmount(priorClaims)}</p>}
          </div>

          {/* 날짜 입력 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">신청일자</label>
              <input
                type="text"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value.replace(/\D/g, '').slice(0, 8))}
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                placeholder="20260101"
                maxLength={8}
              />
              {applicationDate.length === 8 && (
                <p className="text-xs text-gray-500 mt-1">{applicationDate.substring(0, 4)}.{applicationDate.substring(4, 6)}.{applicationDate.substring(6, 8)}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">계약시작</label>
              <input
                type="text"
                value={contractStart}
                onChange={(e) => setContractStart(e.target.value.replace(/\D/g, '').slice(0, 8))}
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                placeholder="20260101"
                maxLength={8}
              />
              {contractStart.length === 8 && (
                <p className="text-xs text-gray-500 mt-1">{contractStart.substring(0, 4)}.{contractStart.substring(4, 6)}.{contractStart.substring(6, 8)}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">계약종료</label>
              <input
                type="text"
                value={contractEnd}
                onChange={(e) => setContractEnd(e.target.value.replace(/\D/g, '').slice(0, 8))}
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                placeholder="20280101"
                maxLength={8}
              />
              {contractEnd.length === 8 && (
                <p className="text-xs text-gray-500 mt-1">{contractEnd.substring(0, 4)}.{contractEnd.substring(4, 6)}.{contractEnd.substring(6, 8)}</p>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 -mt-4">숫자만 입력 (예: 20260101)</p>

          {/* 계산 버튼 */}
          <button onClick={handleCalculate} className="w-full py-4 bg-[#F15F5F] text-white rounded-xl font-bold text-lg hover:bg-[#E14E4E] transition-colors">
            보증료 계산
          </button>

          {/* 결과 */}
          {result && (
            <div ref={resultRef} className="mt-8 space-y-4">
              <div className="flex justify-end mb-2">
                <CaptureButtons targetRef={resultRef} fileName="moajim-전세보증보험-결과" />
              </div>

              {/* 부채비율 요약 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-2xl p-5 border border-blue-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">부채비율</span>
                  <span className={`text-lg font-bold ${result.debtRatio <= 100 ? 'text-blue-600' : 'text-red-600'}`}>
                    {result.debtRatio.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">(선순위채권 + 전세보증금) / 매매시세 × 100</p>
              </div>

              {renderResultCard(result.hug)}
              {renderResultCard(result.hf)}
              {renderResultCard(result.sgi)}
            </div>
          )}

          {/* 참고사항 */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-3">참고사항</h3>
            <ul className="text-sm text-gray-700 leading-relaxed space-y-2">
              <li>본 계산기가 실제 보증 가능 여부나 금액을 보장하진 않습니다. 최소한의 사실관계로 각 보증 상품의 가입 여부 및 한도를 추정해드리는 것입니다.</li>
              <li>실제 보증 조건엔 수많은 세부 조건이 있으며 보증 여부 및 금액을 파악하시기 위해선 심사를 받아보셔야 합니다.</li>
              <li>보증기관에 따라 일시적으로 보증료를 달리 하거나 특례 할인 등이 이루어지는 경우가 있습니다. 각 보증기관 홈페이지에서 현황을 확인해보세요.</li>
            </ul>
          </div>

          {/* 주의사항 */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-3">⚠️ 주의사항</h3>
            <ul className="text-sm text-gray-700 leading-relaxed space-y-1">
              <li>부채비율은 (선순위채권 + 전세보증금) / 매매시세로 계산되며, 100%를 초과하면 가입이 제한됩니다.</li>
              <li>매매 시세는 KB시세, 한국부동산원 시세 등 공신력 있는 시세를 기준으로 입력해주세요.</li>
              <li>보증료율은 변경될 수 있으며, 정확한 보증료는 각 보증기관에서 확인하시기 바랍니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
