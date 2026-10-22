import io
from pathlib import Path

import numpy as np
import tensorflow as tf
from PIL import Image

from app.features.soil_scan.schemas import SoilSensorData


MODEL_PATH = Path(__file__).resolve().parent / "models" / "efficientnetb0_best.keras"

CLASS_NAMES = ["Clay", "Loam", "Sand"]
IMAGE_SIZE = (224, 224)

_model = None

DEMO_SENSOR_DATA = {
    "ec": 1.24,
    "moisture": 62.0,
    "temperature": 28.4,
}


def get_model():
    global _model

    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Soil classification model not found: {MODEL_PATH}"
            )

        _model = tf.keras.models.load_model(MODEL_PATH)

    return _model


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(IMAGE_SIZE)

    image_array = np.asarray(image, dtype=np.float32) / 255.0
    return np.expand_dims(image_array, axis=0)


def extract_image_features(image_bytes: bytes) -> np.ndarray:
    """Extract the existing EfficientNetB0 pooled vector for future fusion training."""
    model = get_model()
    if len(model.layers) < 3:
        raise RuntimeError("The image model has no pooled feature layer.")

    feature_layer = model.layers[-3]
    if len(feature_layer.output.shape) != 2:
        raise RuntimeError("The image model's pooled feature layer is unavailable.")

    feature_maps = model.layers[0](preprocess_image(image_bytes), training=False)
    return np.asarray(feature_layer(feature_maps))[0]


def preprocess_sensor_features(sensor_data: SoilSensorData) -> np.ndarray:
    """Validate and arrange raw sensor values; training data must define scaling."""
    return np.asarray(
        [[sensor_data.ec, sensor_data.moisture, sensor_data.temperature]],
        dtype=np.float32,
    )


def fuse_features(
    image_features: np.ndarray,
    sensor_features: np.ndarray,
) -> np.ndarray:
    """Build the future fusion input; this vector is not a trained prediction."""
    image_batch = np.asarray(image_features, dtype=np.float32).reshape(1, -1)
    sensor_batch = np.asarray(sensor_features, dtype=np.float32).reshape(1, -1)
    return np.concatenate((image_batch, sensor_batch), axis=1)


def get_demo_sensor_data() -> dict:
    return {
        "status": "success",
        "source": "demo",
        "connected": False,
        "sensor_data": DEMO_SENSOR_DATA.copy(),
    }


def predict_multimodal(image_bytes: bytes, sensor_data: SoilSensorData) -> dict:
    sensor_values = preprocess_sensor_features(sensor_data)
    if sensor_values.shape != (1, 3):
        raise ValueError("Exactly three soil sensor measurements are required.")

    return {
        "status": "success",
        "mode": "image_plus_iot",
        "image_prediction": predict_soil(image_bytes),
        "sensor_data": sensor_data.model_dump(),
        "fusion": {
            "status": "not_trained",
            "message": "Multimodal fusion model is prepared for training.",
        },
    }


def predict_soil(image_bytes: bytes) -> dict:
    image_array = preprocess_image(image_bytes)

    model = get_model()
    predictions = model.predict(image_array, verbose=0)[0]

    predicted_class_id = int(np.argmax(predictions))
    predicted_class = CLASS_NAMES[predicted_class_id]
    confidence = float(predictions[predicted_class_id])

    probabilities = {
        CLASS_NAMES[i]: float(predictions[i])
        for i in range(len(CLASS_NAMES))
    }

    return {
        "status": "success",
        "predicted_class": predicted_class,
        "class_id": predicted_class_id,
        "confidence": confidence,
        "probabilities": probabilities,
    }