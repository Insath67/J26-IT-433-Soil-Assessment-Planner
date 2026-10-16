from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


class SensorData(BaseModel):
    ph: float = Field(default=6.4, ge=0, le=14, description="Soil pH value (0-14)")
    nitrogen: float = Field(default=42.0, description="Available Nitrogen (N) in mg/kg")
    phosphorus: float = Field(default=28.0, description="Available Phosphorus (P) in mg/kg")
    potassium: float = Field(default=55.0, description="Available Potassium (K) in mg/kg")
    moisture: float = Field(default=63.0, ge=0, le=100, description="Volumetric moisture content (%)")
    temperature: float = Field(default=27.5, description="Soil temperature in degrees Celsius")
    ec: float = Field(default=1.4, description="Electrical Conductivity in mS/cm")


class SoilSample(BaseModel):
    sampleId: str = Field(description="Unique identifier for the sample, e.g. KG-001")
    location: str = Field(default="Kegalle", description="Sampling location / Agro-Ecological Zone")
    district: Optional[str] = "Kegalle (Mid-Country Wet Zone)"
    regionDetails: Optional[str] = "Sabaragamuwa Province (Wet Zone Mid Country - WL2a)"
    soilType: Optional[str] = "Red-Yellow Podzolic (RYP)"
    soilColor: Optional[str] = "Reddish Brown / Podzolic"
    samplingDepth: Optional[str] = "0 - 15 cm (Topsoil)"
    timestamp: Optional[datetime] = None
    date: Optional[str] = None
    time: Optional[str] = None
    sensorData: SensorData
    imageAnalysis: Optional[Dict[str, Any]] = None
    nutrientStatus: Optional[Dict[str, str]] = None
    fertilityStatus: Optional[str] = None
    fertilityScore: Optional[int] = None
    confidence: Optional[str] = "94.2%"


class SoilAnalysisResult(BaseModel):
    sampleId: str
    fertilityStatus: str
    fertilityScore: int
    nutrientStatus: Dict[str, str]
    recommendations: Dict[str, Any]
    cropRecommendations: List[Dict[str, Any]]


class DeviceStatus(BaseModel):
    nodeId: str = "ESP32-KG01"
    station: str = "Kegalle Central Field Station (WL2a)"
    microcontroller: str = "ESP32-WROOM-32"
    status: str = "online"
    batteryLevel: int = 92
    wifiSignal: str = "-62 dBm"
    activeSensors: int = 7
    lastPing: str = "Active"
    sensors: List[Dict[str, str]]
