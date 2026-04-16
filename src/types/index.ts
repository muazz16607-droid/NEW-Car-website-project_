export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Car {
  id: string;
  sellerUid: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  location: string;
  description: string;
  images: string[];
  category: string;
  status: 'available' | 'sold';
  virtualTour?: {
    type: '360' | 'video';
    exteriorUrl?: string; // For 360 exterior (could be a sequence or a single panorama)
    interiorUrl?: string; // For 360 interior (panorama)
    videoUrl?: string;    // For video walkthrough
  };
  createdAt: string;
}

export interface Chat {
  id: string;
  participants: string[];
  carId: string;
  lastMessage: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderUid: string;
  text: string;
  createdAt: string;
}
