from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_admin
from app.db.session import get_db
from app.models.admin import Admin
from app.models.submission import AdmissionApplication, ContactEnquiry, NewsletterSubscription, SubmissionStatus
from app.schemas.submission import (
    AdmissionListResponse,
    AdmissionResponse,
    ContactListResponse,
    ContactResponse,
    NewsletterListResponse,
    NewsletterResponse,
    NewsletterUpdate,
    SubmissionUpdate,
)
from app.services.mail_service import render_email_template, send_submission_email
from app.services.mail_settings_service import get_mail_routes


router = APIRouter(prefix="/api/v1/admin", tags=["Admin Submissions"])
BACKEND_ROOT = Path(__file__).resolve().parents[4]
ADMISSION_UPLOAD_ROOT = (BACKEND_ROOT / "uploads" / "admissions").resolve()


@router.get("/newsletter-subscriptions", response_model=NewsletterListResponse)
def newsletter_subscriptions(
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=200),
    search: str | None = None,
    is_active: bool | None = None,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
):
    filters = []
    if search:
        filters.append(NewsletterSubscription.email.ilike(f"%{search.strip()}%"))
    if is_active is not None:
        filters.append(NewsletterSubscription.is_active == is_active)
    total = db.scalar(select(func.count(NewsletterSubscription.id)).where(*filters)) or 0
    items = db.scalars(select(NewsletterSubscription).where(*filters).order_by(NewsletterSubscription.subscribed_at.desc()).offset((page - 1) * limit).limit(limit)).all()
    return NewsletterListResponse(items=items, total=total, page=page, limit=limit)


