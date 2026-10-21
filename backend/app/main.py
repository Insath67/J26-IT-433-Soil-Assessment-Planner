"""Shared API entry point. All four member routers are registered here."""
import logging
import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
from app.features.crop_finder.router import router as crop_router
from app.features.soil_scan.router import router as scan_router
from app.features.soil_health.router import router as health_router
from app.features.fertilizer_guide.router import router as fertilizer_router
from app.features.soil_health.ml_router import router as soil_ml_router
from app.features.soil_health.soil_type_router import router as soil_type_router
from contextlib import asynccontextmanager
from app.database import setup_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_database()
    yield

app = FastAPI(title="Kegalle Agriculture Research API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=os.getenv("FRONTEND_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(","), allow_methods=["GET", "POST"], allow_headers=["Content-Type"])
for router in [
    scan_router,
    health_router,
    soil_ml_router,
    soil_type_router,
    crop_router,
    fertilizer_router,
]:
    app.include_router(router, prefix="/api")

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Kegalle Research API"}

@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, error: RequestValidationError):
    return JSONResponse({"status": "error", "message": "Send a JSON object with the required inputs."}, status_code=422)

@app.exception_handler(Exception)
async def internal_error(request: Request, error: Exception):
    logging.error("API operation failed: %s", type(error).__name__)
    return JSONResponse({"status": "error", "message": "The operation failed. Check the backend terminal and model files."}, status_code=500)
