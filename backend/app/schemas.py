from datetime import datetime
from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'


class DeviceRegisterRequest(BaseModel):
    device_uid: str
    platform: str
    device_name: str | None = None


class LicenseResponse(BaseModel):
    valid: bool
    plan: str
    expires_at: datetime | None
    max_devices: int
    active_devices: int
    features: list[str]
