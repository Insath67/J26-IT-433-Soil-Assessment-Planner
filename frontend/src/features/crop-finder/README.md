# Member 3 — Crop Finder frontend (your existing work)

This folder contains the `src/App.jsx`, `App.css`, and assets from your latest uploaded Kegalle-Crop-Dashboard ZIP. The shared root app mounts it at `/crop-finder`. Click Home → Crop Finder to open it.

- `App.jsx`: existing crop dashboard, input dialog, demo loading, requests, crop cards, SHAP panel, export.
- `App.css`: original layout, scoped under `.crop-module`; theme-aware colors.
- `assets/`: supplied source assets. Existing public SVGs are in frontend/public.

The shared navigation sits above this dashboard. Its own sidebar still controls New analysis and How it works. No second frontend server is needed.

## API

`GET /api/crop-finder/metadata` loads samples and connection state.
`POST /api/crop-finder/predict` sends N, P, K, ph, temperature, humidity, rainfall and weather_mode.
The backend counterpart is `backend/app/features/crop_finder/` in the combined bundle, or `app/features/crop_finder/` in the separate backend repository.

Manual mode uses entered numbers; live mode fetches temperature/humidity server-side. Rainfall remains annual under the existing demo assumption. N/P/K units are still unspecified in the source dataset.

This version preserves the uploaded dashboard. It does not invent extra research outputs such as validated yield, seasonal timing or IoT measurements. Changes to input labels/units require matching backend preprocessing.
