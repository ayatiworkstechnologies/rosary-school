"""add admission registration prefix setting

Revision ID: e2f75b8a1c64
Revises: d1e64a7f9b43
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "e2f75b8a1c64"
down_revision: Union[str, Sequence[str], None] = "d1e64a7f9b43"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "mail_routing_settings",
        sa.Column("admission_registration_prefix", sa.String(12), nullable=False, server_default="2728-"),
    )


def downgrade() -> None:
    op.drop_column("mail_routing_settings", "admission_registration_prefix")
