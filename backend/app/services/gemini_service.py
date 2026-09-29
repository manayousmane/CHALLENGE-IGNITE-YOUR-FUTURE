from __future__ import annotations

import json
from typing import Any

import httpx

from app.core.config import settings
from app.core.prompts import EXTRACTION_PROMPT
from app.schemas.search import ExtractedOpportunity, SearchResult

SYSTEM_ADVISOR_INSTRUCTION = """Tu es le conseiller d'orientation expert de PARCOURS-AI, la plateforme d'orientation de référence pour la jeunesse au Bénin et en Afrique de l'Ouest.
Ta mission est d'éclairer l'utilisateur sur son orientation scolaire et professionnelle avec réalisme, empathie et rigueur :
- Tu connais parfaitement le contexte béninois : Universités publiques (UAC, Université de Parakou, UNSTIM), instituts d'excellence (IFRI, ENEAM, EPAC, INSTI Lokossa), écoles réputées (Epitech Bénin, Pigier Bénin, HECM, etc.) et initiatives comme Sèmè City.
- Tu valorises les compétences réelles (pratique, projets, anglais, certifications) et tu expliques les débouchés locaux au Bénin et les opportunités internationales de travail à distance (Remote).
- RÈGLE D'OR : Ne JAMAIS inventer de frais de scolarité ou de fausses conditions d'admission. Cite les réalités du terrain ou invite à vérifier auprès de l'établissement concerné.
- Sois clair, chaleureux, concis et actionnable. Utilise des listes à puces et du texte en gras pour une lecture agréable.
"""


