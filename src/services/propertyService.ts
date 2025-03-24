
import { locations, properties as mockProperties, bookings as mockBookings } from "../data/mockData";
import { Property, SearchFilters, Booking, Transportation } from "../types";
import { fetchSupabaseProperties, fetchSupabasePropertyById } from "./supabasePropertyService";

// Helper to ensure we're working with valid properties that match our expected types
const validateProperty = (property: Property): Property => {
  // Ensure location data is valid
  if (!property.location || typeof property.location !== 'object') {
    property.location = { city: 'Unknown', country: 'India' };
  }

  // Ensure other data properties have valid defaults
  return {
    ...property,
    id: property.id || `mock-${Math.random().toString(36).substr(2, 9)}`,
    title: property.title || 'Unnamed Property',
    description: property.description || 'No description available',
    price: typeof property.price === 'number' ? property.price : 5000,
    bedrooms: typeof property.bedrooms === 'number' ? property.bedrooms : 1,
    bathrooms: typeof property.bathrooms === 'number' ? property.bathrooms : 1,
    capacity: typeof property.capacity === 'number' ? property.capacity : 2,
    propertyType: property.propertyType || 'Apartment',
    images: Array.isArray(property.images) ? property.images : [],
    amenities: Array.isArray(property.amenities) ? property.amenities : [],
    rating: typeof property.rating === 'number' ? property.rating : 4.0,
    featured: Boolean(property.featured),
    currency: property.currency || 'INR',
    reviews: Array.isArray(property.reviews) ? property.reviews : []
  };
};

// Helper to filter properties based on search criteria
const filterProperties = (properties: Property[], filters?: SearchFilters): Property[] => {
  if (!filters) return properties;

  return properties.filter(property => {
    // Location filter
    if (filters.location && property.location?.city && 
        !property.location.city.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    // Guest count filter
    if (filters.guests && property.capacity < filters.guests) {
      return false;
    }

    // Price range filter
    if (filters.priceRange) {
      if (filters.priceRange.min > 0 && property.price < filters.priceRange.min) {
        return false;
      }
      if (filters.priceRange.max < 50000 && property.price > filters.priceRange.max) {
        return false;
      }
    }

    // Property type filter
    if (filters.propertyType && property.propertyType !== filters.propertyType) {
      return false;
    }

    // Bedrooms filter
    if (filters.bedrooms && property.bedrooms < filters.bedrooms) {
      return false;
    }

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      if (!property.amenities) return false;
      
      for (const amenity of filters.amenities) {
        if (!property.amenities.includes(amenity)) {
          return false;
        }
      }
    }

    return true;
  });
};

// Fetch all properties with optional filtering
export const fetchAllProperties = async (filters?: SearchFilters): Promise<Property[]> => {
  try {
    console.log("Fetching all properties with filters:", filters);
    
    // First try to get properties from Supabase
    const supabaseProperties = await fetchSupabaseProperties(filters);
    
    // If we got properties from Supabase, use those
    if (supabaseProperties && supabaseProperties.length > 0) {
      console.log(`Returning ${supabaseProperties.length} properties from Supabase`);
      return supabaseProperties.map(validateProperty);
    }
    
    // Otherwise fall back to mock data
    console.log("Falling back to mock data");
    let filteredProperties = filterProperties(mockProperties, filters);
    
    // Validate each property to ensure it matches our expected types
    return filteredProperties.map(validateProperty);
    
  } catch (error) {
    console.error("Error in fetchAllProperties:", error);
    // Fall back to mock data on error
    let filteredProperties = filterProperties(mockProperties, filters);
    return filteredProperties.map(validateProperty);
  }
};

// Fetch featured properties
export const fetchFeaturedProperties = async (): Promise<Property[]> => {
  try {
    console.log("Fetching featured properties from Supabase");
    
    // First try to get all properties from Supabase
    const supabaseProperties = await fetchSupabaseProperties();
    
    // If we got properties from Supabase, filter for featured ones
    if (supabaseProperties && supabaseProperties.length > 0) {
      console.log(`Received ${supabaseProperties.length} properties from Supabase, checking for featured ones`);
      
      // Debug each property's featured status
      supabaseProperties.forEach(p => {
        console.log(`Property ${p.id} (${p.title}) featured status: ${p.featured}`);
      });
      
      // Filter properties where featured is true
      const featuredProperties = supabaseProperties.filter(p => p.featured === true).slice(0, 6);
      console.log(`Found ${featuredProperties.length} featured properties in Supabase data`);
      
      if (featuredProperties.length > 0) {
        return featuredProperties.map(validateProperty);
      }
      
      // If no featured properties in Supabase, fall back to mock data
      console.log("No featured properties found in Supabase, falling back to mock data");
    } else {
      console.log("No properties received from Supabase, falling back to mock data");
    }
    
    // Fall back to mock data
    const featuredProperties = mockProperties.filter(p => p.featured).slice(0, 6);
    console.log(`Using ${featuredProperties.length} mock featured properties`);
    return featuredProperties.map(validateProperty);
    
  } catch (error) {
    console.error("Error in fetchFeaturedProperties:", error);
    // Fall back to mock data on error
    const featuredProperties = mockProperties.filter(p => p.featured).slice(0, 6);
    return featuredProperties.map(validateProperty);
  }
};

