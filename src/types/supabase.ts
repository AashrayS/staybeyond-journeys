
export type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  is_host: boolean;
  joined_at: string;
  updated_at: string;
}

export type Property = {
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
  host_id: string;
  rating: number;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  property_type: string;
  featured?: boolean;
  created_at: string;
  updated_at: string;
}

export type Booking = {
  id: string;
  property_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  guests: number;
  created_at: string;
  updated_at: string;
}

export type Review = {
  id: string;
  property_id: string;
  user_id: string;
  rating: number;
  comment: string;
  date: string;
}

export type Transportation = {
  id: string;
  booking_id: string;
  type: "cab" | "auto" | "other";
  pickup_location: string;
  dropoff_location: string;
  pickup_time: string;
  estimated_price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}
