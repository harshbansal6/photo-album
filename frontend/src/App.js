import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PhotoGallery from "./components/PhotoGallery";
import Timeline from "./components/Timeline";
import BirthdayMessages from "./components/BirthdayMessages";
import PhotoModal from "./components/PhotoModal";
import UploadSection from "./components/UploadSection";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Card, CardContent } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Toaster } from "./components/ui/toaster";
import { photoAPI, messageAPI } from "./services/api";
import { Heart, Camera, Upload, Calendar, Gift, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "./hooks/use-toast";

const Home = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const { toast } = useToast();

  // Fetch photos from API
  const fetchPhotos = async () => {
    try {
      setPhotosLoading(true);
      const fetchedPhotos = await photoAPI.getPhotos();
      
      // Transform photos to include proper image URLs
      const transformedPhotos = fetchedPhotos.map(photo => ({
        ...photo,
        url: photoAPI.getPhotoUrl(photo.id), // Use the API URL
        // Convert snake_case to camelCase for frontend compatibility
        memoryNote: photo.memory_note,
        originalFilename: photo.original_filename,
        fileSize: photo.file_size,
        mimeType: photo.mime_type,
        createdAt: photo.created_at,
        updatedAt: photo.updated_at
      }));
      
      setPhotos(transformedPhotos);
    } catch (error) {
      console.error('Failed to fetch photos:', error);
      toast({
        title: "Failed to load photos",
        description: "Unable to fetch photos from the server",
        variant: "destructive"
      });
    } finally {
      setPhotosLoading(false);
    }
  };

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);
      const fetchedMessages = await messageAPI.getMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast({
        title: "Failed to load messages",
        description: "Unable to fetch birthday messages from the server",
        variant: "destructive"
      });
    } finally {
      setMessagesLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPhotos(), fetchMessages()]);
      setLoading(false);
    };

    loadData();
  }, []);

  // Handle photo upload success
  const handlePhotoUploaded = (newPhoto) => {
    const transformedPhoto = {
      ...newPhoto,
      url: photoAPI.getPhotoUrl(newPhoto.id),
      memoryNote: newPhoto.memory_note,
      originalFilename: newPhoto.original_filename,
      fileSize: newPhoto.file_size,
      mimeType: newPhoto.mime_type,
      createdAt: newPhoto.created_at,
      updatedAt: newPhoto.updated_at
    };
    
    setPhotos(prev => [transformedPhoto, ...prev]);
    
    toast({
      title: "Photo uploaded successfully!",
      description: `"${newPhoto.title}" has been added to your album`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading your beautiful memories...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg text-white">
                <Heart className="h-6 w-6 fill-current" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Our Love Story
                </h1>
                <p className="text-sm text-gray-600">Digital Photo Album</p>
              </div>
            </div>
            <Badge variant="outline" className="border-rose-300 text-rose-600 bg-rose-50">
              <Sparkles className="h-3 w-3 mr-1" />
              Birthday Edition
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/60 border border-rose-200">
            <TabsTrigger 
              value="gallery" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              <Camera className="h-4 w-4 mr-2" />
              Gallery ({photos.length})
            </TabsTrigger>
            <TabsTrigger 
              value="timeline" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger 
              value="birthday" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              <Gift className="h-4 w-4 mr-2" />
              Birthday ({messages.length})
            </TabsTrigger>
            <TabsTrigger 
              value="upload" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-6">
            {photosLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-rose-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading photos...</p>
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="h-16 w-16 text-rose-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No photos yet</h3>
                <p className="text-gray-600 mb-4">Start by uploading your first memory!</p>
                <Button 
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                  onClick={() => document.querySelector('[value="upload"]').click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Photo
                </Button>
              </div>
            ) : (
              <PhotoGallery photos={photos} />
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            {photosLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-rose-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading timeline...</p>
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-rose-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Timeline is empty</h3>
                <p className="text-gray-600">Upload some photos to see your love story timeline!</p>
              </div>
            ) : (
              <Timeline photos={photos} onPhotoSelect={setSelectedPhoto} />
            )}
          </TabsContent>

          <TabsContent value="birthday" className="space-y-6">
            {messagesLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-rose-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading birthday messages...</p>
              </div>
            ) : (
              <BirthdayMessages messages={messages} />
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <UploadSection onPhotoUploaded={handlePhotoUploaded} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onToggleFavorite={() => console.log("Toggle favorite:", selectedPhoto.id)}
          isFavorite={false}
        />
      )}

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
