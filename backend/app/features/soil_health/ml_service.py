
from pathlib import Path
from functools import lru_cache

import joblib
import pandas as pd

MODEL_PATH = (
    Path(__file__).resolve().parent
    / "models"
    / "crop_model.joblib"
)

FEATURES = [
    "N", "P", "K",
    "temperature",
    "humidity",
    "ph",
    "rainfall",
]


@lru_cache(maxsize=1)
def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            "Model not found. Train it first using: "
            "python -m app.features.soil_health.train_model"
        )

    return joblib.load(MODEL_PATH)


def predict_crops(
    nitrogen: float,
    phosphorus: float,
    potassium: float,
    temperature: float,
    humidity: float,
    ph: float,
    rainfall: float,
):
    model = load_model()

    input_data = pd.DataFrame([{
        "N": nitrogen,
        "P": phosphorus,
        "K": potassium,
        "temperature": temperature,
        "humidity": humidity,
        "ph": ph,
        "rainfall": rainfall,
    }], columns=FEATURES)

    probabilities = model.predict_proba(input_data)[0]

    results = []

    for crop, probability in zip(
        model.classes_, probabilities
    ):
        results.append({
            "crop": str(crop),
            "score": min(98, round(float(probability) * 100, 2)),
        })

    results.sort(
        key=lambda item: item["score"],
        reverse=True,
    )

    return {
        "recommended_crop": results[0]["crop"],
        "confidence": results[0]["score"],
        "crop_rankings": results,
        "model": "Random Forest Classifier",
    }
