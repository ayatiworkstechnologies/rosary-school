"""reset admission sequence and remove signature requirements

Revision ID: f14c7b8e2a91
Revises: e2f75b8a1c64
Create Date: 2026-10-26 11:20:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "f14c7b8e2a91"
down_revision: Union[str, Sequence[str], None] = "e2f75b8a1c64"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("UPDATE mail_routing_settings SET admission_registration_prefix = '2728-'")
    op.create_table(
        "admission_registration_sequence",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("next_number", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.bulk_insert(
        sa.table(
            "admission_registration_sequence",
            sa.column("id", sa.Integer()),
            sa.column("next_number", sa.Integer()),
        ),
        [{"id": 1, "next_number": 1}],
    )
    op.alter_column("admission_applications", "father_signature_url", existing_type=sa.String(length=500), nullable=True)
    op.alter_column("admission_applications", "mother_signature_url", existing_type=sa.String(length=500), nullable=True)


def downgrade() -> None:
    op.alter_column("admission_applications", "mother_signature_url", existing_type=sa.String(length=500), nullable=False)
    op.alter_column("admission_applications", "father_signature_url", existing_type=sa.String(length=500), nullable=False)
    op.drop_table("admission_registration_sequence")
