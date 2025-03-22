import { supabase } from "@/integrations/supabase/client";
import { Property, Booking, Review, SearchFilters, Transportation } from "@/types";
import { properties as mockProperties, bookings as mockBookings } from "@/data/mockData";

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

// Add caching to improve performance
let cachedFeaturedProperties: Property[] | null = null;
let cachedFeaturedTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const fetchFeaturedProperties = async (): Promise<Property[]> => {
  try {
    // Check if we have a valid cache
    const now = Date.now();
    if (cachedFeaturedProperties && (now - cachedFeaturedTimestamp) < CACHE_DURATION) {
      console.log("Returning cached featured properties");
      return cachedFeaturedProperties;
    }

    console.log("Fetching featured properties from Supabase...");
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("featured", true)
      .limit(6);

    if (error) {
      console.error("Error fetching featured properties:", error);
      // Return mock data as fallback with INR currency
      const featuredMockProperties = mockProperties
        .filter(prop => prop.featured)
        .slice(0, 6)
        .map(prop => ({ ...prop, currency: "₹" }));
      
      // Update cache
      cachedFeaturedProperties = featuredMockProperties;
      cachedFeaturedTimestamp = now;
      
      return featuredMockProperties;
    }

    if (data && data.length > 0) {
      console.log("Featured properties fetched successfully:", data.length);
      const mappedProperties = data.map(prop => mapSupabasePropertyToAppProperty(prop));
      
      // Update cache
      cachedFeaturedProperties = mappedProperties;
      cachedFeaturedTimestamp = now;
      
      return mappedProperties;
    } else {
      console.log("No featured properties found, using mock data");
      // Return mock data if no featured properties in database yet
      const featuredMockProperties = mockProperties
        .filter(prop => prop.featured)
        .slice(0, 6)
        .map(prop => ({ ...prop, currency: "₹" }));
      
      // Update cache
      cachedFeaturedProperties = featuredMockProperties;
      cachedFeaturedTimestamp = now;
      
      return featuredMockProperties;
    }
  } catch (error) {
    console.error("Exception fetching featured properties:", error);
    const featuredMockProperties = mockProperties
      .filter(prop => prop.featured)
      .slice(0, 6)
      .map(prop => ({ ...prop, currency: "₹" }));
    
    return featuredMockProperties;
  }
};

let cachedAllProperties: Property[] | null = null;
let cachedAllTimestamp: number = 0;
let lastAppliedFilters: string = '';

export const fetchAllProperties = async (filters?: SearchFilters): Promise<Property[]> => {
  try {
    // Create a key for the current filters
    const filtersKey = filters ? JSON.stringify(filters) : '';
    
    // Check if we have a valid cache with the same filters
    const now = Date.now();
    if (cachedAllProperties && (now - cachedAllTimestamp) < CACHE_DURATION && lastAppliedFilters === filtersKey) {
      console.log("Returning cached properties with filters");
      return cachedAllProperties;
    }
    
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
      // Filter and return mock data as fallback with INR currency
      const filteredMockProperties = filterMockProperties(mockProperties, filters);
      
      // Update cache
      cachedAllProperties = filteredMockProperties;
      cachedAllTimestamp = now;
      lastAppliedFilters = filtersKey;
      
      return filteredMockProperties;
    }

    if (data && data.length > 0) {
      console.log("All properties fetched successfully:", data.length);
      const mappedProperties = data.map(prop => mapSupabasePropertyToAppProperty(prop));
      
      // Update cache
      cachedAllProperties = mappedProperties;
      cachedAllTimestamp = now;
      lastAppliedFilters = filtersKey;
      
      return mappedProperties;
    } else {
      console.log("No properties found, using mock data");
      // Filter and return mock data if no properties in database yet
      const filteredMockProperties = filterMockProperties(mockProperties, filters);
      
      // Update cache
      cachedAllProperties = filteredMockProperties;
      cachedAllTimestamp = now;
      lastAppliedFilters = filtersKey;
      
      return filteredMockProperties;
    }
  } catch (error) {
    console.error("Exception fetching properties:", error);
    return filterMockProperties(mockProperties, filters);
  }
};

