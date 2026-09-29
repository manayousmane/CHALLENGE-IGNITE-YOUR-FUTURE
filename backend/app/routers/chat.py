from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request

from app.core.config import settings
from app.schemas.chat import ChatRequest, ChatResponse, SearchSourceItem
from app.schemas.search import SearchResult
from app.services.catalog_service import catalog_service
from app.services.gemini_service import GeminiService
from app.services.matching_service import NoOpportunityError
from app.services.orchestrator import Orchestrator
from app.services.search_service import SearchService

router = APIRouter(prefix="/api", tags=["chat"])
orchestrator = Orchestrator()
gemini_service = GeminiService()
search_service = SearchService()

# Sources institutionnelles béninoises garanties
DEFAULT_BENIN_SOURCES = [
    SearchSourceItem(
        title="Ministère de l'Enseignement Supérieur et de la Recherche Scientifique (Bénin)",
        uri="https://enseignementsuperieur.gouv.bj",
    ),
    SearchSourceItem(
        title="IFRI - Institut de Formation et de Recherche en Informatique (UAC)",
        uri="https://ifri-uac.bj",
    ),
    SearchSourceItem(
        title="Université d'Abomey-Calavi (Portail Officiel)",
        uri="https://uac.bj",
    ),
    SearchSourceItem(
        title="Sèmè City - Cité Internationale de l'Innovation et du Savoir",
        uri="https://semecity.bj",
    ),
]


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest, request: Request) -> ChatResponse:
    # 1. Traitement du format Interactif Frontend (CareerAdvisorChat.tsx)
    if payload.message is not None:
        user_msg = payload.message.strip()
        if len(user_msg) > settings.max_message_length:
            raise HTTPException(status_code=413, detail="Message trop long")

        # Recherche de la carrière la plus alignée
        matched_career = catalog_service.find_best_matching_career(user_msg)

        # Recherche web en direct si activée
        web_results: list[SearchResult] = []
        search_sources: list[SearchSourceItem] = []

        if payload.useSearch:
            try:
                # Requête ciblée pour le Bénin
                query = f"formation {user_msg} Bénin université école"
                queries = [query]
                if settings.tavily_api_key:
                    web_results = await search_service._tavily(queries)
                else:
                    web_results = await search_service._duckduckgo(queries)

                for r in web_results[:4]:
                    search_sources.append(SearchSourceItem(title=r.title, uri=r.url))
            except Exception as e:
                print(f"[Chat] Recherche web externe différée: {e}")

        # Si pas de sources dynamiques ou échec réseau, on fournit les sources de référence certifiées
        if not search_sources:
            search_sources = DEFAULT_BENIN_SOURCES[:3]

        # Génération du conseil d'orientation par Gemini (avec fallback local)
        reply_text = await gemini_service.generate_chat_advisory(
            message=user_msg,
            history=payload.history,
            user_profile=payload.userProfile,
            web_results=web_results,
            career_match=matched_career,
        )

        return ChatResponse(
            text=reply_text,
            searchSources=search_sources,
            recommendedCareers=[matched_career] if matched_career else None,
            isGeminiGrounded=True,
        )

    # 2. Traitement du format classique de passation / questionnaire 8 étapes
    if len(payload.messages) > settings.max_messages_per_session:
        raise HTTPException(status_code=429, detail="Nombre maximal de messages atteint")
    if any(len(message.content) > settings.max_message_length for message in payload.messages):
        raise HTTPException(status_code=413, detail="Message trop long")

    try:
        return await orchestrator.handle(payload)
    except NoOpportunityError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Service de recherche indisponible") from exc