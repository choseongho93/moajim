"""DB 레이어 — SQLAlchemy 2.0 async (asyncpg)."""
from collections.abc import AsyncIterator
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from .config import settings


def _prepare_url(url: str) -> tuple[str, dict]:
    """Neon/Supabase 등에서 복사한 연결 문자열을 asyncpg용으로 보정.

    - postgresql:// · postgres:// → postgresql+asyncpg://
    - asyncpg가 모르는 쿼리(sslmode/channel_binding 등)는 제거하고,
      sslmode가 SSL을 요구하면 connect_args.ssl=True 로 전달.
    """
    for prefix in ("postgresql+asyncpg://", "postgresql://", "postgres://"):
        if url.startswith(prefix):
            url = "postgresql+asyncpg://" + url[len(prefix):]
            break

    parts = urlsplit(url)
    query = dict(parse_qsl(parts.query))
    connect_args: dict = {}

    sslmode = query.pop("sslmode", None)
    query.pop("channel_binding", None)  # asyncpg 미지원
    if sslmode in ("require", "verify-ca", "verify-full", "prefer", "allow"):
        connect_args["ssl"] = True

    # PgBouncer(transaction pooling) 뒤에서는 prepared statement가 깨지므로 비활성화.
    # Neon -pooler / Supabase pooler 등.
    host = parts.hostname or ""
    if "pooler" in host or "pgbouncer" in host:
        connect_args["statement_cache_size"] = 0

    clean = urlunsplit(
        (parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment)
    )
    return clean, connect_args


_db_url, _connect_args = _prepare_url(settings.database_url)

engine = create_async_engine(
    _db_url,
    connect_args=_connect_args,
    pool_pre_ping=True,
    echo=False,
)

SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def get_session() -> AsyncIterator[AsyncSession]:
    """FastAPI 의존성: 요청당 세션."""
    async with SessionLocal() as session:
        yield session


async def run_migrations() -> None:
    """migrations/*.sql 을 순서대로 실행 (AUTO_MIGRATE=true 일 때 시작 시 호출)."""
    migrations_dir = Path(__file__).resolve().parent.parent / "migrations"
    files = sorted(migrations_dir.glob("*.sql"))
    async with engine.begin() as conn:
        for f in files:
            sql = f.read_text(encoding="utf-8")
            for stmt in _split_statements(sql):
                await conn.execute(text(stmt))


def _split_statements(sql: str) -> list[str]:
    out: list[str] = []
    for raw in sql.split(";"):
        # 주석/공백만 있는 조각 제거
        lines = [ln for ln in raw.splitlines() if not ln.strip().startswith("--")]
        stmt = "\n".join(lines).strip()
        if stmt:
            out.append(stmt)
    return out
