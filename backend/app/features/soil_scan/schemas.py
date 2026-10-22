from pydantic import BaseModel, Field


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