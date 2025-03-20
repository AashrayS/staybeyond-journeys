
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Users, 
  ArrowRight, 
  Car,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { locations } from "../data/mockData";

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const [searchType, setSearchType] = useState("stay");
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(1);
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSearch = () => {
    console.log({
      type: searchType,
      location,
      checkIn,
      checkOut,
      guests
    });
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center px-4 overflow-hidden">
      {/* Background Image */}
      <div 
        className={cn(
          "absolute inset-0 z-0 transition-opacity duration-1000 image-fade-mask",
          loaded ? "opacity-100" : "opacity-0"
        )}
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1501117716987-67454a23be26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl z-10 pt-20">
        <div className="max-w-3xl mx-auto text-center mb-8 animate-fade-in opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-md">
            Find Your Perfect Stay <span className="text-primary">Beyond</span> Expectations
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md">
            Discover unique homes, experiences, and places around the world
          </p>
        </div>

        {/* Search Card */}
        <Card className={cn(
          "mx-auto max-w-4xl backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-0 shadow-2xl animate-scale-in opacity-0",
          "transition-all duration-500 transform"
        )} 
        style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
          <CardContent className="p-6">
            <Tabs defaultValue="stay" onValueChange={setSearchType} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="stay" className="text-base">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Find a stay</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="transport" className="text-base">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span>Book transport</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="stay" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Select onValueChange={setLocation}>
                        <SelectTrigger className="pl-10">
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
                  
                  {/* Check In */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Check in</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-10 text-left font-normal relative",
                            !checkIn && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          {checkIn ? format(checkIn, "PPP") : "Add date"}
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
                  
                  {/* Check Out */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Check out</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-10 text-left font-normal relative",
                            !checkOut && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          {checkOut ? format(checkOut, "PPP") : "Add date"}
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Guests</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Select 
                        value={guests.toString()} 
                        onValueChange={(value) => setGuests(parseInt(value))}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue />
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
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSearch} className="gap-2" asChild>
                    <Link to="/properties">
                      <Search className="h-4 w-4" />
                      <span>Search</span>
                    </Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="transport" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pickup Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pickup Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Enter pickup location"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  {/* Dropoff Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dropoff Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Enter dropoff location"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  {/* Date and Time */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date & Time</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full pl-10 text-left font-normal relative"
                        >
                          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <span className="text-muted-foreground">Select date & time</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Transport Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Transport Type</label>
                    <Select defaultValue="cab">
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cab">Cab</SelectItem>
                        <SelectItem value="auto">Auto Rickshaw</SelectItem>
                        <SelectItem value="premium">Premium Car</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSearch} className="gap-2" asChild>
                    <Link to="/transport">
                      <Search className="h-4 w-4" />
                      <span>Search Transport</span>
                    </Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 max-w-3xl mx-auto gap-8 animate-fade-up opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
          <div className="text-center">
            <p className="text-3xl font-bold text-white mb-1">1M+</p>
            <p className="text-white/80 text-sm">Active listings</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white mb-1">98%</p>
            <p className="text-white/80 text-sm">Satisfied guests</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white mb-1">150+</p>
            <p className="text-white/80 text-sm">Countries</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
