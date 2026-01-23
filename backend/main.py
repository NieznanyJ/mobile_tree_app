from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.database import Base, engine
from models import user  # Importujemy, aby model został "zauważony" przez SQLAlchemy

from routers import auth, prediction

# Ta linia tworzy w bazie danych tabele zdefiniowane w modelach,
# które dziedziczą po klasie Base.
# W naszym przypadku stworzy tabelę "users".
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SMART TREE API",
    description="API dla aplikacji mobilnej SMART TREE.",
    version="0.1.0",
)

# Konfiguracja CORS
# W trybie deweloperskim używamy "*", aby zezwolić na żądania z dowolnego źródła.
# W produkcji należy to zmienić na listę dozwolonych domen.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dołączamy router z endpointami autoryzacji
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Dołączamy router z endpointem do predykcji
app.include_router(prediction.router, prefix="/predict", tags=["Prediction"])


@app.get("/")
def read_root():
    """
    Główny endpoint, który pozwala sprawdzić, czy API działa.
    """
    return {"message": "Witaj w SMART TREE API!"}