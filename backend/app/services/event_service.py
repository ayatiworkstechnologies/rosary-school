from datetime import (
    datetime,
    time,
    timedelta,
    timezone,
)

from sqlalchemy import (
    func,
    or_,
    select,
)

from sqlalchemy.orm import Session

from app.models.event import Event

from app.schemas.event import (
    EventCreate,
    EventUpdate,
)


# =========================================================
# INDIA TIMEZONE
# =========================================================

INDIA_TIMEZONE = timezone(
    timedelta(
        hours=5,
        minutes=30,
    )
)


# =========================================================
# CLEAN REQUIRED TEXT
# =========================================================

def clean_required_text(
    value: str,
    field_name: str,
) -> str:
    """
    Remove unnecessary spaces and make sure
    required text is not empty.
    """

    cleaned_value = value.strip()

    if not cleaned_value:

        raise ValueError(
            f"{field_name} cannot be empty."
        )

    return cleaned_value


# =========================================================
# VALIDATE EVENT TIME
# =========================================================

def validate_event_time(
    start_time: time,
    end_time: time | None,
) -> None:
    """
    If an end time exists,
    it must be later than the start time.
    """

    if (
        end_time is not None
        and end_time <= start_time
    ):

        raise ValueError(
            "End time must be later than start time."
        )


# =========================================================
# CREATE EVENT
# =========================================================

def create_event(
    db: Session,
    payload: EventCreate,
    admin_id: int | None = None,
) -> Event:

    # =====================================================
    # CLEAN REQUIRED TEXT
    # =====================================================

    title = clean_required_text(
        payload.title,
        "Title",
    )

    description = clean_required_text(
        payload.description,
        "Description",
    )

    venue = clean_required_text(
        payload.venue,
        "Venue",
    )


    # =====================================================
    # VALIDATE START / END TIME
    # =====================================================

    validate_event_time(
        payload.start_time,
        payload.end_time,
    )


    # =====================================================
    # CREATE EVENT OBJECT
    # =====================================================

    event = Event(
        title=title,

        description=description,

        venue=venue,

        event_date=payload.event_date,

        start_time=payload.start_time,

        end_time=payload.end_time,

        is_published=payload.is_published,

        created_by_id=admin_id,
    )


    # =====================================================
    # SAVE TO DATABASE
    # =====================================================

    db.add(
        event
    )

    db.commit()

    db.refresh(
        event
    )


    return event


# =========================================================
# GET EVENT BY ID
# =========================================================

def get_event_by_id(
    db: Session,
    event_id: int,
) -> Event | None:

    statement = (
        select(Event)
        .where(
            Event.id == event_id
        )
    )


    return db.scalar(
        statement
    )


# =========================================================
# LIST EVENTS - ADMIN
# =========================================================

def list_events(
    db: Session,
    *,
    page: int = 1,
    limit: int = 10,
    is_published: bool | None = None,
    search: str | None = None,
) -> tuple[
    list[Event],
    int,
]:

    # =====================================================
    # SAFE PAGINATION
    # =====================================================

    page = max(
        page,
        1,
    )

    limit = max(
        1,
        min(
            limit,
            100,
        ),
    )


    # =====================================================
    # BASE QUERY
    # =====================================================

    statement = select(
        Event
    )


    count_statement = select(
        func.count(
            Event.id
        )
    )


    # =====================================================
    # PUBLISHED / DRAFT FILTER
    # =====================================================

    if is_published is not None:

        condition = (
            Event.is_published
            == is_published
        )


        statement = (
            statement.where(
                condition
            )
        )


        count_statement = (
            count_statement.where(
                condition
            )
        )


    # =====================================================
    # SEARCH
    # =====================================================

    if (
        search
        and search.strip()
    ):

        search_value = (
            f"%{search.strip()}%"
        )


        search_condition = or_(
            Event.title.ilike(
                search_value
            ),

            Event.venue.ilike(
                search_value
            ),

            Event.description.ilike(
                search_value
            ),
        )


        statement = (
            statement.where(
                search_condition
            )
        )


        count_statement = (
            count_statement.where(
                search_condition
            )
        )


    # =====================================================
    # ADMIN SORTING
    # =====================================================

    statement = (
        statement.order_by(
            Event.event_date.desc(),
            Event.start_time.asc(),
            Event.created_at.desc(),
        )
    )


    # =====================================================
    # PAGINATION
    # =====================================================

    offset = (
        page - 1
    ) * limit


    statement = (
        statement
        .offset(
            offset
        )
        .limit(
            limit
        )
    )


    # =====================================================
    # EXECUTE QUERY
    # =====================================================

    items = list(
        db.scalars(
            statement
        ).all()
    )


    total = (
        db.scalar(
            count_statement
        )
        or 0
    )


    return (
        items,
        total,
    )


# =========================================================
# LIST PUBLIC EVENTS
# =========================================================

