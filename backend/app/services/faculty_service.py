import re
import unicodedata

from pathlib import Path

from sqlalchemy import (
    func,
    or_,
    select,
    update,
)

from sqlalchemy.orm import (
    Session,
    selectinload,
)

from app.models.faculty import (
    FacultyCategory,
    FacultyMember,
)

from app.schemas.faculty import (
    FacultyCategoryCreate,
    FacultyCategoryUpdate,
    FacultyMemberCreate,
    FacultyMemberUpdate,
)


# =========================================================
# FILE PATH CONFIG
# =========================================================

# faculty_service.py
#
# backend/app/services/faculty_service.py
#
# parents[0] -> services
# parents[1] -> app
# parents[2] -> backend

BACKEND_ROOT = (
    Path(__file__)
    .resolve()
    .parents[2]
)

FACULTY_UPLOAD_DIR = (
    BACKEND_ROOT
    / "uploads"
    / "faculty"
)

FACULTY_UPLOAD_PREFIX = (
    "/uploads/faculty/"
)


# =========================================================
# TEXT HELPERS
# =========================================================

def clean_required_text(
    value: str,
    field_name: str,
) -> str:

    cleaned = (
        value
        .strip()
    )

    if not cleaned:

        raise ValueError(
            f"{field_name} is required."
        )

    return cleaned


# =========================================================
# SLUG HELPER
#
# Example:
#
# Higher Secondary
# ->
# higher-secondary
# =========================================================

def create_slug(
    value: str,
) -> str:

    normalized = (
        unicodedata.normalize(
            "NFKD",
            value,
        )
        .encode(
            "ascii",
            "ignore",
        )
        .decode(
            "ascii"
        )
    )

    slug = (
        normalized
        .lower()
        .strip()
    )

    slug = re.sub(
        r"[^a-z0-9]+",
        "-",
        slug,
    )

    slug = (
        slug
        .strip("-")
    )

    if not slug:

        raise ValueError(
            "Unable to generate a valid category slug."
        )

    return slug


# =========================================================
# SAFE FACULTY IMAGE DELETE
# =========================================================

def delete_faculty_file(
    image_url: str | None,
) -> None:

    if not image_url:

        return


    if not image_url.startswith(
        FACULTY_UPLOAD_PREFIX
    ):

        # Never delete anything outside
        # our Faculty upload directory.
        return


    relative_path = (
        image_url
        .removeprefix(
            "/uploads/"
        )
    )


    file_path = (
        BACKEND_ROOT
        / "uploads"
        / relative_path
    ).resolve()


    safe_root = (
        FACULTY_UPLOAD_DIR
        .resolve()
    )


    try:

        file_path.relative_to(
            safe_root
        )

    except ValueError:

        return


    try:

        if (
            file_path.exists()
            and
            file_path.is_file()
        ):

            file_path.unlink()

    except OSError:

        # File cleanup failure should not
        # break database operations.
        pass


# =========================================================
# CATEGORY HELPERS
# =========================================================

def get_faculty_category_by_id(
    db: Session,
    category_id: int,
) -> FacultyCategory | None:

    statement = (
        select(
            FacultyCategory
        )
        .where(
            FacultyCategory.id
            ==
            category_id
        )
    )

    return (
        db.scalar(
            statement
        )
    )


def get_faculty_category_by_slug(
    db: Session,
    slug: str,
) -> FacultyCategory | None:

    statement = (
        select(
            FacultyCategory
        )
        .where(
            FacultyCategory.slug
            ==
            slug
        )
    )

    return (
        db.scalar(
            statement
        )
    )


# =========================================================
# CHECK CATEGORY NAME DUPLICATE
# =========================================================

