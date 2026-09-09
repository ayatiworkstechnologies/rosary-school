from io import BytesIO
from pathlib import Path
from typing import Annotated
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile as FastAPIUploadFile,
    status,
)

from PIL import Image

from pydantic import (
    BaseModel,
    WithJsonSchema,
)

from app.api.dependencies import (
    get_current_admin,
)

from app.models.admin import Admin


# =========================================================
# SWAGGER / OPENAPI UPLOAD FILE TYPE
#
# This keeps FastAPI's UploadFile at runtime,
# while explicitly telling OpenAPI / Swagger:
#
# type   = string
# format = binary
#
# This helps Swagger render a file picker instead of
# a normal text input.
# =========================================================

UploadFile = Annotated[
    FastAPIUploadFile,
    WithJsonSchema(
        {
            "type": "string",
            "format": "binary",
        }
    ),
]


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/v1/admin/uploads",
    tags=[
        "Admin Gallery Uploads"
    ],
)


# =========================================================
# CONFIG
# =========================================================

# Maximum size PER IMAGE:
#
# 5 MB

MAX_IMAGE_SIZE = (
    5
    * 1024
    * 1024
)


# Maximum number of images
# accepted in one request.

MAX_FILES_PER_UPLOAD = 20


# =========================================================
# ALLOWED FILE EXTENSIONS
# =========================================================

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}


# =========================================================
# ALLOWED MIME TYPES
# =========================================================

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


# =========================================================
# ALLOWED PIL FORMATS
#
# Value becomes the final stored extension.
# =========================================================

ALLOWED_PIL_FORMATS = {
    "JPEG": ".jpg",
    "PNG": ".png",
    "WEBP": ".webp",
}


# =========================================================
# STORAGE PATH
#
# Current file:
#
# backend/app/api/v1/admin/gallery_uploads.py
#
# parents[4]
# ->
# backend/
# =========================================================

BACKEND_ROOT = (
    Path(__file__)
    .resolve()
    .parents[4]
)


GALLERY_UPLOAD_DIR = (
    BACKEND_ROOT
    / "uploads"
    / "gallery"
)


# Automatically create:
#
# backend/uploads/gallery/
#
# if it doesn't already exist.

GALLERY_UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =========================================================
# RESPONSE MODEL
# =========================================================

class GalleryUploadedImage(
    BaseModel
):

    image_url: str

    file_name: str

    original_name: str

    size: int

    width: int

    height: int


# =========================================================
# MULTIPLE UPLOAD RESPONSE
# =========================================================

class GalleryUploadResponse(
    BaseModel
):

    items: list[
        GalleryUploadedImage
    ]

    total: int


# =========================================================
# VALIDATE ONE IMAGE
# =========================================================

async def validate_gallery_image(
    file: FastAPIUploadFile,
) -> tuple[
    bytes,
    str,
    int,
    int,
]:

    # -----------------------------------------------------
    # ORIGINAL FILE NAME
    # -----------------------------------------------------

    original_name = (
        file.filename
        or ""
    ).strip()


    if not original_name:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                "Image file name is missing."
            ),
        )


    # -----------------------------------------------------
    # FILE EXTENSION
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
        not in ALLOWED_EXTENSIONS
    ):

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                f"{original_name}: "
                "Only JPG, JPEG, PNG "
                "and WEBP images are allowed."
            ),
        )


    # -----------------------------------------------------
    # MIME TYPE
    # -----------------------------------------------------

    if (
        file.content_type
        not in ALLOWED_CONTENT_TYPES
    ):

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                f"{original_name}: "
                "Invalid image content type."
            ),
        )


    # -----------------------------------------------------
    # READ FILE
    #
    # We intentionally read:
    #
    # MAX_IMAGE_SIZE + 1
    #
    # so we can detect when the file exceeds
    # the configured limit.
    # -----------------------------------------------------

    content = await file.read(
        MAX_IMAGE_SIZE + 1
    )


    # -----------------------------------------------------
    # EMPTY FILE
    # -----------------------------------------------------

    if not content:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                f"{original_name}: "
                "Image file is empty."
            ),
        )


    # -----------------------------------------------------
    # MAXIMUM FILE SIZE
    # -----------------------------------------------------

    if (
        len(content)
        > MAX_IMAGE_SIZE
    ):

        raise HTTPException(
            status_code=(
                status.HTTP_413_CONTENT_TOO_LARGE
            ),

            detail=(
                f"{original_name}: "
                "Image must be 5 MB or smaller."
            ),
        )


    # -----------------------------------------------------
    # ACTUAL IMAGE VALIDATION
    #
    # Very important:
    #
    # Renaming:
    #
    # virus.exe
    #
    # to:
    #
    # virus.jpg
    #
    # is NOT enough.
    #
    # Pillow reads the actual binary contents.
    # -----------------------------------------------------

    try:

        with Image.open(
            BytesIO(
                content
            )
        ) as image:

            detected_format = (
                image.format
                or ""
            ).upper()


            width, height = (
                image.size
            )


            # Verify image integrity.

            image.verify()


    except Exception:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                f"{original_name}: "
                "The uploaded file is not "
                "a valid image."
            ),
        )


    # -----------------------------------------------------
    # VALIDATE ACTUAL DETECTED FORMAT
    # -----------------------------------------------------

    if (
        detected_format
        not in ALLOWED_PIL_FORMATS
    ):

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                f"{original_name}: "
                "Unsupported image format."
            ),
        )


    # -----------------------------------------------------
    # VALIDATE DIMENSIONS
    # -----------------------------------------------------

    if (
        width <= 0
        or height <= 0
    ):

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                f"{original_name}: "
                "Invalid image dimensions."
            ),
        )


    # -----------------------------------------------------
    # SAFE FINAL EXTENSION
    #
    # We use the format detected by Pillow.
    #
    # Example:
    #
    # uploaded:
    # photo.jpeg
    #
    # Pillow detects:
    # JPEG
    #
    # stored:
    # uuid.jpg
    # -----------------------------------------------------

    safe_extension = (
        ALLOWED_PIL_FORMATS[
            detected_format
        ]
    )


    return (
        content,
        safe_extension,
        width,
        height,
    )


