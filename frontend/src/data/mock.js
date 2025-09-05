// Mock data for the digital photo album
export const mockPhotos = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    title: 'Our First Date',
    caption: 'The day everything changed ✨',
    memoryNote: 'I still remember how nervous I was, but your smile made everything perfect. This was the beginning of our beautiful journey together.',
    date: '2023-02-14',
    location: 'Central Park',
    tags: ['first-date', 'special']
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    title: 'Beach Getaway',
    caption: 'Sunset walks and endless talks',
    memoryNote: 'Our first trip together. We spent hours walking on the beach, talking about everything and nothing. I knew then that I wanted to share all my sunsets with you.',
    date: '2023-05-20',
    location: 'Malibu Beach',
    tags: ['vacation', 'beach']
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    title: 'Cozy Evening',
    caption: 'Home is wherever you are',
    memoryNote: 'Just a quiet evening at home, but these are the moments I treasure most. Your laugh filling the room, the way you scrunch your nose when you concentrate on puzzles.',
    date: '2023-07-12',
    location: 'Our Place',
    tags: ['home', 'cozy']
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    title: 'Adventure Day',
    caption: 'Exploring the world with you',
    memoryNote: 'You said you were scared of heights, but you climbed that mountain anyway. Your determination inspires me every day. The view was beautiful, but not as beautiful as your smile at the top.',
    date: '2023-08-15',
    location: 'Mountain Trail',
    tags: ['adventure', 'hiking']
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    title: 'Candlelit Dinner',
    caption: 'Every meal is special with you',
    memoryNote: 'I tried so hard to make this dinner perfect, and you ate it even though I accidentally added salt instead of sugar to the dessert. You said it was the best dinner ever because we made it together.',
    date: '2023-09-22',
    location: 'Our Kitchen',
    tags: ['dinner', 'cooking']
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    title: 'Autumn Stroll',
    caption: 'Falling for you all over again',
    memoryNote: 'The leaves were changing colors, but all I could see was you. We spent the whole afternoon collecting the most beautiful leaves, and you made a bouquet out of them. It\'s still pressed in our photo album.',
    date: '2023-10-30',
    location: 'City Park',
    tags: ['autumn', 'nature']
  }
];

export const birthdayMessages = [
  {
    id: '1',
    title: 'Happy Birthday, My Love!',
    message: 'Another year of being blessed to have you in my life. You make every day brighter, every moment more meaningful. Here\'s to creating more beautiful memories together.',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: '2',
    title: 'Our Journey So Far',
    message: 'Every photo in this album tells a story of our love. From our first nervous glances to the comfortable silence we share now - each moment has been a gift.',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: '3',
    title: 'To Many More Adventures',
    message: 'This album is just the beginning. I can\'t wait to fill it with more laughter, more adventures, and more reasons to fall in love with you every single day.',
    date: new Date().toISOString().split('T')[0]
  }
];

export const albums = [
  {
    id: '1',
    name: 'Our Story',
    description: 'The beginning of everything beautiful',
    coverPhoto: mockPhotos[0].url,
    photoCount: mockPhotos.length,
    createdDate: '2023-02-14'
  },
  {
    id: '2',
    name: 'Special Moments',
    description: 'Memories that make my heart skip a beat',
    coverPhoto: mockPhotos[2].url,
    photoCount: 8,
    createdDate: '2023-03-01'
  }
];