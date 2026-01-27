from typing import Annotated, List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from services.prediction_service import PredictionService, get_prediction_service
from core.security import get_current_user_email

router = APIRouter()


@router.post("/")
async def predict_tree(
    current_user_email: Annotated[str, Depends(get_current_user_email)],
    image: List[UploadFile] = File(...),
    service: PredictionService = Depends(get_prediction_service),
):
    """
    Endpoint do predykcji gatunku drzewa na podstawie 1-4 zdjęć.
    Wymaga autoryzacji (token JWT w nagłówku Authorization).
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

    prediction_result = service.predict_multiple_images(images_bytes)
    return prediction_result
