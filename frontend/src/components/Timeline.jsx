import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, MapPin, Heart, Eye } from 'lucide-react';

const Timeline = ({ photos, onPhotoSelect }) => {
  const sortedPhotos = [...photos].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Our Love Story Timeline
        </h2>
        <p className="text-gray-600">Every moment captured, every memory treasured</p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-300 to-pink-300"></div>

        {sortedPhotos.map((photo, index) => (
          <div key={photo.id} className="relative flex items-start mb-12">
            {/* Timeline dot */}
            <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full border-4 border-white shadow-lg z-10"></div>

            {/* Content */}
            <div className="ml-16 w-full">
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-rose-50 border-rose-200">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-48 md:h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-2 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{photo.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-rose-500" />
                              <span>{new Date(photo.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-rose-500" />
                              <span>{photo.location}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-rose-300 text-rose-600">
                          #{index + 1}
                        </Badge>
                      </div>

                      <p className="text-gray-700 text-base mb-3 leading-relaxed">
                        {photo.caption}
                      </p>

                      <div className="bg-gradient-to-r from-rose-100 to-pink-100 p-4 rounded-lg mb-4 border border-rose-200">
                        <p className="text-gray-700 text-sm leading-relaxed italic">
                          "{photo.memoryNote}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {photo.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-rose-100 text-rose-700 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            Love
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onPhotoSelect(photo)}
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center py-8">
        <div className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg">
          <Heart className="h-5 w-5 inline mr-2" />
          <span className="font-semibold">Our story continues...</span>
        </div>
      </div>
    </div>
  );
};

export default Timeline;