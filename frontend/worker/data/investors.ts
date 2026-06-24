export interface InvestorProfile {
  id: string
  name: string
  nameEn: string
  description: string
  style: string
  allocation: {
    stocks: number
    bonds: number
    cash: number
    realEstate: number
    crypto?: number
    gold?: number
  }
  characteristics: string[]
}

export const INVESTORS: Record<string, InvestorProfile> = {
  "warren-buffett": {
    id: "warren-buffett",
    name: "워렌 버핏",
    nameEn: "Warren Buffett",
    description: "가치투자의 대가. 저평가된 우량주를 장기 보유하며, 안정적인 현금흐름을 중시합니다.",
    style: "가치투자 · 장기투자",
    allocation: {
      stocks: 70,
      bonds: 10,
      cash: 15,
      realEstate: 5,
      crypto: 0,
    },
    characteristics: [
      "저평가된 우량주 중심",
      "장기 보유 전략",
      "안정적인 배당주 선호",
      "높은 현금 비중 유지",
    ],
  },
  "peter-lynch": {
    id: "peter-lynch",
    name: "피터 린치",
    nameEn: "Peter Lynch",
    description: "성장주 투자의 달인. 이해할 수 있는 기업에 투자하며, 적극적인 분산투자를 추구합니다.",
    style: "성장주 투자 · 분산투자",
    allocation: {
      stocks: 85,
      bonds: 5,
      cash: 5,
      realEstate: 5,
      crypto: 0,
    },
    characteristics: [
      "성장 가능성이 높은 기업",
      "10~20개 종목 분산투자",
      "이해하는 산업에 집중",
      "적극적인 포트폴리오 관리",
    ],
  },
  "ray-dalio": {
    id: "ray-dalio",
    name: "레이 달리오",
    nameEn: "Ray Dalio",
    description: "올웨더 포트폴리오 창시자. 모든 경제 환경에서 안정적인 수익을 추구하는 분산투자 전략입니다.",
    style: "자산배분 · 리스크 패리티",
    allocation: {
      stocks: 30,
      bonds: 40,
      cash: 5,
      realEstate: 15,
      crypto: 0,
      gold: 10,
    },
    characteristics: [
      "극도의 분산투자",
      "자산 간 상관관계 최소화",
      "경제 사이클 대응",
      "안정적인 수익 추구",
    ],
  },
  "john-bogle": {
    id: "john-bogle",
    name: "존 보글",
    nameEn: "John Bogle",
    description: "인덱스 펀드의 아버지. 저비용 인덱스 펀드를 통한 시장 수익률 추종을 강조합니다.",
    style: "인덱스 투자 · 패시브",
    allocation: {
      stocks: 60,
      bonds: 30,
      cash: 5,
      realEstate: 5,
      crypto: 0,
    },
    characteristics: [
      "저비용 인덱스 펀드",
      "시장 수익률 추종",
      "장기 보유 전략",
      "최소한의 거래",
    ],
  },
  "benjamin-graham": {
    id: "benjamin-graham",
    name: "벤저민 그레이엄",
    nameEn: "Benjamin Graham",
    description: "가치투자의 아버지. 안전마진을 확보한 저평가 자산에 투자하는 보수적 전략입니다.",
    style: "가치투자 · 안전마진",
    allocation: {
      stocks: 50,
      bonds: 35,
      cash: 10,
      realEstate: 5,
      crypto: 0,
    },
    characteristics: [
      "철저한 안전마진 확보",
      "저평가 자산 발굴",
      "보수적인 접근",
      "리스크 최소화",
    ],
  },
}
