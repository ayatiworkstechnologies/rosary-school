"""add separate UKG to VIII admissions

Revision ID: c4d9e2a8b111
Revises: f14c7b8e2a91
"""
from alembic import op
import sqlalchemy as sa

revision = "c4d9e2a8b111"
down_revision = "f14c7b8e2a91"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table("ukg_admission_applications",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("registration_no", sa.String(40), nullable=False, unique=True),
        sa.Column("pupil_name", sa.String(150), nullable=False), sa.Column("parent_email", sa.String(254), nullable=False),
        sa.Column("phone_number", sa.String(20), nullable=False), sa.Column("form_data", sa.JSON(), nullable=False),
        sa.Column("student_photo_url", sa.String(500), nullable=False), sa.Column("status", sa.String(30), nullable=False, server_default="NEW"),
        sa.Column("admin_notes", sa.Text(), nullable=True), sa.Column("email_status", sa.String(30), nullable=False, server_default="PENDING"),
        sa.Column("email_error", sa.String(500), nullable=True), sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()))
    for column in ("registration_no", "pupil_name", "parent_email", "phone_number", "status", "created_at"):
        op.create_index(f"ix_ukg_admission_applications_{column}", "ukg_admission_applications", [column], unique=column == "registration_no")
    op.create_table("ukg_admission_registration_sequence", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("next_number", sa.Integer(), nullable=False))
    op.bulk_insert(sa.table("ukg_admission_registration_sequence", sa.column("id", sa.Integer()), sa.column("next_number", sa.Integer())), [{"id": 1, "next_number": 1}])
    for name, typ, default in (("ukg_admission_to", sa.String(1000), ""), ("ukg_admission_cc", sa.String(1000), ""), ("ukg_admission_bcc", sa.String(1000), ""), ("ukg_admission_reply_to", sa.String(254), ""), ("ukg_admission_ack_enabled", sa.Boolean(), "1"), ("ukg_admission_registration_prefix", sa.String(12), "2728-")):
        op.add_column("mail_routing_settings", sa.Column(name, typ, nullable=False, server_default=default))


def downgrade() -> None:
    for name in ("ukg_admission_registration_prefix", "ukg_admission_ack_enabled", "ukg_admission_reply_to", "ukg_admission_bcc", "ukg_admission_cc", "ukg_admission_to"):
        op.drop_column("mail_routing_settings", name)
    op.drop_table("ukg_admission_registration_sequence")
    op.drop_table("ukg_admission_applications")
