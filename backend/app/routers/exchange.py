from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse

from ..services.exchange import fetch_exchange_rates

router = APIRouter()


@router.get("/api/exchange/rates")
async def get_rates(response: Response):
    try:
        data = await fetch_exchange_rates()
    except Exception as exc:  # noqa: BLE001
        return JSONResponse({"success": False, "error": str(exc)}, status_code=502)

    response.headers["Cache-Control"] = "public, max-age=1800"
    return {"success": True, **data}
