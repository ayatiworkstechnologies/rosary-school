import enum

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum,
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


# =========================================================
# CONTENT TYPE
# =========================================================

class CircularNoticeType(
    str,
    enum.Enum,
):

    CIRCULAR = "CIRCULAR"

    NOTICE = "NOTICE"


# =========================================================
# CIRCULAR / NOTICE MODEL
# =========================================================

class CircularNotice(Base):

    __tablename__ = (
        "circular_notices"
    )


    # =====================================================
    # PRIMARY KEY
    # =====================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )


    # =====================================================
    # TYPE
    #
    # CIRCULAR
    # NOTICE
    # =====================================================

    content_type: Mapped[
        CircularNoticeType
    ] = mapped_column(
        Enum(
            CircularNoticeType,
            name="circular_notice_type",
        ),
        nullable=False,
        index=True,
    )


    # =====================================================
    # TITLE
    # =====================================================

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )


    # =====================================================
    # DESCRIPTION
    # =====================================================

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )


    # =====================================================
    # DISPLAY DATE
    #
    # Example:
    # 12 AUG 2026
    # =====================================================

    notice_date: Mapped[
        object
    ] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )


    # =====================================================
    # PDF URL
    #
    # Example:
    # /uploads/circulars/example.pdf
    # =====================================================

    pdf_url: Mapped[
        str | None
    ] = mapped_column(
        String(500),
        nullable=True,
    )


    # =====================================================
    # PUBLISHED
    #
    # False = Admin only
    # True  = Public website
    # =====================================================

    is_published: Mapped[
        bool
    ] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        index=True,
    )


    # =====================================================
    # FEATURED
    #
    # True = Large highlighted card
    # =====================================================

    is_featured: Mapped[
        bool
    ] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
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
    )


    # =====================================================
    # CREATED DATE
    # =====================================================

    created_at: Mapped[
        object
    ] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )


    # =====================================================
    # UPDATED DATE
    # =====================================================

    updated_at: Mapped[
        object
    ] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )