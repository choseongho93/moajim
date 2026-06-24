"""앱 설정 — 환경변수 로딩 (pydantic-settings)."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # 단일 Postgres (asyncpg). 예: postgresql+asyncpg://user:pass@host:5432/db
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/moajim"

    # 국토교통부 실거래가 OpenAPI 키
    gov_data_api_key: str = (
        "3f1f2c2bf9045370f2a379a9f3ff2d1af1fa91cefb44635549ce5a663a66c1d3"
    )

    # CORS
    cors_origins: str = "https://moajim.com,http://localhost:5173"

    # 해외 차단
    allowed_countries: str = "KR,T1"
    enforce_geo: bool = True

    # 시작 시 마이그레이션 자동 적용
    auto_migrate: bool = False

    environment: str = "development"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def allowed_country_set(self) -> set[str]:
        return {c.strip().upper() for c in self.allowed_countries.split(",") if c.strip()}


settings = Settings()
