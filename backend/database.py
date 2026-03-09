from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URI, DB_NAME

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

# Collections
users_collection = db["users"]
daily_logs_collection = db["daily_logs"]
workouts_collection = db["workouts"]
meals_collection = db["meals"]


async def create_indexes():
    """Create database indexes on startup."""
    await users_collection.create_index("email", unique=True)
    await daily_logs_collection.create_index([("user_id", 1), ("date", -1)])
    await workouts_collection.create_index([("user_id", 1), ("date", -1)])
    await meals_collection.create_index([("user_id", 1), ("date", -1)])
