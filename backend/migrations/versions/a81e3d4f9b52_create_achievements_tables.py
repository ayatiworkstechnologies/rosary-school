"""create achievements tables

Revision ID: a81e3d4f9b52
Revises: f14c7b8e2a91
Create Date: 2026-10-27 15:15:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "a81e3d4f9b52"
down_revision: Union[str, Sequence[str], None] = "f14c7b8e2a91"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table("achievements", sa.Column("id", sa.Integer(), nullable=False), sa.Column("achievement_type", sa.Enum("PHOTO", "VIDEO", name="achievement_type", native_enum=False), nullable=False), sa.Column("title", sa.String(255), nullable=False), sa.Column("category", sa.String(120), nullable=False), sa.Column("achievement_date", sa.Date(), nullable=False), sa.Column("year", sa.Integer(), nullable=False), sa.Column("is_active", sa.Boolean(), server_default="1", nullable=False), sa.Column("display_order", sa.Integer(), server_default="1", nullable=False), sa.Column("poster_image_url", sa.String(500), nullable=True), sa.Column("video_source", sa.Enum("youtube", "uploaded", name="achievement_video_source", native_enum=False), nullable=True), sa.Column("youtube_url", sa.String(500), nullable=True), sa.Column("video_url", sa.String(500), nullable=True), sa.Column("created_by_id", sa.Integer(), nullable=True), sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False), sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False), sa.ForeignKeyConstraint(["created_by_id"], ["admins.id"], ondelete="SET NULL"), sa.PrimaryKeyConstraint("id"))
    for column in ("achievement_type", "category", "achievement_date", "year", "is_active", "display_order", "created_by_id"):
        op.create_index(f"ix_achievements_{column}", "achievements", [column], unique=False)
    op.create_table("achievement_images", sa.Column("id", sa.Integer(), nullable=False), sa.Column("achievement_id", sa.Integer(), nullable=False), sa.Column("image_url", sa.String(500), nullable=False), sa.Column("alt_text", sa.String(255), nullable=False), sa.Column("display_order", sa.Integer(), server_default="1", nullable=False), sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False), sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False), sa.ForeignKeyConstraint(["achievement_id"], ["achievements.id"], ondelete="CASCADE"), sa.PrimaryKeyConstraint("id"))
    op.create_index("ix_achievement_images_achievement_id", "achievement_images", ["achievement_id"], unique=False)
    op.create_index("ix_achievement_images_display_order", "achievement_images", ["display_order"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_achievement_images_display_order", table_name="achievement_images")
    op.drop_index("ix_achievement_images_achievement_id", table_name="achievement_images")
    op.drop_table("achievement_images")
    for column in ("created_by_id", "display_order", "is_active", "year", "achievement_date", "category", "achievement_type"):
        op.drop_index(f"ix_achievements_{column}", table_name="achievements")
    op.drop_table("achievements")
