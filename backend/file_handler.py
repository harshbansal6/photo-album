import os
import uuid
import shutil
from pathlib import Path
from typing import Optional, Tuple
from datetime import datetime
from fastapi import UploadFile, HTTPException
from PIL import Image
import magic


class FileHandler:
    def __init__(self, base_upload_dir: str = "/app/uploads"):
        self.base_upload_dir = Path(base_upload_dir)
        self.photos_dir = self.base_upload_dir / "photos"
        self.ensure_directories()
    
    def ensure_directories(self):
        """Create necessary directories if they don't exist"""
        self.photos_dir.mkdir(parents=True, exist_ok=True)
        
    def get_upload_path(self, date: datetime) -> Path:
        """Get upload directory path based on date (YYYY/MM structure)"""
        year_month_dir = self.photos_dir / str(date.year) / f"{date.month:02d}"
        year_month_dir.mkdir(parents=True, exist_ok=True)
        return year_month_dir
    
    def validate_file(self, file: UploadFile) -> bool:
        """Validate uploaded file type and size"""
        # Check file size (10MB limit)
        if file.size and file.size > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="File too large. Maximum size is 10MB.")
        
        # Check file type by content (not just extension)
        allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid file type. Allowed types: {', '.join(allowed_types)}"
            )
        
        return True
    
    def generate_filename(self, original_filename: str) -> str:
        """Generate unique filename while preserving extension"""
        file_ext = Path(original_filename).suffix.lower()
        unique_id = str(uuid.uuid4())
        return f"{unique_id}{file_ext}"
    
    async def save_photo(self, file: UploadFile, date: datetime) -> Tuple[str, int]:
        """Save uploaded photo and return filename and file size"""
        # Validate file
        self.validate_file(file)
        
        # Generate paths
        upload_dir = self.get_upload_path(date)
        filename = self.generate_filename(file.filename)
        file_path = upload_dir / filename
        
        # Save file
        try:
            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
                file_size = len(content)
            
            # Optimize image
            self.optimize_image(file_path)
            
            return filename, file_size
            
        except Exception as e:
            # Clean up on error
            if file_path.exists():
                file_path.unlink()
            raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    def optimize_image(self, file_path: Path, max_width: int = 1920, quality: int = 85):
        """Optimize image size and quality"""
        try:
            with Image.open(file_path) as img:
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')
                
                # Resize if too large
                if img.width > max_width:
                    ratio = max_width / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                
                # Save with optimization
                img.save(file_path, optimize=True, quality=quality)
                
        except Exception as e:
            # If optimization fails, keep original file
            print(f"Image optimization failed for {file_path}: {e}")
    
    def get_file_path(self, filename: str, date: datetime) -> Path:
        """Get full path to a stored file"""
        upload_dir = self.get_upload_path(date)
        return upload_dir / filename
    
    def delete_file(self, filename: str, date: datetime) -> bool:
        """Delete a stored file"""
        try:
            file_path = self.get_file_path(filename, date)
            if file_path.exists():
                file_path.unlink()
                return True
            return False
        except Exception:
            return False
    
    def file_exists(self, filename: str, date: datetime) -> bool:
        """Check if file exists"""
        file_path = self.get_file_path(filename, date)
        return file_path.exists()
    
    def get_mime_type(self, file_path: Path) -> str:
        """Get MIME type of file"""
        try:
            return magic.from_file(str(file_path), mime=True)
        except:
            # Fallback to extension-based detection
            ext = file_path.suffix.lower()
            mime_types = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp'
            }
            return mime_types.get(ext, 'application/octet-stream')