def category_name_exists(
    db: Session,
    name: str,
    *,
    exclude_category_id:
        int | None = None,
) -> bool:

    statement = (
        select(
            FacultyCategory.id
        )
        .where(
            func.lower(
                FacultyCategory.name
            )
            ==
            name.lower()
        )
    )


    if (
        exclude_category_id
        is not None
    ):

        statement = (
            statement.where(
                FacultyCategory.id
                !=
                exclude_category_id
            )
        )


    return (
        db.scalar(
            statement
        )
        is not None
    )


# =========================================================
# CHECK CATEGORY SLUG DUPLICATE
# =========================================================

def category_slug_exists(
    db: Session,
    slug: str,
    *,
    exclude_category_id:
        int | None = None,
) -> bool:

    statement = (
        select(
            FacultyCategory.id
        )
        .where(
            FacultyCategory.slug
            ==
            slug
        )
    )


    if (
        exclude_category_id
        is not None
    ):

        statement = (
            statement.where(
                FacultyCategory.id
                !=
                exclude_category_id
            )
        )


    return (
        db.scalar(
            statement
        )
        is not None
    )


# =========================================================
# CREATE CATEGORY
# =========================================================

def create_faculty_category(
    db: Session,
    payload:
        FacultyCategoryCreate,
) -> FacultyCategory:

    name = clean_required_text(
        payload.name,
        "Category name",
    )

    slug = create_slug(
        name
    )


    # -----------------------------------------------------
    # DUPLICATE NAME
    # -----------------------------------------------------

    if category_name_exists(
        db,
        name,
    ):

        raise ValueError(
            "A Faculty category with this name already exists."
        )


    # -----------------------------------------------------
    # DUPLICATE SLUG
    # -----------------------------------------------------

    if category_slug_exists(
        db,
        slug,
    ):

        raise ValueError(
            "A Faculty category with a similar name already exists."
        )


    category = FacultyCategory(
        name=name,

        slug=slug,

        display_order=
            payload.display_order,

        is_active=
            payload.is_active,
    )


    db.add(
        category
    )

    db.commit()

    db.refresh(
        category
    )


    return category


# =========================================================
# UPDATE CATEGORY
# =========================================================

def update_faculty_category(
    db: Session,
    category:
        FacultyCategory,
    payload:
        FacultyCategoryUpdate,
) -> FacultyCategory:

    data = (
        payload.model_dump(
            exclude_unset=True
        )
    )


    # -----------------------------------------------------
    # CATEGORY NAME
    # -----------------------------------------------------

    if "name" in data:

        name = clean_required_text(
            data["name"],
            "Category name",
        )

        slug = create_slug(
            name
        )


        if category_name_exists(
            db,
            name,
            exclude_category_id=
                category.id,
        ):

            raise ValueError(
                "A Faculty category with this name already exists."
            )


        if category_slug_exists(
            db,
            slug,
            exclude_category_id=
                category.id,
        ):

            raise ValueError(
                "A Faculty category with a similar name already exists."
            )


        category.name = (
            name
        )

        category.slug = (
            slug
        )


    # -----------------------------------------------------
    # DISPLAY ORDER
    # -----------------------------------------------------

    if (
        "display_order"
        in data
    ):

        category.display_order = (
            data[
                "display_order"
            ]
        )


    # -----------------------------------------------------
    # ACTIVE STATUS
    # -----------------------------------------------------

    if (
        "is_active"
        in data
    ):

        category.is_active = (
            data[
                "is_active"
            ]
        )


    db.commit()

    db.refresh(
        category
    )


    return category


# =========================================================
# LIST ADMIN CATEGORIES
# =========================================================

