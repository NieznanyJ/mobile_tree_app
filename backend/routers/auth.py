from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import (
    OAuth2PasswordRequestForm,
    HTTPBearer,
    HTTPAuthorizationCredentials,
)
from sqlalchemy.orm import Session

from core.security import create_access_token, verify_access_token
from db.database import get_db
from schemas.token import LoginResponse, Token
from schemas.user import User, UserCreate
from services import user_service

router = APIRouter()
security = HTTPBearer()


@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Endpoint do rejestracji nowego użytkownika.
    """
    db_user_by_email = user_service.get_user_by_email(db, email=user.email)
    if db_user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"field": "email", "message": "Użytkownik o tym adresie email już istnieje."},
        )

    db_user_by_username = user_service.get_user_by_username(db, username=user.username)
    if db_user_by_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"field": "username", "message": "Ta nazwa użytkownika jest już zajęta."},
        )
    
    new_user = user_service.create_user(db=db, user=user)
    return new_user


@router.post("/login", response_model=LoginResponse)
def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
):
    """
    Loguje użytkownika i zwraca token dostępowy wraz z danymi użytkownika.
    """
    user = user_service.authenticate_user(
        db, username=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nieprawidłowa nazwa użytkownika lub hasło",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    
    # Zwracamy obiekt zgodny z nowym schematem LoginResponse
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=User)
def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    db: Session = Depends(get_db),
):
    """
    Endpoint zwracający dane aktualnie zalogowanego użytkownika.
    Wymaga tokenu w nagłówku Authorization.
    """
    token = credentials.credentials
    email = verify_access_token(token)
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nieprawidłowy lub wygasły token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = user_service.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Użytkownik nie znaleziony",
        )
    
    return user