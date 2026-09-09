from fastapi import (
    APIRouter,
    Depends,
    Query,
)

from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_db,
)

from app.schemas.gallery import (
    PublicGalleryAlbumListResponse,
    PublicHomepageGalleryResponse,
)

from app.services.gallery_service import (
    get_public_gallery_albums,
    get_public_homepage_gallery,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/v1/gallery",
    tags=[
        "Public Gallery"
    ],
)


# =========================================================
# PUBLIC GALLERY ALBUMS
#
# Used by:
#
# /gallery
#
# Examples:
#
# GET
# /api/v1/gallery/albums
#
# GET
# /api/v1/gallery/albums?year=2026
#
# Only Published Albums are returned.
#
# Albums without images are hidden.
# =========================================================

@router.get(
    "/albums",

    response_model=(
        PublicGalleryAlbumListResponse
    ),
)
def get_gallery_albums(
    year: int | None = Query(
        default=None,
        ge=1900,
        le=2100,
    ),

    db: Session = Depends(
        get_db
    ),
):

    items, total = (
        get_public_gallery_albums(
            db,
            year=year,
        )
    )


    return (
        PublicGalleryAlbumListResponse(
            items=items,
            total=total,
        )
    )


# =========================================================
# PUBLIC HOMEPAGE GALLERY
#
# Used by:
#
# Homepage
# -> Life at Rosary
#
# Returns only:
#
# is_homepage = true
#
# parent album Published = true
#
# homepage_order 1 -> 6
# =========================================================

@router.get(
    "/homepage",

    response_model=(
        PublicHomepageGalleryResponse
    ),
)
def get_homepage_gallery(
    db: Session = Depends(
        get_db
    ),
):

    items = (
        get_public_homepage_gallery(
            db
        )
    )


    return (
        PublicHomepageGalleryResponse(
            items=items,
            total=len(
                items
            ),
        )
    )