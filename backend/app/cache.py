"""인메모리 TTL 캐시 (프로세스 메모리, 재시작 시 소실 — 정상 동작 무관)."""
import asyncio
import time
from typing import Any


class TTLCache:
    def __init__(self) -> None:
        self._store: dict[str, tuple[Any, float]] = {}
        self._lock = asyncio.Lock()

    async def get(self, key: str) -> Any | None:
        async with self._lock:
            item = self._store.get(key)
            if item is None:
                return None
            value, expires_at = item
            if expires_at < time.time():
                self._store.pop(key, None)
                return None
            return value

    async def set(self, key: str, value: Any, ttl_seconds: float) -> None:
        async with self._lock:
            self._store[key] = (value, time.time() + ttl_seconds)
