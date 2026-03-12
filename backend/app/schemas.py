from datetime import datetime
from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    usage_type: str = 'academic'


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ContactRequestCreate(BaseModel):
    full_name: str
    email: EmailStr
    specialty: str | None = None
    usage_type: str
    device_count: str | None = None
    orcid_status: str | None = None
    message: str | None = None


class ContactRequestResponse(BaseModel):
    id: int
    status: str
    full_name: str
    email: EmailStr
    usage_type: str


class ContactRequestStatusUpdate(BaseModel):
    status: str


class ContactRequestListItem(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    specialty: str | None = None
    usage_type: str
    device_count: str | None = None
    orcid_status: str | None = None
    message: str | None = None
    status: str
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'


class DeviceRegisterRequest(BaseModel):
    device_uid: str
    platform: str
    device_name: str | None = None


class DeviceResponse(BaseModel):
    id: int
    device_uid: str
    platform: str
    device_name: str | None
    last_seen_at: datetime


class LicenseResponse(BaseModel):
    valid: bool
    plan: str
    expires_at: datetime | None
    max_devices: int
    active_devices: int
    features: list[str]
