
// src/services/propertyService.ts

import { supabase } from "@/integrations/supabase/client";
import { Property, Booking, Transportation } from "@/types";

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

    return data as unknown as Property[];
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

    return data as unknown as Property[];
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }
};

// Function to fetch a property by its ID
export const fetchPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      return null;
    }

    return data as unknown as Property;
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

