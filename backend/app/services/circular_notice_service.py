from sqlalchemy import (
    func,
    or_,
    select,
    update,
)

from sqlalchemy.orm import Session

from app.models.circular_notice import (
    CircularNotice,
    CircularNoticeType,
)

from app.schemas.circular_notice import (
    CircularNoticeCreate,
    CircularNoticeUpdate,
)


# =========================================================
# CLEAN REQUIRED TEXT
# =========================================================

def clean_required_text(
    value: str,
    field_name: str,
) -> str:

    cleaned_value = value.strip()

    if not cleaned_value:
        raise ValueError(
            f"{field_name} cannot be empty."
        )

    return cleaned_value


# =========================================================
# REMOVE PREVIOUS FEATURED ITEM
#
# Our frontend design has only ONE large featured card.
#
# When a new item becomes featured:
#
# old featured -> False
# new featured -> True
# =========================================================

def clear_previous_featured(
    db: Session,
    *,
    exclude_id: int | None = None,
) -> None:

    statement = (
        update(CircularNotice)
        .where(
            CircularNotice.is_featured.is_(True)
        )
    )

    if exclude_id is not None:

        statement = statement.where(
            CircularNotice.id != exclude_id
        )

    statement = statement.values(
        is_featured=False
    )

    db.execute(statement)


# =========================================================
# CREATE
# =========================================================

def create_circular_notice(
    db: Session,
    *,
    payload: CircularNoticeCreate,
    admin_id: int | None,
) -> CircularNotice:

    title = clean_required_text(
        payload.title,
        "Title",
    )

    description = clean_required_text(
        payload.description,
        "Description",
    )

    pdf_url = (
        payload.pdf_url.strip()
        if payload.pdf_url
        else None
    )

    # -----------------------------------------------------
    # ONLY ONE FEATURED ITEM
    # -----------------------------------------------------

    if payload.is_featured:

        clear_previous_featured(
            db
        )

    # -----------------------------------------------------
    # CREATE DATABASE RECORD
    # -----------------------------------------------------

    item = CircularNotice(
        content_type=payload.content_type,
        title=title,
        description=description,
        notice_date=payload.notice_date,
        pdf_url=pdf_url,
        is_published=payload.is_published,
        is_featured=payload.is_featured,
        created_by_id=admin_id,
    )

    db.add(item)

    db.commit()

    db.refresh(item)

    return item


# =========================================================
# GET ONE BY ID
# =========================================================

def get_circular_notice_by_id(
    db: Session,
    circular_notice_id: int,
) -> CircularNotice | None:

    statement = (
        select(CircularNotice)
        .where(
            CircularNotice.id
            == circular_notice_id
        )
    )

    return db.scalar(statement)


# =========================================================
# ADMIN LIST
#
# Supports:
#
# pagination
# search
# type filter
# published filter
# featured filter
# =========================================================

def list_circular_notices(
    db: Session,
    *,
    page: int = 1,
    limit: int = 20,
    content_type: CircularNoticeType | None = None,
    is_published: bool | None = None,
    is_featured: bool | None = None,
    search: str | None = None,
) -> tuple[
    list[CircularNotice],
    int,
]:

    safe_page = max(
        page,
        1,
    )

    safe_limit = max(
        1,
        min(
            limit,
            100,
        ),
    )

    offset = (
        safe_page - 1
    ) * safe_limit

    # =====================================================
    # FILTERS
    # =====================================================

    filters = []

    # -----------------------------------------------------
    # TYPE FILTER
    # -----------------------------------------------------

    if content_type is not None:

        filters.append(
            CircularNotice.content_type
            == content_type
        )

    # -----------------------------------------------------
    # PUBLISHED FILTER
    # -----------------------------------------------------

    if is_published is not None:

        filters.append(
            CircularNotice.is_published
            == is_published
        )

    # -----------------------------------------------------
    # FEATURED FILTER
    # -----------------------------------------------------

    if is_featured is not None:

        filters.append(
            CircularNotice.is_featured
            == is_featured
        )

    # -----------------------------------------------------
    # SEARCH
    # -----------------------------------------------------

    if search:

        cleaned_search = (
            search.strip()
        )

        if cleaned_search:

            search_pattern = (
                f"%{cleaned_search}%"
            )

            filters.append(
                or_(
                    CircularNotice.title.ilike(
                        search_pattern
                    ),
                    CircularNotice.description.ilike(
                        search_pattern
                    ),
                )
            )

    # =====================================================
    # LIST QUERY
    # =====================================================

    statement = (
        select(CircularNotice)
    )

    if filters:

        statement = statement.where(
            *filters
        )

    statement = (
        statement
        .order_by(
            CircularNotice.is_featured.desc(),
            CircularNotice.notice_date.desc(),
            CircularNotice.created_at.desc(),
        )
        .offset(offset)
        .limit(safe_limit)
    )

    items = list(
        db.scalars(
            statement
        ).all()
    )

    # =====================================================
    # TOTAL QUERY
    # =====================================================

    count_statement = (
        select(
            func.count(
                CircularNotice.id
            )
        )
    )

    if filters:

        count_statement = (
            count_statement.where(
                *filters
            )
        )

    total = (
        db.scalar(
            count_statement
        )
        or 0
    )

    return (
        items,
        total,
    )


