import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'photo_album')]


async def get_database() -> AsyncIOMotorDatabase:
    """Dependency to get database instance"""
    return db


async def init_database():
    """Initialize database collections and indexes"""
    try:
        # Create indexes for better performance
        await db.photos.create_index("date")
        await db.photos.create_index("id", unique=True)
        await db.birthday_messages.create_index("id", unique=True)
        await db.birthday_messages.create_index("created_at")
        
        print("Database initialized successfully")
    except Exception as e:
        print(f"Database initialization error: {e}")


async def close_database():
    """Close database connection"""
    client.close()