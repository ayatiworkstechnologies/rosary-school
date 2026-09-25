from io import BytesIO
from pathlib import Path
from typing import Annotated
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
    tags=["Admin Download Uploads"],
)


# =========================================================
# CONFIG
# =========================================================

# PDF:
# Maximum 50 MB

MAX_PDF_SIZE = (
    50
    * 1024
    * 1024
)


# Custom icon:
# Maximum 5 MB

MAX_ICON_SIZE = (
    5
    * 1024
    * 1024
)


# Read PDF in 1 MB chunks.
#
# This is better than loading a 50 MB PDF
# completely into memory.

CHUNK_SIZE = (
    1024
    * 1024
)


# =========================================================
# PDF RULES
# =========================================================

PDF_EXTENSIONS = {
    ".pdf",
}


PDF_CONTENT_TYPES = {
    "application/pdf",

    # Some browsers/clients may send a PDF
    # as application/octet-stream.
    #
    # We still verify the actual PDF header
    # before accepting it.
    "application/octet-stream",
}


# =========================================================
# ICON RULES
# =========================================================

ICON_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}


ICON_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


ICON_PIL_FORMATS = {
    "JPEG": ".jpg",
    "PNG": ".png",
    "WEBP": ".webp",
}


# =========================================================
# STORAGE PATH
#
# Current file:
#
# backend/app/api/v1/admin/download_uploads.py
#
# parents[4]
# -> backend/
# =========================================================

BACKEND_ROOT = (
    Path(__file__)
    .resolve()
    .parents[4]
)


DOWNLOAD_UPLOAD_DIR = (
    BACKEND_ROOT
    / "uploads"
    / "downloads"
)


DOWNLOAD_FILES_DIR = (
    DOWNLOAD_UPLOAD_DIR
    / "files"
)


DOWNLOAD_ICONS_DIR = (
    DOWNLOAD_UPLOAD_DIR
    / "icons"
)


# =========================================================
# CREATE UPLOAD DIRECTORIES
# =========================================================

DOWNLOAD_FILES_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


DOWNLOAD_ICONS_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =========================================================
# RESPONSE MODEL — PDF
# =========================================================

class DownloadFileUploadResponse(
    BaseModel
):

    file_url: str

    file_name: str

    original_name: str

    size: int


# =========================================================
# RESPONSE MODEL — ICON
# =========================================================

class DownloadIconUploadResponse(
    BaseModel
):

    icon_url: str

    file_name: str

    original_name: str

    size: int

    width: int

    height: int


# =========================================================
# DELETE PARTIAL FILE
#
# Used if a PDF upload fails halfway through.
# =========================================================

def remove_partial_file(
    file_path: Path,
) -> None:

    try:

        if (
            file_path.exists()
            and file_path.is_file()
        ):

            file_path.unlink()

    except OSError:

        pass


# =========================================================
# VALIDATE + SAVE PDF
# =========================================================

async def save_download_pdf(
    file: UploadFile,
) -> DownloadFileUploadResponse:

    # -----------------------------------------------------
    # ORIGINAL FILE NAME
    # -----------------------------------------------------

    original_name = (
        file.filename
        or ""
    ).strip()


    if not original_name:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,

            detail=
                "PDF file name is missing.",
        )


    # -----------------------------------------------------
    # EXTENSION
    # -----------------------------------------------------

    extension = (
        Path(
            original_name
        )
        .suffix
        .lower()
    )


    if extension not in PDF_EXTENSIONS:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,

            detail=(
                "Only PDF files are allowed."
            ),
        )


    # -----------------------------------------------------
    # CONTENT TYPE
    # -----------------------------------------------------

    if (
        file.content_type
        not in PDF_CONTENT_TYPES
    ):

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,

            detail=(
                "Invalid PDF content type."
            ),
        )


    # -----------------------------------------------------
    # UNIQUE FILE NAME
    # -----------------------------------------------------

    generated_name = (
        f"{uuid4().hex}.pdf"
    )


    destination = (
        DOWNLOAD_FILES_DIR
        / generated_name
    )


    total_size = 0

    first_chunk = True


    try:

        with destination.open(
            "wb"
        ) as output_file:

            while True:

                chunk = (
                    await file.read(
                        CHUNK_SIZE
                    )
                )


                if not chunk:

                    break


                # -----------------------------------------
                # CHECK REAL PDF SIGNATURE
                #
                # Real PDFs start with:
                #
                # %PDF-
                # -----------------------------------------

                if first_chunk:

                    if not chunk.startswith(
                        b"%PDF-"
                    ):

                        raise HTTPException(
                            status_code=
                                status.HTTP_400_BAD_REQUEST,

                            detail=(
                                "The uploaded file is not "
                                "a valid PDF."
                            ),
                        )

                    first_chunk = False


                # -----------------------------------------
                # SIZE
                # -----------------------------------------

                total_size += (
                    len(chunk)
                )


                if (
                    total_size
                    > MAX_PDF_SIZE
                ):

                    raise HTTPException(
                        status_code=
                            status.HTTP_400_BAD_REQUEST,

                        detail=(
                            "PDF file size cannot "
                            "exceed 50 MB."
                        ),
                    )


                # -----------------------------------------
                # WRITE
                # -----------------------------------------

                output_file.write(
                    chunk
                )


        # -------------------------------------------------
        # EMPTY FILE
        # -------------------------------------------------

        if total_size == 0:

            raise HTTPException(
                status_code=
                    status.HTTP_400_BAD_REQUEST,

                detail=(
                    "PDF file is empty."
                ),
            )


    except HTTPException:

        remove_partial_file(
            destination
        )

        raise


    except OSError as error:

        remove_partial_file(
            destination
        )

        raise HTTPException(
            status_code=
                status.HTTP_500_INTERNAL_SERVER_ERROR,

            detail=(
                "Unable to save PDF file."
            ),
        ) from error


    # -----------------------------------------------------
    # PUBLIC URL
    # -----------------------------------------------------

    file_url = (
        f"/uploads/downloads/files/"
        f"{generated_name}"
    )


    return DownloadFileUploadResponse(

        file_url=file_url,

        file_name=
            generated_name,

        original_name=
            original_name,

        size=
            total_size,
    )


