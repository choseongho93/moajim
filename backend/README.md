# moajim backend (Python / FastAPI)

기존 Cloudflare Worker(`frontend/worker/`)의 모든 `/api/*` 엔드포인트를 포팅한 단일 Python 백엔드.
멀티-프로덕트(tax / property / stock)를 한 코드베이스에서 관리한다.

## 구조

```
backend/
  app/
    main.py            # FastAPI 앱, CORS·geo-block 미들웨어, 라우터 등록
    config.py          # 환경변수 (DATABASE_URL, GOV_DATA_API_KEY, ...)
    db.py              # SQLAlchemy async 엔진/세션 + 마이그레이션 러너
    cache.py           # 인메모리 TTL 캐시
    middleware/geo.py  # 해외 차단 (CF-IPCountry)
    data/investors.py  # 투자 대가 프로필
    services/          # realestate(정부 API), exchange(환율), portfolio, regions(DB)
    routers/           # health, regions, realestate, exchange, portfolio
  migrations/001_init.sql   # Postgres 스키마 (dongs, apartments, apartment_areas)
  requirements.txt
  Dockerfile
  .env.example
```

## 로컬 실행

```bash
cd backend
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # DATABASE_URL 등 수정

# Postgres 스키마 적용 (둘 중 하나)
psql "$DATABASE_URL_PSQL" -f migrations/001_init.sql   # psql용 URL(postgresql://...)
#   또는 .env 에 AUTO_MIGRATE=true 설정 후 앱 시작 시 자동 적용

uvicorn app.main:app --reload --port 8000
```

> `DATABASE_URL`은 앱용(asyncpg) `postgresql+asyncpg://...`, psql용은 `postgresql://...` 형식.

## 엔드포인트 (프론트 응답 형태 100% 유지)

| Method | Path | 설명 |
|--------|------|------|
| GET  | `/api/health` | 헬스체크 |
| GET  | `/api/portfolio/investors` | 투자자 목록 |
| POST | `/api/portfolio/analyze` | 포트폴리오 분석 |
| POST | `/api/realestate/search` | 실거래가 검색 (정부 API) |
| GET  | `/api/exchange/rates` | 환율 (30분 캐시) |
| GET  | `/api/regions/cities` | 시/도 목록 |
| GET  | `/api/regions/districts?city=` | 시/군/구 목록 |
| GET  | `/api/regions/dongs?lawdCd=` | 법정동 목록 |
| GET  | `/api/regions/apartments?lawdCd=&dong=` | 아파트 목록 (없으면 정부 API 자동 적재) |
| GET  | `/api/regions/areas?lawdCd=&dong=&apt=` | 평형 목록 (자동 적재) |
| GET  | `/api/admin/dong-count` | 법정동 수 |

## 배포 (provider 중립)

`DATABASE_URL`만 있으면 어느 호스트·어느 Postgres든 동작:

- **Fly.io / Railway / 컨테이너**: 포함된 `Dockerfile` 사용 (`$PORT` 바인딩).
- **DB**: Supabase / Neon / Fly Postgres 등 단일 Postgres.
- **해외 차단**: API를 Cloudflare 프록시(orange cloud) 뒤에 두면 같은 WAF 규칙 + `CF-IPCountry`가 적용된다. 미들웨어(`enforce_geo`)는 2차 방어선.

## 프론트 연결

배포 후 `moajim.com/api/*` 를 이 백엔드로 라우팅하면 프론트(`frontend/src/api/*`) 수정 없이 그대로 동작한다. (현재는 레거시 worker가 처리 중 → Python으로 컷오버 시 전환)

## 남은 작업

- D1 → Postgres 데이터 이전 (법정동 CSV 적재 + apartments/areas) — repo task #4
- `property_*` / `stock_*` 테이블 및 라우터 추가 — task #5