// Helper function to filter mock properties based on search filters
const filterMockProperties = (properties: Property[], filters?: SearchFilters): Property[] => {
  if (!filters) {
    return properties.map(prop => ({ ...prop, currency: "₹" }));
  }
  
  let filteredProps = [...properties];
  
  if (filters.location) {
    filteredProps = filteredProps.filter(
      prop => prop.location.city.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }
  
  if (filters.priceRange) {
    if (filters.priceRange.min !== undefined) {
      filteredProps = filteredProps.filter(prop => prop.price >= filters.priceRange!.min!);
    }
    if (filters.priceRange.max !== undefined) {
      filteredProps = filteredProps.filter(prop => prop.price <= filters.priceRange!.max!);
    }
  }
  
  if (filters.propertyType) {
    filteredProps = filteredProps.filter(
      prop => prop.propertyType === filters.propertyType
    );
  }
  
  if (filters.bedrooms !== undefined) {
    filteredProps = filteredProps.filter(prop => prop.bedrooms >= filters.bedrooms!);
  }
  
  if (filters.amenities && filters.amenities.length > 0) {
    filteredProps = filteredProps.filter(prop => 
      filters.amenities!.every(amenity => prop.amenities.includes(amenity))
    );
  }
  
  return filteredProps.map(prop => ({ ...prop, currency: "₹" }));
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
      return mockProperties.find(prop => prop.id === id) || null;
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
      return mockProperties.find(prop => prop.id === id) || null;
    }
  } catch (error) {
    console.error("Exception fetching property:", error);
    return mockProperties.find(prop => prop.id === id) || null;
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
    
    // Fix: Handle null values safely with type guards
    let startDate: string;
    if (bookingData.startDate) {
      startDate = typeof bookingData.startDate === 'object' 
        ? bookingData.startDate.toISOString() 
        : bookingData.startDate;
    } else {
      startDate = bookingData.start_date || new Date().toISOString();
    }
    
    let endDate: string;
    if (bookingData.endDate) {
      endDate = typeof bookingData.endDate === 'object' 
        ? bookingData.endDate.toISOString() 
        : bookingData.endDate;
    } else {
      endDate = bookingData.end_date || new Date(Date.now() + 86400000).toISOString(); // Default to tomorrow
    }
    
    // Ensure we have property ID in correct format
    const propertyId = bookingData.propertyId || bookingData.property_id;
    
    // Ensure we have user ID in correct format
    const userId = bookingData.userId || bookingData.user_id;
    
    // Convert from app format to Supabase format with proper data types
    const supabaseBookingData = {
      property_id: propertyId,
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
      total_price: bookingData.totalPrice,
      status: bookingData.status || "confirmed",
      guests: bookingData.guests || 1
    };

    console.log("Formatted booking data for Supabase:", supabaseBookingData);

    // Validate required fields before inserting
    if (!supabaseBookingData.property_id || !supabaseBookingData.user_id || 
        !supabaseBookingData.start_date || !supabaseBookingData.end_date) {
      console.error("Missing required booking fields:", supabaseBookingData);
      throw new Error("Missing required booking fields");
    }

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
    
    // Fix: Handle null pickup time with proper type guards
    let pickupTime: string;
    if (transportationData.pickupTime) {
      pickupTime = typeof transportationData.pickupTime === 'object'
        ? transportationData.pickupTime.toISOString()
        : transportationData.pickupTime;
    } else {
      pickupTime = transportationData.pickup_time || new Date().toISOString();
    }
    
    // Create a valid transportation object with all required fields
    const supabaseTransportationData = {
      booking_id: transportationData.bookingId || transportationData.booking_id,
      type: transportationData.type,
      pickup_location: transportationData.pickupLocation || transportationData.pickup_location,
      dropoff_location: transportationData.dropoffLocation || transportationData.dropoff_location,
      pickup_time: pickupTime,
      estimated_price: transportationData.estimatedPrice,
      status: transportationData.status || "confirmed"
    };
    
    console.log("Formatted transportation data for Supabase:", supabaseTransportationData);

    // Validate required fields
    if (!supabaseTransportationData.pickup_location || 
        !supabaseTransportationData.dropoff_location || 
        !supabaseTransportationData.pickup_time || 
        !supabaseTransportationData.type) {
      console.error("Missing required transportation fields:", supabaseTransportationData);
      throw new Error("Missing required transportation fields");
    }

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
