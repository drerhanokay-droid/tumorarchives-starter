from datetime import datetime, timedelta, timezone
from fastapi import Depends, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session
from .db import Base, engine, get_db
from .models import ContactRequest, Device, License, User
from .schemas import (
    ContactRequestCreate,
    ContactRequestListItem,
    ContactRequestStatusUpdate,
    ContactRequestResponse,
    DeviceRegisterRequest,
    DeviceResponse,
    ForgotPasswordRequest,
    LicenseResponse,
    LoginRequest,
    RegisterRequest,
    TokenResponse,
)
from .security import create_access_token, decode_token, hash_password, verify_password

app = FastAPI(title='TumorArchives License Server')
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
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


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


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


def get_active_license(user_id: int, db: Session) -> License:
    license_record = db.scalar(select(License).where(License.user_id == user_id, License.is_active.is_(True)))
    if not license_record:
        raise HTTPException(status_code=404, detail='Aktif lisans bulunamadı')
    return license_record


@app.get('/health')
def health_check():
    return {'status': 'ok', 'service': 'tumorarchives-license'}


@app.post('/contact-requests', response_model=ContactRequestResponse)
def create_contact_request(payload: ContactRequestCreate, db: Session = Depends(get_db)):
    contact_request = ContactRequest(
        full_name=payload.full_name,
        email=payload.email,
        specialty=payload.specialty,
        usage_type=payload.usage_type,
        device_count=payload.device_count,
        orcid_status=payload.orcid_status,
        message=payload.message,
        status='new',
    )
    db.add(contact_request)
    db.commit()
    db.refresh(contact_request)
    return ContactRequestResponse(
        id=contact_request.id,
        status='received',
        full_name=contact_request.full_name,
        email=contact_request.email,
        usage_type=contact_request.usage_type,
    )


@app.get('/contact-requests', response_model=list[ContactRequestListItem])
def list_contact_requests(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    requests = db.scalars(select(ContactRequest).order_by(ContactRequest.created_at.desc())).all()
    return [
        ContactRequestListItem(
            id=item.id,
            full_name=item.full_name,
            email=item.email,
            specialty=item.specialty,
            usage_type=item.usage_type,
            device_count=item.device_count,
            orcid_status=item.orcid_status,
            message=item.message,
            status=item.status,
            created_at=item.created_at,
        )
        for item in requests
    ]


@app.patch('/contact-requests/{request_id}', response_model=ContactRequestResponse)
def update_contact_request_status(
    request_id: int,
    payload: ContactRequestStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.scalar(select(ContactRequest).where(ContactRequest.id == request_id))
    if not item:
        raise HTTPException(status_code=404, detail='Basvuru bulunamadi')

    if payload.status not in {'new', 'contacted', 'qualified'}:
        raise HTTPException(status_code=400, detail='Gecersiz durum')

    item.status = payload.status
    db.commit()
    db.refresh(item)
    return ContactRequestResponse(
        id=item.id,
        status=item.status,
        full_name=item.full_name,
        email=item.email,
        usage_type=item.usage_type,
    )


@app.post('/auth/register', response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(status_code=400, detail='Bu e-posta zaten kayıtlı')

    user = User(email=payload.email, password_hash=hash_password(payload.password), full_name=payload.full_name)
    db.add(user)
    db.flush()

    usage_type = payload.usage_type.lower()
    if usage_type == 'institution':
        plan = 'enterprise'
        expires_at = None
        max_devices = 10
    else:
        plan = 'trial'
        expires_at = now_utc() + timedelta(days=7)
        max_devices = 3

    license_record = License(user_id=user.id, plan=plan, is_active=True, max_devices=max_devices, expires_at=expires_at)
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


@app.post('/auth/forgot-password')
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email))
    if not user:
        return {'status': 'accepted', 'message': 'E-posta kayıtlıysa şifre sıfırlama bağlantısı gönderilecektir.'}

    return {
        'status': 'accepted',
        'message': 'Şifre sıfırlama akışı kabul edildi. Bu starter sürümde bağlantı gönderimi simüle edilir.',
        'email': user.email,
    }


@app.post('/auth/orcid/verify')
def verify_orcid(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    license_record = get_active_license(current_user.id, db)
    license_record.plan = 'academic'
    license_record.expires_at = None
    license_record.max_devices = 3
    db.commit()
    return {'status': 'verified', 'plan': license_record.plan}


@app.get('/license/check', response_model=LicenseResponse)
def check_license(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    license_record = get_active_license(current_user.id, db)

    valid = True
    if license_record.expires_at and license_record.expires_at.replace(tzinfo=timezone.utc) < now_utc():
        valid = False

    active_devices = db.query(Device).filter(Device.license_id == license_record.id).count()
    return LicenseResponse(
        valid=valid,
        plan=license_record.plan,
        expires_at=license_record.expires_at,
        max_devices=license_record.max_devices,
        active_devices=active_devices,
        features=FEATURES_BY_PLAN.get(license_record.plan, []),
    )


@app.get('/devices', response_model=list[DeviceResponse])
def list_devices(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    license_record = get_active_license(current_user.id, db)
    devices = db.scalars(select(Device).where(Device.license_id == license_record.id).order_by(Device.last_seen_at.desc())).all()
    return [
        DeviceResponse(
            id=device.id,
            device_uid=device.device_uid,
            platform=device.platform,
            device_name=device.device_name,
            last_seen_at=device.last_seen_at,
        )
        for device in devices
    ]


@app.delete('/devices/{device_id}', status_code=204)
def delete_device(device_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    license_record = get_active_license(current_user.id, db)

    device = db.scalar(select(Device).where(Device.id == device_id, Device.license_id == license_record.id))
    if not device:
        raise HTTPException(status_code=404, detail='Cihaz bulunamadı')

    db.delete(device)
    db.commit()
    return Response(status_code=204)


@app.post('/license/register-device')
def register_device(
    payload: DeviceRegisterRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    license_record = get_active_license(current_user.id, db)

    if license_record.expires_at and license_record.expires_at.replace(tzinfo=timezone.utc) < now_utc():
        raise HTTPException(status_code=400, detail='Lisans süresi doldu, yeniden doğrulama gerekli')

    existing = db.scalar(
        select(Device).where(Device.license_id == license_record.id, Device.device_uid == payload.device_uid)
    )
    if existing:
        existing.last_seen_at = now_utc()
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
        last_seen_at=now_utc(),
    )
    db.add(device)
    db.commit()
    return {'status': 'registered'}