def list_faculty_categories(
    db: Session,
    *,
    search:
        str | None = None,
    is_active:
        bool | None = None,
) -> tuple[
    list[FacultyCategory],
    int,
]:

    filters = []


    # -----------------------------------------------------
    # SEARCH
    # -----------------------------------------------------

    if search:

        cleaned_search = (
            search.strip()
        )

        if cleaned_search:

            filters.append(
                FacultyCategory.name.ilike(
                    f"%{cleaned_search}%"
                )
            )


    # -----------------------------------------------------
    # STATUS
    # -----------------------------------------------------

    if (
        is_active
        is not None
    ):

        filters.append(
            FacultyCategory.is_active
            .is_(
                is_active
            )
        )


    statement = (
        select(
            FacultyCategory
        )
        .where(
            *filters
        )
        .order_by(
            FacultyCategory.display_order
            .asc(),

            FacultyCategory.name
            .asc(),

            FacultyCategory.id
            .asc(),
        )
    )


    items = list(
        db.scalars(
            statement
        ).all()
    )


    total_statement = (
        select(
            func.count(
                FacultyCategory.id
            )
        )
        .where(
            *filters
        )
    )


    total = (
        db.scalar(
            total_statement
        )
        or 0
    )


    return (
        items,
        total,
    )


# =========================================================
# DELETE CATEGORY
# =========================================================

def delete_faculty_category(
    db: Session,
    category:
        FacultyCategory,
) -> None:

    # -----------------------------------------------------
    # CHECK MEMBER USAGE
    # -----------------------------------------------------

    count_statement = (
        select(
            func.count(
                FacultyMember.id
            )
        )
        .where(
            FacultyMember.category_id
            ==
            category.id
        )
    )


    member_count = (
        db.scalar(
            count_statement
        )
        or 0
    )


    if (
        member_count > 0
    ):

        raise ValueError(
            (
                "This Faculty category cannot be deleted "
                f"because {member_count} Faculty member"
                f"{'' if member_count == 1 else 's'} "
                "are using it. Move or delete those members first."
            )
        )


    db.delete(
        category
    )

    db.commit()


# =========================================================
# FACULTY MEMBER HELPERS
# =========================================================

def get_faculty_member_by_id(
    db: Session,
    member_id: int,
) -> FacultyMember | None:

    statement = (
        select(
            FacultyMember
        )
        .options(
            selectinload(
                FacultyMember.category
            )
        )
        .where(
            FacultyMember.id
            ==
            member_id
        )
    )


    return (
        db.scalar(
            statement
        )
    )


# =========================================================
# VALIDATE CATEGORY
# =========================================================

def require_faculty_category(
    db: Session,
    category_id: int,
) -> FacultyCategory:

    category = (
        get_faculty_category_by_id(
            db,
            category_id,
        )
    )


    if (
        category is None
    ):

        raise ValueError(
            "Selected Faculty category does not exist."
        )


    return category


# =========================================================
# CREATE FACULTY MEMBER
# =========================================================

def create_faculty_member(
    db: Session,
    payload:
        FacultyMemberCreate,
    *,
    created_by_id:
        int | None = None,
) -> FacultyMember:

    # -----------------------------------------------------
    # VALIDATE CATEGORY
    # -----------------------------------------------------

    require_faculty_category(
        db,
        payload.category_id,
    )


    # -----------------------------------------------------
    # CLEAN TEXT
    # -----------------------------------------------------

    name = clean_required_text(
        payload.name,
        "Faculty name",
    )

    designation = clean_required_text(
        payload.designation,
        "Designation",
    )

    subject = clean_required_text(
        payload.subject,
        "Subject",
    )


    image_url = (
        payload.image_url.strip()
        if payload.image_url
        else None
    )


    member = FacultyMember(
        name=name,

        designation=
            designation,

        subject=
            subject,

        experience_years=
            payload.experience_years,

        category_id=
            payload.category_id,

        image_url=
            image_url,

        display_order=
            payload.display_order,

        is_active=
            payload.is_active,

        created_by_id=
            created_by_id,
    )


    db.add(
        member
    )

    db.commit()

    db.refresh(
        member
    )


    # Reload relationship for response.
    loaded_member = (
        get_faculty_member_by_id(
            db,
            member.id,
        )
    )


    if loaded_member is None:

        raise ValueError(
            "Unable to reload the created Faculty member."
        )


    return loaded_member


