from datetime import datetime

from pydantic import BaseModel


# --- Schematy Podstawowe ---

class SinglePrediction(BaseModel):
    """Pojedyncza predykcja (jedna z top 3)."""
    predicted_class: str
    tree_id: str
    confidence: float


# --- Schematy do Odczytu ---

class PredictionHistoryItem(BaseModel):
    """Element listy historii (widok skrócony)."""
    id: int
    predicted_class: str
    tree_id: str
    confidence: float
    thumbnail_url: str
    created_at: datetime

    class Config:
        from_attributes = True


class PredictionHistoryDetail(BaseModel):
    """Szczegóły pojedynczej predykcji."""
    id: int
    predicted_class: str
    tree_id: str
    confidence: float
    all_predictions: list[SinglePrediction]
    image_urls: list[str]
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedHistoryResponse(BaseModel):
    """Odpowiedź z paginacją dla listy historii."""
    items: list[PredictionHistoryItem]
    next_cursor: str | None
    has_more: bool


# --- Schematy do Operacji ---

class PredictionCreate(BaseModel):
    """Dane do utworzenia wpisu w historii."""
    user_id: int
    predicted_class: str
    tree_id: str
    confidence: float
    all_predictions: list[SinglePrediction]
    image_paths: list[str]
