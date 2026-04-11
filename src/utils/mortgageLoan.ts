/**
 * 담보 대출 가능액 계산 유틸리티
 *
 * 계산식:
 *   대출가능금액 = 담보가치 × LTV% - 선순위채권 - 소액보증금합계
 *
 * LTV(담보인정비율)는 지역·주택소유상태·생애최초 여부에 따라 결정
 * 소액임차보증금은 지역·부동산유형·방수에 따라 결정
 */

export type PropertyCategory = 'housing' | 'commercial'
export type RegulationRegion = 'regulated' | 'metropolitan' | 'other'
export type BuyerType = 'multi-owner' | 'non-owner' | 'low-income'
export type DepositRegion = 'seoul' | 'overcrowded' | 'metro' | 'etc'

export interface MortgageLoanInput {
  propertyCategory: PropertyCategory
  regulationRegion: RegulationRegion
  buyerType: BuyerType
  isFirstTimeBuyer: boolean
  depositRegion: DepositRegion
  hasRoomDeduction: boolean       // 방 공제
  isRenting: boolean              // 임대 중 (true) / 거주 중 (false)
  manualDeposit: boolean          // 소액보증금 직접입력
  manualDepositAmount: number     // 직접입력 소액보증금 (만원)
  collateralValue: number         // 담보가치 (만원)
  priorLoan: number               // 선순위채권 (만원)
  roomCount: number               // 방 수
  tenantDeposit: number           // 임차보증금 (만원) — 임대 중일 때
}

export interface MortgageLoanResult {
  ltvRate: number                 // 적용 LTV (%)
  collateralValue: number         // 담보가치
  ltvAmount: number               // 담보인정금액 (담보가치 × LTV)
  priorLoan: number               // 선순위채권
  tenantDeposit: number           // 임차보증금
  smallDeposit: number            // 소액보증금 합계
  smallDepositPerRoom: number     // 방당 소액보증금
  maxLoan: number                 // 대출가능금액
  description: string
}

/** 주택 LTV 테이블 (2025.6.28 개정 기준) */
function getHousingLTV(region: RegulationRegion, buyer: BuyerType, isFirst: boolean): number {
  if (isFirst) {
    // 생애최초 구매자
    if (region === 'regulated') return 70
    if (region === 'metropolitan') return 70
    return 80 // 비수도권
  }

  switch (buyer) {
    case 'multi-owner':
      if (region === 'regulated') return 0
      if (region === 'metropolitan') return 0
      return 60
    case 'non-owner':
      if (region === 'regulated') return 50
      return 70
    case 'low-income':
      return 70
  }
}

/** 상가 LTV (일반적 기준) */
function getCommercialLTV(region: RegulationRegion): number {
  if (region === 'regulated') return 50
  return 60
}

/** 주택 소액임차보증금 최우선변제금액 (만원) */
function getHousingSmallDeposit(depositRegion: DepositRegion): number {
  switch (depositRegion) {
    case 'seoul':       return 5500
    case 'overcrowded': return 4800
    case 'metro':       return 2800
    case 'etc':         return 2500
  }
}

/** 상가 소액임차보증금 최우선변제금액 (만원) */
function getCommercialSmallDeposit(depositRegion: DepositRegion): number {
  switch (depositRegion) {
    case 'seoul':       return 2200
    case 'overcrowded': return 1900
    case 'metro':       return 1300
    case 'etc':         return 1000
  }
}

/** 담보 대출 가능액 계산 */
export function calculateMortgageLoan(input: MortgageLoanInput): MortgageLoanResult {
  // 1. LTV 결정
  let ltvRate: number
  if (input.propertyCategory === 'housing') {
    ltvRate = getHousingLTV(input.regulationRegion, input.buyerType, input.isFirstTimeBuyer)
  } else {
    ltvRate = getCommercialLTV(input.regulationRegion)
  }

  // 2. 담보인정금액
  const ltvAmount = Math.round(input.collateralValue * ltvRate / 100)

  // 3. 임차보증금 (임대 중일 때만)
  const tenantDeposit = input.isRenting ? input.tenantDeposit : 0

  // 4. 소액보증금 계산
  let smallDepositPerRoom = 0
  let smallDeposit = 0

  if (input.hasRoomDeduction && input.roomCount > 0) {
    if (input.manualDeposit) {
      smallDepositPerRoom = input.manualDepositAmount
    } else {
      smallDepositPerRoom = input.propertyCategory === 'housing'
        ? getHousingSmallDeposit(input.depositRegion)
        : getCommercialSmallDeposit(input.depositRegion)
    }
    smallDeposit = smallDepositPerRoom * input.roomCount
  }

  // 5. 대출가능금액
  const maxLoan = Math.max(0, ltvAmount - input.priorLoan - tenantDeposit - smallDeposit)

  // 설명
  const regionLabel = input.regulationRegion === 'regulated' ? '규제지역' :
    input.regulationRegion === 'metropolitan' ? '수도권' : '비수도권'
  const buyerLabel = input.isFirstTimeBuyer ? '생애최초 구매자' :
    input.buyerType === 'multi-owner' ? '다주택자' :
    input.buyerType === 'non-owner' ? '무주택·1주택 처분조건' : '서민·실수요자'

  return {
    ltvRate,
    collateralValue: input.collateralValue,
    ltvAmount,
    priorLoan: input.priorLoan,
    tenantDeposit,
    smallDeposit,
    smallDepositPerRoom,
    maxLoan,
    description: `${regionLabel} / ${buyerLabel} (LTV ${ltvRate}%)`,
  }
}
