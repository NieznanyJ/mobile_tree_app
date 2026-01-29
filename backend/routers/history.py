"""
Router do zarządzania historią predykcji.
"""
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from core.security import get_current_user
from db.database import get_db
from models.user import User
from schemas.prediction import PaginatedHistoryResponse, PredictionHistoryDetail, PredictionHistoryItem
from services.history_service import (
    delete_all_predictions,
    delete_prediction,
    get_prediction_by_id,
    get_user_predictions,
    prediction_to_detail_response,
    prediction_to_item_response,
)

router = APIRouter()


@router.get("/", response_model=PaginatedHistoryResponse)
def get_predictions(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
    limit: int = Query(default=10, ge=1, le=50),
    cursor: str | None = Query(default=None),
):
    """
    Pobiera listę predykcji użytkownika z paginacją.

    - **limit**: Liczba wyników (domyślnie 10, max 50)
    - **cursor**: Kursor ISO datetime dla paginacji
    """
    # Parsuj cursor jeśli podany
    cursor_dt = None
    if cursor:
        try:
            cursor_dt = datetime.fromisoformat(cursor)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nieprawidłowy format kursora. Użyj formatu ISO datetime."
            )

    predictions, next_cursor, has_more = get_user_predictions(
        db, current_user.id, limit, cursor_dt
    )

    items = [prediction_to_item_response(p) for p in predictions]

    return PaginatedHistoryResponse(
        items=items,
        next_cursor=next_cursor,
        has_more=has_more
    )


@router.get("/{prediction_id}", response_model=PredictionHistoryDetail)
def get_prediction_detail(
    prediction_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    """
    Pobiera szczegóły pojedynczej predykcji.
    """
    prediction = get_prediction_by_id(db, prediction_id, current_user.id)

    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Predykcja nie została znaleziona"
        )

    return prediction_to_detail_response(prediction)


@router.delete("/{prediction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_single_prediction(
    prediction_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    """
    Usuwa pojedynczą predykcję z historii.
    """
    success = delete_prediction(db, prediction_id, current_user.id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Predykcja nie została znaleziona"
        )

    return None


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def clear_all_predictions(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    """
    Usuwa całą historię predykcji użytkownika.
    """
    delete_all_predictions(db, current_user.id)
    return None
