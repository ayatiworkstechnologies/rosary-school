from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
    func,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.db.base import Base


# =========================================================
# FACULTY CATEGORY
# =========================================================

class FacultyCategory(Base):
    __tablename__ = "faculty_categories"

    __table_args__ = (
        UniqueConstraint(
            "name",
            name="uq_faculty_categories_name",
        ),
        UniqueConstraint(
            "slug",
            name="uq_faculty_categories_slug",
        ),
    )


    # -----------------------------------------------------
    # PRIMARY KEY
    # -----------------------------------------------------

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )


    # -----------------------------------------------------
    # CATEGORY INFORMATION
    # -----------------------------------------------------

    name: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
        index=True,
    )

    slug: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )


    # -----------------------------------------------------
    # DISPLAY SETTINGS
    # -----------------------------------------------------

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


    # -----------------------------------------------------
    # TIMESTAMPS
    # -----------------------------------------------------

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


    # -----------------------------------------------------
    # RELATIONSHIP
    # -----------------------------------------------------

    members: Mapped[
        list["FacultyMember"]
    ] = relationship(
        back_populates="category",
        passive_deletes=True,
        order_by="FacultyMember.display_order",
    )


# =========================================================
# FACULTY MEMBER
# =========================================================

class FacultyMember(Base):
    __tablename__ = "faculty_members"


    # -----------------------------------------------------
    # PRIMARY KEY
    # -----------------------------------------------------

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )


    # -----------------------------------------------------
    # BASIC INFORMATION
    # -----------------------------------------------------

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    designation: Mapped[str] = mapped_column(
        String(180),
        nullable=False,
    )

    subject: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
        index=True,
    )


    # -----------------------------------------------------
    # EXPERIENCE
    #
    # Store numeric value only.
    #
    # Database:
    # 12
    #
    # Frontend:
    # "12 Years Exp"
    # -----------------------------------------------------

    experience_years: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        server_default="0",
    )


    # -----------------------------------------------------
    # CATEGORY
    # -----------------------------------------------------

    category_id: Mapped[int] = mapped_column(
        ForeignKey(
            "faculty_categories.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )


    # -----------------------------------------------------
    # IMAGE
    # -----------------------------------------------------

    image_url: Mapped[
        str | None
    ] = mapped_column(
        String(500),
        nullable=True,
    )


    # -----------------------------------------------------
    # DISPLAY SETTINGS
    # -----------------------------------------------------

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


    # -----------------------------------------------------
    # CREATED BY ADMIN
    # -----------------------------------------------------

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


    # -----------------------------------------------------
    # TIMESTAMPS
    # -----------------------------------------------------

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


    # -----------------------------------------------------
    # RELATIONSHIP
    # -----------------------------------------------------

    category: Mapped[
        "FacultyCategory"
    ] = relationship(
        back_populates="members",
    )