from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.models.submission import SubmissionStatus


class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    email: EmailStr
    phone: str = Field(pattern=r"^[0-9]{10}$")
    message: str = Field(min_length=1, max_length=3000)

    @field_validator("name", "phone", "message", mode="before")
    @classmethod
    def clean(cls, value: Any) -> Any:
        return value.strip() if isinstance(value, str) else value


class SubmissionUpdate(BaseModel):
    status: SubmissionStatus | None = None
    admin_notes: str | None = Field(default=None, max_length=5000)


class AdmissionUpdate(SubmissionUpdate):
    form_data: dict[str, str] | None = None


class ContactResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str
    phone: str
    message: str
    status: SubmissionStatus
    admin_notes: str | None
    email_status: str
    email_error: str | None
    created_at: datetime
    updated_at: datetime


class AdmissionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    registration_no: str
    pupil_name: str
    parent_email: str
    phone_number: str
    form_data: dict[str, Any]
    student_photo_url: str
    status: SubmissionStatus
    admin_notes: str | None
    email_status: str
    email_error: str | None
    created_at: datetime
    updated_at: datetime


class ContactListResponse(BaseModel):
    items: list[ContactResponse]
    total: int
    page: int
    limit: int


class AdmissionListResponse(BaseModel):
    items: list[AdmissionResponse]
    total: int
    page: int
    limit: int


class PublicSubmissionResponse(BaseModel):
    success: bool = True
    message: str
    reference_no: str | None = None
    registration_no: str | None = None


class MailSettingsPayload(BaseModel):
    contact_to: str = Field(max_length=1000)
    contact_cc: str = Field(default="", max_length=1000)
    contact_bcc: str = Field(default="", max_length=1000)
    contact_reply_to: str = Field(default="", max_length=254)
    contact_ack_enabled: bool = True
    admission_to: str = Field(max_length=1000)
    admission_cc: str = Field(default="", max_length=1000)
    admission_bcc: str = Field(default="", max_length=1000)
    admission_reply_to: str = Field(default="", max_length=254)
    admission_ack_enabled: bool = True
    admission_registration_prefix: str = Field(default="2728-", min_length=2, max_length=12, pattern=r"^[A-Za-z0-9-]+$")
    newsletter_to: str = Field(max_length=1000)
    newsletter_cc: str = Field(default="", max_length=1000)
    newsletter_bcc: str = Field(default="", max_length=1000)
    newsletter_reply_to: str = Field(default="", max_length=254)
    newsletter_ack_enabled: bool = True
    backend_public_url: str = Field(max_length=500)

    @field_validator(
        "contact_to", "contact_cc", "contact_bcc", "contact_reply_to",
        "admission_to", "admission_cc", "admission_bcc", "admission_reply_to",
        "admission_registration_prefix",
        "newsletter_to", "newsletter_cc", "newsletter_bcc", "newsletter_reply_to",
        "backend_public_url",
        mode="before",
    )
    @classmethod
    def clean_mail_values(cls, value: Any) -> Any:
        return value.strip() if isinstance(value, str) else value

    @field_validator("admission_registration_prefix")
    @classmethod
    def normalize_registration_prefix(cls, value: str) -> str:
        return value.upper()


class NewsletterCreate(BaseModel):
    email: EmailStr


class NewsletterUpdate(BaseModel):
    is_active: bool


class NewsletterResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str
    is_active: bool
    email_status: str
    email_error: str | None
    subscribed_at: datetime
    updated_at: datetime


class NewsletterListResponse(BaseModel):
    items: list[NewsletterResponse]
    total: int
    page: int
    limit: int
