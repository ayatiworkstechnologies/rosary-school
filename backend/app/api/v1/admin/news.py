from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_admin
from app.db.session import get_db
from app.models.admin import Admin
from app.models.news import (
    NewsContentType,
    NewsItem,
)
from app.schemas.news import (
    NewsCreate,
    NewsListResponse,
    NewsResponse,
    NewsUpdate,
)
from app.services.news_service import (
    create_news_item,
    delete_news_item,
    get_news_item_by_id,
    list_news_items,
    update_news_item,
)


router = APIRouter(
    prefix="/api/v1/admin/news",
    tags=["Admin News Management"],
)


# =========================================================
# LIST NEWS / ANNOUNCEMENTS
# =========================================================

@router.get(
    "",
    response_model=NewsListResponse,
    status_code=status.HTTP_200_OK,
)
def get_admin_news_items(
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
    is_published: bool | None = Query(
        default=None,
    ),
    search: str | None = Query(
        default=None,
        max_length=255,
    ),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin
    ),
):
    """
    List News and Announcement items
    for the admin dashboard.

    Supports:
    - pagination
    - News / Announcement filter
    - published / draft filter
    - search
    """

    items, total = list_news_items(
        db=db,
        page=page,
        limit=limit,
        content_type=content_type,
        is_published=is_published,
        search=search,
    )

    return NewsListResponse(
        items=[
            NewsResponse.model_validate(
                item
            )
            for item in items
        ],
        total=total,
        page=page,
        limit=limit,
    )


# =========================================================
# CREATE NEWS / ANNOUNCEMENT
# =========================================================

@router.post(
    "",
    response_model=NewsResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_news_item(
    payload: NewsCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin
    ),
):
    """
    Create a News or Announcement item.
    """

    item = create_news_item(
        db=db,
        payload=payload,
        admin_id=current_admin.id,
    )

    return NewsResponse.model_validate(
        item
    )


# =========================================================
# GET ONE NEWS ITEM
# =========================================================

@router.get(
    "/{item_id}",
    response_model=NewsResponse,
    status_code=status.HTTP_200_OK,
)
def get_admin_news_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin
    ),
):
    """
    Get one News / Announcement
    using its database ID.
    """

    item = get_news_item_by_id(
        db=db,
        item_id=item_id,
    )

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "News or Announcement item not found."
            ),
        )

    return NewsResponse.model_validate(
        item
    )


# =========================================================
# UPDATE NEWS / ANNOUNCEMENT
# =========================================================

@router.patch(
    "/{item_id}",
    response_model=NewsResponse,
    status_code=status.HTTP_200_OK,
)
def update_admin_news_item(
    item_id: int,
    payload: NewsUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin
    ),
):
    """
    Update selected fields of an existing
    News / Announcement item.
    """

    item = get_news_item_by_id(
        db=db,
        item_id=item_id,
    )

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "News or Announcement item not found."
            ),
        )

    updated_item = update_news_item(
        db=db,
        item=item,
        payload=payload,
    )

    return NewsResponse.model_validate(
        updated_item
    )


# =========================================================
# DELETE NEWS / ANNOUNCEMENT
# =========================================================

@router.delete(
    "/{item_id}",
    status_code=status.HTTP_200_OK,
)
def delete_admin_news_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin
    ),
):
    """
    Permanently delete a News or Announcement item.
    """

    item = get_news_item_by_id(
        db=db,
        item_id=item_id,
    )

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "News or Announcement item not found."
            ),
        )

    delete_news_item(
        db=db,
        item=item,
    )

    return {
        "message": (
            "News or Announcement deleted successfully."
        )
    }