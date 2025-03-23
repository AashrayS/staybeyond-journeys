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

    return data as Property[];
  } catch (error) {
    console.error("Error fetching properties:", error);
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

    return data as Property;
  } catch (error) {
    console.error(`Error fetching property with ID ${id}:`, error);
    return null;
  }
};

// Function to create a new property
export const createProperty = async (propertyData: Omit<Property, 'id'>): Promise<Property | null> => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .insert([propertyData])
      .select("*")
      .single();

    if (error) {
      console.error("Error creating property:", error);
      return null;
    }

    return data as Property;
  } catch (error) {
    console.error("Error creating property:", error);
    return null;
  }
};

// Function to update an existing property
export const updateProperty = async (id: string, updates: Partial<Property>): Promise<Property | null> => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error(`Error updating property with ID ${id}:`, error);
      return null;
    }

    return data as Property;
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

    return data as Booking[];
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

    return data as Booking;
  } catch (error) {
    console.error(`Error fetching booking with ID ${id}:`, error);
    return null;
  }
};

// Function to create a new booking
export const createBooking = async (bookingData: Omit<Booking, 'id'>): Promise<Booking | null> => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          property_id: bookingData.propertyId,
          user_id: bookingData.userId,
          start_date: bookingData.startDate ?? new Date().toISOString(),
          end_date: bookingData.endDate ?? new Date().toISOString(),
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

    return data as Booking;
  } catch (error) {
    console.error("Error creating booking:", error);
    return null;
  }
};

// Function to update an existing booking
export const updateBooking = async (id: string, updates: Partial<Booking>): Promise<Booking | null> => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error(`Error updating booking with ID ${id}:`, error);
      return null;
    }

    return data as Booking;
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
      .from("transportations")
      .select("*");

    if (error) {
      console.error("Error fetching transportations:", error);
      return [];
    }

    return data as Transportation[];
  } catch (error) {
    console.error("Error fetching transportations:", error);
    return [];
  }
};

// Function to fetch a transportation by its ID
export const fetchTransportationById = async (id: string): Promise<Transportation | null> => {
  try {
    const { data, error } = await supabase
      .from("transportations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching transportation with ID ${id}:`, error);
      return null;
    }

    return data as Transportation;
  } catch (error) {
    console.error(`Error fetching transportation with ID ${id}:`, error);
    return null;
  }
};

// Function to create a new transportation
export const createTransportation = async (transportationData: Omit<Transportation, 'id'>): Promise<Transportation | null> => {
  try {
    const { data, error } = await supabase
      .from("transportations")
      .insert([
        {
          booking_id: transportationData.bookingId,
          type: transportationData.type,
          pickup_location: transportationData.pickupLocation,
          dropoff_location: transportationData.dropoffLocation,
          pickup_time: transportationData.pickupTime ?? new Date().toISOString(),
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

    return data as Transportation;
  } catch (error) {
    console.error("Error creating transportation:", error);
    return null;
  }
};

// Function to update an existing transportation
export const updateTransportation = async (id: string, updates: Partial<Transportation>): Promise<Transportation | null> => {
  try {
    const { data, error } = await supabase
      .from("transportations")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error(`Error updating transportation with ID ${id}:`, error);
      return null;
    }

    return data as Transportation;
  } catch (error) {
    console.error(`Error updating transportation with ID ${id}:`, error);
    return null;
  }
};

// Function to delete a transportation by its ID
export const deleteTransportation = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("transportations")
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
