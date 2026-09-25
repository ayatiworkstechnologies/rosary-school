from datetime import datetime
from typing import Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    model_validator,
)


# =========================================================
# ICON TYPES
# =========================================================

DownloadIconType = Literal[
    "lucide",
    "image",
]


# =========================================================
# BASE
# =========================================================

class DownloadBase(BaseModel):

    title: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    description: str = Field(
        ...,
        min_length=2,
        max_length=2000,
    )

    icon_type: DownloadIconType = (
        "lucide"
    )

    icon_key: str | None = Field(
        default=None,
        max_length=80,
    )

    icon_url: str | None = Field(
        default=None,
        max_length=500,
    )

    file_url: str = Field(
        ...,
        min_length=1,
        max_length=500,
    )

    original_file_name: str | None = Field(
        default=None,
        max_length=255,
    )

    file_size_bytes: int | None = Field(
        default=None,
        ge=0,
    )

    display_order: int = Field(
        default=1,
        ge=1,
    )

    is_active: bool = True

    # -----------------------------------------------------
    # VALIDATE ICON
    # -----------------------------------------------------

    @model_validator(
        mode="after"
    )
    def validate_icon(
        self,
    ):

        if self.icon_type == "lucide":

            if not self.icon_key:

                raise ValueError(
                    "icon_key is required when "
                    "icon_type is 'lucide'."
                )

            # Custom image should not be used
            # when Lucide is selected.

            self.icon_url = None

        elif self.icon_type == "image":

            if not self.icon_url:

                raise ValueError(
                    "icon_url is required when "
                    "icon_type is 'image'."
                )

            # Lucide key is not required for
            # uploaded image icons.

            self.icon_key = None

        return self


# =========================================================
# CREATE
# =========================================================

class DownloadCreate(
    DownloadBase
):
    pass


# =========================================================
# UPDATE
#
# All fields are optional because Admin may update
# only one or two values.
# =========================================================

class DownloadUpdate(BaseModel):

    title: str | None = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    description: str | None = Field(
        default=None,
        min_length=2,
        max_length=2000,
    )

    icon_type: DownloadIconType | None = (
        None
    )

    icon_key: str | None = Field(
        default=None,
        max_length=80,
    )

    icon_url: str | None = Field(
        default=None,
        max_length=500,
    )

    file_url: str | None = Field(
        default=None,
        max_length=500,
    )

    original_file_name: str | None = Field(
        default=None,
        max_length=255,
    )

    file_size_bytes: int | None = Field(
        default=None,
        ge=0,
    )

    display_order: int | None = Field(
        default=None,
        ge=1,
    )

    is_active: bool | None = None


# =========================================================
# STATUS UPDATE
# =========================================================

class DownloadStatusUpdate(
    BaseModel
):

    is_active: bool


# =========================================================
# ORDER UPDATE
# =========================================================

class DownloadOrderUpdate(
    BaseModel
):

    display_order: int = Field(
        ...,
        ge=1,
    )


# =========================================================
# ADMIN RESPONSE
# =========================================================

class DownloadResponse(
    BaseModel
):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: int

    title: str

    description: str

    icon_type: str

    icon_key: str | None = None

    icon_url: str | None = None

    file_url: str

    original_file_name: str | None = (
        None
    )

    file_size_bytes: int | None = None

    display_order: int

    is_active: bool

    created_by_id: int | None = None

    created_at: datetime

    updated_at: datetime


# =========================================================
# ADMIN LIST RESPONSE
# =========================================================

class DownloadListResponse(
    BaseModel
):

    items: list[
        DownloadResponse
    ]

    total: int


# =========================================================
# PUBLIC RESPONSE
#
# Public website does not need:
# created_by_id
# =========================================================

class PublicDownloadResponse(
    BaseModel
):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: int

    title: str

    description: str

    icon_type: str

    icon_key: str | None = None

    icon_url: str | None = None

    file_url: str

    original_file_name: str | None = (
        None
    )

    file_size_bytes: int | None = None

    display_order: int


# =========================================================
# PUBLIC LIST RESPONSE
# =========================================================

class PublicDownloadListResponse(
    BaseModel
):

    items: list[
        PublicDownloadResponse
    ]

    total: int