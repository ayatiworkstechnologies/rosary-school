import logging

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.api.v1.admin.auth import router as admin_auth_router
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

    # These frontend origins are allowed to call FastAPI.
    allow_origins=[
        settings.FRONTEND_URL,
        "http://127.0.0.1:3000",
    ],

    # Required because authentication uses cookies.
    allow_credentials=True,

    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# API ROUTERS
# =========================================================

app.include_router(
    admin_auth_router
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
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Database connection failed. "
                "Check the backend terminal for details."
            ),
        ) from error