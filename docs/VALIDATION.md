# Validation performed on this package

- Frontend dependencies installed successfully with the included package lock.
- `npm run build`: passed after final CSS changes.
- `npm run lint`: passed.
- Seven FastAPI regression tests: passed on Python 3.12.
- Predictions tested for all five crop samples using the supplied real model.
- SHAP additivity compared against model raw margins; probabilities checked to sum to 1.
- Missing/invalid inputs, missing weather key, mocked live weather, training-range warnings and all member status routes checked.
- Dataset, model, label JSON and reference pickle checked byte-for-byte against the latest uploaded ZIP.
- Packaged archive checked for accidental .env, .venv, node_modules and Git history.

Limits: browser-based visual/interaction QA was not available in this environment; inspect desktop/mobile appearance locally. The real OpenWeather provider was not called with a private key. Windows Smart App Control policy behavior was not tested here. The other three research components are intentionally starter pages, not completed models or sensor integrations. No new research accuracy claim is made.
