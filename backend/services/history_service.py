"""
Serwis do zarządzania historią predykcji.
"""
from datetime import datetime

from sqlalchemy.orm import Session

from models.prediction import PredictionHistory
from schemas.prediction import PredictionCreate, SinglePrediction
from services.file_storage import delete_prediction_images, get_image_url

# Maksymalna liczba predykcji na użytkownika
MAX_PREDICTIONS_PER_USER = 50


def create_prediction_history(
    db: Session,
    data: PredictionCreate
) -> PredictionHistory:
    """
    Tworzy nowy wpis w historii predykcji.
    Jeśli użytkownik ma więcej niż 50 predykcji, usuwa najstarszą.

    Args:
        db: Sesja bazy danych
        data: Dane predykcji

    Returns:
        Utworzony wpis PredictionHistory
    """
    # Sprawdź liczbę predykcji użytkownika i usuń najstarsze jeśli przekroczono limit
    _enforce_prediction_limit(db, data.user_id)

    # Konwertuj all_predictions do formatu JSON
    all_predictions_json = [
        {"predicted_class": p.predicted_class, "tree_id": p.tree_id, "confidence": p.confidence}
        for p in data.all_predictions
    ]

    db_prediction = PredictionHistory(
        user_id=data.user_id,
        predicted_class=data.predicted_class,
        tree_id=data.tree_id,
        confidence=data.confidence,
        all_predictions=all_predictions_json,
        image_paths=data.image_paths,
    )

    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)

    return db_prediction


def get_user_predictions(
    db: Session,
    user_id: int,
    limit: int = 10,
    cursor: datetime | None = None
) -> tuple[list[PredictionHistory], str | None, bool]:
    """
    Pobiera historię predykcji użytkownika z paginacją.

    Args:
        db: Sesja bazy danych
        user_id: ID użytkownika
        limit: Liczba wyników do pobrania
        cursor: Kursor (created_at) dla paginacji

    Returns:
        Tuple: (lista predykcji, next_cursor, has_more)
    """
    query = db.query(PredictionHistory).filter(
        PredictionHistory.user_id == user_id
    )

    if cursor:
        query = query.filter(PredictionHistory.created_at < cursor)

    # Pobierz o 1 więcej niż limit, żeby sprawdzić czy są następne
    predictions = query.order_by(
        PredictionHistory.created_at.desc()
    ).limit(limit + 1).all()

    has_more = len(predictions) > limit
    if has_more:
        predictions = predictions[:limit]

    next_cursor = None
    if has_more and predictions:
        next_cursor = predictions[-1].created_at.isoformat()

    return predictions, next_cursor, has_more


def get_prediction_by_id(
    db: Session,
    prediction_id: int,
    user_id: int
) -> PredictionHistory | None:
    """
    Pobiera pojedynczą predykcję po ID.
    Sprawdza czy należy do użytkownika.

    Args:
        db: Sesja bazy danych
        prediction_id: ID predykcji
        user_id: ID użytkownika (weryfikacja właściciela)

    Returns:
        PredictionHistory lub None jeśli nie znaleziono
    """
    return db.query(PredictionHistory).filter(
        PredictionHistory.id == prediction_id,
        PredictionHistory.user_id == user_id
    ).first()


def delete_prediction(
    db: Session,
    prediction_id: int,
    user_id: int
) -> bool:
    """
    Usuwa predykcję i jej obrazy.

    Args:
        db: Sesja bazy danych
        prediction_id: ID predykcji
        user_id: ID użytkownika

    Returns:
        True jeśli usunięto, False jeśli nie znaleziono
    """
    prediction = get_prediction_by_id(db, prediction_id, user_id)
    if not prediction:
        return False

    # Usuń pliki z dysku
    delete_prediction_images(prediction.image_paths)

    # Usuń z bazy
    db.delete(prediction)
    db.commit()

    return True


def delete_all_predictions(db: Session, user_id: int) -> int:
    """
    Usuwa wszystkie predykcje użytkownika.

    Args:
        db: Sesja bazy danych
        user_id: ID użytkownika

    Returns:
        Liczba usuniętych predykcji
    """
    predictions = db.query(PredictionHistory).filter(
        PredictionHistory.user_id == user_id
    ).all()

    count = len(predictions)

    # Usuń pliki z dysku
    for prediction in predictions:
        delete_prediction_images(prediction.image_paths)

    # Usuń z bazy
    db.query(PredictionHistory).filter(
        PredictionHistory.user_id == user_id
    ).delete()
    db.commit()

    return count


def get_user_prediction_count(db: Session, user_id: int) -> int:
    """
    Zwraca liczbę predykcji użytkownika.

    Args:
        db: Sesja bazy danych
        user_id: ID użytkownika

    Returns:
        Liczba predykcji
    """
    return db.query(PredictionHistory).filter(
        PredictionHistory.user_id == user_id
    ).count()


def _enforce_prediction_limit(db: Session, user_id: int) -> None:
    """
    Wymusza limit predykcji, usuwając najstarsze jeśli przekroczono.

    Args:
        db: Sesja bazy danych
        user_id: ID użytkownika
    """
    count = get_user_prediction_count(db, user_id)

    # Jeśli osiągnięto limit, usuń najstarszą predykcję
    while count >= MAX_PREDICTIONS_PER_USER:
        oldest = db.query(PredictionHistory).filter(
            PredictionHistory.user_id == user_id
        ).order_by(PredictionHistory.created_at.asc()).first()

        if oldest:
            delete_prediction_images(oldest.image_paths)
            db.delete(oldest)
            db.commit()
            count -= 1
        else:
            break


def prediction_to_item_response(prediction: PredictionHistory) -> dict:
    """
    Konwertuje PredictionHistory do formatu odpowiedzi listy.

    Args:
        prediction: Obiekt PredictionHistory

    Returns:
        Słownik z danymi do odpowiedzi
    """
    thumbnail_url = ""
    if prediction.image_paths:
        thumbnail_url = get_image_url(prediction.image_paths[0])

    return {
        "id": prediction.id,
        "predicted_class": prediction.predicted_class,
        "tree_id": prediction.tree_id,
        "confidence": prediction.confidence,
        "thumbnail_url": thumbnail_url,
        "created_at": prediction.created_at,
    }


def prediction_to_detail_response(prediction: PredictionHistory) -> dict:
    """
    Konwertuje PredictionHistory do formatu odpowiedzi szczegółowej.

    Args:
        prediction: Obiekt PredictionHistory

    Returns:
        Słownik z pełnymi danymi
    """
    image_urls = [get_image_url(path) for path in prediction.image_paths]

    return {
        "id": prediction.id,
        "predicted_class": prediction.predicted_class,
        "tree_id": prediction.tree_id,
        "confidence": prediction.confidence,
        "all_predictions": prediction.all_predictions,
        "image_urls": image_urls,
        "created_at": prediction.created_at,
    }
