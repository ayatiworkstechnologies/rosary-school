from fastapi import (
    APIRouter,
    Depends,
    Query,
)

from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_db,
)

from app.schemas.circular_notice import (
    PublicCircularNoticeListResponse,
)

from app.services.circular_notice_service import (
    get_public_notice_board,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/v1/circular-notices",
    tags=[
        "Public Circulars & Notices"
    ],
)


# =========================================================
# GET PUBLIC NOTICE BOARD
#
# Public endpoint.
#
# No admin authentication is required.
#
# Response:
#
# featured
# -> Large highlighted card on LEFT
#
# items
# -> Latest Circulars / Notices on RIGHT
# =========================================================

@router.get(
    "",
    response_model=PublicCircularNoticeListResponse,
)
def get_public_circular_notices(
    limit: int = Query(
        default=5,
        ge=1,
        le=20,
        description=(
            "Maximum number of non-featured "
            "Circulars / Notices to return."
        ),
    ),

    db: Session = Depends(
        get_db
    ),
):

    # =====================================================
    # GET PUBLIC DATA
    #
    # Service already guarantees:
    #
    # 1. Published records only
    # 2. Featured item separately
    # 3. Featured item excluded from items
    # 4. Latest notice_date first
    # =====================================================

    (
        featured,
        items,
        total,
    ) = get_public_notice_board(
        db,
        limit=limit,
    )


    # =====================================================
    # RESPONSE
    # =====================================================

    return PublicCircularNoticeListResponse(
        featured=featured,
        items=items,
        total=total,
        limit=limit,
    )