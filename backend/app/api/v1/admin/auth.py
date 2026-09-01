from datetime import datetime, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    status,
)
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_admin
from app.core.config import settings
from app.core.security import create_access_token
from app.db.session import get_db
from app.models.admin import Admin
from app.schemas.auth import (
    AdminLoginRequest,
    AdminLoginResponse,
    AdminResponse,
)
from app.services.auth_service import authenticate_admin


router = APIRouter(
    prefix="/api/v1/admin/auth",
    tags=["Admin Authentication"],
)


# =========================================================
# ADMIN LOGIN
# =========================================================

@router.post(
    "/login",
    response_model=AdminLoginResponse,
    status_code=status.HTTP_200_OK,
)
def admin_login(
    payload: AdminLoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    # =====================================================
    # VERIFY CREDENTIALS
    # =====================================================

    admin = authenticate_admin(
        db=db,
        email=str(payload.email),
        password=payload.password,
    )

    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # =====================================================
    # CHECK ADMIN STATUS
    # =====================================================

    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator account is disabled.",
        )

    # =====================================================
    # CREATE JWT ACCESS TOKEN
    # =====================================================

    access_token = create_access_token(
        subject=str(admin.id),
        role=admin.role,
    )

    # =====================================================
    # STORE TOKEN IN HTTPONLY COOKIE
    # =====================================================

    response.set_cookie(
        key="rosary_admin_access_token",
        value=access_token,

        httponly=True,

        secure=settings.COOKIE_SECURE,

        samesite="lax",

        max_age=(
            settings.ACCESS_TOKEN_EXPIRE_MINUTES
            * 60
        ),

        path="/",
    )

    # =====================================================
    # UPDATE LAST LOGIN
    # =====================================================

    admin.last_login_at = (
        datetime.now(timezone.utc)
        .replace(tzinfo=None)
    )

    db.commit()
    db.refresh(admin)

    # =====================================================
    # RESPONSE
    # =====================================================

    return AdminLoginResponse(
        message="Login successful.",
        admin=AdminResponse.model_validate(
            admin
        ),
    )


# =========================================================
# CURRENT LOGGED-IN ADMIN
# =========================================================

@router.get(
    "/me",
    response_model=AdminResponse,
    status_code=status.HTTP_200_OK,
)
def get_logged_in_admin(
    current_admin: Admin = Depends(
        get_current_admin
    ),
):
    """
    Return information about the currently
    authenticated administrator.
    """

    return AdminResponse.model_validate(
        current_admin
    )


# =========================================================
# LOGOUT
# =========================================================

@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
)
def admin_logout(
    response: Response,
):
    """
    Remove the admin authentication cookie.
    """

    response.delete_cookie(
        key="rosary_admin_access_token",
        path="/",
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
    )

    return {
        "message": "Logout successful."
    }