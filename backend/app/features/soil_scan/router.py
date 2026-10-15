from fastapi import APIRouter
router = APIRouter(prefix="/soil-scan", tags=["Soil Scan"])

@router.get("/status")
def status():
    return {"module": "Soil Scan", "status": "not_implemented", "message": "Member implementation has not been added yet."}
