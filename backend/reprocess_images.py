#!/usr/bin/env python3
"""
Standalone script to reprocess existing images and fix EXIF orientation issues.
This script can be run independently to fix all existing images.

Usage:
    python reprocess_images.py
"""

import sys
import os
from pathlib import Path

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from file_handler import FileHandler

def main():
    print("🔄 Starting image reprocessing...")
    print("This will fix EXIF orientation issues in all existing images.")
    print()
    
    # Initialize file handler
    file_handler = FileHandler()
    
    # Reprocess all images
    results = file_handler.reprocess_all_images()
    
    # Print results
    print("✅ Reprocessing completed!")
    print(f"📊 Results:")
    print(f"   • Processed: {results['processed']} images")
    print(f"   • Skipped: {results['skipped']} images (already correct)")
    print(f"   • Errors: {results['errors']} images")
    print()
    
    if results['processed'] > 0:
        print("🎉 Successfully fixed image orientations!")
        print("   Your images should now display correctly in the photo album.")
    elif results['skipped'] > 0:
        print("✨ All images were already correctly oriented!")
    else:
        print("⚠️  No images were found to process.")
    
    if results['errors'] > 0:
        print(f"❌ {results['errors']} images had errors during processing.")
        print("   Check the error details below:")
        for file_info in results['files']:
            if file_info['status'] == 'error':
                print(f"   • {file_info['file']}: {file_info.get('error', 'Unknown error')}")
    
    print()
    print("🔄 You may need to refresh your browser to see the changes.")

if __name__ == "__main__":
    main()