class GeminiService:
    async def extract_opportunities(self, results: list[SearchResult]) -> list[ExtractedOpportunity]:
        if not settings.gemini_api_key or not results:
            return self._heuristic_extract(results)
        prompt = self._build_prompt(results)
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent"
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                response = await client.post(
                    url,
                    params={"key": settings.gemini_api_key},
                    json={
                        "systemInstruction": {"parts": [{"text": EXTRACTION_PROMPT}]},
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {"responseMimeType": "application/json", "temperature": 0.1},
                    },
                )
                response.raise_for_status()
            text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
            payload = json.loads(text)
            return [ExtractedOpportunity.model_validate(item) for item in payload]
        except Exception:
            return self._heuristic_extract(results)

    async def generate_chat_advisory(
        self,
        message: str,
        history: list[dict[str, Any]] | None = None,
        user_profile: dict[str, Any] | None = None,
        web_results: list[SearchResult] | None = None,
        career_match: dict[str, Any] | None = None,
    ) -> str:
        """Génère la réponse de conseil d'orientation en s'appuyant sur Gemini ou sur notre moteur local."""
        if not settings.gemini_api_key:
            return self._local_advisory(message, user_profile, web_results, career_match)

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent"
        
        # Contexte supplémentaire injecté dans le prompt utilisateur
        context_parts = []
        if user_profile:
            context_parts.append(f"Profil utilisateur : {json.dumps(user_profile, ensure_ascii=False)}")
        if career_match:
            context_parts.append(
                f"Métier détecté en adéquation : {career_match.get('title')} "
                f"(Indice de concordance : {career_match.get('matchScore', 85)}%)\n"
                f"Description : {career_match.get('shortDescription')}\n"
                f"Compétences clés : {', '.join(career_match.get('keySkills', []))}\n"
                f"Salaire Bénin : {career_match.get('salaryLocal')}\n"
                f"Salaire Remote : {career_match.get('salaryRemote')}"
            )
        if web_results:
            sources_summary = "\n".join([f"- {r.title} ({r.url}): {r.snippet[:150]}" for r in web_results[:5]])
            context_parts.append(f"Informations web béninoises récentes trouvées :\n{sources_summary}")

        full_prompt = (
            f"Question de l'utilisateur : {message}\n\n"
            + ("\n\n".join(context_parts) if context_parts else "")
            + "\n\nRédige une réponse personnalisée, inspirante, structurée et directement utile pour son avenir."
        )

        try:
            async with httpx.AsyncClient(timeout=25) as client:
                response = await client.post(
                    url,
                    params={"key": settings.gemini_api_key},
                    json={
                        "systemInstruction": {"parts": [{"text": SYSTEM_ADVISOR_INSTRUCTION}]},
                        "contents": [{"parts": [{"text": full_prompt}]}],
                        "generationConfig": {"temperature": 0.4},
                    },
                )
                response.raise_for_status()
                candidate = response.json().get("candidates", [])[0]
                return candidate.get("content", {}).get("parts", [])[0].get("text", "")
        except Exception as e:
            print(f"[GeminiService] Fallback local déclenché: {e}")
            return self._local_advisory(message, user_profile, web_results, career_match)

    def _local_advisory(
        self,
        message: str,
        user_profile: dict[str, Any] | None,
        web_results: list[SearchResult] | None,
        career_match: dict[str, Any] | None,
    ) -> str:
        """Générateur local déterministe garantissant une réponse de qualité sans dépendre d'une clé API."""
        msg_lower = message.lower()
        
        if career_match:
            c_title = career_match.get("title", "Carrière Tech")
            c_score = career_match.get("matchScore", 92)
            c_desc = career_match.get("shortDescription", "")
            c_sal_loc = career_match.get("salaryLocal", "400.000 à 1.000.000 FCFA / mois")
            c_sal_rem = career_match.get("salaryRemote", "35.000€ à 70.000€ / an")
            c_skills = ", ".join(career_match.get("keySkills", [])[:4])
            
            reply = (
                f"Excellente question ! Au regard de vos aspirations et de votre intérêt, la trajectoire **{c_title}** "
                f"représente une opportunité de premier choix (Indice d'adéquation estimé : **{c_score}%**).\n\n"
                f"**Aperçu du métier :**\n"
                f"{c_desc}\n\n"
                f"**Rémunérations constatées :**\n"
                f"- **Marché local (Bénin & sous-région) :** `{c_sal_loc}`\n"
                f"- **Télétravail international (Remote) :** `{c_sal_rem}`\n\n"
                f"**Compétences prioritaires à acquérir :**\n"
                f"{c_skills}\n\n"
                f"**Formations recommandées au Bénin :**\n"
                f"- **IFRI - Université d'Abomey-Calavi (UAC)** : Licences et Masters en Génie Logiciel, IA et Sécurité des Systèmes.\n"
                f"- **Epitech Bénin (Cotonou / Sèmè City)** : Cursus d'expertise informatique par projets pratiques.\n"
                f"- **ENEAM & EPAC** : Filières d'ingénierie et d'informatique appliquée de gestion.\n\n"
                f"Vous pouvez consulter votre feuille de route détaillée en 4 phases ci-dessous et la télécharger au format PDF."
            )
            return reply

        # Réponse générique contextualisée
        return (
            f"Merci pour votre message. Chez **Parcours AI**, notre objectif est de vous orienter vers les meilleures opportunités académiques et professionnelles au Bénin.\n\n"
            f"Les filières numériques (Génie Logiciel, Data Science & IA, Cybersécurité et Design UI/UX) offrent aujourd'hui les taux d'insertion les plus élevés du marché, tant auprès des entreprises béninoises (startups, banques, institutions publiques) que des plateformes internationales de télétravail.\n\n"
            f"N'hésitez pas à préciser votre série de Bac, vos matières fortes ou vos préférences de formation pour affiner votre diagnostic personnalisé !"
        )

    async def generate_dashboard_insights(
        self,
        user_role: str,
        target_career: str,
        completed_skills: list[str],
    ) -> list[dict[str, str]]:
        """Génère 3 insights actionnables pour le tableau de bord utilisateur."""
        return [
            {
                "type": "strength",
                "title": f"Alignement stratégique : {target_career}",
                "desc": "Votre parcours montre une cohérence remarquable avec les exigences du marché tech béninois et de la sous-région ouest-africaine."
            },
            {
                "type": "growth",
                "title": "Renforcement pratique & Projets réels",
                "desc": "Les recruteurs privilégient les candidats capables de présenter un portfolio GitHub vérifiable avec au moins 2 applications complètes déployées."
            },
            {
                "type": "market",
                "title": "Opportunités Remote & Compétitivité",
                "desc": "En associant vos compétences techniques à un bon niveau d'anglais professionnel, vous accédez directement aux offres de télétravail rémunérées en devises."
            }
        ]

    @staticmethod
    def _build_prompt(results: list[SearchResult]) -> str:
        return "\n\n".join(
            f"SOURCE {index}:\nTitre: {item.title}\nURL: {item.url}\nExtrait: {item.snippet}"
            for index, item in enumerate(results, start=1)
        )

    @staticmethod
    def _heuristic_extract(results: list[SearchResult]) -> list[ExtractedOpportunity]:
        opportunities: list[ExtractedOpportunity] = []
        for result in results:
            text = f"{result.title} {result.snippet}".lower()
            if not any(word in text for word in ("formation", "université", "institut", "filière", "ecole", "école")):
                continue
            opportunities.append(
                ExtractedOpportunity(
                    metier=_infer_job(text),
                    description=result.snippet or result.title,
                    competences=_infer_skills(text),
                    etablissement=_infer_establishment(result.title),
                    formation=result.title,
                    source_url=result.url,
                    source_title=result.title,
                )
            )
        return opportunities


def _infer_job(text: str) -> str:
    mapping = {
        "informatique": "Professionnel du numérique",
        "logiciel": "Développeur logiciel",
        "santé": "Professionnel de santé",
        "infirm": "Infirmier",
        "gestion": "Professionnel de la gestion",
        "compt": "Comptable",
        "droit": "Juriste",
        "agron": "Professionnel de l'agriculture",
        "btp": "Professionnel du BTP",
        "génie civil": "Ingénieur génie civil",
    }
    return next((job for keyword, job in mapping.items() if keyword in text), "Parcours à explorer")


def _infer_skills(text: str) -> list[str]:
    mapping = {"informatique": "Compétences numériques", "math": "Mathématiques", "santé": "Sciences de la santé", "gestion": "Analyse et gestion"}
    return [skill for keyword, skill in mapping.items() if keyword in text]


def _infer_establishment(title: str) -> str | None:
    for name in ("UAC", "IFRI", "ENEAM", "UNSTIM", "Université de Parakou", "Université d'Abomey-Calavi"):
        if name.lower() in title.lower():
            return name
    return None