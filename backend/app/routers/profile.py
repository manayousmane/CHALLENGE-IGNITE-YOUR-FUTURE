from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Request
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/profile", tags=["profile"])

# Mémoire en cache pour la session locale / invités
_USER_PROFILES: dict[str, dict[str, Any]] = {}
_USER_DASHBOARDS: dict[str, dict[str, Any]] = {}


class ProfileUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    display_name: str | None = None
    phone: str | None = None
    photo_url: str | None = None


class DashboardUpdate(BaseModel):
    readiness_score: int | None = None
    target_specialty: str | None = None
    diagnostics_data: list[Any] | None = None
    skills_data: list[Any] | None = None
    saved_formations_data: list[Any] | None = None
    notes: str | None = None


def _get_user_id(request: Request) -> str:
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:].strip()
        # On peut extraire un hash ou identifier l'utilisateur
        return f"user_{abs(hash(token)) % 100000}"
    return "guest_user"


@router.get("")
async def get_profile(request: Request) -> dict[str, Any]:
    uid = _get_user_id(request)
    profile = _USER_PROFILES.get(uid)
    if not profile:
        profile = {
            "id": uid,
            "email": "utilisateur@parcours.bj",
            "display_name": "Jeune Talent Béninois",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        _USER_PROFILES[uid] = profile
    return profile


@router.put("")
async def update_profile(payload: ProfileUpdate, request: Request) -> dict[str, Any]:
    uid = _get_user_id(request)
    profile = _USER_PROFILES.get(uid, {"id": uid, "email": "utilisateur@parcours.bj"})
    for k, v in payload.model_dump(exclude_none=True).items():
        profile[k] = v
    profile["updated_at"] = datetime.now(timezone.utc).isoformat()
    _USER_PROFILES[uid] = profile
    return profile


@router.get("/dashboard")
async def get_dashboard(request: Request) -> dict[str, Any]:
    uid = _get_user_id(request)
    dashboard = _USER_DASHBOARDS.get(uid)
    if not dashboard:
        dashboard = {
            "user_id": uid,
            "readiness_score": 75,
            "target_specialty": "Orientation Tech en cours",
            "diagnostics_data": [],
            "skills_data": [],
            "saved_formations_data": [],
            "notes": "Bienvenue sur votre espace personnel PARCOURS-AI",
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        _USER_DASHBOARDS[uid] = dashboard
    return dashboard


@router.put("/dashboard")
async def update_dashboard(payload: DashboardUpdate, request: Request) -> dict[str, Any]:
    uid = _get_user_id(request)
    dashboard = _USER_DASHBOARDS.get(uid, {"user_id": uid})
    for k, v in payload.model_dump(exclude_none=True).items():
        dashboard[k] = v
    dashboard["updated_at"] = datetime.now(timezone.utc).isoformat()
    _USER_DASHBOARDS[uid] = dashboard
    return dashboard