// Fetch a single property by ID
export const fetchPropertyById = async (id: string): Promise<Property | null> => {
  try {
    console.log(`Fetching property with ID: ${id}`);
    
    // First try to get the property from Supabase
    const supabaseProperty = await fetchSupabasePropertyById(id);
    
    // If we got the property from Supabase, use it
    if (supabaseProperty) {
      console.log(`Found property ${id} in Supabase`);
      return validateProperty(supabaseProperty);
    }
    
    // Otherwise fall back to mock data
    console.log(`Property ${id} not found in Supabase, checking mock data`);
    const property = mockProperties.find(p => p.id === id);
    
    if (!property) {
      console.log(`Property ${id} not found in mock data either`);
      return null;
    }
    
    return validateProperty(property);
    
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    
    // Fall back to mock data on error
    const property = mockProperties.find(p => p.id === id);
    return property ? validateProperty(property) : null;
  }
};

// Get all available locations
export const fetchAllLocations = async (): Promise<string[]> => {
  // For simplicity, we'll use the mock locations for now
  // This could be enhanced to fetch from Supabase in the future
  return locations;
};

// Create a new booking
export const createBooking = async (bookingData: Omit<Booking, 'id'>): Promise<Booking | null> => {
  try {
    console.log("Creating booking with data:", bookingData);
    
    // Store the booking in Supabase
    const { data: bookingInsertData, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        property_id: bookingData.propertyId,
        user_id: bookingData.userId,
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
        total_price: bookingData.totalPrice,
        status: bookingData.status,
        guests: bookingData.guests
      })
      .select('*')
      .single();
    
    if (bookingError) {
      console.error("Error saving booking to Supabase:", bookingError);
      // Fall back to mock booking creation if Supabase fails
      const newBooking: Booking = {
        ...bookingData,
        id: `booking-${Math.random().toString(36).substr(2, 9)}`,
        property_id: bookingData.propertyId,
        user_id: bookingData.userId,
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
        created_at: bookingData.createdAt || new Date().toISOString()
      };
      
      // Add to mock bookings (this would be a Supabase insert in production)
      mockBookings.push(newBooking);
      
      console.log("Created mock booking:", newBooking);
      return newBooking;
    }
    
    console.log("Booking successfully saved to Supabase:", bookingInsertData);
    
    // Convert the Supabase booking to our application Booking type
    const savedBooking: Booking = {
      id: bookingInsertData.id,
      propertyId: bookingInsertData.property_id,
      property: bookingData.property,
      userId: bookingInsertData.user_id,
      user: bookingData.user,
      startDate: bookingInsertData.start_date,
      endDate: bookingInsertData.end_date,
      totalPrice: bookingInsertData.total_price,
      status: bookingInsertData.status,
      guests: bookingInsertData.guests,
      createdAt: bookingInsertData.created_at
    };
    
    return savedBooking;
  } catch (error) {
    console.error("Error creating booking:", error);
    return null;
  }
};

// Create a new transportation booking
export const createTransportation = async (transportData: Omit<Transportation, 'id'>): Promise<Transportation | null> => {
  try {
    console.log("Creating transportation with data:", transportData);
    
    // Store the transportation in Supabase
    const { data: transportInsertData, error: transportError } = await supabase
      .from('transportation')
      .insert({
        booking_id: transportData.bookingId,
        type: transportData.type,
        pickup_location: transportData.pickupLocation,
        dropoff_location: transportData.dropoffLocation,
        pickup_time: transportData.pickupTime,
        estimated_price: transportData.estimatedPrice,
        status: transportData.status
      })
      .select('*')
      .single();
    
    if (transportError) {
      console.error("Error saving transportation to Supabase:", transportError);
      // Fall back to mock transportation creation
      const newTransportation: Transportation = {
        ...transportData,
        id: `transport-${Math.random().toString(36).substr(2, 9)}`,
        booking_id: transportData.bookingId,
        pickup_location: transportData.pickupLocation,
        dropoff_location: transportData.dropoffLocation,
        pickup_time: transportData.pickupTime
      };
      
      console.log("Created mock transportation:", newTransportation);
      return newTransportation;
    }
    
    console.log("Transportation successfully saved to Supabase:", transportInsertData);
    
    // Convert the Supabase transportation to our application Transportation type
    const savedTransportation: Transportation = {
      id: transportInsertData.id,
      bookingId: transportInsertData.booking_id,
      type: transportInsertData.type,
      pickupLocation: transportInsertData.pickup_location,
      dropoffLocation: transportInsertData.dropoff_location,
      pickupTime: transportInsertData.pickup_time,
      estimatedPrice: transportInsertData.estimated_price,
      status: transportInsertData.status
    };
    
    return savedTransportation;
  } catch (error) {
    console.error("Error creating transportation:", error);
    return null;
  }
};

// Import supabase at the top of the file
import { supabase } from "@/integrations/supabase/client";
