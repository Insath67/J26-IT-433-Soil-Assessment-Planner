# Shared React frontend

Run from this folder: `npm.cmd ci` then `npm.cmd run dev` (Windows); `npm ci` then `npm run dev` elsewhere.
Open http://localhost:5173. The homepage runs without the backend. Crop predictions need FastAPI on port 8000.

## Development map

- `src/features/soil-scan/Page.jsx` — Member 1.
- `src/features/soil-health/Page.jsx` — Member 2.
- `src/features/crop-finder/App.jsx` — your original dashboard, Member 3.
- `src/features/fertilizer-guide/Page.jsx` — Member 4.
- `src/pages/HomePage.jsx` — common homepage.
- `src/App.jsx` — BrowserRouter Routes; do not add another BrowserRouter inside a member page.
- `src/shared/Navigation.jsx` — common navigation, retained on every route.
- `src/globals.css` — theme tokens and global basics.
- `src/components/ui` — shared local UI components; reuse rather than copy.
- `src/services/api.js` — shared request helper.

## Tailwind + shadcn

Tailwind v4 is configured with `@tailwindcss/vite`. The shared UI files are editable local components in the shadcn style. `components.json` and the `@/` alias are configured for adding components with `npx shadcn@latest add <component>` when network access is available. The supplied Button/Card/Input were manually prepared; they do not require the CLI at runtime.

Use `bg-primary`, `bg-secondary`, `text-foreground`, `border-border` instead of per-member hex colors. Shared token changes affect every component that references those tokens. Crop Finder CSS is scoped under `.crop-module` so its original layout does not change the homepage.

API calls go to `/api/<member>/...`. Vite proxies `/api` to http://127.0.0.1:8000. The crop endpoints are `/api/crop-finder/metadata` and `/api/crop-finder/predict`.

Build: `npm.cmd run build`; lint: `npm.cmd run lint`. The build lands in `dist/`, which is not committed. A static production host must rewrite app routes to `index.html`.

If using the leader's frontend-only repository, copy this folder's contents into that clone, excluding node_modules, dist and local .env. Keep the clone's .git folder and branch history.
