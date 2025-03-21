
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PropertyCard from "../components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Users, 
  Sliders,
  BedDouble,
  X,
  Bath
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Property, SearchFilters } from "../types";
import { fetchAllProperties } from "../services/propertyService";
import { useQuery } from "@tanstack/react-query";
import { amenitiesList, propertyTypes, locations } from "../data/mockData";
import { Skeleton } from "@/components/ui/skeleton";

const PropertyListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get("location") || "",
    guests: searchParams.get("guests") ? parseInt(searchParams.get("guests") as string) : undefined,
    priceRange: {
      min: 0,
      max: 50000,
    },
    propertyType: undefined,
    amenities: [],
    bedrooms: undefined,
  });

  // Use React Query to fetch properties
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => fetchAllProperties(filters),
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set initial filters from URL params
    if (searchParams.get("checkIn")) {
      setCheckIn(new Date(searchParams.get("checkIn") as string));
    }
    if (searchParams.get("checkOut")) {
      setCheckOut(new Date(searchParams.get("checkOut") as string));
    }
  }, [searchParams]);

  useEffect(() => {
    if (properties) {
      setFilteredProperties(properties);
    }
  }, [properties]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters((prev) => {
      const currentAmenities = prev.amenities || [];
      const newAmenities = currentAmenities.includes(amenity)
        ? currentAmenities.filter((a) => a !== amenity)
        : [...currentAmenities, amenity];
      
      return {
        ...prev,
        amenities: newAmenities,
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      guests: undefined,
      priceRange: {
        min: 0,
        max: 50000,
      },
      propertyType: undefined,
      amenities: [],
      bedrooms: undefined,
    });
    setCheckIn(undefined);
    setCheckOut(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Search and Filters Bar */}
          <div className="mb-8 sticky top-20 z-30 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-purple-100 dark:border-gray-700 p-5 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Location */}
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs font-medium mb-1 block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500" />
                  <Select 
                    value={filters.location} 
                    onValueChange={(value) => handleFilterChange("location", value)}
                  >
                    <SelectTrigger className="pl-10 border-purple-200 dark:border-gray-600">
                      <SelectValue placeholder="Where are you going?" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Check-in */}
              <div className="md:w-40">
                <label className="text-xs font-medium mb-1 block">Check in</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-10 text-left font-normal relative border-purple-200 dark:border-gray-600",
                        !checkIn && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500" />
                      {checkIn ? format(checkIn, "MMM d") : "Add date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Check-out */}
              <div className="md:w-40">
                <label className="text-xs font-medium mb-1 block">Check out</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-10 text-left font-normal relative border-purple-200 dark:border-gray-600",
                        !checkOut && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500" />
                      {checkOut ? format(checkOut, "MMM d") : "Add date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Guests */}
              <div className="md:w-40">
                <label className="text-xs font-medium mb-1 block">Guests</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500" />
                  <Select 
                    value={filters.guests?.toString()} 
                    onValueChange={(value) => 
                      handleFilterChange("guests", value ? parseInt(value) : undefined)
                    }
                  >
                    <SelectTrigger className="pl-10 border-purple-200 dark:border-gray-600">
                      <SelectValue placeholder="Add guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'guest' : 'guests'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* More Filters Button */}
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2 h-10 border-purple-200 hover:bg-purple-50 dark:border-gray-600 dark:hover:bg-gray-800"
                >
                  <Sliders className="h-4 w-4 text-purple-500" />
                  <span>Filters</span>
                </Button>
              </div>
            </div>
            
            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up">
                {/* Price Range */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Price Range (₹)</h3>
                    <span className="text-sm text-muted-foreground">
                      ₹{filters.priceRange?.min} - ₹{filters.priceRange?.max}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[filters.priceRange?.min || 0, filters.priceRange?.max || 50000]}
                    max={50000}
                    step={1000}
                    onValueChange={(value) => 
                      handleFilterChange("priceRange", { min: value[0], max: value[1] })
                    }
                    className="py-4"
                  />
                </div>
                
                {/* Property Type */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Property Type</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Select 
                      value={filters.propertyType} 
                      onValueChange={(value) => handleFilterChange("propertyType", value)}
                    >
                      <SelectTrigger className="border-purple-200 dark:border-gray-600">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Bedrooms */}
                    <Select 
                      value={filters.bedrooms?.toString()} 
                      onValueChange={(value) => 
                        handleFilterChange("bedrooms", value ? parseInt(value) : undefined)
                      }
                    >
                      <SelectTrigger className="border-purple-200 dark:border-gray-600">
                        <SelectValue placeholder="Bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'bedroom' : 'bedrooms'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Amenities */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {amenitiesList.slice(0, 6).map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`amenity-${amenity}`} 
                          checked={filters.amenities?.includes(amenity)}
                          onCheckedChange={() => handleAmenityToggle(amenity)}
                          className="text-purple-500 border-purple-300 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                        />
                        <label 
                          htmlFor={`amenity-${amenity}`} 
                          className="text-sm cursor-pointer"
                        >
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-3 flex justify-end space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={clearFilters} 
                    className="gap-2 border-purple-200 hover:bg-purple-50 dark:border-gray-600 dark:hover:bg-gray-800"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear filters</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {isLoading ? (
                <Skeleton className="h-8 w-52" />
              ) : (
                <>
                  {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
                </>
              )}
            </h1>
            <Select defaultValue="recommended">
              <SelectTrigger className="w-[180px] border-purple-200 dark:border-gray-600">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Property Grid */}
          {!isLoading && filteredProperties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredProperties.map((property, index) => (
                <div 
                  key={property.id}
                  className="animate-fade-up opacity-0 hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: "forwards" }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
          
          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-16 animate-fade-in">
              <div className="mb-4 text-red-500">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="64" 
                  height="64" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="mx-auto"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Error loading properties</h3>
              <p className="text-muted-foreground mb-6">
                Something went wrong while loading properties. Please try again.
              </p>
              <Button variant="default" onClick={() => window.location.reload()} className="gap-2 bg-purple-600 hover:bg-purple-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                  <path d="M8 16H3v5"></path>
                </svg>
                <span>Refresh</span>
              </Button>
            </div>
          )}
          
          {/* No Results */}
          {!isLoading && filteredProperties.length === 0 && !error && (
            <div className="text-center py-16 animate-fade-in">
              <div className="mb-4 text-purple-400">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="64" 
                  height="64" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="mx-auto"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button onClick={clearFilters} className="gap-2 bg-purple-600 hover:bg-purple-700">
                <X className="h-4 w-4" />
                <span>Clear all filters</span>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyListing;
