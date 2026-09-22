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

from PIL import Image
from PIL import UnidentifiedImageError

from pydantic import (
    BaseModel,
)

from app.api.dependencies import (
    get_current_admin,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/v1/admin/uploads",
    tags=[
        "Admin Faculty Uploads"
    ],
)


# =========================================================
# CONFIG
# =========================================================

MAX_FILE_SIZE = (
    5
    * 1024
    * 1024
)


ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}


ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


ALLOWED_PIL_FORMATS = {
    "JPEG",
    "PNG",
    "WEBP",
}


# =========================================================
# UPLOAD DIRECTORY
# =========================================================

# faculty_uploads.py
#
# backend/app/api/v1/admin/faculty_uploads.py
#
# parents[0] -> admin
# parents[1] -> v1
# parents[2] -> api
# parents[3] -> app
# parents[4] -> backend

BACKEND_ROOT = (
    Path(__file__)
    .resolve()
    .parents[4]
)


FACULTY_UPLOAD_DIR = (
    BACKEND_ROOT
    / "uploads"
    / "faculty"
)


FACULTY_UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =========================================================
# RESPONSE
# =========================================================

class FacultyImageUploadResponse(
    BaseModel
):

    image_url: str

    file_name: str

    original_name: str

    size: int

    width: int

    height: int


# =========================================================
# VERIFY IMAGE
# =========================================================

def verify_faculty_image(
    contents: bytes,
) -> tuple[
    int,
    int,
    str,
]:

    try:

        with Image.open(
            BytesIO(
                contents
            )
        ) as image:

            width, height = (
                image.size
            )

            image_format = (
                image.format
                or ""
            ).upper()


            if (
                image_format
                not in
                ALLOWED_PIL_FORMATS
            ):

                raise HTTPException(
                    status_code=(
                        status.HTTP_400_BAD_REQUEST
                    ),

                    detail=(
                        "Only JPG, JPEG, PNG "
                        "and WEBP images are allowed."
                    ),
                )


            # Forces Pillow to inspect
            # the actual image structure.

            image.verify()


    except UnidentifiedImageError as error:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                "The uploaded file is not "
                "a valid image."
            ),
        ) from error


    except OSError as error:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                "The uploaded image is "
                "corrupted or invalid."
            ),
        ) from error


    if (
        width <= 0
        or
        height <= 0
    ):

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                "The uploaded image has "
                "invalid dimensions."
            ),
        )


    return (
        width,
        height,
        image_format,
    )


# =========================================================
# FORMAT -> EXTENSION
# =========================================================

def get_safe_extension(
    image_format: str,
) -> str:

    mapping = {
        "JPEG":
            ".jpg",

        "PNG":
            ".png",

        "WEBP":
            ".webp",
    }


    extension = (
        mapping.get(
            image_format
        )
    )


    if not extension:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                "Unsupported image format."
            ),
        )


    return extension


# =========================================================
# UPLOAD FACULTY IMAGE
# =========================================================

@router.post(
    "/faculty-image",

    response_model=
        FacultyImageUploadResponse,

    status_code=(
        status.HTTP_201_CREATED
    ),
)
async def upload_faculty_image(
    file: Annotated[
        UploadFile,

        File(
            description=(
                "Faculty profile image. "
                "Allowed: JPG, JPEG, PNG, WEBP. "
                "Maximum size: 5 MB."
            )
        ),
    ],

    _current_admin=Depends(
        get_current_admin
    ),
):
    # -----------------------------------------------------
    # FILE NAME
    # -----------------------------------------------------

    original_name = (
        file.filename
        or
        "faculty-image"
    )


    extension = (
        Path(
            original_name
        )
        .suffix
        .lower()
    )


    if (
        extension
        not in
        ALLOWED_EXTENSIONS
    ):

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                "Only JPG, JPEG, PNG "
                "and WEBP images are allowed."
            ),
        )


    # -----------------------------------------------------
    # MIME TYPE
    # -----------------------------------------------------

    if (
        file.content_type
        not in
        ALLOWED_CONTENT_TYPES
    ):

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                "Invalid image content type."
            ),
        )


    # -----------------------------------------------------
    # READ FILE
    # -----------------------------------------------------

    contents = (
        await file.read()
    )


    await file.close()


    if not contents:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                "The uploaded image is empty."
            ),
        )


    # -----------------------------------------------------
    # FILE SIZE
    # -----------------------------------------------------

    file_size = (
        len(
            contents
        )
    )


    if (
        file_size >
        MAX_FILE_SIZE
    ):

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                "Faculty image must be "
                "5 MB or smaller."
            ),
        )


    # -----------------------------------------------------
    # VERIFY ACTUAL IMAGE
    # -----------------------------------------------------

    (
        width,
        height,
        image_format,
    ) = verify_faculty_image(
        contents
    )


    # -----------------------------------------------------
    # USE VERIFIED EXTENSION
    #
    # We do not blindly trust:
    #
    # photo.jpg
    #
    # The actual image format determines
    # the final extension.
    # -----------------------------------------------------

    safe_extension = (
        get_safe_extension(
            image_format
        )
    )


    # -----------------------------------------------------
    # UNIQUE FILE NAME
    # -----------------------------------------------------

    file_name = (
        f"{uuid4().hex}"
        f"{safe_extension}"
    )


    file_path = (
        FACULTY_UPLOAD_DIR
        / file_name
    )


    # -----------------------------------------------------
    # SAVE IMAGE
    # -----------------------------------------------------

    try:

        file_path.write_bytes(
            contents
        )


    except OSError as error:

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),

            detail=(
                "Unable to save Faculty image."
            ),
        ) from error


    # -----------------------------------------------------
    # PUBLIC URL
    # -----------------------------------------------------

    image_url = (
        f"/uploads/faculty/"
        f"{file_name}"
    )


    return FacultyImageUploadResponse(
        image_url=
            image_url,

        file_name=
            file_name,

        original_name=
            original_name,

        size=
            file_size,

        width=
            width,

        height=
            height,
    )