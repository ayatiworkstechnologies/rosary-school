from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)

from pydantic import BaseModel

from app.api.dependencies import (
    get_current_admin,
)

from app.models.admin import Admin


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/v1/admin/uploads",
    tags=["Admin Circulars & Notices Uploads"],
)


# =========================================================
# UPLOAD SETTINGS
# =========================================================

MAX_PDF_SIZE = (
    10 * 1024 * 1024
)

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
}


# =========================================================
# BACKEND UPLOAD DIRECTORY
#
# Current file:
#
# backend/app/api/v1/admin/circular_notice_uploads.py
#
# parents[4]
# -> backend/
# =========================================================

BACKEND_ROOT = (
    Path(__file__)
    .resolve()
    .parents[4]
)


CIRCULAR_UPLOAD_DIR = (
    BACKEND_ROOT
    / "uploads"
    / "circulars"
)


# Automatically create:
#
# backend/uploads/circulars/
#
# if it does not already exist.

CIRCULAR_UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =========================================================
# RESPONSE SCHEMA
# =========================================================

class CircularDocumentUploadResponse(
    BaseModel
):
    pdf_url: str

    file_name: str

    original_name: str

    size: int


# =========================================================
# UPLOAD CIRCULAR / NOTICE PDF
# =========================================================

@router.post(
    "/circular-document",
    response_model=CircularDocumentUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_circular_document(
    file: UploadFile = File(...),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    # =====================================================
    # ORIGINAL FILE NAME
    # =====================================================

    original_name = (
        file.filename
        or "document.pdf"
    )


    # =====================================================
    # CHECK EXTENSION
    # =====================================================

    extension = (
        Path(original_name)
        .suffix
        .lower()
    )


    if extension != ".pdf":

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Only PDF files are allowed."
            ),
        )


    # =====================================================
    # CHECK CONTENT TYPE
    # =====================================================

    if (
        file.content_type
        not in ALLOWED_CONTENT_TYPES
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid file type. "
                "Please upload a PDF document."
            ),
        )


    # =====================================================
    # READ FILE
    #
    # Read maximum allowed size + 1 byte.
    #
    # This lets us detect files larger than 10 MB
    # without accepting unlimited data.
    # =====================================================

    file_content = await file.read(
        MAX_PDF_SIZE + 1
    )


    file_size = len(
        file_content
    )


    # =====================================================
    # EMPTY FILE CHECK
    # =====================================================

    if file_size == 0:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded PDF is empty.",
        )


    # =====================================================
    # SIZE CHECK
    # =====================================================

    if file_size > MAX_PDF_SIZE:

        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=(
                "PDF file size must not exceed 10 MB."
            ),
        )


    # =====================================================
    # REAL PDF SIGNATURE CHECK
    #
    # A genuine PDF normally starts with:
    #
    # %PDF-
    #
    # This prevents someone simply renaming:
    #
    # image.jpg
    #
    # into:
    #
    # image.pdf
    # =====================================================

    if not file_content.startswith(
        b"%PDF-"
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid PDF file."
            ),
        )


    # =====================================================
    # GENERATE SAFE UNIQUE FILE NAME
    # =====================================================

    generated_file_name = (
        f"{uuid4().hex}.pdf"
    )


    file_path = (
        CIRCULAR_UPLOAD_DIR
        / generated_file_name
    )


    # =====================================================
    # SAVE FILE
    # =====================================================

    try:

        file_path.write_bytes(
            file_content
        )

    except OSError as error:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Unable to save PDF document."
            ),
        ) from error

    finally:

        await file.close()


    # =====================================================
    # PUBLIC FILE URL
    #
    # main.py already mounts:
    #
    # /uploads
    #
    # Therefore:
    #
    # backend/uploads/circulars/abc.pdf
    #
    # becomes:
    #
    # /uploads/circulars/abc.pdf
    # =====================================================

    pdf_url = (
        f"/uploads/circulars/"
        f"{generated_file_name}"
    )


    # =====================================================
    # RESPONSE
    # =====================================================

    return CircularDocumentUploadResponse(
        pdf_url=pdf_url,
        file_name=generated_file_name,
        original_name=original_name,
        size=file_size,
    )