# PARCOURS-AI Backend

Backend FastAPI pour l'orientation scolaire au Benin avec recherche web en temps reel.

## Architecture

- `app/routers`: endpoints HTTP (`/health`, `/api/chat`)
- `app/schemas`: contrat Pydantic partage avec le frontend
- `app/services/search_service.py`: Tavily puis fallback DuckDuckGo
- `app/services/gemini_service.py`: extraction structuree optionnelle avec Gemini
- `app/services/matching_service.py`: score deterministe et explicable
- `app/services/orchestrator.py`: orchestration du parcours

Gemini ne choisit pas les prix et ne calcule pas le score. Les informations absentes restent `null` et chaque recommandation conserve ses sources.

## Lancer localement

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

Le frontend peut appeler `POST http://localhost:8000/api/chat`.

## Tester

```powershell
pytest -q
```

Sans `TAVILY_API_KEY` ou `GEMINI_API_KEY`, le backend reste démarrable et utilise ses fallbacks, mais la qualité de l'extraction est limitée. En production, configurer ces clés côté serveur uniquement.