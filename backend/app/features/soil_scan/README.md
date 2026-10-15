# Member 1 — Soil Scan backend

`router.py` already belongs to the main FastAPI app with the `/api/soil-scan` prefix. `GET /status` explicitly reports `not_implemented`.

- `router.py`: HTTP endpoints; create functions on the existing APIRouter.
- `service.py`: model/business logic.
- `schemas.py`: agreed Pydantic request/response models.

Add member-owned `models/` and `data/` folders only when needed. Add dependencies to the shared backend requirements, then notify the team. Keep keys in backend/.env. Put regression tests in backend/tests and document the actual API contract here.

Replace the status and UI wording once real functionality is integrated. Cross-member data flow needs an agreed input contract, units and provenance; there is currently no automatic sensor or image-to-crop pipeline.
