from fastapi import APIRouter, Depends, UploadFile, File
from services.prediction_service import PredictionService, get_prediction_service

router = APIRouter()

@router.post("/")
async def predict_tree(
    image: UploadFile = File(...),
    service: PredictionService = Depends(get_prediction_service)
):
    image_bytes = await image.read()
    prediction_result = service.predict_image(image_bytes=image_bytes)
    return prediction_result
