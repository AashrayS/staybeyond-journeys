
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchFeaturedProperties } from "@/services/propertyService";
import { Property } from "@/types";

const FeaturedProperties = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const properties = await fetchFeaturedProperties();
        setFeaturedProperties(properties);
      } catch (error) {
        console.error("Error fetching featured properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('featured-section');
      if (section) {
        const rect = section.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.75;
        setIsVisible(isInView);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (loading) {
    return (
      <section id="featured-section" className="py-16 md:py-24 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured Properties</h2>
              <p className="text-muted-foreground max-w-2xl">
                Loading featured properties...
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-t-lg"></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-b-lg">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured-section" className="py-16 md:py-24 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl">
        <div className={cn(
          "flex flex-col md:flex-row items-start md:items-end justify-between mb-10 transition-all duration-700 transform",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured Properties</h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover our handpicked selection of extraordinary properties that offer exceptional experiences and amenities
            </p>
          </div>
          <Button variant="ghost" asChild className="mt-4 md:mt-0">
            <Link to="/properties" className="flex items-center gap-2">
              <span>View all properties</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredProperties.map((property, index) => (
              <div 
                key={property.id} 
                className={cn(
                  "transition-all duration-700 transform",
                  isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-10"
                )}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <PropertyCard property={property} featured />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No featured properties available</p>
            <Button asChild className="mt-4">
              <Link to="/properties">View all properties</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
