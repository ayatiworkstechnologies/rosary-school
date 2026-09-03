from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from sqlalchemy.orm import Session

from app.api.dependencies import get_current_admin
from app.db.session import get_db

from app.models.admin import Admin

from app.schemas.event import (
    EventCreate,
    EventListResponse,
    EventResponse,
    EventUpdate,
)

from app.services.event_service import (
    create_event,
    delete_event,
    get_event_by_id,
    list_events,
    update_event,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/v1/admin/events",
    tags=["Admin Events"],
)


# =========================================================
# GET EVENT LIST
# =========================================================

@router.get(
    "",
    response_model=EventListResponse,
)
def get_admin_events(
    page: int = Query(
        default=1,
        ge=1,
    ),

    limit: int = Query(
        default=10,
        ge=1,
        le=100,
    ),

    is_published: bool | None = Query(
        default=None,
    ),

    search: str | None = Query(
        default=None,
    ),

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    items, total = list_events(
        db,
        page=page,
        limit=limit,
        is_published=is_published,
        search=search,
    )


    return EventListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
    )


# =========================================================
# CREATE EVENT
# =========================================================

@router.post(
    "",
    response_model=EventResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_event(
    payload: EventCreate,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    try:

        event = create_event(
            db,
            payload,
            admin_id=current_admin.id,
        )

        return event

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error


# =========================================================
# GET SINGLE EVENT
# =========================================================

@router.get(
    "/{event_id}",
    response_model=EventResponse,
)
def get_admin_event(
    event_id: int,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    event = get_event_by_id(
        db,
        event_id,
    )


    if event is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )


    return event


# =========================================================
# UPDATE EVENT
# =========================================================

@router.patch(
    "/{event_id}",
    response_model=EventResponse,
)
def update_admin_event(
    event_id: int,

    payload: EventUpdate,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    event = get_event_by_id(
        db,
        event_id,
    )


    if event is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )


    try:

        updated_event = update_event(
            db,
            event,
            payload,
        )

        return updated_event

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error


# =========================================================
# DELETE EVENT
# =========================================================

@router.delete(
    "/{event_id}",
    status_code=status.HTTP_200_OK,
)
def delete_admin_event(
    event_id: int,

    db: Session = Depends(
        get_db
    ),

    current_admin: Admin = Depends(
        get_current_admin
    ),
):

    event = get_event_by_id(
        db,
        event_id,
    )


    if event is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )


    delete_event(
        db,
        event,
    )


    return {
        "message":
            "Event deleted successfully."
    }