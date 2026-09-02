import enum

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum as SQLEnum,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


# =========================================================
# NEWS CONTENT TYPE
# =========================================================

class NewsContentType(str, enum.Enum):
    NEWS = "NEWS"
    ANNOUNCEMENT = "ANNOUNCEMENT"


# =========================================================
# NEWS ITEM MODEL
# =========================================================

class NewsItem(Base):
    __tablename__ = "news_items"

    # =====================================================
    # PRIMARY KEY
    # =====================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    # =====================================================
    # CONTENT TYPE
    # =====================================================

    content_type: Mapped[NewsContentType] = mapped_column(
        SQLEnum(
            NewsContentType,
            name="news_content_type",
            native_enum=False,
            validate_strings=True,
        ),
        nullable=False,
        index=True,
    )

    # =====================================================
    # CARD LABEL
    # =====================================================

    label: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    # =====================================================
    # TITLE
    # =====================================================

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    # =====================================================
    # URL SLUG
    # =====================================================

    slug: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
        index=True,
    )

    # =====================================================
    # CARD DESCRIPTION
    # =====================================================

    short_description: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    # =====================================================
    # FULL NEWS / ANNOUNCEMENT CONTENT
    # =====================================================

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # =====================================================
    # FEATURE IMAGE
    # =====================================================

    image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    # =====================================================
    # PUBLISHING
    # =====================================================

    published_at: Mapped[DateTime | None] = mapped_column(
        DateTime,
        nullable=True,
        index=True,
    )

    is_published: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="0",
        index=True,
    )

    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="0",
    )

    # =====================================================
    # ADMIN WHO CREATED ITEM
    # =====================================================

    created_by_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "admins.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    # =====================================================
    # TIMESTAMPS
    # =====================================================

    created_at: Mapped[DateTime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[DateTime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )