
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { properties } from "../data/mockData";

const FeaturedProperties = () => {
  const [isVisible, setIsVisible] = useState(false);
  const featuredProperties = properties.filter(prop => prop.featured);

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
      </div>
    </section>
  );
};

export default FeaturedProperties;
