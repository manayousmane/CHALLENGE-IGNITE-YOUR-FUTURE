from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator, model_validator


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=5000)


class UserProfile(BaseModel):
    serie_bac: str | None = None
    resultats_scolaires: str | dict[str, float] | None = None
    appetences: list[str] = Field(default_factory=list)
    competences_projets: list[str] = Field(default_factory=list)
    objectif_professionnel: str | None = None
    budget_fcfa: int | None = Field(default=None, ge=0)
    ville: str | None = None
    mobilite: bool | None = None
    preference_formation: str | None = None
    objectifs: list[str] = Field(default_factory=list)

    @field_validator("appetences", "competences_projets", "objectifs")
    @classmethod
    def clean_lists(cls, values: list[str]) -> list[str]:
        return [value.strip() for value in values if value.strip()]


class ChatRequest(BaseModel):
    # Format classique de passation / tests
    messages: list[Message] = Field(default_factory=list)
    user_profile: UserProfile = Field(default_factory=UserProfile)

    # Format interactif envoyé par le frontend React (CareerAdvisorChat.tsx)
    message: str | None = None
    history: list[dict[str, Any]] = Field(default_factory=list)
    userProfile: dict[str, Any] | None = None
    mode: str | None = None
    useSearch: bool | None = True


class Source(BaseModel):
    url: str
    title: str | None = None
    domain: str | None = None
    snippet: str | None = None
    consulted_at: str
    reliability: Literal["official", "institutional", "secondary", "unknown"]


class Establishment(BaseModel):
    nom: str
    ville: str | None = None
    frais_annuels_fcfa: int | None = Field(default=None, ge=0)
    duree_ans: int | None = Field(default=None, ge=1)
    formation: str | None = None
    conditions_admission: list[str] = Field(default_factory=list)
    sources: list[Source] = Field(default_factory=list)


class CareerRecommendation(BaseModel):
    id: str
    metier: str
    match_percentage: int = Field(ge=0, le=100)
    description_courte: str
    competences_a_acquerir: list[str]
    etablissements: list[Establishment]
    raisons_match: list[str] = Field(default_factory=list)
    sources: list[Source] = Field(default_factory=list)
    avertissement: str | None = None


class SearchSourceItem(BaseModel):
    title: str
    uri: str


class ChatResponse(BaseModel):
    # Champs pour le contrat classique (tests unitaires)
    is_final_recommendation: bool | None = None
    question: str | None = None
    field_expected: str | None = None
    user_profile_summary: UserProfile | None = None
    recommendations: list[CareerRecommendation] | None = None

    # Champs pour le frontend React interactif
    text: str | None = None
    searchSources: list[SearchSourceItem] | None = None
    recommendedCareers: list[dict[str, Any]] | None = None
    isGeminiGrounded: bool = True

    @model_validator(mode="after")
    def validate_shape(self) -> "ChatResponse":
        # Si c'est une réponse de type historique
        if self.is_final_recommendation is not None:
            if self.is_final_recommendation and not self.recommendations:
                raise ValueError("Une reponse finale doit contenir des recommandations")
            if not self.is_final_recommendation and not self.question:
                raise ValueError("Une reponse intermediaire doit contenir une question")
        # Si c'est une réponse frontend, le champ text doit être présent
        elif not self.text:
            raise ValueError("Une reponse conversationnelle doit contenir 'text' ou 'is_final_recommendation'")
        return self