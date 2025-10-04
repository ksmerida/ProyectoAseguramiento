from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from pydantic import BaseModel
from typing import Optional

from app import schemas, crud
from app.database import get_db
from app.auth.hashing import Hasher
from app.auth.jwt_handler import create_access_token, create_refresh_token, decode_token
from app.core.config import settings

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# =======================
# RESPONSE MODELS
# =======================
class UserResponse(BaseModel):
    id: str
    username: str
    email: Optional[str]
    role: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


# =======================
# LOGIN
# =======================
@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    username_or_email = form_data.username
    password = form_data.password

    # Buscar usuario
    user = crud.get_user_by_username(db, username_or_email)
    if not user:
        user = crud.get_user_by_email(db, username_or_email)

    if not user or not Hasher.verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo"
        )

    # Actualizar last_login
    user.last_login = datetime.utcnow()
    db.commit()
    db.refresh(user)

    # Crear tokens
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )

    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    refresh_token = create_refresh_token(
        data={"sub": user.username},
        expires_delta=refresh_token_expires
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user={
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
            "role": user.role.name  # <- asegúrate que User tenga relación con Role
        }
    )


# =======================
# GET CURRENT USER
# =======================
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = decode_token(token)
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Token inválido")
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido")

    user = crud.get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    return user


@router.get("/me", response_model=schemas.User)
def read_current_user(current_user: schemas.User = Depends(get_current_user)):
    return current_user


# =======================
# CHANGE PASSWORD
# =======================
class PasswordChange(BaseModel):
    old_password: str
    new_password: str


@router.post("/change-password")
def change_password(
    password_data: PasswordChange,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = crud.get_user(db, current_user.id)
    if not Hasher.verify_password(password_data.old_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Contraseña actual incorrecta")

    user.password_hash = Hasher.get_password_hash(password_data.new_password)
    db.commit()
    db.refresh(user)
    return {"msg": "Contraseña actualizada correctamente"}


# =======================
# REFRESH TOKEN
# =======================
class RefreshTokenRequest(BaseModel):
    refresh_token: str


@router.post("/refresh-token", response_model=TokenResponse)
def refresh_access_token(
    token_request: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    try:
        payload = decode_token(token_request.refresh_token)
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Refresh token inválido")
    except Exception:
        raise HTTPException(status_code=401, detail="Refresh token inválido o expirado")

    user = crud.get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    # Crear nuevo access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=token_request.refresh_token,
        user={
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
            "role": user.role.name
        }
    )
