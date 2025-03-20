
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Search, 
  ArrowRight, 
  Car, 
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { transportationOptions } from "../data/mockData";

const TransportPage = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("10:00");
  const [transportType, setTransportType] = useState("");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<any>(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = () => {
    console.log({
      pickup,
      dropoff,
      date,
      time,
      transportType,
    });
  };

  const handleBookTransport = (transport: any) => {
    setSelectedTransport(transport);
    setBookingDialogOpen(true);
  };

  const handleConfirmBooking = () => {
    setBookingDialogOpen(false);
    setConfirmationDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Hero Section */}
          <div className="mb-10 text-center animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Book Your Transportation</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get around easily with our convenient transportation options. Book a cab or auto for your travel needs.
            </p>
          </div>
          
          {/* Search Card */}
          <Card className="max-w-4xl mx-auto mb-12 animate-scale-in shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pickup */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pickup Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Enter pickup location"
                      className="pl-10"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Dropoff */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dropoff Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Enter dropoff location"
                      className="pl-10"
                      value={dropoff}
                      onChange={(e) => setDropoff(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-10 text-left font-normal relative",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Time */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                        <SelectItem key={hour} value={`${hour}:00`}>
                          {hour.toString().padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <Button onClick={handleSearch} className="gap-2">
                  <Search className="h-4 w-4" />
                  <span>Search Transportation</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Available Options */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 animate-fade-in">Available Transportation Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transportationOptions.map((option, index) => (
                <Card 
                  key={option.id}
                  className="overflow-hidden hover-lift animate-fade-up opacity-0"
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: "forwards" }}
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={option.image}
                      alt={option.name}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{option.name}</h3>
                      <div className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 rounded capitalize">
                        {option.type}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">${option.basePrice}</span>
                        <span className="text-sm text-muted-foreground"> base fare</span>
                      </div>
                      <Button onClick={() => handleBookTransport(option)}>
                        Book now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Transport Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm animate-fade-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Car className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Various Vehicle Options</h3>
              <p className="text-muted-foreground">
                Choose from a range of vehicles to match your needs and preferences.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm animate-fade-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Convenient Pickups</h3>
              <p className="text-muted-foreground">
                Get picked up from your location at your preferred time.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm animate-fade-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Reliable Service</h3>
              <p className="text-muted-foreground">
                Enjoy professional and reliable transportation services.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Booking Dialog */}
      {selectedTransport && (
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book {selectedTransport.name}</DialogTitle>
              <DialogDescription>
                Complete your booking details for {selectedTransport.type} transportation
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg overflow-hidden">
                  <img
                    src={selectedTransport.image}
                    alt={selectedTransport.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedTransport.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTransport.description}</p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">${selectedTransport.basePrice}</span> base fare
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Pickup Location</label>
                <Input
                  placeholder="Enter pickup location"
                  defaultValue={pickup}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Dropoff Location</label>
                <Input
                  placeholder="Enter dropoff location"
                  defaultValue={dropoff}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        {date ? format(date, "MMM d, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                        <SelectItem key={hour} value={`${hour}:00`}>
                          {hour.toString().padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Special Instructions (Optional)</label>
                <Input
                  placeholder="Any special requirements?"
                />
              </div>
              
              <div className="space-y-2 border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-sm">Base fare</span>
                  <span className="text-sm font-medium">${selectedTransport.basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Service fee</span>
                  <span className="text-sm font-medium">${Math.floor(selectedTransport.basePrice * 0.1)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Total</span>
                  <span>${selectedTransport.basePrice + Math.floor(selectedTransport.basePrice * 0.1)}</span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmBooking}>
                Confirm Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmationDialogOpen} onOpenChange={setConfirmationDialogOpen}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center text-center py-4">
            <div className="h-16 w-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-6">
              Your transportation has been booked successfully. You will receive a confirmation email shortly.
            </p>
            <Button onClick={() => setConfirmationDialogOpen(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default TransportPage;
