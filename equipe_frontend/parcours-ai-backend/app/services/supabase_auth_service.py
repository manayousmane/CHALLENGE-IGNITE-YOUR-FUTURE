"""
Fine couche au-dessus de l'API REST Auth de Supabase, pour l'OTP
téléphone/WhatsApp. Supabase gère la génération du code, son envoi
(via le provider Twilio configuré dans le dashboard) et sa validation
— ce service ne fait qu'appeler ces endpoints proprement depuis le
backend, pour que le frontend n'ait pas besoin de connaître les clés
Supabase directement s'il ne le souhaite pas.
"""
import httpx
from fastapi import HTTPException, status

from app.core.config import SUPABASE_ANON_KEY, SUPABASE_URL


async def request_otp(phone: str, channel: str) -> None:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SUPABASE_URL}/auth/v1/otp",
            headers={"apikey": SUPABASE_ANON_KEY, "Content-Type": "application/json"},
            json={"phone": phone, "channel": channel},
            timeout=10.0,
        )
    if response.status_code >= 400:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Échec de l'envoi de l'OTP : {response.text}",
        )


async def verify_otp(phone: str, code: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SUPABASE_URL}/auth/v1/verify",
            headers={"apikey": SUPABASE_ANON_KEY, "Content-Type": "application/json"},
            json={"phone": phone, "token": code, "type": "sms"},
            timeout=10.0,
        )
    if response.status_code >= 400:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Code invalide ou expiré.",
        )
    data = response.json()
    user = data.get("user", {})
    return {
        "access_token": data["access_token"],
        "refresh_token": data["refresh_token"],
        "expires_in": data["expires_in"],
        "user_id": user.get("id"),
        "email": user.get("email"),
        "phone": user.get("phone"),
    }
