import { supabase } from "@/integrations/supabase/client";
import { Property, Booking, Review, SearchFilters, Transportation } from "@/types";
import { indianProperties } from "@/data/indianData";

// Helper function to map Supabase property to app property
const mapSupabasePropertyToAppProperty = (supaProperty: any): Property => {
  return {
    id: supaProperty.id,
    title: supaProperty.title,
    description: supaProperty.description,
    location: supaProperty.location,
    price: supaProperty.price,
    currency: supaProperty.currency || "₹",
    images: supaProperty.images || [],
    amenities: supaProperty.amenities || [],
    host_id: supaProperty.host_id,
    host: { 
      id: supaProperty.host_id,
      name: "Host",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      isHost: true,
      joined: new Date().toISOString(),
    },
    rating: supaProperty.rating || 4.5,
    reviews: [],
    bedrooms: supaProperty.bedrooms,
    bathrooms: supaProperty.bathrooms,
    capacity: supaProperty.capacity,
    property_type: supaProperty.property_type,
    propertyType: supaProperty.property_type,
    featured: supaProperty.featured || false,
    created_at: supaProperty.created_at,
    updated_at: supaProperty.updated_at
  };
};

// Helper function to map Supabase review to app review
const mapSupabaseReviewToAppReview = (supaReview: any): Review => {
  return {
    id: supaReview.id,
    property_id: supaReview.property_id,
    propertyId: supaReview.property_id,
    user_id: supaReview.user_id,
    userId: supaReview.user_id,
    user: {
      name: supaReview.profiles?.name || supaReview.user?.name || "Anonymous",
      avatar: supaReview.profiles?.avatar_url || supaReview.user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    },
    rating: supaReview.rating,
    comment: supaReview.comment || "",
    date: supaReview.date,
  };
};

// Helper function to map Supabase booking to app booking
const mapSupabaseBookingToAppBooking = (supaBooking: any, property?: any): Booking => {
  return {
    id: supaBooking.id,
    property_id: supaBooking.property_id,
    propertyId: supaBooking.property_id,
    property: property ? mapSupabasePropertyToAppProperty(property) : {} as Property,
    user_id: supaBooking.user_id,
    userId: supaBooking.user_id,
    user: {} as any,
    start_date: supaBooking.start_date,
    startDate: supaBooking.start_date,
    end_date: supaBooking.end_date,
    endDate: supaBooking.end_date,
    totalPrice: supaBooking.total_price,
    status: supaBooking.status as any,
    guests: supaBooking.guests,
    created_at: supaBooking.created_at,
    createdAt: supaBooking.created_at,
    transportation: supaBooking.transportation,
  };
};

// Helper function to map app transportation to Supabase transportation
const mapAppTransportationToSupabaseTransportation = (transportation: Transportation): any => {
  return {
    booking_id: transportation.bookingId || transportation.booking_id,
    type: transportation.type,
    pickup_location: transportation.pickupLocation || transportation.pickup_location,
    dropoff_location: transportation.dropoffLocation || transportation.dropoff_location,
    pickup_time: transportation.pickupTime || transportation.pickup_time,
    estimated_price: transportation.estimatedPrice,
    status: transportation.status
  };
};

// Helper function to map Supabase transportation to app transportation
const mapSupabaseTransportationToAppTransportation = (supaTransportation: any): Transportation => {
  return {
    id: supaTransportation.id,
    booking_id: supaTransportation.booking_id,
    bookingId: supaTransportation.booking_id,
    type: supaTransportation.type,
    pickup_location: supaTransportation.pickup_location,
    pickupLocation: supaTransportation.pickup_location,
    dropoff_location: supaTransportation.dropoff_location,
    dropoffLocation: supaTransportation.dropoff_location,
    pickup_time: supaTransportation.pickup_time,
    pickupTime: supaTransportation.pickup_time,
    estimatedPrice: supaTransportation.estimated_price,
    status: supaTransportation.status
  };
};

export const fetchFeaturedProperties = async (): Promise<Property[]> => {
  try {
    console.log("Fetching featured properties from Supabase...");
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("featured", true)
      .limit(6);

    if (error) {
      console.error("Error fetching featured properties:", error);
      // Return mock data as fallback with INR currency
      return indianProperties
        .filter(prop => prop.featured)
        .map(prop => ({ ...prop, currency: "₹" }));
    }

    if (data && data.length > 0) {
      console.log("Featured properties fetched successfully:", data.length);
      return data.map(prop => mapSupabasePropertyToAppProperty(prop));
    } else {
      console.log("No featured properties found, using mock data");
      // Return mock data if no featured properties in database yet
      return indianProperties
        .filter(prop => prop.featured)
        .map(prop => ({ ...prop, currency: "₹" }));
    }
  } catch (error) {
    console.error("Exception fetching featured properties:", error);
    return indianProperties
      .filter(prop => prop.featured)
      .map(prop => ({ ...prop, currency: "₹" }));
  }
};

