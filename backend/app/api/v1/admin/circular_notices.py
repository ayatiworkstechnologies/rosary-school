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
    get_db,
)

from app.models.admin import Admin

from app.models.circular_notice import (
    CircularNoticeType,
)

from app.schemas.circular_notice import (
    CircularNoticeCreate,
    CircularNoticeListResponse,
    CircularNoticeResponse,
    CircularNoticeUpdate,
)

from app.services.circular_notice_service import (
    create_circular_notice,
    delete_circular_notice,
    get_circular_notice_by_id,
    list_circular_notices,
    update_circular_notice,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/v1/admin/circular-notices",
    tags=["Admin Circulars & Notices"],
)


# =========================================================
# GET ALL
#
# Supports:
# - pagination
# - content type filter
# - published filter
# - featured filter
# - search
# =========================================================

@router.get(
    "",
    response_model=CircularNoticeListResponse,
)
def get_circular_notices(
    page: int = Query(
        default=1,
        ge=1,
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    content_type: CircularNoticeType | None = Query(
        default=None,
    ),
    is_published: bool | None = Query(
        default=None,
    ),
    is_featured: bool | None = Query(
        default=None,
    ),
    search: str | None = Query(
        default=None,
    ),
    db: Session = Depends(
        get_db
    ),
    current_admin: Admin = Depends(
        get_current_admin
    ),
):
    items, total = list_circular_notices(
        db,
        page=page,
        limit=limit,
        content_type=content_type,
        is_published=is_published,
        is_featured=is_featured,
        search=search,
    )

    return CircularNoticeListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
    )


# =========================================================
# CREATE
# =========================================================

@router.post(
    "",
    response_model=CircularNoticeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_circular_notice_endpoint(
    payload: CircularNoticeCreate,
    db: Session = Depends(
        get_db
    ),
    current_admin: Admin = Depends(
        get_current_admin
    ),
):
    try:
        item = create_circular_notice(
            db,
            payload=payload,
            admin_id=current_admin.id,
        )

        return item

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error


# =========================================================
# GET SINGLE
# =========================================================

@router.get(
    "/{circular_notice_id}",
    response_model=CircularNoticeResponse,
)
def get_circular_notice(
    circular_notice_id: int,
    db: Session = Depends(
        get_db
    ),
    current_admin: Admin = Depends(
        get_current_admin
    ),
):
    item = get_circular_notice_by_id(
        db,
        circular_notice_id,
    )

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Circular or Notice not found.",
        )

    return item


# =========================================================
# UPDATE
# =========================================================

@router.patch(
    "/{circular_notice_id}",
    response_model=CircularNoticeResponse,
)
def update_circular_notice_endpoint(
    circular_notice_id: int,
    payload: CircularNoticeUpdate,
    db: Session = Depends(
        get_db
    ),
    current_admin: Admin = Depends(
        get_current_admin
    ),
):
    item = get_circular_notice_by_id(
        db,
        circular_notice_id,
    )

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Circular or Notice not found.",
        )

    try:
        updated_item = update_circular_notice(
            db,
            item=item,
            payload=payload,
        )

        return updated_item

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error


# =========================================================
# DELETE
# =========================================================

@router.delete(
    "/{circular_notice_id}",
)
def delete_circular_notice_endpoint(
    circular_notice_id: int,
    db: Session = Depends(
        get_db
    ),
    current_admin: Admin = Depends(
        get_current_admin
    ),
):
    item = get_circular_notice_by_id(
        db,
        circular_notice_id,
    )

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Circular or Notice not found.",
        )

    delete_circular_notice(
        db,
        item=item,
    )

    return {
        "message": (
            "Circular or Notice deleted successfully."
        )
    }