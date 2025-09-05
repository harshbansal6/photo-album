import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PhotoGallery from "./components/PhotoGallery";
import Timeline from "./components/Timeline";
import BirthdayMessages from "./components/BirthdayMessages";
import PhotoModal from "./components/PhotoModal";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Card, CardContent } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { mockPhotos, birthdayMessages } from "./data/mock";
import { Heart, Camera, Upload, Calendar, Gift, Sparkles } from "lucide-react";

const UploadSection = () => {
  const [dragActive, setDragActive] = useState(false);

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
    // Mock upload functionality
    const files = [...e.dataTransfer.files];
    console.log("Files would be uploaded:", files);
    alert(`${files.length} photo(s) uploaded successfully! (Mock functionality)`);
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
              <Button 
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                onClick={() => alert("Photo upload functionality will be available soon! (Mock implementation)")}
              >
                <Camera className="h-4 w-4 mr-2" />
                Choose Photos
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Supported formats: JPG, PNG, GIF (Max 10MB each)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Home = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

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
              Gallery
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
              Birthday
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
            <PhotoGallery photos={mockPhotos} />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Timeline photos={mockPhotos} onPhotoSelect={setSelectedPhoto} />
          </TabsContent>

          <TabsContent value="birthday" className="space-y-6">
            <BirthdayMessages messages={birthdayMessages} />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <UploadSection />
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
