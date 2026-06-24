from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session

router = APIRouter()


@router.get("/api/health")
async def health() -> dict:
    return {"status": "ok", "service": "moajim"}


@router.get("/api/health/db")
async def health_db(session: AsyncSession = Depends(get_session)):
    """Postgres 연결 확인용 핑 (SELECT 1)."""
    try:
        result = await session.execute(text("SELECT 1"))
        return {"status": "ok", "db": result.scalar() == 1}
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(
            {"status": "error", "db": False, "error": str(exc)}, status_code=503
        )
