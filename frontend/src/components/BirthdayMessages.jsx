import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Heart, Gift, Sparkles } from 'lucide-react';

const BirthdayMessages = ({ messages }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Gift className="h-8 w-8 text-rose-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Birthday Messages
          </h2>
          <Gift className="h-8 w-8 text-rose-500" />
        </div>
        <p className="text-gray-600">Special words for a special day</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.map((message, index) => (
          <Card 
            key={message.id} 
            className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-rose-50 via-pink-50 to-yellow-50 border-rose-200"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-rose-500" />
                  {message.title}
                </CardTitle>
                <div className="text-rose-500">
                  <Heart className="h-6 w-6 fill-current" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg border border-rose-200 shadow-sm">
                  <p className="text-gray-700 leading-relaxed">
                    {message.message}
                  </p>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                    With all my love ❤️
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center py-8">
        <Card className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white border-none shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Heart className="h-6 w-6 fill-current" />
              <Sparkles className="h-6 w-6" />
              <Heart className="h-6 w-6 fill-current" />
            </div>
            <h3 className="text-xl font-bold mb-2">Happy Birthday, Beautiful!</h3>
            <p className="text-rose-100">
              Thank you for being the most amazing person in my life. 
              Here's to another year of love, laughter, and beautiful memories together.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BirthdayMessages;