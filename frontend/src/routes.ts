/**
 * routes.ts — URL 경로 라우팅 단일 소스
 *
 * 멀티-프로덕트 구조:
 *   /tax/...      세무·금융·계산기 (기존 전체 서비스)
 *   /property/... 부동산 (신규)
 *   /stock/...    주식 (향후)
 *
 * 내부 상태 모델은 기존과 동일하게 (view, sub)를 유지하고,
 * URL <-> (view, sub) 변환만 이 파일에서 담당한다.
 */

export type ProductId = 'tax' | 'property' | 'stock'

export type View =
  | 'home'
  | 'calculator'
  | 'tools'
  | 'finance'
  | 'property-tax'
  | 'privacy'

const VALID_VIEWS: View[] = [
  'home', 'calculator', 'tools', 'finance', 'property-tax', 'privacy',
]

/** 섹션(서브 경로를 갖는 view) */
const SECTION_VIEWS: View[] = ['calculator', 'tools', 'finance']

/** 경로 첫 세그먼트로 프로덕트 판별 */
export function productFromPath(pathname: string): ProductId {
  const seg = pathname.split('/').filter(Boolean)[0]
  if (seg === 'property') return 'property'
  if (seg === 'stock') return 'stock'
  return 'tax'
}

/** (view, sub) → 경로 문자열 (tax 프로덕트) */
export function stateToPath(view: View, sub?: string): string {
  switch (view) {
    case 'home':
      return '/tax'
    case 'property-tax':
      return '/tax/property-tax'
    case 'privacy':
      return '/tax/privacy'
    case 'calculator':
    case 'tools':
    case 'finance':
      return sub ? `/tax/${view}/${sub}` : `/tax/${view}`
  }
}

/** 경로 → (view, sub) (tax 프로덕트) */
export function pathToState(pathname: string): { view: View; sub: string } {
  const segs = pathname.split('/').filter(Boolean)
  // /tax 이외이거나 /tax 단독 → 홈
  if (segs[0] !== 'tax' || segs.length === 1) return { view: 'home', sub: '' }

  const section = segs[1]
  const sub = segs[2] || ''

  if (section === 'property-tax') return { view: 'property-tax', sub: '' }
  if (section === 'privacy') return { view: 'privacy', sub: '' }
  if (SECTION_VIEWS.includes(section as View)) return { view: section as View, sub }
  return { view: 'home', sub: '' }
}

/**
 * 레거시 쿼리스트링(?view=&sub=) → 새 경로.
 * 기존 인덱싱된 URL을 301 리다이렉트하거나, dev에서 클라이언트 정규화할 때 사용.
 * view 파라미터가 없으면 null.
 */
export function legacyQueryToPath(search: string): string | null {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`)
  if (!params.has('view')) return null
  const view = params.get('view') as View
  const sub = params.get('sub') || ''
  if (!VALID_VIEWS.includes(view)) return '/tax'
  return stateToPath(view, sub)
}

/**
 * (view, sub) → 레거시 키 (예: "view=calculator&sub=gift-tax").
 * SEO/공유 메타 테이블이 레거시 키로 작성돼 있어 조회용으로 사용.
 * 홈은 빈 문자열(기본 메타).
 */
export function legacyKey(view: View, sub?: string): string {
  if (view === 'home') return ''
  return sub ? `view=${view}&sub=${sub}` : `view=${view}`
}

export const BASE_URL = 'https://moajim.com'
