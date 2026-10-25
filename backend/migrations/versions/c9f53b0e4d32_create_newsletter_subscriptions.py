"""create newsletter subscriptions

Revision ID: c9f53b0e4d32
Revises: b8e42a9d3c21
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c9f53b0e4d32"
down_revision: Union[str, Sequence[str], None] = "b8e42a9d3c21"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "newsletter_subscriptions",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("email", sa.String(254), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="1"),
        sa.Column("email_status", sa.String(30), nullable=False, server_default="PENDING"),
        sa.Column("email_error", sa.String(500), nullable=True),
        sa.Column("subscribed_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_newsletter_subscriptions_email", "newsletter_subscriptions", ["email"], unique=True)
    op.create_index("ix_newsletter_subscriptions_is_active", "newsletter_subscriptions", ["is_active"])
    op.create_index("ix_newsletter_subscriptions_subscribed_at", "newsletter_subscriptions", ["subscribed_at"])


def downgrade() -> None:
    op.drop_table("newsletter_subscriptions")
