from datetime import datetime
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .db import Base


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    licenses: Mapped[list['License']] = relationship(back_populates='user')


class License(Base):
    __tablename__ = 'licenses'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
    plan: Mapped[str] = mapped_column(String(50), default='academic')
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    max_devices: Mapped[int] = mapped_column(Integer, default=3)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    user: Mapped['User'] = relationship(back_populates='licenses')
    devices: Mapped[list['Device']] = relationship(back_populates='license')


class Device(Base):
    __tablename__ = 'devices'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    license_id: Mapped[int] = mapped_column(ForeignKey('licenses.id', ondelete='CASCADE'))
    device_uid: Mapped[str] = mapped_column(String(255), index=True)
    platform: Mapped[str] = mapped_column(String(30))
    device_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    last_seen_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    license: Mapped['License'] = relationship(back_populates='devices')


class ContactRequest(Base):
    __tablename__ = 'contact_requests'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    full_name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), index=True)
    specialty: Mapped[str | None] = mapped_column(String(120), nullable=True)
    usage_type: Mapped[str] = mapped_column(String(50))
    device_count: Mapped[str | None] = mapped_column(String(50), nullable=True)
    orcid_status: Mapped[str | None] = mapped_column(String(50), nullable=True)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