def list_public_events(
    db: Session,
    *,
    scope: str,
    limit: int = 20,
) -> list[Event]:

    # =====================================================
    # CURRENT DATE - INDIA TIMEZONE
    # =====================================================

    today = (
        datetime.now(
            INDIA_TIMEZONE
        ).date()
    )


    # =====================================================
    # CURRENT WEEK
    # Monday -> Sunday
    # =====================================================

    current_week_start = (
        today
        - timedelta(
            days=today.weekday()
        )
    )


    current_week_end = (
        current_week_start
        + timedelta(
            days=6
        )
    )


    # =====================================================
    # NEXT WEEK
    # Monday -> Sunday
    # =====================================================

    next_week_start = (
        current_week_end
        + timedelta(
            days=1
        )
    )


    next_week_end = (
        next_week_start
        + timedelta(
            days=6
        )
    )


    # =====================================================
    # SAFE LIMIT
    # =====================================================

    safe_limit = max(
        1,
        min(
            limit,
            100,
        ),
    )


    # =====================================================
    # BASE PUBLIC QUERY
    # Only Published Events
    # =====================================================

    statement = (
        select(
            Event
        )
        .where(
            Event.is_published.is_(
                True
            )
        )
    )


    # =====================================================
    # THIS WEEK
    # =====================================================

    if scope == "this_week":

        statement = (
            statement.where(
                Event.event_date
                >= current_week_start,

                Event.event_date
                <= current_week_end,
            )
        )


    # =====================================================
    # NEXT WEEK
    # =====================================================

    elif scope == "next_week":

        statement = (
            statement.where(
                Event.event_date
                >= next_week_start,

                Event.event_date
                <= next_week_end,
            )
        )


    # =====================================================
    # UPCOMING
    # Today + all future Events
    # =====================================================

    elif scope == "upcoming":

        statement = (
            statement.where(
                Event.event_date
                >= today
            )
        )


    # =====================================================
    # INVALID SCOPE
    # =====================================================

    else:

        raise ValueError(
            "Invalid Event scope. "
            "Use this_week, next_week or upcoming."
        )


    # =====================================================
    # PUBLIC SORTING
    # Nearest Event first
    # =====================================================

    statement = (
        statement
        .order_by(
            Event.event_date.asc(),
            Event.start_time.asc(),
            Event.created_at.asc(),
        )
        .limit(
            safe_limit
        )
    )


    # =====================================================
    # EXECUTE QUERY
    # =====================================================

    items = list(
        db.scalars(
            statement
        ).all()
    )


    return items


# =========================================================
# UPDATE EVENT
# =========================================================

def update_event(
    db: Session,
    event: Event,
    payload: EventUpdate,
) -> Event:

    # =====================================================
    # ONLY FIELDS ACTUALLY SENT BY FRONTEND
    # =====================================================

    update_data = (
        payload.model_dump(
            exclude_unset=True
        )
    )


    # =====================================================
    # REQUIRED FIELDS CANNOT BE NULL
    # =====================================================

    required_fields = {
        "title",
        "description",
        "venue",
        "event_date",
        "start_time",
        "is_published",
    }


    for field in required_fields:

        if (
            field in update_data
            and update_data[field] is None
        ):

            raise ValueError(
                f"{field} cannot be null."
            )


    # =====================================================
    # CLEAN TITLE
    # =====================================================

    if (
        "title" in update_data
        and update_data["title"] is not None
    ):

        update_data[
            "title"
        ] = clean_required_text(
            update_data[
                "title"
            ],
            "Title",
        )


    # =====================================================
    # CLEAN DESCRIPTION
    # =====================================================

    if (
        "description" in update_data
        and update_data[
            "description"
        ] is not None
    ):

        update_data[
            "description"
        ] = clean_required_text(
            update_data[
                "description"
            ],
            "Description",
        )


    # =====================================================
    # CLEAN VENUE
    # =====================================================

    if (
        "venue" in update_data
        and update_data["venue"] is not None
    ):

        update_data[
            "venue"
        ] = clean_required_text(
            update_data[
                "venue"
            ],
            "Venue",
        )


    # =====================================================
    # CALCULATE FINAL START TIME
    # =====================================================

    final_start_time = (
        update_data.get(
            "start_time",
            event.start_time,
        )
    )


    # =====================================================
    # CALCULATE FINAL END TIME
    # =====================================================

    if (
        "end_time"
        in update_data
    ):

        final_end_time = (
            update_data[
                "end_time"
            ]
        )

    else:

        final_end_time = (
            event.end_time
        )


    # =====================================================
    # VALIDATE FINAL TIME
    # =====================================================

    validate_event_time(
        final_start_time,
        final_end_time,
    )


    # =====================================================
    # APPLY UPDATE
    # =====================================================

    for (
        field,
        value,
    ) in update_data.items():

        setattr(
            event,
            field,
            value,
        )


    # =====================================================
    # SAVE UPDATE
    # =====================================================

    db.commit()

    db.refresh(
        event
    )


    return event


# =========================================================
# DELETE EVENT
# =========================================================

def delete_event(
    db: Session,
    event: Event,
) -> None:

    db.delete(
        event
    )

    db.commit()