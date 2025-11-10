from fastapi import FastAPI

from db.database import Base, engine
from models import user  # Importujemy, aby model został "zauważony" przez SQLAlchemy

from routers import auth

# Ta linia tworzy w bazie danych tabele zdefiniowane w modelach,
# które dziedziczą po klasie Base.
# W naszym przypadku stworzy tabelę "users".
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TreeVision API",
    description="API dla aplikacji mobilnej TreeVision.",
    version="0.1.0",
)

# Dołączamy router z endpointami autoryzacji
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])


@app.get("/")
def read_root():
    """
    Główny endpoint, który pozwala sprawdzić, czy API działa.
    """
    return {"message": "Witaj w TreeVision API!"}