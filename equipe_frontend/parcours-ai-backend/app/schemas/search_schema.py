from typing import Optional

from pydantic import BaseModel


class EtablissementOut(BaseModel):
    nom: str
    ville: str
    frais_annuels_fcfa: int
    duree_ans: int


class MetierSearchResult(BaseModel):
    id: str
    nom: str
    secteur: Optional[str] = None
    description: Optional[str] = None
    competences_requises: list
    etablissements: list[EtablissementOut]
