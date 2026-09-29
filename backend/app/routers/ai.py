from __future__ import annotations

from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.core.config import settings
from app.services.gemini_service import GeminiService

router = APIRouter(prefix="/api", tags=["ai"])
gemini_service = GeminiService()


class DashboardInsightsRequest(BaseModel):
    userRole: str = "student"
    targetCareer: str = "Développeur Full-Stack Web & Cloud"
    completedSkills: list[str] = Field(default_factory=list)


class FeedbackRequest(BaseModel):
    userUid: str | None = None
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


# Stockage mémoire local des feedbacks (pour la démo et persistance rapide)
_FEEDBACKS_STORAGE: list[dict[str, Any]] = []


@router.get("/ai-status")
async def get_ai_status() -> dict[str, Any]:
    has_gemini = bool(settings.gemini_api_key)
    has_tavily = bool(settings.tavily_api_key)
    return {
        "active": True,
        "modelName": f"{settings.gemini_model} (Connecté)" if has_gemini else "Moteur Local IA Bénin (Actif)",
        "provider": "Google DeepMind" if has_gemini else "Parcours-AI Local Engine",
        "searchProvider": "Tavily Search API (Bénin)" if has_tavily else "DuckDuckGo & Catalogue National Bénin",
        "knowledgeBase": "530+ Filières et Établissements Béninois certifiés",
        "hasGeminiKey": has_gemini,
        "hasTavilyKey": has_tavily,
    }


@router.post("/dashboard-insights")
async def generate_insights(payload: DashboardInsightsRequest) -> dict[str, Any]:
    insights = await gemini_service.generate_dashboard_insights(
        user_role=payload.userRole,
        target_career=payload.targetCareer,
        completed_skills=payload.completedSkills,
    )
    return {"data": {"insights": insights}}


@router.post("/feedbacks")
async def submit_feedback(payload: FeedbackRequest) -> dict[str, Any]:
    entry = payload.model_dump()
    _FEEDBACKS_STORAGE.append(entry)
    return {"status": "success", "message": "Feedback enregistré avec succès"}
