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
    // First try to get properties from Supabase
    const supabaseProperties = await fetchSupabaseProperties();
    
    // If we got properties from Supabase, filter for featured ones
    if (supabaseProperties && supabaseProperties.length > 0) {
      const featuredProperties = supabaseProperties.filter(p => p.featured).slice(0, 6);
      if (featuredProperties.length > 0) {
        return featuredProperties.map(validateProperty);
      }
    }
    
    // Otherwise fall back to mock data
    const featuredProperties = mockProperties.filter(p => p.featured).slice(0, 6);
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
    
    // For now, we'll create a mock booking with an ID
    // In a real app, this would be inserted into Supabase
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Math.random().toString(36).substr(2, 9)}`,
      // Ensure we use the right property names for both frontend and backend
      property_id: bookingData.propertyId,
      user_id: bookingData.userId,
      start_date: bookingData.startDate,
      end_date: bookingData.endDate,
      created_at: bookingData.createdAt || new Date().toISOString()
    };
    
    // Add to mock bookings (this would be a Supabase insert in production)
    mockBookings.push(newBooking);
    
    console.log("Created booking:", newBooking);
    return newBooking;
  } catch (error) {
    console.error("Error creating booking:", error);
    return null;
  }
};

// Create a new transportation booking
export const createTransportation = async (transportData: Omit<Transportation, 'id'>): Promise<Transportation | null> => {
  try {
    console.log("Creating transportation with data:", transportData);
    
    // For now, we'll create a mock transportation with an ID
    // In a real app, this would be inserted into Supabase
    const newTransportation: Transportation = {
      ...transportData,
      id: `transport-${Math.random().toString(36).substr(2, 9)}`,
      // Ensure we use the right property names for both frontend and backend
      booking_id: transportData.bookingId,
      pickup_location: transportData.pickupLocation,
      dropoff_location: transportData.dropoffLocation,
      pickup_time: transportData.pickupTime
    };
    
    console.log("Created transportation:", newTransportation);
    return newTransportation;
  } catch (error) {
    console.error("Error creating transportation:", error);
    return null;
  }
};
