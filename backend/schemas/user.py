from pydantic import BaseModel, EmailStr


# --- Schematy Podstawowe ---
# Zawierają pola, które są wspólne dla innych schematów.
class UserBase(BaseModel):
    email: EmailStr
    username: str


# --- Schematy do Operacji ---

# Schemat używany przy tworzeniu nowego użytkownika (rejestracji).
# Oczekujemy tu hasła.
class UserCreate(UserBase):
    password: str


# --- Schematy do Odczytu ---

# Schemat używany przy odczytywaniu danych użytkownika z bazy i zwracaniu ich przez API.
# Nie zawiera hasła, dla bezpieczeństwa.
class User(UserBase):
    id: int
    is_active: bool

    # Konfiguracja, która pozwala Pydantic na odczyt danych z modelu SQLAlchemy.
    class Config:
        from_attributes = True
