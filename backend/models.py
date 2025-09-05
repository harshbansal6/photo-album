from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
import uuid


class Photo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    caption: str
    memory_note: str
    date: datetime
    location: str
    tags: List[str] = []
    filename: str  # stored filename
    original_filename: str  # original upload name
    file_size: int
    mime_type: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class PhotoCreate(BaseModel):
    title: str
    caption: str
    memory_note: str
    date: datetime
    location: str
    tags: List[str] = []


class PhotoUpdate(BaseModel):
    title: Optional[str] = None
    caption: Optional[str] = None
    memory_note: Optional[str] = None
    date: Optional[datetime] = None
    location: Optional[str] = None
    tags: Optional[List[str]] = None


class BirthdayMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    message: str
    date: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class BirthdayMessageCreate(BaseModel):
    title: str
    message: str


class BirthdayMessageUpdate(BaseModel):
    title: Optional[str] = None
    message: Optional[str] = None