# Migration from the latest uploaded ZIP

Source: Kegalle-Crop-Dashboard(2).zip.

The uploaded React src/App.jsx and App.css were moved into frontend/src/features/crop-finder/. The data, model JSON, labels JSON and reference pickle retain their bytes. Original inference logic was moved from Flask handlers into a service and wired through FastAPI APIRouter.

Changes required by the new structure:
- `/metadata`, `/predict`, `/health` became `/api/crop-finder/metadata`, `/api/crop-finder/predict`, `/api/crop-finder/health`.
- Backend port is now **8000**, not 5000.
- Run `uvicorn app.main:app`, not `python app.py`.
- Frontend API base appends `/crop-finder`; Vite forwards /api without stripping it.
- Original CSS is scoped to the crop module; sidebar accounts for global navigation.
- FastAPI rejects malformed/non-object JSON with 422; feature validation returns 400; unavailable live weather returns 503.
- .env.example was rebuilt without a real key. Private .env, copied .venv, node_modules and generated files were excluded.
- Original Flask test client checks were adapted to FastAPI TestClient. The old standalone test.py smoke script is replaced by the test suite.

No training, dataset replacement, fake measured inputs, deployment, Git commits or pushes were performed.

FastAPI reference: https://fastapi.tiangolo.com/tutorial/bigger-applications/
