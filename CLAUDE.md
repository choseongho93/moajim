# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Moajim is a Korean asset portfolio analysis app with real estate price lookup via the 국토교통부 실거래가 government API. Built with React + TypeScript, deployed to Cloudflare Pages (frontend) + Cloudflare Worker (API).

## Repository Structure (monorepo)

```
moajim/
  frontend/   React + Vite SPA, Cloudflare Pages Functions (functions/), 그리고
              레거시 Cloudflare Worker(worker/, wrangler.toml) — Pages 빌드 루트 디렉토리 = frontend
  backend/    Python FastAPI 단일 백엔드 (worker API를 포팅, 신규). provider-중립 (DATABASE_URL)
```

> ⚠️ frontend/를 Pages 루트로 옮겼으므로 Cloudflare Pages 프로젝트의 **Build settings → Root directory = `frontend`** 로 설정해야 한다. 레거시 worker는 Python `backend/`로 컷오버 완료 후 frontend/에서 제거.

## Architecture

### 멀티-프로덕트 / 진행 중 이전
- **Frontend (SPA)**: `frontend/` React + Vite → Cloudflare Pages (`moajim.com`)
- **Backend (API)**: `backend/` Python FastAPI — 기존 Worker(`frontend/worker/index.ts`, itty-router)의 모든 `/api/*` 를 포팅. 외부 호스팅(Fly.io 등) 전제, Cloudflare 프록시 뒤.
- **Database**: D1(SQLite) → **단일 Postgres**로 이전 중 (`backend/migrations/001_init.sql`)
- **해외 차단**: Cloudflare WAF 규칙(KR only, 크롤러 예외) + 코드 가드(`functions/[[catchall]].ts`, `backend/.../middleware/geo.py`)

### Frontend
- **Routing**: Path 기반 멀티-프로덕트 SPA. 단일 소스 `frontend/src/routes.ts`. `/tax/{section}/{sub}` (예: `/tax/calculator/gift-tax`), `/property`(신규), 향후 `/stock`. `/` 및 레거시 `?view=&sub=` 는 엣지(`functions/[[catchall]].ts`)에서 **301 리다이렉트**로 SEO 보존.
- **Pages**: HomePage, PortfolioPage, CalculatorPage, ToolsPage, FinancePage, PropertyTaxPage, PrivacyPage
- **Styling**: Tailwind CSS v4 with PostCSS. Brand color: `#F15F5F`
- **API calls**: `src/api/` modules use `import.meta.env.DEV ? '/api' : 'https://moajim.com/api'` for URL switching

### Frontend Routes (`?view=`)
| view | Page | Description |
|------|------|-------------|
| `home` (default) | HomePage | Landing page with feature cards |
| `calculator` | CalculatorPage | Tax calculators hub |
| `tools` | ToolsPage | Real estate tools hub |
| `finance` | FinancePage | Financial calculators hub |
| `portfolio` | PortfolioPage | Asset portfolio analysis |
| `property-tax` | PropertyTaxPage | 2026 보유세 예측 simulator |
| `privacy` | PrivacyPage | Privacy policy |

### Tax Calculators (`?view=calculator&sub=`)
| sub | Calculator | Utility |
|-----|-----------|---------|
| `gift-tax` | 증여세 계산기 | `utils/giftTax.ts` |
| `inheritance-tax` | 상속세 계산기 | `utils/inheritanceTax.ts` |
| `acquisition-tax` | 취득세 계산기 | `utils/acquisitionTax.ts` |
| `holding-tax` | 보유세 계산기 | `utils/holdingTax.ts` |
| `capital-gains-tax` | 양도소득세 계산기 | `utils/capitalGainsTax.ts` |

### Real Estate Tools (`?view=tools&sub=`)
| sub | Tool | Utility |
|-----|------|---------|
| `brokerage-fee` | 중개보수 계산기 | (inline) |
| `lawyer-fee` | 법무사 보수료 계산기 | `utils/lawyerFee.ts` |
| `rent-conversion` | 전월세 전환 계산기 | `utils/rentConversion.ts` |

### Financial Calculators (`?view=finance&sub=`)
| sub | Calculator | Utility |
|-----|-----------|---------|
| `loan-interest` | 대출 이자 계산기 | `utils/loanInterest.ts` |
| `mortgage-loan` | 담보 대출 가능액 | `utils/mortgageLoan.ts` |
| `savings-interest` | 예적금 이자 계산기 | `utils/savingsInterest.ts` |
| `early-repayment` | 중도상환수수료 계산기 | `utils/earlyRepaymentFee.ts` |
| `auction-loan` | 경락잔금대출 한도 | `utils/auctionLoan.ts` |

