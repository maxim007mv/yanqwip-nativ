from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..deps import get_db, get_current_user
from ..security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    hash_refresh_token,
    verify_password,
    decode_token,
    TokenError,
)
from ..config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.execute(select(models.User).where(models.User.email == user_in.email)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email уже зарегистрирован")

    user = models.User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.execute(select(models.User).where(models.User.email == credentials.email)).scalar_one_or_none()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Некорректный email или пароль")

    access_token = create_access_token(str(user.id))
    refresh_token, expires_at = create_refresh_token(str(user.id))

    token_hash_value = hash_refresh_token(refresh_token)
    db.add(models.RefreshToken(token_hash=token_hash_value, user_id=user.id, expires_at=expires_at))
    db.commit()

    return schemas.Token(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.post("/refresh", response_model=schemas.TokenRefreshResponse)
def refresh(token_request: schemas.TokenRefreshRequest, db: Session = Depends(get_db)):
    try:
        payload = decode_token(token_request.refresh_token)
    except TokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный refresh токен")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный тип токена")

    token_hash_value = hash_refresh_token(token_request.refresh_token)
    stored_token = db.execute(select(models.RefreshToken).where(models.RefreshToken.token_hash == token_hash_value)).scalar_one_or_none()
    if not stored_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Токен отозван")

    if stored_token.expires_at < datetime.utcnow():
        db.delete(stored_token)
        db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Срок действия токена истёк")

    access_token = create_access_token(payload.get("sub"))
    return schemas.TokenRefreshResponse(
        access_token=access_token,
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(token_request: schemas.TokenRefreshRequest, db: Session = Depends(get_db)):
    token_hash_value = hash_refresh_token(token_request.refresh_token)
    stored_token = db.execute(select(models.RefreshToken).where(models.RefreshToken.token_hash == token_hash_value)).scalar_one_or_none()
    if stored_token:
        db.delete(stored_token)
        db.commit()
    return None


@router.get("/me", response_model=schemas.UserRead)
def read_current_user(user: models.User = Depends(get_current_user)):
    return user


@router.put("/me", response_model=schemas.UserRead)
def update_current_user(user_update: schemas.UserUpdate, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


