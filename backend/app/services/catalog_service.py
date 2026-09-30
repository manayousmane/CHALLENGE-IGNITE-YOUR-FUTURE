from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def _clean_text(s: str) -> str:
    s = s.lower()
    for acc, repl in [("é", "e"), ("è", "e"), ("ê", "e"), ("ë", "e"), ("à", "a"), ("â", "a"), ("ô", "o"), ("ù", "u"), ("ï", "i"), ("î", "i"), ("ç", "c")]:
        s = s.replace(acc, repl)
    return s


def _matches_any(words: tuple[str, ...], text_norm: str) -> bool:
    for w in words:
        w_norm = _clean_text(w)
        if len(w_norm) <= 2:
            if re.search(r"\b" + re.escape(w_norm) + r"\b", text_norm):
                return True
        else:
            if w_norm in text_norm:
                return True
    return False


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
        text_norm = _clean_text(text)
        scored: list[tuple[int, dict[str, Any]]] = []

        for c in self._careers:
            score = 0
            title_norm = _clean_text(c.get("title", ""))
            category = c.get("category", "").lower()
            key_skills = [_clean_text(s) for s in c.get("keySkills", [])]
            tools = [_clean_text(t) for t in c.get("tools", [])]

            if title_norm in text_norm:
                score += 40
            for skill in key_skills:
                if len(skill) > 3 and skill in text_norm:
                    score += 15
            for tool in tools:
                if len(tool) > 2 and tool in text_norm:
                    score += 10

            # Mots-clés thématiques multidisciplinaires avec gestion des frontières de mots
            if category == "sante" and _matches_any(("sante", "medecine", "medecin", "pharmacie", "biologie", "infirmier", "soin", "fss", "hopital", "clinique", "medical", "patient"), text_norm):
                score += 45
            elif category == "droit" and _matches_any(("droit", "justice", "avocat", "juriste", "loi", "magistrat", "ohada", "fadesp", "juridique", "notaire", "tribunal", "legal"), text_norm):
                score += 45
            elif category == "finance" and _matches_any(("comptabilite", "audit", "finance", "expert-comptable", "gestion", "banque", "syscohada", "eneam", "faseg", "comptable", "fiscal"), text_norm):
                score += 45
            elif category == "agronomie" and _matches_any(("agronomie", "agriculture", "elevage", "plante", "sol", "fsa", "ferme", "semence", "agro", "rural", "climat", "foret", "agricole"), text_norm):
                score += 45
            elif category == "btp" and _matches_any(("btp", "genie civil", "batiment", "travaux publics", "pont", "route", "chantier", "epac", "insti", "beton", "architecture", "construction", "ouvrage"), text_norm):
                score += 45
            elif category == "data_ai" and _matches_any(("ia", "data", "intelligence artificielle", "machine learning", "python", "algorithme", "big data"), text_norm):
                score += 45
            elif category == "security" and _matches_any(("securite", "cyber", "hacker", "hacking", "reseau", "soc", "pentest", "cybersecurite"), text_norm):
                score += 45
            elif category == "design" and _matches_any(("design", "ui", "ux", "figma", "ergonomie", "visuel", "graphisme", "prototypage"), text_norm):
                score += 45
            elif category == "tech" and _matches_any(("code", "web", "developpeur", "fullstack", "react", "logiciel", "frontend", "backend", "informatique", "programmation"), text_norm):
                score += 45
            elif category == "management" and _matches_any(("agile", "scrum", "chef de projet", "produit", "product", "manager", "direction"), text_norm):
                score += 45
            elif category == "marketing" and _matches_any(("marketing", "growth", "vente", "publicite", "reseaux sociaux", "acquisition"), text_norm):
                score += 45

            scored.append((score, c))

        scored.sort(key=lambda x: x[0], reverse=True)
        if scored and scored[0][0] > 0:
            best = dict(scored[0][1])
            # Ajuster le score de match dynamiquement (75% à 98%)
            base_score = min(98, max(78, 72 + scored[0][0]))
            best["matchScore"] = base_score
            return best

        return self._careers[0] if self._careers else None

    def match_formations(
        self,
        user_profile: dict[str, Any] | None,
        context_text: str = "",
        limit: int = 3,
    ) -> list[dict[str, Any]]:
        """
        Matching déterministe basé sur les 5 critères de diagnostic officiels :
        Score = (Intérêts * 0.30) + (Série * 0.25) + (Résultats * 0.20) + (Budget * 0.15) + (Localisation * 0.10)
        """
        if not self._formations:
            return []

        profile = user_profile or {}
        serie = str(profile.get("serie_bac") or profile.get("educationLevel") or "").lower().strip()
        resultats = str(profile.get("resultats_scolaires") or "").lower().strip()
        raw_appetences = profile.get("appetences") or profile.get("passions") or profile.get("interests") or []
        if isinstance(raw_appetences, str):
            appetences = [raw_appetences]
        else:
            appetences = [str(a) for a in raw_appetences]
        app_text = " ".join(appetences).lower() + " " + context_text.lower()
        
        budget = profile.get("budget_fcfa")
        ville = str(profile.get("ville") or "").lower().strip()

        scored_formations: list[tuple[int, list[str], dict[str, Any]]] = []

        for f in self._formations:
            title = f.get("title", "").lower()
            inst = f.get("institution", "").lower()
            desc = f.get("description", "").lower()
            reqs = f.get("entryRequirements", "").lower()
            subs = " ".join(f.get("keySubjects", [])).lower()
            outs = " ".join(f.get("careerOutcomes", [])).lower()
            f_type = f.get("type", "Public").lower()
            loc = f.get("location", "").lower()
            full_f_text = f"{title} {inst} {desc} {subs} {outs}"

            reasons: list[str] = []

            # 1. Intérêts & Domaines (30 pts)
            interest_pts = 40
            if app_text.strip():
                matches = sum(1 for word in ["santé", "médecine", "droit", "justice", "finance", "comptabilité", "agronomie", "btp", "informatique", "ia", "design", "gestion", "mathématiques", "biologie", "physique"] if word in app_text and word in full_f_text)
                if matches >= 2:
                    interest_pts = 95
                    reasons.append("Alignement fort avec vos centres d'intérêt prioritaires")
                elif matches == 1:
                    interest_pts = 75
                    reasons.append("Correspondance thématique avec vos passions déclarées")
                elif any(a.lower() in full_f_text for a in appetences if len(a) > 3):
                    interest_pts = 85
                    reasons.append("Correspondance directe avec votre domaine souhaité")
                else:
                    interest_pts = 50

            # 2. Série du Bac (25 pts)
            serie_pts = 50
            if serie:
                # Séries scientifiques
                if any(s in serie for s in ("c", "d", "e")):
                    if any(s in reqs for s in ("bac c", "bac d", "bac e", "scientifique")) or "fss" in inst or "epac" in inst or "ifri" in inst or "fast" in inst or "fsa" in inst:
                        serie_pts = 95
                        reasons.append(f"Série {serie.upper()} parfaitement acceptée par l'établissement")
                    else:
                        serie_pts = 65
                # Séries littéraires
                elif any(s in serie for s in ("a1", "a2", "a")):
                    if any(s in reqs for s in ("bac a", "littéraire", "toutes séries")) or "fadesp" in inst or "flash" in inst or "lettres" in desc:
                        serie_pts = 95
                        reasons.append(f"Série {serie.upper()} idéale pour cette filière")
                    else:
                        serie_pts = 40
                # Séries gestion / technique
                elif any(s in serie for s in ("g1", "g2", "g3", "b")):
                    if any(s in reqs for s in ("bac g", "bac b", "toutes séries")) or "eneam" in inst or "faseg" in inst or "gestion" in title:
                        serie_pts = 95
                        reasons.append(f"Série {serie.upper()} ciblée par cette filière")
                    else:
                        serie_pts = 55
                elif "toutes séries" in reqs or "baccalauréat" in reqs:
                    serie_pts = 80
                    reasons.append("Filière accessible à votre profil de Baccalauréat")

            # 3. Résultats scolaires & Matières fortes (20 pts)
            result_pts = 50
            if resultats:
                if any(m in resultats for m in ("math", "physique", "svt", "biologie", "chimie")) and any(m in full_f_text for m in ("math", "physique", "svt", "biologie", "chimie", "sciences")):
                    result_pts = 90
                    reasons.append("Vos matières scientifiques fortes constituent un atout majeur")
                elif any(m in resultats for m in ("français", "francais", "philo", "anglais", "lettres")) and any(m in full_f_text for m in ("français", "expression", "droit", "communication", "langues")):
                    result_pts = 90
                    reasons.append("Vos facilités d'expression et analyse littéraire correspondent aux exigences")
                elif any(m in resultats for m in ("éco", "eco", "gestion", "compta")) and any(m in full_f_text for m in ("économie", "gestion", "comptabilité", "finance")):
                    result_pts = 90
                    reasons.append("Vos acquis en gestion et économie valorisent votre dossier")
                else:
                    result_pts = 65

            # 4. Budget annuel (15 pts)
            budget_pts = 60
            if budget is not None:
                try:
                    b_num = int(budget)
                    if "public" in f_type:
                        # Public subventionné au Bénin : 25 000 à 50 000 FCFA
                        budget_pts = 100 if b_num >= 50000 else 85
                        reasons.append("Frais universitaires publics très accessibles (< 50 000 FCFA/an)")
                    elif "privé" in f_type or "prive" in f_type:
                        # Privé : 300 000 à 750 000 FCFA
                        if b_num >= 400000:
                            budget_pts = 95
                            reasons.append("Frais de scolarité privés en accord avec votre capacité budgétaire")
                        elif b_num >= 250000:
                            budget_pts = 75
                        else:
                            budget_pts = 35
                    else:
                        budget_pts = 80
                except (ValueError, TypeError):
                    budget_pts = 60
            else:
                if "public" in f_type:
                    budget_pts = 90

            # 5. Localisation & Mobilité (10 pts)
            location_pts = 60
            if ville:
                if "partout" in ville or "mobile" in ville or "ligne" in ville:
                    location_pts = 95
                    reasons.append("Mobilité géographique compatible")
                elif any(v in loc for v in ("cotonou", "calavi", "abomey-calavi")) and any(v in ville for v in ("cotonou", "calavi", "abomey-calavi", "atlantique", "littoral")):
                    location_pts = 95
                    reasons.append("Campus situé dans votre zone de résidence (Cotonou / Calavi)")
                elif "parakou" in loc and "parakou" in ville:
                    location_pts = 95
                    reasons.append("Formation située à Parakou (Nord Bénin)")
                elif "porto-novo" in loc and "porto-novo" in ville:
                    location_pts = 95
                    reasons.append("Campus de Porto-Novo / Ouémé")
                elif "lokossa" in loc and ("lokossa" in ville or "mono" in ville):
                    location_pts = 95
                    reasons.append("Campus INSTI Lokossa")
                else:
                    location_pts = 60

            # Calcul du score final pondéré
            final_score = round(
                interest_pts * 0.30
                + serie_pts * 0.25
                + result_pts * 0.20
                + budget_pts * 0.15
                + location_pts * 0.10
            )
            final_score = min(98, max(68, final_score))

            f_copy = dict(f)
            f_copy["matchScore"] = final_score
            f_copy["matchReasons"] = reasons[:3]
            scored_formations.append((final_score, reasons, f_copy))

        scored_formations.sort(key=lambda x: x[0], reverse=True)

        # Diversité des institutions dans le top 3 si possible
        unique_results: list[dict[str, Any]] = []
        seen_titles: set[str] = set()
        for score, reasons, form in scored_formations:
            t = form.get("title", "")
            if t not in seen_titles:
                unique_results.append(form)
                seen_titles.add(t)
            if len(unique_results) >= limit:
                break

        return unique_results


catalog_service = CatalogService()
