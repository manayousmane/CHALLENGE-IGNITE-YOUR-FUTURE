"""
Vérification des JWT émis par Supabase Auth.

Le frontend s'authentifie DIRECTEMENT auprès de Supabase (email/mot de
passe, Google, OTP téléphone/WhatsApp) et obtient un access token JWT.
Ce backend ne fait que vérifier ce token sur chaque requête protégée —
il ne génère jamais de session lui-même.

Supporte les deux systèmes de signature Supabase :
- Clés asymétriques (ES256/RS256) via JWKS — standard depuis oct. 2025
- Secret partagé (HS256) — ancien système, si SUPABASE_JWT_SECRET est défini
"""
from dataclasses import dataclass
from typing import Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient

from app.core.config import SUPABASE_JWKS_URL, SUPABASE_JWT_SECRET, SUPABASE_URL

_bearer_scheme = HTTPBearer(auto_error=False)

# Le client JWKS met en cache les clés publiques automatiquement.
_jwks_client = PyJWKClient(SUPABASE_JWKS_URL)


@dataclass
class CurrentUser:
    id: str  # UUID Supabase (correspond à profiles.id)
    email: Optional[str]
    phone: Optional[str]
    role: str


def _decode_with_jwks(token: str) -> dict:
    signing_key = _jwks_client.get_signing_key_from_jwt(token)
    return jwt.decode(
        token,
        signing_key.key,
        algorithms=["ES256", "RS256"],
        audience="authenticated",
        issuer=f"{SUPABASE_URL}/auth/v1",
    )


def _decode_with_legacy_secret(token: str) -> dict:
    return jwt.decode(
        token,
        SUPABASE_JWT_SECRET,
        algorithms=["HS256"],
        audience="authenticated",
    )


def verify_supabase_jwt(token: str) -> dict:
    """Essaie d'abord JWKS (nouveau système), puis le secret legacy si configuré."""
    try:
        return _decode_with_jwks(token)
    except Exception as jwks_error:
        if SUPABASE_JWT_SECRET:
            try:
                return _decode_with_legacy_secret(token)
            except Exception as legacy_error:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Token invalide : {legacy_error}",
                ) from legacy_error
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token invalide : {jwks_error}",
        ) from jwks_error


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer_scheme),
) -> CurrentUser:
    """Dépendance FastAPI : à injecter dans toute route protégée."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentification requise (en-tête Authorization manquant).",
        )

    payload = verify_supabase_jwt(credentials.credentials)

    return CurrentUser(
        id=payload["sub"],
        email=payload.get("email"),
        phone=payload.get("phone"),
        role=payload.get("role", "authenticated"),
    )


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer_scheme),
) -> Optional[CurrentUser]:
    """Comme get_current_user, mais retourne None au lieu de lever une erreur
    si aucun token n'est fourni — utile pour les routes publiques qui
    personnalisent leur réponse si l'utilisateur est connecté."""
    if credentials is None:
        return None
    try:
        payload = verify_supabase_jwt(credentials.credentials)
    except HTTPException:
        return None
    return CurrentUser(
        id=payload["sub"],
        email=payload.get("email"),
        phone=payload.get("phone"),
        role=payload.get("role", "authenticated"),
    )
