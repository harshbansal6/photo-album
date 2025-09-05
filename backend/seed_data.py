import asyncio
from database import db
from models import BirthdayMessage
from datetime import datetime

async def seed_birthday_messages():
    """Seed the database with initial birthday messages"""
    
    # Check if messages already exist
    existing_count = await db.birthday_messages.count_documents({})
    if existing_count > 0:
        print(f"Database already has {existing_count} birthday messages. Skipping seed.")
        return
    
    # Birthday messages data
    messages_data = [
        {
            "title": "Happy Birthday, My Love!",
            "message": "Another year of being blessed to have you in my life. You make every day brighter, every moment more meaningful. Here's to creating more beautiful memories together.",
        },
        {
            "title": "Our Journey So Far",
            "message": "Every photo in this album tells a story of our love. From our first nervous glances to the comfortable silence we share now - each moment has been a gift.",
        },
        {
            "title": "To Many More Adventures",
            "message": "This album is just the beginning. I can't wait to fill it with more laughter, more adventures, and more reasons to fall in love with you every single day.",
        }
    ]
    
    # Create and insert messages
    for msg_data in messages_data:
        message = BirthdayMessage(**msg_data)
        await db.birthday_messages.insert_one(message.dict())
        print(f"Created message: {message.title}")
    
    print(f"Successfully seeded {len(messages_data)} birthday messages!")

if __name__ == "__main__":
    asyncio.run(seed_birthday_messages())