import uuid
from typing import Optional

from pydantic import BaseModel, Field


class RoadmapCreate(BaseModel):
    metier_id: Optional[str] = None
    titre: str
    contenu: dict = Field(default_factory=dict)


class RoadmapUpdate(BaseModel):
    contenu: Optional[dict] = None
    progression: Optional[int] = Field(default=None, ge=0, le=100)
    statut: Optional[str] = None


class RoadmapOut(BaseModel):
    id: uuid.UUID
    metier_id: Optional[str] = None
    titre: str
    contenu: dict
    progression: int
    statut: str

    class Config:
        from_attributes = True