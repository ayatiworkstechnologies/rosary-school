from datetime import datetime

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from app.db.base import Base


class Download(Base):
    __tablename__ = "downloads"

    # =====================================================
    # PRIMARY KEY
    # =====================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    # =====================================================
    # CONTENT
    # =====================================================

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # =====================================================
    # ICON
    #
    # icon_type:
    #   lucide
    #   image
    #
    # lucide:
    #   icon_key = "clock"
    #   icon_url = NULL
    #
    # image:
    #   icon_key = NULL
    #   icon_url = "/uploads/downloads/icons/..."
    # =====================================================

    icon_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="lucide",
        server_default="lucide",
        index=True,
    )

    icon_key: Mapped[str | None] = mapped_column(
        String(80),
        nullable=True,
    )

    icon_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    # =====================================================
    # PDF
    # =====================================================

    file_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    original_file_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    file_size_bytes: Mapped[int | None] = mapped_column(
        BigInteger,
        nullable=True,
    )

    # =====================================================
    # DISPLAY
    # =====================================================

    display_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
        server_default="1",
        index=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="1",
        index=True,
    )

    # =====================================================
    # ADMIN
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