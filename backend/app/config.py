from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    project_name: str = "yanqwip-backend"
    api_prefix: str = "/api"
    database_url: str = "sqlite:///./yanqwip.db"
    secret_key: str = "super-secret-key-change-me"
    access_token_expire_minutes: int = 30
    refresh_token_expire_minutes: int = 60 * 24 * 14

    deepseek_api_key: str = "sk-1fcbc1c97bc24fb9a17ba2b1afafa3a2"
    deepseek_base_url: str = "https://api.deepseek.com"

    yandex_api_key: str = "fdc69334-3f89-4a96-b29a-499da1f7142a"
    yandex_geocode_base_url: str = "https://geocode-maps.yandex.ru/1.x"
    yandex_places_search_url: str = "https://search-maps.yandex.ru/v1"

    overpass_endpoint: str = "https://overpass-api.de/api/interpreter"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
