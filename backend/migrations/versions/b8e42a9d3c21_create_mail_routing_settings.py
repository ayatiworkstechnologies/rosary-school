"""create mail routing settings

Revision ID: b8e42a9d3c21
Revises: a7d31f8c2b10
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b8e42a9d3c21"
down_revision: Union[str, Sequence[str], None] = "a7d31f8c2b10"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "mail_routing_settings",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("contact_to", sa.String(1000), nullable=False, server_default=""),
        sa.Column("contact_cc", sa.String(1000), nullable=False, server_default=""),
        sa.Column("contact_bcc", sa.String(1000), nullable=False, server_default=""),
        sa.Column("contact_reply_to", sa.String(254), nullable=False, server_default=""),
        sa.Column("contact_ack_enabled", sa.Boolean(), nullable=False, server_default="1"),
        sa.Column("admission_to", sa.String(1000), nullable=False, server_default=""),
        sa.Column("admission_cc", sa.String(1000), nullable=False, server_default=""),
        sa.Column("admission_bcc", sa.String(1000), nullable=False, server_default=""),
        sa.Column("admission_reply_to", sa.String(254), nullable=False, server_default=""),
        sa.Column("admission_ack_enabled", sa.Boolean(), nullable=False, server_default="1"),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("mail_routing_settings")
