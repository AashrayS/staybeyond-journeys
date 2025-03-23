
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from "react-router-dom";

const destinations = [
  {
    id: 1,
    name: "Goa",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    properties: 248
  },
  {
    id: 2,
    name: "Jaipur",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    properties: 186
  },
  {
    id: 3,
    name: "Kerala",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    properties: 205
  },
  {
    id: 4,
    name: "Shimla",
    image: "https://images.unsplash.com/photo-1626621341517-850be5092585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    properties: 147
  }
];

const PopularDestinations = () => {
  const navigate = useNavigate();
  
  const handleDestinationClick = (destination: string) => {
    navigate(`/properties?location=${destination}`);
  };

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Popular Destinations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover India's most sought-after destinations with our curated selection of rental properties.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              onClick={() => handleDestinationClick(destination.name)}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                <AspectRatio ratio={4/3}>
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                </AspectRatio>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{destination.name}</h3>
                  <p className="text-sm text-muted-foreground">{destination.properties} properties</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
