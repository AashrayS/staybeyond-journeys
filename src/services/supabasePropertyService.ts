
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
      if (filters.location) {
        query = query.filter('location->city', 'ilike', `%${filters.location}%`);
      }
      
      if (filters.guests) {
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
      
      if (filters.propertyType) {
        query = query.eq('property_type', filters.propertyType);
      }
      
      if (filters.bedrooms) {
        query = query.gte('bedrooms', filters.bedrooms);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching properties from Supabase:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No properties found in Supabase, falling back to mock data");
      return []; // Allow fallback to mock data
    }
    
    // Convert data to expected format
    const properties: Property[] = data.map(convertToPropertyType);
    
    console.log(`Successfully fetched ${properties.length} properties from Supabase`);
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
    
    const property = convertToPropertyType(data);
    console.log(`Successfully fetched property ${id} from Supabase`);
    return property;
    
  } catch (error) {
    console.error(`Failed to fetch property ${id} from Supabase:`, error);
    return null; // Allow fallback to mock data
  }
}
