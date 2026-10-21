
from pathlib import Path
import json
import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "Kegalle_Crop_Dataset.csv"
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "crop_model.joblib"
METRICS_PATH = MODEL_DIR / "training_metrics.json"

FEATURES = [
    "N",
    "P",
    "K",
    "temperature",
    "humidity",
    "ph",
    "rainfall",
]

TARGET = "label"


def train_model():
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Load the Kegalle crop dataset
    df = pd.read_csv(DATA_PATH)

    # 2. Validate dataset columns
    required = FEATURES + [TARGET]
    missing = [col for col in required if col not in df.columns]

    if missing:
        raise ValueError(f"Missing dataset columns: {missing}")

    df = df.dropna(subset=required).copy()

    # 3. Separate inputs and target
    X = df[FEATURES].apply(pd.to_numeric, errors="raise")
    y = df[TARGET].astype(str).str.strip()

    # 4. Split dataset: 80% train, 20% test
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    # 5. Train Random Forest classifier
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=20,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
        class_weight="balanced",
    )

    model.fit(X_train, y_train)

    # 6. Evaluate the model
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)

    report = classification_report(
        y_test,
        predictions,
        output_dict=True,
        zero_division=0,
    )

    labels = sorted(y.unique().tolist())

    metrics = {
        "accuracy": float(accuracy),
        "training_samples": len(X_train),
        "testing_samples": len(X_test),
        "features": FEATURES,
        "classes": labels,
        "classification_report": report,
        "confusion_matrix": confusion_matrix(
            y_test, predictions, labels=labels
        ).tolist(),
    }

    # 7. Save model and metrics
    joblib.dump(model, MODEL_PATH)

    with open(METRICS_PATH, "w", encoding="utf-8") as file:
        json.dump(metrics, file, indent=4)

    print("\nMODEL TRAINING COMPLETED")
    print("------------------------")
    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples: {len(X_test)}")
    print(f"Accuracy: {accuracy * 100:.2f}%")
    print(f"Saved model: {MODEL_PATH}")

    print("\nClassification Report:")
    print(classification_report(
        y_test, predictions, zero_division=0
    ))


if __name__ == "__main__":
    train_model()
