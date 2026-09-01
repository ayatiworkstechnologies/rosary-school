from logging.config import fileConfig

from alembic import context

from sqlalchemy import create_engine
from sqlalchemy import pool

from app.db.base import Base
from app.db.session import DATABASE_URL

# =========================================================
# IMPORTANT:
# Import models so SQLAlchemy knows about them
# =========================================================

from app.models.admin import Admin  # noqa: F401


# =========================================================
# ALEMBIC CONFIG
# =========================================================

config = context.config


if config.config_file_name is not None:
    fileConfig(
        config.config_file_name
    )


# =========================================================
# SQLALCHEMY METADATA
# =========================================================

target_metadata = Base.metadata


# =========================================================
# OFFLINE MIGRATIONS
# =========================================================

def run_migrations_offline() -> None:
    url = DATABASE_URL.render_as_string(
        hide_password=False
    )

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={
            "paramstyle": "named"
        },
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


# =========================================================
# ONLINE MIGRATIONS
# =========================================================

def run_migrations_online() -> None:
    connectable = create_engine(
        DATABASE_URL,
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


# =========================================================
# RUN
# =========================================================

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()