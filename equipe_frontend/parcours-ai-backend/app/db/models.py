import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    email: Mapped[str] = mapped_column(Text, nullable=False)
    first_name: Mapped[str | None] = mapped_column(Text)
    last_name: Mapped[str | None] = mapped_column(Text)
    display_name: Mapped[str | None] = mapped_column(Text)
    phone: Mapped[str | None] = mapped_column(Text)
    photo_url: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class UserDashboard(Base):
    __tablename__ = "user_dashboards"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id"), unique=True)
    readiness_score: Mapped[int] = mapped_column(Integer, default=0)
    target_specialty: Mapped[str] = mapped_column(Text, default="Orientation en cours")
    diagnostics_data: Mapped[list] = mapped_column(JSONB, default=list)
    skills_data: Mapped[list] = mapped_column(JSONB, default=list)
    saved_formations_data: Mapped[list] = mapped_column(JSONB, default=list)
    notes: Mapped[str | None] = mapped_column(Text, default="")
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class Feedback(Base):
    __tablename__ = "feedbacks"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id"))
    rating: Mapped[int] = mapped_column(Integer)
    comment: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    __table_args__ = (CheckConstraint("rating between 1 and 5"),)


class Metier(Base):
    __tablename__ = "metiers"

    id: Mapped[str] = mapped_column(Text, primary_key=True)  # slug
    nom: Mapped[str] = mapped_column(Text)
    secteur: Mapped[str | None] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)
    competences_requises: Mapped[list] = mapped_column(JSONB, default=list)
    series_bac_recommandees: Mapped[list] = mapped_column(JSONB, default=list)
    debouches_locaux: Mapped[list] = mapped_column(JSONB, default=list)


class Etablissement(Base):
    __tablename__ = "etablissements"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nom: Mapped[str] = mapped_column(Text)
    ville: Mapped[str] = mapped_column(Text)
    type: Mapped[str | None] = mapped_column(String(10))
    site_web: Mapped[str | None] = mapped_column(Text)


class Formation(Base):
    __tablename__ = "formations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    etablissement_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("etablissements.id"))
    metier_id: Mapped[str] = mapped_column(Text, ForeignKey("metiers.id"))
    frais_annuels_fcfa: Mapped[int] = mapped_column(Integer)
    duree_ans: Mapped[int] = mapped_column(Integer)
    niveau_requis: Mapped[str | None] = mapped_column(Text)


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id"))
    metier_id: Mapped[str | None] = mapped_column(Text, ForeignKey("metiers.id"))
    titre: Mapped[str] = mapped_column(Text)
    contenu: Mapped[dict] = mapped_column(JSONB, default=dict)
    progression: Mapped[int] = mapped_column(Integer, default=0)
    statut: Mapped[str] = mapped_column(Text, default="en_cours")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))