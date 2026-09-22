from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_current_admin,
    get_db,
)

from app.schemas.faculty import (
    FacultyCategoryCreate,
    FacultyCategoryListResponse,
    FacultyCategoryResponse,
    FacultyCategoryUpdate,

    FacultyMemberCreate,
    FacultyMemberListResponse,
    FacultyMemberResponse,
    FacultyMemberUpdate,
)

from app.services.faculty_service import (
    # Category
    create_faculty_category,
    delete_faculty_category,
    get_faculty_category_by_id,
    list_faculty_categories,
    update_faculty_category,

    # Faculty members
    create_faculty_member,
    delete_faculty_member,
    get_faculty_member_by_id,
    list_faculty_members,
    update_faculty_member,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/v1/admin/faculty",
    tags=[
        "Admin Faculty"
    ],
)


# =========================================================
# FACULTY CATEGORIES
# =========================================================


# ---------------------------------------------------------
# LIST CATEGORIES
#
# GET
# /api/v1/admin/faculty/categories
#
# Filters:
#
# ?search=primary
# ?is_active=true
# ---------------------------------------------------------

@router.get(
    "/categories",
    response_model=
        FacultyCategoryListResponse,
)
def get_faculty_categories(
    search: str | None = Query(
        default=None,
        max_length=120,
    ),

    is_active: bool | None = Query(
        default=None,
    ),

    db: Session = Depends(
        get_db
    ),

    _current_admin=Depends(
        get_current_admin
    ),
):
    items, total = (
        list_faculty_categories(
            db,
            search=search,
            is_active=is_active,
        )
    )

    return FacultyCategoryListResponse(
        items=items,
        total=total,
    )


# ---------------------------------------------------------
# CREATE CATEGORY
#
# POST
# /api/v1/admin/faculty/categories
# ---------------------------------------------------------

@router.post(
    "/categories",

    response_model=
        FacultyCategoryResponse,

    status_code=(
        status.HTTP_201_CREATED
    ),
)
def create_category(
    payload:
        FacultyCategoryCreate,

    db: Session = Depends(
        get_db
    ),

    _current_admin=Depends(
        get_current_admin
    ),
):
    try:

        return create_faculty_category(
            db,
            payload,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=str(
                error
            ),
        ) from error


# ---------------------------------------------------------
# GET ONE CATEGORY
#
# GET
# /api/v1/admin/faculty/categories/{category_id}
# ---------------------------------------------------------

@router.get(
    "/categories/{category_id}",

    response_model=
        FacultyCategoryResponse,
)
def get_faculty_category(
    category_id: int,

    db: Session = Depends(
        get_db
    ),

    _current_admin=Depends(
        get_current_admin
    ),
):
    category = (
        get_faculty_category_by_id(
            db,
            category_id,
        )
    )

    if category is None:

        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),

            detail=(
                "Faculty category not found."
            ),
        )

    return category


# ---------------------------------------------------------
# UPDATE CATEGORY
#
# PATCH
# /api/v1/admin/faculty/categories/{category_id}
# ---------------------------------------------------------

@router.patch(
    "/categories/{category_id}",

    response_model=
        FacultyCategoryResponse,
)
def update_category(
    category_id: int,

    payload:
        FacultyCategoryUpdate,

    db: Session = Depends(
        get_db
    ),

    _current_admin=Depends(
        get_current_admin
    ),
):
    category = (
        get_faculty_category_by_id(
            db,
            category_id,
        )
    )

    if category is None:

        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),

            detail=(
                "Faculty category not found."
            ),
        )

    try:

        return update_faculty_category(
            db,
            category,
            payload,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=str(
                error
            ),
        ) from error


# ---------------------------------------------------------
# DELETE CATEGORY
#
# DELETE
# /api/v1/admin/faculty/categories/{category_id}
#
# The service prevents deletion when Faculty members
# are still assigned to the category.
# ---------------------------------------------------------

@router.delete(
    "/categories/{category_id}",
)
def delete_category(
    category_id: int,

    db: Session = Depends(
        get_db
    ),

    _current_admin=Depends(
        get_current_admin
    ),
):
    category = (
        get_faculty_category_by_id(
            db,
            category_id,
        )
    )

    if category is None:

        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),

            detail=(
                "Faculty category not found."
            ),
        )

    try:

        delete_faculty_category(
            db,
            category,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=str(
                error
            ),
        ) from error

    return {
        "message":
            "Faculty category deleted successfully."
    }


