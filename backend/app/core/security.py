from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from pwdlib import PasswordHash

from app.core.config import settings


# =========================================================
# PASSWORD HASHER
# =========================================================

password_hash = PasswordHash.recommended()


# =========================================================
# HASH PASSWORD
# =========================================================

def hash_password(password: str) -> str:
    """
    Convert a plain-text password into a secure
    one-way password hash.
    """

    return password_hash.hash(password)


# =========================================================
# VERIFY PASSWORD
# =========================================================

def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Compare a login password with the password
    hash stored in the database.
    """

    return password_hash.verify(
        plain_password,
        hashed_password,
    )


# =========================================================
# CREATE ACCESS TOKEN
# =========================================================

def create_access_token(
    subject: str,
    role: str,
) -> str:
    """
    Create a signed JWT access token for an admin.
    """

    now = datetime.now(timezone.utc)

    expires_at = now + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload: dict[str, Any] = {
        "sub": subject,
        "role": role,
        "iat": now,
        "exp": expires_at,
        "type": "access",
    }

    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


# =========================================================
# DECODE ACCESS TOKEN
# =========================================================

def decode_access_token(
    token: str,
) -> dict[str, Any] | None:
    """
    Decode and validate an access token.

    Returns None when the token is invalid or expired.
    """

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[
                settings.JWT_ALGORITHM
            ],
        )

        if payload.get("type") != "access":
            return None

        return payload

    except JWTError:
        return None