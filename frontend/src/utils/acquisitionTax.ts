/**
 * 취득세 계산 유틸리티
 *
 * 계산 흐름:
 * 1. 취득유형(매매/증여/상속/원시) + 부동산유형(주택/오피스텔/농지/그외)에 따라 기본 세율 결정
 * 2. 주택 매매인 경우: 주택수, 조정대상지역, 법인 여부 등에 따라 세율 조정
 * 3. 과세표준 × 세율 → 취득세, 농어촌특별세, 지방교육세 산출
 * 4. 생애최초 감면 등 특례 적용
 */

export type AcquisitionType = 'purchase' | 'gift' | 'inheritance' | 'original'
export type PropertyType = 'housing' | 'officetel' | 'farmland' | 'other'
export type AreaType = '40' | '60' | '85' | '85+'
export type HouseCount = 1 | 2 | 3 | 4

export interface AcquisitionTaxInput {
  acquisitionType: AcquisitionType
  propertyType: PropertyType
  area: AreaType
  houseCount: HouseCount
  isCorporation: boolean
  isRentalFirstPurchase: boolean
  isRegulatedArea: boolean
  isMetropolitan: boolean
  isDepopulationArea: boolean
  isFirstTimeBuyer: boolean
  acquisitionPrice: number       // 취득가액 (만원)
  standardPrice: number          // 시가표준액 (만원)
  isSelfFarming: boolean         // 2년이상 자경 (농지)
  isSpouseDescendantGift: boolean // 배우자·직계비속 증여
}

export interface AcquisitionTaxResult {
  taxBase: number                // 과세표준 (만원)
  acquisitionTaxRate: number     // 취득세율 (%)
  acquisitionTax: number         // 취득세 (만원)
  ruralSpecialTaxRate: number    // 농어촌특별세율 (%)
  ruralSpecialTax: number        // 농어촌특별세 (만원)
  localEducationTaxRate: number  // 지방교육세율 (%)
  localEducationTax: number      // 지방교육세 (만원)
  firstTimeBuyerReduction: number // 생애최초 감면 (만원)
  totalTax: number               // 합계 (만원)
  description: string            // 적용 세율 설명
}

/** 주택 매매 - 1주택/2주택 비조정 : 6억~9억 구간 세율 계산 */
function getProgressiveRate(priceManwon: number): number {
  // 세율(%) = (취득가액(만원) / 15000 - 3)
  return priceManwon / 15000 - 3
}

/** 면적 85m² 초과 여부 */
function isOver85(area: AreaType): boolean {
  return area === '85+'
}

/** 주택 매매 세율 계산 */
function getHousingPurchaseRates(input: AcquisitionTaxInput): {
  acqRate: number
  ruralRate: number
  eduRate: number
  desc: string
} {
  const price = input.acquisitionPrice

  // 법인: 12% 중과
  if (input.isCorporation) {
    return {
      acqRate: 12,
      ruralRate: isOver85(input.area) ? 1 : 0,
      eduRate: 0.4,
      desc: '법인 취득 중과세율',
    }
  }

  // 임대사업자 최초분양: 1주택 세율 적용
  const effectiveCount = input.isRentalFirstPurchase ? 1 : input.houseCount

  if (effectiveCount === 1 || (effectiveCount === 2 && !input.isRegulatedArea)) {
    // 1주택 또는 2주택 비조정지역: 동일 세율
    const label = effectiveCount === 1 ? '1주택자' : '2주택자 (비조정지역)'

    if (price <= 60000) {
      // 6억 이하: 1%
      return {
        acqRate: 1,
        ruralRate: isOver85(input.area) ? 0.2 : 0,
        eduRate: 0.1,
        desc: `${label} 6억 이하`,
      }
    } else if (price <= 90000) {
      // 6억 초과 ~ 9억 이하: 누진세율
      const rate = getProgressiveRate(price)
      return {
        acqRate: Math.round(rate * 10000) / 10000,
        ruralRate: isOver85(input.area) ? 0.2 : 0,
        eduRate: Math.round((rate / 10) * 10000) / 10000,
        desc: `${label} 6억~9억 구간`,
      }
    } else {
      // 9억 초과: 3%
      return {
        acqRate: 3,
        ruralRate: isOver85(input.area) ? 0.2 : 0,
        eduRate: 0.3,
        desc: `${label} 9억 초과`,
      }
    }
  }

  if (effectiveCount === 2 && input.isRegulatedArea) {
    // 2주택 조정대상지역: 8%
    return {
      acqRate: 8,
      ruralRate: 0.6,
      eduRate: 0.4,
      desc: '2주택자 조정대상지역',
    }
  }

  if (effectiveCount === 3) {
    if (input.isRegulatedArea) {
      // 3주택 조정: 12%
      return {
        acqRate: 12,
        ruralRate: 1,
        eduRate: 0.4,
        desc: '3주택자 조정대상지역',
      }
    } else {
      // 3주택 비조정: 8%
      return {
        acqRate: 8,
        ruralRate: 0.6,
        eduRate: 0.4,
        desc: '3주택자 비조정지역',
      }
    }
  }

  // 4주택 이상
  if (input.isRegulatedArea) {
    return {
      acqRate: 12,
      ruralRate: 1,
      eduRate: 0.4,
      desc: '4주택 이상 조정대상지역',
    }
  } else {
    return {
      acqRate: 12,
      ruralRate: 1,
      eduRate: 0.4,
      desc: '4주택 이상 비조정지역',
    }
  }
}

