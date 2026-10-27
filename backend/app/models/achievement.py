import enum
from datetime import date, datetime

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum as SQLEnum,
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


class AchievementType(str, enum.Enum):
    PHOTO = "PHOTO"
    VIDEO = "VIDEO"


class VideoSource(str, enum.Enum):
    YOUTUBE = "youtube"
    UPLOADED = "uploaded"


class Achievement(Base):
    """A photo or video achievement displayed in the public gallery."""

    __tablename__ = "achievements"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    achievement_type: Mapped[AchievementType] = mapped_column(
        SQLEnum(
            AchievementType,
            name="achievement_type",
            native_enum=False,
            validate_strings=True,
        ),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    category: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
        index=True,
    )

    achievement_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    year: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        index=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="1",
        index=True,
    )

    display_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
        server_default="1",
        index=True,
    )

    poster_image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    video_source: Mapped[VideoSource | None] = mapped_column(
        SQLEnum(
            VideoSource,
            name="achievement_video_source",
            native_enum=False,
            validate_strings=True,
        ),
        nullable=True,
    )

    youtube_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    video_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    created_by_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "admins.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    images: Mapped[list["AchievementImage"]] = relationship(
        back_populates="achievement",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="AchievementImage.display_order",
    )


class AchievementImage(Base):
    """An ordered image belonging to a photo achievement."""

    __tablename__ = "achievement_images"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    achievement_id: Mapped[int] = mapped_column(
        ForeignKey(
            "achievements.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    image_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    alt_text: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    display_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
        server_default="1",
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    achievement: Mapped["Achievement"] = relationship(
        back_populates="images",
    )
