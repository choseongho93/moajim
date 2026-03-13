import { useState } from 'react'

type ContractType = 'sale' | 'jeonse' | 'monthly'
type PropertyType = 'house' | 'officetel' | 'saleLot' | 'etc'

interface BrokerageResult {
  transactionAmount: number
  rate: number
  fee: number
  vat: number
  total: number
  rateLabel: string
  limit: number | null
}

interface ToolsPageProps {
  initialSubView?: string
}

export default function ToolsPage({ initialSubView }: ToolsPageProps) {
  if (initialSubView === 'brokerage-fee') {
    return <BrokerageFeeCalculator />
  }

  return <ToolsList />
}

// 부동산 도구 목록
function ToolsList() {
  const navigateTo = (sub: string) => {
    window.location.href = `/?view=tools&sub=${sub}`
  }

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-[42px] font-bold text-gray-900 mb-2 sm:mb-3">
            부동산 도구
          </h1>
          <p className="text-sm sm:text-base md:text-[17px] text-gray-600">
            부동산 거래에 필요한 각종 비용을 계산하세요
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <button
            onClick={() => navigateTo('brokerage-fee')}
            className="group text-left p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#F15F5F] transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🏠</span>
              <svg className="w-6 h-6 text-gray-300 group-hover:text-[#F15F5F] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">중개보수 계산기</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              부동산 매매·임대차 계약 시 공인중개사에 지불하는 중개보수를 계산합니다.
            </p>
          </button>

          <div className="text-left p-6 bg-gray-50 rounded-2xl border-2 border-gray-200 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🔄</span>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-medium">준비중</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">전월세 전환 계산기</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              전세와 월세 간 전환 시 적정 보증금·월세를 계산합니다.
            </p>
          </div>

          <div className="text-left p-6 bg-gray-50 rounded-2xl border-2 border-gray-200 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🏦</span>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-medium">준비중</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">대출이자 계산기</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              주택담보대출 원리금 상환액을 계산합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 중개보수 계산기
function BrokerageFeeCalculator() {
  const [activeTab, setActiveTab] = useState<'explanation' | 'calculator' | 'regionalRate' | 'rateTable'>('calculator')
  const [contractType, setContractType] = useState<ContractType>('sale')
  const [propertyType, setPropertyType] = useState<PropertyType>('house')
  const [amount, setAmount] = useState<number>(0)
  const [deposit, setDeposit] = useState<number>(0)
  const [monthlyRent, setMonthlyRent] = useState<number>(0)
  const [customRate, setCustomRate] = useState(false)
  const [customRateValue, setCustomRateValue] = useState<number>(0)
  const [includeVat, setIncludeVat] = useState(false)
  const [result, setResult] = useState<BrokerageResult | null>(null)

  // 주택 매매 요율표
  const getHouseSaleRate = (amt: number): { rate: number; limit: number | null; label: string } => {
    if (amt < 5000) return { rate: 0.6, limit: 25, label: '0.6% (한도 25만원)' }
    if (amt < 20000) return { rate: 0.5, limit: 80, label: '0.5% (한도 80만원)' }
    if (amt < 90000) return { rate: 0.4, limit: null, label: '0.4%' }
    if (amt < 120000) return { rate: 0.5, limit: null, label: '0.5%' }
    if (amt < 150000) return { rate: 0.6, limit: null, label: '0.6%' }
    return { rate: 0.7, limit: null, label: '0.7%' }
  }

  // 주택 임대차 요율표
  const getHouseRentRate = (amt: number): { rate: number; limit: number | null; label: string } => {
    if (amt < 5000) return { rate: 0.5, limit: 20, label: '0.5% (한도 20만원)' }
    if (amt < 10000) return { rate: 0.4, limit: 30, label: '0.4% (한도 30만원)' }
    if (amt < 60000) return { rate: 0.3, limit: null, label: '0.3%' }
    if (amt < 120000) return { rate: 0.4, limit: null, label: '0.4%' }
    if (amt < 150000) return { rate: 0.5, limit: null, label: '0.5%' }
    return { rate: 0.6, limit: null, label: '0.6%' }
  }

  const getTransactionAmount = (): number => {
    if (contractType === 'monthly') {
      const calc100 = deposit + monthlyRent * 100
      if (calc100 < 5000) return calc100
      return deposit + monthlyRent * 70
    }
    if (contractType === 'jeonse') return deposit
    return amount
  }

  const handleCalculate = () => {
    const txAmt = getTransactionAmount()
    let rate: number
    let limit: number | null = null
    let rateLabel: string

    if (customRate) {
      rate = customRateValue
      rateLabel = `${customRateValue}% (직접 입력)`
    } else if (propertyType === 'house') {
      if (contractType === 'sale') {
        const r = getHouseSaleRate(txAmt)
        rate = r.rate; limit = r.limit; rateLabel = r.label
      } else {
        const r = getHouseRentRate(txAmt)
        rate = r.rate; limit = r.limit; rateLabel = r.label
      }
    } else if (propertyType === 'officetel') {
      if (contractType === 'sale') {
        rate = 0.5; rateLabel = '0.5%'
      } else {
        rate = 0.4; rateLabel = '0.4%'
      }
    } else if (propertyType === 'saleLot') {
      const r = getHouseSaleRate(txAmt)
      rate = r.rate; limit = r.limit; rateLabel = r.label
    } else {
      rate = 0.9; rateLabel = '0.9% 이내 협의'
    }

    let fee = Math.floor(txAmt * (rate / 100))
    if (limit !== null && fee > limit) fee = limit

    const vat = includeVat ? Math.floor(fee * 0.1) : 0
    const total = fee + vat

    setResult({
      transactionAmount: txAmt,
      rate,
      fee,
      vat,
      total,
      rateLabel,
      limit,
    })
  }

  const tabClass = (tab: string, current: string) =>
    `px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
      tab === current
        ? 'text-[#F15F5F] border-b-2 border-[#F15F5F]'
        : 'text-gray-500 hover:text-gray-700'
    }`

  const pillClass = (active: boolean) =>
    `px-4 py-2 rounded-lg border-2 transition-colors ${
      active
        ? 'border-[#F15F5F] bg-red-50 text-[#F15F5F] font-medium'
        : 'border-gray-200 text-gray-700 hover:border-gray-300'
    }`

  return (
    <div className="min-h-screen bg-white py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => { window.location.href = '/?view=tools' }}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          부동산 도구 목록
        </button>

        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">중개보수 계산</h1>
        </div>

        {/* 탭 */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
          <button onClick={() => setActiveTab('explanation')} className={tabClass('explanation', activeTab)}>설명</button>
          <button onClick={() => setActiveTab('calculator')} className={tabClass('calculator', activeTab)}>중개보수 계산</button>
          <button onClick={() => setActiveTab('regionalRate')} className={tabClass('regionalRate', activeTab)}>지역별 요율</button>
          <button onClick={() => setActiveTab('rateTable')} className={tabClass('rateTable', activeTab)}>요율표</button>
        </div>

        {/* 설명 탭 */}
        {activeTab === 'explanation' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed mb-3">
                부동산 매매·임대차 계약 시 공인중개사에 지불해야 하는 중개보수(중개수수료)를 계산합니다.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                중개보수는 거래금액에 상한요율을 곱하여 산정하며, 거래금액 구간에 따라 상한요율과 한도액이 다르게 적용됩니다.
                월세 계약의 경우 거래금액은 보증금 + (월세 × 100)으로 계산하되, 5천만원 이상이면 보증금 + (월세 × 70)으로 계산합니다.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">분양권 거래금액 계산</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                분양권의 거래금액 = 거래당시까지 불입한 금액(융자포함) + 프리미엄
              </p>
            </div>
          </div>
        )}

        {/* 계산 탭 */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            {/* 계약 유형 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">계약 유형</label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setContractType('sale')} className={pillClass(contractType === 'sale')}>매매계약</button>
                <button onClick={() => setContractType('jeonse')} className={pillClass(contractType === 'jeonse')}>전세계약</button>
                <button onClick={() => setContractType('monthly')} className={pillClass(contractType === 'monthly')}>월세계약</button>
              </div>
            </div>

            {/* 부동산 유형 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">부동산 유형</label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setPropertyType('house')} className={pillClass(propertyType === 'house')}>주택</button>
                <button onClick={() => setPropertyType('officetel')} className={pillClass(propertyType === 'officetel')}>오피스텔</button>
                {contractType === 'sale' && (
                  <button onClick={() => setPropertyType('saleLot')} className={pillClass(propertyType === 'saleLot')}>분양권</button>
                )}
                <button onClick={() => setPropertyType('etc')} className={pillClass(propertyType === 'etc')}>그 외</button>
              </div>
            </div>

            {/* 금액 입력 */}
            {contractType === 'sale' && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">매매가</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                    placeholder="금액 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
                </div>
              </div>
            )}

            {contractType === 'jeonse' && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">전세 보증금</label>
                <div className="relative">
                  <input
                    type="number"
                    value={deposit || ''}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                    placeholder="보증금 입력"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
                </div>
              </div>
            )}

            {contractType === 'monthly' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">보증금</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={deposit || ''}
                      onChange={(e) => setDeposit(Number(e.target.value))}
                      className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                      placeholder="보증금 입력"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">월세</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={monthlyRent || ''}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                      placeholder="월세 입력"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">만원</span>
                  </div>
                </div>
              </>
            )}

            {/* 옵션 체크박스 */}
            <div className="flex flex-wrap gap-4 py-3 border-t border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customRate}
                  onChange={(e) => setCustomRate(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">요율 직접 입력</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeVat}
                  onChange={(e) => setIncludeVat(e.target.checked)}
                  className="w-4 h-4 text-[#F15F5F] rounded focus:ring-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">부가세(10%) 포함</span>
              </label>
            </div>

            {customRate && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">상한요율 (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={customRateValue || ''}
                    onChange={(e) => setCustomRateValue(Number(e.target.value))}
                    className="w-full px-4 py-4 pr-16 rounded-xl border-2 border-gray-200 focus:border-[#F15F5F] focus:outline-none text-lg"
                    placeholder="예: 0.4"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                </div>
              </div>
            )}

            {/* 계산 버튼 */}
            <button
              onClick={handleCalculate}
              className="w-full py-4 bg-[#F15F5F] text-white rounded-xl font-bold hover:bg-[#E14E4E] transition-colors"
            >
              중개보수 계산
            </button>

            {/* 결과 */}
            {result && (
              <div className="mt-8 space-y-4">
                <div className="bg-gradient-to-br from-red-50 to-pink-50/30 rounded-2xl p-6 border border-red-100">
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 mb-2">예상 중개보수{includeVat ? ' (부가세 포함)' : ''}</p>
                    <p className="text-4xl font-bold text-[#F15F5F]">
                      {result.total.toLocaleString()}만원
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      ({(result.total * 10000).toLocaleString()}원)
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-red-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">거래금액</span>
                      <span className="font-medium">{result.transactionAmount.toLocaleString()}만원</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">적용 요율</span>
                      <span className="font-medium">{result.rateLabel}</span>
                    </div>
                    {result.limit && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">한도액 적용</span>
                        <span className="font-medium text-[#F15F5F]">{result.limit}만원</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold border-t border-red-200 pt-3">
                      <span className="text-gray-900">중개보수</span>
                      <span>{result.fee.toLocaleString()}만원</span>
                    </div>
                    {includeVat && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">부가세 (10%)</span>
                        <span className="font-medium">+{result.vat.toLocaleString()}만원</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 주의사항 */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">⚠️ 참고사항</h3>
              <ul className="text-sm text-gray-700 leading-relaxed space-y-1">
                <li>• 서울 기준 요율표를 적용합니다. 지역에 따라 요율이 다를 수 있습니다.</li>
                <li>• 중개보수는 상한요율 이내에서 중개의뢰인과 중개사가 협의하여 결정합니다.</li>
                <li>• 개업공인중개사가 아닌 소속공인중개사·중개보조원과의 직거래에는 적용되지 않습니다.</li>
              </ul>
            </div>
          </div>
        )}

        {/* 지역별 요율 탭 */}
        {activeTab === 'regionalRate' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">
                중개보수 요율은 지역 조례에 따라 지역별로 차이가 날 수 있습니다.
                본 계산 결과는 서울특별시를 기준으로 계산하였습니다.
                나머지 지역들은 아래 지역별 부동산 중개보수 요율을 참고해주세요.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">지역별 부동산 중개보수 요율</h3>
              <div className="space-y-3">
                <a href="https://land.seoul.go.kr:444/land/broker/brokerageCommission.do" target="_blank" rel="noopener noreferrer" className="block text-[#F15F5F] hover:underline text-sm">
                  서울특별시 부동산중개보수 요율
                </a>
                <a href="https://gris.gg.go.kr/reb/selectRebRateView.do" target="_blank" rel="noopener noreferrer" className="block text-[#F15F5F] hover:underline text-sm">
                  경기도 부동산중개보수 요율
                </a>
                <a href="https://www.busan.go.kr/depart/ahestateprice01" target="_blank" rel="noopener noreferrer" className="block text-[#F15F5F] hover:underline text-sm">
                  부산광역시 부동산중개보수 요율
                </a>
                <a href="https://www.incheon.go.kr/build/BU060102/274" target="_blank" rel="noopener noreferrer" className="block text-[#F15F5F] hover:underline text-sm">
                  인천광역시 부동산중개보수 요율
                </a>
                <a href="https://www.gwangju.go.kr/build/contentsView.do?pageId=build25" target="_blank" rel="noopener noreferrer" className="block text-[#F15F5F] hover:underline text-sm">
                  광주광역시 부동산중개보수 요율
                </a>
                <a href="https://www.ulsannamgu.go.kr/fieldInfo/realestateInfo03.jsp" target="_blank" rel="noopener noreferrer" className="block text-[#F15F5F] hover:underline text-sm">
                  울산광역시 부동산중개보수 요율
                </a>
                <a href="https://www.sejong.go.kr/tmpl/pdf.jsp?pdfFilePath=/thumbnail/R0071/BBS_201811211052218120.pdf" target="_blank" rel="noopener noreferrer" className="block text-[#F15F5F] hover:underline text-sm">
                  세종특별자치시 부동산중개보수 요율
                </a>
                <a href="https://www.cheongju.go.kr/www/contents.do?key=513" target="_blank" rel="noopener noreferrer" className="block text-[#F15F5F] hover:underline text-sm">
                  충청북도 부동산중개보수 요율
                </a>
                <a href="https://www.jeonnam.go.kr/contentsView.do?menuId=jeonnam0505060000" target="_blank" rel="noopener noreferrer" className="block text-[#F15F5F] hover:underline text-sm">
                  전라남도 부동산중개보수 요율
                </a>
                <a href="https://www.gb.go.kr/Main/open_contents/section/economy/page.do?mnu_uid=2538&LARGE_CODE=390&MEDIUM_CODE=10&SMALL_CODE=30&SMALL_CODE2=10mnu_order=4" target="_blank" rel="noopener noreferrer" className="block text-[#F15F5F] hover:underline text-sm">
                  경상북도 부동산중개보수 요율
                </a>
                <a href="https://www.jeju.go.kr/city/land/tariff.htm" target="_blank" rel="noopener noreferrer" className="block text-[#F15F5F] hover:underline text-sm">
                  제주특별자치도 부동산중개보수 요율
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 요율표 탭 */}
        {activeTab === 'rateTable' && (
          <div className="space-y-6">
            {/* 주택 매매 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>ℹ️</span>
                주택 — 매매·교환
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">거래금액</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700">상한요율</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-700">한도액</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    <tr><td className="px-4 py-2 text-gray-600">5천만원 미만</td><td className="px-4 py-2 text-center">0.6%</td><td className="px-4 py-2 text-right">25만원</td></tr>
                    <tr><td className="px-4 py-2 text-gray-600">5천만원~2억원 미만</td><td className="px-4 py-2 text-center">0.5%</td><td className="px-4 py-2 text-right">80만원</td></tr>
                    <tr><td className="px-4 py-2 text-gray-600">2억원~9억원 미만</td><td className="px-4 py-2 text-center">0.4%</td><td className="px-4 py-2 text-right">—</td></tr>
                    <tr><td className="px-4 py-2 text-gray-600">9억원~12억원 미만</td><td className="px-4 py-2 text-center">0.5%</td><td className="px-4 py-2 text-right">—</td></tr>
                    <tr><td className="px-4 py-2 text-gray-600">12억원~15억원 미만</td><td className="px-4 py-2 text-center">0.6%</td><td className="px-4 py-2 text-right">—</td></tr>
                    <tr><td className="px-4 py-2 text-gray-600">15억원 이상</td><td className="px-4 py-2 text-center">0.7%</td><td className="px-4 py-2 text-right">—</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 주택 임대차 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>ℹ️</span>
                주택 — 임대차 등
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">거래금액</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700">상한요율</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-700">한도액</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    <tr><td className="px-4 py-2 text-gray-600">5천만원 미만</td><td className="px-4 py-2 text-center">0.5%</td><td className="px-4 py-2 text-right">20만원</td></tr>
                    <tr><td className="px-4 py-2 text-gray-600">5천만원~1억원 미만</td><td className="px-4 py-2 text-center">0.4%</td><td className="px-4 py-2 text-right">30만원</td></tr>
                    <tr><td className="px-4 py-2 text-gray-600">1억원~6억원 미만</td><td className="px-4 py-2 text-center">0.3%</td><td className="px-4 py-2 text-right">—</td></tr>
                    <tr><td className="px-4 py-2 text-gray-600">6억원~12억원 미만</td><td className="px-4 py-2 text-center">0.4%</td><td className="px-4 py-2 text-right">—</td></tr>
                    <tr><td className="px-4 py-2 text-gray-600">12억원~15억원 미만</td><td className="px-4 py-2 text-center">0.5%</td><td className="px-4 py-2 text-right">—</td></tr>
                    <tr><td className="px-4 py-2 text-gray-600">15억원 이상</td><td className="px-4 py-2 text-center">0.6%</td><td className="px-4 py-2 text-right">—</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 오피스텔 / 그 외 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>ℹ️</span>
                오피스텔 · 그 외
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">종류</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700">거래내용</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-700">상한요율</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    <tr><td className="px-4 py-2 text-gray-600">오피스텔</td><td className="px-4 py-2 text-center">매매·교환</td><td className="px-4 py-2 text-right">0.5%</td></tr>
                    <tr><td className="px-4 py-2 text-gray-600">오피스텔</td><td className="px-4 py-2 text-center">임대차 등</td><td className="px-4 py-2 text-right">0.4%</td></tr>
                    <tr><td className="px-4 py-2 text-gray-600">주택 이외</td><td className="px-4 py-2 text-center">—</td><td className="px-4 py-2 text-right">0.9% 이내 협의</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 분양권 참고 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <p className="text-sm text-gray-700">
                ※ 분양권의 거래금액 계산 : 거래당시까지 불입한 금액(융자포함) + 프리미엄 × 상한요율
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
