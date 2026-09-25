from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_current_admin,
)

from app.db.session import (
    get_db,
)

from app.models.admin import (
    Admin,
)

from app.models.download import (
    Download,
)

from app.schemas.download import (
    DownloadCreate,
    DownloadListResponse,
    DownloadOrderUpdate,
    DownloadResponse,
    DownloadStatusUpdate,
    DownloadUpdate,
)

from app.services.download_service import (
    create_download,
    delete_download,
    get_download_by_id,
    list_admin_downloads,
    update_download,
    update_download_order,
    update_download_status,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/v1/admin/downloads",
    tags=["Admin Downloads"],
)


# =========================================================
# HELPER
# =========================================================

def get_download_or_404(
    db: Session,
    download_id: int,
) -> Download:

    download = get_download_by_id(
        db,
        download_id,
    )

    if download is None:

        raise HTTPException(
            status_code=
                status.HTTP_404_NOT_FOUND,

            detail=
                "Download not found.",
        )

    return download


# =========================================================
# GET ALL DOWNLOADS
#
# GET:
#
# /api/v1/admin/downloads
#
# Optional filters:
#
# ?page=1
# ?limit=20
# ?search=timetable
# ?icon_type=lucide
# ?is_active=true
# =========================================================

@router.get(
    "",
    response_model=
        DownloadListResponse,
)
def get_downloads(

    page: int = Query(
        default=1,
        ge=1,
    ),

    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),

    search: str | None = Query(
        default=None,
    ),

    icon_type: str | None = Query(
        default=None,
    ),

    is_active: bool | None = Query(
        default=None,
    ),

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    _ = current_admin


    items, total = (
        list_admin_downloads(
            db,
            page=page,
            limit=limit,
            search=search,
            icon_type=icon_type,
            is_active=is_active,
        )
    )


    return DownloadListResponse(
        items=items,
        total=total,
    )


# =========================================================
# GET SINGLE DOWNLOAD
#
# GET:
#
# /api/v1/admin/downloads/{download_id}
# =========================================================

@router.get(
    "/{download_id}",
    response_model=
        DownloadResponse,
)
def get_download(

    download_id: int,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    _ = current_admin


    return get_download_or_404(
        db,
        download_id,
    )


# =========================================================
# CREATE DOWNLOAD
#
# POST:
#
# /api/v1/admin/downloads
# =========================================================

@router.post(
    "",
    response_model=
        DownloadResponse,
    status_code=
        status.HTTP_201_CREATED,
)
def create_admin_download(

    payload: DownloadCreate,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    try:

        return create_download(
            db,
            payload=payload,
            admin_id=
                current_admin.id,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,

            detail=str(
                error
            ),
        ) from error


# =========================================================
# UPDATE DOWNLOAD
#
# PATCH:
#
# /api/v1/admin/downloads/{download_id}
# =========================================================

@router.patch(
    "/{download_id}",
    response_model=
        DownloadResponse,
)
def update_admin_download(

    download_id: int,

    payload: DownloadUpdate,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    _ = current_admin


    download = get_download_or_404(
        db,
        download_id,
    )


    try:

        return update_download(
            db,
            download=download,
            payload=payload,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,

            detail=str(
                error
            ),
        ) from error


# =========================================================
# UPDATE ACTIVE STATUS
#
# PATCH:
#
# /api/v1/admin/downloads/{download_id}/status
#
# Example:
#
# {
#   "is_active": false
# }
# =========================================================

@router.patch(
    "/{download_id}/status",
    response_model=
        DownloadResponse,
)
def update_admin_download_status(

    download_id: int,

    payload: DownloadStatusUpdate,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    _ = current_admin


    download = get_download_or_404(
        db,
        download_id,
    )


    return update_download_status(
        db,
        download=download,
        is_active=
            payload.is_active,
    )


# =========================================================
# UPDATE DISPLAY ORDER
#
# PATCH:
#
# /api/v1/admin/downloads/{download_id}/order
#
# Example:
#
# {
#   "display_order": 3
# }
# =========================================================

@router.patch(
    "/{download_id}/order",
    response_model=
        DownloadResponse,
)
def update_admin_download_order(

    download_id: int,

    payload: DownloadOrderUpdate,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    _ = current_admin


    download = get_download_or_404(
        db,
        download_id,
    )


    try:

        return update_download_order(
            db,
            download=download,
            display_order=
                payload.display_order,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,

            detail=str(
                error
            ),
        ) from error


# =========================================================
# DELETE DOWNLOAD
#
# DELETE:
#
# /api/v1/admin/downloads/{download_id}
#
# This also removes:
#
# uploaded PDF
# uploaded custom icon
#
# through download_service.py
# =========================================================

@router.delete(
    "/{download_id}",
    status_code=
        status.HTTP_204_NO_CONTENT,
)
def delete_admin_download(

    download_id: int,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    _ = current_admin


    download = get_download_or_404(
        db,
        download_id,
    )


    delete_download(
        db,
        download=download,
    )


    return None