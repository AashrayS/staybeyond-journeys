
import { supabase } from "@/integrations/supabase/client";
import { Property, Booking, Review } from "@/types";
import { indianProperties } from "@/data/indianData";

export const fetchFeaturedProperties = async (): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("featured", true)
      .limit(6);

    if (error) {
      console.error("Error fetching featured properties:", error);
      // Return mock data as fallback
      return indianProperties.filter(prop => prop.featured);
    }

    if (data && data.length > 0) {
      return data as Property[];
    } else {
      // Return mock data if no featured properties in database yet
      return indianProperties.filter(prop => prop.featured);
    }
  } catch (error) {
    console.error("Exception fetching featured properties:", error);
    return indianProperties.filter(prop => prop.featured);
  }
};

export const fetchAllProperties = async (filters?: any): Promise<Property[]> => {
  try {
    let query = supabase.from("properties").select("*");

    // Apply filters if provided
    if (filters) {
      if (filters.location) {
        query = query.ilike("location->>city", `%${filters.location}%`);
      }

      if (filters.priceRange) {
        if (filters.priceRange.min) {
          query = query.gte("price", filters.priceRange.min);
        }
        if (filters.priceRange.max) {
          query = query.lte("price", filters.priceRange.max);
        }
      }

      if (filters.propertyType) {
        query = query.eq("property_type", filters.propertyType);
      }

      if (filters.bedrooms) {
        query = query.gte("bedrooms", filters.bedrooms);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching properties:", error);
      // Return mock data as fallback
      return indianProperties;
    }

    if (data && data.length > 0) {
      return data as Property[];
    } else {
      // Return mock data if no properties in database yet
      return indianProperties;
    }
  } catch (error) {
    console.error("Exception fetching properties:", error);
    return indianProperties;
  }
};

export const fetchPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        reviews(*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching property:", error);
      // Return mock data as fallback
      return indianProperties.find(prop => prop.id === id) || null;
    }

    if (data) {
      const property = data as Property & { reviews: Review[] };
      return {
        ...property,
        host: { 
          id: property.host_id,
          name: "Host",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
          isHost: true,
          joined: new Date().toISOString(),
        }
      };
    } else {
      // Return mock data if property not found
      return indianProperties.find(prop => prop.id === id) || null;
    }
  } catch (error) {
    console.error("Exception fetching property:", error);
    return indianProperties.find(prop => prop.id === id) || null;
  }
};

export const fetchPropertyReviews = async (propertyId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        profiles:user_id(name, avatar_url)
      `)
      .eq("property_id", propertyId);

    if (error) {
      console.error("Error fetching reviews:", error);
      // Return empty array as fallback
      return [];
    }

    if (data) {
      return data.map(review => ({
        ...review,
        user: {
          name: review.profiles?.name || "Anonymous",
          avatar: review.profiles?.avatar_url || "",
        }
      })) as Review[];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Exception fetching reviews:", error);
    return [];
  }
};

export const createBooking = async (bookingData: Partial<Booking>): Promise<Booking | null> => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert(bookingData)
      .select()
      .single();

    if (error) {
      console.error("Error creating booking:", error);
      return null;
    }

    return data as Booking;
  } catch (error) {
    console.error("Exception creating booking:", error);
    return null;
  }
};

export const fetchUserBookings = async (userId: string): Promise<Booking[]> => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        property:property_id(*)
      `)
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user bookings:", error);
      return [];
    }

    return data as Booking[];
  } catch (error) {
    console.error("Exception fetching user bookings:", error);
    return [];
  }
};

export const createReview = async (reviewData: Partial<Review>): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .insert(reviewData)
      .select()
      .single();

    if (error) {
      console.error("Error creating review:", error);
      return null;
    }

    return data as Review;
  } catch (error) {
    console.error("Exception creating review:", error);
    return null;
  }
};
