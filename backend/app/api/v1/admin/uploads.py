from io import BytesIO
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
from PIL import (
    Image,
    UnidentifiedImageError,
)

from app.api.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.upload import ImageUploadResponse


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/v1/admin/uploads",
    tags=["Admin Uploads"],
)


# =========================================================
# UPLOAD DIRECTORIES
# =========================================================

# Current file:
#
# backend/app/api/v1/admin/uploads.py
#
# parents[4] points to:
#
# backend/

BACKEND_ROOT = (
    Path(__file__)
    .resolve()
    .parents[4]
)

UPLOAD_ROOT = (
    BACKEND_ROOT
    / "uploads"
)

NEWS_UPLOAD_DIR = (
    UPLOAD_ROOT
    / "news"
)


# Create folders automatically if they do not exist.
NEWS_UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =========================================================
# IMAGE SETTINGS
# =========================================================

MAX_IMAGE_SIZE = (
    5 * 1024 * 1024
)

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
}

FORMAT_EXTENSION_MAP = {
    "JPEG": ".jpg",
    "PNG": ".png",
    "WEBP": ".webp",
}


# =========================================================
# NEWS IMAGE UPLOAD
# =========================================================

@router.post(
    "/news-image",
    response_model=ImageUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_news_image(
    file: UploadFile = File(...),
    current_admin: Admin = Depends(
        get_current_admin
    ),
):
    """
    Upload and validate a News / Announcement image.

    Accepted:
    - JPG / JPEG
    - PNG
    - WEBP

    Maximum size:
    - 5 MB
    """

    # =====================================================
    # CHECK FILE CONTENT TYPE
    # =====================================================

    if (
        file.content_type
        not in ALLOWED_CONTENT_TYPES
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
            ),
            detail=(
                "Unsupported image format. "
                "Please upload JPG, PNG or WEBP."
            ),
        )


    # =====================================================
    # READ FILE
    # =====================================================

    file_bytes = await file.read(
        MAX_IMAGE_SIZE + 1
    )


    # =====================================================
    # CHECK EMPTY FILE
    # =====================================================

    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded image is empty.",
        )


    # =====================================================
    # CHECK FILE SIZE
    # =====================================================

    if (
        len(file_bytes)
        > MAX_IMAGE_SIZE
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
            ),
            detail=(
                "Image size must not exceed 5 MB."
            ),
        )


    # =====================================================
    # VERIFY REAL IMAGE
    # =====================================================

    try:
        image = Image.open(
            BytesIO(file_bytes)
        )

        detected_format = (
            image.format
        )

        image.verify()

    except (
        UnidentifiedImageError,
        OSError,
    ) as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "The uploaded file is not "
                "a valid image."
            ),
        ) from error


    # =====================================================
    # CHECK DETECTED FORMAT
    # =====================================================

    if (
        detected_format
        not in FORMAT_EXTENSION_MAP
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
            ),
            detail=(
                "Unsupported image format. "
                "Please upload JPG, PNG or WEBP."
            ),
        )


    # =====================================================
    # SAFE UNIQUE FILE NAME
    # =====================================================

    extension = (
        FORMAT_EXTENSION_MAP[
            detected_format
        ]
    )

    filename = (
        f"{uuid4().hex}{extension}"
    )

    destination = (
        NEWS_UPLOAD_DIR
        / filename
    )


    # =====================================================
    # SAVE FILE
    # =====================================================

    try:
        destination.write_bytes(
            file_bytes
        )

    except OSError as error:
        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Unable to save uploaded image."
            ),
        ) from error


    # =====================================================
    # RETURN PUBLIC IMAGE PATH
    # =====================================================

    image_url = (
        f"/uploads/news/{filename}"
    )

    return ImageUploadResponse(
        message=(
            "News image uploaded successfully."
        ),
        image_url=image_url,
        filename=filename,
    )