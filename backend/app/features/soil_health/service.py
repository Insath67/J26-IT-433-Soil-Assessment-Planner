from datetime import datetime
import os
from typing import Dict, Any, List, Optional
from app.features.soil_health.schemas import (
    SensorData,
    SoilSample,
    SoilAnalysisResult,
    DeviceStatus,
)
from app.database import get_soil_collection

def evaluate_nutrient_status(data: SensorData) -> Dict[str, str]:
    """Compare observed values against Sri Lanka Dept. of Agriculture benchmarks."""
    status = {}

    # Nitrogen (ideal: 30 - 50 mg/kg)
    if data.nitrogen < 30:
        status["nitrogen"] = "Deficient"
    elif data.nitrogen <= 50:
        status["nitrogen"] = "Sufficient"
    else:
        status["nitrogen"] = "High"

    # Phosphorus (ideal: 35 - 55 mg/kg)
    if data.phosphorus < 35:
        status["phosphorus"] = "Deficient"
    elif data.phosphorus <= 55:
        status["phosphorus"] = "Sufficient"
    else:
        status["phosphorus"] = "High"

    # Potassium (ideal: 40 - 70 mg/kg)
    if data.potassium < 40:
        status["potassium"] = "Deficient"
    elif data.potassium <= 70:
        status["potassium"] = "Sufficient"
    else:
        status["potassium"] = "High"

    # pH (ideal: 5.8 - 6.8)
    if data.ph < 5.5:
        status["ph"] = "Strongly Acidic"
    elif data.ph < 5.8:
        status["ph"] = "Moderately Acidic"
    elif data.ph <= 6.8:
        status["ph"] = "Suitable"
    else:
        status["ph"] = "Alkaline"

    # Moisture (ideal: 55 - 75 %)
    if data.moisture < 50:
        status["moisture"] = "Low"
    elif data.moisture <= 75:
        status["moisture"] = "Optimal"
    else:
        status["moisture"] = "Saturated"

    # Temperature (ideal: 22 - 30 °C)
    if 22 <= data.temperature <= 30:
        status["temperature"] = "Optimal"
    else:
        status["temperature"] = "Suboptimal"

    # EC (ideal: < 2.0 mS/cm)
    if data.ec <= 2.0:
        status["ec"] = "Normal"
    else:
        status["ec"] = "Saline Hazard"

    return status


def compute_fertility_index(data: SensorData) -> tuple[int, str]:
    """Calculate overall 0-100 score and categorical fertility rating."""
    score = 100

    # pH penalty
    if data.ph < 5.0 or data.ph > 7.5:
        score -= 20
    elif data.ph < 5.8 or data.ph > 6.8:
        score -= 10

    # N penalty
    if data.nitrogen < 30:
        score -= 15
    elif data.nitrogen > 70:
        score -= 8

    # P penalty
    if data.phosphorus < 35:
        score -= 18
    elif data.phosphorus > 75:
        score -= 8

    # K penalty
    if data.potassium < 40:
        score -= 14
    elif data.potassium > 90:
        score -= 8

    # Moisture penalty
    if data.moisture < 45 or data.moisture > 85:
        score -= 12
    elif data.moisture < 55 or data.moisture > 75:
        score -= 6

    # Clamp score
    final_score = max(min(score, 100), 20)

    if final_score >= 80:
        rating = "High"
    elif final_score >= 60:
        rating = "Medium"
    else:
        rating = "Low"

    return final_score, rating


# Pre-seeded samples archive for initial runtime state
DEFAULT_SAMPLES: Dict[str, SoilSample] = {
    "KG-001": SoilSample(
        sampleId="KG-001",
        location="Kegalle",
        district="Kegalle (Mid-Country Wet Zone)",
        regionDetails="Sabaragamuwa Province (Wet Zone Mid Country - WL2a)",
        soilType="Red-Yellow Podzolic (RYP)",
        soilColor="Reddish Brown / Podzolic",
        samplingDepth="0 - 15 cm (Topsoil)",
        date="06/10/2026",
        time="11:42 AM",
        sensorData=SensorData(
            ph=6.4,
            nitrogen=42.0,
            phosphorus=28.0,
            potassium=55.0,
            moisture=63.0,
            temperature=27.5,
            ec=1.4,
            humidity=78.0,
            rainfall=2200.0,
        ),
        fertilityStatus="Medium",
        fertilityScore=74,
        confidence="94.2%",
        nutrientStatus={
            "nitrogen": "Sufficient",
            "phosphorus": "Deficient",
            "potassium": "Sufficient",
            "ph": "Suitable",
        },
    )
}

# In-memory storage for runtime

def get_all_samples() -> List[SoilSample]:
    collection = get_soil_collection()

    documents = collection.find(
        {},
        {"_id": 0}
    ).sort("timestamp", -1)

    return [
        SoilSample(**document)
        for document in documents
    ]


