from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    app_env: str = Field(default='development', alias='APP_ENV')
    secret_key: str = Field(default='change-this-in-production', alias='SECRET_KEY')
    database_url: str = Field(default='sqlite:///./tumorarchives_license.db', alias='DATABASE_URL')
    access_token_minutes: int = Field(default=60 * 24 * 30, alias='ACCESS_TOKEN_MINUTES')
    cors_allow_origins: str = Field(
        default='http://localhost:3000,http://127.0.0.1:3000',
        alias='CORS_ALLOW_ORIGINS',
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allow_origins.split(',') if origin.strip()]


settings = Settings()
