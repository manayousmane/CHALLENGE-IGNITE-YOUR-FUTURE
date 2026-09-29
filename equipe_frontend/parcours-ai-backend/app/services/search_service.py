from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Etablissement, Formation, Metier


async def search_formations(
    db: AsyncSession,
    budget_max: Optional[int] = None,
    ville: Optional[str] = None,
    competences: Optional[list[str]] = None,
    limit: int = 10,
) -> list[dict]:
    """
    Recherche déterministe dans le catalogue de référence — jamais
    d'appel IA ici, uniquement des requêtes SQL sur des données vérifiées.
    """
    query = (
        select(Formation, Metier, Etablissement)
        .join(Metier, Formation.metier_id == Metier.id)
        .join(Etablissement, Formation.etablissement_id == Etablissement.id)
    )

    if budget_max is not None:
        query = query.where(Formation.frais_annuels_fcfa <= budget_max)
    if ville:
        query = query.where(Etablissement.ville.ilike(f"%{ville}%"))

    result = await db.execute(query)
    rows = result.all()

    par_metier: dict[str, dict] = {}
    for formation, metier, etablissement in rows:
        entry = par_metier.setdefault(
            metier.id,
            {
                "id": metier.id,
                "nom": metier.nom,
                "secteur": metier.secteur,
                "description": metier.description,
                "competences_requises": metier.competences_requises or [],
                "etablissements": [],
                "_score": 0,
            },
        )
        entry["etablissements"].append(
            {
                "nom": etablissement.nom,
                "ville": etablissement.ville,
                "frais_annuels_fcfa": formation.frais_annuels_fcfa,
                "duree_ans": formation.duree_ans,
            }
        )

    if competences:
        wanted = set(c.lower() for c in competences)
        for entry in par_metier.values():
            mots_cles = set(str(c).lower() for c in entry["competences_requises"])
            entry["_score"] = len(mots_cles & wanted)
        resultats = sorted(par_metier.values(), key=lambda e: e["_score"], reverse=True)
    else:
        resultats = list(par_metier.values())

    for entry in resultats:
        entry.pop("_score", None)

    return resultats[:limit]
