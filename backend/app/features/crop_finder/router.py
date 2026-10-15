from fastapi import APIRouter, Body
from fastapi.responses import JSONResponse
from . import service

router = APIRouter(prefix="/crop-finder", tags=["Crop Finder"])

@router.get("/health")
def health():
    return service.health()

@router.get("/metadata")
def metadata():
    return service.metadata()

@router.post("/predict")
def predict(data: dict = Body(...)):
    result = service.predict_crop(data)
    if isinstance(result, tuple):
        payload, status_code = result
        return JSONResponse(payload, status_code=status_code)
    return result
