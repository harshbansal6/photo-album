# Digital Photo Album - API Contracts & Integration Plan

## API Endpoints

### Photo Management
```
GET    /api/photos           - Get all photos with metadata
POST   /api/photos           - Upload new photo with metadata
GET    /api/photos/{id}      - Get specific photo details
PUT    /api/photos/{id}      - Update photo metadata
DELETE /api/photos/{id}      - Delete photo and its file
GET    /api/photos/{id}/file - Serve the actual image file
```

### Birthday Messages
```
GET    /api/messages         - Get all birthday messages
POST   /api/messages         - Create new birthday message
PUT    /api/messages/{id}    - Update birthday message
DELETE /api/messages/{id}    - Delete birthday message
```

### File Storage
```
GET    /api/upload/presigned - Get presigned upload URL (if needed)
POST   /api/upload           - Handle chunked file upload
```

## Data Models

### Photo Model
```python
{
    "id": "string",
    "title": "string",
    "caption": "string", 
    "memory_note": "string",
    "date": "datetime",
    "location": "string",
    "tags": ["string"],
    "filename": "string",        # stored filename
    "original_filename": "string", # original upload name
    "file_size": "integer",
    "mime_type": "string",
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

### Birthday Message Model
```python
{
    "id": "string",
    "title": "string",
    "message": "string",
    "date": "datetime",
    "created_at": "datetime"
}
```

## File Storage Strategy
- **Directory Structure**: `/app/uploads/photos/YYYY/MM/`
- **Filename Format**: `{uuid}_{original_name}`
- **Supported Formats**: JPG, PNG, GIF, WEBP
- **Max File Size**: 10MB per file
- **Image Processing**: Resize/optimize on upload

## Mock Data Replacement

### Frontend Changes Required:
1. Replace `mockPhotos` with API calls to `/api/photos`
2. Replace `birthdayMessages` with API calls to `/api/messages`
3. Update photo URLs to use `/api/photos/{id}/file`
4. Implement real file upload in UploadSection component
5. Add loading states and error handling
6. Remove mock.js file after integration

### Integration Points:
1. **Photo Gallery**: Fetch photos from API, handle loading states
2. **Timeline**: Same data source as gallery, different presentation
3. **Upload**: Real file upload with progress tracking
4. **Birthday Messages**: CRUD operations for messages
5. **Photo Modal**: Real favorite toggle, edit capabilities

## Backend Implementation Plan

### Phase 1: Core Models & Database
- Create Photo and BirthdayMessage models
- Set up MongoDB collections
- Create file storage directories

### Phase 2: File Handling
- Implement file upload endpoint with chunking
- Add image optimization/resizing
- Create file serving endpoint with proper headers

### Phase 3: CRUD Operations
- Photo CRUD with metadata management
- Birthday message CRUD
- Error handling and validation

### Phase 4: Frontend Integration
- Replace mock data with API calls
- Update components to handle real data
- Add loading/error states
- Test end-to-end functionality

## Security Considerations
- File type validation
- File size limits
- Path traversal protection
- Input sanitization for metadata

## Performance Optimizations
- Image compression on upload
- Thumbnail generation
- Caching headers for static files
- Lazy loading for large galleries