from fastapi import (
    APIRouter,
    Depends,
    Query,
)

from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_db,
)

from app.schemas.faculty import (
    PublicFacultyCategoryListResponse,
    PublicFacultyMemberListResponse,
)

from app.services.faculty_service import (
    get_public_faculty_categories,
    get_public_faculty_members,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/v1/faculty",
    tags=[
        "Public Faculty"
    ],
)


# =========================================================
# PUBLIC FACULTY CATEGORIES
#
# GET
# /api/v1/faculty/categories
#
# Returns only active categories.
#
# Example:
#
# Leadership
# Kindergarten
# Primary
# Middle School
# High School
# Higher Secondary
#
# "All Faculty" is NOT stored in database.
# Frontend will add that option itself.
# =========================================================

@router.get(
    "/categories",

    response_model=
        PublicFacultyCategoryListResponse,
)
def get_faculty_categories(
    db: Session = Depends(
        get_db
    ),
):
    items = (
        get_public_faculty_categories(
            db
        )
    )

    return (
        PublicFacultyCategoryListResponse(
            items=items,
            total=len(
                items
            ),
        )
    )


# =========================================================
# PUBLIC FACULTY MEMBERS
#
# GET
# /api/v1/faculty
#
# Optional filter:
#
# GET
# /api/v1/faculty?category=primary
#
# GET
# /api/v1/faculty?category=leadership
#
# Only returns:
#
# active faculty
# +
# faculty belonging to active categories
# =========================================================

@router.get(
    "",

    response_model=
        PublicFacultyMemberListResponse,
)
def get_faculty_members(
    category: str | None = Query(
        default=None,

        max_length=150,

        description=(
            "Optional Faculty category slug. "
            "Example: primary or higher-secondary."
        ),
    ),

    db: Session = Depends(
        get_db
    ),
):
    items = (
        get_public_faculty_members(
            db,

            category_slug=
                category,
        )
    )

    return (
        PublicFacultyMemberListResponse(
            items=items,

            total=len(
                items
            ),
        )
    )