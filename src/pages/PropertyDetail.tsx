import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Users, 
  ChevronLeft, 
  Heart, 
  Share2, 
  Star, 
  Check, 
  BedDouble, 
  Bath, 
  Wifi, 
  Home, 
  Car,
  ArrowRight, 
  ArrowLeft,
  X,
  IndianRupee,
  PartyPopper,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, differenceInCalendarDays } from "date-fns";
import { properties, bookings, transportationOptions } from "../data/mockData";
import { Property } from "../types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createBooking, createTransportation, fetchPropertyById } from "@/services/propertyService";
import { useAuth } from "@/contexts/AuthContext";
import { prepareBookingData } from "@/utils/bookingUtils";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(1);
  const [transportDialogOpen, setTransportDialogOpen] = useState(false);
  const [transportType, setTransportType] = useState(transportationOptions[0].id);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Fetch property details
    if (id) {
      fetchPropertyById(id)
        .then(fetchedProperty => {
          if (fetchedProperty) {
            setProperty(fetchedProperty);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching property:", error);
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    if (property && checkIn && checkOut) {
      const days = differenceInCalendarDays(checkOut, checkIn);
      const price = property.price * days;
      setTotalPrice(price);
    } else {
      setTotalPrice(0);
    }
  }, [property, checkIn, checkOut]);

  const handlePrevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "This property has been removed from your favorites" : "This property has been added to your favorites",
      variant: isFavorite ? "destructive" : "default",
    });
  };

  const handleBookNow = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book this property",
        variant: "destructive",
      });
      return;
    }
    
    if (!property || !checkIn || !checkOut) {
      toast({
        title: "Incomplete booking",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }
    
    setBookingInProgress(true);
    
    try {
      const bookingData = prepareBookingData(
        property.id,
        property,
        user.id,
        user,
        checkIn.toISOString(),
        checkOut.toISOString(),
        totalPrice,
        "confirmed",
        guests
      );
      
      console.log("Creating booking with data:", bookingData);
      
      const newBooking = await createBooking(bookingData);
      
      if (newBooking) {
        setBookingId(newBooking.id);
        setBookingSuccess(true);
        
        toast({
          title: "Booking Confirmed!",
          description: `Your booking at ${property.title} has been confirmed. Booking ID: ${newBooking.id}`,
          variant: "default",
        });
      } else {
        throw new Error("Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBookingInProgress(false);
    }
  };

  const handleTransportBook = async () => {
    if (!bookingId) {
      toast({
        title: "Booking required",
        description: "Please complete a booking first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const selectedTransport = transportationOptions.find(t => t.id === transportType);
      
      const transportData = {
        bookingId: bookingId,
        type: transportType as "cab" | "auto" | "other",
        pickupLocation: "Airport",
        dropoffLocation: property?.location.address || property?.location.city || "",
        pickupTime: checkIn ? checkIn.toISOString() : new Date().toISOString(),
        estimatedPrice: selectedTransport ? selectedTransport.basePrice : 500,
        status: "confirmed" as "confirmed" | "pending" | "completed" | "cancelled"
      };
      
      console.log("Creating transportation with data:", transportData);
      
      const newTransportation = await createTransportation(transportData);
      
      if (newTransportation) {
        setTransportDialogOpen(false);
        
        toast({
          title: "Transport Booked!",
          description: `Your transportation has been booked successfully.`,
        });
      } else {
        throw new Error("Failed to create transportation");
      }
    } catch (error) {
      console.error("Error booking transportation:", error);
      toast({
        title: "Transport booking failed",
        description: "There was an error booking your transportation. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded mb-8"></div>
            <div className="h-64 w-full max-w-4xl bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-full max-w-2xl bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-full max-w-xl bg-gray-200 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the property you're looking for.
            </p>
            <Button asChild>
              <Link to="/properties">Browse Properties</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4 animate-fade-in">
        <div className="container mx-auto max-w-7xl">
          {/* Back button and breadcrumbs */}
          <div className="mb-4 flex justify-between items-center">
            <Button variant="ghost" asChild className="gap-2 -ml-2">
              <Link to="/properties">
                <ChevronLeft className="h-4 w-4" />
                <span>Back to properties</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "rounded-full",
                  isFavorite ? "text-primary" : ""
                )}
                onClick={toggleFavorite}
              >
                <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Booking Success Message */}
          {bookingSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="flex items-center gap-2">
                <span>Booking Confirmed!</span> 
                <PartyPopper className="h-4 w-4" />
              </AlertTitle>
              <AlertDescription>
                Your booking at {property.title} has been confirmed. Your booking ID is <span className="font-semibold">{bookingId}</span>. 
                Check your email for more details.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Property Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.title}</h1>
          
          {/* Property Subtitle */}
          <div className="flex flex-wrap items-center gap-2 mb-6 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="font-medium text-foreground">{property.rating.toFixed(1)}</span>
              <span>({property.reviews.length} reviews)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{property.location.city}, {property.location.country}</span>
            </div>
          </div>
          
          {/* Property Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div 
              className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer shadow-lg"
              onClick={() => setImageViewerOpen(true)}
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {property.images.slice(1, 5).map((image, index) => (
                <div 
                  key={index} 
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer shadow-md"
                  onClick={() => {
                    setCurrentImageIndex(index + 1);
                    setImageViewerOpen(true);
                  }}
                >
                  <img
                    src={image}
                    alt={`${property.title} - ${index + 1}`}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Property Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Details */}
            <div className="lg:col-span-2">
              {/* Host Info */}
              <div className="flex justify-between items-start mb-6 pb-6 border-b">
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    Hosted by {property.host.name}
                  </h2>
                  <p className="text-muted-foreground">
                    {property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''} • {property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''} • {property.capacity} guest{property.capacity !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary shadow-md">
                    <img
                      src={property.host.avatar}
                      alt={property.host.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">About this place</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {property.description}
                </p>
              </div>
              
              {/* Features */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Reviews */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    <span>{property.rating.toFixed(1)} · {property.reviews.length} reviews</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {property.reviews.slice(0, 4).map((review) => (
                    <Card key={review.id} className="border shadow-sm hover:shadow-md transition-shadow duration-300">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200">
                              <img
                                src={review.user.avatar}
                                alt={review.user.name}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{review.user.name}</h4>
                              <span className="text-xs text-muted-foreground">
                                {review.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                              <span className="text-sm">{review.rating.toFixed(1)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {property.reviews.length > 4 && (
                  <Button variant="outline" className="mt-4 w-full">Show all {property.reviews.length} reviews</Button>
                )}
              </div>
              
              {/* Location */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-800 rounded-lg mb-2 overflow-hidden shadow-md">
                  {/* Placeholder for map */}
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {property.location.address}, {property.location.city}, {property.location.country}
                </p>
              </div>
            </div>
            
            {/* Right Column: Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <Card className="border shadow-lg overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-baseline justify-between mb-6">
                      <div className="flex items-center">
                        <IndianRupee className="h-5 w-5 mr-1" />
                        <span className="text-2xl font-bold">{property.price.toLocaleString('en-IN')}</span>
                        <span className="text-muted-foreground"> / night</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span>{property.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">
                          ({property.reviews.length})
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      {/* Check In/Out */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-medium mb-1 block">Check in</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !checkIn && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {checkIn ? format(checkIn, "MMM d, yyyy") : "Add date"}
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
                        
                        <div>
                          <label className="text-xs font-medium mb-1 block">Check out</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !checkOut && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {checkOut ? format(checkOut, "MMM d, yyyy") : "Add date"}
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
                      </div>
                      
                      {/* Guests */}
                      <div>
                        <label className="text-xs font-medium mb-1 block">Guests</label>
                        <Select 
                          value={guests.toString()} 
                          onValueChange={(value) => setGuests(parseInt(value))}
                        >
                          <SelectTrigger className="w-full">
                            <div className="flex items-center">
                              <Users className="mr-2 h-4 w-4" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {property && Array.from({ length: property.capacity }, (_, i) => i + 1).map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'guest' : 'guests'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mb-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      disabled={!checkIn || !checkOut || !guests || bookingSuccess || bookingInProgress}
                      onClick={handleBookNow}
                    >
                      {bookingInProgress ? "Processing..." : (bookingSuccess ? "Booked!" : "Reserve")}
                    </Button>
                    
                    {checkIn && checkOut && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <IndianRupee className="h-3.5 w-3.5 mr-1" />
                            <span>{property.price.toLocaleString('en-IN')} x {differenceInCalendarDays(checkOut, checkIn)} nights</span>
                          </div>
                          <div className="flex items-center">
                            <IndianRupee className="h-3.5 w-3.5 mr-1" />
                            <span>{totalPrice.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span>Cleaning fee</span>
                          <div className="flex items-center">
                            <IndianRupee className="h-3.5 w-3.5 mr-1" />
                            <span>999</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span>Service fee</span>
                          <div className="flex items-center">
                            <IndianRupee className="h-3.5 w-3.5 mr-1" />
                            <span>{Math.floor(totalPrice * 0.12).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                          <span>Total</span>
                          <div className="flex items-center">
                            <IndianRupee className="h-3.5 w-3.5 mr-1" />
                            <span>{(totalPrice + 999 + Math.floor(totalPrice * 0.12)).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Transport Card (Optional) */}
                {!bookingSuccess && (
                  <Card className="border shadow-lg overflow-hidden mt-6">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <Car className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Need transportation?</h3>
                          <p className="text-sm text-muted-foreground">Book a cab or auto during your stay (optional)</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setTransportDialogOpen(true)}
                      >
                        Book transport
                      </Button>
                    </CardContent>
                  </Card>
                )}
                
                {/* Booking Success Card */}
                {bookingSuccess && (
                  <Card className="border shadow-lg overflow-hidden mt-6 bg-green-50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                          <Car className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Need transportation?</h3>
                          <p className="text-sm">Add transport to your booking</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setTransportDialogOpen(true)}
                      >
                        Add transport (optional)
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Image Viewer Dialog */}
      <Dialog open={imageViewerOpen} onOpenChange={setImageViewerOpen}>
        <DialogContent className="max-w-5xl p-0 border-0 bg-transparent shadow-none">
          <div className="relative aspect-auto max-h-[80vh] overflow-hidden rounded-lg">
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="object-contain w-full h-full"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-1/2 left-4 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 text-white hover:bg-black/80"
              onClick={handlePrevImage}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-1/2 right-4 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 text-white hover:bg-black/80"
              onClick={handleNextImage}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/60 text-white hover:bg-black/80"
              onClick={() => setImageViewerOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 rounded-full px-3 py-1 text-white text-sm">
              {currentImageIndex + 1} / {property ? property.images.length : 0}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Transport Booking Dialog (Optional) */}
      <Dialog open={transportDialogOpen} onOpenChange={setTransportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Transportation (Optional)</DialogTitle>
            <DialogDescription>
              Book a cab or auto for your stay at {property?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Transport Type</label>
              <Select 
                value={transportType}
                onValueChange={setTransportType}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {transportationOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name} - <IndianRupee className="inline h-3 w-3" />{option.basePrice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Pickup Location</label>
              <Select defaultValue="airport">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="airport">Airport</SelectItem>
                  <SelectItem value="train">Train Station</SelectItem>
                  <SelectItem value="custom">Custom Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Pickup Date & Time</label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        true && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Pick a date
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
                
                <Select defaultValue="10:00">
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
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransportDialogOpen(false)}>
              Skip for now
            </Button>
            <Button onClick={handleTransportBook}>
              Book Transport
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default PropertyDetail;
