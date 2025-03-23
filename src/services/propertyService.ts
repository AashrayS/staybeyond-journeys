// src/services/propertyService.ts

import { supabase } from "@/integrations/supabase/client";
import { Property, Booking, Transportation, SearchFilters, User } from "@/types";
import { Json } from "@/integrations/supabase/types";

// Helper function to safely process location data
const processLocationData = (locationData: Json | null): Property['location'] => {
  // Default location object if data is invalid
  const defaultLocation: Property['location'] = {
    city: 'Unknown',
    country: 'Unknown'
  };
  
  // If locationData is null or undefined, return default
  if (!locationData) return defaultLocation;
  
  // Try to parse the location data safely
  try {
    // If locationData is an object, extract properties safely
    if (typeof locationData === 'object' && locationData !== null && !Array.isArray(locationData)) {
      const locationObj = locationData as Record<string, any>;
      
      return {
        city: typeof locationObj.city === 'string' ? locationObj.city : 'Unknown',
        country: typeof locationObj.country === 'string' ? locationObj.country : 'Unknown',
        address: typeof locationObj.address === 'string' ? locationObj.address : undefined,
        coordinates: locationObj.coordinates && 
          typeof locationObj.coordinates === 'object' && 
          !Array.isArray(locationObj.coordinates) &&
          typeof locationObj.coordinates.lat === 'number' && 
          typeof locationObj.coordinates.lng === 'number' ? 
          {
            lat: locationObj.coordinates.lat,
            lng: locationObj.coordinates.lng
          } : undefined
      };
    }
  } catch (error) {
    console.error("Error processing location data:", error);
  }
  
  // If we get here, locationData is not in the expected format
  return defaultLocation;
};

// Helper function to create a complete user object
const createHostObject = (hostId: string | null): User => {
  return {
    id: hostId || "",
    name: "Host Name", // Default name
    avatar: "https://ui-avatars.com/api/?name=Host",
    isHost: true,
    joined: new Date().toISOString(),
    // Optional fields
    listings: [],
    bookings: []
  };
};

// Function to fetch all properties
export const fetchProperties = async (): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*");

    if (error) {
      console.error("Error fetching properties:", error);
      return [];
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log("No properties found or invalid data format");
      return [];
    }

    // Transform the data to match our Property type
    const properties: Property[] = data.map(item => {
      // Process location data safely
      const location = processLocationData(item.location);
      
      // Create a proper host object
      const host = createHostObject(item.host_id);

      // Map database fields to our Property type
      return {
        id: item.id || "",
        title: item.title || "Unnamed Property",
        description: item.description || "",
        location: location,
        price: typeof item.price === 'number' ? item.price : 0,
        currency: item.currency || "INR",
        images: Array.isArray(item.images) ? item.images : [],
        amenities: Array.isArray(item.amenities) ? item.amenities : [],
        host_id: item.host_id,
        host: host,
        rating: typeof item.rating === 'number' ? item.rating : 4.5,
        bedrooms: typeof item.bedrooms === 'number' ? item.bedrooms : 1,
        bathrooms: typeof item.bathrooms === 'number' ? item.bathrooms : 1,
        capacity: typeof item.capacity === 'number' ? item.capacity : 1,
        propertyType: item.property_type || "Unknown",
        property_type: item.property_type || "Unknown", // For compatibility
        featured: Boolean(item.featured),
        reviews: []
      } as Property;
    });

    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
};

