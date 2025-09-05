from fastapi import FastAPI
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from photo_routes import router as photo_router
from message_routes import router as message_router
from database import init_database, close_database


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(
    title="Digital Photo Album API",
    description="API for managing photos and birthday messages",
    version="1.0.0"
)

# Include routers
app.include_router(photo_router)
app.include_router(message_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    await init_database()
    logger.info("Photo Album API started successfully")


@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown"""
    await close_database()
    logger.info("Photo Album API shut down")


@app.get("/api/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Digital Photo Album API is running",
        "version": "1.0.0",
        "status": "healthy"
    }
