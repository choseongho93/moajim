# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Moajim is a React + TypeScript application deployed to Cloudflare Pages with a Cloudflare Worker API backend. The frontend is built with Vite and deployed as a static SPA, while the Worker handles API requests. The app provides asset portfolio analysis with real estate price lookup via Korean government API.

## Architecture

### Dual-Build System
- **Frontend (SPA)**: React app built with Vite → deployed to Cloudflare Pages
- **Backend (API)**: Cloudflare Worker serves API endpoints (`/api/*`)
- **Database**: Cloudflare D1 (SQLite) stores regional data (cities, districts, dongs, apartments, areas)

Frontend files: Built to `dist/` via Vite
Worker API: `worker/index.ts` handles all `/api/*` routes using itty-router (AutoRouter)

### Data Flow
- **Regional data** (시/도, 시/군/구, 법정동): Always from D1 database
- **Apartment/area data**: D1 first, auto-populated from government API if empty
- **Real estate trade prices**: Government API (국토교통부 실거래가)

### TypeScript Configuration
- `tsconfig.app.json` - Frontend React application
- `tsconfig.node.json` - Node/build tooling
- `tsconfig.worker.json` - Cloudflare Worker

## Development Commands

```bash
npm run dev          # Start Vite dev server (port 5173)
npm run dev:worker   # Start Wrangler dev server (port 8787)
npm run build        # Build frontend to dist/
npm run deploy       # Build frontend + deploy Worker to Cloudflare
npm run lint         # Run ESLint
```

## Worker API Endpoints

- `GET /api/health` - Health check
- `GET /api/portfolio/investors` - Investor list
- `POST /api/portfolio/analyze` - Portfolio analysis
- `POST /api/realestate/search` - Real estate trade search (government API)
- `GET /api/regions/cities` - City list (D1)
- `GET /api/regions/districts?city=` - District list with lawdCd (D1)
- `GET /api/regions/dongs?lawdCd=` - Dong list (D1)
- `GET /api/regions/apartments?lawdCd=&dong=` - Apartment list (D1, auto-populate)
- `GET /api/regions/areas?lawdCd=&dong=&apt=` - Area list (D1, auto-populate)

## D1 Database Tables

- `dongs` - 법정동 (city, district, lawd_cd, dong_name, dong_code)
- `apartments` - 아파트 단지 (lawd_cd, dong_name, apt_name, city, district)
- `apartment_areas` - 전용면적 (lawd_cd, dong_name, apt_name, area)

## Cloudflare Configuration

`wrangler.toml`:
- `main: "worker/index.ts"` - Worker entry point
- D1 binding: `DB` → `moajim-db`
- Routes: `moajim.com/api/*`
