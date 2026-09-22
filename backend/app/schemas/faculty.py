from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


# =========================================================
# FACULTY CATEGORY
# =========================================================


# ---------------------------------------------------------
# CATEGORY BASE
# ---------------------------------------------------------

class FacultyCategoryBase(BaseModel):

    name: str = Field(
        ...,
        min_length=2,
        max_length=120,
    )

    display_order: int = Field(
        default=1,
        ge=1,
    )

    is_active: bool = True


# ---------------------------------------------------------
# CREATE CATEGORY
# ---------------------------------------------------------

class FacultyCategoryCreate(
    FacultyCategoryBase
):
    pass


# ---------------------------------------------------------
# UPDATE CATEGORY
# ---------------------------------------------------------

class FacultyCategoryUpdate(BaseModel):

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=120,
    )

    display_order: int | None = Field(
        default=None,
        ge=1,
    )

    is_active: bool | None = None


# ---------------------------------------------------------
# CATEGORY RESPONSE
# ---------------------------------------------------------

class FacultyCategoryResponse(
    BaseModel
):

    id: int

    name: str

    slug: str

    display_order: int

    is_active: bool

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ---------------------------------------------------------
# ADMIN CATEGORY LIST RESPONSE
# ---------------------------------------------------------

class FacultyCategoryListResponse(
    BaseModel
):

    items: list[
        FacultyCategoryResponse
    ]

    total: int


# =========================================================
# CATEGORY SUMMARY
#
# Used inside Faculty Member responses.
# =========================================================

class FacultyCategorySummary(
    BaseModel
):

    id: int

    name: str

    slug: str

    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# FACULTY MEMBER
# =========================================================


# ---------------------------------------------------------
# MEMBER BASE
# ---------------------------------------------------------

class FacultyMemberBase(BaseModel):

    name: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    designation: str = Field(
        ...,
        min_length=2,
        max_length=180,
    )

    subject: str = Field(
        ...,
        min_length=2,
        max_length=120,
    )

    experience_years: int = Field(
        default=0,
        ge=0,
        le=80,
    )

    category_id: int = Field(
        ...,
        ge=1,
    )

    image_url: str | None = Field(
        default=None,
        max_length=500,
    )

    display_order: int = Field(
        default=1,
        ge=1,
    )

    is_active: bool = True


# ---------------------------------------------------------
# CREATE FACULTY MEMBER
# ---------------------------------------------------------

class FacultyMemberCreate(
    FacultyMemberBase
):
    pass


# ---------------------------------------------------------
# UPDATE FACULTY MEMBER
# ---------------------------------------------------------

class FacultyMemberUpdate(BaseModel):

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    designation: str | None = Field(
        default=None,
        min_length=2,
        max_length=180,
    )

    subject: str | None = Field(
        default=None,
        min_length=2,
        max_length=120,
    )

    experience_years: int | None = Field(
        default=None,
        ge=0,
        le=80,
    )

    category_id: int | None = Field(
        default=None,
        ge=1,
    )

    image_url: str | None = Field(
        default=None,
        max_length=500,
    )

    display_order: int | None = Field(
        default=None,
        ge=1,
    )

    is_active: bool | None = None


# ---------------------------------------------------------
# ADMIN FACULTY RESPONSE
# ---------------------------------------------------------

class FacultyMemberResponse(
    BaseModel
):

    id: int

    name: str

    designation: str

    subject: str

    experience_years: int

    category_id: int

    image_url: str | None

    display_order: int

    is_active: bool

    created_by_id: int | None

    created_at: datetime

    updated_at: datetime

    category: FacultyCategorySummary

    model_config = ConfigDict(
        from_attributes=True
    )


# ---------------------------------------------------------
# ADMIN FACULTY LIST RESPONSE
# ---------------------------------------------------------

class FacultyMemberListResponse(
    BaseModel
):

    items: list[
        FacultyMemberResponse
    ]

    total: int

    page: int

    limit: int


# =========================================================
# PUBLIC FACULTY
# =========================================================


# ---------------------------------------------------------
# PUBLIC CATEGORY
# ---------------------------------------------------------

class PublicFacultyCategory(
    BaseModel
):

    id: int

    name: str

    slug: str

    display_order: int

    model_config = ConfigDict(
        from_attributes=True
    )


# ---------------------------------------------------------
# PUBLIC CATEGORY LIST RESPONSE
# ---------------------------------------------------------

class PublicFacultyCategoryListResponse(
    BaseModel
):

    items: list[
        PublicFacultyCategory
    ]

    total: int


# ---------------------------------------------------------
# PUBLIC FACULTY MEMBER
# ---------------------------------------------------------

class PublicFacultyMember(
    BaseModel
):

    id: int

    name: str

    designation: str

    subject: str

    experience_years: int

    image_url: str | None

    display_order: int

    category: FacultyCategorySummary

    model_config = ConfigDict(
        from_attributes=True
    )


# ---------------------------------------------------------
# PUBLIC FACULTY LIST RESPONSE
# ---------------------------------------------------------

class PublicFacultyMemberListResponse(
    BaseModel
):

    items: list[
        PublicFacultyMember
    ]

    total: int