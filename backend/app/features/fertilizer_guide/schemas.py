from typing import Optional
from pydantic import BaseModel, Field, model_validator

# Optional comparison targets, including their units, test method and source.
class LabReference(BaseModel):
    unit: str = Field(min_length=1, max_length=80)
    method: str = Field(min_length=1, max_length=160)
    source: str = Field(min_length=1, max_length=240)
    crop: str
    growth_stage: str
    N_min: Optional[float] = Field(default=None, ge=0)
    P_min: Optional[float] = Field(default=None, ge=0)
    K_min: Optional[float] = Field(default=None, ge=0)
    pH_min: Optional[float] = Field(default=None, ge=0, le=14)
    pH_max: Optional[float] = Field(default=None, ge=0, le=14)

    # Reject blank reference details and reversed pH limits.
    @model_validator(mode="after")
    def validate_reference(self):
        for name in ('unit', 'method', 'source'):
            value = getattr(self, name).strip()
            if not value:
                raise ValueError(f'{name} must not be blank')
            setattr(self, name, value)
        if self.pH_min is not None and self.pH_max is not None and self.pH_min > self.pH_max:
            raise ValueError('Lower pH reference must not exceed upper reference')
        return self

# Define accepted form fields and reject readings outside basic numeric limits.
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

    # Without a reference, nutrient deficiency comparisons are left unassessed.
    lab_reference: Optional[LabReference] = None
