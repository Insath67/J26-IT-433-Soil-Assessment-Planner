from typing import Optional
from pydantic import BaseModel, Field

class RecommendationRequest(BaseModel):
    crop: str
    soil_type: str
    N: float = Field(ge=0)
    P: float = Field(ge=0)
    K: float = Field(ge=0)
    pH: float = Field(ge=0, le=14)
    moisture: float = Field(ge=0, le=100)
    temperature: float
    EC: float = Field(ge=0)
    growth_stage: str
    plant_age_years: Optional[float] = Field(default=None, ge=0)
    soil_series: Optional[str] = None
    bark_type: Optional[str] = None
    fertilizer_for_lookup: Optional[str] = None