# =========================================================
# VALIDATE ICON
# =========================================================

async def validate_download_icon(
    file: UploadFile,
) -> tuple[
    bytes,
    str,
    int,
    int,
    str,
]:

    # -----------------------------------------------------
    # ORIGINAL NAME
    # -----------------------------------------------------

    original_name = (
        file.filename
        or ""
    ).strip()


    if not original_name:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,

            detail=(
                "Icon image file name "
                "is missing."
            ),
        )


    # -----------------------------------------------------
    # EXTENSION
    # -----------------------------------------------------

    extension = (
        Path(
            original_name
        )
        .suffix
        .lower()
    )


    if (
        extension
        not in ICON_EXTENSIONS
    ):

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,

            detail=(
                "Only JPG, JPEG, PNG "
                "and WEBP icons are allowed."
            ),
        )


    # -----------------------------------------------------
    # CONTENT TYPE
    # -----------------------------------------------------

    if (
        file.content_type
        not in ICON_CONTENT_TYPES
    ):

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,

            detail=(
                "Invalid icon image "
                "content type."
            ),
        )


    # -----------------------------------------------------
    # READ MAXIMUM + ONE BYTE
    #
    # This lets us detect an oversized image
    # without reading unlimited data.
    # -----------------------------------------------------

    content = (
        await file.read(
            MAX_ICON_SIZE + 1
        )
    )


    if not content:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,

            detail=(
                "Icon image is empty."
            ),
        )


    if (
        len(content)
        > MAX_ICON_SIZE
    ):

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,

            detail=(
                "Icon image size cannot "
                "exceed 5 MB."
            ),
        )


    # -----------------------------------------------------
    # VERIFY ACTUAL IMAGE
    # -----------------------------------------------------

    try:

        with Image.open(
            BytesIO(content)
        ) as image:

            image.verify()


        # Re-open after verify()
        # to safely access format + dimensions.

        with Image.open(
            BytesIO(content)
        ) as image:

            image_format = (
                image.format
            )

            width = (
                image.width
            )

            height = (
                image.height
            )


    except (
        UnidentifiedImageError,
        OSError,
    ) as error:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,

            detail=(
                "The uploaded icon is "
                "not a valid image."
            ),
        ) from error


    # -----------------------------------------------------
    # ALLOWED REAL IMAGE FORMAT
    # -----------------------------------------------------

    if (
        image_format
        not in ICON_PIL_FORMATS
    ):

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,

            detail=(
                "Only JPG, PNG and WEBP "
                "icon images are allowed."
            ),
        )


    safe_extension = (
        ICON_PIL_FORMATS[
            image_format
        ]
    )


    return (
        content,
        safe_extension,
        width,
        height,
        original_name,
    )


# =========================================================
# UPLOAD PDF
#
# POST:
#
# /api/v1/admin/uploads/download-file
# =========================================================

@router.post(
    "/download-file",

    response_model=
        DownloadFileUploadResponse,

    status_code=
        status.HTTP_201_CREATED,
)
async def upload_download_file(

    file: Annotated[
        UploadFile,
        File(
            description=(
                "Download document. "
                "PDF only. "
                "Maximum 50 MB."
            )
        ),
    ],

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    # Authentication dependency is intentionally
    # required even though the admin object itself
    # is not used in this upload function.

    _ = current_admin


    return await save_download_pdf(
        file
    )


# =========================================================
# UPLOAD CUSTOM ICON
#
# POST:
#
# /api/v1/admin/uploads/download-icon
# =========================================================

@router.post(
    "/download-icon",

    response_model=
        DownloadIconUploadResponse,

    status_code=
        status.HTTP_201_CREATED,
)
async def upload_download_icon(

    file: Annotated[
        UploadFile,
        File(
            description=(
                "Custom Download icon. "
                "Allowed: JPG, JPEG, "
                "PNG, WEBP. "
                "Maximum 5 MB."
            )
        ),
    ],

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    _ = current_admin


    (
        content,
        safe_extension,
        width,
        height,
        original_name,
    ) = (
        await validate_download_icon(
            file
        )
    )


    # -----------------------------------------------------
    # UNIQUE FILE NAME
    # -----------------------------------------------------

    generated_name = (
        f"{uuid4().hex}"
        f"{safe_extension}"
    )


    destination = (
        DOWNLOAD_ICONS_DIR
        / generated_name
    )


    # -----------------------------------------------------
    # SAVE IMAGE
    # -----------------------------------------------------

    try:

        destination.write_bytes(
            content
        )

    except OSError as error:

        remove_partial_file(
            destination
        )

        raise HTTPException(
            status_code=
                status.HTTP_500_INTERNAL_SERVER_ERROR,

            detail=(
                "Unable to save icon image."
            ),
        ) from error


    # -----------------------------------------------------
    # PUBLIC URL
    # -----------------------------------------------------

    icon_url = (
        f"/uploads/downloads/icons/"
        f"{generated_name}"
    )


    return DownloadIconUploadResponse(

        icon_url=
            icon_url,

        file_name=
            generated_name,

        original_name=
            original_name,

        size=
            len(content),

        width=
            width,

        height=
            height,
    )