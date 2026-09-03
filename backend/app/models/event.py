from datetime import date, datetime, time

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    Time,
    func,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from app.db.base import Base


# =========================================================
# EVENT MODEL
# =========================================================

class Event(Base):
    __tablename__ = "events"


    # =====================================================
    # PRIMARY KEY
    # =====================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )


    # =====================================================
    # EVENT INFORMATION
    # =====================================================

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )


    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )


    venue: Mapped[str] = mapped_column(
        String(190),
        nullable=False,
    )


    # =====================================================
    # EVENT DATE
    # =====================================================

    event_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )


    # =====================================================
    # EVENT TIME
    # =====================================================

    start_time: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )


    end_time: Mapped[time | None] = mapped_column(
        Time,
        nullable=True,
    )


    # =====================================================
    # PUBLISHING
    # =====================================================

    is_published: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="0",
        index=True,
    )


    # =====================================================
    # ADMIN WHO CREATED EVENT
    # =====================================================

    created_by_id: Mapped[int | None] = mapped_column(
        Integer,
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