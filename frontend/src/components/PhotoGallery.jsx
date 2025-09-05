import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, Calendar, MapPin, MessageCircle, Trash2, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import PhotoModal from './PhotoModal';
import { photoAPI } from '../services/api';
import { useToast } from '../hooks/use-toast';

const PhotoGallery = ({ photos, onPhotoDeleted }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [deletingPhotoId, setDeletingPhotoId] = useState(null);
  const { toast } = useToast();

  const toggleFavorite = (photoId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(photoId)) {
      newFavorites.delete(photoId);
    } else {
      newFavorites.add(photoId);
    }
    setFavorites(newFavorites);
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      setDeletingPhotoId(photoId);
      await photoAPI.deletePhoto(photoId);
      
      toast({
        title: "Photo deleted",
        description: "The photo has been removed successfully",
      });

      // Notify parent component
      if (onPhotoDeleted) {
        onPhotoDeleted(photoId);
      }
    } catch (error) {
      console.error('Failed to delete photo:', error);
      toast({
        title: "Failed to delete photo",
        description: "Unable to delete the photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingPhotoId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <Card 
            key={photo.id} 
            className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200"
          >
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-64 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-110"
                  onClick={() => setSelectedPhoto(photo)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`hover:bg-white/20 transition-all duration-200 ${
                      favorites.has(photo.id) ? 'text-rose-500' : 'text-white'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(photo.id);
                    }}
                  >
                    <Heart 
                      className={`h-5 w-5 ${favorites.has(photo.id) ? 'fill-current' : ''}`} 
                    />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-white/20 transition-all duration-200 text-white hover:text-red-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          Delete Photo
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{photo.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeletePhoto(photo.id)}
                          disabled={deletingPhotoId === photo.id}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deletingPhotoId === photo.id ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="font-semibold text-lg mb-1">{photo.title}</h3>
                  <p className="text-sm text-gray-200 mb-2">{photo.caption}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(photo.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{photo.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 text-lg">{photo.title}</h3>
                  <Badge variant="secondary" className="bg-rose-100 text-rose-700 hover:bg-rose-200">
                    {new Date(photo.date).toLocaleDateString()}
                  </Badge>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{photo.caption}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {photo.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-rose-300 text-rose-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPhoto(photo)}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onToggleFavorite={() => toggleFavorite(selectedPhoto.id)}
          isFavorite={favorites.has(selectedPhoto.id)}
        />
      )}
    </div>
  );
};

export default PhotoGallery;