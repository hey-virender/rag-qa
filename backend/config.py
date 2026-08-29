from pydantic_settings import BaseSettings,SettingsConfigDict
from pydantic import SecretStr


class Settings(BaseSettings):
  model_config = SettingsConfigDict(env_file=".env")
  groq_api_key: SecretStr
  groq_model: str = "openai/gpt-oss-120b"

settings = Settings() # type: ignore[call-arg]