@router.patch("/newsletter-subscriptions/{item_id}", response_model=NewsletterResponse)
def update_newsletter_subscription(item_id: int, payload: NewsletterUpdate, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    item = _item(db, NewsletterSubscription, item_id)
    item.is_active = payload.is_active
    db.commit(); db.refresh(item)
    return item


@router.delete("/newsletter-subscriptions/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_newsletter_subscription(item_id: int, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    db.delete(_item(db, NewsletterSubscription, item_id)); db.commit()
    return Response(status_code=204)


def _item(db: Session, model, item_id: int):
    value = db.get(model, item_id)
    if value is None:
        raise HTTPException(status_code=404, detail="Submission not found.")
    return value


@router.get("/contact-enquiries", response_model=ContactListResponse)
def contacts(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str | None = None,
    submission_status: SubmissionStatus | None = None,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
):
    filters = []
    if search:
        term = f"%{search.strip()}%"
        filters.append(or_(ContactEnquiry.name.ilike(term), ContactEnquiry.email.ilike(term), ContactEnquiry.phone.ilike(term)))
    if submission_status:
        filters.append(ContactEnquiry.status == submission_status)
    total = db.scalar(select(func.count(ContactEnquiry.id)).where(*filters)) or 0
    items = db.scalars(select(ContactEnquiry).where(*filters).order_by(ContactEnquiry.created_at.desc()).offset((page - 1) * limit).limit(limit)).all()
    return ContactListResponse(items=items, total=total, page=page, limit=limit)


@router.get("/contact-enquiries/{item_id}", response_model=ContactResponse)
def contact(item_id: int, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    return _item(db, ContactEnquiry, item_id)


@router.patch("/contact-enquiries/{item_id}", response_model=ContactResponse)
def update_contact(item_id: int, payload: SubmissionUpdate, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    item = _item(db, ContactEnquiry, item_id)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit(); db.refresh(item)
    return item


@router.delete("/contact-enquiries/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(item_id: int, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    db.delete(_item(db, ContactEnquiry, item_id)); db.commit()
    return Response(status_code=204)


@router.get("/admission-applications", response_model=AdmissionListResponse)
def admissions(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str | None = None,
    submission_status: SubmissionStatus | None = None,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
):
    filters = []
    if search:
        term = f"%{search.strip()}%"
        filters.append(or_(AdmissionApplication.registration_no.ilike(term), AdmissionApplication.pupil_name.ilike(term), AdmissionApplication.parent_email.ilike(term), AdmissionApplication.phone_number.ilike(term)))
    if submission_status:
        filters.append(AdmissionApplication.status == submission_status)
    total = db.scalar(select(func.count(AdmissionApplication.id)).where(*filters)) or 0
    items = db.scalars(select(AdmissionApplication).where(*filters).order_by(AdmissionApplication.created_at.desc()).offset((page - 1) * limit).limit(limit)).all()
    return AdmissionListResponse(items=items, total=total, page=page, limit=limit)


@router.get("/admission-applications/{item_id}", response_model=AdmissionResponse)
def admission(item_id: int, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    return _item(db, AdmissionApplication, item_id)


@router.patch("/admission-applications/{item_id}", response_model=AdmissionResponse)
def update_admission(item_id: int, payload: SubmissionUpdate, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    item = _item(db, AdmissionApplication, item_id)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit(); db.refresh(item)
    return item


@router.delete("/admission-applications/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_admission(item_id: int, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    item = _item(db, AdmissionApplication, item_id)
    upload_paths = [
        (BACKEND_ROOT / value.lstrip("/")).resolve()
        for value in (item.student_photo_url, item.father_signature_url, item.mother_signature_url)
    ]
    db.delete(item)
    db.commit()
    for upload_path in upload_paths:
        if upload_path.parent == ADMISSION_UPLOAD_ROOT:
            upload_path.unlink(missing_ok=True)
    return Response(status_code=204)


def _resend(item, kind: str, db: Session):
    mail_routes = get_mail_routes(db)
    if kind == "contact":
        reference_no = f"ENQ-{item.id:06d}"
        fields = {"Reference": reference_no, "Name": item.name, "Email": item.email, "Phone": item.phone, "Message": item.message}
        subject, heading, reply_to = f"Contact Enquiry - {item.name}", "Contact Enquiry", item.email
        to, cc, bcc = mail_routes.contact_to, mail_routes.contact_cc, mail_routes.contact_bcc
        html_body = render_email_template("contact_admin.html", {"name": item.name, "email": item.email, "phone": item.phone, "message": item.message})
        inline_images = None
        acknowledgement = {
            "enabled": mail_routes.contact_ack_enabled,
            "subject": f"We received your enquiry - {reference_no}",
            "heading": "Thank you for contacting Rosary School",
            "intro": "Your enquiry has been received successfully. Please keep the reference number below for future communication. Our school team will get back to you.",
            "fields": fields,
            "reply_to": mail_routes.contact_reply_to or mail_routes.contact_to.split(",")[0].strip(),
            "to": item.email,
        }
    else:
        fields = {"Registration No": item.registration_no, **item.form_data, "Student Photo": item.student_photo_url, "Father Signature": item.father_signature_url, "Mother Signature": item.mother_signature_url}
        subject, heading, reply_to = f"Admission Application - {item.registration_no}", "Admission Application", item.parent_email
        to, cc, bcc = mail_routes.admission_to, mail_routes.admission_cc, mail_routes.admission_bcc
        html_body = render_email_template(
            "admission_admin.html",
            {
                "registration_no": item.registration_no,
                **item.form_data,
                "student_s_passport_size_photograph": "cid:student-photograph",
                "father_s_signature": "cid:father-signature",
                "mother_s_signature": "cid:mother-signature",
            },
        )
        inline_images = {
            "student-photograph": BACKEND_ROOT / item.student_photo_url.lstrip("/"),
            "father-signature": BACKEND_ROOT / item.father_signature_url.lstrip("/"),
            "mother-signature": BACKEND_ROOT / item.mother_signature_url.lstrip("/"),
        }
        acknowledgement = {
            "enabled": mail_routes.admission_ack_enabled,
            "subject": f"Admission application received - {item.registration_no}",
            "heading": "Thank you for applying to Rosary School",
            "intro": "The LKG admission application has been received successfully. Please keep the registration number below for all future communication. The admissions team will contact you after reviewing the application.",
            "fields": {
                "Registration Number": item.registration_no,
                "Pupil Name": item.pupil_name,
                "Date of Birth": item.form_data.get("date_of_birth", ""),
                "Father's Name": item.form_data.get("father_s_name", ""),
                "Mother's Name": item.form_data.get("mother_s_name", ""),
                "Parent Email": item.parent_email,
                "Phone Number": item.phone_number,
            },
            "reply_to": mail_routes.admission_reply_to or mail_routes.admission_to.split(",")[0].strip(),
            "to": item.parent_email,
        }
    try:
        send_submission_email(subject=subject, heading=heading, fields=fields, reply_to=reply_to, to_value=to, cc_value=cc, bcc_value=bcc, html_body=html_body, inline_images=inline_images)
        if acknowledgement["enabled"]:
            send_submission_email(
                subject=acknowledgement["subject"],
                heading=acknowledgement["heading"],
                intro=acknowledgement["intro"],
                fields=acknowledgement["fields"],
                reply_to=acknowledgement["reply_to"],
                to_value=acknowledgement["to"],
                cc_value="",
                bcc_value="",
            )
        item.email_status, item.email_error = "SENT", None
    except Exception as error:
        item.email_status, item.email_error = "FAILED", str(error)[:500]
        db.commit()
        raise HTTPException(status_code=502, detail=item.email_error) from error
    db.commit(); db.refresh(item)
    return item


@router.post("/contact-enquiries/{item_id}/resend-email", response_model=ContactResponse)
def resend_contact(item_id: int, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    return _resend(_item(db, ContactEnquiry, item_id), "contact", db)


@router.post("/admission-applications/{item_id}/resend-email", response_model=AdmissionResponse)
def resend_admission(item_id: int, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    return _resend(_item(db, AdmissionApplication, item_id), "admission", db)
