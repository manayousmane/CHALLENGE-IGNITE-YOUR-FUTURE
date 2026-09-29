from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import CurrentUser, get_current_user
from app.db.models import Profile, UserDashboard
from app.db.session import get_db
from app.schemas.profile_schema import (
    DashboardOut,
    DashboardUpdate,
    ProfileOut,
    ProfileUpdate,
)

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("", response_model=ProfileOut)
async def get_my_profile(
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    profile = await db.get(Profile, user.id)
    if profile is None:
        # Ne devrait pas arriver : le trigger Postgres crée le profil
        # automatiquement à l'inscription. Filet de sécurité au cas où.
        raise HTTPException(status_code=404, detail="Profil introuvable.")
    return profile


@router.put("", response_model=ProfileOut)
async def update_my_profile(
    payload: ProfileUpdate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    profile = await db.get(Profile, user.id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Profil introuvable.")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(profile, field, value)
    profile.updated_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(profile)
    return profile


@router.get("/dashboard", response_model=DashboardOut)
async def get_my_dashboard(
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(UserDashboard).where(UserDashboard.user_id == user.id))
    dashboard = result.scalar_one_or_none()

    if dashboard is None:
        # Premier accès : on crée un dashboard vide par défaut.
        dashboard = UserDashboard(user_id=user.id, updated_at=datetime.now(timezone.utc))
        db.add(dashboard)
        await db.commit()
        await db.refresh(dashboard)

    return dashboard


@router.put("/dashboard", response_model=DashboardOut)
async def update_my_dashboard(
    payload: DashboardUpdate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(UserDashboard).where(UserDashboard.user_id == user.id))
    dashboard = result.scalar_one_or_none()

    if dashboard is None:
        dashboard = UserDashboard(user_id=user.id)
        db.add(dashboard)

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(dashboard, field, value)
    dashboard.updated_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(dashboard)
    return dashboard
