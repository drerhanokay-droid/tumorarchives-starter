from datetime import datetime, timezone
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session
from .db import Base, engine, get_db
from .models import Device, License, User
from .schemas import DeviceRegisterRequest, LicenseResponse, LoginRequest, RegisterRequest, TokenResponse
from .security import create_access_token, decode_token, hash_password, verify_password

app = FastAPI(title='TumorArchives License Server')
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r'https?://(localhost|127\.0\.0\.1)(:\d+)?',
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
security = HTTPBearer(auto_error=True)

Base.metadata.create_all(bind=engine)

FEATURES_BY_PLAN = {
    'trial': ['patients', 'images', 'classifications', 'scores'],
    'academic': ['patients', 'images', 'classifications', 'scores', 'exports', 'research'],
    'enterprise': ['patients', 'images', 'classifications', 'scores', 'exports', 'research', 'device-management'],
}


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = decode_token(credentials.credentials)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Geçersiz token') from exc

    user = db.scalar(select(User).where(User.id == int(payload['sub'])))
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Kullanıcı bulunamadı')
    return user


@app.get('/health')
def health_check():
    return {'status': 'ok', 'service': 'tumorarchives-license'}


@app.post('/auth/register', response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(status_code=400, detail='Bu e-posta zaten kayıtlı')

    user = User(email=payload.email, password_hash=hash_password(payload.password), full_name=payload.full_name)
    db.add(user)
    db.flush()

    license_record = License(user_id=user.id, plan='academic', is_active=True, max_devices=3)
    db.add(license_record)
    db.commit()

    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token)


@app.post('/auth/login', response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail='Geçersiz kimlik bilgileri')
    return TokenResponse(access_token=create_access_token(str(user.id)))


@app.get('/license/check', response_model=LicenseResponse)
def check_license(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    license_record = db.scalar(select(License).where(License.user_id == current_user.id, License.is_active.is_(True)))
    if not license_record:
        raise HTTPException(status_code=404, detail='Aktif lisans bulunamadı')

    active_devices = db.query(Device).filter(Device.license_id == license_record.id).count()
    return LicenseResponse(
        valid=True,
        plan=license_record.plan,
        expires_at=license_record.expires_at,
        max_devices=license_record.max_devices,
        active_devices=active_devices,
        features=FEATURES_BY_PLAN.get(license_record.plan, []),
    )


@app.post('/license/register-device')
def register_device(
    payload: DeviceRegisterRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    license_record = db.scalar(select(License).where(License.user_id == current_user.id, License.is_active.is_(True)))
    if not license_record:
        raise HTTPException(status_code=404, detail='Aktif lisans bulunamadı')

    existing = db.scalar(
        select(Device).where(Device.license_id == license_record.id, Device.device_uid == payload.device_uid)
    )
    if existing:
        existing.last_seen_at = datetime.now(timezone.utc)
        existing.device_name = payload.device_name
        existing.platform = payload.platform
        db.commit()
        return {'status': 'updated'}

    device_count = db.query(Device).filter(Device.license_id == license_record.id).count()
    if device_count >= license_record.max_devices:
        raise HTTPException(status_code=400, detail='Cihaz limiti aşıldı')

    device = Device(
        license_id=license_record.id,
        device_uid=payload.device_uid,
        platform=payload.platform,
        device_name=payload.device_name,
        last_seen_at=datetime.now(timezone.utc),
    )
    db.add(device)
    db.commit()
    return {'status': 'registered'}