export const fetchAllProperties = async (filters?: SearchFilters): Promise<Property[]> => {
  try {
    console.log("Fetching all properties from Supabase with filters:", filters);
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

      // Only apply bedrooms filter if it's defined
      if (filters.bedrooms !== undefined) {
        query = query.gte("bedrooms", filters.bedrooms);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching properties:", error);
      // Return mock data as fallback with INR currency
      return indianProperties.map(prop => ({ ...prop, currency: "₹" }));
    }

    if (data && data.length > 0) {
      console.log("All properties fetched successfully:", data.length);
      return data.map(prop => mapSupabasePropertyToAppProperty(prop));
    } else {
      console.log("No properties found, using mock data");
      // Return mock data if no properties in database yet
      return indianProperties.map(prop => ({ ...prop, currency: "₹" }));
    }
  } catch (error) {
    console.error("Exception fetching properties:", error);
    return indianProperties.map(prop => ({ ...prop, currency: "₹" }));
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
      const supaProperty = data as any;
      const appProperty = mapSupabasePropertyToAppProperty(supaProperty);
      
      // Add reviews if any
      if (supaProperty.reviews && Array.isArray(supaProperty.reviews)) {
        appProperty.reviews = supaProperty.reviews.map((rev: any) => mapSupabaseReviewToAppReview(rev));
      }
      
      return appProperty;
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
      return data.map(review => mapSupabaseReviewToAppReview(review));
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
    console.log("Creating booking with data:", bookingData);
    
    // Convert from app format to Supabase format
    const supabaseBookingData = {
      property_id: bookingData.propertyId || bookingData.property_id,
      user_id: bookingData.userId || bookingData.user_id,
      start_date: bookingData.startDate || bookingData.start_date,
      end_date: bookingData.endDate || bookingData.end_date,
      total_price: bookingData.totalPrice,
      status: bookingData.status || "confirmed",
      guests: bookingData.guests || 1
    };

    console.log("Formatted booking data for Supabase:", supabaseBookingData);

    const { data, error } = await supabase
      .from("bookings")
      .insert(supabaseBookingData)
      .select()
      .single();

    if (error) {
      console.error("Error creating booking in Supabase:", error);
      return null;
    }

    console.log("Booking created successfully in Supabase:", data);
    
    // If there's transportation data, create a transportation record
    if (bookingData.transportation) {
      await createTransportation({
        ...bookingData.transportation,
        booking_id: data.id,
        bookingId: data.id
      });
    }

    return mapSupabaseBookingToAppBooking(data);
  } catch (error) {
    console.error("Exception creating booking:", error);
    return null;
  }
};

export const createTransportation = async (transportationData: Partial<Transportation>): Promise<Transportation | null> => {
  try {
    console.log("Creating transportation with data:", transportationData);
    
    // Convert from app format to Supabase format
    const supabaseTransportationData = mapAppTransportationToSupabaseTransportation(transportationData as Transportation);
    
    console.log("Formatted transportation data for Supabase:", supabaseTransportationData);

    const { data, error } = await supabase
      .from("transportation")
      .insert(supabaseTransportationData)
      .select()
      .single();

    if (error) {
      console.error("Error creating transportation in Supabase:", error);
      return null;
    }

    console.log("Transportation created successfully in Supabase:", data);
    return mapSupabaseTransportationToAppTransportation(data);
  } catch (error) {
    console.error("Exception creating transportation:", error);
    return null;
  }
};

export const fetchUserBookings = async (userId: string): Promise<Booking[]> => {
  try {
    console.log("Fetching bookings for user:", userId);
    
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

    console.log("User bookings fetched successfully:", data.length);
    
    // Fetch transportation for each booking
    const bookingsWithTransport = await Promise.all(
      data.map(async (booking) => {
        const bookingObj = mapSupabaseBookingToAppBooking(booking, booking.property);
        
        // Fetch transportation for this booking
        const { data: transportData } = await supabase
          .from("transportation")
          .select("*")
          .eq("booking_id", booking.id)
          .maybeSingle();
          
        if (transportData) {
          bookingObj.transportation = mapSupabaseTransportationToAppTransportation(transportData);
        }
        
        return bookingObj;
      })
    );

    return bookingsWithTransport;
  } catch (error) {
    console.error("Exception fetching user bookings:", error);
    return [];
  }
};

export const createReview = async (reviewData: Partial<Review>): Promise<Review | null> => {
  try {
    console.log("Creating review with data:", reviewData);
    
    // Convert from app format to Supabase format
    const supabaseReviewData = {
      property_id: reviewData.propertyId || reviewData.property_id,
      user_id: reviewData.userId || reviewData.user_id,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString()
    };

    console.log("Formatted review data for Supabase:", supabaseReviewData);

    const { data, error } = await supabase
      .from("reviews")
      .insert(supabaseReviewData)
      .select()
      .single();

    if (error) {
      console.error("Error creating review in Supabase:", error);
      return null;
    }

    console.log("Review created successfully in Supabase:", data);
    
    // After creating a review, update the property rating
    await updatePropertyRating(supabaseReviewData.property_id);

    return mapSupabaseReviewToAppReview(data);
  } catch (error) {
    console.error("Exception creating review:", error);
    return null;
  }
};

// Add a new function to update property rating after a new review
const updatePropertyRating = async (propertyId: string): Promise<void> => {
  try {
    // Get all reviews for the property
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("property_id", propertyId);
      
    if (reviewsError) {
      console.error("Error fetching reviews for rating update:", reviewsError);
      return;
    }
    
    if (reviews && reviews.length > 0) {
      // Calculate the average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      
      // Update the property rating
      const { error: updateError } = await supabase
        .from("properties")
        .update({ rating: parseFloat(averageRating.toFixed(1)) })
        .eq("id", propertyId);
        
      if (updateError) {
        console.error("Error updating property rating:", updateError);
      } else {
        console.log(`Updated property ${propertyId} rating to ${averageRating.toFixed(1)}`);
      }
    }
  } catch (error) {
    console.error("Exception updating property rating:", error);
  }
};
