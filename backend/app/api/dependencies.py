from fastapi import (
    Cookie,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.admin import Admin


# =========================================================
# GET CURRENT ADMIN
# =========================================================

def get_current_admin(
    rosary_admin_access_token: str | None = Cookie(
        default=None
    ),
    db: Session = Depends(get_db),
) -> Admin:
    """
    Read the JWT from the HttpOnly cookie,
    validate it and return the currently
    authenticated administrator.
    """

    # =====================================================
    # COOKIE DOES NOT EXIST
    # =====================================================

    if not rosary_admin_access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
        )

    # =====================================================
    # DECODE JWT
    # =====================================================

    payload = decode_access_token(
        rosary_admin_access_token
    )

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=(
                "Invalid or expired authentication session."
            ),
        )

    # =====================================================
    # GET ADMIN ID FROM JWT
    # =====================================================

    subject = payload.get("sub")

    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )

    try:
        admin_id = int(subject)

    except (TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )

    # =====================================================
    # LOAD ADMIN FROM DATABASE
    # =====================================================

    admin = db.get(
        Admin,
        admin_id,
    )

    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Administrator not found.",
        )

    # =====================================================
    # ACCOUNT STATUS
    # =====================================================

    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator account is disabled.",
        )

    return admin