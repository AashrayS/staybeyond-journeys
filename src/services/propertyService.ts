
import { locations, properties as mockProperties, bookings as mockBookings } from "../data/mockData";
import { Property, SearchFilters, Booking, Transportation } from "../types";
import { 
  fetchSupabaseProperties, 
  fetchSupabasePropertyById, 
  fetchFeaturedProperties as fetchSupabaseFeaturedProperties,
  fetchPaginatedProperties as fetchSupabasePaginatedProperties 
} from "./supabasePropertyService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const validateProperty = (property: Property): Property => {
  if (!property.location || typeof property.location !== 'object') {
    property.location = { city: 'Unknown', country: 'India' };
  }

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

const filterProperties = (properties: Property[], filters?: SearchFilters): Property[] => {
  if (!filters) return properties;

  return properties.filter(property => {
    if (filters.location && property.location?.city && 
        !property.location.city.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    if (filters.guests && property.capacity < filters.guests) {
      return false;
    }

    if (filters.priceRange) {
      if (filters.priceRange.min > 0 && property.price < filters.priceRange.min) {
        return false;
      }
      if (filters.priceRange.max < 50000 && property.price > filters.priceRange.max) {
        return false;
      }
    }

    if (filters.propertyType && property.propertyType !== filters.propertyType) {
      return false;
    }

    if (filters.bedrooms && property.bedrooms < filters.bedrooms) {
      return false;
    }

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

export const fetchAllProperties = async (filters?: SearchFilters): Promise<Property[]> => {
  try {
    console.log("Fetching all properties with filters:", filters);
    
    const supabaseProperties = await fetchSupabaseProperties(filters);
    
    if (supabaseProperties && supabaseProperties.length > 0) {
      console.log(`Returning ${supabaseProperties.length} properties from Supabase`);
      return supabaseProperties.map(validateProperty);
    }
    
    console.log("Falling back to mock data");
    let filteredProperties = filterProperties(mockProperties, filters);
    return filteredProperties.map(validateProperty);
    
  } catch (error) {
    console.error("Error in fetchAllProperties:", error);
    let filteredProperties = filterProperties(mockProperties, filters);
    return filteredProperties.map(validateProperty);
  }
};

export const fetchFeaturedProperties = async (): Promise<Property[]> => {
  try {
    console.log("Fetching featured properties");
    
    const supabaseFeaturedProperties = await fetchSupabaseFeaturedProperties();
    
    if (supabaseFeaturedProperties && supabaseFeaturedProperties.length > 0) {
      console.log(`Found ${supabaseFeaturedProperties.length} featured properties in Supabase`);
      return supabaseFeaturedProperties.map(validateProperty);
    }
    
    console.log("No featured properties found in Supabase, falling back to mock data");
    const featuredProperties = mockProperties.filter(p => p.featured).slice(0, 6);
    console.log(`Using ${featuredProperties.length} mock featured properties`);
    return featuredProperties.map(validateProperty);
    
  } catch (error) {
    console.error("Error in fetchFeaturedProperties:", error);
    const featuredProperties = mockProperties.filter(p => p.featured).slice(0, 6);
    return featuredProperties.map(validateProperty);
  }
};

export const fetchPropertyById = async (id: string): Promise<Property | null> => {
  try {
    console.log(`Fetching property with ID: ${id}`);
    
    const supabaseProperty = await fetchSupabasePropertyById(id);
    
    if (supabaseProperty) {
      console.log(`Found property ${id} in Supabase`);
      return validateProperty(supabaseProperty);
    }
    
    console.log(`Property ${id} not found in Supabase, checking mock data`);
    const property = mockProperties.find(p => p.id === id);
    
    if (!property) {
      console.log(`Property ${id} not found in mock data either`);
      return null;
    }
    
    return validateProperty(property);
    
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    
    const property = mockProperties.find(p => p.id === id);
    return property ? validateProperty(property) : null;
  }
};

export const fetchAllLocations = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('location');
    
    if (error || !data || data.length === 0) {
      console.log("Falling back to mock locations");
      return locations;
    }
    
    const uniqueCities = [...new Set(
      data
        .map(item => item.location?.city)
        .filter(city => city && typeof city === 'string')
    )];
    
    return uniqueCities.length > 0 ? uniqueCities as string[] : locations;
    
  } catch (error) {
    console.error("Error fetching locations:", error);
    return locations;
  }
};

export const createBooking = async (bookingData: Omit<Booking, 'id'>): Promise<Booking | null> => {
  try {
    console.log("Creating booking with data:", bookingData);
    
    if (!bookingData.propertyId || !bookingData.userId || !bookingData.startDate || !bookingData.endDate) {
      console.error("Missing required booking fields");
      toast({
        title: "Booking Error",
        description: "Missing required booking information",
        variant: "destructive"
      });
      return null;
    }
    
    const { data: bookingInsertData, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        property_id: bookingData.propertyId,
        user_id: bookingData.userId,
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
        total_price: bookingData.totalPrice,
        status: bookingData.status || "pending",
        guests: bookingData.guests || 1
      })
      .select('*')
      .single();
    
    if (bookingError) {
      console.error("Error saving booking to Supabase:", bookingError);
      toast({
        title: "Booking Failed",
        description: "Could not save your booking. Please try again.",
        variant: "destructive"
      });
      
      const newBooking: Booking = {
        ...bookingData,
        id: `booking-${Math.random().toString(36).substr(2, 9)}`,
        property_id: bookingData.propertyId,
        user_id: bookingData.userId,
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
        created_at: bookingData.createdAt || new Date().toISOString()
      };
      
      mockBookings.push(newBooking);
      
      console.log("Created mock booking:", newBooking);
      return newBooking;
    }
    
    console.log("Booking successfully saved to Supabase:", bookingInsertData);
    toast({
      title: "Booking Confirmed",
      description: "Your booking has been successfully created.",
      variant: "default"
    });
    
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
    toast({
      title: "Booking Error",
      description: "An unexpected error occurred. Please try again later.",
      variant: "destructive"
    });
    return null;
  }
};

export const createTransportation = async (transportData: Omit<Transportation, 'id'>): Promise<Transportation | null> => {
  try {
    console.log("Creating transportation with data:", transportData);
    
    if (!transportData.pickupLocation || !transportData.dropoffLocation || !transportData.pickupTime) {
      console.error("Missing required transportation fields");
      toast({
        title: "Transportation Error",
        description: "Missing required transportation information",
        variant: "destructive"
      });
      return null;
    }
    
    // Ensure type is one of the allowed values
    const transportType = ["cab", "auto", "other"].includes(transportData.type) 
      ? transportData.type as "cab" | "auto" | "other"
      : "cab";
      
    // Ensure status is one of the allowed values
    const transportStatus = ["pending", "confirmed", "completed", "cancelled"].includes(transportData.status || "") 
      ? transportData.status as "pending" | "confirmed" | "completed" | "cancelled"
      : "pending";
    
    const { data: transportInsertData, error: transportError } = await supabase
      .from('transportation')
      .insert({
        booking_id: transportData.bookingId,
        type: transportType,
        pickup_location: transportData.pickupLocation,
        dropoff_location: transportData.dropoffLocation,
        pickup_time: transportData.pickupTime,
        estimated_price: transportData.estimatedPrice,
        status: transportStatus
      })
      .select('*')
      .single();
    
    if (transportError) {
      console.error("Error saving transportation to Supabase:", transportError);
      toast({
        title: "Transportation Booking Failed",
        description: "Could not save your transportation booking. Please try again.",
        variant: "destructive"
      });
      
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
    toast({
      title: "Transportation Confirmed",
      description: "Your transportation has been successfully booked.",
      variant: "default"
    });
    
    const savedTransportation: Transportation = {
      id: transportInsertData.id,
      bookingId: transportInsertData.booking_id,
      type: transportInsertData.type as "cab" | "auto" | "other",
      pickupLocation: transportInsertData.pickup_location,
      dropoffLocation: transportInsertData.dropoff_location,
      pickupTime: transportInsertData.pickup_time,
      estimatedPrice: transportInsertData.estimated_price,
      status: transportInsertData.status as "pending" | "confirmed" | "completed" | "cancelled"
    };
    
    return savedTransportation;
  } catch (error) {
    console.error("Error creating transportation:", error);
    toast({
      title: "Transportation Error",
      description: "An unexpected error occurred. Please try again later.",
      variant: "destructive"
    });
    return null;
  }
};

export const fetchPaginatedProperties = async (
  page: number = 1,
  pageSize: number = 12,
  filters?: SearchFilters
): Promise<{ properties: Property[]; total: number }> => {
  try {
    const { properties: supabaseProperties, total } = await fetchSupabasePaginatedProperties(page, pageSize, filters);
    
    if (supabaseProperties && supabaseProperties.length > 0) {
      return {
        properties: supabaseProperties.map(validateProperty),
        total
      };
    }
    
    console.log("Falling back to mock data for pagination");
    let filteredProperties = filterProperties(mockProperties, filters);
    
    const startIndex = (page - 1) * pageSize;
    const paginatedProperties = filteredProperties.slice(startIndex, startIndex + pageSize);
    
    return {
      properties: paginatedProperties.map(validateProperty),
      total: filteredProperties.length
    };
    
  } catch (error) {
    console.error("Error in fetchPaginatedProperties:", error);
    let filteredProperties = filterProperties(mockProperties, filters);
    
    const startIndex = (page - 1) * pageSize;
    const paginatedProperties = filteredProperties.slice(startIndex, startIndex + pageSize);
    
    return {
      properties: paginatedProperties.map(validateProperty),
      total: filteredProperties.length
    };
  }
};
