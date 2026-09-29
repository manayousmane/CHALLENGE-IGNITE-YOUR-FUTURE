from __future__ import annotations

from datetime import datetime, timezone
from urllib.parse import urlparse

from app.schemas.chat import CareerRecommendation, Establishment, Source, UserProfile
from app.schemas.search import ExtractedOpportunity


class NoOpportunityError(Exception):
    pass


def compute_recommendations(profile: UserProfile, opportunities: list[ExtractedOpportunity]) -> list[CareerRecommendation]:
    if not opportunities:
        raise NoOpportunityError("Aucune formation exploitable n'a ete trouvee")
    ranked = sorted((_recommendation(profile, item) for item in opportunities), key=lambda item: item.match_percentage, reverse=True)
    unique: list[CareerRecommendation] = []
    seen: set[str] = set()
    for item in ranked:
        if item.id not in seen:
            unique.append(item)
            seen.add(item.id)
        if len(unique) == 3:
            break
    return unique


def _recommendation(profile: UserProfile, opportunity: ExtractedOpportunity) -> CareerRecommendation:
    text = " ".join(
        [
            opportunity.metier,
            opportunity.description,
            opportunity.formation or "",
            *opportunity.competences,
            *profile.appetences,
            *profile.competences_projets,
            profile.objectif_professionnel or "",
            profile.preference_formation or "",
        ]
    ).lower()
    interest_score = _interest_score(profile.appetences, text)
    series_score = _series_score(profile.serie_bac, text)
    budget_score = 100 if opportunity.frais_annuels_fcfa is None else _budget_score(profile.budget_fcfa, opportunity.frais_annuels_fcfa)
    location_score = _location_score(profile.ville, opportunity.ville, text)
    result_score = _result_score(profile.resultats_scolaires, text)
    score = round(interest_score * 0.30 + series_score * 0.25 + result_score * 0.20 + budget_score * 0.15 + location_score * 0.10)
    source = _source(opportunity)
    establishment = Establishment(
        nom=opportunity.etablissement or "Etablissement a confirmer",
        ville=opportunity.ville,
        frais_annuels_fcfa=opportunity.frais_annuels_fcfa,
        duree_ans=opportunity.duree_ans,
        formation=opportunity.formation,
        conditions_admission=opportunity.conditions_admission,
        sources=[source],
    )
    reasons = []
    if interest_score >= 60:
        reasons.append("Le domaine correspond aux centres d'interet declares")
    if series_score >= 60:
        reasons.append("La serie ou le niveau scolaire semble compatible")
    if profile.budget_fcfa is not None and opportunity.frais_annuels_fcfa is None:
        reasons.append("Le tarif n'est pas publie dans la source consultee")
    if location_score >= 60:
        reasons.append("La localisation correspond ou reste compatible avec la mobilite")
    return CareerRecommendation(
        id=_slug(opportunity.metier, opportunity.formation or opportunity.source_url),
        metier=opportunity.metier,
        match_percentage=max(0, min(100, score)),
        description_courte=opportunity.description,
        competences_a_acquerir=opportunity.competences,
        etablissements=[establishment],
        raisons_match=reasons,
        sources=[source],
        avertissement="Informations issues d'une recherche web; confirmer admission et tarifs aupres de l'etablissement.",
    )


def _interest_score(interests: list[str], text: str) -> int:
    return 50 if not interests else round(100 * sum(item.lower() in text for item in interests) / len(interests))


def _series_score(serie: str | None, text: str) -> int:
    return 50 if not serie else (80 if serie.lower() in text else 40)


def _budget_score(budget: int | None, cost: int) -> int:
    if budget is None:
        return 50
    if cost <= budget:
        return 100
    if cost <= budget * 1.25:
        return 50
    return 0


def _location_score(city: str | None, opportunity_city: str | None, text: str) -> int:
    if not city:
        return 50
    if opportunity_city and city.lower() == opportunity_city.lower():
        return 100
    return 70 if city.lower() in text else 40


def _result_score(results: str | dict[str, float] | None, text: str) -> int:
    if not results:
        return 50
    if isinstance(results, dict):
        return max(0, min(100, round(sum(results.values()) / max(len(results), 1) * 6.67)))
    return 60 if any(word in text for word in ("licence", "formation", "admission")) else 50


def _source(opportunity: ExtractedOpportunity) -> Source:
    domain = urlparse(opportunity.source_url).netloc.lower().removeprefix("www.")
    official = domain.endswith(".gouv.bj") or domain.endswith(".edu.bj") or domain.endswith(".bj")
    return Source(url=opportunity.source_url, title=opportunity.source_title, domain=domain, consulted_at=datetime.now(timezone.utc).date().isoformat(), reliability="official" if official else "secondary")


def _slug(*parts: str) -> str:
    value = "-".join(parts).lower()
    return "".join(char if char.isalnum() else "-" for char in value).strip("-")[:80]