
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
  host_id?: string; // For compatibility with Supabase
  host: User;
  rating: number;
  reviews: Review[];
  availableDates?: {
    start: string;
    end: string;
  }[];
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  property_type?: string; // For compatibility with Supabase
  propertyType: string;
  featured?: boolean;
  created_at?: string; // For compatibility with Supabase
  updated_at?: string; // For compatibility with Supabase
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
  property_id?: string; // For compatibility with Supabase
  propertyId: string;
  user_id?: string; // For compatibility with Supabase
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
  property_id?: string; // For compatibility with Supabase
  propertyId: string;
  property: Property;
  user_id?: string; // For compatibility with Supabase
  userId: string;
  user: User;
  start_date?: string; // For compatibility with Supabase
  startDate: string;
  end_date?: string; // For compatibility with Supabase
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  guests: number;
  created_at?: string; // For compatibility with Supabase
  createdAt: string;
  transportation?: Transportation;
}

export interface Transportation {
  id: string;
  booking_id?: string; // For compatibility with Supabase
  bookingId: string;
  type: "cab" | "auto" | "other";
  pickup_location?: string; // For compatibility with Supabase
  pickupLocation: string;
  dropoff_location?: string; // For compatibility with Supabase
  dropoffLocation: string;
  pickup_time?: string; // For compatibility with Supabase
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
  bedrooms?: number; // Added the bedrooms property as optional
}
