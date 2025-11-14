"""
Yanqwip Merged Backend - Main Application
Объединённый бэкенд с полной функциональностью:
- Авторизация пользователей (JWT)
- AI-генерация маршрутов (DeepSeek)
- Работа с местами из PostgreSQL
- AI-чат агент
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import agent, auth, places, routes, achievements

app = FastAPI(
    title="Yanqwip Merged API",
    version="2.0.0",
    description="Объединённый бэкенд с AI-генерацией и PostgreSQL"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:19006",
        "https://yanqwip-app.netlify.app",
        "https://*.netlify.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API prefix
api_prefix = settings.api_prefix.rstrip("/") or ""

# Подключаем роутеры
app.include_router(auth.router, prefix=api_prefix)
app.include_router(routes.router, prefix=api_prefix)
app.include_router(places.router, prefix=api_prefix)
app.include_router(agent.router, prefix=api_prefix)
app.include_router(achievements.router, prefix=api_prefix)


@app.get("/")
def root():
    return {
        "message": "Yanqwip Merged Backend API",
        "version": "2.0.0",
        "docs": "/docs",
        "features": [
            "Авторизация пользователей (JWT)",
            "AI-генерация маршрутов (DeepSeek)",
            "Работа с местами из PostgreSQL",
            "AI-чат агент",
            "Сохранение маршрутов пользователей"
        ]
    }


@app.get("/health")
def health_check():
    return {"status": "ok", "version": "2.0.0"}


@app.get(f"{api_prefix}/test")
def test_endpoint():
    """Тестовый endpoint для проверки подключения"""
    return {
        "status": "success",
        "message": "API работает корректно",
        "api_prefix": api_prefix,
        "timestamp": "now"
    }


if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Yanqwip Merged Backend...")
    print("📝 API Docs: http://localhost:8000/docs")
    print("🔥 Server running on: http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
