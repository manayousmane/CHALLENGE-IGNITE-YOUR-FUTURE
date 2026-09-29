from typing import Literal, Optional

from pydantic import BaseModel, Field


class OtpRequest(BaseModel):
    phone: str = Field(..., description="Format E.164, ex: +22901020304")
    channel: Literal["sms", "whatsapp"] = "whatsapp"


class OtpVerify(BaseModel):
    phone: str
    code: str = Field(..., min_length=6, max_length=6)


class AuthSession(BaseModel):
    access_token: str
    refresh_token: str
    expires_in: int
    user_id: str
    email: Optional[str] = None
    phone: Optional[str] = None
