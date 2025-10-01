from dotenv import load_dotenv
import os

# Carga variables de entorno desde .env
load_dotenv()


class Settings:
    # --------------------
    # BASE DE DATOS
    # --------------------
    DATABASE_URL: str = os.getenv("DATABASE_URL")

    # --------------------
    # JWT
    # --------------------
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change_this_secret")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))


# Instancia global para usar en toda la app
settings = Settings()
