from fastapi import APIRouter

from app.schemas.auth_schema import AuthSession, OtpRequest, OtpVerify
from app.services import supabase_auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/otp/request", status_code=204)
async def request_otp(payload: OtpRequest):
    """
    Envoie un code à usage unique par SMS ou WhatsApp (selon `channel`).
    Le provider (Twilio) et l'envoi effectif sont gérés par Supabase Auth
    — ce endpoint ne fait que relayer proprement la demande.
    """
    await supabase_auth_service.request_otp(payload.phone, payload.channel)


@router.post("/otp/verify", response_model=AuthSession)
async def verify_otp(payload: OtpVerify):
    """
    Vérifie le code reçu. En cas de succès, retourne une session
    (access_token / refresh_token) — c'est un vrai JWT Supabase, à
    utiliser tel quel comme Bearer token sur les routes protégées.
    """
    result = await supabase_auth_service.verify_otp(payload.phone, payload.code)
    return AuthSession(**result)
