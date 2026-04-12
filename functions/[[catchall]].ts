/**
 * Cloudflare Pages Function — SSR 미들웨어
 *
 * 모든 페이지 요청을 가로채서 index.html에 페이지별 메타 태그와
 * 실제 콘텐츠를 주입한 뒤 응답합니다.
 * → 크롤러(Google, AdSense, Naver)가 JS 실행 없이도 콘텐츠를 볼 수 있음
 * → 브라우저에서는 React가 로드되면 #root 내용을 대체하므로 기존과 동일
 */

interface PageSeo {
  title: string
  description: string
  keywords?: string
  content: string  // 크롤러용 HTML 콘텐츠
}

const BASE_URL = 'https://moajim.com'

const DEFAULT_SEO: PageSeo = {
  title: '모아짐 - 스마트한 자산 관리 플랫폼 | 포트폴리오 분석 & 부동산 세금 계산기',
  description: '복잡한 포트폴리오 분석과 부동산 세금 계산을 쉽게. 현금, 주식, 부동산 자산을 입력하고 맞춤형 투자 전략을 받아보세요.',
  content: `
    <h1>모아짐 - 스마트한 자산 관리 플랫폼</h1>
    <p>복잡한 포트폴리오 분석과 부동산 세금 계산을 쉽게. 회원가입 없이 모든 기능을 무료로 사용하세요.</p>
    <h2>세금 계산기</h2>
    <ul>
      <li><a href="/?view=calculator&sub=gift-tax">증여세 계산기</a> - 가족 간 증여 시 발생하는 증여세를 현행 세법에 맞춰 계산합니다.</li>
      <li><a href="/?view=calculator&sub=inheritance-tax">상속세 계산기</a> - 상속 재산에 대한 세금을 배우자, 자녀 등 상속인별로 계산합니다.</li>
      <li><a href="/?view=calculator&sub=acquisition-tax">취득세 계산기</a> - 부동산 구매 시 내야 하는 취득세를 계산합니다.</li>
      <li><a href="/?view=calculator&sub=capital-gains-tax">양도소득세 계산기</a> - 부동산 매도 시 발생하는 양도소득세를 계산합니다.</li>
      <li><a href="/?view=calculator&sub=holding-tax">보유세 계산기</a> - 재산세와 종합부동산세를 계산합니다.</li>
    </ul>
    <h2>부동산 도구</h2>
    <ul>
      <li><a href="/?view=property-tax">2026 보유세 예측하기</a> - 2026년 보유세를 시뮬레이션합니다.</li>
      <li><a href="/?view=tools&sub=brokerage-fee">중개보수 계산기</a> - 부동산 중개수수료를 계산합니다.</li>
      <li><a href="/?view=tools&sub=lawyer-fee">법무사 보수료 계산기</a> - 등기 법무사 비용을 계산합니다.</li>
      <li><a href="/?view=tools&sub=rent-conversion">전월세 전환 계산기</a> - 전세 ↔ 월세 전환 적정 금액을 계산합니다.</li>
    </ul>
    <h2>금융 계산기</h2>
    <ul>
      <li><a href="/?view=finance&sub=loan-interest">대출 이자 계산기</a> - 상환방법별 월 상환금과 총 이자를 계산합니다.</li>
      <li><a href="/?view=finance&sub=mortgage-loan">담보 대출 가능액</a> - LTV 기준 대출 가능 금액을 계산합니다.</li>
      <li><a href="/?view=finance&sub=savings-interest">예적금 이자 계산기</a> - 단리/복리로 이자 수익을 계산합니다.</li>
      <li><a href="/?view=finance&sub=early-repayment">중도상환수수료 계산기</a> - 대출 중도상환 수수료를 계산합니다.</li>
      <li><a href="/?view=finance&sub=loan-refinance">대출 대환 계산기</a> - 대환 시 이자 차이를 비교합니다.</li>
      <li><a href="/?view=finance&sub=estimated-income">추정소득 계산기</a> - 인정소득·신고소득 기준 추정 연소득을 계산합니다.</li>
      <li><a href="/?view=finance&sub=auction-loan">경락잔금대출 한도</a> - 경매 낙찰 시 대출 가능 한도를 계산합니다.</li>
      <li><a href="/?view=finance&sub=jeonse-guarantee">전세보증보험 계산기</a> - 전세보증보험 보증료를 기관별로 비교합니다.</li>
    </ul>
    <h2>포트폴리오 분석</h2>
    <p><a href="/?view=portfolio">자산 포트폴리오 분석</a> - 현금, 주식, 부동산, 귀금속 등 보유 자산을 입력하고 투자 대가들의 포트폴리오와 비교하여 맞춤 조언을 받아보세요.</p>
  `,
}

