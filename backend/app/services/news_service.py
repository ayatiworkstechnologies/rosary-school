import re
import unicodedata

from datetime import datetime, timezone

from sqlalchemy import (
    case,
    func,
    or_,
    select,
)
from sqlalchemy.orm import Session

from app.models.news import (
    NewsContentType,
    NewsItem,
)
from app.schemas.news import (
    NewsCreate,
    NewsUpdate,
)


# =========================================================
# DATE HELPER
# =========================================================

def utc_now() -> datetime:
    """
    MariaDB DATETIME normally stores no timezone information.

    We generate UTC time and remove timezone metadata
    before saving it.
    """

    return (
        datetime.now(timezone.utc)
        .replace(tzinfo=None)
    )


# =========================================================
# SLUG GENERATOR
# =========================================================

def slugify(value: str) -> str:
    """
    Convert:

        Annual Sports Meet 2026

    into:

        annual-sports-meet-2026
    """

    value = unicodedata.normalize(
        "NFKD",
        value,
    )

    value = (
        value
        .encode(
            "ascii",
            "ignore",
        )
        .decode("ascii")
    )

    value = value.lower()

    value = re.sub(
        r"[^a-z0-9]+",
        "-",
        value,
    )

    value = value.strip("-")

    return value or "news-item"


# =========================================================
# UNIQUE SLUG
# =========================================================

def generate_unique_slug(
    db: Session,
    title: str,
    exclude_id: int | None = None,
) -> str:
    """
    Generate a slug that does not already exist.

    Example:

        annual-sports-meet-2026

    If it exists:

        annual-sports-meet-2026-2

    Then:

        annual-sports-meet-2026-3
    """

    base_slug = slugify(title)

    slug = base_slug

    counter = 2

    while True:
        query = select(
            NewsItem.id
        ).where(
            NewsItem.slug == slug
        )

        # Used when editing an existing record.
        if exclude_id is not None:
            query = query.where(
                NewsItem.id != exclude_id
            )

        existing = db.scalar(
            query
        )

        if existing is None:
            return slug

        slug = (
            f"{base_slug}-{counter}"
        )

        counter += 1


# =========================================================
# CREATE NEWS / ANNOUNCEMENT
# =========================================================

def create_news_item(
    db: Session,
    payload: NewsCreate,
    admin_id: int,
) -> NewsItem:
    """
    Create a new News or Announcement item.
    """

    slug = generate_unique_slug(
        db=db,
        title=payload.title,
    )

    published_at = (
        payload.published_at
    )

    # -----------------------------------------------------
    # AUTO PUBLISH DATE
    # -----------------------------------------------------

    if (
        payload.is_published
        and published_at is None
    ):
        published_at = utc_now()

    # -----------------------------------------------------
    # CREATE DATABASE OBJECT
    # -----------------------------------------------------

    item = NewsItem(
        content_type=payload.content_type,
        label=payload.label,
        title=payload.title,
        slug=slug,
        short_description=(
            payload.short_description
        ),
        content=payload.content,
        image_url=payload.image_url,
        published_at=published_at,
        is_published=(
            payload.is_published
        ),
        is_featured=(
            payload.is_featured
        ),
        created_by_id=admin_id,
    )

    # -----------------------------------------------------
    # SAVE
    # -----------------------------------------------------

    db.add(item)

    db.commit()

    db.refresh(item)

    return item


# =========================================================
# GET ONE NEWS ITEM BY ID
# =========================================================

def get_news_item_by_id(
    db: Session,
    item_id: int,
) -> NewsItem | None:
    """
    Find a News item using its database ID.
    """

    return db.get(
        NewsItem,
        item_id,
    )


# =========================================================
# GET ONE NEWS ITEM BY SLUG
# =========================================================

def get_news_item_by_slug(
    db: Session,
    slug: str,
) -> NewsItem | None:
    """
    Find News / Announcement by public slug.
    """

    return db.scalar(
        select(
            NewsItem
        ).where(
            NewsItem.slug == slug
        )
    )