# =========================================================
# UPDATE
# =========================================================

def update_circular_notice(
    db: Session,
    *,
    item: CircularNotice,
    payload: CircularNoticeUpdate,
) -> CircularNotice:

    update_data = (
        payload.model_dump(
            exclude_unset=True
        )
    )

    # =====================================================
    # REQUIRED FIELDS CANNOT BECOME NULL
    # =====================================================

    required_fields = {
        "content_type",
        "title",
        "description",
        "notice_date",
        "is_published",
        "is_featured",
    }

    for field_name in required_fields:

        if (
            field_name in update_data
            and
            update_data[field_name]
            is None
        ):

            raise ValueError(
                f"{field_name} cannot be null."
            )

    # =====================================================
    # CLEAN TITLE
    # =====================================================

    if "title" in update_data:

        update_data["title"] = (
            clean_required_text(
                update_data["title"],
                "Title",
            )
        )

    # =====================================================
    # CLEAN DESCRIPTION
    # =====================================================

    if "description" in update_data:

        update_data["description"] = (
            clean_required_text(
                update_data[
                    "description"
                ],
                "Description",
            )
        )

    # =====================================================
    # CLEAN PDF URL
    #
    # None is allowed because admin may remove a PDF
    # from a draft before uploading another one.
    # =====================================================

    if "pdf_url" in update_data:

        pdf_url = update_data[
            "pdf_url"
        ]

        update_data["pdf_url"] = (
            pdf_url.strip()
            if pdf_url
            else None
        )

    # =====================================================
    # SINGLE FEATURED ITEM
    # =====================================================

    if (
        update_data.get(
            "is_featured"
        )
        is True
    ):

        clear_previous_featured(
            db,
            exclude_id=item.id,
        )

    # =====================================================
    # APPLY CHANGES
    # =====================================================

    for (
        field_name,
        value,
    ) in update_data.items():

        setattr(
            item,
            field_name,
            value,
        )

    db.add(item)

    db.commit()

    db.refresh(item)

    return item


# =========================================================
# DELETE
# =========================================================

def delete_circular_notice(
    db: Session,
    *,
    item: CircularNotice,
) -> None:

    db.delete(item)

    db.commit()

# =========================================================
# PUBLIC NOTICE BOARD
#
# Frontend design:
#
# LEFT
# -> one featured published item
#
# RIGHT
# -> latest published Circulars / Notices
# -> featured item excluded
# -> newest notice_date first
# =========================================================

def get_public_notice_board(
    db: Session,
    *,
    limit: int = 5,
) -> tuple[
    CircularNotice | None,
    list[CircularNotice],
    int,
]:

    # =====================================================
    # SAFE LIMIT
    #
    # Public Notice Board only needs a small list.
    # Keep the value between 1 and 20.
    # =====================================================

    safe_limit = max(
        1,
        min(
            limit,
            20,
        ),
    )

    # =====================================================
    # FEATURED PUBLISHED ITEM
    #
    # Only published + featured items can appear
    # in the large left-side card.
    #
    # The service already keeps one featured item,
    # but ordering is retained as a safe fallback.
    # =====================================================

    featured_statement = (
        select(CircularNotice)
        .where(
            CircularNotice.is_published.is_(
                True
            ),
            CircularNotice.is_featured.is_(
                True
            ),
        )
        .order_by(
            CircularNotice.notice_date.desc(),
            CircularNotice.created_at.desc(),
        )
        .limit(1)
    )

    featured = db.scalar(
        featured_statement
    )

    # =====================================================
    # RIGHT-SIDE LIST FILTERS
    #
    # Public records only.
    # =====================================================

    list_filters = [
        CircularNotice.is_published.is_(
            True
        )
    ]

    # =====================================================
    # DO NOT REPEAT FEATURED ITEM ON RIGHT
    # =====================================================

    if featured is not None:

        list_filters.append(
            CircularNotice.id
            != featured.id
        )

    # =====================================================
    # LATEST PUBLISHED ITEMS
    #
    # Newest notice_date first.
    # =====================================================

    items_statement = (
        select(CircularNotice)
        .where(
            *list_filters
        )
        .order_by(
            CircularNotice.notice_date.desc(),
            CircularNotice.created_at.desc(),
        )
        .limit(
            safe_limit
        )
    )

    items = list(
        db.scalars(
            items_statement
        ).all()
    )

    # =====================================================
    # TOTAL RIGHT-SIDE ITEMS
    #
    # Total published records after excluding
    # the featured record.
    # =====================================================

    total_statement = (
        select(
            func.count(
                CircularNotice.id
            )
        )
        .where(
            *list_filters
        )
    )

    total = (
        db.scalar(
            total_statement
        )
        or 0
    )

    return (
        featured,
        items,
        total,
    )
