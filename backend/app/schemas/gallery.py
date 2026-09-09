from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


# =========================================================
# GALLERY IMAGE BASE
# =========================================================

class GalleryImageBase(BaseModel):

    image_url: str = Field(
        min_length=1,
        max_length=500,
    )

    alt_text: str = Field(
        min_length=2,
        max_length=255,
    )

    sort_order: int = Field(
        default=1,
        ge=1,
    )

    is_homepage: bool = False

    homepage_order: int | None = Field(
        default=None,
        ge=1,
        le=6,
    )


# =========================================================
# GALLERY IMAGE CREATE
#
# Used when attaching an uploaded image
# to a Gallery Album.
# =========================================================

class GalleryImageCreate(
    GalleryImageBase
):
    pass


# =========================================================
# GALLERY IMAGE UPDATE
#
# Used for:
#
# - alt text
# - order inside album
# - homepage selection
# - homepage position
# =========================================================

class GalleryImageUpdate(BaseModel):

    alt_text: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    sort_order: int | None = Field(
        default=None,
        ge=1,
    )

    is_homepage: bool | None = None

    homepage_order: int | None = Field(
        default=None,
        ge=1,
        le=6,
    )


# =========================================================
# GALLERY IMAGE RESPONSE
# =========================================================

class GalleryImageResponse(BaseModel):

    id: int

    album_id: int

    image_url: str

    alt_text: str

    sort_order: int

    is_homepage: bool

    homepage_order: int | None

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# GALLERY ALBUM BASE
# =========================================================

class GalleryAlbumBase(BaseModel):

    title: str = Field(
        min_length=2,
        max_length=255,
    )

    category: str = Field(
        min_length=2,
        max_length=120,
    )

    year: int = Field(
        ge=1900,
        le=2100,
    )

    is_published: bool = False


# =========================================================
# GALLERY ALBUM CREATE
# =========================================================

class GalleryAlbumCreate(
    GalleryAlbumBase
):
    pass


# =========================================================
# GALLERY ALBUM UPDATE
# =========================================================

class GalleryAlbumUpdate(BaseModel):

    title: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    category: str | None = Field(
        default=None,
        min_length=2,
        max_length=120,
    )

    year: int | None = Field(
        default=None,
        ge=1900,
        le=2100,
    )

    is_published: bool | None = None


# =========================================================
# SINGLE ADMIN ALBUM RESPONSE
#
# Includes all images belonging to the album.
# =========================================================

class GalleryAlbumResponse(BaseModel):

    id: int

    title: str

    category: str

    year: int

    is_published: bool

    created_by_id: int | None

    created_at: datetime

    updated_at: datetime

    images: list[
        GalleryImageResponse
    ] = Field(
        default_factory=list
    )

    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# ADMIN ALBUM LIST RESPONSE
# =========================================================

class GalleryAlbumListResponse(BaseModel):

    items: list[
        GalleryAlbumResponse
    ]

    total: int

    page: int

    limit: int


# =========================================================
# PUBLIC GALLERY IMAGE
#
# Public website doesn't need:
#
# created_at
# updated_at
# is_homepage
#
# for the main /gallery page.
# =========================================================

class PublicGalleryImage(BaseModel):

    id: int

    image_url: str

    alt_text: str

    sort_order: int

    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# PUBLIC GALLERY ALBUM
#
# Matches your existing frontend structure:
#
# album
# ├── id
# ├── year
# ├── title
# ├── category
# └── images[]
# =========================================================

class PublicGalleryAlbum(BaseModel):

    id: int

    year: int

    title: str

    category: str

    images: list[
        PublicGalleryImage
    ] = Field(
        default_factory=list
    )

    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# PUBLIC GALLERY PAGE RESPONSE
# =========================================================

class PublicGalleryAlbumListResponse(BaseModel):

    items: list[
        PublicGalleryAlbum
    ]

    total: int


# =========================================================
# PUBLIC HOMEPAGE GALLERY IMAGE
#
# Used by:
#
# Homepage -> Life at Rosary
#
# homepage_order controls exact collage position:
#
# 1 -> large left top
# 2 -> small left bottom
# 3 -> small left bottom
# 4 -> small right top
# 5 -> small right top
# 6 -> large right bottom
# =========================================================

class PublicHomepageGalleryImage(BaseModel):

    id: int

    image_url: str

    alt_text: str

    homepage_order: int

    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# PUBLIC HOMEPAGE RESPONSE
# =========================================================

class PublicHomepageGalleryResponse(
    BaseModel
):

    items: list[
        PublicHomepageGalleryImage
    ]

    total: int