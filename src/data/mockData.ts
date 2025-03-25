import { Booking, Property, Transportation, Review } from "../types";
import { indianUsers, indianProperties as baseIndianProperties, indianLocations, indianPropertyTypes } from "./indianData";

// Export the Indian users
export const users = indianUsers;

// Define amenities list at the top of the file so it can be referenced by the functions below
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

// Generate more properties based on the base properties - only do this once
const cachedProperties = (() => {
  console.time('Generate properties');
  const moreProperties: Property[] = [];
  
  // First include the original properties
  moreProperties.push(...baseIndianProperties);
  
  // Generate 60+ more properties based on the originals with variations
  for (let i = 0; i < 60; i++) {
    // Clone a random base property and modify it
    const randomBaseIndex = Math.floor(Math.random() * baseIndianProperties.length);
    const baseProp = baseIndianProperties[randomBaseIndex];
    
    // Create a variation of the property
    const newLocationIndex = Math.floor(Math.random() * indianLocations.length);
    const newPropTypeIndex = Math.floor(Math.random() * indianPropertyTypes.length);
    
    const newProperty: Property = {
      ...JSON.parse(JSON.stringify(baseProp)), // Deep clone
      id: `extended-prop-${i + 1}`,
      title: `${indianPropertyTypes[newPropTypeIndex]} in ${indianLocations[newLocationIndex]}`,
      location: {
        city: indianLocations[newLocationIndex],
        country: "India",
        address: `${Math.floor(Math.random() * 999) + 1} ${["Main Street", "Park Avenue", "Beach Road", "Garden Lane", "Mountain View"][Math.floor(Math.random() * 5)]}, ${indianLocations[newLocationIndex]}`,
        coordinates: {
          lat: 18.5 + (Math.random() * 10),
          lng: 73.5 + (Math.random() * 10)
        }
      },
      price: Math.floor((Math.random() * 10000) + 3000) * 10, // Between 3000 and 13000, rounded to nearest 10
      rating: 3.5 + (Math.random() * 1.5), // Between 3.5 and 5
      bedrooms: Math.floor(Math.random() * 5) + 1, // 1 to 5 bedrooms
      bathrooms: Math.floor(Math.random() * 3) + 1, // 1 to 3 bathrooms
      capacity: Math.floor(Math.random() * 8) + 1, // 1 to 8 guests
      propertyType: indianPropertyTypes[newPropTypeIndex],
      featured: Math.random() > 0.75, // Increased chance to be featured (25%)
    };
    
    // Randomize some amenities
    newProperty.amenities = [];
    const numAmenities = Math.floor(Math.random() * 10) + 5; // 5-15 amenities
    
    for (let j = 0; j < numAmenities; j++) {
      const randomAmenity = amenitiesList[Math.floor(Math.random() * amenitiesList.length)];
      if (!newProperty.amenities.includes(randomAmenity)) {
        newProperty.amenities.push(randomAmenity);
      }
    }
    
    // Add to the collection
    moreProperties.push(newProperty);
  }
  
  // Ensure there are at least some featured properties
  let hasFeatured = moreProperties.some(p => p.featured === true);
  if (!hasFeatured) {
    console.log("No featured properties found, marking some as featured");
    // Mark the first 6 properties as featured
    for (let i = 0; i < 6; i++) {
      if (moreProperties[i]) {
        moreProperties[i].featured = true;
      }
    }
  }
  
  console.timeEnd('Generate properties');
  return moreProperties;
})();

// Export the generated properties - this avoids regenerating on every import
export const properties = cachedProperties;

// Generate reviews for each property - use memoization to do this only once
const cachedReviews = (() => {
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

  return reviews;
})();

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

// Use Indian property types from indianData.ts
export const propertyTypes = indianPropertyTypes;

// Use Indian locations from indianData.ts
export const locations = indianLocations;