// Function to fetch all properties with filters
export const fetchAllProperties = async (filters?: SearchFilters): Promise<Property[]> => {
  try {
    let query = supabase
      .from("properties")
      .select("*");

    // Apply filters if provided
    if (filters) {
      if (filters.location) {
        query = query.ilike('location->city', `%${filters.location}%`);
      }
      
      if (filters.priceRange) {
        query = query.gte('price', filters.priceRange.min)
                     .lte('price', filters.priceRange.max);
      }
      
      if (filters.propertyType) {
        query = query.eq('property_type', filters.propertyType);
      }
      
      if (filters.bedrooms) {
        query = query.eq('bedrooms', filters.bedrooms);
      }
      
      if (filters.amenities && filters.amenities.length > 0) {
        // This is a simplification - actual implementation would need to handle array contains
        query = query.contains('amenities', filters.amenities);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching properties:", error);
      return [];
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log("No properties found or invalid data format");
      return [];
    }

    // Transform the data to match our Property type
    const properties: Property[] = data.map(item => {
      // Process location data safely
      const location = processLocationData(item.location);
      
      // Create a proper host object
      const host = createHostObject(item.host_id);

      // Map database fields to our Property type
      return {
        id: item.id || "",
        title: item.title || "Unnamed Property",
        description: item.description || "",
        location: location,
        price: typeof item.price === 'number' ? item.price : 0,
        currency: item.currency || "INR",
        images: Array.isArray(item.images) ? item.images : [],
        amenities: Array.isArray(item.amenities) ? item.amenities : [],
        host_id: item.host_id,
        host: host,
        rating: typeof item.rating === 'number' ? item.rating : 4.5,
        bedrooms: typeof item.bedrooms === 'number' ? item.bedrooms : 1,
        bathrooms: typeof item.bathrooms === 'number' ? item.bathrooms : 1,
        capacity: typeof item.capacity === 'number' ? item.capacity : 1,
        propertyType: item.property_type || "Unknown",
        property_type: item.property_type || "Unknown", // For compatibility
        featured: Boolean(item.featured),
        reviews: []
      } as Property;
    });

    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
};

// Function to fetch featured properties
export const fetchFeaturedProperties = async (): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("featured", true);

    if (error) {
      console.error("Error fetching featured properties:", error);
      return [];
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log("No featured properties found or invalid data format");
      return [];
    }

    // Transform the data to match our Property type
    const properties: Property[] = data.map(item => {
      // Process location data safely
      const location = processLocationData(item.location);
      
      // Create a proper host object
      const host = createHostObject(item.host_id);

      // Map database fields to our Property type
      return {
        id: item.id || "",
        title: item.title || "Unnamed Property",
        description: item.description || "",
        location: location,
        price: typeof item.price === 'number' ? item.price : 0,
        currency: item.currency || "INR",
        images: Array.isArray(item.images) ? item.images : [],
        amenities: Array.isArray(item.amenities) ? item.amenities : [],
        host_id: item.host_id,
        host: host,
        rating: typeof item.rating === 'number' ? item.rating : 4.5,
        bedrooms: typeof item.bedrooms === 'number' ? item.bedrooms : 1,
        bathrooms: typeof item.bathrooms === 'number' ? item.bathrooms : 1,
        capacity: typeof item.capacity === 'number' ? item.capacity : 1,
        propertyType: item.property_type || "Unknown",
        property_type: item.property_type || "Unknown", // For compatibility
        featured: Boolean(item.featured),
        reviews: []
      } as Property;
    });

    return properties;
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }
};

// Function to fetch a property by its ID
export const fetchPropertyById = async (id: string): Promise<Property | null> => {
  try {
    console.log(`Fetching property with ID: ${id}`);
    
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      return null;
    }

    if (!data) {
      console.log(`No property found with ID ${id}`);
      return null;
    }

    // Process location data safely
    const location = processLocationData(data.location);
    
    // Create a proper host object
    const host = createHostObject(data.host_id);

    // Transform the database response to match our app's Property type
    const property: Property = {
      id: data.id,
      title: data.title || "Unnamed Property",
      description: data.description || "",
      location: location,
      price: typeof data.price === 'number' ? data.price : 0,
      currency: data.currency || "INR",
      images: Array.isArray(data.images) ? data.images : [],
      amenities: Array.isArray(data.amenities) ? data.amenities : [],
      host_id: data.host_id,
      host: host,
      rating: typeof data.rating === 'number' ? data.rating : 4.5,
      bedrooms: typeof data.bedrooms === 'number' ? data.bedrooms : 1,
      bathrooms: typeof data.bathrooms === 'number' ? data.bathrooms : 1,
      capacity: typeof data.capacity === 'number' ? data.capacity : 1,
      propertyType: data.property_type || "Unknown",
      property_type: data.property_type || "Unknown", // For compatibility
      featured: Boolean(data.featured),
      reviews: [] // Would normally fetch reviews in a separate query or join
    };

    console.log("Successfully fetched property:", property);
    return property;
  } catch (error) {
    console.error(`Error fetching property with ID ${id}:`, error);
    return null;
  }
};

// Function to create a new property
export const createProperty = async (propertyData: Omit<Property, 'id'>): Promise<Property | null> => {
  try {
    // Convert the data to match the database schema
    const dbProperty = {
      title: propertyData.title,
      description: propertyData.description,
      location: propertyData.location,
      price: propertyData.price,
      currency: propertyData.currency,
      images: propertyData.images,
      amenities: propertyData.amenities,
      host_id: propertyData.host_id || "",
      rating: propertyData.rating,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      capacity: propertyData.capacity,
      property_type: propertyData.propertyType,
      featured: propertyData.featured
    };
    
    const { data, error } = await supabase
      .from("properties")
      .insert([dbProperty])
      .select("*")
      .single();

    if (error) {
      console.error("Error creating property:", error);
      return null;
    }

    return data as unknown as Property;
  } catch (error) {
    console.error("Error creating property:", error);
    return null;
  }
};