# =========================================================
# UPDATE FACULTY MEMBER
# =========================================================

def update_faculty_member(
    db: Session,
    member:
        FacultyMember,
    payload:
        FacultyMemberUpdate,
) -> FacultyMember:

    data = (
        payload.model_dump(
            exclude_unset=True
        )
    )


    old_image_url = (
        member.image_url
    )


    # -----------------------------------------------------
    # NAME
    # -----------------------------------------------------

    if "name" in data:

        member.name = (
            clean_required_text(
                data["name"],
                "Faculty name",
            )
        )


    # -----------------------------------------------------
    # DESIGNATION
    # -----------------------------------------------------

    if (
        "designation"
        in data
    ):

        member.designation = (
            clean_required_text(
                data[
                    "designation"
                ],
                "Designation",
            )
        )


    # -----------------------------------------------------
    # SUBJECT
    # -----------------------------------------------------

    if (
        "subject"
        in data
    ):

        member.subject = (
            clean_required_text(
                data["subject"],
                "Subject",
            )
        )


    # -----------------------------------------------------
    # EXPERIENCE
    # -----------------------------------------------------

    if (
        "experience_years"
        in data
    ):

        member.experience_years = (
            data[
                "experience_years"
            ]
        )


    # -----------------------------------------------------
    # CATEGORY
    # -----------------------------------------------------

    if (
        "category_id"
        in data
    ):

        require_faculty_category(
            db,
            data[
                "category_id"
            ],
        )

        member.category_id = (
            data[
                "category_id"
            ]
        )


    # -----------------------------------------------------
    # IMAGE
    #
    # Supports:
    #
    # new URL
    # or
    # null to remove photo
    # -----------------------------------------------------

    if (
        "image_url"
        in data
    ):

        new_image_url = (
            data[
                "image_url"
            ]
        )


        if new_image_url:

            new_image_url = (
                new_image_url
                .strip()
            )


        member.image_url = (
            new_image_url
            or None
        )


    # -----------------------------------------------------
    # DISPLAY ORDER
    # -----------------------------------------------------

    if (
        "display_order"
        in data
    ):

        member.display_order = (
            data[
                "display_order"
            ]
        )


    # -----------------------------------------------------
    # ACTIVE
    # -----------------------------------------------------

    if (
        "is_active"
        in data
    ):

        member.is_active = (
            data[
                "is_active"
            ]
        )


    db.commit()

    db.refresh(
        member
    )


    # -----------------------------------------------------
    # REMOVE OLD IMAGE
    #
    # Only when image URL really changed.
    # -----------------------------------------------------

    if (
        "image_url"
        in data
        and
        old_image_url
        and
        old_image_url
        !=
        member.image_url
    ):

        delete_faculty_file(
            old_image_url
        )


    updated_member = (
        get_faculty_member_by_id(
            db,
            member.id,
        )
    )


    if updated_member is None:

        raise ValueError(
            "Unable to reload the updated Faculty member."
        )


    return updated_member


# =========================================================
# ADMIN FACULTY LIST
# =========================================================

