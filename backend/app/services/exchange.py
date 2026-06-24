"""환율 서비스 — open.er-api.com (무인증) + 30분 캐시.

worker/services/exchangeRate.ts 포팅. 1 [외화] = N KRW (외화 → 원화 환산).
"""
import time

import httpx

from ..cache import TTLCache

TTL_SECONDS = 30 * 60
API_URL = "https://open.er-api.com/v6/latest/USD"

SUPPORTED_CURRENCIES = [
    "USD", "JPY", "CNY", "EUR", "GBP", "AUD", "CAD", "CHF",
    "HKD", "SGD", "TWD", "THB", "VND", "IDR", "PHP", "MYR", "INR", "NZD",
]

_cache = TTLCache()
_stale: dict | None = None  # 외부 API 장애 시 마지막 성공값 반환


async def fetch_exchange_rates() -> dict:
    global _stale

    cached = await _cache.get("rates")
    if cached is not None:
        return cached

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(API_URL)
    except httpx.HTTPError as exc:
        if _stale is not None:
            return _stale
        raise RuntimeError(f"Exchange rate API error: {exc}") from exc

    if resp.status_code != 200:
        if _stale is not None:
            return _stale
        raise RuntimeError(f"Exchange rate API error: HTTP {resp.status_code}")

    data = resp.json()
    if data.get("result") != "success" or not data.get("rates") or not data["rates"].get("KRW"):
        if _stale is not None:
            return _stale
        raise RuntimeError("Exchange rate API returned invalid data")

    krw_per_usd = data["rates"]["KRW"]
    rates: dict[str, float] = {}
    for code in SUPPORTED_CURRENCIES:
        code_per_usd = data["rates"].get(code)
        if isinstance(code_per_usd, (int, float)) and code_per_usd > 0:
            rates[code] = round((krw_per_usd / code_per_usd) * 10000) / 10000

    result = {
        "base": "KRW",
        "rates": rates,
        "timestamp": data["time_last_update_unix"],
        "nextUpdate": data["time_next_update_unix"],
        "fetchedAt": int(time.time()),
    }

    await _cache.set("rates", result, TTL_SECONDS)
    _stale = result
    return result
