from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.search_schema import MetierSearchResult
from app.services.search_service import search_formations

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("/formations", response_model=list[MetierSearchResult])
async def search_formations_endpoint(
    budget_max: Optional[int] = Query(default=None, description="Budget annuel max en FCFA"),
    ville: Optional[str] = Query(default=None, description="Ville souhaitée"),
    competences: Optional[list[str]] = Query(default=None, description="Compétences/intérêts"),
    limit: int = Query(default=10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """
    Route publique (pas d'authentification requise) : recherche dans le
    catalogue de référence métiers/établissements/formations. Résultats
    triés par affinité de compétences si `competences` est fourni.
    """
    return await search_formations(db, budget_max=budget_max, ville=ville, competences=competences, limit=limit)
