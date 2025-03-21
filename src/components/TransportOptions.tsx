
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronRight, ImageIcon } from "lucide-react";
import { transportationOptions } from "../data/mockData";

const TransportOptions = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
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

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [id]: true
    }));
  };

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({
      ...prev,
      [id]: true
    }));
    handleImageLoad(id); // Mark as loaded to remove loading state
  };

  return (
    <section ref={sectionRef} id="transport-section" className="py-16 md:py-24 px-4 bg-white dark:bg-gray-800">
      <div className="container mx-auto max-w-7xl">
        <div className={cn(
          "flex flex-col md:flex-row items-start md:items-end justify-between mb-10 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <div>
            <div className="inline-block mb-3">
              <Badge variant="secondary" className="font-medium mb-2">Transport</Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Get Around With Ease</h2>
            <p className="text-muted-foreground max-w-2xl">
              Book convenient transportation options to explore your destination or travel between properties
            </p>
          </div>
          <Button variant="ghost" asChild className="mt-4 md:mt-0">
            <Link to="/transport" className="flex items-center gap-2">
              <span>View all options</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {transportationOptions.map((option, index) => (
            <Card 
              key={option.id}
              className={cn(
                "overflow-hidden hover-lift transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={cn(
                "aspect-[4/3] w-full overflow-hidden relative",
                !loadedImages[option.id] && "image-loading"
              )}>
                {imageErrors[option.id] ? (
                  <div className="h-full w-full image-placeholder flex flex-col items-center justify-center p-4">
                    <ImageIcon className="h-8 w-8 mb-2 text-blue-400" />
                    <span>Image unavailable</span>
                  </div>
                ) : (
                  <img
                    src={option.image}
                    alt={option.name}
                    className={cn(
                      "object-cover w-full h-full transition-transform duration-300 hover:scale-105",
                      loadedImages[option.id] ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => handleImageLoad(option.id)}
                    onError={() => handleImageError(option.id)}
                  />
                )}
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{option.name}</h3>
                  <Badge variant="outline" className="capitalize">{option.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold">₹{(option.basePrice * 83).toFixed(0)}</span>
                    <span className="text-sm text-muted-foreground"> base fare</span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/transport">Book now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransportOptions;
