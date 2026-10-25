import secrets
from datetime import date
from decimal import Decimal, InvalidOperation
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.session import SessionLocal, get_db
from app.models.submission import AdmissionApplication, ContactEnquiry, NewsletterSubscription
from app.schemas.submission import ContactCreate, NewsletterCreate, PublicSubmissionResponse
from app.services.mail_service import render_email_template, send_submission_email
from app.services.mail_settings_service import get_mail_routes


router = APIRouter(tags=["Public Submissions"])
UPLOAD_ROOT = Path(__file__).resolve().parents[4] / "uploads" / "admissions"
UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)


def _newsletter_email_later(item_id: int) -> None:
    db = SessionLocal()
    item = None
    try:
        item = db.get(NewsletterSubscription, item_id)
        if item is None:
            return
        mail_routes = get_mail_routes(db)
        send_submission_email(
            subject=f"New Newsletter Subscriber - {item.email}",
            heading="New Newsletter Subscriber",
            fields={"Subscriber email": item.email},
            reply_to=item.email,
            to_value=mail_routes.newsletter_to,
            cc_value=mail_routes.newsletter_cc,
            bcc_value=mail_routes.newsletter_bcc,
            html_body=render_email_template("newsletter_admin.html", {"email": item.email}),
        )
        if mail_routes.newsletter_ack_enabled:
            send_submission_email(
                subject="Welcome to the Rosary School newsletter",
                heading="Newsletter subscription confirmed",
                intro="Thank you for subscribing. You will receive the latest Rosary School news, announcements and updates at this email address.",
                fields={"Subscribed email": item.email},
                reply_to=mail_routes.newsletter_reply_to or mail_routes.newsletter_to.split(",")[0].strip(),
                to_value=item.email,
                cc_value="",
                bcc_value="",
            )
        item.email_status, item.email_error = "SENT", None
    except Exception as error:
        if item is not None:
            item.email_status, item.email_error = "FAILED", str(error)[:500]
    finally:
        if item is not None:
            db.commit()
        db.close()


@router.post("/api/v1/newsletter-subscriptions", response_model=PublicSubmissionResponse, status_code=status.HTTP_201_CREATED)
def create_newsletter_subscription(payload: NewsletterCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    email = str(payload.email).strip().lower()
    existing = db.scalar(select(NewsletterSubscription).where(NewsletterSubscription.email == email))
    if existing:
        if not existing.is_active:
            existing.is_active = True
            existing.email_status = "PENDING"
            db.commit()
            background_tasks.add_task(_newsletter_email_later, existing.id)
        return PublicSubmissionResponse(message="This email address is already subscribed to the Rosary School newsletter.")
    item = NewsletterSubscription(email=email)
    db.add(item)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        return PublicSubmissionResponse(message="This email address is already subscribed to the Rosary School newsletter.")
    db.refresh(item)
    background_tasks.add_task(_newsletter_email_later, item.id)
    return PublicSubmissionResponse(message="Thank you! Your newsletter subscription has been received successfully.")


def _deliver_later(
    model,
    item_id: int,
    *,
    subject: str,
    heading: str,
    fields: dict,
    reply_to: str,
    to: str,
    cc: str,
    bcc: str,
    acknowledgement: dict | None = None,
    html_body: str | None = None,
    inline_images: dict[str, Path] | None = None,
) -> None:
    db = SessionLocal()
    instance = None
    try:
        instance = db.get(model, item_id)
        if instance is None:
            return
        send_submission_email(
            subject=subject,
            heading=heading,
            fields=fields,
            reply_to=reply_to,
            to_value=to,
            cc_value=cc,
            bcc_value=bcc,
            html_body=html_body,
            inline_images=inline_images,
        )
        if acknowledgement:
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
        instance.email_status = "SENT"
        instance.email_error = None
    except Exception as error:
        instance.email_status = "FAILED"
        instance.email_error = str(error)[:500]
    finally:
        if instance is not None:
            db.commit()
        db.close()


@router.post("/api/v1/contact-enquiries", response_model=PublicSubmissionResponse, status_code=status.HTTP_201_CREATED)
def create_contact(payload: ContactCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    item = ContactEnquiry(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    mail_routes = get_mail_routes(db)
    reference_no = f"ENQ-{item.id:06d}"
    fields = {
        "Reference": reference_no,
        "Name": item.name,
        "Email": item.email,
        "Phone": item.phone,
        "Message": item.message,
    }
    background_tasks.add_task(
        _deliver_later,
        ContactEnquiry,
        item.id,
        subject=f"New Contact Enquiry - {item.name}",
        heading="New Contact Enquiry",
        fields=fields,
        reply_to=item.email,
        to=mail_routes.contact_to,
        cc=mail_routes.contact_cc,
        bcc=mail_routes.contact_bcc,
        html_body=render_email_template(
            "contact_admin.html",
            {"name": item.name, "email": item.email, "phone": item.phone, "message": item.message},
        ),
        acknowledgement={
            "subject": f"We received your enquiry - {reference_no}",
            "heading": "Thank you for contacting Rosary School",
            "intro": "Your enquiry has been received successfully. Please keep the reference number below for future communication. Our school team will get back to you.",
            "fields": {
                "Reference": reference_no,
                "Name": item.name,
                "Email": item.email,
                "Phone": item.phone,
                "Your message": item.message,
            },
            "reply_to": mail_routes.contact_reply_to or mail_routes.contact_to.split(",")[0].strip(),
            "to": item.email,
        } if mail_routes.contact_ack_enabled else None,
    )
    return PublicSubmissionResponse(
        message=f"Thank you for contacting Rosary School. Your enquiry reference is {reference_no}.",
        reference_no=reference_no,
    )


async def _save_image(upload: UploadFile, label: str) -> str:
    allowed = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
    suffix = allowed.get(upload.content_type or "")
    if suffix is None:
        raise HTTPException(status_code=400, detail=f"{label} must be a JPG, PNG, or WEBP image.")
    content = await upload.read()
    if not content or len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"{label} must be between 1 byte and 5 MB.")
    filename = f"{uuid4().hex}{suffix}"
    (UPLOAD_ROOT / filename).write_bytes(content)
    return f"/uploads/admissions/{filename}"


def _validate_admission_data(data: dict[str, str]) -> None:
    required = {
        "name_of_the_pupil": "Name of the pupil",
        "date_of_birth": "Date of birth",
        "religion": "Religion",
        "place_of_birth": "Place of birth",
        "father_s_name": "Father's name",
        "father_s_qualification": "Father's qualification",
        "father_s_occupation": "Father's occupation",
        "father_s_income_per_month": "Father's monthly income",
        "mother_s_name": "Mother's name",
        "is_she_a_past_pupil_of_rosary": "Past-pupil selection",
        "mother_s_qualification": "Mother's qualification",
        "mother_s_occupation": "Mother's occupation",
        "mother_s_income_per_month": "Mother's monthly income",
        "mother_tongue": "Mother tongue",
        "does_the_applicant_have_any_sibling_s_studying_in_this_school": "Sibling selection",
        "address": "Address",
        "email": "Email",
        "phone_number": "Phone number",
    }
    missing = [label for key, label in required.items() if not data.get(key, "").strip()]
    if data.get("religion") == "Christian - Roman Catholic" and not data.get("name_of_parish"):
        missing.append("Name of parish")
    if data.get("religion") == "Others" and not data.get("religion_others"):
        missing.append("Religion details")
    if data.get("mother_tongue") == "Others" and not data.get("mother_tongue_others"):
        missing.append("Mother tongue details")
    if data.get("does_the_applicant_have_any_sibling_s_studying_in_this_school") == "Yes":
        if not data.get("name_of_the_sibling"):
            missing.append("Sibling name")
        if not data.get("class_and_section"):
            missing.append("Sibling class and section")
    if missing:
        raise HTTPException(status_code=422, detail=f"Please complete: {', '.join(missing)}.")

    if data["religion"] not in {"Hindu", "Christian - Roman Catholic", "Christian", "Muslim", "Others"}:
        raise HTTPException(status_code=422, detail="Select a valid religion.")
    if data["mother_tongue"] not in {"Tamil", "English", "Telugu", "Malayalam", "Kannada", "Hindi", "Others"}:
        raise HTTPException(status_code=422, detail="Select a valid mother tongue.")
    for key, label in (
        ("is_she_a_past_pupil_of_rosary", "Past-pupil selection"),
        ("does_the_applicant_have_any_sibling_s_studying_in_this_school", "Sibling selection"),
    ):
        if data[key] not in {"Yes", "No"}:
            raise HTTPException(status_code=422, detail=f"{label} must be Yes or No.")

    try:
        birth_date = date.fromisoformat(data["date_of_birth"])
    except ValueError as error:
        raise HTTPException(status_code=422, detail="Enter a valid date of birth.") from error
    if birth_date > date(2024, 12, 31):
        raise HTTPException(status_code=422, detail="Date of birth must be on or before 31 December 2024.")
    if "@" not in data["email"] or "." not in data["email"].split("@")[-1]:
        raise HTTPException(status_code=422, detail="Enter a valid email address.")
    if not data["phone_number"].isdigit() or len(data["phone_number"]) != 10:
        raise HTTPException(status_code=422, detail="Phone number must contain exactly 10 digits.")
    if data.get("alternative_phone_number") and (not data["alternative_phone_number"].isdigit() or len(data["alternative_phone_number"]) != 10):
        raise HTTPException(status_code=422, detail="Alternative phone number must contain exactly 10 digits.")
    for key, label in (("father_s_income_per_month", "Father's income"), ("mother_s_income_per_month", "Mother's income")):
        try:
            if Decimal(data[key]) < 0:
                raise InvalidOperation
        except InvalidOperation as error:
            raise HTTPException(status_code=422, detail=f"{label} must be a valid non-negative amount.") from error
    if len(data["address"]) < 10:
        raise HTTPException(status_code=422, detail="Address must contain at least 10 characters.")


@router.post("/api/v1/admission-applications", response_model=PublicSubmissionResponse, status_code=status.HTTP_201_CREATED)
async def create_admission(
    background_tasks: BackgroundTasks,
    name_of_the_pupil: str = Form(...),
    date_of_birth: str = Form(...),
    religion: str = Form(...),
    place_of_birth: str = Form(...),
    father_s_name: str = Form(...),
    father_s_qualification: str = Form(...),
    father_s_occupation: str = Form(...),
    father_s_income_per_month: str = Form(...),
    mother_s_name: str = Form(...),
    is_she_a_past_pupil_of_rosary: str = Form(...),
    mother_s_qualification: str = Form(...),
    mother_s_occupation: str = Form(...),
    mother_s_income_per_month: str = Form(...),
    mother_tongue: str = Form(...),
    does_the_applicant_have_any_sibling_s_studying_in_this_school: str = Form(...),
    address: str = Form(...),
    email: str = Form(...),
    phone_number: str = Form(...),
    alternative_phone_number: str = Form(""),
    name_of_parish: str = Form(""),
    religion_others: str = Form(""),
    mother_tongue_others: str = Form(""),
    name_of_the_sibling: str = Form(""),
    class_and_section: str = Form(""),
    student_s_passport_size_photograph: UploadFile = File(...),
    father_s_signature: UploadFile = File(...),
    mother_s_signature: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not name_of_the_pupil.strip() or "@" not in email or not phone_number.isdigit():
        raise HTTPException(status_code=400, detail="Please provide valid pupil and contact details.")

    form_data = {
        "name_of_the_pupil": name_of_the_pupil.strip(),
        "date_of_birth": date_of_birth.strip(),
        "religion": religion.strip(),
        "place_of_birth": place_of_birth.strip(),
        "father_s_name": father_s_name.strip(),
        "father_s_qualification": father_s_qualification.strip(),
        "father_s_occupation": father_s_occupation.strip(),
        "father_s_income_per_month": father_s_income_per_month.strip(),
        "mother_s_name": mother_s_name.strip(),
        "is_she_a_past_pupil_of_rosary": is_she_a_past_pupil_of_rosary.strip(),
        "mother_s_qualification": mother_s_qualification.strip(),
        "mother_s_occupation": mother_s_occupation.strip(),
        "mother_s_income_per_month": mother_s_income_per_month.strip(),
        "mother_tongue": mother_tongue.strip(),
        "does_the_applicant_have_any_sibling_s_studying_in_this_school": does_the_applicant_have_any_sibling_s_studying_in_this_school.strip(),
        "address": address.strip(),
        "email": email.strip().lower(),
        "phone_number": phone_number.strip(),
        "alternative_phone_number": alternative_phone_number.strip(),
        "name_of_parish": name_of_parish.strip(),
        "religion_others": religion_others.strip(),
        "mother_tongue_others": mother_tongue_others.strip(),
        "name_of_the_sibling": name_of_the_sibling.strip(),
        "class_and_section": class_and_section.strip(),
    }
    _validate_admission_data(form_data)
    mail_routes = get_mail_routes(db)
    prefix = mail_routes.admission_registration_prefix
    registration_no = ""
    for _ in range(20):
        candidate = f"{prefix}{secrets.randbelow(10**8):08d}"
        if db.scalar(select(AdmissionApplication.id).where(AdmissionApplication.registration_no == candidate)) is None:
            registration_no = candidate
            break
    if not registration_no:
        raise HTTPException(status_code=503, detail="Unable to generate a unique registration number. Please try again.")
    photo_url = await _save_image(student_s_passport_size_photograph, "Student photograph")
    father_url = await _save_image(father_s_signature, "Father signature")
    mother_url = await _save_image(mother_s_signature, "Mother signature")

    item = AdmissionApplication(
        registration_no=registration_no,
        pupil_name=name_of_the_pupil.strip(),
        parent_email=email.strip().lower(),
        phone_number=phone_number.strip(),
        form_data=form_data,
        student_photo_url=photo_url,
        father_signature_url=father_url,
        mother_signature_url=mother_url,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    template_values = {
        "registration_no": registration_no,
        **form_data,
        "student_s_passport_size_photograph": "cid:student-photograph",
        "father_s_signature": "cid:father-signature",
        "mother_s_signature": "cid:mother-signature",
    }
    mail_fields = {"Registration No": registration_no, **form_data, "Student Photo": "Included in email", "Father Signature": "Included in email", "Mother Signature": "Included in email"}
    background_tasks.add_task(
        _deliver_later,
        AdmissionApplication,
        item.id,
        subject=f"New Admission Application - {registration_no}",
        heading="New LKG Admission Application",
        fields=mail_fields,
        reply_to=item.parent_email,
        to=mail_routes.admission_to,
        cc=mail_routes.admission_cc,
        bcc=mail_routes.admission_bcc,
        html_body=render_email_template("admission_admin.html", template_values),
        inline_images={
            "student-photograph": UPLOAD_ROOT / Path(photo_url).name,
            "father-signature": UPLOAD_ROOT / Path(father_url).name,
            "mother-signature": UPLOAD_ROOT / Path(mother_url).name,
        },
        acknowledgement={
            "subject": f"Admission application received - {registration_no}",
            "heading": "Thank you for applying to Rosary School",
            "intro": "The LKG admission application has been received successfully. Please keep the registration number below for all future communication. The admissions team will contact you after reviewing the application.",
            "fields": {
                "Registration Number": registration_no,
                "Pupil Name": item.pupil_name,
                "Date of Birth": form_data["date_of_birth"],
                "Father's Name": form_data["father_s_name"],
                "Mother's Name": form_data["mother_s_name"],
                "Parent Email": item.parent_email,
                "Phone Number": item.phone_number,
            },
            "reply_to": mail_routes.admission_reply_to or mail_routes.admission_to.split(",")[0].strip(),
            "to": item.parent_email,
        } if mail_routes.admission_ack_enabled else None,
    )
    return PublicSubmissionResponse(
        message=f"Your LKG admission application was submitted successfully. Registration number: {registration_no}.",
        reference_no=registration_no,
        registration_no=registration_no,
    )
