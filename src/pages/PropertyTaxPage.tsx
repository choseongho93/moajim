import { useState, useRef } from 'react'
import CaptureButtons from '../components/CaptureButtons'
import {
  runSimulation,
  type Asset,
  type Owner,
  type FutureSettings,
  type SurtaxCriteria,
  type HouseholdInfo,
  type SimulationResult,
  type ScenarioResult,
  type PersonResult,
  type HouseholdSummary,
} from '../utils/propertyTax'
import ShareButtons from '../components/ShareButtons'

export default function PropertyTaxPage() {
  return <PropertyTaxSimulator />
}

function PropertyTaxSimulator() {
  const summaryRef = useRef<HTMLDivElement>(null)

  // 미래 변수 설정
  const [futureSettings, setFutureSettings] = useState<FutureSettings>({
    realizationRate: 90,
    comprehensiveFMVR: 100,
    multiHomeDeduction: 50000,
    singleHomeTaxCreditLimit: 80,
  })

  // 중과 판단 기준
  const [surtaxCriteria, setSurtaxCriteria] = useState<SurtaxCriteria>('non-resident')

  // 가구 정보
  const [household, setHousehold] = useState<HouseholdInfo>({
    husbandAge: 35,
    wifeAge: 35,
    isMarried: true,
  })

  // 자산 목록
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: '1',
      name: '',
      owner: 'husband',
      officialPrice: 0,
      acquisitionDate: '',
      isRegulated: false,
      isResiding: true,
    },
  ])

  // 결과
  const [result, setResult] = useState<SimulationResult | null>(null)

  const addAsset = () => {
    setAssets([
      ...assets,
      {
        id: Date.now().toString(),
        name: '',
        owner: 'husband',
        officialPrice: 0,
        acquisitionDate: '',
        isRegulated: false,
        isResiding: true,
      },
    ])
  }

  const removeAsset = (id: string) => {
    if (assets.length <= 1) return
    setAssets(assets.filter(a => a.id !== id))
  }

  const updateAsset = (id: string, field: keyof Asset, value: string | number | boolean) => {
    setAssets(assets.map(a => (a.id === id ? { ...a, [field]: value } : a)))
  }

  const handleSimulate = () => {
    const validAssets = assets.filter(a => a.name && a.officialPrice > 0)
    if (validAssets.length === 0) return
    const res = runSimulation(validAssets, household, futureSettings, surtaxCriteria)
    setResult(res)
  }

  const fmt = (n: number) => n.toLocaleString()

  const copySummaryText = () => {
    if (!result) return
    const h = result.husband
    const w = result.wife
    const hh = result.household
    const lines = [
      '[ 2026 보유세 예측 시뮬레이션 결과 ]',
      '',
      `남편: 현재 ${fmt(h.current.totalTax)}만 | 과거최고점 ${fmt(h.past.totalTax)}만 | 미래예상 ${fmt(h.future.totalTax)}만`,
      `아내: 현재 ${fmt(w.current.totalTax)}만 | 과거최고점 ${fmt(w.past.totalTax)}만 | 미래예상 ${fmt(w.future.totalTax)}만`,
      `가계: 현재 ${fmt(hh.current.totalTax)}만 | 과거최고점 ${fmt(hh.past.totalTax)}만 | 미래예상 ${fmt(hh.future.totalTax)}만`,
      '',
      'moajim.com',
    ]
    navigator.clipboard.writeText(lines.join('\n'))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-50/50 via-white to-pink-50/30 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => { window.location.href = '/' }}
            className="flex items-center gap-1 text-gray-500 hover:text-[#F15F5F] transition-colors mb-4 sm:mb-6"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">홈으로</span>
          </button>

          <h1 className="text-2xl sm:text-3xl md:text-[38px] font-bold text-gray-900 mb-2">
            2026 보유세예측해보기
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            현행법(2026.03)과 과거 최고점(2021년)을 비교하고, 미래 시나리오를 시뮬레이션합니다
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="https://www.realtyprice.kr/notice/town/nfSiteLink.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F15F5F] text-white rounded-xl text-sm font-medium hover:bg-[#d94f4f] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              내집 공시가격 확인
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <ShareButtons url="https://moajim.com/?view=property-tax" title="2026 보유세예측해보기 - 모아짐" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* 사용법 안내 */}
        <section className="bg-blue-50 border border-blue-200 rounded-2xl p-5 sm:p-6">
          <h2 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            사용법
          </h2>
          <ol className="text-xs sm:text-sm text-blue-700 space-y-1.5 ml-5 list-decimal">
            <li>위의 <strong>"내집 공시가격 확인"</strong> 버튼을 클릭하여 부동산공시가격 알리미에서 내 집의 공시가격을 확인합니다.</li>
            <li>아래 <strong className="text-orange-600">주황색 영역</strong>에서 미래 변수와 중과 기준을 설정합니다. (기본값 그대로 사용 가능)</li>
            <li><strong className="text-emerald-600">초록색 영역</strong>에서 가구 정보와 자산을 입력합니다.</li>
            <li><strong>"계산하기"</strong> 버튼을 클릭하면 현행법 / 2021년 최고점 / 미래 예상 세액을 한 번에 비교합니다.</li>
          </ol>
        </section>

        {/* 미래 변수 설정 */}
        <section className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            미래 변수 설정
          </h2>
          <p className="text-xs text-gray-500 mb-4">숫자를 입력하여 미래 시나리오를 커스텀하세요</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">공시 현실화율 (%)</label>
              <input
                type="number"
                value={futureSettings.realizationRate || ''}
                onChange={e => setFutureSettings({ ...futureSettings, realizationRate: e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F15F5F]/30 focus:border-[#F15F5F]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">공정시장비율 (%)</label>
              <input
                type="number"
                value={futureSettings.comprehensiveFMVR || ''}
                onChange={e => setFutureSettings({ ...futureSettings, comprehensiveFMVR: e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F15F5F]/30 focus:border-[#F15F5F]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">다주택 공제액 (만)</label>
              <input
                type="number"
                value={futureSettings.multiHomeDeduction || ''}
                onChange={e => setFutureSettings({ ...futureSettings, multiHomeDeduction: e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F15F5F]/30 focus:border-[#F15F5F]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">1주택 세액공제 한도 (%)</label>
              <input
                type="number"
                value={futureSettings.singleHomeTaxCreditLimit || ''}
                onChange={e => setFutureSettings({ ...futureSettings, singleHomeTaxCreditLimit: e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F15F5F]/30 focus:border-[#F15F5F]"
              />
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <p className="text-[11px] text-gray-400">* 1세대 1주택자에게만 적용되는 연령 및 장기보유 세액공제 혜택입니다.</p>
            <p className="text-[11px] text-gray-400">* 현행 세법 기준 최대 80%까지 할인받을 수 있습니다.</p>
            <p className="text-[11px] text-gray-400">* 미래에 이 혜택이 축소되거나 폐지되는 최악의 상황을 가정하고 싶다면 0을 입력해 보세요.</p>
          </div>
        </section>

        {/* 미래 중과 판단 기준 */}
        <section className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            미래 중과 판단 기준
            <span className="text-xs font-normal text-gray-400">(2021년 산식 적용)</span>
          </h2>

          <div className="mt-3 space-y-2">
            {([
              { value: 'non-resident' as SurtaxCriteria, label: '비거주(투자용) 포함 시 중과' },
              { value: 'two-or-more' as SurtaxCriteria, label: '2주택 이상 무조건 중과' },
              { value: 'regulated-two' as SurtaxCriteria, label: '조정 1주택 포함 2주택 중과' },
              { value: 'three-or-more' as SurtaxCriteria, label: '3주택 이상 무조건 중과' },
            ]).map(opt => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${
                  surtaxCriteria === opt.value ? 'bg-red-50 border border-[#F15F5F]/30' : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <input
                  type="radio"
                  name="surtaxCriteria"
                  value={opt.value}
                  checked={surtaxCriteria === opt.value}
                  onChange={() => setSurtaxCriteria(opt.value)}
                  className="accent-[#F15F5F]"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-gray-400">
            * 이 기준은 하단의 [미래 시뮬레이션] 산출 시에만 적용됩니다.
          </p>
        </section>

        {/* 01. 자산 포트폴리오 입력 */}
        <section className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">01. 자산 포트폴리오 입력</h2>

          {/* 가구 정보 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">남편 나이</label>
              <input
                type="number"
                value={household.husbandAge || ''}
                onChange={e => setHousehold({ ...household, husbandAge: e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F15F5F]/30 focus:border-[#F15F5F]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">아내 나이</label>
              <input
                type="number"
                value={household.wifeAge || ''}
                onChange={e => setHousehold({ ...household, wifeAge: e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F15F5F]/30 focus:border-[#F15F5F]"
              />
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={household.isMarried}
                  onChange={e => setHousehold({ ...household, isMarried: e.target.checked })}
                  className="accent-[#F15F5F] w-4 h-4"
                />
                <span className="text-sm text-gray-700 font-medium">혼인신고(1세대)</span>
              </label>
            </div>
          </div>

          {/* 자산 목록 */}
          <div className="space-y-4">
            {assets.map((asset, idx) => (
              <div key={asset.id} className="relative bg-gray-50 rounded-xl p-4 border border-gray-200">
                {assets.length > 1 && (
                  <button
                    onClick={() => removeAsset(asset.id)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      물건명 {idx + 1}
                    </label>
                    <input
                      type="text"
                      value={asset.name}
                      onChange={e => updateAsset(asset.id, 'name', e.target.value)}
                      placeholder="예: 서울 아파트"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F15F5F]/30 focus:border-[#F15F5F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">소유주</label>
                    <select
                      value={asset.owner}
                      onChange={e => updateAsset(asset.id, 'owner', e.target.value as Owner)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F15F5F]/30 focus:border-[#F15F5F]"
                    >
                      <option value="husband">남편</option>
                      <option value="wife">아내</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">공시가격(만원)</label>
                    <input
                      type="number"
                      value={asset.officialPrice || ''}
                      onChange={e => updateAsset(asset.id, 'officialPrice', Number(e.target.value))}
                      placeholder="예: 54000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F15F5F]/30 focus:border-[#F15F5F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">취득일</label>
                    <input
                      type="date"
                      value={asset.acquisitionDate}
                      onChange={e => updateAsset(asset.id, 'acquisitionDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F15F5F]/30 focus:border-[#F15F5F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">조정지역</label>
                    <select
                      value={asset.isRegulated ? 'yes' : 'no'}
                      onChange={e => updateAsset(asset.id, 'isRegulated', e.target.value === 'yes')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F15F5F]/30 focus:border-[#F15F5F]"
                    >
                      <option value="no">비조정</option>
                      <option value="yes">조정</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">실거주</label>
                    <select
                      value={asset.isResiding ? 'yes' : 'no'}
                      onChange={e => updateAsset(asset.id, 'isResiding', e.target.value === 'yes')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F15F5F]/30 focus:border-[#F15F5F]"
                    >
                      <option value="yes">거주</option>
                      <option value="no">비거주</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addAsset}
            className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 font-medium hover:border-[#F15F5F] hover:text-[#F15F5F] transition-colors"
          >
            + 자산 추가
          </button>
        </section>

        {/* 시뮬레이션 실행 */}
        <button
          onClick={handleSimulate}
          className="w-full py-4 bg-gradient-to-r from-[#F15F5F] to-[#FFA7A7] text-white rounded-2xl text-lg font-bold hover:shadow-lg hover:shadow-red-500/20 transition-all active:scale-[0.98]"
        >
          계산하기
        </button>

        {/* 결과 */}
        {result && (
          <>
            {/* 02. 계산 결과 요약 */}
            <section className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-lg font-bold text-gray-900">02. 계산 결과 요약</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={copySummaryText}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs text-gray-600 transition-colors"
                  >
                    요약 표 복사
                  </button>
                  <CaptureButtons targetRef={summaryRef} fileName="moajim-보유세예측-요약" />
                </div>
              </div>
              <div ref={summaryRef}>

              <div className="space-y-4">
                <SummaryCard
                  icon="👨"
                  title="남편 요약"
                  current={result.husband.current}
                  past={result.husband.past}
                  future={result.husband.future}
                />
                <div className="text-center text-xl text-gray-300 font-bold">+</div>
                <SummaryCard
                  icon="👩"
                  title="아내 요약"
                  current={result.wife.current}
                  past={result.wife.past}
                  future={result.wife.future}
                />
                <div className="text-center text-xl text-gray-300 font-bold">=</div>
                <HouseholdSummaryCard
                  current={result.household.current}
                  past={result.household.past}
                  future={result.household.future}
                />
              </div>
              </div>
            </section>

            {/* 03. 인별/세목별 상세 산출 과정 */}
            <section className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">03. 인별/세목별 상세 산출 과정</h2>
              <p className="text-[11px] text-gray-400 mb-6">
                * 재산세 3단 분리 및 종부세 중복분 차감 역산 공식이 적용된 투명화 리포트입니다.
              </p>

              {/* 남편 상세 */}
              {result.husband.current.propertyDetails.length > 0 && (
                <PersonDetailSection
                  title="남편 명의 상세 명세"
                  person={result.husband}
                  futureSettings={futureSettings}
                />
              )}

              {/* 아내 상세 */}
              {result.wife.current.propertyDetails.length > 0 && (
                <PersonDetailSection
                  title="아내 명의 상세 명세"
                  person={result.wife}
                  futureSettings={futureSettings}
                />
              )}
            </section>

          </>
        )}

        {/* 기준표 - 항상 노출 */}
        <ReferenceTables futureSettings={futureSettings} surtaxCriteria={surtaxCriteria} />
      </div>
    </div>
  )
}

// ================ Sub Components ================

function SummaryCard({ icon, title, current, past, future }: {
  icon: string
  title: string
  current: ScenarioResult
  past: ScenarioResult
  future: ScenarioResult
}) {
  const fmt = (n: number) => n.toLocaleString()

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="text-sm font-bold text-gray-800 mb-3">{icon} {title}</h3>
      <div className="grid grid-cols-3 gap-2 text-center">
        <ScenarioSummaryCol label="현재 합계" color="blue" result={current} fmt={fmt} />
        <ScenarioSummaryCol label="과거 최고점" color="red" result={past} fmt={fmt} />
        <ScenarioSummaryCol label="미래 예상" color="orange" result={future} fmt={fmt} />
      </div>
    </div>
  )
}

function ScenarioSummaryCol({ label, color, result, fmt }: {
  label: string
  color: 'blue' | 'red' | 'orange'
  result: ScenarioResult
  fmt: (n: number) => string
}) {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    red: 'text-red-600 bg-red-50 border-red-200',
    orange: 'text-orange-600 bg-orange-50 border-orange-200',
  }
  const headerMap = {
    blue: 'bg-blue-100 text-blue-700',
    red: 'bg-red-100 text-red-700',
    orange: 'bg-orange-100 text-orange-700',
  }

  return (
    <div className={`rounded-lg border p-2 ${colorMap[color]}`}>
      <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full mb-2 ${headerMap[color]}`}>
        {label}
      </div>
      <div className="text-lg sm:text-xl font-bold">{fmt(result.totalTax)}만</div>
      <div className="text-[10px] mt-1 opacity-70">
        종부 {fmt(result.totalComprehensiveTax)}<br />
        재산 {fmt(result.totalPropertyTax)}
      </div>
    </div>
  )
}

function HouseholdSummaryCard({ current, past, future }: {
  current: HouseholdSummary
  past: HouseholdSummary
  future: HouseholdSummary
}) {
  const fmt = (n: number) => n.toLocaleString()

  return (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border-2 border-[#F15F5F]/20">
      <h3 className="text-sm font-bold text-gray-800 mb-3">🏠 가계 통합 요약</h3>
      <div className="grid grid-cols-3 gap-2 text-center">
        {([
          { label: '현재 합계', color: 'blue' as const, data: current },
          { label: '과거 최고점', color: 'red' as const, data: past },
          { label: '미래 예상', color: 'orange' as const, data: future },
        ]).map(({ label, color, data }) => {
          const colorMap = {
            blue: 'text-blue-600 bg-white/80 border-blue-200',
            red: 'text-red-600 bg-white/80 border-red-200',
            orange: 'text-orange-600 bg-white/80 border-orange-200',
          }
          const headerMap = {
            blue: 'bg-blue-100 text-blue-700',
            red: 'bg-red-100 text-red-700',
            orange: 'bg-orange-100 text-orange-700',
          }
          return (
            <div key={label} className={`rounded-lg border p-2 ${colorMap[color]}`}>
              <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full mb-2 ${headerMap[color]}`}>
                {label}
              </div>
              <div className="text-lg sm:text-xl font-bold">{fmt(data.totalTax)}만</div>
              <div className="text-[10px] mt-1 opacity-70">
                종부 {fmt(data.totalComprehensiveTax)}<br />
                재산 {fmt(data.totalPropertyTax)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PersonDetailSection({ title, person, futureSettings }: {
  title: string
  person: PersonResult
  futureSettings: FutureSettings
}) {
  return (
    <div className="mb-8">
      <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
        👤 {title}
      </h3>

      <ScenarioDetailBlock
        label="현재 시나리오"
        sublabel="2026.03 현행법"
        color="blue"
        result={person.current}

        scenario="current"
        futureSettings={futureSettings}
      />
      <ScenarioDetailBlock
        label="과거 시나리오"
        sublabel="2021년 최고점"
        color="red"
        result={person.past}

        scenario="past"
        futureSettings={futureSettings}
      />
      <ScenarioDetailBlock
        label="미래 시나리오"
        sublabel="변수 커스텀 & 2021년 산식 적용"
        color="orange"
        result={person.future}

        scenario="future"
        futureSettings={futureSettings}
      />
    </div>
  )
}

function ScenarioDetailBlock({ label, sublabel, color, result, scenario, futureSettings }: {
  label: string
  sublabel: string
  color: 'blue' | 'red' | 'orange'
  result: ScenarioResult
  scenario: 'current' | 'past' | 'future'
  futureSettings: FutureSettings
}) {
  const fmt = (n: number) => n.toLocaleString()
  const dotColor = { blue: 'bg-blue-500', red: 'bg-red-500', orange: 'bg-orange-500' }
  const borderColor = { blue: 'border-blue-200', red: 'border-red-200', orange: 'border-orange-200' }
  const bgColor = { blue: 'bg-blue-50/50', red: 'bg-red-50/50', orange: 'bg-orange-50/50' }

  const scenarioRateLabel = () => {
    const rate = scenario === 'current' ? 69 : scenario === 'past' ? 75 : futureSettings.realizationRate
    return `공시가/0.69*${rate}%`
  }

  return (
    <div className={`mb-6 rounded-xl border ${borderColor[color]} ${bgColor[color]} overflow-hidden`}>
      <div className="px-4 py-3 flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${dotColor[color]}`} />
        <span className="text-sm font-bold text-gray-800">{label}</span>
        <span className="text-xs text-gray-500">({sublabel})</span>
      </div>

      {/* ① 재산세 3단 분리 산출 */}
      <div className="px-4 pb-3">
        <p className="text-xs font-medium text-gray-600 mb-2">① 재산세 3단 분리 산출 (물건별)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-1 font-medium text-gray-500">자산명</th>
                <th className="text-right py-2 px-1 font-medium text-gray-500">조정공시가</th>
                <th className="text-right py-2 px-1 font-medium text-gray-500">재산과표</th>
                <th className="text-right py-2 px-1 font-medium text-gray-500">재산본세</th>
                <th className="text-right py-2 px-1 font-medium text-gray-500">지방교육세</th>
                <th className="text-right py-2 px-1 font-medium text-gray-500">도시지역분</th>
                <th className="text-right py-2 px-1 font-medium text-gray-500">재산세합계</th>
              </tr>
            </thead>
            <tbody>
              {result.propertyDetails.map((d, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 px-1">
                    <div className="font-medium text-gray-800">{d.assetName}</div>
                  </td>
                  <td className="py-2 px-1 text-right">
                    <div className="font-medium">{fmt(d.adjustedPrice)}만</div>
                    <div className="text-[10px] text-gray-400">{scenarioRateLabel()}</div>
                  </td>
                  <td className="py-2 px-1 text-right">
                    <div className="font-medium">{fmt(d.taxBase)}만</div>
                    <div className="text-[10px] text-gray-400">가액*비율({d.fmvr}%)</div>
                  </td>
                  <td className="py-2 px-1 text-right">
                    <div className="font-medium">{fmt(d.basicTax)}만</div>
                    <div className="text-[10px] text-gray-400">{d.taxRate.toFixed(2)}% 누진적용</div>
                  </td>
                  <td className="py-2 px-1 text-right">
                    <div className="font-medium">{fmt(d.educationTax)}만</div>
                    <div className="text-[10px] text-gray-400">본세*20%</div>
                  </td>
                  <td className="py-2 px-1 text-right">
                    <div className="font-medium">{fmt(d.urbanTax)}만</div>
                    <div className="text-[10px] text-gray-400">과표*0.14%</div>
                  </td>
                  <td className="py-2 px-1 text-right font-bold text-gray-900">
                    {fmt(d.totalTax)}만
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ② 종합부동산세 역산 차감 */}
      <div className="px-4 pb-3">
        <p className="text-xs font-medium text-gray-600 mb-2">② 종합부동산세 역산 차감 (인별 합산)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-2 px-1 font-medium text-gray-500">합산 공시가</th>
                <th className="text-right py-2 px-1 font-medium text-gray-500">공제액</th>
                <th className="text-right py-2 px-1 font-medium text-gray-500">종부과표</th>
                <th className="text-right py-2 px-1 font-medium text-gray-500">세율</th>
                <th className="text-right py-2 px-1 font-medium text-gray-500">종부본세</th>
                <th className="text-right py-2 px-1 font-medium text-gray-500">재산세차감</th>
                <th className="text-right py-2 px-1 font-medium text-gray-500">세액공제</th>
                <th className="text-right py-2 px-1 font-medium text-gray-500">최종 종부세</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-1 text-right font-medium">
                  {fmt(result.comprehensiveTax.totalAdjustedPrice)}만
                </td>
                <td className="py-2 px-1 text-right font-medium">
                  -{fmt(result.comprehensiveTax.deduction)}만
                </td>
                <td className="py-2 px-1 text-right">
                  <div className="font-medium">{fmt(result.comprehensiveTax.taxBase)}만</div>
                  <div className="text-[10px] text-gray-400">FMVR {result.comprehensiveTax.fmvr}%</div>
                </td>
                <td className="py-2 px-1 text-right font-medium">
                  {result.comprehensiveTax.taxRate > 0 ? `${result.comprehensiveTax.taxRate.toFixed(1)}%` : '0%'}
                </td>
                <td className="py-2 px-1 text-right font-medium">
                  {fmt(result.comprehensiveTax.basicTax)}만
                </td>
                <td className="py-2 px-1 text-right font-medium">
                  -{fmt(result.comprehensiveTax.propertyTaxCredit)}만
                </td>
                <td className="py-2 px-1 text-right">
                  {result.comprehensiveTax.ageLongTermCredit > 0
                    ? <><div className="font-medium">-{fmt(result.comprehensiveTax.ageLongTermCreditAmount)}만</div><div className="text-[10px] text-gray-400">{result.comprehensiveTax.ageLongTermCredit}%</div></>
                    : <span className="text-gray-400">-</span>
                  }
                </td>
                <td className="py-2 px-1 text-right font-bold text-gray-900">
                  {fmt(result.comprehensiveTax.finalTax)}만
                  <div className="text-[10px] text-gray-400 font-normal">농특포함</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 시나리오 합계 */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white/50">
        <p className="text-sm font-bold text-gray-800">
          해당 시나리오 최종 납부 세액: <span className="text-[#F15F5F]">{fmt(result.totalTax)} 만원</span>
        </p>
      </div>
    </div>
  )
}

// ================ Reference Tables ================

function ReferenceTables({ futureSettings, surtaxCriteria }: {
  futureSettings: FutureSettings
  surtaxCriteria: SurtaxCriteria
}) {
  const surtaxLabels: Record<SurtaxCriteria, string> = {
    'non-resident': '비거주(투자용) 포함 시 무조건 중과',
    'two-or-more': '2주택 이상 무조건 중과',
    'regulated-two': '조정 1주택 포함 2주택 중과',
    'three-or-more': '3주택 이상 무조건 중과',
  }

  return (
    <>
      {/* [기준표 1] 정책 시나리오별 세금기준 */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50/30 border border-blue-200 rounded-2xl p-5 sm:p-6">
        <h2 className="text-sm font-bold text-blue-800 mb-3">[기준표 1] 정책 시나리오별 세금기준</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[500px]">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 px-2 font-medium text-gray-500">구분 항목</th>
                <th className="text-center py-2 px-2 font-medium text-blue-600 bg-blue-50/50">현재 (2026.03)</th>
                <th className="text-center py-2 px-2 font-medium text-red-600 bg-red-50/50">과거 최고점 (2021)</th>
                <th className="text-center py-2 px-2 font-medium text-orange-600 bg-orange-50/50">미래 (사용자 설정)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 px-2 text-gray-700">공시가격 현실화율</td>
                <td className="py-2 px-2 text-center">69% 수준 동결</td>
                <td className="py-2 px-2 text-center">75% ~ 80%</td>
                <td className="py-2 px-2 text-center font-medium">{futureSettings.realizationRate}%</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-gray-700">재산세 공정시장가액비율</td>
                <td className="py-2 px-2 text-center">1주택 43~45% / 다주택 60%</td>
                <td className="py-2 px-2 text-center">일괄 60%</td>
                <td className="py-2 px-2 text-center font-medium">다주택 기준 80% 적용</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-gray-700">종부세 공정시장가액비율</td>
                <td className="py-2 px-2 text-center">60%</td>
                <td className="py-2 px-2 text-center">95%</td>
                <td className="py-2 px-2 text-center font-medium">{futureSettings.comprehensiveFMVR}%</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-gray-700">종부세 기본공제</td>
                <td className="py-2 px-2 text-center">1주택 12억 / 다주택 9억</td>
                <td className="py-2 px-2 text-center">1주택 11억 / 다주택 6억</td>
                <td className="py-2 px-2 text-center font-medium">1주택 11억 / 다주택 {(futureSettings.multiHomeDeduction / 10000).toFixed(0)}억</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-gray-700">종부세 중과 기준</td>
                <td className="py-2 px-2 text-center">3주택+ & 과표 12억 초과분</td>
                <td className="py-2 px-2 text-center">조정 2주택+ 또는 3주택+</td>
                <td className="py-2 px-2 text-center font-medium">{surtaxLabels[surtaxCriteria]}</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-gray-700">1주택 세액공제 한도</td>
                <td className="py-2 px-2 text-center">최대 80%</td>
                <td className="py-2 px-2 text-center">최대 80%</td>
                <td className="py-2 px-2 text-center font-medium">최대 {futureSettings.singleHomeTaxCreditLimit}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* [기준표 2] 종부세 세율표 */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50/30 border border-blue-200 rounded-2xl p-5 sm:p-6">
        <h2 className="text-sm font-bold text-blue-800 mb-3">[기준표 2] 종합부동산세(종부세) 세율표</h2>

        <div className="space-y-4">
          <ComprehensiveTaxRateTable
            title="현재 (2026.03 현행) 종부세율"
            color="blue"
            normalRates={[0.5, 0.7, 1.0, 1.3, 1.5, 2.0, 2.7]}
            surtaxRates={[0.5, 0.7, 1.0, 2.0, 3.0, 4.0, 5.0]}
          />
          <ComprehensiveTaxRateTable
            title="과거 (2021년 최고점) 종부세율"
            color="red"
            normalRates={[0.6, 0.8, 1.2, 1.6, 2.2, 3.0, 3.0]}
            surtaxRates={[1.2, 1.6, 2.2, 3.6, 5.0, 6.0, 6.0]}
          />
          <ComprehensiveTaxRateTable
            title="미래 시뮬레이션 종부세율 (과거기준 적용)"
            color="orange"
            normalRates={[0.6, 0.8, 1.2, 1.6, 2.2, 3.0, 3.0]}
            surtaxRates={[1.2, 1.6, 2.2, 3.6, 5.0, 6.0, 6.0]}
            surtaxLabel={surtaxLabels[surtaxCriteria]}
          />
        </div>
      </section>

      {/* [기준표 3] 재산세 누진 산정표 */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50/30 border border-blue-200 rounded-2xl p-5 sm:p-6">
        <h2 className="text-sm font-bold text-blue-800 mb-3">[기준표 3] 재산세 누진 산정표 (1주택 특례 포함)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[400px]">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 px-2 font-medium text-gray-500">과세표준 구간</th>
                <th className="text-center py-2 px-2 font-medium text-gray-500">세율 (일반)</th>
                <th className="text-center py-2 px-2 font-medium text-gray-500">9억 이하 1주택 특례</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 px-2">6천만원 이하</td>
                <td className="py-2 px-2 text-center">0.10%</td>
                <td className="py-2 px-2 text-center">0.05%</td>
              </tr>
              <tr>
                <td className="py-2 px-2">1억 5천만원 이하</td>
                <td className="py-2 px-2 text-center">6만 + 초과분 0.15%</td>
                <td className="py-2 px-2 text-center">3만 + 초과분 0.1%</td>
              </tr>
              <tr>
                <td className="py-2 px-2">3억원 이하</td>
                <td className="py-2 px-2 text-center">19.5만 + 초과분 0.25%</td>
                <td className="py-2 px-2 text-center">12만 + 초과분 0.2%</td>
              </tr>
              <tr>
                <td className="py-2 px-2">3억원 초과</td>
                <td className="py-2 px-2 text-center">57만 + 초과분 0.4%</td>
                <td className="py-2 px-2 text-center">42만 + 초과분 0.35%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[10px] text-gray-400">
          * 최종 고지액 = 재산세 본세 + 지방교육세(본세의 20%) + 도시지역분(과표의 0.14%)
        </p>
        <p className="text-[10px] text-gray-400">
          * 재산세 기준은 현행법(누진공제 산식)을 공통으로 사용하며, 시나리오별로 공정시장가액비율만 다르게 적용됩니다.
        </p>
      </section>
    </>
  )
}

function ComprehensiveTaxRateTable({ title, color, normalRates, surtaxRates, surtaxLabel }: {
  title: string
  color: 'blue' | 'red' | 'orange'
  normalRates: number[]
  surtaxRates: number[]
  surtaxLabel?: string
}) {
  const brackets = ['3억 원 이하', '6억 원 이하', '12억 원 이하', '25억 원 이하', '50억 원 이하', '94억 원 이하', '94억 초과']
  const dotColor = { blue: 'bg-blue-500', red: 'bg-red-500', orange: 'bg-orange-500' }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full ${dotColor[color]}`} />
        <span className="text-xs font-medium text-gray-700">{title}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[350px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-1.5 px-2 font-medium text-gray-500">과세표준 구간</th>
              <th className="text-center py-1.5 px-2 font-medium text-gray-500">일반</th>
              <th className="text-center py-1.5 px-2 font-medium text-gray-500">
                중과{surtaxLabel ? <div className="text-[9px] font-normal text-gray-400">({surtaxLabel})</div> : null}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {brackets.map((bracket, i) => (
              <tr key={i}>
                <td className="py-1.5 px-2">{bracket}</td>
                <td className="py-1.5 px-2 text-center">{normalRates[i]}%</td>
                <td className="py-1.5 px-2 text-center">{surtaxRates[i]}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
