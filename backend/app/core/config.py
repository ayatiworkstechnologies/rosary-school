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

    # Email notifications (optional in local development)
    SMTP_HOST: str = ""
    # Optional IP/address used only for the TCP connection when local DNS is
    # unreliable. SMTP_HOST remains the TLS certificate/server name.
    SMTP_CONNECT_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""
    SMTP_FROM_NAME: str = "Rosary School Website"
    SMTP_USE_TLS: bool = True

    CONTACT_MAIL_TO: str = ""
    CONTACT_MAIL_CC: str = ""
    CONTACT_MAIL_BCC: str = ""
    CONTACT_REPLY_TO: str = ""
    CONTACT_ACKNOWLEDGEMENT_ENABLED: bool = True
    ADMISSION_MAIL_TO: str = ""
    ADMISSION_MAIL_CC: str = ""
    ADMISSION_MAIL_BCC: str = ""
    ADMISSION_REPLY_TO: str = ""
    ADMISSION_ACKNOWLEDGEMENT_ENABLED: bool = True
    NEWSLETTER_MAIL_TO: str = ""
    NEWSLETTER_MAIL_CC: str = ""
    NEWSLETTER_MAIL_BCC: str = ""
    NEWSLETTER_REPLY_TO: str = ""
    NEWSLETTER_ACKNOWLEDGEMENT_ENABLED: bool = True
    BACKEND_PUBLIC_URL: str = "http://127.0.0.1:8000"

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
