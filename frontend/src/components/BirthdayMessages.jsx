import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Heart, Gift, Sparkles, Trash2, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import AddBirthdayMessage from './AddBirthdayMessage';
import { messageAPI } from '../services/api';
import { useToast } from '../hooks/use-toast';

const BirthdayMessages = ({ messages, onMessageAdded, onMessageDeleted }) => {
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const { toast } = useToast();

  const handleDeleteMessage = async (messageId) => {
    try {
      setDeletingMessageId(messageId);
      await messageAPI.deleteMessage(messageId);
      
      toast({
        title: "Message deleted",
        description: "The birthday message has been removed successfully",
      });

      // Notify parent component
      if (onMessageDeleted) {
        onMessageDeleted(messageId);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast({
        title: "Failed to delete message",
        description: "Unable to delete the birthday message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeletingMessageId(null);
    }
  };
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
        <div className="mt-6">
          <AddBirthdayMessage onMessageAdded={onMessageAdded} />
        </div>
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
                <div className="flex items-center gap-2">
                  <div className="text-rose-500">
                    <Heart className="h-6 w-6 fill-current" />
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        disabled={deletingMessageId === message.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          Delete Birthday Message
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{message.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteMessage(message.id)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                          disabled={deletingMessageId === message.id}
                        >
                          {deletingMessageId === message.id ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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