### Components (`src/components/`)
- `Navigation.tsx` — Header with desktop/mobile nav menus
- `Footer.tsx` — Footer with links
- `ShareButtons.tsx` — SNS sharing (URL copy, Kakao, Facebook, Naver) with `PAGE_META` mapping
- `CaptureButtons.tsx` — Screenshot/image capture for results
- `PropertyTaxBanner.tsx` — Banner promoting 보유세 simulator
- `Toast.tsx`, `LoadingOverlay.tsx`, `AdBanner.tsx`, `AdInfeed.tsx`

### Worker API
- Routes defined inline in `worker/index.ts` (regions/D1 routes) and in `worker/routes/` (portfolio, realestate, health)
- CORS handled via `worker/middleware/cors.ts` — all responses use `CORS_HEADERS`
- **Auto-populate pattern**: Apartment/area endpoints check D1 first; if empty, fetch from government API (last 3 months), save to D1, then return
- Government API returns XML; parsed with regex in `worker/services/realestate.ts` (no XML parser library)
- In-memory cache (24h TTL) for government API responses

### D1 Tables
- `dongs` — 법정동 (city, district, lawd_cd, dong_name, dong_code)
- `apartments` — 아파트 단지 (lawd_cd, dong_name, apt_name, city, district)
- `apartment_areas` — 전용면적 (lawd_cd, dong_name, apt_name, area)

Migrations live in `migrations/`. Apply with: `npx wrangler d1 migrations apply moajim-db`

### TypeScript Configs
- `tsconfig.app.json` — Frontend React
- `tsconfig.node.json` — Build tooling
- `tsconfig.worker.json` — Cloudflare Worker

## Development Commands

> Node 20+ 필요 (vite/wrangler). nvm 사용 시 `nvm use 20`.

**Frontend** (`cd frontend`):
```bash
npm run dev          # Vite dev server (port 5173), proxies /api to localhost:8787
npm run dev:worker   # (레거시) Wrangler worker dev (port 8787)
npm run build        # Build frontend to frontend/dist/
npm run deploy       # (레거시) Build + deploy Worker
npm run lint         # ESLint
npx wrangler pages dev dist   # Pages Functions 포함 로컬 프리뷰 (리다이렉트/SSR 검증)
```

**Backend** (`cd backend`):
```bash
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000   # FastAPI (자세한 건 backend/README.md)
```

로컬 풀스택: `frontend`에서 `npm run dev` + `backend`에서 uvicorn. (현재 프론트는 `import.meta.env.DEV ? '/api' : ...`로 worker dev(8787)에 프록시 — Python 컷오버 시 프록시 타깃을 8000으로 변경)

## Worker API Endpoints

- `GET /api/health` — Health check
- `GET /api/portfolio/investors` — Investor list
- `POST /api/portfolio/analyze` — Portfolio analysis
- `POST /api/realestate/search` — Real estate trade search (government API)
- `GET /api/regions/cities` — City list (D1)
- `GET /api/regions/districts?city=` — District list with lawdCd (D1)
- `GET /api/regions/dongs?lawdCd=` — Dong list (D1)
- `GET /api/regions/apartments?lawdCd=&dong=` — Apartment list (D1, auto-populate from API)
- `GET /api/regions/areas?lawdCd=&dong=&apt=` — Area list (D1, auto-populate from API)
- `GET /api/admin/dong-count` — Dong count in D1

## Calculator UI Patterns

All calculators in `CalculatorPage.tsx` follow a consistent structure:
- **Info tabs** at top (설명 / additional tabs) with blue info box
- **Pill button groups** for mode selection (e.g., property type, spouse type)
- **Checkbox options** in a flex-wrap row
- **Input fields** with `만원` suffix and `formatKoreanAmount()` display
- **Calculate button** (red `#F15F5F`)
- **Result card** with gradient background, breakdown table, and `CaptureButtons`
- **Reference table** (tax brackets) in blue info box with 검수 credit
- **Warning box** in red
- **ShareButtons** component for SNS sharing
- Each calculator has a corresponding utility file in `src/utils/` with typed Input/Result interfaces
