import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Photo API functions
export const photoAPI = {
  // Get all photos
  getPhotos: async () => {
    try {
      const response = await api.get('/photos');
      return response.data;
    } catch (error) {
      console.error('Error fetching photos:', error);
      throw error;
    }
  },

  // Get specific photo
  getPhoto: async (photoId) => {
    try {
      const response = await api.get(`/photos/${photoId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching photo:', error);
      throw error;
    }
  },

  // Upload new photo
  uploadPhoto: async (formData) => {
    try {
      const response = await api.post('/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // Longer timeout for uploads
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  },

  // Update photo metadata
  updatePhoto: async (photoId, updateData) => {
    try {
      const response = await api.put(`/photos/${photoId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating photo:', error);
      throw error;
    }
  },

  // Delete photo
  deletePhoto: async (photoId) => {
    try {
      const response = await api.delete(`/photos/${photoId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  },

  // Get photo file URL
  getPhotoUrl: (photoId) => {
    return `${API}/photos/${photoId}/file`;
  },
};

// Birthday Messages API functions
export const messageAPI = {
  // Get all messages
  getMessages: async () => {
    try {
      const response = await api.get('/messages');
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Create new message
  createMessage: async (messageData) => {
    try {
      const response = await api.post('/messages', messageData);
      return response.data;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  },

  // Update message
  updateMessage: async (messageId, updateData) => {
    try {
      const response = await api.put(`/messages/${messageId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  },

  // Delete message
  deleteMessage: async (messageId) => {
    try {
      const response = await api.delete(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },
};

export default api;