from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import BirthdayMessage, BirthdayMessageCreate, BirthdayMessageUpdate
from database import get_database

router = APIRouter(prefix="/api", tags=["messages"])


@router.get("/messages", response_model=List[BirthdayMessage])
async def get_messages(db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get all birthday messages"""
    try:
        messages = await db.birthday_messages.find().sort("created_at", -1).to_list(1000)
        return [BirthdayMessage(**message) for message in messages]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch messages: {str(e)}")


@router.get("/messages/{message_id}", response_model=BirthdayMessage)
async def get_message(message_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get specific message by ID"""
    message = await db.birthday_messages.find_one({"id": message_id})
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return BirthdayMessage(**message)


@router.post("/messages", response_model=BirthdayMessage)
async def create_message(
    message_data: BirthdayMessageCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create new birthday message"""
    try:
        message = BirthdayMessage(**message_data.dict())
        await db.birthday_messages.insert_one(message.dict())
        return message
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create message: {str(e)}")


@router.put("/messages/{message_id}", response_model=BirthdayMessage)
async def update_message(
    message_id: str,
    message_update: BirthdayMessageUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update birthday message"""
    # Check if message exists
    existing_message = await db.birthday_messages.find_one({"id": message_id})
    if not existing_message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Update fields
    update_data = {k: v for k, v in message_update.dict().items() if v is not None}
    if update_data:
        await db.birthday_messages.update_one({"id": message_id}, {"$set": update_data})
    
    # Return updated message
    updated_message = await db.birthday_messages.find_one({"id": message_id})
    return BirthdayMessage(**updated_message)


@router.delete("/messages/{message_id}")
async def delete_message(message_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Delete birthday message"""
    result = await db.birthday_messages.delete_one({"id": message_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    
    return {"message": "Birthday message deleted successfully"}