// Function to update an existing property
export const updateProperty = async (id: string, updates: Partial<Property>): Promise<Property | null> => {
  try {
    // Convert the update data to match the database schema if needed
    const dbUpdates: any = {...updates};
    if (updates.propertyType) {
      dbUpdates.property_type = updates.propertyType;
      delete dbUpdates.propertyType;
    }

    const { data, error } = await supabase
      .from("properties")
      .update(dbUpdates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error(`Error updating property with ID ${id}:`, error);
      return null;
    }

    return data as unknown as Property;
  } catch (error) {
    console.error(`Error updating property with ID ${id}:`, error);
    return null;
  }
};

// Function to delete a property by its ID
export const deleteProperty = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting property with ID ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error deleting property with ID ${id}:`, error);
    return false;
  }
};

// Function to fetch all bookings
export const fetchBookings = async (): Promise<Booking[]> => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*");

    if (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }

    // Transform the database response to match our app's Booking type
    const bookings = data.map(item => ({
      id: item.id,
      propertyId: item.property_id,
      property: {} as Property,  // This would need to be populated separately
      userId: item.user_id,
      user: {} as any,  // This would need to be populated separately
      startDate: item.start_date,
      endDate: item.end_date,
      totalPrice: item.total_price,
      status: item.status as "pending" | "confirmed" | "completed" | "cancelled",
      guests: item.guests,
      createdAt: item.created_at
    }));

    return bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

// Function to fetch a booking by its ID
export const fetchBookingById = async (id: string): Promise<Booking | null> => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching booking with ID ${id}:`, error);
      return null;
    }

    // Transform the database response to match our app's Booking type
    const booking: Booking = {
      id: data.id,
      propertyId: data.property_id,
      property: {} as Property,  // This would need to be populated separately
      userId: data.user_id,
      user: {} as any,  // This would need to be populated separately
      startDate: data.start_date,
      endDate: data.end_date,
      totalPrice: data.total_price,
      status: data.status as "pending" | "confirmed" | "completed" | "cancelled",
      guests: data.guests,
      createdAt: data.created_at
    };

    return booking;
  } catch (error) {
    console.error(`Error fetching booking with ID ${id}:`, error);
    return null;
  }
};

// Function to create a new booking
export const createBooking = async (bookingData: Omit<Booking, 'id'>): Promise<Booking | null> => {
  try {
    // Make sure dates are valid
    const startDate = bookingData.startDate ?? new Date().toISOString();
    const endDate = bookingData.endDate ?? new Date().toISOString();
    
    // Current timestamp for created_at
    const currentTimestamp = new Date().toISOString();
    
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          property_id: bookingData.propertyId,
          user_id: bookingData.userId,
          start_date: startDate,
          end_date: endDate,
          total_price: bookingData.totalPrice,
          status: bookingData.status,
          guests: bookingData.guests,
          created_at: currentTimestamp
        }
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Error creating booking:", error);
      return null;
    }

    // Transform the database response to match our app's Booking type
    const booking: Booking = {
      id: data.id,
      propertyId: data.property_id,
      property: bookingData.property || {} as Property,
      userId: data.user_id,
      user: bookingData.user || {} as any,
      startDate: data.start_date,
      endDate: data.end_date,
      totalPrice: data.total_price,
      status: data.status as "pending" | "confirmed" | "completed" | "cancelled",
      guests: data.guests,
      createdAt: data.created_at || currentTimestamp
    };

    return booking;
  } catch (error) {
    console.error("Error creating booking:", error);
    return null;
  }
};

// Function to update an existing booking
export const updateBooking = async (id: string, updates: Partial<Booking>): Promise<Booking | null> => {
  try {
    // Convert the update data to match the database schema
    const dbUpdates: any = {};
    
    if (updates.propertyId) dbUpdates.property_id = updates.propertyId;
    if (updates.userId) dbUpdates.user_id = updates.userId;
    if (updates.startDate) dbUpdates.start_date = updates.startDate;
    if (updates.endDate) dbUpdates.end_date = updates.endDate;
    if (updates.totalPrice) dbUpdates.total_price = updates.totalPrice;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.guests) dbUpdates.guests = updates.guests;
    
    const { data, error } = await supabase
      .from("bookings")
      .update(dbUpdates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error(`Error updating booking with ID ${id}:`, error);
      return null;
    }

    // Transform the database response to match our app's Booking type
    const booking: Booking = {
      id: data.id,
      propertyId: data.property_id,
      property: updates.property || {} as Property,
      userId: data.user_id,
      user: updates.user || {} as any,
      startDate: data.start_date,
      endDate: data.end_date,
      totalPrice: data.total_price,
      status: data.status as "pending" | "confirmed" | "completed" | "cancelled",
      guests: data.guests,
      createdAt: data.created_at
    };

    return booking;
  } catch (error) {
    console.error(`Error updating booking with ID ${id}:`, error);
    return null;
  }
};

