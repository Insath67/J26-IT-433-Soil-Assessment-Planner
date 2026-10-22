from fastapi import APIRouter, File, UploadFile, HTTPException

from app.features.soil_scan.schemas import SoilScanResponse
from app.features.soil_scan.service import predict_soil


router = APIRouter(prefix="/soil-scan", tags=["Soil Scan"])


@router.get("/status")
def status():
    return {
        "module": "Soil Scan",
        "status": "ready",
        "message": "Soil classification model is ready."
    }


@router.post("/predict", response_model=SoilScanResponse)
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file."
        )

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="The uploaded image is empty."
        )

    try:
        return predict_soil(image_bytes)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Soil classification failed: {type(error).__name__}"
        )