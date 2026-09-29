# Script PowerShell de lancement de PARCOURS-AI
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  DEMARRAGE DE PARCOURS-AI (Bénin Education & Career AI)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

# 1. Démarrage Backend
Write-Host "1. Démarrage du Backend FastAPI sur http://127.0.0.1:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; .\.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 3

# 2. Démarrage Frontend
Write-Host "2. Démarrage du Frontend React Vite sur http://127.0.0.1:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\equipe_frontend\parcours-ai-frontend'; npm run dev -- --host 127.0.0.1"

Start-Sleep -Seconds 3

# 3. Ouvrir dans le navigateur
Write-Host "3. Ouverture de http://localhost:5173 ..." -ForegroundColor Yellow
Start-Process "http://localhost:5173/"

Write-Host ""
Write-Host "PARCOURS-AI est en cours d'exécution !" -ForegroundColor Green
Write-Host "- Frontend : http://localhost:5173/" -ForegroundColor White
Write-Host "- Backend API : http://127.0.0.1:8000/docs" -ForegroundColor White
