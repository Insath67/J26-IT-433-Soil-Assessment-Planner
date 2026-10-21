
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.features.soil_health.ml_service import (
    predict_crops,
)
from app.features.soil_health.fertilizer_service import (
    recommend_fertilizer,
)

router = APIRouter(
    prefix="/soil-health/ml",
    tags=["Soil Health ML"],
)


class PredictionInput(BaseModel):
    nitrogen: float = Field(ge=0)
    phosphorus: float = Field(ge=0)
    potassium: float = Field(ge=0)
    temperature: float
    humidity: float = Field(ge=0, le=100)
    ph: float = Field(ge=0, le=14)
    rainfall: float = Field(ge=0)


@router.post("/predict")
def predict_soil_recommendations(
    data: PredictionInput,
):
    try:
        crop_result = predict_crops(
            nitrogen=data.nitrogen,
            phosphorus=data.phosphorus,
            potassium=data.potassium,
            temperature=data.temperature,
            humidity=data.humidity,
            ph=data.ph,
            rainfall=data.rainfall,
        )

        fertilizer_result = recommend_fertilizer(
            nitrogen=data.nitrogen,
            phosphorus=data.phosphorus,
            potassium=data.potassium,
            ph=data.ph,
        )

        return {
            "status": "success",
            "crop_prediction": crop_result,
            "fertilizer_recommendation": fertilizer_result,
        }

    except FileNotFoundError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error),
        )
