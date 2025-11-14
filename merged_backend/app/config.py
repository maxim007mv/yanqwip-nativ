"""
Конфигурация объединённого бэкенда
Поддержка PostgreSQL + внешние API
Поддержка Heroku и других облачных платформ
"""
import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Project settings
    project_name: str = "yanqwip-merged"
    api_prefix: str = "/api"
    
    # PostgreSQL Database
    # Heroku автоматически устанавливает DATABASE_URL
    # Фикс для Heroku: заменяем postgres:// на postgresql://
    @property
    def database_url(self) -> str:
        url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres123@localhost:5432/yanqwip")
        # Heroku использует postgres://, но SQLAlchemy требует postgresql://
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url
    
    # Auth settings - ОБЯЗАТЕЛЬНО установите через Heroku Config Vars!
    secret_key: str = os.getenv("SECRET_KEY", "CHANGE-ME-IN-PRODUCTION-USE-HEROKU-CONFIG")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    refresh_token_expire_minutes: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES", str(60 * 24 * 14)))

    # DeepSeek AI API
    deepseek_api_key: str = os.getenv("DEEPSEEK_API_KEY", "")
    deepseek_base_url: str = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")

    # Yandex Maps API
    yandex_api_key: str = os.getenv("YANDEX_API_KEY", "")
    yandex_geocode_base_url: str = "https://geocode-maps.yandex.ru/1.x"
    yandex_places_search_url: str = "https://search-maps.yandex.ru/v1"

    # Overpass API (OpenStreetMap)
    overpass_endpoint: str = "https://overpass-api.de/api/interpreter"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