const PAGES: Record<string, PageSeo> = {
  // ── 세금 계산기 ──
  'view=calculator': {
    title: '부동산 세금 계산기 - 모아짐',
    description: '증여세, 상속세, 취득세, 양도소득세, 보유세를 쉽고 빠르게 계산해보세요. 무료 부동산 세금 계산기.',
    keywords: '증여세 계산기, 상속세 계산기, 취득세 계산기, 양도소득세 계산기, 보유세 계산기',
    content: `
      <h1>부동산 세금 계산기 - 모아짐</h1>
      <p>부동산과 관련된 각종 세금을 쉽고 빠르게 계산해보세요. 현행 세법을 반영한 정확한 계산 결과를 무료로 제공합니다.</p>
      <h2>제공되는 세금 계산기</h2>
      <ul>
        <li><a href="/?view=calculator&sub=gift-tax">증여세 계산기</a> - 가족 간 증여 시 발생하는 증여세를 현행 세법에 맞춰 계산합니다.</li>
        <li><a href="/?view=calculator&sub=inheritance-tax">상속세 계산기</a> - 상속 재산에 대한 세금을 상속인별로 상세하게 계산합니다.</li>
        <li><a href="/?view=calculator&sub=acquisition-tax">취득세 계산기</a> - 주택, 토지, 상가 등 부동산 구매 시 취득세를 계산합니다.</li>
        <li><a href="/?view=calculator&sub=capital-gains-tax">양도소득세 계산기</a> - 부동산 매도 시 발생하는 양도소득세를 계산합니다.</li>
        <li><a href="/?view=calculator&sub=holding-tax">보유세 계산기</a> - 재산세와 종합부동산세를 계산합니다.</li>
      </ul>
    `,
  },
  'view=calculator&sub=gift-tax': {
    title: '증여세 계산기 - 모아짐',
    description: '증여세를 쉽고 빠르게 계산해보세요. 가족 간 증여 시 발생하는 증여세를 현행 세법에 맞춰 정확하게 계산합니다.',
    keywords: '증여세 계산기, 증여세율, 증여 공제, 가족간 증여, 부동산 증여',
    content: `
      <h1>증여세 계산기 - 모아짐</h1>
      <p>가족 간 증여 시 발생하는 증여세를 현행 세법에 맞춰 정확하게 계산합니다. 증여자와 수증자의 관계, 증여 재산 가액, 기존 증여 이력 등을 입력하면 납부해야 할 증여세를 확인할 수 있습니다.</p>
      <h2>증여세 계산 방법</h2>
      <p>증여세 = (증여재산가액 - 증여재산공제) × 세율 - 누진공제</p>
      <h2>증여재산공제 한도</h2>
      <ul>
        <li>배우자로부터 증여: 6억원</li>
        <li>직계존속으로부터 증여: 5,000만원 (미성년자 2,000만원)</li>
        <li>직계비속으로부터 증여: 5,000만원</li>
        <li>기타 친족으로부터 증여: 1,000만원</li>
      </ul>
    `,
  },
  'view=calculator&sub=inheritance-tax': {
    title: '상속세 계산기 - 모아짐',
    description: '상속세를 쉽고 빠르게 계산해보세요. 상속 재산에 대한 세금을 배우자, 자녀 등 상속인별로 상세하게 계산합니다.',
    keywords: '상속세 계산기, 상속세율, 상속 공제, 배우자 상속, 자녀 상속',
    content: `
      <h1>상속세 계산기 - 모아짐</h1>
      <p>상속 재산에 대한 세금을 배우자, 자녀 등 상속인별로 상세하게 계산합니다. 상속재산 총액, 채무, 공과금 등을 입력하면 납부해야 할 상속세를 확인할 수 있습니다.</p>
      <h2>상속세 기본 공제</h2>
      <ul>
        <li>기초공제: 2억원</li>
        <li>배우자 상속공제: 최소 5억원 ~ 최대 30억원</li>
        <li>일괄공제: 5억원 (기초공제 + 인적공제 합산 대비 유리한 쪽 선택)</li>
      </ul>
    `,
  },
  'view=calculator&sub=acquisition-tax': {
    title: '취득세 계산기 - 모아짐',
    description: '부동산 취득세를 쉽고 빠르게 계산해보세요. 주택, 토지, 상가 등 부동산 구매 시 취득세를 계산합니다.',
    keywords: '취득세 계산기, 부동산 취득세, 주택 취득세, 다주택 취득세, 취득세율',
    content: `
      <h1>취득세 계산기 - 모아짐</h1>
      <p>부동산 구매 시 내야 하는 취득세를 간편하게 계산합니다. 주택 수, 거래 유형, 취득가액에 따른 정확한 취득세를 확인하세요.</p>
      <h2>주택 취득세율</h2>
      <ul>
        <li>1주택 (6억 이하): 1%</li>
        <li>1주택 (6억~9억): 1~3%</li>
        <li>1주택 (9억 초과): 3%</li>
        <li>2주택 (조정지역): 8%</li>
        <li>3주택 이상: 12%</li>
      </ul>
    `,
  },
  'view=calculator&sub=capital-gains-tax': {
    title: '양도소득세 계산기 - 모아짐',
    description: '양도소득세를 쉽고 빠르게 계산해보세요. 부동산 매도 시 발생하는 양도소득세를 정확하게 계산합니다.',
    keywords: '양도소득세 계산기, 양도세 계산, 부동산 양도세, 1세대 1주택 비과세',
    content: `
      <h1>양도소득세 계산기 - 모아짐</h1>
      <p>부동산 매도 시 발생하는 양도소득세를 정확하게 계산합니다. 취득가액, 양도가액, 보유기간, 필요경비 등을 입력하면 납부할 세금을 확인할 수 있습니다.</p>
      <h2>양도소득세 계산 방법</h2>
      <p>양도소득세 = (양도가액 - 취득가액 - 필요경비 - 장기보유특별공제 - 기본공제) × 세율</p>
      <h2>1세대 1주택 비과세 요건</h2>
      <p>2년 이상 보유(조정대상지역은 2년 거주 포함) 시 양도차익 12억원까지 비과세</p>
    `,
  },
  'view=calculator&sub=holding-tax': {
    title: '보유세 계산기 - 모아짐',
    description: '재산세와 종합부동산세를 쉽고 빠르게 계산해보세요. 부동산 보유 시 발생하는 세금을 정확하게 계산합니다.',
    keywords: '보유세 계산기, 재산세 계산기, 종합부동산세 계산기, 종부세, 재산세',
    content: `
      <h1>보유세 계산기 - 모아짐</h1>
      <p>부동산 보유 시 매년 납부해야 하는 재산세와 종합부동산세를 정확하게 계산합니다. 공시가격과 보유 주택 수를 입력하면 보유세 총액을 확인할 수 있습니다.</p>
      <h2>보유세 구성</h2>
      <ul>
        <li>재산세: 매년 7월, 9월 납부 (주택 공시가격 기준)</li>
        <li>종합부동산세: 매년 12월 납부 (공시가격 합산 기준 초과분)</li>
      </ul>
    `,
  },

  // ── 부동산 도구 ──
  'view=tools': {
    title: '부동산 도구 모음 - 모아짐',
    description: '중개보수, 법무사 보수료, 전월세 전환 등 부동산 관련 계산기를 무료로 사용하세요.',
    keywords: '중개보수 계산기, 법무사 보수료, 전월세 전환 계산기, 부동산 도구',
    content: `
      <h1>부동산 도구 모음 - 모아짐</h1>
      <p>부동산 거래 시 필요한 다양한 계산 도구를 무료로 제공합니다.</p>
      <ul>
        <li><a href="/?view=tools&sub=brokerage-fee">중개보수 계산기</a> - 매매, 전세, 월세 거래 시 중개수수료를 계산합니다.</li>
        <li><a href="/?view=tools&sub=lawyer-fee">법무사 보수료 계산기</a> - 소유권 이전, 설정 등기 시 법무사 비용을 계산합니다.</li>
        <li><a href="/?view=tools&sub=rent-conversion">전월세 전환 계산기</a> - 전세 ↔ 월세 전환 적정 금액을 계산합니다.</li>
      </ul>
    `,
  },
  'view=tools&sub=brokerage-fee': {
    title: '중개보수 계산기 - 모아짐',
    description: '부동산 중개수수료를 쉽고 빠르게 계산해보세요. 매매, 전세, 월세 거래 시 중개보수를 계산합니다.',
    keywords: '중개보수 계산기, 중개수수료 계산기, 부동산 중개료, 복비 계산',
    content: `
      <h1>중개보수 계산기 - 모아짐</h1>
      <p>부동산 거래 시 발생하는 중개수수료(복비)를 쉽고 빠르게 계산합니다. 매매, 전세, 월세 거래 유형과 거래금액을 입력하면 상한 요율에 따른 중개보수를 확인할 수 있습니다.</p>
      <h2>중개보수 요율 (주택 매매 기준)</h2>
      <ul>
        <li>5천만원 미만: 0.6% (한도 25만원)</li>
        <li>5천만원~2억 미만: 0.5% (한도 80만원)</li>
        <li>2억~9억 미만: 0.4%</li>
        <li>9억~12억 미만: 0.5%</li>
        <li>12억 이상: 0.7%</li>
      </ul>
    `,
  },
  'view=tools&sub=lawyer-fee': {
    title: '법무사 보수료 계산기 - 모아짐',
    description: '부동산 등기 법무사 비용을 계산해보세요. 소유권 이전, 설정 등기 시 법무사 보수료를 계산합니다.',
    keywords: '법무사 보수료, 법무사 비용, 등기 비용, 소유권 이전 비용',
    content: `
      <h1>법무사 보수료 계산기 - 모아짐</h1>
      <p>부동산 등기 시 필요한 법무사 보수료를 계산합니다. 소유권 이전 등기, 근저당 설정 등기 등 등기 유형과 부동산 가액을 입력하면 예상 비용을 확인할 수 있습니다.</p>
    `,
  },
  'view=tools&sub=rent-conversion': {
    title: '전월세 전환 계산기 - 모아짐',
    description: '전세 ↔ 월세 전환 적정 금액을 계산해보세요. 전월세 전환율에 따른 적정 월세와 보증금을 계산합니다.',
    keywords: '전월세 전환 계산기, 전세 월세 전환, 전환율 계산, 적정 월세',
    content: `
      <h1>전월세 전환 계산기 - 모아짐</h1>
      <p>전세에서 월세로, 월세에서 전세로 전환 시 적정 금액을 계산합니다. 전월세 전환율과 보증금, 월세를 입력하면 적정 전환 금액을 확인할 수 있습니다.</p>
      <h2>전월세 전환율 공식</h2>
      <p>월세 = (전세금 - 보증금) × 전환율 ÷ 12</p>
    `,
  },

  // ── 보유세 예측 ──
  'view=property-tax': {
    title: '2026 보유세 예측하기 - 모아짐',
    description: '2026년 보유세를 미리 시뮬레이션해보세요. 공시가격 변동에 따른 재산세·종부세 예측.',
    keywords: '2026 보유세 예측, 보유세 시뮬레이션, 재산세 예측, 종부세 예측',
    content: `
      <h1>2026 보유세 예측하기 - 모아짐</h1>
      <p>2026년 예상 공시가격을 기반으로 보유세(재산세 + 종합부동산세)를 미리 시뮬레이션해보세요. 공시가격 변동률, 공정시장가액비율 등을 반영한 예측 결과를 제공합니다.</p>
    `,
  },

  // ── 금융 계산기 ──
  'view=finance': {
    title: '금융 계산기 모음 - 모아짐',
    description: '대출 이자, 예적금 이자, 담보 대출 가능액 등 금융 계산기를 무료로 사용하세요.',
    keywords: '대출 이자 계산기, 예적금 이자 계산기, 담보 대출 계산기, 금융 계산기',
    content: `
      <h1>금융 계산기 모음 - 모아짐</h1>
      <p>대출, 이자 등 금융 계산을 쉽고 빠르게 할 수 있습니다.</p>
      <ul>
        <li><a href="/?view=finance&sub=loan-interest">대출 이자 계산기</a> - 상환방법별 월 상환금과 총 이자를 계산합니다.</li>
        <li><a href="/?view=finance&sub=mortgage-loan">담보 대출 가능액</a> - LTV 기준 대출 가능 금액을 계산합니다.</li>
        <li><a href="/?view=finance&sub=savings-interest">예적금 이자 계산기</a> - 단리/복리 이자 수익을 계산합니다.</li>
        <li><a href="/?view=finance&sub=early-repayment">중도상환수수료 계산기</a> - 중도상환 수수료를 계산합니다.</li>
        <li><a href="/?view=finance&sub=loan-refinance">대출 대환 계산기</a> - 대환 시 이자 차이를 비교합니다.</li>
        <li><a href="/?view=finance&sub=estimated-income">추정소득 계산기</a> - 추정 연소득을 계산합니다.</li>
        <li><a href="/?view=finance&sub=auction-loan">경락잔금대출 한도</a> - 경매 낙찰 시 대출 한도를 계산합니다.</li>
        <li><a href="/?view=finance&sub=jeonse-guarantee">전세보증보험 계산기</a> - 전세보증보험 보증료를 비교합니다.</li>
      </ul>
    `,
  },
  'view=finance&sub=loan-interest': {
    title: '대출 이자 계산기 - 모아짐',
    description: '대출 이자와 월 상환금을 쉽고 빠르게 계산해보세요. 원리금균등, 원금균등, 만기일시 등 상환방법별 비교.',
    keywords: '대출 이자 계산기, 월 상환금 계산, 원리금균등 상환, 대출 이자',
    content: `
      <h1>대출 이자 계산기 - 모아짐</h1>
      <p>대출 시 납부해야 할 이자를 계산합니다. 상환방법, 대출기간, 이율에 따른 월별 상환 내역과 총 납부 이자를 확인할 수 있습니다.</p>
      <h2>상환 방법</h2>
      <ul>
        <li>만기일시상환 - 원금은 만기에 전액 상환, 매월 이자만 납부</li>
        <li>원금균등분할상환 - 매달 같은 비율로 원금을 상환, 이자는 점차 감소</li>
        <li>원리금균등분할상환 - 매달 균등하게 같은 금액을 납부</li>
        <li>체증식분할상환 - 초기 적은 금액, 점차 증가하는 방식</li>
      </ul>
    `,
  },
  'view=finance&sub=mortgage-loan': {
    title: '담보 대출 가능액 계산기 - 모아짐',
    description: 'LTV 기준 담보 대출 가능 금액을 계산해보세요. 지역별, 주택유형별 대출 한도를 확인합니다.',
    keywords: '담보 대출 가능액, LTV 계산기, 주택담보대출 한도, 대출 한도 계산',
    content: `
      <h1>담보 대출 가능액 계산기 - 모아짐</h1>
      <p>LTV(담보인정비율) 기준으로 담보 대출 가능 금액을 계산합니다. 규제지역, 주택유형, 보유주택 수에 따른 대출 한도를 확인하세요.</p>
      <h2>LTV 기준</h2>
      <ul>
        <li>비규제지역 무주택자: 최대 70%</li>
        <li>조정대상지역 무주택자: 최대 50%</li>
        <li>투기과열지구 무주택자: 최대 40%</li>
      </ul>
    `,
  },
  'view=finance&sub=savings-interest': {
    title: '예적금 이자 계산기 - 모아짐',
    description: '예금·적금 이자 수익을 단리/복리로 계산해보세요. 세전·세후 이자를 비교합니다.',
    keywords: '예적금 이자 계산기, 적금 이자 계산, 예금 이자, 복리 계산기',
    content: `
      <h1>예적금 이자 계산기 - 모아짐</h1>
      <p>예금(거치식)과 적금(적립식)의 이자 수익을 단리와 복리로 계산합니다. 세전이자, 이자소득세, 세후 수령액을 비교해보세요.</p>
      <h2>이자소득세</h2>
      <p>기본세율: 소득세 14% + 지방소득세 1.4% = 15.4%</p>
    `,
  },
  'view=finance&sub=early-repayment': {
    title: '중도상환수수료 계산기 - 모아짐',
    description: '대출 중도상환 시 발생하는 수수료를 빠르게 계산해보세요.',
    keywords: '중도상환수수료 계산기, 중도상환 수수료, 조기상환 수수료',
    content: `
      <h1>중도상환수수료 계산기 - 모아짐</h1>
      <p>대출을 본래 정해진 기일보다 일찍 상환하는 경우 금융기관에서 부과하는 수수료를 계산합니다.</p>
      <h2>계산 공식</h2>
      <p>중도상환수수료 = 중도상환원금 × 수수료율 × (잔존기간 ÷ 대출기간)</p>
      <p>2025년 1월 13일부터 중도상환 수수료가 대폭 인하되었습니다.</p>
    `,
  },
  'view=finance&sub=loan-refinance': {
    title: '대출 대환 계산기 - 모아짐',
    description: '대출 대환 시 변경되는 이자를 비교해보세요.',
    keywords: '대출 대환 계산기, 대환 대출 이자 비교, 대출 갈아타기',
    content: `
      <h1>대출 대환 계산기 - 모아짐</h1>
      <p>기존 대출을 새로운 대출로 갈아탈 때 이자 차이와 절감액을 비교합니다. 기존 대출의 잔여 원금, 금리와 신규 대출 조건을 입력하면 대환 효과를 확인할 수 있습니다.</p>
    `,
  },
  'view=finance&sub=estimated-income': {
    title: '추정소득 계산기 - 모아짐',
    description: '인정소득·신고소득 기준으로 추정 연소득을 계산해보세요.',
    keywords: '추정소득 계산기, 인정소득, 신고소득, 대출 소득 산정',
    content: `
      <h1>추정소득 계산기 - 모아짐</h1>
      <p>대출 심사 시 활용되는 추정소득을 계산합니다. 인정소득(건강보험료, 국민연금 기반)과 신고소득(종합소득세 신고 기반) 기준으로 연소득을 산출합니다.</p>
    `,
  },
  'view=finance&sub=auction-loan': {
    title: '경락잔금대출 한도 계산기 - 모아짐',
    description: '경매 낙찰 시 금융권별 대출 가능 한도를 계산해보세요.',
    keywords: '경락잔금대출 계산기, 경매 대출 한도, 경락대출, 낙찰 대출',
    content: `
      <h1>경락잔금대출 한도 계산기 - 모아짐</h1>
      <p>주택 등 부동산 경매 낙찰 시 1금융권, 2금융권에서 대출 가능한 한도 예상액을 산출합니다. 감정가, 낙찰가, 현재 시세를 입력하면 금융권별 대출 한도를 비교할 수 있습니다.</p>
    `,
  },
  'view=finance&sub=jeonse-guarantee': {
    title: '전세보증보험 계산기 - 모아짐',
    description: '전세보증보험(전세금반환보증) 보증료를 계산해보세요. HUG, SGI, HF 보증 기관별 비교.',
    keywords: '전세보증보험 계산기, 전세보증금반환보증, 전세보증료, HUG 보증료',
    content: `
      <h1>전세보증보험 계산기 - 모아짐</h1>
      <p>전세보증보험(전세금반환보증) 가입 시 보증료를 기관별로 비교 계산합니다. HUG(주택도시보증공사), SGI(서울보증보험), HF(한국주택금융공사) 보증 상품의 보증료를 확인하세요.</p>
    `,
  },

  // ── 포트폴리오 ──
  'view=portfolio': {
    title: '자산 포트폴리오 분석 - 모아짐',
    description: '내 자산을 분석하고 맞춤 투자 전략을 받아보세요.',
    keywords: '포트폴리오 분석, 자산 분석, 투자 전략, 자산 배분',
    content: `
      <h1>자산 포트폴리오 분석 - 모아짐</h1>
      <p>현금, 주식, 부동산, 귀금속 등 보유 자산을 입력하면 투자 대가들의 포트폴리오와 비교하여 맞춤형 투자 전략과 조언을 제공합니다.</p>
    `,
  },

  // ── 개인정보 ──
  'view=privacy': {
    title: '개인정보 처리방침 - 모아짐',
    description: '모아짐의 개인정보 처리방침을 확인하세요.',
    content: `
      <h1>개인정보 처리방침 - 모아짐</h1>
      <p>모아짐의 개인정보 처리방침을 확인하세요.</p>
    `,
  },
}

