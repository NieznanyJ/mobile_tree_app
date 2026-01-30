from typing import Annotated, List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from core.security import get_current_user
from db.database import get_db
from models.user import User
from schemas.prediction import PredictionCreate, SinglePrediction
from services.file_storage import save_prediction_images
from services.history_service import create_prediction_history
from services.prediction_service import PredictionService, get_prediction_service

router = APIRouter()


@router.post("/")
async def predict_tree(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
    image: List[UploadFile] = File(...),
    service: PredictionService = Depends(get_prediction_service),
):
    """
    Endpoint do predykcji gatunku drzewa na podstawie 1-4 zdjęć.
    Wymaga autoryzacji (token JWT w nagłówku Authorization).
    Zapisuje predykcję do historii użytkownika.
    """
    if len(image) < 1 or len(image) > 4:
        raise HTTPException(
            status_code=400,
            detail="Wymagane od 1 do 4 zdjęć."
        )

    images_bytes = []
    for file in image:
        data = await file.read()
        images_bytes.append(data)

    # Wykonaj predykcję
    prediction_result = service.predict_multiple_images(images_bytes)

    # Zapisz obrazy na dysk (z kompresją)
    image_paths = save_prediction_images(current_user.id, images_bytes)

    # Przygotuj dane do zapisu w historii
    all_predictions = [
        SinglePrediction(
            predicted_class=p["predicted_class"],
            tree_id=p["tree_id"],
            confidence=p["confidence"]
        )
        for p in prediction_result["predictions"]
    ]

    prediction_data = PredictionCreate(
        user_id=current_user.id,
        predicted_class=prediction_result["predicted_class"],
        tree_id=prediction_result["tree_id"],
        confidence=prediction_result["confidence"],
        all_predictions=all_predictions,
        image_paths=image_paths,
    )

    # Zapisz do historii (z automatycznym limitem 50)
    create_prediction_history(db, prediction_data)

    return prediction_result
