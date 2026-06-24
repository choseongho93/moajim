"""moajim 단일 Python 백엔드 (FastAPI).

멀티-프로덕트(tax/property/stock)를 한 코드베이스에서 관리한다.

현재 활성: health, exchange.
부동산(법정동/실거래/regions)·포트폴리오는 제거됨 — /property 구축 시 새로 추가.
Postgres는 연결만 구성 (테이블은 /property에서 정의). /api/health/db 로 연결 확인.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .db import run_migrations
from .middleware.geo import GeoBlockMiddleware
from .routers import exchange, health


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.auto_migrate:
        await run_migrations()
    yield


app = FastAPI(title="moajim API", version="1.0.0", lifespan=lifespan)

# 해외 차단 (CF-IPCountry 기반, 2차 방어선)
app.add_middleware(GeoBlockMiddleware)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# 라우터 (각 라우터가 /api/... 전체 경로를 정의)
app.include_router(health.router)
app.include_router(exchange.router)


@app.get("/")
async def root() -> dict:
    return {"service": "moajim", "status": "ok", "env": settings.environment}
