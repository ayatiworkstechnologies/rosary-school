from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from app.db.session import (
    get_db,
)

from app.schemas.download import (
    PublicDownloadListResponse,
)

from app.services.download_service import (
    list_public_downloads,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/v1/downloads",
    tags=["Public Downloads"],
)


# =========================================================
# GET PUBLIC DOWNLOADS
#
# GET:
#
# /api/v1/downloads
#
# Public endpoint.
# No Admin authentication required.
#
# Returns:
#
# only is_active = true
# ordered by display_order ASC
# =========================================================

@router.get(
    "",
    response_model=
        PublicDownloadListResponse,
)
def get_public_downloads(

    db: Session = Depends(
        get_db
    ),
):

    items, total = (
        list_public_downloads(
            db
        )
    )

    return PublicDownloadListResponse(
        items=items,
        total=total,
    )