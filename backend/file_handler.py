import os
import uuid
import shutil
from pathlib import Path
from typing import Optional, Tuple
from datetime import datetime
from fastapi import UploadFile, HTTPException
from PIL import Image, ExifTags
import magic


class FileHandler:
    def __init__(self, base_upload_dir: str = "uploads"):
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
    
    def get_exif_orientation(self, img: Image.Image) -> int:
        """Get EXIF orientation value from image"""
        try:
            exif = img._getexif()
            if exif is not None:
                for tag, value in exif.items():
                    if tag in ExifTags.TAGS and ExifTags.TAGS[tag] == 'Orientation':
                        return value
        except (AttributeError, KeyError, TypeError):
            pass
        return 1  # Default orientation (normal)
    
    def apply_exif_orientation(self, img: Image.Image) -> Image.Image:
        """Apply EXIF orientation to image"""
        orientation = self.get_exif_orientation(img)
        
        if orientation == 1:
            # Normal orientation
            return img
        elif orientation == 2:
            # Mirrored horizontally
            return img.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        elif orientation == 3:
            # Rotated 180 degrees
            return img.transpose(Image.Transpose.ROTATE_180)
        elif orientation == 4:
            # Mirrored vertically
            return img.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
        elif orientation == 5:
            # Mirrored horizontally, then rotated 90 degrees counter-clockwise
            return img.transpose(Image.Transpose.FLIP_LEFT_RIGHT).transpose(Image.Transpose.ROTATE_90)
        elif orientation == 6:
            # Rotated 90 degrees clockwise
            return img.transpose(Image.Transpose.ROTATE_270)
        elif orientation == 7:
            # Mirrored horizontally, then rotated 90 degrees clockwise
            return img.transpose(Image.Transpose.FLIP_LEFT_RIGHT).transpose(Image.Transpose.ROTATE_270)
        elif orientation == 8:
            # Rotated 90 degrees counter-clockwise
            return img.transpose(Image.Transpose.ROTATE_90)
        else:
            # Unknown orientation, return as is
            return img

    def optimize_image(self, file_path: Path, max_width: int = 1920, quality: int = 85):
        """Optimize image size and quality while preserving correct orientation"""
        try:
            with Image.open(file_path) as img:
                # Apply EXIF orientation first
                img = self.apply_exif_orientation(img)
                
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')
                
                # Resize if too large
                if img.width > max_width:
                    ratio = max_width / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                
                # Save with optimization (remove EXIF data to prevent re-rotation)
                img.save(file_path, optimize=True, quality=quality, exif=b'')
                
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
    
    def reprocess_image(self, file_path: Path) -> bool:
        """Reprocess an existing image to apply EXIF orientation fix"""
        try:
            with Image.open(file_path) as img:
                # Check if image has EXIF orientation data
                original_orientation = self.get_exif_orientation(img)
                
                # If no orientation data or already normal, no need to reprocess
                if original_orientation == 1:
                    return False
                
                # Apply EXIF orientation
                corrected_img = self.apply_exif_orientation(img)
                
                # Convert to RGB if necessary
                if corrected_img.mode in ('RGBA', 'P'):
                    corrected_img = corrected_img.convert('RGB')
                
                # Save the corrected image (remove EXIF data to prevent re-rotation)
                corrected_img.save(file_path, optimize=True, quality=85, exif=b'')
                
                return True
                
        except Exception as e:
            print(f"Failed to reprocess image {file_path}: {e}")
            return False
    
    def reprocess_all_images(self) -> dict:
        """Reprocess all images in the photos directory"""
        results = {
            'processed': 0,
            'skipped': 0,
            'errors': 0,
            'files': []
        }
        
        try:
            # Walk through all photo directories
            for year_dir in self.photos_dir.iterdir():
                if not year_dir.is_dir():
                    continue
                    
                for month_dir in year_dir.iterdir():
                    if not month_dir.is_dir():
                        continue
                        
                    for file_path in month_dir.iterdir():
                        if file_path.is_file() and file_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
                            try:
                                if self.reprocess_image(file_path):
                                    results['processed'] += 1
                                    results['files'].append({
                                        'file': str(file_path),
                                        'status': 'processed'
                                    })
                                else:
                                    results['skipped'] += 1
                                    results['files'].append({
                                        'file': str(file_path),
                                        'status': 'skipped'
                                    })
                            except Exception as e:
                                results['errors'] += 1
                                results['files'].append({
                                    'file': str(file_path),
                                    'status': 'error',
                                    'error': str(e)
                                })
                                
        except Exception as e:
            print(f"Error during batch reprocessing: {e}")
            results['errors'] += 1
            
        return results