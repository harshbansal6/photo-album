import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', '')
db_name = os.environ.get('DB_NAME', 'photo_album')

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]


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