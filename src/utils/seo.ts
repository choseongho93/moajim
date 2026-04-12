/**
 * SEO 유틸리티 — 페이지별 메타 태그 동적 업데이트
 */

const BASE_URL = 'https://moajim.com'

const DEFAULT_META = {
  title: '모아짐 - 스마트한 자산 관리 플랫폼 | 포트폴리오 분석 & 부동산 세금 계산기',
  description: '복잡한 포트폴리오 분석과 부동산 세금 계산을 쉽게. 현금, 주식, 부동산 자산을 입력하고 맞춤형 투자 전략을 받아보세요. 양도세, 취득세 계산기 무료 제공.',
}

const PAGE_SEO: Record<string, { title: string; description: string; keywords?: string }> = {
  // 세금 계산기
  'view=calculator': {
    title: '부동산 세금 계산기 - 모아짐',
    description: '증여세, 상속세, 취득세, 양도소득세, 보유세를 쉽고 빠르게 계산해보세요. 무료 부동산 세금 계산기.',
    keywords: '증여세 계산기, 상속세 계산기, 취득세 계산기, 양도소득세 계산기, 보유세 계산기, 부동산 세금',
  },
  'view=calculator&sub=gift-tax': {
    title: '증여세 계산기 - 모아짐',
    description: '증여세를 쉽고 빠르게 계산해보세요. 가족 간 증여 시 발생하는 증여세를 현행 세법에 맞춰 정확하게 계산합니다.',
    keywords: '증여세 계산기, 증여세율, 증여 공제, 가족간 증여, 부동산 증여',
  },
  'view=calculator&sub=inheritance-tax': {
    title: '상속세 계산기 - 모아짐',
    description: '상속세를 쉽고 빠르게 계산해보세요. 상속 재산에 대한 세금을 배우자, 자녀 등 상속인별로 상세하게 계산합니다.',
    keywords: '상속세 계산기, 상속세율, 상속 공제, 배우자 상속, 자녀 상속',
  },
  'view=calculator&sub=acquisition-tax': {
    title: '취득세 계산기 - 모아짐',
    description: '부동산 취득세를 쉽고 빠르게 계산해보세요. 주택, 토지, 상가 등 부동산 구매 시 취득세를 계산합니다.',
    keywords: '취득세 계산기, 부동산 취득세, 주택 취득세, 다주택 취득세, 취득세율',
  },
  'view=calculator&sub=capital-gains-tax': {
    title: '양도소득세 계산기 - 모아짐',
    description: '양도소득세를 쉽고 빠르게 계산해보세요. 부동산 매도 시 발생하는 양도소득세를 정확하게 계산합니다.',
    keywords: '양도소득세 계산기, 양도세 계산, 부동산 양도세, 1세대 1주택 비과세',
  },
  'view=calculator&sub=holding-tax': {
    title: '보유세 계산기 - 모아짐',
    description: '재산세와 종합부동산세를 쉽고 빠르게 계산해보세요. 부동산 보유 시 발생하는 세금을 정확하게 계산합니다.',
    keywords: '보유세 계산기, 재산세 계산기, 종합부동산세 계산기, 종부세, 재산세',
  },

  // 부동산 도구
  'view=tools': {
    title: '부동산 도구 모음 - 모아짐',
    description: '중개보수, 법무사 보수료, 전월세 전환 등 부동산 관련 계산기를 무료로 사용하세요.',
    keywords: '중개보수 계산기, 법무사 보수료, 전월세 전환 계산기, 부동산 도구',
  },
  'view=tools&sub=brokerage-fee': {
    title: '중개보수 계산기 - 모아짐',
    description: '부동산 중개수수료를 쉽고 빠르게 계산해보세요. 매매, 전세, 월세 거래 시 중개보수를 계산합니다.',
    keywords: '중개보수 계산기, 중개수수료 계산기, 부동산 중개료, 복비 계산',
  },
  'view=tools&sub=lawyer-fee': {
    title: '법무사 보수료 계산기 - 모아짐',
    description: '부동산 등기 법무사 비용을 계산해보세요. 소유권 이전, 설정 등기 시 법무사 보수료를 계산합니다.',
    keywords: '법무사 보수료, 법무사 비용, 등기 비용, 소유권 이전 비용',
  },
  'view=tools&sub=rent-conversion': {
    title: '전월세 전환 계산기 - 모아짐',
    description: '전세 ↔ 월세 전환 적정 금액을 계산해보세요. 전월세 전환율에 따른 적정 월세와 보증금을 계산합니다.',
    keywords: '전월세 전환 계산기, 전세 월세 전환, 전환율 계산, 적정 월세',
  },

  // 금융 계산기
  'view=finance': {
    title: '금융 계산기 모음 - 모아짐',
    description: '대출 이자, 예적금 이자, 담보 대출 가능액 등 금융 계산기를 무료로 사용하세요.',
    keywords: '대출 이자 계산기, 예적금 이자 계산기, 담보 대출 계산기, 금융 계산기',
  },
  'view=finance&sub=loan-interest': {
    title: '대출 이자 계산기 - 모아짐',
    description: '대출 이자와 월 상환금을 쉽고 빠르게 계산해보세요. 원리금균등, 원금균등, 만기일시 등 상환방법별 비교.',
    keywords: '대출 이자 계산기, 월 상환금 계산, 원리금균등 상환, 대출 이자',
  },
  'view=finance&sub=mortgage-loan': {
    title: '담보 대출 가능액 계산기 - 모아짐',
    description: 'LTV 기준 담보 대출 가능 금액을 계산해보세요. 지역별, 주택유형별 대출 한도를 확인합니다.',
    keywords: '담보 대출 가능액, LTV 계산기, 주택담보대출 한도, 대출 한도 계산',
  },
  'view=finance&sub=savings-interest': {
    title: '예적금 이자 계산기 - 모아짐',
    description: '예금·적금 이자 수익을 단리/복리로 계산해보세요. 세전·세후 이자를 비교합니다.',
    keywords: '예적금 이자 계산기, 적금 이자 계산, 예금 이자, 복리 계산기',
  },
  'view=finance&sub=early-repayment': {
    title: '중도상환수수료 계산기 - 모아짐',
    description: '대출 중도상환 시 발생하는 수수료를 빠르게 계산해보세요. 잔존기간, 상환금액에 따른 수수료 산출.',
    keywords: '중도상환수수료 계산기, 중도상환 수수료, 조기상환 수수료, 대출 상환',
  },
  'view=finance&sub=loan-refinance': {
    title: '대출 대환 계산기 - 모아짐',
    description: '대출 대환 시 변경되는 이자를 비교해보세요. 기존 대출과 신규 대출의 이자 차이를 계산합니다.',
    keywords: '대출 대환 계산기, 대환 대출 이자 비교, 대출 갈아타기',
  },
  'view=finance&sub=estimated-income': {
    title: '추정소득 계산기 - 모아짐',
    description: '인정소득·신고소득 기준으로 추정 연소득을 계산해보세요. 대출 심사 시 활용되는 추정소득을 산출합니다.',
    keywords: '추정소득 계산기, 인정소득, 신고소득, 대출 소득 산정',
  },
  'view=finance&sub=auction-loan': {
    title: '경락잔금대출 한도 계산기 - 모아짐',
    description: '경매 낙찰 시 금융권별 대출 가능 한도를 계산해보세요. 1금융권, 2금융권 대출 한도를 비교합니다.',
    keywords: '경락잔금대출 계산기, 경매 대출 한도, 경락대출, 낙찰 대출',
  },
  'view=finance&sub=jeonse-guarantee': {
    title: '전세보증보험 계산기 - 모아짐',
    description: '전세보증보험(전세금반환보증) 보증료를 계산해보세요. HUG, SGI, HF 보증 기관별 보증료를 비교합니다.',
    keywords: '전세보증보험 계산기, 전세보증금반환보증, 전세보증료, HUG 보증료, SGI 보증료',
  },

  // 기타
  'view=portfolio': {
    title: '자산 포트폴리오 분석 - 모아짐',
    description: '내 자산을 분석하고 맞춤 투자 전략을 받아보세요. 현금, 주식, 부동산, 귀금속 등 보유 자산을 분석합니다.',
    keywords: '포트폴리오 분석, 자산 분석, 투자 전략, 자산 배분',
  },
  'view=property-tax': {
    title: '2026 보유세 예측하기 - 모아짐',
    description: '2026년 보유세를 미리 시뮬레이션해보세요. 공시가격 변동에 따른 재산세·종부세 예측.',
    keywords: '2026 보유세 예측, 보유세 시뮬레이션, 재산세 예측, 종부세 예측',
  },
  'view=privacy': {
    title: '개인정보 처리방침 - 모아짐',
    description: '모아짐의 개인정보 처리방침을 확인하세요.',
  },
}

