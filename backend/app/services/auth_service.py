from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import verify_password
from app.models.admin import Admin


# =========================================================
# AUTHENTICATE ADMIN
# =========================================================

def authenticate_admin(
    db: Session,
    email: str,
    password: str,
) -> Admin | None:
    """
    Find an administrator by email and verify
    the supplied password.

    Returns:
        Admin -> valid credentials
        None  -> invalid credentials
    """

    normalized_email = (
        email.strip().lower()
    )

    admin = db.scalar(
        select(Admin).where(
            Admin.email == normalized_email
        )
    )

    if admin is None:
        return None

    if not verify_password(
        password,
        admin.password_hash,
    ):
        return None

    return admin