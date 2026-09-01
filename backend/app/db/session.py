from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings


# =========================================================
# DATABASE URL
# =========================================================

DATABASE_URL = URL.create(
    drivername="mysql+pymysql",
    username=settings.DB_USER,
    password=settings.DB_PASSWORD,
    host=settings.DB_HOST,
    port=settings.DB_PORT,
    database=settings.DB_NAME,
)


# =========================================================
# SQLALCHEMY ENGINE
# =========================================================

engine = create_engine(
    DATABASE_URL,

    # Check whether an existing pooled connection is still alive
    pool_pre_ping=True,

    # Refresh connections periodically
    pool_recycle=280,

    # Keep SQL logs disabled for cleaner output
    echo=False,
)


# =========================================================
# DATABASE SESSION FACTORY
# =========================================================

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    expire_on_commit=False,
)


# =========================================================
# FASTAPI DATABASE DEPENDENCY
# =========================================================

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()