import uuid
from typing import Optional

from pydantic import BaseModel


class ProfileOut(BaseModel):
    id: uuid.UUID
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    display_name: Optional[str] = None
    phone: Optional[str] = None
    photo_url: Optional[str] = None

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    display_name: Optional[str] = None
    phone: Optional[str] = None


class DashboardOut(BaseModel):
    readiness_score: int
    target_specialty: str
    diagnostics_data: list
    skills_data: list
    saved_formations_data: list
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class DashboardUpdate(BaseModel):
    readiness_score: Optional[int] = None
    target_specialty: Optional[str] = None
    diagnostics_data: Optional[list] = None
    skills_data: Optional[list] = None
    saved_formations_data: Optional[list] = None
    notes: Optional[str] = None