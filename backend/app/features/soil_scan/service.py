import io
from pathlib import Path

import numpy as np
import tensorflow as tf
from PIL import Image


MODEL_PATH = Path(__file__).resolve().parent / "models" / "efficientnetb0_best.keras"

CLASS_NAMES = ["Clay", "Loam", "Sand"]
IMAGE_SIZE = (224, 224)

_model = None


def get_model():
    global _model

    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Soil classification model not found: {MODEL_PATH}"
            )

        _model = tf.keras.models.load_model(MODEL_PATH)

    return _model


def predict_soil(image_bytes: bytes) -> dict:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(IMAGE_SIZE)

    image_array = np.asarray(image, dtype=np.float32) / 255.0
    image_array = np.expand_dims(image_array, axis=0)

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