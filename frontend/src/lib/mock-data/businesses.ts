export interface RoomType {
  id: string;
  name: string;
  pricePerNight: number;
  capacity: number;
  bedType: string;
  available: boolean;
  image: string;
}

export interface DayOutPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  pricingUnit: "PER_PERSON" | "PER_COUPLE" | "PER_FAMILY";
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "18:00"
  inclusions: string[];
  image: string;
}

export interface NightOutPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  pricingUnit: "PER_COUPLE" | "PER_PERSON";
  startTime: string; // e.g. "19:00"
  endTime: string;   // e.g. "23:00"
  includesOvernightStay: boolean;
  inclusions: string[];
  image: string;
}

export interface TourPackage {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g. "3 Days / 2 Nights"
  price: number;
  pricingUnit: "PER_PERSON";
  highlights: string[];
  includedTransport: string;
  image: string;
}

export interface Business {
  id: string;
  name: string;
  category: "hotel" | "homestay" | "villa" | "tour";
  sltdaVerified: boolean;
  sltdaLicenseNumber: string;
  rating: number;
  reviewCount: number;
  location: {
    city: string;
    region: string;
    address: string;
    lat: number;
    lng: number;
  };
  priceStartFrom: number;
  coverImage: string;
  galleryImages: string[];
  description: string;
  amenities: string[];
  rooms: RoomType[];
  dayOutPackages?: DayOutPackage[];
  nightOutPackages?: NightOutPackage[];
  tourPackages?: TourPackage[];
  host: {
    name: string;
    joinedYear: string;
    superhost: boolean;
    avatar: string;
  };
}

