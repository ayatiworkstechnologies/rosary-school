from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    func,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.db.base import Base


# =========================================================
# GALLERY ALBUM
# =========================================================

class GalleryAlbum(Base):

    __tablename__ = "gallery_albums"


    # =====================================================
    # PRIMARY KEY
    # =====================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )


    # =====================================================
    # ALBUM TITLE
    #
    # Example:
    # Annual Cultural Celebration
    # =====================================================

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )


    # =====================================================
    # CATEGORY
    #
    # Example:
    # Campus
    # Faculty
    # Celebration
    # Achievements
    # Academics
    #
    # We keep this as string instead of enum so admin
    # can use new categories later without DB migration.
    # =====================================================

    category: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
        index=True,
    )


    # =====================================================
    # YEAR
    #
    # Used by your Gallery page Year selector.
    #
    # Example:
    # 2026
    # 2025
    # =====================================================

    year: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        index=True,
    )


    # =====================================================
    # PUBLISHED
    #
    # False
    # -> Admin only
    #
    # True
    # -> Public Gallery page
    # =====================================================

    is_published: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="0",
        index=True,
    )


    # =====================================================
    # CREATED BY ADMIN
    # =====================================================

    created_by_id: Mapped[
        int | None
    ] = mapped_column(
        ForeignKey(
            "admins.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )


    # =====================================================
    # CREATED / UPDATED
    # =====================================================

    created_at: Mapped[
        datetime
    ] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )


    updated_at: Mapped[
        datetime
    ] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )


    # =====================================================
    # ALBUM IMAGES
    #
    # One Album
    #     ↓
    # Many GalleryImage records
    #
    # delete-orphan means:
    #
    # Delete album
    #     ↓
    # Its images are also removed from DB
    # =====================================================

    images: Mapped[
        list["GalleryImage"]
    ] = relationship(
        back_populates="album",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="GalleryImage.sort_order",
    )


# =========================================================
# GALLERY IMAGE
# =========================================================

class GalleryImage(Base):

    __tablename__ = "gallery_images"


    # =====================================================
    # PRIMARY KEY
    # =====================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )


    # =====================================================
    # ALBUM RELATIONSHIP
    # =====================================================

    album_id: Mapped[int] = mapped_column(
        ForeignKey(
            "gallery_albums.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )


    # =====================================================
    # IMAGE URL
    #
    # Example:
    #
    # /uploads/gallery/abc123.webp
    # =====================================================

    image_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )


    # =====================================================
    # ALT TEXT
    #
    # Important for accessibility and Next/Image.
    #
    # Example:
    # Students performing during Annual Cultural Celebration
    # =====================================================

    alt_text: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )


    # =====================================================
    # IMAGE ORDER INSIDE ALBUM
    #
    # 1
    # 2
    # 3
    #
    # First image becomes the first visible album image.
    # =====================================================

    sort_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
        server_default="1",
        index=True,
    )


    # =====================================================
    # HOMEPAGE IMAGE
    #
    # True means:
    # this image can appear in
    # "Life at Rosary"
    # =====================================================

    is_homepage: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="0",
        index=True,
    )


    # =====================================================
    # HOMEPAGE ORDER
    #
    # Your homepage needs exactly 6 collage positions.
    #
    # Example:
    #
    # homepage_order = 1
    # homepage_order = 2
    # ...
    # homepage_order = 6
    #
    # None means:
    # not assigned a homepage position.
    # =====================================================

    homepage_order: Mapped[
        int | None
    ] = mapped_column(
        Integer,
        nullable=True,
        index=True,
    )


    # =====================================================
    # CREATED / UPDATED
    # =====================================================

    created_at: Mapped[
        datetime
    ] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )


    updated_at: Mapped[
        datetime
    ] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )


    # =====================================================
    # RELATIONSHIP BACK TO ALBUM
    # =====================================================

    album: Mapped[
        "GalleryAlbum"
    ] = relationship(
        back_populates="images"
    )