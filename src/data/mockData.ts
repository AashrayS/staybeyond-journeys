
import { Booking, Property, Transportation, Review } from "../types";
import { indianUsers, indianProperties, indianLocations, indianPropertyTypes } from "./indianData";

// Generate a large number of properties by duplicating and modifying the Indian properties
const generateMoreProperties = (baseProperties: Property[], count: number): Property[] => {
  const moreProperties: Property[] = [...baseProperties];
  
  // Generate cities and locations for variety
  const cities = [...indianLocations];
  const propertyTypes = [...indianPropertyTypes];
  
  // Add random variation to property prices
  const priceVariations = [-5000, -3000, -2000, -1000, 0, 1000, 2000, 3000, 5000, 8000];
  
  // Create multiple variations of each base property
  while (moreProperties.length < count) {
    for (const baseProp of baseProperties) {
      if (moreProperties.length >= count) break;
      
      // Create a new property based on the original
      const newPropertyId = `prop${moreProperties.length + 1}`;
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomPropertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const randomPriceModifier = priceVariations[Math.floor(Math.random() * priceVariations.length)];
      const randomRating = (Math.floor(Math.random() * 15) + 35) / 10; // Rating between 3.5 and 5.0
      
      // Create slightly different title
      const titleVariations = ["Luxurious", "Modern", "Cozy", "Elegant", "Charming", "Beautiful", "Spacious"];
      const titlePrefix = titleVariations[Math.floor(Math.random() * titleVariations.length)];
      
      const newProperty: Property = {
        ...baseProp,
        id: newPropertyId,
        title: `${titlePrefix} ${baseProp.propertyType} in ${randomCity}`,
        price: Math.max(1000, baseProp.price + randomPriceModifier),
        location: {
          ...baseProp.location,
          city: randomCity,
        },
        propertyType: randomPropertyType,
        property_type: randomPropertyType,
        rating: randomRating,
        reviews: [], // Reviews will be added later
        featured: Math.random() > 0.9, // 10% chance to be featured
      };
      
      // Add bedrooms and bathroom variation
      newProperty.bedrooms = Math.floor(Math.random() * 4) + 1; // 1-5 bedrooms
      newProperty.bathrooms = newProperty.bedrooms - Math.floor(Math.random() * 2); // Slightly fewer bathrooms
      newProperty.capacity = newProperty.bedrooms * 2; // Capacity based on bedrooms
      
      // Ensure all properties have images
      if (!newProperty.images || newProperty.images.length === 0) {
        newProperty.images = [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
          "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        ];
      }
      
      // Randomly assign amenities
      const allAmenities = [...amenitiesList];
      const numAmenities = Math.floor(Math.random() * 8) + 3; // 3-10 amenities
      newProperty.amenities = [];
      
      for (let i = 0; i < numAmenities; i++) {
        const randomIndex = Math.floor(Math.random() * allAmenities.length);
        const amenity = allAmenities[randomIndex];
        if (!newProperty.amenities.includes(amenity)) {
          newProperty.amenities.push(amenity);
        }
        allAmenities.splice(randomIndex, 1);
      }
      
      moreProperties.push(newProperty);
    }
  }
  
  return moreProperties.slice(0, count);
};

// Generate at least 60 properties
export const properties = generateMoreProperties(indianProperties, 65);

// Export the Indian users
export const users = indianUsers;

// Generate reviews for each property
const reviews: Review[] = [];

properties.forEach(property => {
  const numReviews = Math.floor(Math.random() * 3) + 1; // 1-3 reviews per property
  const propertyReviews: Review[] = [];
  
  for (let i = 0; i < numReviews; i++) {
    const reviewId = `review-${property.id}-${i+1}`;
    const randomUserId = Math.floor(Math.random() * users.length);
    const randomUser = users[randomUserId];
    const randomRating = (Math.floor(Math.random() * 15) + 35) / 10; // Rating between 3.5 and 5.0
    
    const reviewComments = [
      "Great property! Exactly as described. The host was very helpful and responsive. The location was perfect for exploring the area.",
      "Beautiful property with stunning views. Everything was clean and well-maintained. We especially enjoyed the local recommendations from the host.",
      "Had a wonderful stay here. The amenities were excellent and the property was even better than the pictures. Would definitely recommend!",
      "The location was perfect and the property was immaculate. The host went above and beyond to make our stay comfortable.",
      "Lovely place with great attention to detail. Very comfortable and the host was responsive and accommodating."
    ];
    
    const review: Review = {
      id: reviewId,
      propertyId: property.id,
      property_id: property.id,
      userId: randomUser.id,
      user_id: randomUser.id,
      user: {
        name: randomUser.name,
        avatar: randomUser.avatar,
      },
      rating: randomRating,
      comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
      date: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString(), // Random date within last 90 days
    };
    
    propertyReviews.push(review);
    reviews.push(review);
  }
  
  property.reviews = propertyReviews;
  
  // Update the property rating based on the reviews
  if (propertyReviews.length > 0) {
    const totalRating = propertyReviews.reduce((sum, review) => sum + review.rating, 0);
    property.rating = parseFloat((totalRating / propertyReviews.length).toFixed(1));
  }
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