def get_sample_by_id(
    sample_id: str
) -> Optional[SoilSample]:

    collection = get_soil_collection()

    document = collection.find_one(
        {"sampleId": sample_id},
        {"_id": 0}
    )

    if document is None:
        return None

    return SoilSample(**document)


def get_latest_sample() -> Optional[SoilSample]:
    collection = get_soil_collection()

    document = collection.find_one(
        {},
        {"_id": 0},
        sort=[("timestamp", -1)]
    )

    if document is None:
        return None

    return SoilSample(**document)


def save_sample(sample: SoilSample) -> SoilSample:
    collection = get_soil_collection()

    # Calculate nutrient status
    nutrients = evaluate_nutrient_status(
        sample.sensorData
    )

    # Calculate fertility score and level
    score, rating = compute_fertility_index(
        sample.sensorData
    )

    sample.nutrientStatus = nutrients
    sample.fertilityScore = score
    sample.fertilityStatus = rating

    now = datetime.now()

    if not sample.timestamp:
        sample.timestamp = now

    if not sample.date:
        sample.date = now.strftime("%d/%m/%Y")

    if not sample.time:
        sample.time = now.strftime("%I:%M %p")

    # Convert Pydantic object into MongoDB document
    document = sample.model_dump(mode="python")

    # Save new sample or update existing sample
    collection.update_one(
        {"sampleId": sample.sampleId},
        {"$set": document},
        upsert=True
    )

    return sample


def analyze_sample(sample_id: str) -> SoilAnalysisResult:
    sample = get_sample_by_id(sample_id)
    if not sample:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail=f"Soil sample '{sample_id}' not found"
        )

    nutrients = evaluate_nutrient_status(sample.sensorData)
    score, rating = compute_fertility_index(sample.sensorData)

    recommendations = {
        "summary": (
            f"Soil profile exhibits {rating.lower()} fertility with a composite index of {score}/100. "
            f"pH {sample.sensorData.ph} is suitable for acid-tolerant crops in Kegalle WL2a. "
            + ("Phosphorus supplementation is advised to overcome root limitations." if nutrients.get("phosphorus") == "Deficient" else "Nutrient levels are stable.")
        ),
        "fertilizers": [
            {
                "name": "Eppawala Rock Phosphate (ERP)",
                "amount": "45 - 60 kg/ha",
                "purpose": "Address local phosphorus deficiency and stimulate root networks in RYP soil.",
            },
            {
                "name": "Standard Compost / Cow Dung",
                "amount": "5 - 10 MT/ha",
                "purpose": "Enhance soil organic matter and preserve moisture retention during dry spells.",
            },
            {
                "name": "Muriate of Potash (MOP)",
                "amount": "30 - 45 kg/ha",
                "purpose": "Maintain potassium reserves for pest resilience and water regulation.",
            },
        ],
    }

    crop_recs = [
        {"name": "Ceylon Tea", "botanical": "Camellia sinensis", "suitability": 94, "tag": "Highly Suitable"},
        {"name": "Ceylon Cinnamon", "botanical": "Cinnamomum verum", "suitability": 89, "tag": "Highly Suitable"},
        {"name": "Black Pepper", "botanical": "Piper nigrum", "suitability": 85, "tag": "Suitable"},
        {"name": "Rubber", "botanical": "Hevea brasiliensis", "suitability": 81, "tag": "Suitable"},
    ]

    return SoilAnalysisResult(
        sampleId=sample.sampleId,
        fertilityStatus=rating,
        fertilityScore=score,
        nutrientStatus=nutrients,
        recommendations=recommendations,
        cropRecommendations=crop_recs,
    )


def get_device_telemetry() -> DeviceStatus:
    device_connected = os.getenv("ESP32_DEVICE_CONNECTED", "false").lower() in {
        "1",
        "true",
        "yes",
        "on",
    }
    sensor_status = [
        {"name": "7-in-1 NPK Soil Modbus Probe", "protocol": "RS-485 / Modbus RTU", "status": "Calibrated & Online", "health": "100%"},
        {"name": "Glass pH Industrial Electrode", "protocol": "Analog ADC (GPIO 34)", "status": "Optimal Precision", "health": "98%"},
        {"name": "Capacitive Soil Moisture Probe v2", "protocol": "Analog ADC (GPIO 35)", "status": "Active Reading", "health": "95%"},
        {"name": "DS18B20 Waterproof Temp Probe", "protocol": "1-Wire Digital (GPIO 4)", "status": "Stable", "health": "99%"},
    ]

    if not device_connected:
        sensor_status = [
            {**sensor, "status": "Offline", "health": "0%"}
            for sensor in sensor_status
        ]

    return DeviceStatus(
        nodeId="ESP32-KG01",
        station="Kegalle Central Field Station (WL2a)",
        microcontroller="ESP32-WROOM-32",
        status="online" if device_connected else "offline",
        batteryLevel=92 if device_connected else 0,
        wifiSignal="-62 dBm" if device_connected else "Unavailable",
        activeSensors=7 if device_connected else 0,
        lastPing="Active" if device_connected else "No heartbeat",
        sensors=sensor_status,
    )
