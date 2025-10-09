from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine
from .routers import agent, auth, places, routes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Yanwqip API", version="1.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешить все origins для мобильного приложения
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_prefix = settings.api_prefix.rstrip("/") or ""

app.include_router(auth.router, prefix=api_prefix)
app.include_router(routes.router, prefix=api_prefix)
app.include_router(places.router, prefix=api_prefix)
app.include_router(agent.router, prefix=api_prefix)


@app.get("/health")
def health_check():
    return {"status": "ok"}
