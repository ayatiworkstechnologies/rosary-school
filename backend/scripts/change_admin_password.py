from getpass import getpass

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.admin import Admin


def change_password() -> None:
    email = input(
        "Admin email: "
    ).strip().lower()

    new_password = getpass(
        "New password: "
    )

    confirm_password = getpass(
        "Confirm new password: "
    )

    if len(new_password) < 8:
        print(
            "Password must contain at least 8 characters."
        )
        return

    if new_password != confirm_password:
        print(
            "Passwords do not match."
        )
        return

    db = SessionLocal()

    try:
        admin = db.scalar(
            select(Admin).where(
                Admin.email == email
            )
        )

        if admin is None:
            print("Admin not found.")
            return

        admin.password_hash = hash_password(
            new_password
        )

        db.commit()

        print(
            "✅ Admin password changed successfully."
        )

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    change_password()