function setMetaTag(attr: string, key: string, value: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
  if (el) {
    el.content = value
  } else {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    el.content = value
    document.head.appendChild(el)
  }
}

/** 현재 URL에 맞게 document.title, meta description, og 태그, canonical을 갱신 */
export function updateSeoMeta() {
  const query = window.location.search.replace('?', '')

  // 가장 구체적인 키부터 매칭 (view=finance&sub=loan-interest → view=finance → default)
  let meta = DEFAULT_META as { title: string; description: string; keywords?: string }
  for (const key of Object.keys(PAGE_SEO)) {
    if (query.includes(key) && key.length > (Object.keys(PAGE_SEO).find(k => query.includes(k) && k !== key && key.startsWith(k))?.length || 0)) {
      // 더 구체적인 키를 우선 매칭
    }
  }

  // 가장 긴 매칭 키 찾기 (가장 구체적)
  let bestKey = ''
  for (const key of Object.keys(PAGE_SEO)) {
    if (query.includes(key) && key.length > bestKey.length) {
      bestKey = key
    }
  }
  if (bestKey) {
    meta = PAGE_SEO[bestKey]
  }

  // document.title
  document.title = meta.title

  // meta description
  setMetaTag('name', 'description', meta.description)
  setMetaTag('name', 'title', meta.title)

  // keywords
  if (meta.keywords) {
    setMetaTag('name', 'keywords', meta.keywords)
  }

  // canonical
  const canonicalUrl = query ? `${BASE_URL}/?${query}` : `${BASE_URL}/`
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (canonical) {
    canonical.href = canonicalUrl
  } else {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    canonical.href = canonicalUrl
    document.head.appendChild(canonical)
  }

  // Open Graph
  setMetaTag('property', 'og:title', meta.title)
  setMetaTag('property', 'og:description', meta.description)
  setMetaTag('property', 'og:url', canonicalUrl)

  // Twitter
  setMetaTag('property', 'twitter:title', meta.title)
  setMetaTag('property', 'twitter:description', meta.description)
  setMetaTag('property', 'twitter:url', canonicalUrl)
}
