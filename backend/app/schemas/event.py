from datetime import (
    date,
    datetime,
    time,
)

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


# =========================================================
# BASE SCHEMA
# =========================================================

class EventBase(BaseModel):

    title: str = Field(
        min_length=2,
        max_length=255,
    )

    description: str = Field(
        min_length=2,
    )

    venue: str = Field(
        min_length=2,
        max_length=190,
    )

    event_date: date

    start_time: time

    end_time: time | None = None

    is_published: bool = False


# =========================================================
# CREATE EVENT
# =========================================================

class EventCreate(EventBase):
    pass


# =========================================================
# UPDATE EVENT
# =========================================================

class EventUpdate(BaseModel):

    title: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    description: str | None = Field(
        default=None,
        min_length=2,
    )

    venue: str | None = Field(
        default=None,
        min_length=2,
        max_length=190,
    )

    event_date: date | None = None

    start_time: time | None = None

    end_time: time | None = None

    is_published: bool | None = None


# =========================================================
# SINGLE EVENT RESPONSE - ADMIN
# =========================================================

class EventResponse(BaseModel):

    id: int

    title: str

    description: str

    venue: str

    event_date: date

    start_time: time

    end_time: time | None

    is_published: bool

    created_by_id: int | None

    created_at: datetime

    updated_at: datetime


    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# EVENT LIST RESPONSE - ADMIN
# =========================================================

class EventListResponse(BaseModel):

    items: list[
        EventResponse
    ]

    total: int

    page: int

    limit: int


# =========================================================
# PUBLIC EVENT ITEM
# =========================================================

class PublicEventItem(BaseModel):

    id: int

    title: str

    description: str

    venue: str

    event_date: date

    start_time: time

    end_time: time | None


    model_config = ConfigDict(
        from_attributes=True
    )


# =========================================================
# PUBLIC EVENT LIST RESPONSE
# =========================================================

class PublicEventListResponse(BaseModel):

    items: list[
        PublicEventItem
    ]

    total: int

    scope: str

    limit: int