# =========================================================
# LIST NEWS / ANNOUNCEMENTS
# =========================================================

def list_news_items(
    db: Session,
    page: int = 1,
    limit: int = 10,
    content_type: NewsContentType | None = None,
    is_published: bool | None = None,
    search: str | None = None,
) -> tuple[list[NewsItem], int]:
    """
    Return paginated News / Announcement items.

    Supports:

    - News only
    - Announcements only
    - Drafts
    - Published items
    - Search
    """

    conditions = []

    # =====================================================
    # CONTENT TYPE FILTER
    # =====================================================

    if content_type is not None:
        conditions.append(
            NewsItem.content_type
            == content_type
        )

    # =====================================================
    # PUBLISHED FILTER
    # =====================================================

    if is_published is not None:
        conditions.append(
            NewsItem.is_published
            == is_published
        )

    # =====================================================
    # SEARCH
    # =====================================================

    if search:
        search_value = (
            f"%{search.strip()}%"
        )

        conditions.append(
            or_(
                NewsItem.title.ilike(
                    search_value
                ),
                NewsItem.label.ilike(
                    search_value
                ),
                NewsItem.short_description.ilike(
                    search_value
                ),
            )
        )

    # =====================================================
    # TOTAL COUNT
    # =====================================================

    count_query = select(
        func.count(
            NewsItem.id
        )
    )

    if conditions:
        count_query = (
            count_query.where(
                *conditions
            )
        )

    total = (
        db.scalar(
            count_query
        )
        or 0
    )

    # =====================================================
    # PAGINATION
    # =====================================================

    offset = (
        page - 1
    ) * limit

    query = select(
        NewsItem
    )

    if conditions:
        query = query.where(
            *conditions
        )

    # =====================================================
    # LATEST FIRST
    # =====================================================

    query = query.order_by(
        # Published items with dates first.
        case(
            (
                NewsItem.published_at.is_(
                    None
                ),
                1,
            ),
            else_=0,
        ),

        NewsItem.published_at.desc(),

        NewsItem.created_at.desc(),
    )

    query = (
        query
        .offset(offset)
        .limit(limit)
    )

    items = list(
        db.scalars(
            query
        ).all()
    )

    return items, total


# =========================================================
# UPDATE NEWS / ANNOUNCEMENT
# =========================================================

def update_news_item(
    db: Session,
    item: NewsItem,
    payload: NewsUpdate,
) -> NewsItem:
    """
    Update only the fields supplied by the admin.
    """

    update_data = (
        payload.model_dump(
            exclude_unset=True
        )
    )

    # =====================================================
    # REGENERATE SLUG IF TITLE CHANGED
    # =====================================================

    if (
        "title" in update_data
        and update_data["title"]
        is not None
    ):
        item.slug = (
            generate_unique_slug(
                db=db,
                title=update_data[
                    "title"
                ],
                exclude_id=item.id,
            )
        )

    # =====================================================
    # AUTO PUBLISH DATE
    # =====================================================

    if (
        update_data.get(
            "is_published"
        )
        is True
        and item.published_at
        is None
        and update_data.get(
            "published_at"
        )
        is None
    ):
        update_data[
            "published_at"
        ] = utc_now()

    # =====================================================
    # UPDATE FIELDS
    # =====================================================

    for field, value in (
        update_data.items()
    ):
        setattr(
            item,
            field,
            value,
        )

    # =====================================================
    # SAVE
    # =====================================================

    db.commit()

    db.refresh(item)

    return item


# =========================================================
# DELETE NEWS / ANNOUNCEMENT
# =========================================================

def delete_news_item(
    db: Session,
    item: NewsItem,
) -> None:
    """
    Permanently delete a News / Announcement.
    """

    db.delete(item)

    db.commit()