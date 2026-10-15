# Shared FastAPI backend

Python 3.12. Run commands inside this folder:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API docs: http://127.0.0.1:8000/docs. Health: http://127.0.0.1:8000/api/health.

`app/main.py` creates one FastAPI app and registers each member's APIRouter. Features own their routes, business logic, model files and README. `app/shared` is reserved for common infrastructure. Do not create four separate FastAPI app instances.

The supplied Flask crop API was migrated to FastAPI. Its inference logic is in `app/features/crop_finder/service.py`, HTTP routes in `router.py`, model files in `models/`, and synthetic CSV in `data/`. The original pickle is kept for reference and is not deserialized by the API.

## Endpoints

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/api/health` | Shared health |
| GET | `/api/soil-scan/status` | Explicit not-implemented status |
| GET | `/api/soil-health/status` | Explicit not-implemented status |
| GET | `/api/crop-finder/health` | Crop model/weather configuration |
| GET | `/api/crop-finder/metadata` | Features, samples, labels and ranges |
| POST | `/api/crop-finder/predict` | Prediction + SHAP |
| GET | `/api/fertilizer-guide/status` | Explicit not-implemented status |

Install requirements before starting, because the crop model loads when this app imports. No database is currently required.

## Live weather

Copy `.env.example` to `.env`, set your private `OPENWEATHER_API_KEY`, restart the API. `FRONTEND_ORIGINS` is a comma-separated allowlist for production or cross-origin browser requests. `.env` is ignored by Git. Never copy a real key into the frontend.

## Tests

`.\.venv\Scripts\python.exe -m unittest discover -s tests -v`

The tests use FastAPI TestClient, the real supplied model and mocked external weather. They check all five crops and SHAP additivity, input validation, range warnings, metadata, missing API key and member routes. A fresh environment is required on each machine; do not copy `.venv` between folders/computers.

For the leader's backend-only repo, copy this folder's contents into that clone, excluding .venv, .env and __pycache__. Keep the existing .git directory.
