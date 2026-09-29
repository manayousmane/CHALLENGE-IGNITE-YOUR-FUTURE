import re

from app.schemas.chat import Message, UserProfile

REQUIRED_FIELDS = (
    ("serie_bac", "Quelle est ta serie de Bac ou ton dernier niveau d'etudes ?"),
    ("resultats_scolaires", "Quelles sont tes principales notes ou matieres fortes ?"),
    ("appetences", "Quels domaines, matieres ou activites t'interessent le plus ?"),
    ("competences_projets", "Quelles competences as-tu deja ou quels projets as-tu realises ?"),
    ("objectif_professionnel", "Quel metier ou objectif professionnel aimerais-tu atteindre ?"),
    ("budget_fcfa", "Quel budget annuel approximatif peux-tu consacrer a ta formation, en FCFA ?"),
    ("ville", "Dans quelle ville vis-tu et jusqu'ou peux-tu te deplacer ?"),
    ("preference_formation", "Prefere-tu une formation courte, longue, pratique, universitaire, en presentiel ou en ligne ?"),
)


def next_missing_field(profile: UserProfile) -> tuple[str, str] | None:
    for field_name, question in REQUIRED_FIELDS:
        value = getattr(profile, field_name)
        if value is None or value == [] or value == "":
            return field_name, question
    return None


def merge_profile(current: UserProfile, extracted: dict[str, object]) -> UserProfile:
    values = current.model_dump()
    values.update({key: value for key, value in extracted.items() if value not in (None, "", [])})
    return UserProfile.model_validate(values)


def extract_latest_answer(messages: list[Message], field_name: str) -> dict[str, object]:
    user_messages = [message.content.strip() for message in messages if message.role == "user"]
    if not user_messages:
        return {}
    answer = user_messages[-1]
    if field_name == "budget_fcfa":
        digits = re.sub(r"[^0-9]", "", answer)
        return {field_name: int(digits)} if digits else {}
    if field_name in ("appetences", "competences_projets"):
        values = [item.strip() for item in re.split(r",|;|\bet\b|\bet de\b", answer, flags=re.IGNORECASE) if item.strip()]
        return {field_name: values}
    return {field_name: answer}