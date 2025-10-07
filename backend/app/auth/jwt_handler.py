from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import HTTPException, status
from app.core.config import settings

# ========================
# FUNCIONES DE JWT
# ========================

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Crea un JWT de acceso con expiración.

    Args:
        data (dict): Datos a codificar en el token (ej. {"sub": username})
        expires_delta (timedelta, optional): Tiempo de expiración del token.

    Returns:
        str: Token JWT codificado
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Crea un JWT de refresh con expiración más larga.

    Args:
        data (dict): Datos a codificar en el token (ej. {"sub": username})
        expires_delta (timedelta, optional): Tiempo de expiración del token.

    Returns:
        str: Refresh token JWT codificado
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> dict:
    """
    Decodifica un JWT y verifica su validez.

    Args:
        token (str): Token JWT

    Returns:
        dict: Payload del token
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_username_from_token(token: str) -> str:
    """
    Extrae el username del token.

    Args:
        token (str): Token JWT

    Returns:
        str: Username del usuario
    """
    payload = decode_token(token)
    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido: campo 'sub' no encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return username
