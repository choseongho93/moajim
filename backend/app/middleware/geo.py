"""해외 차단 미들웨어 (비용 보호).

API는 Cloudflare 프록시(orange cloud) 뒤에 두는 것을 전제로 하며, Cloudflare가
주입하는 CF-IPCountry 헤더로 한국(KR)만 허용한다. 헤더가 없으면(로컬 dev·프록시 미경유)
통과시킨다. 1차 차단은 Cloudflare WAF 규칙이 담당하고, 이 미들웨어는 방어선(2차)이다.
"""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from ..config import settings


class GeoBlockMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if settings.enforce_geo:
            country = request.headers.get("CF-IPCountry", "").upper()
            if country and country not in settings.allowed_country_set:
                return JSONResponse(
                    {"error": "This service is available in South Korea only."},
                    status_code=403,
                )
        return await call_next(request)