# =========================================================
# MULTIPLE GALLERY IMAGE UPLOAD
# =========================================================

@router.post(
    "/gallery-images",

    response_model=(
        GalleryUploadResponse
    ),

    status_code=(
        status.HTTP_201_CREATED
    ),
)
async def upload_gallery_images(

    # -----------------------------------------------------
    # MULTIPLE FILE INPUT
    #
    # Swagger should understand this as:
    #
    # multipart/form-data
    #
    # files:
    #   array
    #   items:
    #     type: string
    #     format: binary
    # -----------------------------------------------------

    files: Annotated[
        list[UploadFile],
        File(
            description=(
                "Select one or more Gallery images. "
                "Allowed: JPG, JPEG, PNG, WEBP."
            )
        ),
    ],


    # -----------------------------------------------------
    # ADMIN AUTHENTICATION
    # -----------------------------------------------------

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    # Keep dependency explicit.
    #
    # It ensures only authenticated admins
    # can upload Gallery files.

    _ = current_admin


    # -----------------------------------------------------
    # REQUIRE AT LEAST ONE FILE
    # -----------------------------------------------------

    if not files:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                "Please select at least one image."
            ),
        )


    # -----------------------------------------------------
    # MAXIMUM FILE COUNT
    # -----------------------------------------------------

    if (
        len(files)
        > MAX_FILES_PER_UPLOAD
    ):

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                f"You can upload a maximum of "
                f"{MAX_FILES_PER_UPLOAD} images "
                "at one time."
            ),
        )


    # =====================================================
    # TRACK FILES SAVED DURING THIS REQUEST
    #
    # If one later image fails validation,
    # already-saved files are removed.
    # =====================================================

    saved_files: list[
        Path
    ] = []


    uploaded_items: list[
        GalleryUploadedImage
    ] = []


    try:

        # =================================================
        # PROCESS EACH IMAGE
        # =================================================

        for file in files:

            (
                content,
                safe_extension,
                width,
                height,
            ) = (
                await validate_gallery_image(
                    file
                )
            )


            # ---------------------------------------------
            # UNIQUE FILE NAME
            # ---------------------------------------------

            generated_name = (
                f"{uuid4().hex}"
                f"{safe_extension}"
            )


            # ---------------------------------------------
            # PHYSICAL DESTINATION
            #
            # backend/uploads/gallery/uuid.jpg
            # ---------------------------------------------

            destination = (
                GALLERY_UPLOAD_DIR
                / generated_name
            )


            # ---------------------------------------------
            # SAVE FILE
            # ---------------------------------------------

            destination.write_bytes(
                content
            )


            saved_files.append(
                destination
            )


            # ---------------------------------------------
            # PUBLIC IMAGE URL
            #
            # app.main.py mounts:
            #
            # /uploads
            #
            # Therefore:
            #
            # /uploads/gallery/uuid.jpg
            #
            # becomes accessible from:
            #
            # http://localhost:8000/uploads/gallery/uuid.jpg
            # ---------------------------------------------

            image_url = (
                f"/uploads/gallery/"
                f"{generated_name}"
            )


            # ---------------------------------------------
            # RESPONSE ITEM
            # ---------------------------------------------

            uploaded_items.append(
                GalleryUploadedImage(

                    image_url=(
                        image_url
                    ),

                    file_name=(
                        generated_name
                    ),

                    original_name=(
                        file.filename
                        or generated_name
                    ),

                    size=(
                        len(content)
                    ),

                    width=(
                        width
                    ),

                    height=(
                        height
                    ),
                )
            )


    # =====================================================
    # VALIDATION FAILURE
    # =====================================================

    except HTTPException:

        # -------------------------------------------------
        # REMOVE FILES ALREADY SAVED
        #
        # Example:
        #
        # image1.jpg ✅
        # image2.jpg ✅
        # image3.exe ❌
        #
        # Result:
        #
        # image1 removed
        # image2 removed
        #
        # No partial Gallery upload remains.
        # -------------------------------------------------

        for saved_file in saved_files:

            try:

                if (
                    saved_file.exists()
                    and
                    saved_file.is_file()
                ):

                    saved_file.unlink()


            except OSError:

                # Cleanup failure should not hide
                # the original validation error.

                pass


        raise


    # =====================================================
    # STORAGE / FILE SYSTEM FAILURE
    # =====================================================

    except OSError:

        for saved_file in saved_files:

            try:

                if (
                    saved_file.exists()
                    and
                    saved_file.is_file()
                ):

                    saved_file.unlink()


            except OSError:

                pass


        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),

            detail=(
                "Unable to save Gallery images."
            ),
        )


    # =====================================================
    # CLOSE UPLOAD FILE HANDLES
    # =====================================================

    finally:

        for file in files:

            await file.close()


    # =====================================================
    # SUCCESS RESPONSE
    # =====================================================

    return GalleryUploadResponse(

        items=(
            uploaded_items
        ),

        total=(
            len(
                uploaded_items
            )
        ),
    )