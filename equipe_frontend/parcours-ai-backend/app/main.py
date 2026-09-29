from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import FRONTEND_ORIGIN
from app.routers import auth, health, profile, roadmap, search

app = FastAPI(
    title="PARCOURS-AI API",
    description="Backend Python : profils, roadmaps, recherche de formations. "
    "L'authentification (email, Google, OTP SMS/WhatsApp) est gérée par Supabase Auth.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(roadmap.router)
app.include_router(search.router)
