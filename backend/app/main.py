import logging
from pathlib import Path

from fastapi import (
    FastAPI,
    HTTPException,
    status,
)
from fastapi.middleware.cors import (
    CORSMiddleware,
)
from fastapi.staticfiles import StaticFiles

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.api.v1.admin.auth import (
    router as admin_auth_router,
)

from app.api.v1.admin.news import (
    router as admin_news_router,
)

from app.api.v1.admin.uploads import (
    router as admin_upload_router,
)

from app.api.v1.public.news import (
    router as public_news_router,
)

from app.core.config import settings
from app.db.session import engine


# =========================================================
# LOGGING
# =========================================================

logger = logging.getLogger(__name__)


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "Backend API for Rosary School Website "
        "and Admin Dashboard"
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,

    # Frontend origins allowed to call FastAPI.
    allow_origins=[
        settings.FRONTEND_URL,
        "http://127.0.0.1:3000",
    ],

    # Required because Admin authentication
    # uses HttpOnly cookies.
    allow_credentials=True,

    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# API ROUTERS
# =========================================================

# ---------------------------------------------------------
# ADMIN AUTHENTICATION
# ---------------------------------------------------------

app.include_router(
    admin_auth_router
)


# ---------------------------------------------------------
# ADMIN NEWS + ANNOUNCEMENT MANAGEMENT
# ---------------------------------------------------------

app.include_router(
    admin_news_router
)


# ---------------------------------------------------------
# ADMIN FILE UPLOADS
# ---------------------------------------------------------

app.include_router(
    admin_upload_router
)


# ---------------------------------------------------------
# PUBLIC NEWS + ANNOUNCEMENTS
# ---------------------------------------------------------

app.include_router(
    public_news_router
)


# =========================================================
# UPLOAD DIRECTORY
# =========================================================

# main.py:
#
# backend/app/main.py
#
# parent        -> backend/app
# parent.parent -> backend

BACKEND_ROOT = (
    Path(__file__)
    .resolve()
    .parent
    .parent
)


UPLOAD_DIR = (
    BACKEND_ROOT
    / "uploads"
)


# Create backend/uploads/
# automatically if it does not exist.

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =========================================================
# SERVE UPLOADED FILES
# =========================================================

# Example:
#
# Physical:
# backend/uploads/news/example.jpg
#
# Browser:
# http://localhost:8000/uploads/news/example.jpg

app.mount(
    "/uploads",
    StaticFiles(
        directory=str(
            UPLOAD_DIR
        )
    ),
    name="uploads",
)


# =========================================================
# ROOT
# =========================================================

@app.get(
    "/",
    tags=["System"],
)
def root():
    return {
        "message": "Rosary School Backend API",
        "status": "running",
        "version": "1.0.0",
    }


# =========================================================
# APPLICATION HEALTH
# =========================================================

@app.get(
    "/health",
    tags=["System"],
)
def health_check():
    return {
        "status": "healthy",
        "service": "rosary-school-backend",
    }


# =========================================================
# DATABASE HEALTH
# =========================================================

@app.get(
    "/health/database",
    tags=["System"],
)
def database_health_check():
    try:
        with engine.connect() as connection:
            connection.execute(
                text("SELECT 1")
            )

        return {
            "status": "healthy",
            "database": "connected",
        }

    except SQLAlchemyError as error:
        logger.exception(
            "Database connection failed"
        )

        raise HTTPException(
            status_code=(
                status.HTTP_503_SERVICE_UNAVAILABLE
            ),
            detail=(
                "Database connection failed. "
                "Check the backend terminal for details."
            ),
        ) from error