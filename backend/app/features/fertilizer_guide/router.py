from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Query
from fastapi.encoders import jsonable_encoder
from pymongo.errors import PyMongoError

from app.database import get_database
from .schemas import RecommendationRequest
from .service import recommend

# These endpoints connect the fertilizer page to predictions and saved history.
router = APIRouter(prefix="/fertilizer-guide", tags=["Fertilizer Guide"])


# Keep fertilizer recommendations in their own MongoDB collection.
def history_collection():
    return get_database()["fertilizer_recommendations"]


# Convert the database ID and dates into values the frontend can read.
def serialize(document):
    document["id"] = str(document.pop("_id"))
    return jsonable_encoder(document)


# Report API availability; this does not check an IoT device connection.
@router.get("/status")
def status():
    return {"module": "Fertilizer Guide", "status": "ready"}


# Validate inputs, generate a recommendation, then try to save it.
@router.post("/recommend")
def get_recommendation(request: RecommendationRequest):
    result = jsonable_encoder(recommend(request))
    document = {**result, "created_at": datetime.now(timezone.utc)}
    try:
        inserted = history_collection().insert_one(document)
    except (PyMongoError, RuntimeError):
        # Return the prediction even if storage is temporarily unavailable.
        return {**result, "saved": False, "save_error": "Recommendation generated, but MongoDB history could not be saved."}
    return {**result, "id": str(inserted.inserted_id), "created_at": document["created_at"], "saved": True}


# Return recent summaries in pages, fetching one extra to detect another page.
@router.get("/history")
def list_history(skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100)):
    try:
        collection = history_collection()
        records = collection.find({}, {"inputs": 1, "ml_predictions": 1, "created_at": 1}).sort([("created_at", -1), ("_id", -1)]).skip(skip).limit(limit + 1)
        items = [serialize(record) for record in records]
        return {"items": items[:limit], "has_more": len(items) > limit}
    except (PyMongoError, RuntimeError):
        raise HTTPException(503, "Recommendation history is unavailable. Check the MongoDB connection.")


# Open one saved recommendation, rejecting invalid or missing IDs.
@router.get("/history/{record_id}")
def get_history(record_id: str):
    if not ObjectId.is_valid(record_id):
        raise HTTPException(400, "Invalid recommendation ID.")
    try:
        document = history_collection().find_one({"_id": ObjectId(record_id)})
    except (PyMongoError, RuntimeError):
        raise HTTPException(503, "Recommendation history is unavailable. Check the MongoDB connection.")
    if document is None:
        raise HTTPException(404, "Recommendation not found.")
    return {**serialize(document), "saved": True}
