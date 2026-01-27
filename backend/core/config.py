import secrets
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS - domeny dozwolone dla requestów cross-origin
    # W produkcji ustaw na konkretne domeny, np. "https://myapp.com,https://api.myapp.com"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:8081,http://192.168.1.104:8081,http://192.168.1.104:19006"

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        """Walidacja że SECRET_KEY nie jest domyślny/słaby."""
        weak_keys = [
            "a_very_secret_key_that_you_should_change",
            "secret",
            "changeme",
            "password",
        ]
        if v.lower() in weak_keys or len(v) < 32:
            raise ValueError(
                "SECRET_KEY jest zbyt słaby! "
                "Użyj: python -c \"import secrets; print(secrets.token_urlsafe(32))\" "
                "aby wygenerować bezpieczny klucz."
            )
        return v

    @property
    def cors_origins_list(self) -> list[str]:
        """Zwraca listę dozwolonych origins dla CORS."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8')


settings = Settings()
