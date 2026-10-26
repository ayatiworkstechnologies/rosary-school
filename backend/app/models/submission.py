import enum

from sqlalchemy import Boolean, DateTime, Enum as SQLEnum, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class SubmissionStatus(str, enum.Enum):
    NEW = "NEW"
    READ = "READ"
    REPLIED = "REPLIED"
    UNDER_REVIEW = "UNDER_REVIEW"
    SHORTLISTED = "SHORTLISTED"
    REJECTED = "REJECTED"
    ADMITTED = "ADMITTED"
    ARCHIVED = "ARCHIVED"


class ContactEnquiry(Base):
    __tablename__ = "contact_enquiries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(254), nullable=False, index=True)
    phone: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[SubmissionStatus] = mapped_column(
        SQLEnum(SubmissionStatus, name="submission_status", native_enum=False),
        nullable=False,
        default=SubmissionStatus.NEW,
        server_default="NEW",
        index=True,
    )
    admin_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    email_status: Mapped[str] = mapped_column(String(30), nullable=False, server_default="PENDING")
    email_error: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, nullable=False, server_default=func.now(), index=True)
    updated_at: Mapped[DateTime] = mapped_column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())


class AdmissionApplication(Base):
    __tablename__ = "admission_applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    registration_no: Mapped[str] = mapped_column(String(40), nullable=False, unique=True, index=True)
    pupil_name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    parent_email: Mapped[str] = mapped_column(String(254), nullable=False, index=True)
    phone_number: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    form_data: Mapped[dict] = mapped_column(JSON, nullable=False)
    student_photo_url: Mapped[str] = mapped_column(String(500), nullable=False)
    # Retained for historical submissions created before signatures were removed.
    father_signature_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    mother_signature_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[SubmissionStatus] = mapped_column(
        SQLEnum(SubmissionStatus, name="admission_submission_status", native_enum=False),
        nullable=False,
        default=SubmissionStatus.NEW,
        server_default="NEW",
        index=True,
    )
    admin_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    email_status: Mapped[str] = mapped_column(String(30), nullable=False, server_default="PENDING")
    email_error: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, nullable=False, server_default=func.now(), index=True)
    updated_at: Mapped[DateTime] = mapped_column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())


class AdmissionRegistrationSequence(Base):
    __tablename__ = "admission_registration_sequence"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    next_number: Mapped[int] = mapped_column(Integer, nullable=False, default=1)


class MailRoutingSettings(Base):
    __tablename__ = "mail_routing_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    contact_to: Mapped[str] = mapped_column(String(1000), nullable=False, default="")
    contact_cc: Mapped[str] = mapped_column(String(1000), nullable=False, default="")
    contact_bcc: Mapped[str] = mapped_column(String(1000), nullable=False, default="")
    contact_reply_to: Mapped[str] = mapped_column(String(254), nullable=False, default="")
    contact_ack_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    admission_to: Mapped[str] = mapped_column(String(1000), nullable=False, default="")
    admission_cc: Mapped[str] = mapped_column(String(1000), nullable=False, default="")
    admission_bcc: Mapped[str] = mapped_column(String(1000), nullable=False, default="")
    admission_reply_to: Mapped[str] = mapped_column(String(254), nullable=False, default="")
    admission_ack_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    admission_registration_prefix: Mapped[str] = mapped_column(String(12), nullable=False, default="2728-")
    newsletter_to: Mapped[str] = mapped_column(String(1000), nullable=False, default="")
    newsletter_cc: Mapped[str] = mapped_column(String(1000), nullable=False, default="")
    newsletter_bcc: Mapped[str] = mapped_column(String(1000), nullable=False, default="")
    newsletter_reply_to: Mapped[str] = mapped_column(String(254), nullable=False, default="")
    newsletter_ack_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    backend_public_url: Mapped[str] = mapped_column(String(500), nullable=False, default="http://127.0.0.1:8000")
    updated_at: Mapped[DateTime] = mapped_column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())


class NewsletterSubscription(Base):
    __tablename__ = "newsletter_subscriptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(254), nullable=False, unique=True, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="1", index=True)
    email_status: Mapped[str] = mapped_column(String(30), nullable=False, server_default="PENDING")
    email_error: Mapped[str | None] = mapped_column(String(500), nullable=True)
    subscribed_at: Mapped[DateTime] = mapped_column(DateTime, nullable=False, server_default=func.now(), index=True)
    updated_at: Mapped[DateTime] = mapped_column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
