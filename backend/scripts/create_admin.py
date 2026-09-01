from getpass import getpass

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.admin import Admin


def create_admin() -> None:
    print()
    print("========================================")
    print(" Rosary School - Create Administrator")
    print("========================================")
    print()

    # =========================================================
    # GET ADMIN DETAILS
    # =========================================================

    full_name = input(
        "Full name: "
    ).strip()

    email = input(
        "Email: "
    ).strip().lower()

    password = getpass(
        "Password: "
    )

    confirm_password = getpass(
        "Confirm password: "
    )

    # =========================================================
    # VALIDATION
    # =========================================================

    if not full_name:
        print("❌ Full name is required.")
        return

    if not email:
        print("❌ Email is required.")
        return

    if "@" not in email:
        print("❌ Enter a valid email address.")
        return

    if len(password) < 8:
        print(
            "❌ Password must contain at least 8 characters."
        )
        return

    if password != confirm_password:
        print(
            "❌ Password and confirm password do not match."
        )
        return

    # =========================================================
    # OPEN DATABASE SESSION
    # =========================================================

    db = SessionLocal()

    try:
        # -----------------------------------------------------
        # CHECK WHETHER EMAIL ALREADY EXISTS
        # -----------------------------------------------------

        existing_admin = db.scalar(
            select(Admin).where(
                Admin.email == email
            )
        )

        if existing_admin:
            print()
            print(
                "❌ An administrator with this email already exists."
            )
            return

        # -----------------------------------------------------
        # HASH PASSWORD
        # -----------------------------------------------------

        hashed_password = hash_password(
            password
        )

        # -----------------------------------------------------
        # CREATE ADMIN OBJECT
        # -----------------------------------------------------

        admin = Admin(
            full_name=full_name,
            email=email,
            password_hash=hashed_password,
            role="super_admin",
            is_active=True,
        )

        # -----------------------------------------------------
        # SAVE TO DATABASE
        # -----------------------------------------------------

        db.add(admin)

        db.commit()

        db.refresh(admin)

        print()
        print("✅ Administrator created successfully.")
        print("----------------------------------------")
        print(f"Admin ID : {admin.id}")
        print(f"Name     : {admin.full_name}")
        print(f"Email    : {admin.email}")
        print(f"Role     : {admin.role}")
        print("----------------------------------------")

    except Exception as error:
        db.rollback()

        print()
        print("❌ Failed to create administrator.")
        print(f"Error: {error}")

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()