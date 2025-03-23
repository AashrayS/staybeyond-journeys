
import { Link } from "react-router-dom";
import { Property } from "../types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, BedDouble, Bath, Users } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PropertyCardProps {
  property: Property;
  featured?: boolean; // Add optional featured prop
}

const PropertyCard = ({ property, featured }: PropertyCardProps) => {
  // Provide fallback values for missing data
  const {
    id,
    title = "Property Title",
    location = { city: "Unknown", country: "India" },
    price = 0,
    currency = "INR",
    images = [],
    bedrooms = 0,
    bathrooms = 0,
    capacity = 0,
    rating = 0,
    amenities = []
  } = property || {};

  // Handle missing values gracefully
  const city = location?.city || "Unknown City";
  const country = location?.country || "India";
  const defaultImageUrl = "/placeholder.svg";
  const imageUrl = images && images.length > 0 ? images[0] : defaultImageUrl;

  if (!property || !id) {
    console.warn("Property card received invalid property data:", property);
    return null;
  }

  return (
    <Link
      to={`/properties/${id}`}
      className="block transition-all duration-300 hover:shadow-lg rounded-xl"
    >
      <Card className={`border-purple-100 dark:border-gray-700 overflow-hidden h-full flex flex-col ${featured ? 'border-2 border-purple-300' : ''}`}>
        <CardHeader className="p-0">
          <AspectRatio ratio={4/3} className="bg-gray-100">
            <img
              src={imageUrl}
              alt={title}
              className="object-cover w-full h-full rounded-t-xl"
              onError={(e) => {
                console.log("Image error, using fallback");
                (e.target as HTMLImageElement).src = defaultImageUrl;
              }}
            />
          </AspectRatio>
          {featured && (
            <Badge 
              className="absolute top-3 left-3 bg-purple-600 hover:bg-purple-700"
            >
              Featured
            </Badge>
          )}
          <Badge 
            className="absolute top-3 right-3 bg-purple-600 hover:bg-purple-700"
          >
            ₹{price.toLocaleString()} / night
          </Badge>
        </CardHeader>
        
        <CardContent className="p-4 flex-grow">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin className="h-4 w-4 text-purple-500 mr-1" />
            <span>{city}, {country}</span>
          </div>
          
          <h3 className="font-semibold text-lg mb-1 text-purple-800 dark:text-purple-300">
            {title}
          </h3>
          
          <div className="flex items-center mt-3 space-x-4 text-sm">
            <div className="flex items-center">
              <BedDouble className="h-4 w-4 text-purple-500 mr-1" />
              <span>{bedrooms} {bedrooms === 1 ? 'bed' : 'beds'}</span>
            </div>
            
            <div className="flex items-center">
              <Bath className="h-4 w-4 text-purple-500 mr-1" />
              <span>{bathrooms} {bathrooms === 1 ? 'bath' : 'baths'}</span>
            </div>
            
            <div className="flex items-center">
              <Users className="h-4 w-4 text-purple-500 mr-1" />
              <span>{capacity} {capacity === 1 ? 'guest' : 'guests'}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-purple-50 dark:border-gray-700">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
            <span className="font-medium">{rating.toFixed(1)}</span>
          </div>
          
          {amenities && amenities.length > 0 && (
            <div className="text-xs text-gray-500">
              {amenities.slice(0, 2).join(' • ')}
              {amenities.length > 2 ? ' • ...' : ''}
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PropertyCard;
