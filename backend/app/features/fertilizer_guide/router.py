from fastapi import APIRouter
from .schemas import RecommendationRequest
from .service import recommend
router = APIRouter(prefix="/fertilizer-guide", tags=["Fertilizer Guide"])
@router.get("/status")
def status():
    return {"module":"Fertilizer Guide","status":"ready"}
@router.post("/recommend")
def get_recommendation(request: RecommendationRequest):
    return recommend(request)