export const MOCK_BUSINESSES: Business[] = [
  {
    id: "b-1",
    name: "Nine Arch Heritage Villa",
    category: "villa",
    sltdaVerified: true,
    sltdaLicenseNumber: "SLTDA/B/2024/0984",
    rating: 4.9,
    reviewCount: 128,
    location: {
      city: "Ella",
      region: "Badulla District",
      address: "Demodara Road, Ella 90090",
      lat: 6.8778,
      lng: 81.0603,
    },
    priceStartFrom: 85,
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Nestled in the lush hills of Ella, Nine Arch Heritage Villa offers panoramic mountain views right from your private terrace. Located just a short 10-minute scenic trail walk from the famous Nine Arch Bridge, enjoy authentic Sri Lankan breakfast, infinity plunge pool access, day passes, and romantic hilltop night dinners.",
    amenities: [
      "Mountain View",
      "Infinity Plunge Pool",
      "Organic Breakfast Included",
      "Free High-Speed Wi-Fi",
      "Airport Shuttle Service",
      "Private Balcony",
    ],
    rooms: [
      {
        id: "r-101",
        name: "Mountain Mist Deluxe King Suite",
        pricePerNight: 85,
        capacity: 2,
        bedType: "1 King Bed",
        available: true,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "r-102",
        name: "Nine Arch Panorama Family Loft",
        pricePerNight: 140,
        capacity: 4,
        bedType: "2 Queen Beds",
        available: true,
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
      },
    ],
    dayOutPackages: [
      {
        id: "do-101",
        title: "Ella Infinity Pool & Scenic Lunch Pass",
        description: "Full daytime access (09:00–18:00) to the infinity plunge pool overlooking Ella gap, welcome fresh king coconut, traditional 3-course rice & curry buffet lunch, and afternoon Ceylon tea.",
        price: 35,
        pricingUnit: "PER_PERSON",
        startTime: "09:00",
        endTime: "18:00",
        inclusions: [
          "Infinity Plunge Pool Access",
          "3-Course Organic Lunch",
          "Welcome King Coconut",
          "Sunbed & Towel Service",
          "High-Speed Wi-Fi Access",
        ],
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      },
    ],
    nightOutPackages: [
      {
        id: "no-101",
        title: "Starlight Hilltop Candlelight Dinner for Two",
        description: "Private romantic candlelit setup on the upper deck (19:00–23:00) with a 4-course curated Sri Lankan fusion dinner, complimentary bottle of wine, and acoustic guitar background ambient sound.",
        price: 75,
        pricingUnit: "PER_COUPLE",
        startTime: "19:00",
        endTime: "23:00",
        includesOvernightStay: false,
        inclusions: [
          "Private Candlelight Terrace Setup",
          "4-Course Gourmet Dinner",
          "Complimentary Wine Bottle",
          "Private Waiter Service",
        ],
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      },
    ],
    tourPackages: [
      {
        id: "tp-101",
        title: "Ella Rock & Nine Arch Sunrise Trekking Experience",
        description: "Guided early morning trek to Ella Rock led by a local guide, followed by breakfast overlooking Nine Arch Bridge train crossing.",
        duration: "Half Day (5 Hours)",
        price: 40,
        pricingUnit: "PER_PERSON",
        highlights: ["Ella Rock Summit View", "Nine Arch Bridge Train Photo Spot", "Guided Jungle Trail"],
        includedTransport: "Tuk-Tuk Pick & Drop",
        image: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80",
      },
    ],
    host: {
      name: "Kasun Jayawardena",
      joinedYear: "2021",
      superhost: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    },
  },
  {
    id: "b-2",
    name: "Galle Fort Colonial House",
    category: "hotel",
    sltdaVerified: true,
    sltdaLicenseNumber: "SLTDA/H/2023/0412",
    rating: 4.8,
    reviewCount: 94,
    location: {
      city: "Galle",
      region: "Southern Province",
      address: "42 Church Street, Galle Fort",
      lat: 6.0267,
      lng: 80.217,
    },
    priceStartFrom: 120,
    coverImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Step back into 17th-century elegance within the historic UNESCO World Heritage Galle Fort. Restored with teak woodwork, antique furniture, courtyard dining, day spa passes, and colonial high tea.",
    amenities: [
      "Historic Fort Location",
      "Courtyard Dining",
      "Air Conditioning",
      "Cocktail Lounge",
      "Spa & Wellness",
    ],
    rooms: [
      {
        id: "r-201",
        name: "Dutch Heritage Suite",
        pricePerNight: 120,
        capacity: 2,
        bedType: "Four-Poster King Bed",
        available: true,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      },
    ],
    dayOutPackages: [
      {
        id: "do-201",
        title: "Colonial High Tea & Courtyard Day Pass",
        description: "Enjoy daytime courtyard relaxation (11:00–17:00) with traditional British-Ceylon High Tea tower, cucumber sandwiches, homemade scones, and spa discount.",
        price: 30,
        pricingUnit: "PER_PERSON",
        startTime: "11:00",
        endTime: "17:00",
        inclusions: [
          "Courtyard Lounge Access",
          "Signature High Tea Tower",
          "Fresh Ceylon Tea Tasting",
          "15% Spa Treatment Discount",
        ],
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      },
    ],
    nightOutPackages: [
      {
        id: "no-201",
        title: "Galle Fort Sunset Cocktails & Seafood Gala",
        description: "Evening courtyard cocktail session followed by 5-course fresh Southern ocean seafood feast (18:30–22:30).",
        price: 90,
        pricingUnit: "PER_COUPLE",
        startTime: "18:30",
        endTime: "22:30",
        includesOvernightStay: false,
        inclusions: [
          "Welcome Ocean Sunset Cocktails",
          "5-Course Fresh Seafood Dinner",
          "Live Saxophone Performance",
        ],
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      },
    ],
    host: {
      name: "Anjali De Silva",
      joinedYear: "2019",
      superhost: true,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    },
  },
  {
    id: "b-3",
    name: "Sigiriya Eco Jungle Retreat",
    category: "homestay",
    sltdaVerified: true,
    sltdaLicenseNumber: "SLTDA/HS/2024/0129",
    rating: 4.95,
    reviewCount: 76,
    location: {
      city: "Sigiriya",
      region: "Matale District",
      address: "Inamaluwa Road, Sigiriya",
      lat: 7.957,
      lng: 80.76,
    },
    priceStartFrom: 55,
    coverImage: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Stay in comfortable wooden treehouses surrounded by wildlife and birds, overlooking the majestic Lion Rock fortress.",
    amenities: [
      "Lion Rock Views",
      "Traditional Cooking Classes",
      "Bicycle Rental",
      "Jungle Safaris",
    ],
    rooms: [
      {
        id: "r-301",
        name: "Treehouse Canopy Room",
        pricePerNight: 55,
        capacity: 2,
        bedType: "Queen Bed",
        available: true,
        image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
      },
    ],
    dayOutPackages: [
      {
        id: "do-301",
        title: "Sigiriya Jungle Cooking & Clay Pot Day Pass",
        description: "Hands-on Sri Lankan village cooking masterclass, garden harvest walk, clay-pot lunch served on lotus leaf, and bicycle rental.",
        price: 25,
        pricingUnit: "PER_PERSON",
        startTime: "10:00",
        endTime: "16:00",
        inclusions: [
          "Traditional Cooking Class",
          "Lotus Leaf Buffet Lunch",
          "Fresh Organic Juice",
          "Village Bicycle Pass",
        ],
        image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
      },
    ],
    host: {
      name: "Sunil Rathnayake",
      joinedYear: "2022",
      superhost: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    },
  },
];
