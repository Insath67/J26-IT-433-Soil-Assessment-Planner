# Verdant — Kegalle Crop Research

One React application, one FastAPI application, four member folders in each, and shared design tokens.
The supplied crop dashboard is integrated at **Home → Crop Finder**. The other three routes are starter pages for the other members.


### Terminal 1 — homepage / frontend

Commands start in `Kegalle-Crop-Research`:

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

Open **http://localhost:5173**. Homepage සහ navigation backend නැතුවත් වැඩ කරනවා.
`npm.cmd` භාවිතා කරන්නේ කලින් ඔබට තිබුණු PowerShell `npm.ps1` restriction එක මඟහැර npm executable එක run කිරීමටයි; execution policy වෙනස් කිරීම අවශ්‍ය නැහැ.

### Terminal 2 — backend / predictions

VS Code එකේ **+** click කරලා අලුත් terminal එකක් root folder එකේ open කරන්න:

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Activate කිරීම අවශ්‍ය නැහැ. `.venv` එක අලුතින් **backend තුළ** හදන්න. පරණ `.venv` copy කරන්න එපා.
Keep both terminals running. Stop either server with `Ctrl+C`.

- Homepage: http://localhost:5173
- Crop dashboard: http://localhost:5173/crop-finder
- API documentation: http://127.0.0.1:8000/docs
- API health: http://127.0.0.1:8000/api/health

Next time, run only `npm.cmd run dev` from frontend, and the uvicorn command from backend. Install dependencies again only after requirements/package lock changes.

Linux/macOS: `python3.12 -m venv .venv`, `.venv/bin/python -m pip install -r requirements.txt`, `.venv/bin/python -m uvicorn app.main:app --reload --port 8000`; frontend uses `npm ci`, `npm run dev`.

## Folder ownership

| Member | Frontend folder | Backend folder | Page |
| --- | --- | --- | --- |
| 1 — Soil Scan | `frontend/src/features/soil-scan/` | `backend/app/features/soil_scan/` | `/soil-scan` |
| 2 — Soil Health | `frontend/src/features/soil-health/` | `backend/app/features/soil_health/` | `/soil-health` |
| 3 — Crop Finder (your component) | `frontend/src/features/crop-finder/` | `backend/app/features/crop_finder/` | `/crop-finder` |
| 4 — Fertilizer Guide | `frontend/src/features/fertilizer-guide/` | `backend/app/features/fertilizer_guide/` | `/fertilizer-guide` |

Each member folder has its own README. Python folder names use underscores; URLs and frontend folders use hyphens.

Shared files:

- `frontend/src/App.jsx`: all page routes.
- `frontend/src/pages/HomePage.jsx`: homepage.
- `frontend/src/shared/Navigation.jsx`: top navigation.
- `frontend/src/shared/modules.js`: module titles, descriptions and status labels.
- `frontend/src/globals.css`: shared colors, fonts and Tailwind theme.
- `frontend/src/components/ui/`: shared Button, Card and Input components.
- `frontend/src/services/api.js`: shared API request helper.
- `backend/app/main.py`: one FastAPI application; registers all four routers.
- `backend/app/shared/`: future shared infrastructure, documented separately.
- `docs/`: team workflow, migration mapping and design system.

There is **one package.json** and **one backend environment**, not four independent React projects. Each member edits their own module; coordinate edits to shared files.

## What already works

- Responsive homepage and navigation; browser back/forward and direct route loading during Vite development.
- Original crop dashboard with manual inputs, CSV sample inputs, XGBoost ranking, per-crop SHAP explanations and JSON export.
- Existing model, label mapping and dataset bytes preserved.
- Optional OpenWeather temperature/humidity integration. Key required only for live mode.
- Soil Scan, Soil Health and Fertilizer Guide pages route correctly; their `/status` endpoints explicitly say `not_implemented`.

This ZIP does not include other members' unfinished models, IoT integration, real soil sensors, authentication, database storage, or fabricated results. Crop Finder uses the provided **synthetic dataset**; this is a research prototype, not validated field advice.

## Try your Crop Finder

1. Start both servers.
2. Click **Crop Finder** → wait for **Engine connected**.
3. **New analysis** → select a crop sample → **Load sample**.
4. **Get recommendation** → select a crop card to inspect its SHAP factors.
5. **Export results** saves the analysis JSON.

If a live weather mode is selected without a key, the API reports a clear error. To enable live weather:

```powershell
# Run inside backend
Copy-Item .env.example .env
```

Open `backend/.env` and set `OPENWEATHER_API_KEY=your_key_here`, then restart the backend. Keep `.env` out of Git. Only temperature/humidity are read live; rainfall remains the separately entered annual value under the prototype's documented assumption.

## Shared colors — change one file

Edit `frontend/src/globals.css`, especially `--primary` (green), `--secondary` (light green), `--accent` (orange), `--card` (white), and their foreground tokens. Use shared Tailwind classes like `bg-primary text-primary-foreground` in every member's UI. See `docs/DESIGN-SYSTEM.md`.

## Existing separate GitHub repositories

Your leader has `Soil-Assessment-Frontend` and `Soil-Assessment-Backend`, each with a `test` branch.
Copy the **contents of `frontend/`** into the frontend repository and the **contents of `backend/`** into the backend repository. Do not nest one repository inside the other. Keep each clone's `.git` folder. This outer folder is a delivery bundle; it does not mean the team must change to one Git repository.
See `docs/TEAM-WORKFLOW.md` before committing. No Git history or fabricated old commits are included.

## Checks

From frontend:

```powershell
npm.cmd run build
npm.cmd run lint
```

From backend:

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

See `docs/VALIDATION.md` for the checks performed on this package and remaining validation limits.

## Troubleshooting

- **Blank frontend:** read the Vite terminal and browser console; ensure you are in `frontend`, not a nested duplicate folder.
- **Engine offline:** ensure backend is running on 8000; check `/api/health` and `/api/crop-finder/metadata`.
- **Python exe not found:** create `.venv` inside `backend` first, then run from that folder.
- **WinError 4551 / Application Control blocked a DLL:** this is a Windows application-control decision, not a frontend routing problem. A new environment does not guarantee it is resolved. Use an administrator-approved Python/package setup; this ZIP does not disable that policy.
- **Port already used:** stop the older server before starting this one. Backend 8000, frontend 5173.
- **Production:** configure SPA fallback to `index.html` for frontend routes; proxy `/api` to FastAPI, or set `VITE_API_BASE_URL` to the API origin plus `/api` at build time and allow the frontend origin in backend `.env`. Vite's development proxy is not included in static hosting.
