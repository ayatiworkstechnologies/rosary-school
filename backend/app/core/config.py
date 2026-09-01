from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # =========================================================
    # APPLICATION
    # =========================================================

    APP_NAME: str = "Rosary School API"
    APP_ENV: str = "development"

    FRONTEND_URL: str = "http://localhost:3000"

    # =========================================================
    # DATABASE
    # =========================================================

    DB_HOST: str
    DB_PORT: int = 3306
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str = ""

    # =========================================================
    # AUTHENTICATION / JWT
    # =========================================================

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    COOKIE_SECURE: bool = False

    # =========================================================
    # SETTINGS
    # =========================================================

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()