
import { Booking, Property, User, Transportation, Review } from "../types";

export const users: User[] = [
  {
    id: "user1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    isHost: true,
    joined: "2020-03-15",
  },
  {
    id: "user2",
    name: "Sophia Chen",
    email: "sophia@example.com", 
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    isHost: true,
    joined: "2019-11-23",
  },
  {
    id: "user3",
    name: "Miguel Rodriguez",
    email: "miguel@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    isHost: false,
    joined: "2022-01-05",
  },
  {
    id: "user4",
    name: "Emily Parker",
    email: "emily@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    isHost: true,
    joined: "2021-06-12",
  },
];

export const properties: Property[] = [
  {
    id: "prop1",
    title: "Luxury Beachfront Villa",
    description: "Experience paradise in this stunning beachfront villa with panoramic ocean views. This spacious property features floor-to-ceiling windows, a private infinity pool, and direct beach access. The interior boasts modern design with local artistic touches and all premium amenities.",
    location: {
      city: "Malibu",
      country: "United States",
      address: "123 Ocean Drive",
      coordinates: {
        lat: 34.0259,
        lng: -118.7798,
      },
    },
    price: 850,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      "Beach Access",
      "Infinity Pool",
      "Air Conditioning",
      "Free WiFi",
      "Kitchen",
      "Private Terrace",
      "BBQ Grill",
      "Hot Tub",
      "Smart Home System",
      "Home Theater",
    ],
    host: users[0],
    rating: 4.9,
    reviews: [],
    availableDates: [
      {
        start: "2024-06-01",
        end: "2024-06-15",
      },
      {
        start: "2024-07-10",
        end: "2024-07-31",
      },
    ],
    bedrooms: 4,
    bathrooms: 3.5,
    capacity: 8,
    propertyType: "Villa",
    featured: true,
  },
  {
    id: "prop2",
    title: "Modern Downtown Apartment",
    description: "Stylish and contemporary apartment in the heart of the city. Enjoy urban living at its finest with premium finishes, smart home features, and panoramic city views. Walking distance to top restaurants, shopping, and cultural attractions.",
    location: {
      city: "New York",
      country: "United States",
      address: "456 Park Avenue",
      coordinates: {
        lat: 40.7128,
        lng: -74.006,
      },
    },
    price: 350,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      "City View",
      "Smart Home",
      "Air Conditioning",
      "Free WiFi",
      "Kitchen",
      "Gym Access",
      "Doorman",
      "Washer/Dryer",
      "Balcony",
    ],
    host: users[1],
    rating: 4.7,
    reviews: [],
    availableDates: [
      {
        start: "2024-05-15",
        end: "2024-05-30",
      },
      {
        start: "2024-06-10",
        end: "2024-06-25",
      },
    ],
    bedrooms: 2,
    bathrooms: 2,
    capacity: 4,
    propertyType: "Apartment",
  },
  {
    id: "prop3",
    title: "Charming Mountain Cabin",
    description: "Escape to this cozy mountain retreat nestled among tall pines. The perfect blend of rustic charm and modern comfort, featuring a stone fireplace, outdoor hot tub, and spectacular mountain views. Ideal for nature lovers and adventure seekers.",
    location: {
      city: "Aspen",
      country: "United States",
      address: "789 Pine Road",
      coordinates: {
        lat: 39.1911,
        lng: -106.8175,
      },
    },
    price: 275,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1462759353907-b2ea5ebd72e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      "Mountain View",
      "Fireplace",
      "Hot Tub",
      "Free WiFi",
      "Kitchen",
      "Hiking Trails",
      "BBQ Grill",
      "Wood Stove",
      "Ski Storage",
    ],
    host: users[3],
    rating: 4.8,
    reviews: [],
    availableDates: [
      {
        start: "2024-06-05",
        end: "2024-06-20",
      },
      {
        start: "2024-07-15",
        end: "2024-08-05",
      },
    ],
    bedrooms: 3,
    bathrooms: 2,
    capacity: 6,
    propertyType: "Cabin",
    featured: true,
  },
  {
    id: "prop4",
    title: "Tranquil Lakeside Cottage",
    description: "Find peace at this beautiful lakefront cottage with private dock and stunning water views. Enjoy your morning coffee on the deck watching the sunrise, spend days boating and swimming, and evenings by the fire pit under the stars.",
    location: {
      city: "Lake Tahoe",
      country: "United States",
      address: "101 Shoreline Drive",
      coordinates: {
        lat: 39.0968,
        lng: -120.0324,
      },
    },
    price: 320,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      "Lake View",
      "Private Dock",
      "Boat Rental",
      "Fire Pit",
      "Free WiFi",
      "Kitchen",
      "Deck",
      "BBQ Grill",
      "Fishing Equipment",
    ],
    host: users[0],
    rating: 4.9,
    reviews: [],
    availableDates: [
      {
        start: "2024-05-20",
        end: "2024-06-10",
      },
      {
        start: "2024-07-01",
        end: "2024-07-25",
      },
    ],
    bedrooms: 2,
    bathrooms: 1,
    capacity: 5,
    propertyType: "Cottage",
  },
  {
    id: "prop5",
    title: "Historic City Townhouse",
    description: "Stay in this beautifully restored historic townhouse in the cultural district. Experience the perfect blend of old-world charm and modern luxury with original architectural details and updated amenities. Steps away from museums, dining, and shopping.",
    location: {
      city: "Boston",
      country: "United States",
      address: "321 Heritage Lane",
      coordinates: {
        lat: 42.3601,
        lng: -71.0589,
      },
    },
    price: 390,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1502005097973-6a7082348e28?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      "Historic Architecture",
      "Garden Patio",
      "Air Conditioning",
      "Free WiFi",
      "Gourmet Kitchen",
      "Fireplace",
      "Washer/Dryer",
      "Smart Home Features",
    ],
    host: users[1],
    rating: 4.6,
    reviews: [],
    availableDates: [
      {
        start: "2024-05-25",
        end: "2024-06-15",
      },
      {
        start: "2024-07-05",
        end: "2024-07-30",
      },
    ],
    bedrooms: 3,
    bathrooms: 2.5,
    capacity: 6,
    propertyType: "Townhouse",
    featured: true,
  },
  {
    id: "prop6",
    title: "Luxurious Desert Oasis",
    description: "Relax in this stunning modern home surrounded by desert beauty. Floor-to-ceiling windows frame spectacular views, while the private pool and outdoor living spaces allow you to fully embrace the desert lifestyle. Perfect for relaxation and entertainment.",
    location: {
      city: "Palm Springs",
      country: "United States",
      address: "555 Desert View Road",
      coordinates: {
        lat: 33.8303,
        lng: -116.5453,
      },
    },
    price: 425,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      "Desert View",
      "Private Pool",
      "Hot Tub",
      "Outdoor Shower",
      "Air Conditioning",
      "Free WiFi",
      "Gourmet Kitchen",
      "Fire Pit",
      "Outdoor Living Room",
    ],
    host: users[3],
    rating: 4.8,
    reviews: [],
    availableDates: [
      {
        start: "2024-06-01",
        end: "2024-06-20",
      },
      {
        start: "2024-07-10",
        end: "2024-08-01",
      },
    ],
    bedrooms: 3,
    bathrooms: 3,
    capacity: 6,
    propertyType: "House",
  },
];

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
      comment: "Amazing stay! The property was exactly as described, and the host was incredibly accommodating. Would definitely recommend!",
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
      comment: "Beautiful property with stunning views. Everything was clean and well-maintained. The amenities were fantastic!",
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
    totalPrice: 4250,
    status: "confirmed",
    guests: 4,
    createdAt: "2024-05-15",
    transportation: {
      id: "transport1",
      bookingId: "booking1",
      type: "cab",
      pickupLocation: "Malibu Airport",
      dropoffLocation: "123 Ocean Drive, Malibu",
      pickupTime: "2024-06-05T14:00:00",
      estimatedPrice: 85,
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
    totalPrice: 1375,
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
    basePrice: 45,
    image: "https://images.unsplash.com/photo-1511527844759-dbd19ba01b0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "transport-type-2",
    type: "cab",
    name: "SUV",
    description: "Spacious SUV for larger groups",
    basePrice: 65,
    image: "https://images.unsplash.com/photo-1546545141-8732cdcfd9b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "transport-type-3",
    type: "auto",
    name: "Auto Rickshaw",
    description: "Traditional local transport for short distances",
    basePrice: 15,
    image: "https://images.unsplash.com/photo-1525744344846-d16535594bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "transport-type-4",
    type: "cab",
    name: "Luxury Vehicle",
    description: "Premium luxury vehicle with professional driver",
    basePrice: 120,
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

export const propertyTypes = [
  "House",
  "Apartment",
  "Condo",
  "Villa",
  "Cabin",
  "Cottage",
  "Townhouse",
  "Farm",
  "Boat",
  "Treehouse",
  "Tiny Home",
  "Castle",
  "Mansion"
];

export const locations = [
  "New York, United States",
  "Paris, France",
  "Tokyo, Japan",
  "London, United Kingdom",
  "Rome, Italy",
  "Sydney, Australia",
  "Barcelona, Spain",
  "Amsterdam, Netherlands",
  "Dubai, UAE",
  "Hong Kong, China"
];
