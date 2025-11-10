from sqlalchemy.orm import Session

from core.security import hash_password, verify_password
from models.user import User
from schemas.user import UserCreate


def get_user_by_email(db: Session, email: str) -> User | None:
    """
    Pobiera użytkownika z bazy danych na podstawie adresu e-mail.
    """
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> User | None:
    """
    Pobiera użytkownika z bazy danych na podstawie nazwy użytkownika.
    """
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, user: UserCreate) -> User:
    """
    Tworzy nowego użytkownika w bazie danych.
    """
    # Hashujemy hasło przed zapisem
    hashed_pass = hash_password(user.password)

    # Tworzymy obiekt modelu SQLAlchemy na podstawie danych ze schematu Pydantic
    # Pamiętaj, aby nie przekazywać `user.password` bezpośrednio!
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_pass
    )

    # Dodajemy nowy obiekt do sesji
    db.add(db_user)
    # Zapisujemy zmiany w bazie danych
    db.commit()
    # Odświeżamy obiekt, aby pobrać jego nowe dane (np. ID nadane przez bazę)
    db.refresh(db_user)

    return db_user


def authenticate_user(db: Session, username: str, password: str) -> User | None:
    """
    Autentykuje użytkownika. Zwraca obiekt użytkownika w przypadku sukcesu,
    lub None w przypadku porażki.
    """
    user = get_user_by_username(db, username=username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
