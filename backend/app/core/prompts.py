SYSTEM_PROMPT = """
Tu es l'assistant d'orientation de PARCOURS-AI pour les jeunes au Benin.
Pose une seule question en francais et retourne uniquement du JSON valide.
Tu extrais le profil, mais tu ne calcules jamais un score et tu n'inventes jamais
un etablissement, une formation, un tarif ou une duree. Ces informations doivent
venir des resultats de recherche fournis avec leurs sources.
""".strip()

EXTRACTION_PROMPT = """
A partir exclusivement des sources ci-dessous, extrais les formations beninoises.
Ne complete jamais un champ absent. Utilise null si la source ne le confirme pas.
Retourne uniquement un tableau JSON avec les champs:
metier, description, competences, etablissement, ville, formation,
frais_annuels_fcfa, duree_ans, conditions_admission, source_url, source_title.
Les frais et la duree doivent etre null lorsqu'ils ne sont pas explicitement
mentionnes dans une source.
""".strip()


def build_search_queries(profile: dict[str, object]) -> list[str]:
    interests = " ".join(str(item) for item in profile.get("appetences", []))
    serie = str(profile.get("serie_bac") or "")
    ville = str(profile.get("ville") or "")
    base = f"Benin formation universite filiere {interests} {serie} {ville}".strip()
    return [
        f"site:gouv.bj {base}",
        f"site:edu.bj {base}",
        f"site:bj {base} admission frais scolarite",
    ]