# =========================================================
# FACULTY MEMBERS
# =========================================================


# ---------------------------------------------------------
# LIST FACULTY MEMBERS
#
# GET
# /api/v1/admin/faculty/members
#
# Examples:
#
# /members?page=1&limit=20
#
# /members?search=maria
#
# /members?category_id=3
#
# /members?subject=Mathematics
#
# /members?is_active=true
# ---------------------------------------------------------

@router.get(
    "/members",

    response_model=
        FacultyMemberListResponse,
)
def get_faculty_members(
    page: int = Query(
        default=1,
        ge=1,
    ),

    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),

    search: str | None = Query(
        default=None,
        max_length=150,
    ),

    category_id: int | None = Query(
        default=None,
        ge=1,
    ),

    subject: str | None = Query(
        default=None,
        max_length=120,
    ),

    is_active: bool | None = Query(
        default=None,
    ),

    db: Session = Depends(
        get_db
    ),

    _current_admin=Depends(
        get_current_admin
    ),
):
    items, total = (
        list_faculty_members(
            db,
            page=page,
            limit=limit,
            search=search,
            category_id=category_id,
            subject=subject,
            is_active=is_active,
        )
    )

    return FacultyMemberListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
    )


# ---------------------------------------------------------
# CREATE FACULTY MEMBER
#
# POST
# /api/v1/admin/faculty/members
# ---------------------------------------------------------

@router.post(
    "/members",

    response_model=
        FacultyMemberResponse,

    status_code=(
        status.HTTP_201_CREATED
    ),
)
def create_member(
    payload:
        FacultyMemberCreate,

    db: Session = Depends(
        get_db
    ),

    current_admin=Depends(
        get_current_admin
    ),
):
    try:

        return create_faculty_member(
            db,
            payload,
            created_by_id=
                current_admin.id,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=str(
                error
            ),
        ) from error


# ---------------------------------------------------------
# GET ONE FACULTY MEMBER
#
# GET
# /api/v1/admin/faculty/members/{member_id}
# ---------------------------------------------------------

@router.get(
    "/members/{member_id}",

    response_model=
        FacultyMemberResponse,
)
def get_faculty_member(
    member_id: int,

    db: Session = Depends(
        get_db
    ),

    _current_admin=Depends(
        get_current_admin
    ),
):
    member = (
        get_faculty_member_by_id(
            db,
            member_id,
        )
    )

    if member is None:

        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),

            detail=(
                "Faculty member not found."
            ),
        )

    return member


# ---------------------------------------------------------
# UPDATE FACULTY MEMBER
#
# PATCH
# /api/v1/admin/faculty/members/{member_id}
# ---------------------------------------------------------

@router.patch(
    "/members/{member_id}",

    response_model=
        FacultyMemberResponse,
)
def update_member(
    member_id: int,

    payload:
        FacultyMemberUpdate,

    db: Session = Depends(
        get_db
    ),

    _current_admin=Depends(
        get_current_admin
    ),
):
    member = (
        get_faculty_member_by_id(
            db,
            member_id,
        )
    )

    if member is None:

        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),

            detail=(
                "Faculty member not found."
            ),
        )

    try:

        return update_faculty_member(
            db,
            member,
            payload,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=str(
                error
            ),
        ) from error


# ---------------------------------------------------------
# DELETE FACULTY MEMBER
#
# DELETE
# /api/v1/admin/faculty/members/{member_id}
#
# The associated Faculty image will also be removed
# from backend/uploads/faculty when applicable.
# ---------------------------------------------------------

@router.delete(
    "/members/{member_id}",
)
def delete_member(
    member_id: int,

    db: Session = Depends(
        get_db
    ),

    _current_admin=Depends(
        get_current_admin
    ),
):
    member = (
        get_faculty_member_by_id(
            db,
            member_id,
        )
    )

    if member is None:

        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),

            detail=(
                "Faculty member not found."
            ),
        )

    delete_faculty_member(
        db,
        member,
    )

    return {
        "message":
            "Faculty member deleted successfully."
    }