// Function to delete a booking by its ID
export const deleteBooking = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting booking with ID ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error deleting booking with ID ${id}:`, error);
    return false;
  }
};

// Function to fetch all transportations
export const fetchTransportations = async (): Promise<Transportation[]> => {
  try {
    const { data, error } = await supabase
      .from("transportation")
      .select("*");

    if (error) {
      console.error("Error fetching transportations:", error);
      return [];
    }

    // Transform the database response to match our app's Transportation type
    const transportations = data.map(item => ({
      id: item.id,
      bookingId: item.booking_id,
      type: item.type as "cab" | "auto" | "other",
      pickupLocation: item.pickup_location,
      dropoffLocation: item.dropoff_location,
      pickupTime: item.pickup_time,
      estimatedPrice: item.estimated_price,
      status: item.status as "pending" | "confirmed" | "completed" | "cancelled"
    }));

    return transportations;
  } catch (error) {
    console.error("Error fetching transportations:", error);
    return [];
  }
};

// Function to fetch a transportation by its ID
export const fetchTransportationById = async (id: string): Promise<Transportation | null> => {
  try {
    const { data, error } = await supabase
      .from("transportation")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching transportation with ID ${id}:`, error);
      return null;
    }

    // Transform the database response to match our app's Transportation type
    const transportation: Transportation = {
      id: data.id,
      bookingId: data.booking_id,
      type: data.type as "cab" | "auto" | "other",
      pickupLocation: data.pickup_location,
      dropoffLocation: data.dropoff_location,
      pickupTime: data.pickup_time,
      estimatedPrice: data.estimated_price,
      status: data.status as "pending" | "confirmed" | "completed" | "cancelled"
    };

    return transportation;
  } catch (error) {
    console.error(`Error fetching transportation with ID ${id}:`, error);
    return null;
  }
};

// Function to create a new transportation
export const createTransportation = async (transportationData: Omit<Transportation, 'id'>): Promise<Transportation | null> => {
  try {
    // Ensure pickup time is valid
    const pickupTime = transportationData.pickupTime ?? new Date().toISOString();
    
    const { data, error } = await supabase
      .from("transportation")
      .insert([
        {
          booking_id: transportationData.bookingId,
          type: transportationData.type,
          pickup_location: transportationData.pickupLocation,
          dropoff_location: transportationData.dropoffLocation,
          pickup_time: pickupTime,
          estimated_price: transportationData.estimatedPrice,
          status: transportationData.status,
        }
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Error creating transportation:", error);
      return null;
    }

    // Transform the database response to match our app's Transportation type
    const transportation: Transportation = {
      id: data.id,
      bookingId: data.booking_id,
      type: data.type as "cab" | "auto" | "other",
      pickupLocation: data.pickup_location,
      dropoffLocation: data.dropoff_location,
      pickupTime: data.pickup_time,
      estimatedPrice: data.estimated_price,
      status: data.status as "pending" | "confirmed" | "completed" | "cancelled"
    };

    return transportation;
  } catch (error) {
    console.error("Error creating transportation:", error);
    return null;
  }
};

// Function to update an existing transportation
export const updateTransportation = async (id: string, updates: Partial<Transportation>): Promise<Transportation | null> => {
  try {
    // Convert the update data to match the database schema
    const dbUpdates: any = {};
    
    if (updates.bookingId) dbUpdates.booking_id = updates.bookingId;
    if (updates.type) dbUpdates.type = updates.type;
    if (updates.pickupLocation) dbUpdates.pickup_location = updates.pickupLocation;
    if (updates.dropoffLocation) dbUpdates.dropoff_location = updates.dropoffLocation;
    if (updates.pickupTime) dbUpdates.pickup_time = updates.pickupTime;
    if (updates.estimatedPrice) dbUpdates.estimated_price = updates.estimatedPrice;
    if (updates.status) dbUpdates.status = updates.status;
    
    const { data, error } = await supabase
      .from("transportation")
      .update(dbUpdates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error(`Error updating transportation with ID ${id}:`, error);
      return null;
    }

    // Transform the database response to match our app's Transportation type
    const transportation: Transportation = {
      id: data.id,
      bookingId: data.booking_id,
      type: data.type as "cab" | "auto" | "other",
      pickupLocation: data.pickup_location,
      dropoffLocation: data.dropoff_location,
      pickupTime: data.pickup_time,
      estimatedPrice: data.estimated_price,
      status: data.status as "pending" | "confirmed" | "completed" | "cancelled"
    };

    return transportation;
  } catch (error) {
    console.error(`Error updating transportation with ID ${id}:`, error);
    return null;
  }
};

// Function to delete a transportation by its ID
export const deleteTransportation = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("transportation")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting transportation with ID ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error deleting transportation with ID ${id}:`, error);
    return false;
  }
};
