from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_admin
from app.db.session import get_db
from app.models.admin import Admin
from app.models.submission import MailRoutingSettings
from app.schemas.submission import MailSettingsPayload
from app.services.mail_settings_service import get_mail_routes


router = APIRouter(prefix="/api/v1/admin/settings", tags=["Admin Settings"])


@router.get("/mail", response_model=MailSettingsPayload)
def get_mail_settings(db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    return MailSettingsPayload.model_validate(get_mail_routes(db).__dict__)


@router.put("/mail", response_model=MailSettingsPayload)
def save_mail_settings(payload: MailSettingsPayload, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    saved = db.get(MailRoutingSettings, 1)
    if saved is None:
        saved = MailRoutingSettings(id=1, **payload.model_dump())
        db.add(saved)
    else:
        for key, value in payload.model_dump().items():
            setattr(saved, key, value)
    db.commit()
    return payload
