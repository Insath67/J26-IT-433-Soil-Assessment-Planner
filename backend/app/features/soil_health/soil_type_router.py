from functools import lru_cache
from pathlib import Path
import joblib
import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix='/soil-health/soil-type', tags=['Soil Type Nutrient Estimates'])
MODEL = Path(__file__).resolve().parent / 'models' / 'soil_type_nutrients.joblib'

class SoilTypeRequest(BaseModel):
    sample_id: str = Field(min_length=1)
    location: str = Field(min_length=1)
    agro_zone: str = Field(min_length=1)
    soil_type: str = Field(min_length=1)

@lru_cache(maxsize=1)
def load_artifact():
    if not MODEL.exists():
        raise FileNotFoundError('Train the soil type model first.')
    return joblib.load(MODEL)

@router.get('/options')
def soil_options():
    try:
        return {'soil_types': load_artifact()['allowed_soils']}
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

@router.post('/predict')
def predict_soil_nutrients(payload: SoilTypeRequest):
    try:
        artifact = load_artifact()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    if payload.soil_type not in artifact['allowed_soils']:
        raise HTTPException(status_code=422, detail='Unknown soil type')
    values = artifact['model'].predict(pd.DataFrame([{'suitable_soil_type': payload.soil_type}]))[0]
    return {
        'sample_id': payload.sample_id,
        'location': payload.location,
        'agro_zone': payload.agro_zone,
        'soil_type': payload.soil_type,
        'nitrogen': round(float(values[0]), 2),
        'phosphorus': round(float(values[1]), 2),
        'potassium': round(float(values[2]), 2),
        'ph': round(float(values[3]), 2),
        'method': 'Soil-category regression estimate',
        'warning': 'Estimates are based on crop-assigned soil categories, not laboratory measurements. Location and agro-zone are recorded but not used as model features.'
    }