/** 취득세 전체 계산 */
export function calculateAcquisitionTax(input: AcquisitionTaxInput): AcquisitionTaxResult {
  let acqRate = 0
  let ruralRate = 0
  let eduRate = 0
  let desc = ''

  // 과세표준 결정
  let taxBase = input.acquisitionPrice
  if (input.acquisitionType === 'gift') {
    // 증여: 시가표준액과 취득가액 중 큰 값 (시가표준액 입력 시)
    if (input.standardPrice > 0) {
      taxBase = Math.max(input.acquisitionPrice, input.standardPrice)
    }
  }

  if (input.propertyType === 'housing') {
    // 주택
    if (input.acquisitionType === 'purchase') {
      const rates = getHousingPurchaseRates(input)
      acqRate = rates.acqRate
      ruralRate = rates.ruralRate
      eduRate = rates.eduRate
      desc = rates.desc
    } else if (input.acquisitionType === 'gift') {
      // 증여 취득
      if (input.isSpouseDescendantGift && input.isRegulatedArea) {
        // 배우자·직계비속 증여 + 조정대상지역: 12%
        acqRate = 12
        ruralRate = 1
        eduRate = 0.4
        desc = '배우자·직계비속 증여 (조정대상지역)'
      } else {
        // 일반 증여: 3.5%
        acqRate = 3.5
        ruralRate = isOver85(input.area) ? 0.2 : 0
        eduRate = 0.3
        desc = '주택 무상취득(증여)'
      }
    } else if (input.acquisitionType === 'inheritance') {
      // 상속
      acqRate = 2.8
      ruralRate = isOver85(input.area) ? 0.2 : 0
      eduRate = 0.16
      desc = '주택 상속'
    } else {
      // 원시취득(신축)
      acqRate = 2.8
      ruralRate = isOver85(input.area) ? 0.2 : 0
      eduRate = 0.16
      desc = '주택 원시취득(신축)'
    }
  } else if (input.propertyType === 'officetel') {
    // 오피스텔
    if (input.acquisitionType === 'purchase') {
      acqRate = 4
      ruralRate = 0.2
      eduRate = 0.4
      desc = '오피스텔 매매'
    } else if (input.acquisitionType === 'gift') {
      acqRate = 3.5
      ruralRate = 0.2
      eduRate = 0.3
      desc = '오피스텔 무상취득(증여)'
    } else if (input.acquisitionType === 'inheritance') {
      acqRate = 2.8
      ruralRate = 0.2
      eduRate = 0.16
      desc = '오피스텔 상속'
    } else {
      acqRate = 2.8
      ruralRate = 0.2
      eduRate = 0.16
      desc = '오피스텔 원시취득(신축)'
    }
  } else if (input.propertyType === 'farmland') {
    // 농지
    if (input.acquisitionType === 'purchase') {
      if (input.isSelfFarming) {
        acqRate = 1.5
        ruralRate = 0
        eduRate = 0.1
        desc = '농지 매매 (2년이상 자경)'
      } else {
        acqRate = 3
        ruralRate = 0.2
        eduRate = 0.2
        desc = '농지 매매 (신규)'
      }
    } else if (input.acquisitionType === 'gift') {
      acqRate = 3.5
      ruralRate = 0.2
      eduRate = 0.3
      desc = '농지 무상취득(증여)'
    } else if (input.acquisitionType === 'inheritance') {
      acqRate = 2.3
      ruralRate = 0.2
      eduRate = 0.06
      desc = '농지 상속'
    } else {
      acqRate = 2.8
      ruralRate = 0.2
      eduRate = 0.16
      desc = '농지 원시취득'
    }
  } else {
    // 그 외 (토지, 건물 등)
    if (input.acquisitionType === 'purchase') {
      acqRate = 4
      ruralRate = 0.2
      eduRate = 0.4
      desc = '주택 외 매매(토지, 건물 등)'
    } else if (input.acquisitionType === 'gift') {
      acqRate = 3.5
      ruralRate = 0.2
      eduRate = 0.3
      desc = '주택 외 무상취득(증여)'
    } else if (input.acquisitionType === 'inheritance') {
      acqRate = 2.8
      ruralRate = 0.2
      eduRate = 0.16
      desc = '주택 외 상속'
    } else {
      acqRate = 2.8
      ruralRate = 0.2
      eduRate = 0.16
      desc = '원시취득(신축)'
    }
  }

  // 세액 계산
  let acquisitionTax = Math.round(taxBase * acqRate / 100)
  const ruralSpecialTax = Math.round(taxBase * ruralRate / 100)
  const localEducationTax = Math.round(taxBase * eduRate / 100)

  // 생애최초 감면: 주택 매매, 1주택, 취득가액 12억 이하
  let firstTimeBuyerReduction = 0
  if (
    input.isFirstTimeBuyer &&
    input.acquisitionType === 'purchase' &&
    input.propertyType === 'housing' &&
    input.houseCount === 1 &&
    input.acquisitionPrice <= 120000
  ) {
    firstTimeBuyerReduction = Math.min(acquisitionTax, 200)
    acquisitionTax -= firstTimeBuyerReduction
    desc += ' (생애최초 감면 적용)'
  }

  const totalTax = acquisitionTax + ruralSpecialTax + localEducationTax

  return {
    taxBase,
    acquisitionTaxRate: acqRate,
    acquisitionTax,
    ruralSpecialTaxRate: ruralRate,
    ruralSpecialTax,
    localEducationTaxRate: eduRate,
    localEducationTax,
    firstTimeBuyerReduction,
    totalTax,
    description: desc,
  }
}
