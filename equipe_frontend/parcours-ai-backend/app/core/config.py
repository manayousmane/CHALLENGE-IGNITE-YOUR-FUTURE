"""
Configuration centralisée — lit les variables d'environnement.
"""
import os
from dotenv import load_dotenv

load_dotenv()


def _require(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(
            f"Variable d'environnement manquante : {name}. "
            "Vérifie ton fichier .env (voir .env.example)."
        )
    return value


# --- Supabase ---
SUPABASE_URL: str = _require("SUPABASE_URL")  # ex: https://xxxxx.supabase.co
SUPABASE_ANON_KEY: str = _require("SUPABASE_ANON_KEY")
# service_role : ne JAMAIS exposer côté frontend. Utilisée uniquement ici,
# côté serveur, pour les opérations qui doivent contourner les règles RLS
# (ex. appeler l'API Admin Auth pour l'OTP).
SUPABASE_SERVICE_ROLE_KEY: str = _require("SUPABASE_SERVICE_ROLE_KEY")

# JWKS : utilisé pour vérifier la signature des JWT émis par Supabase Auth
# (clés asymétriques ES256/RS256, standard sur les projets créés depuis
# octobre 2025). Se déduit automatiquement de SUPABASE_URL.
SUPABASE_JWKS_URL: str = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"

# Secret JWT "legacy" (HS256) — optionnel, uniquement nécessaire si ton
# projet Supabase utilise encore l'ancien système de clé partagée
# (Project Settings > API > JWT Secret). Laisse vide sinon.
SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")

# --- Base de données (connexion directe Postgres, pour les requêtes
# métier qui ne passent pas par l'API REST de Supabase) ---
DATABASE_URL: str = _require("DATABASE_URL")

# --- CORS ---
FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
