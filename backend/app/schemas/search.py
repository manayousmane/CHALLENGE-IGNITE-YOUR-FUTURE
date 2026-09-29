from pydantic import BaseModel, Field


class SearchResult(BaseModel):
    title: str
    url: str
    snippet: str = ""
    domain: str | None = None
    source_kind: str = "unknown"


class ExtractedOpportunity(BaseModel):
    metier: str
    description: str
    competences: list[str] = Field(default_factory=list)
    etablissement: str | None = None
    ville: str | None = None
    formation: str | None = None
    frais_annuels_fcfa: int | None = Field(default=None, ge=0)
    duree_ans: int | None = Field(default=None, ge=1)
    conditions_admission: list[str] = Field(default_factory=list)
    source_url: str
    source_title: str