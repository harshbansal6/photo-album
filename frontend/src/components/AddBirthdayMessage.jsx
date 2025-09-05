import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Heart, Sparkles } from 'lucide-react';
import { messageAPI } from '../services/api';
import { useToast } from '../hooks/use-toast';

const AddBirthdayMessage = ({ onMessageAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both title and message fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const newMessage = await messageAPI.createMessage({
        title: formData.title.trim(),
        message: formData.message.trim()
      });

      toast({
        title: "Message added!",
        description: "Your birthday message has been added successfully",
      });

      // Reset form and close dialog
      setFormData({ title: '', message: '' });
      setIsOpen(false);
      
      // Notify parent component
      if (onMessageAdded) {
        onMessageAdded(newMessage);
      }
    } catch (error) {
      console.error('Failed to create message:', error);
      toast({
        title: "Failed to add message",
        description: "Unable to save your birthday message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', message: '' });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Birthday Message
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
        <DialogHeader className="sticky top-0 bg-gradient-to-br from-rose-50 to-pink-50 z-10 pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" />
            Add a Birthday Message
            <Sparkles className="h-6 w-6 text-rose-500" />
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-white/80 border-rose-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Message Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Message Title *
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Happy Birthday, My Love!"
                  className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500">
                  {formData.title.length}/100 characters
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Your Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your heartfelt birthday message here..."
                  className="min-h-[200px] border-rose-200 focus:border-rose-400 focus:ring-rose-400 resize-none"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500">
                  {formData.message.length}/1000 characters
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-gradient-to-br from-rose-50 to-pink-50 -mx-6 px-6 pb-6 border-t border-rose-200 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.message.trim()}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white flex-1"
            >
              {isSubmitting ? 'Adding Message...' : 'Add Message'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBirthdayMessage;
