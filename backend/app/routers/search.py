from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Query

from app.services.catalog_service import catalog_service

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("/formations")
async def search_formations_endpoint(
    q: str | None = Query(default=None, description="Terme recherché"),
    budget_max: int | None = Query(default=None, description="Budget annuel max en FCFA"),
    ville: str | None = Query(default=None, description="Ville souhaitée (Cotonou, Calavi, Parakou...)"),
    competences: list[str] | None = Query(default=None, description="Compétences ou intérêts"),
    limit: int = Query(default=20, ge=1, le=100),
) -> list[dict[str, Any]]:
    """
    Recherche déterministe dans le catalogue béninois certifié de référence
    (530+ filières réelles d'universités et instituts du Bénin).
    """
    return catalog_service.search_formations(
        query=q,
        budget_max=budget_max,
        ville=ville,
        competences=competences,
        limit=limit,
    )
