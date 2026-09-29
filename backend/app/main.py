from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import ai, chat, health, profile, search

app = FastAPI(
    title="PARCOURS-AI API",
    version="1.0.0",
    description="Plateforme intelligente d'orientation scolaire et professionnelle pour le Bénin.",
)

# Liste des origines autorisées (Vite frontend sur 5173, Next.js sur 3000, production)
origins = list(
    set(
        settings.allowed_origins
        + [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
    )
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https?://localhost(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(chat.router)
app.include_router(ai.router)
app.include_router(search.router)
app.include_router(profile.router)