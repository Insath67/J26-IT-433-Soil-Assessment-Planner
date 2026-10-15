# Member 3 — Crop Finder backend (your existing work)

Migrated from the supplied Flask `Crop_API/app.py` to the shared FastAPI application.

| Old file | New location relative to this folder |
| --- | --- |
| app.py inference / weather / metadata | `service.py` |
| app.py HTTP endpoints | `router.py` |
| crop_xgboost_model.json | `models/crop_xgboost_model.json` |
| crop_labels.json | `models/crop_labels.json` |
| correct_label_encoder.pkl | `models/correct_label_encoder.pkl` |
| Kegalle_Crop_Dataset.csv | `data/Kegalle_Crop_Dataset.csv` |
| test_api.py | backend `tests/test_crop_api.py`, adapted to TestClient |

Run from the backend root, not from this feature folder:
`.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000`

The original model/data artifacts are unchanged. The pickle is retained but not loaded. Model and data paths resolve from `service.py`, not the shell's current directory. Secret configuration is read from backend/.env.

## Input contract

JSON numbers: N, P, K, temperature, humidity, ph, rainfall. `weather_mode` is `manual` or `live` (default manual). In live mode temperature/humidity can be omitted. Finite numbers only; booleans and strings are rejected. Check `service.py` for broad validation limits and metadata for the synthetic training ranges.

The model feature order is N, P, K, temperature, humidity, ph, rainfall. The label mapping comes from crop_labels.json. Do not reorder labels to match a UI sort order.

Output: five ranked Tea/Pepper/Cocoa/Vanilla/Rubber classes, probabilities, explanations and signed SHAP factors, original inputs, weather provenance, range warnings and analysis ID. SHAP contributions are in raw model margin units, not percentages or causal effects.

## Research limits

The CSV is synthetic, not measured IoT data. N/P/K units are unspecified. Annual rainfall is a prototype assumption; confirm it before integrating real measurements. Model scores are not calibrated probabilities of successful cultivation. No new training, validation accuracy or spatial cross-validation is claimed by this migration.

The live weather implementation uses server-side OpenWeather only for temperature/humidity. Keep its key outside Git. Model changes need the real five-class and SHAP regression tests updated appropriately.
