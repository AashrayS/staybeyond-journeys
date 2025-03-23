
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchFeaturedProperties } from "@/services/propertyService";
import { Property } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const FeaturedProperties = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Use React Query for data fetching with caching
  const { data: featuredProperties, isLoading } = useQuery({
    queryKey: ['featuredProperties'],
    queryFn: fetchFeaturedProperties,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  if (isLoading) {
    return (
      <section id="featured-section" className="py-16 md:py-24 px-4 bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900/10">
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
                <div className="bg-teal-100/50 dark:bg-teal-900/20 h-64 rounded-t-lg"></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-b-lg">
                  <div className="h-6 bg-teal-100/80 dark:bg-teal-900/30 rounded mb-2"></div>
                  <div className="h-4 bg-teal-100/50 dark:bg-teal-900/20 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-teal-100/30 dark:bg-teal-900/10 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured-section" className="py-16 md:py-24 px-4 bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900/10">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured Properties</h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover our handpicked selection of extraordinary properties that offer exceptional experiences and amenities
            </p>
          </div>
          <Button variant="outline" asChild className="mt-4 md:mt-0 border-teal-200 hover:bg-teal-50 text-teal-700 dark:border-teal-800 dark:text-teal-300 dark:hover:bg-teal-900/30">
            <Link to="/properties" className="flex items-center gap-2">
              <span>View all properties</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {featuredProperties && featuredProperties.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate={isVisible ? "show" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {featuredProperties.map((property: Property) => (
              <motion.div key={property.id} variants={item}>
                <PropertyCard property={property} featured />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No featured properties available</p>
            <Button asChild className="mt-4 bg-teal-400 hover:bg-teal-500 text-white">
              <Link to="/properties">View all properties</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
