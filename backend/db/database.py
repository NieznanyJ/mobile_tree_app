from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from core.config import settings

# Tworzymy silnik SQLAlchemy
# connect_args={"check_same_thread": False} jest potrzebne tylko dla SQLite,
# aby zezwolić na używanie sesji w wielu wątkach (co robi FastAPI)
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Tworzymy klasę SessionLocal, która będzie fabryką sesji do bazy danych
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Tworzymy klasę bazową Base, po której będą dziedziczyć nasze modele ORM
Base = declarative_base()


# Dependency - funkcja, która będzie wstrzykiwana do endpointów
def get_db():
    """
    Funkcja dostarczająca sesję do bazy danych dla pojedynczego cyklu
    zapytanie-odpowiedź. Automatycznie zamyka sesję po zakończeniu.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()