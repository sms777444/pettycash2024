from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def get_database() -> AsyncIOMotorClient:
    return db.client[settings.DATABASE_NAME]

async def connect_to_mongodb():
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)

async def close_mongodb_connection():
    db.client.close()