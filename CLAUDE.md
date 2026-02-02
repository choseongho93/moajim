# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Moajim is a React + TypeScript application deployed to Cloudflare Pages with a Cloudflare Worker API backend. The frontend is built with Vite and deployed as a static SPA, while the Worker handles API requests.

## Architecture

### Dual-Build System
This project uses a unique architecture combining:
- **Frontend (SPA)**: React app built with Vite → deployed to Cloudflare Pages
- **Backend (API)**: Cloudflare Worker serves API endpoints (`/api/*`)

Both are deployed together but serve different purposes:
- Frontend files: Built to `dist/` via Vite
- Worker API: `worker/index.ts` handles all `/api/*` routes

### TypeScript Configuration
The project uses TypeScript project references with three separate configs:
- `tsconfig.app.json` - Frontend React application
- `tsconfig.node.json` - Node/build tooling
- `tsconfig.worker.json` - Cloudflare Worker (extends node config)

### Routing & Deployment
- Vite config uses `base: "./"` for relative paths to support Cloudflare Pages custom domains
- Worker handles API routes; all other requests return 404 (SPA routing handled client-side)

## Development Commands

### Build & Development
```bash
npm run dev          # Start Vite dev server (port 5173)
npm run build        # Build frontend to dist/
npm run preview      # Preview production build locally
```

### Linting
```bash
npm run lint         # Run ESLint on all files
```

### Deployment
```bash
npm run deploy       # Build frontend + deploy Worker to Cloudflare
npm run cf-typegen   # Generate TypeScript types for Wrangler bindings
```

## Worker API Structure

API endpoints are defined in `worker/index.ts`. The Worker exports a default object with a `fetch()` handler that routes based on `url.pathname`.

Current endpoints:
- `GET /api/health` - Health check returning service status
- `GET /api/users` - Returns user list (temporary mock data)
- All other routes return 404

To add new API routes, add conditional checks in the `fetch()` handler before the final 404 response.

## Frontend Structure

The React app is minimal:
- `src/main.tsx` - Entry point, renders `<App />`
- `src/App.tsx` - Main component that fetches from `/api/health` and `/api/users`
- Frontend makes direct fetch calls to `/api/*` routes handled by the Worker

## Cloudflare Configuration

`wrangler.jsonc` defines:
- `main: "worker/index.ts"` - Worker entry point
- `compatibility_date: "2025-09-27"` - Cloudflare runtime version
- `observability: true` - Logging/monitoring enabled

To add Cloudflare bindings (KV, D1, R2, etc.), uncomment and configure the relevant sections in `wrangler.jsonc`.
