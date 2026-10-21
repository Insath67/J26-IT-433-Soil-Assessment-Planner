
import os
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import PyMongoError

# Load environment variables from backend/.env
BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("MONGODB_DB", "soil_assessment_db")

_client = None


def get_database():
    global _client

    if not MONGODB_URI:
        raise RuntimeError(
            "MONGODB_URI is missing from backend/.env"
        )

    if _client is None:
        _client = MongoClient(
            MONGODB_URI,
            serverSelectionTimeoutMS=5000
        )
        _client.admin.command("ping")

    return _client[DATABASE_NAME]


def get_soil_collection():
    return get_database()["soil_samples"]


def test_connection():
    try:
        get_database()
        print("MongoDB connected successfully!")
        return True
    except (PyMongoError, RuntimeError) as error:
        print(f"MongoDB connection failed: {error}")
        return False


def setup_database():
    collection = get_soil_collection()

    collection.create_index(
        "sampleId",
        unique=True
    )

    collection.create_index("timestamp")

    print("Soil sample indexes created!")


if __name__ == "__main__":
    test_connection()
    setup_database()