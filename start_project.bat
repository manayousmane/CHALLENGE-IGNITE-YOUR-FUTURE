@echo off
echo ============================================================
echo   DEMARRAGE DE PARCOURS-AI (Bénin Education & Career AI)
echo ============================================================
echo.

echo 1. Lancement du Backend FastAPI (Port 8000)...
start "PARCOURS-AI Backend (FastAPI)" cmd /k "cd /d %~dp0backend && .venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo 2. Lancement du Frontend Vite (Port 5173)...
start "PARCOURS-AI Frontend (React + Vite)" cmd /k "cd /d %~dp0equipe_frontend\parcours-ai-frontend && npm run dev -- --host 127.0.0.1"

timeout /t 3 /nobreak >nul

echo 3. Ouverture de l'application dans le navigateur...
start http://localhost:5173/

echo.
echo Application en cours d'execution !
echo - Frontend : http://localhost:5173/
echo - Backend API : http://127.0.0.1:8000/docs
echo.
pause
