from fastapi import APIRouter, HTTPException
from typing import List
from app.features.soil_health.schemas import (
    SoilSample,
    SoilAnalysisResult,
    DeviceStatus,
    SensorData,
)
from app.features.soil_health import service

router = APIRouter(prefix="/soil-health", tags=["Soil Health"])


@router.get("/status")
def status():
    """Report status of the Soil Health and Fertility service."""
    return {
        "module": "Soil Health",
        "status": "active",
        "service": "IoT-enabled Soil Fertility and Nutrient Prediction",
        "region": "Kegalle, Sri Lanka (Wet Zone WL2a)",
        "version": "1.0.0",
    }


@router.get("/soil", response_model=List[SoilSample])
@router.get("/samples", response_model=List[SoilSample])
def get_all_samples():
    """Retrieve all archived soil samples."""
    return service.get_all_samples()


@router.get("/soil/latest", response_model=SoilSample)
@router.get("/samples/latest", response_model=SoilSample)
def get_latest_soil_sample():
    """Retrieve the most recent soil sample reading."""
    sample = service.get_latest_sample()
    if not sample:
        raise HTTPException(status_code=404, detail="No soil samples found")
    return sample


@router.get("/soil/{sample_id}", response_model=SoilSample)
@router.get("/samples/{sample_id}", response_model=SoilSample)
def get_soil_sample(sample_id: str):
    """Retrieve a specific soil sample by its ID."""
    sample = service.get_sample_by_id(sample_id)
    if not sample:
        raise HTTPException(status_code=404, detail=f"Soil sample '{sample_id}' not found")
    return sample


@router.post("/soil", response_model=SoilSample)
@router.post("/samples", response_model=SoilSample)
def create_soil_sample(sample: SoilSample):
    """Ingest a new soil sample from IoT sensors or manual form."""
    created = service.save_sample(sample)
    return created


@router.get("/analysis/{sample_id}", response_model=SoilAnalysisResult)
@router.post("/analysis/{sample_id}", response_model=SoilAnalysisResult)
def run_or_get_analysis(sample_id: str):
    """Generate or retrieve comprehensive agronomic fertility analysis for a sample."""
    return service.analyze_sample(sample_id)


@router.get("/device/status", response_model=DeviceStatus)
def get_device_status():
    """Retrieve real-time communication and hardware health of the ESP32 node."""
    return service.get_device_telemetry()


@router.get("/sensors/latest", response_model=SensorData)
def get_latest_sensor_readings():
    """Fetch the latest calibrated IoT sensor measurements."""
    sample = service.get_latest_sample()
    if sample:
        return sample.sensorData
    return SensorData()
