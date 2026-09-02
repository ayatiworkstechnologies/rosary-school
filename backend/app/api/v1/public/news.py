from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.models.news import (
    NewsContentType,
)

from app.schemas.news import (
    PublicNewsDetailResponse,
    PublicNewsListItem,
    PublicNewsListResponse,
)

from app.services.news_service import (
    get_news_item_by_slug,
    list_news_items,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/v1/news",
    tags=["Public News"],
)


# =========================================================
# PUBLIC NEWS + ANNOUNCEMENT LIST
# =========================================================

@router.get(
    "",
    response_model=PublicNewsListResponse,
    status_code=status.HTTP_200_OK,
)
def get_public_news(
    page: int = Query(
        default=1,
        ge=1,
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
    ),
    content_type: NewsContentType | None = Query(
        default=None,
    ),
    search: str | None = Query(
        default=None,
        max_length=255,
    ),
    db: Session = Depends(
        get_db
    ),
):
    """
    Public News + Announcement listing.

    Only published content is returned.

    Supports:
    - Pagination
    - News / Announcement filter
    - Search
    """

    items, total = list_news_items(
        db=db,
        page=page,
        limit=limit,

        content_type=content_type,

        # IMPORTANT:
        # Public website should never
        # display Draft content.
        is_published=True,

        search=search,
    )


    return PublicNewsListResponse(
        items=[
            PublicNewsListItem.model_validate(
                item
            )
            for item in items
        ],

        total=total,
        page=page,
        limit=limit,
    )


# =========================================================
# PUBLIC NEWS DETAIL
# =========================================================

@router.get(
    "/{slug}",
    response_model=PublicNewsDetailResponse,
    status_code=status.HTTP_200_OK,
)
def get_public_news_detail(
    slug: str,
    db: Session = Depends(
        get_db
    ),
):
    """
    Get one published News /
    Announcement using its slug.
    """

    item = get_news_item_by_slug(
        db=db,
        slug=slug,
    )


    # =====================================================
    # ITEM DOES NOT EXIST
    # =====================================================

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "News or Announcement not found."
            ),
        )


    # =====================================================
    # DO NOT SHOW DRAFT CONTENT PUBLICLY
    # =====================================================

    if not item.is_published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "News or Announcement not found."
            ),
        )


    return PublicNewsDetailResponse.model_validate(
        item
    )