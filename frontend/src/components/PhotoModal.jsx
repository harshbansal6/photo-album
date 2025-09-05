import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, Calendar, MapPin, X } from 'lucide-react';

const PhotoModal = ({ photo, isOpen, onClose, onToggleFavorite, isFavorite }) => {
  if (!photo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-800">{photo.title}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFavorite}
                className={`hover:bg-rose-100 ${isFavorite ? 'text-rose-500' : 'text-gray-500'}`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-rose-100">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-auto rounded-lg shadow-lg object-cover max-h-96"
            />
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-rose-500" />
                <span>{new Date(photo.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-500" />
                <span>{photo.location}</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {photo.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-rose-300 text-rose-600">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Caption</h3>
              <p className="text-gray-600 text-base leading-relaxed bg-white/60 p-4 rounded-lg border border-rose-200">
                {photo.caption}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Memory Note</h3>
              <div className="bg-gradient-to-r from-rose-100 to-pink-100 p-6 rounded-lg border border-rose-200 shadow-sm">
                <p className="text-gray-700 leading-relaxed italic">
                  "{photo.memoryNote}"
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-rose-200">
              <Button 
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoModal;