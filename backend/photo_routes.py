from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.responses import FileResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import Photo, PhotoCreate, PhotoUpdate
from file_handler import FileHandler
from database import get_database
import json

router = APIRouter(prefix="/api", tags=["photos"])
file_handler = FileHandler()


@router.get("/photos", response_model=List[Photo])
async def get_photos(db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get all photos"""
    try:
        photos = await db.photos.find().sort("date", 1).to_list(1000)
        return [Photo(**photo) for photo in photos]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch photos: {str(e)}")


@router.get("/photos/{photo_id}", response_model=Photo)
async def get_photo(photo_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get specific photo by ID"""
    photo = await db.photos.find_one({"id": photo_id})
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    return Photo(**photo)


@router.post("/photos", response_model=Photo)
async def create_photo(
    file: UploadFile = File(...),
    title: str = Form(...),
    caption: str = Form(...),
    memory_note: str = Form(...),
    date: str = Form(...),  # Will be parsed to datetime
    location: str = Form(...),
    tags: str = Form(default="[]"),  # JSON string of tags
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Upload new photo with metadata"""
    try:
        # Parse form data
        photo_date = datetime.fromisoformat(date.replace('Z', '+00:00'))
        tag_list = json.loads(tags) if tags else []
        
        # Save file
        filename, file_size = await file_handler.save_photo(file, photo_date)
        
        # Create photo object
        photo = Photo(
            title=title,
            caption=caption,
            memory_note=memory_note,
            date=photo_date,
            location=location,
            tags=tag_list,
            filename=filename,
            original_filename=file.filename,
            file_size=file_size,
            mime_type=file.content_type
        )
        
        # Save to database
        await db.photos.insert_one(photo.dict())
        
        return photo
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid data format: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create photo: {str(e)}")


@router.put("/photos/{photo_id}", response_model=Photo)
async def update_photo(
    photo_id: str,
    photo_update: PhotoUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update photo metadata"""
    # Check if photo exists
    existing_photo = await db.photos.find_one({"id": photo_id})
    if not existing_photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    # Update fields
    update_data = {k: v for k, v in photo_update.dict().items() if v is not None}
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await db.photos.update_one({"id": photo_id}, {"$set": update_data})
    
    # Return updated photo
    updated_photo = await db.photos.find_one({"id": photo_id})
    return Photo(**updated_photo)


@router.delete("/photos/{photo_id}")
async def delete_photo(photo_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Delete photo and its file"""
    # Get photo details
    photo = await db.photos.find_one({"id": photo_id})
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    photo_obj = Photo(**photo)
    
    # Delete file
    file_deleted = file_handler.delete_file(photo_obj.filename, photo_obj.date)
    
    # Delete from database
    result = await db.photos.delete_one({"id": photo_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    return {
        "message": "Photo deleted successfully",
        "file_deleted": file_deleted
    }


@router.get("/photos/{photo_id}/file")
async def get_photo_file(photo_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Serve photo file"""
    # Get photo details
    photo = await db.photos.find_one({"id": photo_id})
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    photo_obj = Photo(**photo)
    file_path = file_handler.get_file_path(photo_obj.filename, photo_obj.date)
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Photo file not found")
    
    return FileResponse(
        path=str(file_path),
        media_type=photo_obj.mime_type,
        filename=photo_obj.original_filename,
        headers={
            "Cache-Control": "public, max-age=31536000",  # Cache for 1 year
            "ETag": f'"{photo_obj.id}"'
        }
    )