from datetime import (
    date,
    datetime,
)

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)

from app.models.circular_notice import (
    CircularNoticeType,
)


# =========================================================
# BASE SCHEMA
# =========================================================

class CircularNoticeBase(BaseModel):

    content_type: CircularNoticeType

    title: str = Field(
        min_length=2,
        max_length=255,
    )

    description: str = Field(
        min_length=2,
    )

    notice_date: date

    pdf_url: str | None = Field(
        default=None,
        max_length=500,
    )

    is_published: bool = False

    is_featured: bool = False


# =========================================================
# CREATE SCHEMA
#
# Used for:
#
# POST /api/v1/admin/circular-notices
# =========================================================

class CircularNoticeCreate(
    CircularNoticeBase
):
    pass


# =========================================================
# UPDATE SCHEMA
#
# Used for:
#
# PATCH /api/v1/admin/circular-notices/{id}
#
# Every field is optional because PATCH only updates
# the fields sent by the frontend.
# =========================================================

class CircularNoticeUpdate(
    BaseModel
):

    content_type: (
        CircularNoticeType
        | None
    ) = None

    title: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    description: str | None = Field(
        default=None,
        min_length=2,
    )

    notice_date: date | None = None

    pdf_url: str | None = Field(
        default=None,
        max_length=500,
    )

    is_published: bool | None = None

    is_featured: bool | None = None


# =========================================================
# SINGLE ADMIN RESPONSE
#
# Used for:
#
# GET /api/v1/admin/circular-notices/{id}
# POST
# PATCH
# =========================================================

class CircularNoticeResponse(
    BaseModel
):

    id: int

    content_type: CircularNoticeType

    title: str

    description: str

    notice_date: date

    pdf_url: str | None

    is_published: bool

    is_featured: bool

    created_by_id: int | None

    created_at: datetime

    updated_at: datetime


    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# ADMIN LIST RESPONSE
#
# Used for:
#
# GET /api/v1/admin/circular-notices
# =========================================================

class CircularNoticeListResponse(
    BaseModel
):

    items: list[
        CircularNoticeResponse
    ]

    total: int

    page: int

    limit: int


# =========================================================
# PUBLIC CIRCULAR / NOTICE ITEM
#
# Public website only needs:
#
# id
# content_type
# title
# description
# notice_date
# pdf_url
# is_featured
#
# We intentionally do NOT expose:
#
# created_by_id
# created_at
# updated_at
# is_published
# =========================================================

class PublicCircularNoticeItem(
    BaseModel
):

    id: int

    content_type: CircularNoticeType

    title: str

    description: str

    notice_date: date

    pdf_url: str | None

    is_featured: bool


    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# PUBLIC NOTICE BOARD RESPONSE
#
# Frontend design:
#
# LEFT:
#
# featured
# -> large highlighted card
#
#
# RIGHT:
#
# items
# -> latest published Circulars / Notices
#
#
# Example:
#
# {
#   "featured": {...},
#   "items": [...],
#   "total": 4,
#   "limit": 5
# }
# =========================================================

class PublicCircularNoticeListResponse(
    BaseModel
):

    featured: (
        PublicCircularNoticeItem
        | None
    )

    items: list[
        PublicCircularNoticeItem
    ]

    total: int

    limit: int