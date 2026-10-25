"""add newsletter and public URL mail settings

Revision ID: d1e64a7f9b43
Revises: c9f53b0e4d32
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "d1e64a7f9b43"
down_revision: Union[str, Sequence[str], None] = "c9f53b0e4d32"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("mail_routing_settings", sa.Column("newsletter_to", sa.String(1000), nullable=False, server_default=""))
    op.add_column("mail_routing_settings", sa.Column("newsletter_cc", sa.String(1000), nullable=False, server_default=""))
    op.add_column("mail_routing_settings", sa.Column("newsletter_bcc", sa.String(1000), nullable=False, server_default=""))
    op.add_column("mail_routing_settings", sa.Column("newsletter_reply_to", sa.String(254), nullable=False, server_default=""))
    op.add_column("mail_routing_settings", sa.Column("newsletter_ack_enabled", sa.Boolean(), nullable=False, server_default="1"))
    op.add_column("mail_routing_settings", sa.Column("backend_public_url", sa.String(500), nullable=False, server_default="http://127.0.0.1:8000"))


def downgrade() -> None:
    op.drop_column("mail_routing_settings", "backend_public_url")
    op.drop_column("mail_routing_settings", "newsletter_ack_enabled")
    op.drop_column("mail_routing_settings", "newsletter_reply_to")
    op.drop_column("mail_routing_settings", "newsletter_bcc")
    op.drop_column("mail_routing_settings", "newsletter_cc")
    op.drop_column("mail_routing_settings", "newsletter_to")
