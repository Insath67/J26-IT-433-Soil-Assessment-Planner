import os
from typing import Literal

from pydantic import BaseModel, Field


def _temperature_limit(name: str, default: str) -> float:
    try:
        return float(os.getenv(name, default))
    except ValueError as error:
        raise RuntimeError(f"{name} must be a number.") from error


SOIL_TEMPERATURE_MIN_C = _temperature_limit("SOIL_SCAN_TEMPERATURE_MIN_C", "-10")
SOIL_TEMPERATURE_MAX_C = _temperature_limit("SOIL_SCAN_TEMPERATURE_MAX_C", "80")

if SOIL_TEMPERATURE_MIN_C >= SOIL_TEMPERATURE_MAX_C:
    raise RuntimeError(
        "SOIL_SCAN_TEMPERATURE_MIN_C must be less than "
        "SOIL_SCAN_TEMPERATURE_MAX_C."
    )


class SoilScanProbabilities(BaseModel):
    Clay: float = Field(..., ge=0.0, le=1.0)
    Loam: float = Field(..., ge=0.0, le=1.0)
    Sand: float = Field(..., ge=0.0, le=1.0)


class SoilScanResponse(BaseModel):
    status: str
    predicted_class: str
    class_id: int = Field(..., ge=0, le=2)
    confidence: float = Field(..., ge=0.0, le=1.0)
    probabilities: SoilScanProbabilities


class SoilSensorData(BaseModel):
    ec: float = Field(..., ge=0, allow_inf_nan=False)
    moisture: float = Field(..., ge=0, le=100, allow_inf_nan=False)
    temperature: float = Field(
        ...,
        ge=SOIL_TEMPERATURE_MIN_C,
        le=SOIL_TEMPERATURE_MAX_C,
        allow_inf_nan=False,
    )


class SoilSensorDataResponse(BaseModel):
    status: Literal["success"]
    source: Literal["demo", "hardware"]
    connected: bool
    sensor_data: SoilSensorData


class SoilFusionStatus(BaseModel):
    status: Literal["not_trained"]
    message: str


class SoilMultimodalResponse(BaseModel):
    status: Literal["success"]
    mode: Literal["image_plus_iot"]
    image_prediction: SoilScanResponse
    sensor_data: SoilSensorData
    fusion: SoilFusionStatus