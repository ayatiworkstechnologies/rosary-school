from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.submission import MailRoutingSettings


@dataclass
class MailRoutes:
    contact_to: str
    contact_cc: str
    contact_bcc: str
    contact_reply_to: str
    contact_ack_enabled: bool
    admission_to: str
    admission_cc: str
    admission_bcc: str
    admission_reply_to: str
    admission_ack_enabled: bool
    admission_registration_prefix: str
    ukg_admission_to: str
    ukg_admission_cc: str
    ukg_admission_bcc: str
    ukg_admission_reply_to: str
    ukg_admission_ack_enabled: bool
    ukg_admission_registration_prefix: str
    newsletter_to: str
    newsletter_cc: str
    newsletter_bcc: str
    newsletter_reply_to: str
    newsletter_ack_enabled: bool
    backend_public_url: str


def get_mail_routes(db: Session) -> MailRoutes:
    saved = db.get(MailRoutingSettings, 1)
    if saved:
        return MailRoutes(
            contact_to=saved.contact_to,
            contact_cc=saved.contact_cc,
            contact_bcc=saved.contact_bcc,
            contact_reply_to=saved.contact_reply_to,
            contact_ack_enabled=saved.contact_ack_enabled,
            admission_to=saved.admission_to,
            admission_cc=saved.admission_cc,
            admission_bcc=saved.admission_bcc,
            admission_reply_to=saved.admission_reply_to,
            admission_ack_enabled=saved.admission_ack_enabled,
            admission_registration_prefix=saved.admission_registration_prefix,
            ukg_admission_to=saved.ukg_admission_to,
            ukg_admission_cc=saved.ukg_admission_cc,
            ukg_admission_bcc=saved.ukg_admission_bcc,
            ukg_admission_reply_to=saved.ukg_admission_reply_to,
            ukg_admission_ack_enabled=saved.ukg_admission_ack_enabled,
            ukg_admission_registration_prefix=saved.ukg_admission_registration_prefix,
            newsletter_to=saved.newsletter_to,
            newsletter_cc=saved.newsletter_cc,
            newsletter_bcc=saved.newsletter_bcc,
            newsletter_reply_to=saved.newsletter_reply_to,
            newsletter_ack_enabled=saved.newsletter_ack_enabled,
            backend_public_url=saved.backend_public_url,
        )
    return MailRoutes(
        contact_to=settings.CONTACT_MAIL_TO,
        contact_cc=settings.CONTACT_MAIL_CC,
        contact_bcc=settings.CONTACT_MAIL_BCC,
        contact_reply_to=settings.CONTACT_REPLY_TO,
        contact_ack_enabled=settings.CONTACT_ACKNOWLEDGEMENT_ENABLED,
        admission_to=settings.ADMISSION_MAIL_TO,
        admission_cc=settings.ADMISSION_MAIL_CC,
        admission_bcc=settings.ADMISSION_MAIL_BCC,
        admission_reply_to=settings.ADMISSION_REPLY_TO,
        admission_ack_enabled=settings.ADMISSION_ACKNOWLEDGEMENT_ENABLED,
        admission_registration_prefix="2728-",
        ukg_admission_to=settings.ADMISSION_MAIL_TO,
        ukg_admission_cc=settings.ADMISSION_MAIL_CC,
        ukg_admission_bcc=settings.ADMISSION_MAIL_BCC,
        ukg_admission_reply_to=settings.ADMISSION_REPLY_TO,
        ukg_admission_ack_enabled=settings.ADMISSION_ACKNOWLEDGEMENT_ENABLED,
        ukg_admission_registration_prefix="2728-",
        newsletter_to=settings.NEWSLETTER_MAIL_TO,
        newsletter_cc=settings.NEWSLETTER_MAIL_CC,
        newsletter_bcc=settings.NEWSLETTER_MAIL_BCC,
        newsletter_reply_to=settings.NEWSLETTER_REPLY_TO,
        newsletter_ack_enabled=settings.NEWSLETTER_ACKNOWLEDGEMENT_ENABLED,
        backend_public_url=settings.BACKEND_PUBLIC_URL,
    )
