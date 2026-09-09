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

from fastapi.staticfiles import (
    StaticFiles,
)

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


# =========================================================
# ADMIN API ROUTERS
# =========================================================

from app.api.v1.admin.auth import (
    router as admin_auth_router,
)

from app.api.v1.admin.news import (
    router as admin_news_router,
)

from app.api.v1.admin.uploads import (
    router as admin_upload_router,
)

from app.api.v1.admin.events import (
    router as admin_events_router,
)

from app.api.v1.admin.circular_notices import (
    router as admin_circular_notices_router,
)

from app.api.v1.admin.circular_notice_uploads import (
    router as admin_circular_notice_upload_router,
)

from app.api.v1.admin.gallery_uploads import (
    router as admin_gallery_upload_router,
)

from app.api.v1.admin.gallery import (
    router as admin_gallery_router,
)


# =========================================================
# PUBLIC API ROUTERS
# =========================================================

from app.api.v1.public.news import (
    router as public_news_router,
)

from app.api.v1.public.events import (
    router as public_events_router,
)

from app.api.v1.public.circular_notices import (
    router as public_circular_notices_router,
)

from app.api.v1.public.gallery import (
    router as public_gallery_router,
)


# =========================================================
# CONFIG + DATABASE
# =========================================================

from app.core.config import settings
from app.db.session import engine


# =========================================================
# LOGGING
# =========================================================

logger = logging.getLogger(
    __name__
)


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

    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],

    # Required because Admin authentication
    # uses HttpOnly cookies.
    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ],
)


# =========================================================
# ADMIN ROUTERS
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
# ADMIN GENERAL FILE UPLOADS
# ---------------------------------------------------------

app.include_router(
    admin_upload_router
)


# ---------------------------------------------------------
# ADMIN EVENTS MANAGEMENT
# ---------------------------------------------------------

app.include_router(
    admin_events_router
)


# ---------------------------------------------------------
# ADMIN CIRCULARS + NOTICES MANAGEMENT
# ---------------------------------------------------------

app.include_router(
    admin_circular_notices_router
)


# ---------------------------------------------------------
# ADMIN CIRCULAR / NOTICE PDF UPLOAD
# ---------------------------------------------------------

app.include_router(
    admin_circular_notice_upload_router
)


# ---------------------------------------------------------
# ADMIN GALLERY IMAGE UPLOAD
#
# POST
# /api/v1/admin/uploads/gallery-images
# ---------------------------------------------------------

app.include_router(
    admin_gallery_upload_router
)


# ---------------------------------------------------------
# ADMIN GALLERY MANAGEMENT
#
# Albums:
#
# GET
# /api/v1/admin/gallery/albums
#
# POST
# /api/v1/admin/gallery/albums
#
# GET
# /api/v1/admin/gallery/albums/{album_id}
#
# PATCH
# /api/v1/admin/gallery/albums/{album_id}
#
# DELETE
# /api/v1/admin/gallery/albums/{album_id}
#
#
# Images:
#
# POST
# /api/v1/admin/gallery/albums/{album_id}/images
#
# GET
# /api/v1/admin/gallery/images/{image_id}
#
# PATCH
# /api/v1/admin/gallery/images/{image_id}
#
# DELETE
# /api/v1/admin/gallery/images/{image_id}
# ---------------------------------------------------------

app.include_router(
    admin_gallery_router
)


# =========================================================
# PUBLIC ROUTERS
# =========================================================


# ---------------------------------------------------------
# PUBLIC NEWS + ANNOUNCEMENTS
# ---------------------------------------------------------

app.include_router(
    public_news_router
)


# ---------------------------------------------------------
# PUBLIC EVENTS
# ---------------------------------------------------------

app.include_router(
    public_events_router
)


# ---------------------------------------------------------
# PUBLIC CIRCULARS + NOTICES
# ---------------------------------------------------------

app.include_router(
    public_circular_notices_router
)


# ---------------------------------------------------------
# PUBLIC GALLERY
#
# GET
# /api/v1/gallery/albums
#
# GET
# /api/v1/gallery/albums?year=2026
#
# GET
# /api/v1/gallery/homepage
# ---------------------------------------------------------

app.include_router(
    public_gallery_router
)


# =========================================================
# UPLOAD DIRECTORY
# =========================================================

# main.py:
#
# backend/app/main.py
#
# parent
# -> backend/app
#
# parent.parent
# -> backend

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


# Automatically create:
#
# backend/uploads/
#
# if it does not exist.

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =========================================================
# SERVE UPLOADED FILES
# =========================================================

# Example News image:
#
# Physical:
#
# backend/uploads/news/example.jpg
#
# URL:
#
# http://localhost:8000/uploads/news/example.jpg
#
#
# Circular / Notice PDF:
#
# Physical:
#
# backend/uploads/circulars/example.pdf
#
# URL:
#
# http://localhost:8000/uploads/circulars/example.pdf
#
#
# Gallery image:
#
# Physical:
#
# backend/uploads/gallery/example.jpg
#
# URL:
#
# http://localhost:8000/uploads/gallery/example.jpg

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
    tags=[
        "System"
    ],
)
def root():

    return {
        "message":
            "Rosary School Backend API",

        "status":
            "running",

        "version":
            "1.0.0",
    }


# =========================================================
# APPLICATION HEALTH
# =========================================================

@app.get(
    "/health",
    tags=[
        "System"
    ],
)
def health_check():

    return {
        "status":
            "healthy",

        "service":
            "rosary-school-backend",
    }


# =========================================================
# DATABASE HEALTH
# =========================================================

@app.get(
    "/health/database",
    tags=[
        "System"
    ],
)
def database_health_check():

    try:

        with engine.connect() as connection:

            connection.execute(
                text(
                    "SELECT 1"
                )
            )


        return {
            "status":
                "healthy",

            "database":
                "connected",
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