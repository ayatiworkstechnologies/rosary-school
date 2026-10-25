"""create contact and admission submissions

Revision ID: a7d31f8c2b10
Revises: 1ee2ca611bf8
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a7d31f8c2b10"
down_revision: Union[str, Sequence[str], None] = "1ee2ca611bf8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "contact_enquiries",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(150), nullable=False),
        sa.Column("email", sa.String(254), nullable=False),
        sa.Column("phone", sa.String(20), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("status", sa.String(30), nullable=False, server_default="NEW"),
        sa.Column("admin_notes", sa.Text(), nullable=True),
        sa.Column("email_status", sa.String(30), nullable=False, server_default="PENDING"),
        sa.Column("email_error", sa.String(500), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    for column in ("name", "email", "phone", "status", "created_at"):
        op.create_index(f"ix_contact_enquiries_{column}", "contact_enquiries", [column])

    op.create_table(
        "admission_applications",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("registration_no", sa.String(40), nullable=False, unique=True),
        sa.Column("pupil_name", sa.String(150), nullable=False),
        sa.Column("parent_email", sa.String(254), nullable=False),
        sa.Column("phone_number", sa.String(20), nullable=False),
        sa.Column("form_data", sa.JSON(), nullable=False),
        sa.Column("student_photo_url", sa.String(500), nullable=False),
        sa.Column("father_signature_url", sa.String(500), nullable=False),
        sa.Column("mother_signature_url", sa.String(500), nullable=False),
        sa.Column("status", sa.String(30), nullable=False, server_default="NEW"),
        sa.Column("admin_notes", sa.Text(), nullable=True),
        sa.Column("email_status", sa.String(30), nullable=False, server_default="PENDING"),
        sa.Column("email_error", sa.String(500), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    for column in ("registration_no", "pupil_name", "parent_email", "phone_number", "status", "created_at"):
        op.create_index(f"ix_admission_applications_{column}", "admission_applications", [column], unique=column == "registration_no")


def downgrade() -> None:
    op.drop_table("admission_applications")
    op.drop_table("contact_enquiries")