/** URL query string에서 가장 구체적인 SEO 데이터 찾기 */
function findSeo(query: string): PageSeo {
  let bestKey = ''
  for (const key of Object.keys(PAGES)) {
    if (query.includes(key) && key.length > bestKey.length) {
      bestKey = key
    }
  }
  return bestKey ? PAGES[bestKey] : DEFAULT_SEO
}

/** HTML에 SEO 메타 태그와 콘텐츠 주입 */
function injectSeo(html: string, seo: PageSeo, query: string): string {
  const canonicalUrl = query ? `${BASE_URL}/?${query}` : `${BASE_URL}/`

  // <title> 교체
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${seo.title}</title>`)

  // meta name="title"
  html = html.replace(
    /<meta name="title" content="[^"]*"/,
    `<meta name="title" content="${seo.title}"`
  )

  // meta name="description"
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${seo.description}"`
  )

  // meta keywords
  if (seo.keywords) {
    html = html.replace(
      /<meta name="keywords" content="[^"]*"/,
      `<meta name="keywords" content="${seo.keywords}"`
    )
  }

  // canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${canonicalUrl}"`
  )

  // OG tags
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${canonicalUrl}"`
  )
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${seo.title}"`
  )
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${seo.description}"`
  )

  // Twitter tags
  html = html.replace(
    /<meta property="twitter:url" content="[^"]*"/,
    `<meta property="twitter:url" content="${canonicalUrl}"`
  )
  html = html.replace(
    /<meta property="twitter:title" content="[^"]*"/,
    `<meta property="twitter:title" content="${seo.title}"`
  )
  html = html.replace(
    /<meta property="twitter:description" content="[^"]*"/,
    `<meta property="twitter:description" content="${seo.description}"`
  )

  // <div id="root"></div>에 크롤러용 콘텐츠 주입
  // React가 로드되면 이 내용을 대체함
  const ssrContent = `<div id="root"><div style="max-width:800px;margin:0 auto;padding:40px 20px;font-family:sans-serif;color:#333">${seo.content}</div></div>`
  html = html.replace('<div id="root"></div>', ssrContent)

  return html
}

export const onRequest: PagesFunction<{ ASSETS: Fetcher }> = async (context) => {
  const url = new URL(context.request.url)

  // 정적 파일 (확장자가 있는 경로) → 그대로 통과
  if (url.pathname.match(/\.\w+$/) && url.pathname !== '/') {
    return context.next()
  }

  // /api/* → Worker가 처리
  if (url.pathname.startsWith('/api/')) {
    return context.next()
  }

  // index.html을 정적 에셋에서 직접 가져오기 (무한 루프 방지)
  const assetUrl = new URL('/index.html', context.request.url)
  const response = await context.env.ASSETS.fetch(assetUrl.toString())

  let html = await response.text()

  // SEO 데이터 찾기 & 주입
  const query = url.search.replace('?', '')
  const seo = findSeo(query)
  html = injectSeo(html, seo, query)

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  })
}
