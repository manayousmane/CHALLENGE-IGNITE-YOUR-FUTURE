import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import CurrentUser, get_current_user
from app.db.models import Roadmap
from app.db.session import get_db
from app.schemas.roadmap_schema import RoadmapCreate, RoadmapOut, RoadmapUpdate

router = APIRouter(prefix="/api/roadmaps", tags=["roadmaps"])


@router.get("", response_model=list[RoadmapOut])
async def list_my_roadmaps(
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Roadmap).where(Roadmap.user_id == user.id))
    return result.scalars().all()


@router.post("", response_model=RoadmapOut, status_code=201)
async def create_roadmap(
    payload: RoadmapCreate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    roadmap = Roadmap(
        user_id=user.id,
        metier_id=payload.metier_id,
        titre=payload.titre,
        contenu=payload.contenu,
        created_at=now,
        updated_at=now,
    )
    db.add(roadmap)
    await db.commit()
    await db.refresh(roadmap)
    return roadmap


async def _get_owned_roadmap(roadmap_id: str, user: CurrentUser, db: AsyncSession) -> Roadmap:
    roadmap = await db.get(Roadmap, uuid.UUID(roadmap_id))
    if roadmap is None or str(roadmap.user_id) != user.id:
        raise HTTPException(status_code=404, detail="Roadmap introuvable.")
    return roadmap


@router.patch("/{roadmap_id}", response_model=RoadmapOut)
async def update_roadmap_progress(
    roadmap_id: str,
    payload: RoadmapUpdate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    roadmap = await _get_owned_roadmap(roadmap_id, user, db)

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(roadmap, field, value)
    roadmap.updated_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(roadmap)
    return roadmap


@router.delete("/{roadmap_id}", status_code=204)
async def delete_roadmap(
    roadmap_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    roadmap = await _get_owned_roadmap(roadmap_id, user, db)
    await db.delete(roadmap)
    await db.commit()
