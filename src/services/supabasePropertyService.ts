
import { supabase } from "@/integrations/supabase/client";
import { Property, SearchFilters } from "../types";

// Helper for safely processing location data
const processLocationData = (locationData: any): Property['location'] => {
  if (typeof locationData === 'object' && locationData !== null) {
    return {
      city: typeof locationData.city === 'string' ? locationData.city : 'Unknown',
      country: typeof locationData.country === 'string' ? locationData.country : 'India',
      address: typeof locationData.address === 'string' ? locationData.address : undefined,
      coordinates: locationData.coordinates ? {
        lat: typeof locationData.coordinates.lat === 'number' ? locationData.coordinates.lat : 0,
        lng: typeof locationData.coordinates.lng === 'number' ? locationData.coordinates.lng : 0
      } : undefined
    };
  }
  
  return { city: 'Unknown', country: 'India' };
};

// Helper for creating a complete host object
const createHostObject = (hostId: string, hostName?: string, hostAvatar?: string): Property['host'] => {
  return {
    id: hostId || 'unknown',
    name: hostName || 'Host',
    avatar: hostAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    isHost: true,
    joined: new Date().toISOString()
  };
};

// Converts raw Supabase property to the app's Property type
const convertToPropertyType = (rawProperty: any): Property => {
  console.log("Converting raw property:", rawProperty);
  
  // Handle null or undefined properties
  if (!rawProperty) {
    console.error("Received null or undefined property");
    return {
      id: "error-" + Math.random().toString(),
      title: "Error Loading Property",
      description: "",
      location: { city: "Unknown", country: "India" },
      price: 0,
      currency: "INR", // Add the missing currency property
      images: [],
      amenities: [],
      host: createHostObject("unknown"),
      rating: 0,
      bedrooms: 0,
      bathrooms: 0,
      capacity: 0,
      propertyType: "Unknown",
      featured: false,
      reviews: []
    };
  }
  
  return {
    id: rawProperty.id || '',
    title: rawProperty.title || 'Unnamed Property',
    description: rawProperty.description || '',
    location: processLocationData(rawProperty.location),
    price: typeof rawProperty.price === 'number' ? rawProperty.price : 0,
    currency: rawProperty.currency || 'INR',
    images: Array.isArray(rawProperty.images) ? rawProperty.images : [],
    amenities: Array.isArray(rawProperty.amenities) ? rawProperty.amenities : [],
    host: createHostObject(
      rawProperty.host_id || 'unknown',
      'Property Host', // Default name
      undefined // Default avatar
    ),
    rating: typeof rawProperty.rating === 'number' ? rawProperty.rating : 4.5,
    bedrooms: typeof rawProperty.bedrooms === 'number' ? rawProperty.bedrooms : 1,
    bathrooms: typeof rawProperty.bathrooms === 'number' ? rawProperty.bathrooms : 1,
    capacity: typeof rawProperty.capacity === 'number' ? rawProperty.capacity : 2,
    propertyType: rawProperty.property_type || 'Apartment',
    featured: Boolean(rawProperty.featured),
    reviews: []
  };
};

export async function fetchSupabaseProperties(filters?: SearchFilters): Promise<Property[]> {
  try {
    console.log("Fetching properties from Supabase with filters:", filters);
    
    let query = supabase.from('properties').select('*');
    
    // Apply filters if provided
    if (filters) {
      if (filters.location && typeof filters.location === 'string' && filters.location.trim() !== '') {
        query = query.ilike('location->>city', `%${filters.location}%`);
      }
      
      if (filters.guests && typeof filters.guests === 'number' && filters.guests > 0) {
        query = query.gte('capacity', filters.guests);
      }
      
      if (filters.priceRange) {
        if (filters.priceRange.min > 0) {
          query = query.gte('price', filters.priceRange.min);
        }
        if (filters.priceRange.max < 50000) {
          query = query.lte('price', filters.priceRange.max);
        }
      }
      
      if (filters.propertyType && typeof filters.propertyType === 'string') {
        query = query.eq('property_type', filters.propertyType);
      }
      
      if (filters.bedrooms && typeof filters.bedrooms === 'number') {
        query = query.gte('bedrooms', filters.bedrooms);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching properties from Supabase:", error);
      throw error;
    }
    
    console.log("Raw properties data from Supabase:", data);
    
    if (!data || data.length === 0) {
      console.log("No properties found in Supabase, falling back to mock data");
      return []; // Allow fallback to mock data
    }
    
    // Convert data to expected format
    const properties: Property[] = data.map(convertToPropertyType);
    
    console.log(`Successfully fetched ${properties.length} properties from Supabase:`, properties);
    return properties;
    
  } catch (error) {
    console.error("Failed to fetch properties from Supabase:", error);
    return []; // Allow fallback to mock data
  }
}

export async function fetchSupabasePropertyById(id: string): Promise<Property | null> {
  try {
    console.log(`Fetching property with ID ${id} from Supabase`);
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching property ${id}:`, error);
      return null; // Allow fallback to mock data
    }
    
    if (!data) {
      console.log(`Property ${id} not found in Supabase`);
      return null; // Allow fallback to mock data
    }
    
    console.log(`Raw property data from Supabase:`, data);
    
    const property = convertToPropertyType(data);
    console.log(`Successfully fetched property ${id} from Supabase:`, property);
    return property;
    
  } catch (error) {
    console.error(`Failed to fetch property ${id} from Supabase:`, error);
    return null; // Allow fallback to mock data
  }
}
