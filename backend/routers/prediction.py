from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from services.prediction_service import PredictionService, get_prediction_service

router = APIRouter()

@router.post("/")
async def predict_tree(
    image: List[UploadFile] = File(...),
    service: PredictionService = Depends(get_prediction_service)
):
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