def list_faculty_members(
    db: Session,
    *,
    page: int = 1,
    limit: int = 20,
    search:
        str | None = None,
    category_id:
        int | None = None,
    subject:
        str | None = None,
    is_active:
        bool | None = None,
) -> tuple[
    list[FacultyMember],
    int,
]:

    filters = []


    # -----------------------------------------------------
    # SEARCH
    #
    # Searches:
    # name
    # designation
    # subject
    # category name
    # -----------------------------------------------------

    if search:

        cleaned_search = (
            search.strip()
        )

        if cleaned_search:

            like_value = (
                f"%{cleaned_search}%"
            )

            filters.append(
                or_(
                    FacultyMember.name
                    .ilike(
                        like_value
                    ),

                    FacultyMember.designation
                    .ilike(
                        like_value
                    ),

                    FacultyMember.subject
                    .ilike(
                        like_value
                    ),

                    FacultyCategory.name
                    .ilike(
                        like_value
                    ),
                )
            )


    # -----------------------------------------------------
    # CATEGORY
    # -----------------------------------------------------

    if (
        category_id
        is not None
    ):

        filters.append(
            FacultyMember.category_id
            ==
            category_id
        )


    # -----------------------------------------------------
    # SUBJECT
    # -----------------------------------------------------

    if subject:

        cleaned_subject = (
            subject.strip()
        )

        if cleaned_subject:

            filters.append(
                FacultyMember.subject
                .ilike(
                    f"%{cleaned_subject}%"
                )
            )


    # -----------------------------------------------------
    # ACTIVE STATUS
    # -----------------------------------------------------

    if (
        is_active
        is not None
    ):

        filters.append(
            FacultyMember.is_active
            .is_(
                is_active
            )
        )


    offset = (
        page - 1
    ) * limit


    statement = (
        select(
            FacultyMember
        )
        .join(
            FacultyMember.category
        )
        .options(
            selectinload(
                FacultyMember.category
            )
        )
        .where(
            *filters
        )
        .order_by(
            FacultyMember.display_order
            .asc(),

            FacultyMember.name
            .asc(),

            FacultyMember.id
            .asc(),
        )
        .offset(
            offset
        )
        .limit(
            limit
        )
    )


    items = list(
        db.scalars(
            statement
        ).all()
    )


    total_statement = (
        select(
            func.count(
                FacultyMember.id
            )
        )
        .join(
            FacultyMember.category
        )
        .where(
            *filters
        )
    )


    total = (
        db.scalar(
            total_statement
        )
        or 0
    )


    return (
        items,
        total,
    )


# =========================================================
# DELETE FACULTY MEMBER
# =========================================================

def delete_faculty_member(
    db: Session,
    member:
        FacultyMember,
) -> None:

    image_url = (
        member.image_url
    )


    db.delete(
        member
    )

    db.commit()


    # Physical file is removed
    # only after DB deletion succeeds.

    delete_faculty_file(
        image_url
    )


# =========================================================
# PUBLIC FACULTY CATEGORIES
#
# Only active categories.
# =========================================================

def get_public_faculty_categories(
    db: Session,
) -> list[FacultyCategory]:

    statement = (
        select(
            FacultyCategory
        )
        .where(
            FacultyCategory.is_active
            .is_(True)
        )
        .order_by(
            FacultyCategory.display_order
            .asc(),

            FacultyCategory.name
            .asc(),

            FacultyCategory.id
            .asc(),
        )
    )


    return list(
        db.scalars(
            statement
        ).all()
    )


# =========================================================
# PUBLIC FACULTY MEMBERS
#
# Rules:
#
# member must be active
# category must be active
#
# Optional:
# category slug
# =========================================================

def get_public_faculty_members(
    db: Session,
    *,
    category_slug:
        str | None = None,
) -> list[FacultyMember]:

    filters = [
        FacultyMember.is_active
        .is_(True),

        FacultyCategory.is_active
        .is_(True),
    ]


    if category_slug:

        cleaned_slug = (
            category_slug
            .strip()
            .lower()
        )

        if cleaned_slug:

            filters.append(
                FacultyCategory.slug
                ==
                cleaned_slug
            )


    statement = (
        select(
            FacultyMember
        )
        .join(
            FacultyMember.category
        )
        .options(
            selectinload(
                FacultyMember.category
            )
        )
        .where(
            *filters
        )
        .order_by(
            FacultyCategory.display_order
            .asc(),

            FacultyMember.display_order
            .asc(),

            FacultyMember.name
            .asc(),

            FacultyMember.id
            .asc(),
        )
    )


    return list(
        db.scalars(
            statement
        ).all()
    )