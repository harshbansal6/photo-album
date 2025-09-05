import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Upload, Camera, X, Plus, CalendarIcon } from 'lucide-react';
import { photoAPI } from '../services/api';
import { useToast } from '../hooks/use-toast';

const UploadSection = ({ onPhotoUploaded }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    memory_note: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = [...e.dataTransfer.files];
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file (JPG, PNG, GIF, WEBP)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setShowUploadForm(true);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create FormData
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('caption', formData.caption);
      uploadFormData.append('memory_note', formData.memory_note);
      uploadFormData.append('date', new Date(formData.date).toISOString());
      uploadFormData.append('location', formData.location);
      uploadFormData.append('tags', JSON.stringify(formData.tags));

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload photo
      const uploadedPhoto = await photoAPI.uploadPhoto(uploadFormData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: "Upload successful!",
        description: `"${formData.title}" has been added to your album`,
      });

      // Reset form
      setSelectedFile(null);
      setFormData({
        title: '',
        caption: '',
        memory_note: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        tags: []
      });
      setShowUploadForm(false);
      setUploadProgress(0);

      // Notify parent component
      if (onPhotoUploaded) {
        onPhotoUploaded(uploadedPhoto);
      }

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: error.response?.data?.detail || "Failed to upload photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Add New Memories
        </h2>
        <p className="text-gray-600">Upload photos to create more beautiful memories</p>
      </div>

      <Card className="border-2 border-dashed border-rose-300 bg-gradient-to-br from-rose-50 to-pink-50">
        <CardContent className="p-8">
          <div
            className={`text-center space-y-4 transition-all duration-300 ${
              dragActive ? 'scale-105 bg-rose-100 rounded-lg p-4' : ''
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full text-white">
                <Upload className="h-8 w-8" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Drop your photos here</h3>
              <p className="text-gray-600 mb-4">or click to browse your files</p>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="file-upload"
              />
              
              <label htmlFor="file-upload">
                <Button 
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white cursor-pointer"
                  asChild
                >
                  <span>
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Photos
                  </span>
                </Button>
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Supported formats: JPG, PNG, GIF, WEBP (Max 10MB each)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upload Form Dialog */}
      <Dialog open={showUploadForm} onOpenChange={setShowUploadForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
          <DialogHeader className="sticky top-0 bg-gradient-to-br from-rose-50 to-pink-50 z-10 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-800">Add Photo Details</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {selectedFile && (
              <div className="text-center">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg object-cover"
                />
                <p className="text-sm text-gray-600 mt-2">{selectedFile.name}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Our First Date"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Central Park"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caption">Caption *</Label>
              <Input
                id="caption"
                value={formData.caption}
                onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                placeholder="The day everything changed ✨"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memory_note">Memory Note</Label>
              <Textarea
                id="memory_note"
                value={formData.memory_note}
                onChange={(e) => setFormData(prev => ({ ...prev, memory_note: e.target.value }))}
                placeholder="Share a special memory about this moment..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-rose-100 text-rose-700">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-rose-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-rose-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 sticky bottom-0 bg-gradient-to-br from-rose-50 to-pink-50 -mx-6 px-6 pb-6 border-t border-rose-200 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUploadForm(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploading || !formData.title || !formData.caption}
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white flex-1"
              >
                {isUploading ? 'Uploading...' : 'Upload Photo'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadSection;