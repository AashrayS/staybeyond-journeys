
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Star, 
  Bed, 
  Bath, 
  Users, 
  Heart,
  ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Property } from "../types";

interface PropertyCardProps {
  property: Property;
  featured?: boolean;
}

const PropertyCard = ({ property, featured = false }: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset image state when property changes
  useEffect(() => {
    setIsImageLoaded(false);
    setImageError(false);
  }, [property.id, currentImageIndex]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
    setImageError(false);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
    setImageError(false);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoaded(true);
  };

  return (
    <Link to={`/properties/${property.id}`}>
      <Card className={cn(
        "overflow-hidden border-0 shadow-md hover-lift transition-all duration-300 h-full bg-white dark:bg-gray-800",
        featured ? "border-teal-200 dark:border-teal-900/20" : ""
      )}>
        {/* Property Image */}
        <div className={cn(
          "relative aspect-[4/3] w-full overflow-hidden rounded-t-lg", 
          !isImageLoaded && "image-loading"
        )}>
          {imageError ? (
            <div className="h-full w-full image-placeholder flex flex-col items-center justify-center p-4 text-center">
              <ImageIcon className="h-8 w-8 mb-2 text-teal-400" />
              <span>Image unavailable</span>
            </div>
          ) : (
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className={cn(
                "object-cover w-full h-full transition-all duration-500", 
                isImageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setIsImageLoaded(true)}
              onError={handleImageError}
            />
          )}
          
          {/* Image Navigation */}
          {!imageError && property.images.length > 1 && (
            <div className="absolute inset-0 flex justify-between items-center px-2 opacity-0 hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60"
                onClick={handlePrevImage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60"
                onClick={handleNextImage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Button>
            </div>
          )}
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 h-8 w-8 rounded-full transition-colors",
              isFavorite 
                ? "bg-white/90 text-teal-500 hover:bg-white/80" 
                : "bg-black/30 text-white hover:bg-black/40"
            )}
            onClick={toggleFavorite}
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
          </Button>
          
          {/* Property Type Badge */}
          <Badge variant="secondary" className="absolute top-2 left-2 bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100 border-none">
            {property.propertyType}
          </Badge>
          
          {/* Featured Badge */}
          {property.featured && (
            <Badge className="absolute bottom-2 left-2 bg-gradient-to-r from-teal-500 to-green-400 text-white border-none">
              Featured
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Property Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-base line-clamp-1">{property.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-0.5">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0 text-teal-500" />
                  <span className="truncate">{property.location.city}, {property.location.country}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-teal-50 dark:bg-teal-900/30 py-0.5 px-2 rounded text-sm">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">{property.rating.toFixed(1)}</span>
              </div>
            </div>
            
            {/* Property Features */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Bed className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span>Up to {property.capacity}</span>
              </div>
            </div>
            
            {/* Property Price */}
            <div className="flex items-end justify-between mt-1 pt-2 border-t border-teal-100 dark:border-gray-700">
              <div>
                <span className="text-base font-semibold text-teal-800 dark:text-teal-300">₹{property.price.toLocaleString('en-IN')}</span>
                <span className="text-muted-foreground text-sm"> / night</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;
