
export interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    city: string;
    country: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  price: number;
  currency: string;
  images: string[];
  amenities: string[];
  host: User;
  rating: number;
  reviews: Review[];
  availableDates: {
    start: string;
    end: string;
  }[];
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  propertyType: string;
  featured?: boolean;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  isHost: boolean;
  joined: string;
  listings?: Property[];
  bookings?: Booking[];
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  date: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  property: Property;
  userId: string;
  user: User;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  guests: number;
  createdAt: string;
  transportation?: Transportation;
}

export interface Transportation {
  id: string;
  bookingId: string;
  type: "cab" | "auto" | "other";
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  estimatedPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface SearchFilters {
  location?: string;
  checkIn?: Date | null;
  checkOut?: Date | null;
  guests?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  propertyType?: string;
  amenities?: string[];
}
