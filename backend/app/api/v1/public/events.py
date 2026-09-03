from typing import Literal

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.event import (
    PublicEventListResponse,
)

from app.services.event_service import (
    list_public_events,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/v1/events",
    tags=["Public Events"],
)


# =========================================================
# EVENT SCOPE TYPE
# =========================================================

EventScope = Literal[
    "this_week",
    "next_week",
    "upcoming",
]


# =========================================================
# GET PUBLIC EVENTS
# =========================================================

@router.get(
    "",
    response_model=PublicEventListResponse,
)
def get_public_events(
    scope: EventScope = Query(
        default="upcoming",
        description=(
            "Event range: "
            "this_week, next_week or upcoming"
        ),
    ),

    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),

    db: Session = Depends(
        get_db
    ),
):

    try:

        items = list_public_events(
            db,
            scope=scope,
            limit=limit,
        )


        return PublicEventListResponse(
            items=items,

            total=len(
                items
            ),

            scope=scope,

            limit=limit,
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