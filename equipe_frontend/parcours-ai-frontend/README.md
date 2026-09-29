# PARCOURS-AI — Frontend

Frontend React + Vite + TypeScript de PARCOURS-AI, extrait du projet complet
pour fonctionner avec un backend séparé (Python/FastAPI).

## Ce qui a été retiré par rapport au projet d'origine

- `server.ts` (serveur Express) — remplacé par un backend Python à part
- `src/db/` (accès Postgres/Drizzle) — logique à réimplémenter côté Python
- `src/middleware/auth.ts` (vérification des tokens Firebase côté serveur) — à réimplémenter côté Python
- `src/lib/firebase-admin.ts` (SDK Admin, credentials serveur) — n'a rien à faire côté client
- `src/utils/mailer.ts` (envoi d'emails via Nodemailer) — logique serveur, à réimplémenter côté Python
- Dépendances npm backend : express, drizzle-orm, pg, bcryptjs, jsonwebtoken, nodemailer, firebase-admin, @google/genai, google-auth-library

## Ce qui n'a pas changé

Tous les composants (`src/components/`), le contexte d'auth (`src/context/AuthContext.tsx`),
et les appels API (`fetch('/api/...')`) sont **identiques** au projet d'origine.
Aucune modification de logique métier frontend n'a été faite.

## Comment ça communique avec le backend Python

Les appels `fetch('/api/...')` dans le code n'ont pas été modifiés — ce sont
des chemins relatifs. En développement, `vite.config.ts` les redirige
automatiquement vers `VITE_API_URL` (voir `.env.example`, par défaut
`http://localhost:8000`) grâce à un proxy Vite.

En production, il faudra soit :
- servir le frontend buildé (`npm run build` → dossier `dist/`) directement
  depuis FastAPI (fichiers statiques), soit
- déployer le frontend et le backend séparément et configurer CORS côté
  FastAPI pour autoriser le domaine du frontend.

## Lancer en local

1. `npm install`
2. Copier `.env.example` en `.env` (ajuster `VITE_API_URL` si besoin)
3. Vérifier que `firebase-applet-config.json` contient bien ta config Firebase
4. S'assurer que le backend Python tourne sur le port indiqué dans `VITE_API_URL`
5. `npm run dev` — le frontend démarre sur `http://localhost:5173` (port par défaut de Vite)
