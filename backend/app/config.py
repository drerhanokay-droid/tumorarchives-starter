from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    app_env: str = Field(default='development', alias='APP_ENV')
    secret_key: str = Field(default='change-this-in-production', alias='SECRET_KEY')
    database_url: str = Field(default='sqlite:///./tumorarchives_license.db', alias='DATABASE_URL')
    access_token_minutes: int = Field(default=60 * 24 * 30, alias='ACCESS_TOKEN_MINUTES')


settings = Settings()
