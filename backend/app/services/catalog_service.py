from __future__ import annotations

import json
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


class CatalogService:
    def __init__(self) -> None:
        self._careers: list[dict[str, Any]] = []
        self._formations: list[dict[str, Any]] = []
        self._load()

    def _load(self) -> None:
        careers_path = DATA_DIR / "fiches_metiers.json"
        formations_path = DATA_DIR / "formations_benin.json"

        if careers_path.exists():
            try:
                with open(careers_path, encoding="utf-8") as f:
                    self._careers = json.load(f)
            except Exception as e:
                print(f"[CatalogService] Erreur chargement fiches_metiers: {e}")

        if formations_path.exists():
            try:
                with open(formations_path, encoding="utf-8") as f:
                    self._formations = json.load(f)
            except Exception as e:
                print(f"[CatalogService] Erreur chargement formations_benin: {e}")

    @property
    def careers(self) -> list[dict[str, Any]]:
        return self._careers

    @property
    def formations(self) -> list[dict[str, Any]]:
        return self._formations

    def search_formations(
        self,
        query: str | None = None,
        budget_max: int | None = None,
        ville: str | None = None,
        competences: list[str] | None = None,
        limit: int = 10,
    ) -> list[dict[str, Any]]:
        results: list[dict[str, Any]] = []
        q_lower = query.lower().strip() if query else None
        v_lower = ville.lower().strip() if ville else None
        comp_set = {c.lower().strip() for c in competences if c.strip()} if competences else set()

        for f in self._formations:
            # Filtre ville
            if v_lower:
                loc = f.get("location", "").lower()
                if v_lower not in loc:
                    continue

            # Filtre texte query
            if q_lower:
                title = f.get("title", "").lower()
                inst = f.get("institution", "").lower()
                desc = f.get("description", "").lower()
                subs = " ".join(f.get("keySubjects", [])).lower()
                if q_lower not in title and q_lower not in inst and q_lower not in desc and q_lower not in subs:
                    continue

            # Calcul d'un score d'affinité
            score = 0
            if comp_set:
                subs_and_careers = " ".join(f.get("keySubjects", []) + f.get("careerOutcomes", [])).lower()
                for comp in comp_set:
                    if comp in subs_and_careers:
                        score += 10
            
            f_copy = dict(f)
            f_copy["_score"] = score
            results.append(f_copy)

        if comp_set:
            results.sort(key=lambda x: x.get("_score", 0), reverse=True)

        for r in results:
            r.pop("_score", None)

        return results[:limit]

    def find_best_matching_career(self, text: str) -> dict[str, Any] | None:
        if not self._careers:
            return None
        text_lower = text.lower()
        scored: list[tuple[int, dict[str, Any]]] = []

        for c in self._careers:
            score = 0
            title = c.get("title", "").lower()
            category = c.get("category", "").lower()
            key_skills = [s.lower() for s in c.get("keySkills", [])]
            tools = [t.lower() for t in c.get("tools", [])]

            if title in text_lower:
                score += 30
            for skill in key_skills:
                if skill in text_lower:
                    score += 10
            for tool in tools:
                if tool in text_lower:
                    score += 5

            # Mots-clés thématiques
            if category == "data_ai" and any(w in text_lower for w in ("ia", "data", "intelligence artificielle", "machine learning", "python")):
                score += 25
            elif category == "security" and any(w in text_lower for w in ("sécurité", "cyber", "hacker", "hacking", "réseau", "soc")):
                score += 25
            elif category == "design" and any(w in text_lower for w in ("design", "ui", "ux", "figma", "ergonomie", "visuel")):
                score += 25
            elif category == "tech" and any(w in text_lower for w in ("code", "web", "développeur", "fullstack", "react", "logiciel", "frontend", "backend")):
                score += 25
            elif category == "management" and any(w in text_lower for w in ("agile", "scrum", "chef de projet", "produit", "product")):
                score += 25

            scored.append((score, c))

        scored.sort(key=lambda x: x[0], reverse=True)
        if scored and scored[0][0] > 0:
            best = dict(scored[0][1])
            # Ajuster le score de match dynamiquement
            base_score = min(98, max(75, 70 + scored[0][0]))
            best["matchScore"] = base_score
            return best

        return self._careers[0] if self._careers else None


catalog_service = CatalogService()
