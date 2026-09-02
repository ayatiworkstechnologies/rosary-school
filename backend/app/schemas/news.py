from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
)

from app.models.news import NewsContentType


# =========================================================
# SHARED NEWS FIELDS
# =========================================================

class NewsBase(BaseModel):
    content_type: NewsContentType

    label: str | None = Field(
        default=None,
        max_length=100,
    )

    title: str = Field(
        min_length=3,
        max_length=255,
    )

    short_description: str = Field(
        min_length=3,
        max_length=500,
    )

    content: str = Field(
        min_length=3,
    )

    image_url: str | None = Field(
        default=None,
        max_length=500,
    )

    published_at: datetime | None = None

    is_published: bool = False

    is_featured: bool = False


    # =====================================================
    # CLEAN STRING INPUT
    # =====================================================

    @field_validator(
        "label",
        "title",
        "short_description",
        "content",
        "image_url",
        mode="before",
    )
    @classmethod
    def strip_strings(
        cls,
        value,
    ):
        if isinstance(value, str):
            value = value.strip()

            if value == "":
                return None

        return value


# =========================================================
# CREATE NEWS / ANNOUNCEMENT
# =========================================================

class NewsCreate(NewsBase):
    """
    Used when the admin creates a new
    News or Announcement item.
    """

    pass


# =========================================================
# UPDATE NEWS / ANNOUNCEMENT
# =========================================================

class NewsUpdate(BaseModel):
    """
    All fields are optional because PATCH
    updates only the supplied values.
    """

    content_type: NewsContentType | None = None

    label: str | None = Field(
        default=None,
        max_length=100,
    )

    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=255,
    )

    short_description: str | None = Field(
        default=None,
        min_length=3,
        max_length=500,
    )

    content: str | None = Field(
        default=None,
        min_length=3,
    )

    image_url: str | None = Field(
        default=None,
        max_length=500,
    )

    published_at: datetime | None = None

    is_published: bool | None = None

    is_featured: bool | None = None


    @field_validator(
        "label",
        "title",
        "short_description",
        "content",
        "image_url",
        mode="before",
    )
    @classmethod
    def strip_strings(
        cls,
        value,
    ):
        if isinstance(value, str):
            value = value.strip()

        return value


# =========================================================
# NEWS RESPONSE
# =========================================================

class NewsResponse(BaseModel):
    id: int

    content_type: NewsContentType

    label: str | None

    title: str

    slug: str

    short_description: str

    content: str

    image_url: str | None

    published_at: datetime | None

    is_published: bool

    is_featured: bool

    created_by_id: int | None

    created_at: datetime

    updated_at: datetime


    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# NEWS LIST RESPONSE
# =========================================================

class NewsListResponse(BaseModel):
    items: list[NewsResponse]

    total: int

    page: int

    limit: int

# =========================================================
# PUBLIC NEWS LIST ITEM
# =========================================================

class PublicNewsListItem(BaseModel):
    id: int

    content_type: NewsContentType

    label: str | None

    title: str

    slug: str

    short_description: str

    image_url: str | None

    published_at: datetime | None

    is_featured: bool

    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# PUBLIC NEWS LIST RESPONSE
# =========================================================

class PublicNewsListResponse(BaseModel):
    items: list[PublicNewsListItem]

    total: int

    page: int

    limit: int


# =========================================================
# PUBLIC NEWS DETAIL RESPONSE
# =========================================================

class PublicNewsDetailResponse(BaseModel):
    id: int

    content_type: NewsContentType

    label: str | None

    title: str

    slug: str

    short_description: str

    content: str

    image_url: str | None

    published_at: datetime | None

    is_featured: bool

    model_config = ConfigDict(
        from_attributes=True
    )