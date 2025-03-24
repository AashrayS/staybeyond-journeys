
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
