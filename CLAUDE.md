# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Moajim is a Korean asset portfolio analysis app with real estate price lookup via the 국토교통부 실거래가 government API. Built with React + TypeScript, deployed to Cloudflare Pages (frontend) + Cloudflare Worker (API).

## Architecture

### Dual-Build System
- **Frontend (SPA)**: React app built with Vite → deployed to Cloudflare Pages at `moajim.com`
- **Backend (API)**: Cloudflare Worker at `worker/index.ts` using itty-router (AutoRouter), serves `/api/*` routes
- **Database**: Cloudflare D1 (SQLite) binding `DB` → `moajim-db`

### Frontend
- **Routing**: Query-string based SPA routing (no react-router). `App.tsx` reads `?view=` and `?sub=` params, uses `window.history.pushState` for navigation
- **Pages**: HomePage, PortfolioPage, CalculatorPage (gift/inheritance tax), PrivacyPage
- **Styling**: Tailwind CSS v4 with PostCSS. Brand color: `#F15F5F`
- **API calls**: `src/api/` modules use `import.meta.env.DEV ? '/api' : 'https://moajim.com/api'` for URL switching

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

```bash
npm run dev          # Vite dev server (port 5173), proxies /api to localhost:8787
npm run dev:worker   # Wrangler dev server (port 8787)
npm run build        # Build frontend to dist/
npm run deploy       # Build frontend + deploy Worker to Cloudflare
npm run lint         # ESLint
npm run cf-typegen   # Generate Cloudflare Worker types
```

For local development, run `npm run dev` and `npm run dev:worker` simultaneously. Vite proxies `/api` requests to the Worker dev server.

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
