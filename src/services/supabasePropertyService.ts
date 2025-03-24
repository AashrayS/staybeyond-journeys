
import { supabase } from "@/integrations/supabase/client";
import { Property, SearchFilters } from "@/types";

// Helper function to convert Supabase data to Property type
const convertToPropertyType = (item: any): Property => {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    location: item.location,
    price: item.price,
    currency: item.currency || 'INR',
    images: item.images || [],
    amenities: item.amenities || [],
    host_id: item.host_id,
    host: {
      id: item.host_id,
      name: 'Host',
      avatar: '/placeholder.svg',
      isHost: true,
      joined: new Date().toISOString()
    },
    rating: item.rating || 4.0,
    reviews: [],
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    capacity: item.capacity,
    propertyType: item.property_type,
    property_type: item.property_type,
    featured: item.featured || false,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
};

// Function to fetch all properties with optional filters
export async function fetchSupabaseProperties(filters?: SearchFilters): Promise<Property[]> {
  try {
    console.log("Fetching properties from Supabase with filters:", filters);
    
    let query = supabase
      .from('properties')
      .select('*');
    
    // Apply filters if provided
    if (filters) {
      if (filters.location && typeof filters.location === 'string' && filters.location.trim() !== '') {
        // Try to handle location as a JSON object containing city and country
        query = query.or(`location->city.ilike.%${filters.location}%,location->country.ilike.%${filters.location}%`);
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
    
    if (!data || data.length === 0) {
      console.log("No properties found in Supabase");
      return [];
    }
    
    // Convert data to expected format
    const properties = data.map(convertToPropertyType);
    
    return properties;
    
  } catch (error) {
    console.error("Failed to fetch properties from Supabase:", error);
    return [];
  }
}

// Function to fetch a single property by ID
export async function fetchSupabasePropertyById(id: string): Promise<Property | null> {
  try {
    console.log(`Fetching property ${id} from Supabase`);
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`No property with ID ${id} found in Supabase`);
        return null;
      }
      console.error(`Error fetching property ${id} from Supabase:`, error);
      throw error;
    }
    
    if (!data) {
      console.log(`No property with ID ${id} found in Supabase`);
      return null;
    }
    
    // Convert data to expected format
    const property = convertToPropertyType(data);
    
    return property;
    
  } catch (error) {
    console.error(`Failed to fetch property ${id} from Supabase:`, error);
    return null;
  }
}

// Function to fetch featured properties
export async function fetchFeaturedProperties(): Promise<Property[]> {
  try {
    console.log("Fetching featured properties from Supabase");
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('featured', true)
      .limit(6);
    
    if (error) {
      console.error("Error fetching featured properties from Supabase:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No featured properties found in Supabase");
      return [];
    }
    
    // Convert data to expected format
    const properties = data.map(convertToPropertyType);
    
    return properties;
    
  } catch (error) {
    console.error("Failed to fetch featured properties from Supabase:", error);
    return [];
  }
}

// Adding a function to fetch properties with pagination
export async function fetchPaginatedProperties(
  page: number = 1, 
  pageSize: number = 12, 
  filters?: SearchFilters
): Promise<{ properties: Property[]; total: number }> {
  try {
    console.log(`Fetching paginated properties - page ${page}, size ${pageSize}`, filters);
    
    // Calculate the range for the current page
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Start building the query
    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' });
    
    // Apply filters if provided
    if (filters) {
      if (filters.location && typeof filters.location === 'string' && filters.location.trim() !== '') {
        query = query.or(`location->city.ilike.%${filters.location}%,location->country.ilike.%${filters.location}%`);
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
    
    // Add pagination
    query = query.range(from, to);
    
    // Execute the query
    const { data, error, count } = await query;
    
    if (error) {
      console.error("Error fetching paginated properties:", error);
      throw error;
    }
    
    console.log(`Fetched ${data?.length || 0} properties (page ${page}) out of ${count} total`);
    
    if (!data || data.length === 0) {
      console.log("No properties found in this page, returning empty array");
      return { properties: [], total: count || 0 };
    }
    
    // Convert data to expected format
    const properties = data.map(convertToPropertyType);
    
    return { 
      properties, 
      total: count || 0 
    };
    
  } catch (error) {
    console.error("Failed to fetch paginated properties:", error);
    return { properties: [], total: 0 };
  }
}
