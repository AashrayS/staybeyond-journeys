
import { Booking, Property, Transportation, Review } from "../types";
import { indianUsers, indianProperties, indianLocations, indianPropertyTypes } from "./indianData";

// Export the Indian users
export const users = indianUsers;

// Export the Indian properties
export const properties = indianProperties;

// Generate reviews for each property
const reviews: Review[] = [];

properties.forEach(property => {
  const propertyReviews = [
    {
      id: `review-${property.id}-1`,
      propertyId: property.id,
      userId: "user3",
      user: {
        name: users[2].name,
        avatar: users[2].avatar,
      },
      rating: 4 + Math.random(),
      comment: "Great property! Exactly as described. The host was very helpful and responsive. The location was perfect for exploring the area.",
      date: "2023-11-15",
    },
    {
      id: `review-${property.id}-2`,
      propertyId: property.id,
      userId: "user2",
      user: {
        name: users[1].name,
        avatar: users[1].avatar,
      },
      rating: 4 + Math.random(),
      comment: "Beautiful property with stunning views. Everything was clean and well-maintained. We especially enjoyed the local recommendations from the host.",
      date: "2023-10-20",
    },
  ];
  
  reviews.push(...propertyReviews);
  property.reviews = propertyReviews;
});

// Generate sample bookings
export const bookings: Booking[] = [
  {
    id: "booking1",
    propertyId: "prop1",
    property: properties[0],
    userId: "user3",
    user: users[2],
    startDate: "2024-06-05",
    endDate: "2024-06-10",
    totalPrice: 60000,
    status: "confirmed",
    guests: 4,
    createdAt: "2024-05-15",
    transportation: {
      id: "transport1",
      bookingId: "booking1",
      type: "cab",
      pickupLocation: "Mumbai Airport",
      dropoffLocation: "Marine Drive, South Mumbai",
      pickupTime: "2024-06-05T14:00:00",
      estimatedPrice: 1200,
      status: "confirmed",
    },
  },
  {
    id: "booking2",
    propertyId: "prop3",
    property: properties[2],
    userId: "user3",
    user: users[2],
    startDate: "2024-07-15",
    endDate: "2024-07-20",
    totalPrice: 75000,
    status: "pending",
    guests: 3,
    createdAt: "2024-05-18",
  },
];

// Create transportation options
export const transportationOptions = [
  {
    id: "transport-type-1",
    type: "cab",
    name: "Premium Sedan",
    description: "Comfortable sedan with professional driver",
    basePrice: 1200,
    image: "https://images.unsplash.com/photo-1511527844759-dbd19ba01b0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "transport-type-2",
    type: "cab",
    name: "SUV",
    description: "Spacious SUV for larger groups",
    basePrice: 1800,
    image: "https://images.unsplash.com/photo-1546545141-8732cdcfd9b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "transport-type-3",
    type: "auto",
    name: "Auto Rickshaw",
    description: "Traditional local transport for short distances",
    basePrice: 400,
    image: "https://images.unsplash.com/photo-1525744344846-d16535594bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "transport-type-4",
    type: "cab",
    name: "Luxury Vehicle",
    description: "Premium luxury vehicle with professional driver",
    basePrice: 3000,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  },
];

export const amenitiesList = [
  "WiFi",
  "Swimming Pool",
  "Air Conditioning",
  "Kitchen",
  "Washer",
  "Dryer",
  "Parking",
  "Gym",
  "TV",
  "Hot Tub",
  "Beach Access",
  "Mountain View",
  "Lake Access",
  "Fireplace",
  "Balcony",
  "Patio",
  "BBQ Grill",
  "Pets Allowed",
  "Wheelchair Accessible",
  "EV Charger"
];

// Use Indian property types from indianData.ts
export const propertyTypes = indianPropertyTypes;

// Use Indian locations from indianData.ts
export const locations = indianLocations;
