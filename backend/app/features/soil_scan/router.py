from fastapi import APIRouter, File, Form, UploadFile, HTTPException

from app.features.soil_scan.schemas import (
    SOIL_TEMPERATURE_MAX_C,
    SOIL_TEMPERATURE_MIN_C,
    SoilMultimodalResponse,
    SoilScanResponse,
    SoilSensorData,
    SoilSensorDataResponse,
)
from app.features.soil_scan.service import (
    get_demo_sensor_data,
    predict_multimodal,
    predict_soil,
)


router = APIRouter(prefix="/soil-scan", tags=["Soil Scan"])


@router.get("/status")
def status():
    return {
        "module": "Soil Scan",
        "status": "ready",
        "message": "Soil classification model is ready."
    }


@router.get("/sensor-data", response_model=SoilSensorDataResponse)
def sensor_data():
    return get_demo_sensor_data()


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


@router.post("/predict-multimodal", response_model=SoilMultimodalResponse)
async def predict_multimodal_route(
    file: UploadFile = File(...),
    ec: float = Form(..., ge=0, allow_inf_nan=False),
    moisture: float = Form(..., ge=0, le=100, allow_inf_nan=False),
    temperature: float = Form(
        ...,
        ge=SOIL_TEMPERATURE_MIN_C,
        le=SOIL_TEMPERATURE_MAX_C,
        allow_inf_nan=False,
    ),
):
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

    sensor_data = SoilSensorData(
        ec=ec,
        moisture=moisture,
        temperature=temperature,
    )

    try:
        return predict_multimodal(image_bytes, sensor_data)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Multimodal soil assessment failed: {type(error).__name__}"
        )