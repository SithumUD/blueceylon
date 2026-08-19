// ============================================================
// BlueCeylon Mock Data — Business / Hotel / Room
// Field names and enum values aligned to backend domain model
// ============================================================

// ─── Enum Types (mirroring backend) ──────────────────────────

export type BusinessType = "HOTEL" | "TOUR_AGENCY" | "TOUR_GUIDE";
export type PropertyType = "HOTEL" | "GUESTHOUSE" | "BOUTIQUE_HOTEL" | "RESORT" | "VILLA" | "HOSTEL";
export type ApprovalStatus = "DRAFT" | "PENDING" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type Region = "WESTERN" | "CENTRAL" | "SOUTHERN" | "NORTHERN" | "EASTERN" | "NORTH_WESTERN" | "NORTH_CENTRAL" | "UVA" | "SABARAGAMUWA";
export type SriLankanCity = "COLOMBO" | "KANDY" | "GALLE" | "NUWARA_ELIYA" | "ELLA" | "NEGOMBO" | "SIGIRIYA" | "MIRISSA" | "HIKKADUWA" | "ANURADHAPURA" | "TRINCOMALEE" | "JAFFNA" | "DAMBULLA" | "POLONNARUWA" | "MATARA" | "BENTOTA";
export type RoomType = "STANDARD" | "DELUXE" | "SUPERIOR" | "SUITE" | "PENTHOUSE" | "FAMILY" | "CONNECTING" | "ACCESSIBLE";
export type ViewType = "LAKE_VIEW" | "MOUNTAIN_VIEW" | "GARDEN_VIEW" | "POOL_VIEW" | "OCEAN_VIEW" | "CITY_VIEW" | "NO_VIEW";
export type Currency = "LKR" | "USD" | "EUR" | "GBP";
export type PricingUnit = "PER_PERSON" | "PER_GROUP" | "FLAT_RATE";
export type TourCategory = "CULTURAL" | "ADVENTURE" | "WILDLIFE" | "BEACH" | "SPIRITUAL" | "WELLNESS" | "HISTORICAL" | "ECO" | "CULINARY" | "CULTURAL_HERITAGE" | "WILDLIFE_SAFARI" | "BEACH_AND_COASTAL" | "HILL_COUNTRY_HIKING" | "WHALE_WATCHING" | "WHITEWATER_ADVENTURE" | "AYURVEDA_WELLNESS" | "SURFING" | "CITY_AND_SHOPPING" | "HONEYMOON_PACKAGE" | "MULTI_DAY_ROUND_TOUR" | "PILGRIMAGE";
export type DifficultyLevel = "EASY" | "MODERATE" | "CHALLENGING" | "EXTREME";
export type VehicleType = "TUK_TUK" | "CAR" | "VAN" | "SUV" | "MINIBUS" | "COACH" | "MOTORBIKE" | "NONE";
export type MealPlan = "NONE" | "BREAKFAST_ONLY" | "HALF_BOARD" | "FULL_BOARD" | "ALL_INCLUSIVE";
export type PetPolicy = "ALLOWED" | "NOT_ALLOWED" | "ALLOWED_ON_REQUEST";
export type CancellationPolicy = "FLEXIBLE" | "MODERATE" | "STRICT" | "NON_REFUNDABLE";
export type SustainabilityBadge = "ECO_CERTIFIED" | "SOLAR_POWERED" | "PLASTIC_FREE" | "LOCAL_SOURCING" | "CARBON_NEUTRAL";
export type AgencySpecialization = "ADVENTURE" | "CULTURAL" | "ECO" | "WELLNESS" | "BEACH" | "WILDLIFE" | "HISTORICAL" | "CULINARY" | "SPIRITUAL";

// ─── Display label helpers ────────────────────────────────────

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  TUK_TUK: "Tuk-Tuk",
  CAR: "Car",
  VAN: "Van",
  SUV: "SUV",
  MINIBUS: "Minibus",
  COACH: "Coach",
  MOTORBIKE: "Motorbike",
  NONE: "Walking / On-Foot",
};

export const CITY_LABELS: Record<string, string> = {
  COLOMBO: "Colombo",
  KANDY: "Kandy",
  GALLE: "Galle",
  NUWARA_ELIYA: "Nuwara Eliya",
  ELLA: "Ella",
  NEGOMBO: "Negombo",
  SIGIRIYA: "Sigiriya",
  MIRISSA: "Mirissa",
  HIKKADUWA: "Hikkaduwa",
  ANURADHAPURA: "Anuradhapura",
  TRINCOMALEE: "Trincomalee",
  JAFFNA: "Jaffna",
  DAMBULLA: "Dambulla",
  POLONNARUWA: "Polonnaruwa",
  MATARA: "Matara",
  BENTOTA: "Bentota",
};

export const REGION_LABELS: Record<Region, string> = {
  WESTERN: "Western Province",
  CENTRAL: "Central Province",
  SOUTHERN: "Southern Province",
  NORTHERN: "Northern Province",
  EASTERN: "Eastern Province",
  NORTH_WESTERN: "North Western Province",
  NORTH_CENTRAL: "North Central Province",
  UVA: "Uva Province",
  SABARAGAMUWA: "Sabaragamuwa Province",
};

// ─── Interfaces ───────────────────────────────────────────────

export interface Amenity {
  id: string;
  name: string;
  iconKey?: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  roomType: RoomType;
  displayName: string;           // computed: e.g. "Deluxe Suite #101"
  pricePerNight: number;
  currency: Currency;
  capacity: number;
  bedCount: number;
  sizeSquareMeters?: number;
  totalUnits: number;
  availableFrom?: string;        // ISO date
  availableTo?: string;          // ISO date
  imageUrls: string[];
  amenities: Amenity[];
  viewType: ViewType;
  bedConfiguration: string;      // e.g. "1 King Bed"
  smokingAllowed: boolean;
  isHourlyBookable: boolean;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  destinations: string[];
}

export interface GroupPricingTier {
  minTravelers: number;
  maxTravelers: number;
  pricePerPerson: number;
}

export interface TourPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  durationDays: number;           // integer days (0.5 = half day)
  durationLabel: string;          // computed display: "Half Day", "2 Days / 1 Night"
  category: TourCategory;
  startingCity: SriLankanCity;
  minGroupSize: number;
  maxGroupSize: number;
  imageUrls: string[];
  itineraryDays: ItineraryDay[];
  pricingTiers: GroupPricingTier[];
  inclusions: Amenity[];          // inclusions (was: highlights as string[])
  scheduledDepartureDates: string[]; // ISO dates
  difficultyLevel: DifficultyLevel;
  physicalRequirements?: string;
  transportModeIncluded: VehicleType;
  mealsIncluded: MealPlan;
  accommodationIncluded: boolean;
  isPrivateTour: boolean;
}

export interface DayOutPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  pricingUnit: PricingUnit;       // PER_PERSON | PER_GROUP | FLAT_RATE
  startTime: string;              // e.g. "09:00"
  endTime: string;
  inclusions: Amenity[];          // (was: string[])
  maxOccupancy: number;
  availableDays: string[];        // e.g. ["MONDAY","TUESDAY"]
  imageUrls: string[];
  advanceBookingHoursRequired: number;
}

export interface NightOutPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  pricingUnit: PricingUnit;
  startTime: string;
  endTime: string;
  includesOvernightStay: boolean;  // frontend-only convenience flag
  inclusions: Amenity[];
  maxOccupancy: number;
  availableDays: string[];
  imageUrls: string[];
  advanceBookingHoursRequired: number;
}

// Host info — derived from auth-service User profile
export interface HostInfo {
  displayName: string;
  avatarUrl: string;
  joinedYear: string;
  isSuperhost: boolean;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  tagline: string;
  type: BusinessType;
  propertyType?: PropertyType;    // for HOTEL businesses
  status: ApprovalStatus;
  verificationStatus: VerificationStatus;
  sltdaLicenseNumber?: string;    // exists on TOUR_AGENCY/TOUR_GUIDE
  city: SriLankanCity;
  region: Region;
  addressLine: string;
  latitude: number;
  longitude: number;
  coverImageUrl: string;
  galleryImageUrls: string[];
  videoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber?: string;
  website?: string;
  socialLinks?: Record<string, string>;
  averageRating: number;
  reviewCount: number;
  responseTimeHours?: number;
  responseRate?: number;
  yearsInBusiness?: number;
  amenities: Amenity[];
  sustainabilityBadges: SustainabilityBadge[];
  cancellationPolicy?: CancellationPolicy;
  paymentMethods: string[];
  depositRequired?: boolean;
  depositPercentage?: number;
  // Computed convenience field for cards
  priceStartFrom: number;
  // Relations
  rooms: Room[];
  dayOutPackages?: DayOutPackage[];
  nightOutPackages?: NightOutPackage[];
  tourPackages?: TourPackage[];
  // Hotel-specific
  starRating?: number;
  checkInTime?: string;
  checkOutTime?: string;
  petPolicy?: PetPolicy;
  offersDayOutPackages?: boolean;
  offersNightOutPackages?: boolean;
  offersHourlyBooking?: boolean;
  // Host profile (derived from auth-service)
  host: HostInfo;
}

// ─── Mock Data ────────────────────────────────────────────────

export const MOCK_BUSINESSES: Business[] = [
  {
    id: "b-1",
    name: "Nine Arch Heritage Villa",
    tagline: "Where every dawn is painted gold over the Nine Arch Bridge",
    description:
      "Nestled in the lush hills of Ella, Nine Arch Heritage Villa offers panoramic mountain views right from your private terrace. Located just a short 10-minute scenic trail walk from the famous Nine Arch Bridge, enjoy authentic Sri Lankan breakfast, infinity plunge pool access, day passes, and romantic hilltop night dinners.",
    type: "HOTEL",
    propertyType: "VILLA",
    status: "APPROVED",
    verificationStatus: "VERIFIED",
    sltdaLicenseNumber: "SLTDA/B/2024/0984",
    city: "ELLA",
    region: "UVA",
    addressLine: "Demodara Road, Ella 90090",
    latitude: 6.8778,
    longitude: 81.0603,
    coverImageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    ],
    contactEmail: "hello@ninearchvilla.lk",
    contactPhone: "+94 57 224 5678",
    whatsappNumber: "+94 77 224 5678",
    website: "https://ninearchvilla.lk",
    averageRating: 4.9,
    reviewCount: 128,
    responseTimeHours: 1.5,
    responseRate: 98,
    yearsInBusiness: 3,
    starRating: 4,
    checkInTime: "14:00",
    checkOutTime: "11:00",
    petPolicy: "NOT_ALLOWED",
    offersDayOutPackages: true,
    offersNightOutPackages: true,
    offersHourlyBooking: false,
    priceStartFrom: 85,
    amenities: [
      { id: "a-1", name: "Mountain View", iconKey: "mountain" },
      { id: "a-2", name: "Infinity Plunge Pool", iconKey: "pool" },
      { id: "a-3", name: "Organic Breakfast Included", iconKey: "breakfast" },
      { id: "a-4", name: "Free High-Speed Wi-Fi", iconKey: "wifi" },
      { id: "a-5", name: "Airport Shuttle Service", iconKey: "shuttle" },
      { id: "a-6", name: "Private Balcony", iconKey: "balcony" },
    ],
    sustainabilityBadges: ["ECO_CERTIFIED", "LOCAL_SOURCING"],
    cancellationPolicy: "MODERATE",
    paymentMethods: ["PAYHERE", "CASH", "BANK_TRANSFER"],
    depositRequired: true,
    depositPercentage: 20,
    host: {
      displayName: "Kasun Jayawardena",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      joinedYear: "2021",
      isSuperhost: true,
    },
    rooms: [
      {
        id: "r-101",
        roomNumber: "101",
        roomType: "DELUXE",
        displayName: "Mountain Mist Deluxe King Suite",
        pricePerNight: 85,
        currency: "USD",
        capacity: 2,
        bedCount: 1,
        sizeSquareMeters: 38,
        totalUnits: 3,
        imageUrls: [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        ],
        amenities: [
          { id: "ra-1", name: "Air Conditioning" },
          { id: "ra-2", name: "En-suite Bathroom" },
          { id: "ra-3", name: "Mountain View Balcony" },
        ],
        viewType: "MOUNTAIN_VIEW",
        bedConfiguration: "1 King Bed",
        smokingAllowed: false,
        isHourlyBookable: false,
      },
      {
        id: "r-102",
        roomNumber: "102",
        roomType: "FAMILY",
        displayName: "Nine Arch Panorama Family Loft",
        pricePerNight: 140,
        currency: "USD",
        capacity: 4,
        bedCount: 2,
        sizeSquareMeters: 62,
        totalUnits: 2,
        imageUrls: [
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
        ],
        amenities: [
          { id: "ra-4", name: "Air Conditioning" },
          { id: "ra-5", name: "Loft Living Area" },
          { id: "ra-6", name: "Panoramic View Terrace" },
        ],
        viewType: "MOUNTAIN_VIEW",
        bedConfiguration: "2 Queen Beds",
        smokingAllowed: false,
        isHourlyBookable: false,
      },
    ],
    dayOutPackages: [
      {
        id: "do-101",
        title: "Ella Infinity Pool & Scenic Lunch Pass",
        description:
          "Full daytime access (09:00–18:00) to the infinity plunge pool overlooking Ella gap, welcome fresh king coconut, traditional 3-course rice & curry buffet lunch, and afternoon Ceylon tea.",
        price: 35,
        currency: "USD",
        pricingUnit: "PER_PERSON",
        startTime: "09:00",
        endTime: "18:00",
        inclusions: [
          { id: "di-1", name: "Infinity Plunge Pool Access" },
          { id: "di-2", name: "3-Course Organic Lunch" },
          { id: "di-3", name: "Welcome King Coconut" },
          { id: "di-4", name: "Sunbed & Towel Service" },
          { id: "di-5", name: "High-Speed Wi-Fi Access" },
        ],
        maxOccupancy: 20,
        availableDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
        imageUrls: [
          "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        ],
        advanceBookingHoursRequired: 12,
      },
    ],
    nightOutPackages: [
      {
        id: "no-101",
        title: "Starlight Hilltop Candlelight Dinner for Two",
        description:
          "Private romantic candlelit setup on the upper deck (19:00–23:00) with a 4-course curated Sri Lankan fusion dinner, complimentary bottle of wine, and acoustic guitar background ambient sound.",
        price: 75,
        currency: "USD",
        pricingUnit: "PER_GROUP",
        startTime: "19:00",
        endTime: "23:00",
        includesOvernightStay: false,
        inclusions: [
          { id: "ni-1", name: "Private Candlelight Terrace Setup" },
          { id: "ni-2", name: "4-Course Gourmet Dinner" },
          { id: "ni-3", name: "Complimentary Wine Bottle" },
          { id: "ni-4", name: "Private Waiter Service" },
        ],
        maxOccupancy: 2,
        availableDays: ["FRIDAY", "SATURDAY", "SUNDAY"],
        imageUrls: [
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        ],
        advanceBookingHoursRequired: 24,
      },
    ],
    tourPackages: [
      {
        id: "tp-101",
        title: "Ella Rock & Nine Arch Sunrise Trekking Experience",
        description:
          "Guided early morning trek to Ella Rock led by a local guide, followed by breakfast overlooking Nine Arch Bridge train crossing.",
        price: 40,
        currency: "USD",
        durationDays: 0.5,
        durationLabel: "Half Day (5 Hours)",
        category: "ADVENTURE",
        startingCity: "ELLA",
        minGroupSize: 1,
        maxGroupSize: 8,
        imageUrls: [
          "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80",
        ],
        itineraryDays: [
          {
            dayNumber: 1,
            title: "Sunrise Summit & Nine Arch Bridge",
            description: "Early morning departure at 5:30 AM, guided jungle trail to Ella Rock summit. Breakfast at the viewpoint, then descend for Nine Arch Bridge photo stop.",
            destinations: ["Ella Rock Trailhead", "Ella Rock Summit", "Nine Arch Bridge"],
          },
        ],
        pricingTiers: [
          { minTravelers: 1, maxTravelers: 3, pricePerPerson: 40 },
          { minTravelers: 4, maxTravelers: 8, pricePerPerson: 32 },
        ],
        inclusions: [
          { id: "ti-1", name: "Ella Rock Summit View" },
          { id: "ti-2", name: "Nine Arch Bridge Train Photo Spot" },
          { id: "ti-3", name: "Guided Jungle Trail" },
          { id: "ti-4", name: "Tuk-Tuk Pick & Drop" },
          { id: "ti-5", name: "Breakfast at Summit" },
        ],
        scheduledDepartureDates: ["2026-09-01", "2026-09-08", "2026-09-15", "2026-09-22"],
        difficultyLevel: "MODERATE",
        physicalRequirements: "Moderate fitness required. Comfortable walking shoes essential.",
        transportModeIncluded: "TUK_TUK",
        mealsIncluded: "BREAKFAST_ONLY",
        accommodationIncluded: false,
        isPrivateTour: false,
      },
    ],
  },

  {
    id: "b-2",
    name: "Galle Fort Colonial House",
    tagline: "Step inside 17th-century elegance within a UNESCO World Heritage site",
    description:
      "Step back into 17th-century elegance within the historic UNESCO World Heritage Galle Fort. Restored with teak woodwork, antique furniture, courtyard dining, day spa passes, and colonial high tea.",
    type: "HOTEL",
    propertyType: "BOUTIQUE_HOTEL",
    status: "APPROVED",
    verificationStatus: "VERIFIED",
    sltdaLicenseNumber: "SLTDA/H/2023/0412",
    city: "GALLE",
    region: "SOUTHERN",
    addressLine: "42 Church Street, Galle Fort",
    latitude: 6.0267,
    longitude: 80.217,
    coverImageUrl:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    ],
    contactEmail: "stay@gallefortcolonial.lk",
    contactPhone: "+94 91 222 4567",
    whatsappNumber: "+94 77 222 4567",
    averageRating: 4.8,
    reviewCount: 94,
    responseTimeHours: 2,
    responseRate: 95,
    yearsInBusiness: 7,
    starRating: 4,
    checkInTime: "15:00",
    checkOutTime: "11:00",
    petPolicy: "NOT_ALLOWED",
    offersDayOutPackages: true,
    offersNightOutPackages: true,
    offersHourlyBooking: false,
    priceStartFrom: 120,
    amenities: [
      { id: "a-10", name: "Historic Fort Location" },
      { id: "a-11", name: "Courtyard Dining" },
      { id: "a-12", name: "Air Conditioning" },
      { id: "a-13", name: "Cocktail Lounge" },
      { id: "a-14", name: "Spa & Wellness" },
    ],
    sustainabilityBadges: ["LOCAL_SOURCING"],
    cancellationPolicy: "STRICT",
    paymentMethods: ["PAYHERE", "BANK_TRANSFER"],
    depositRequired: true,
    depositPercentage: 30,
    host: {
      displayName: "Anjali De Silva",
      avatarUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      joinedYear: "2019",
      isSuperhost: true,
    },
    rooms: [
      {
        id: "r-201",
        roomNumber: "201",
        roomType: "SUITE",
        displayName: "Dutch Heritage Suite",
        pricePerNight: 120,
        currency: "USD",
        capacity: 2,
        bedCount: 1,
        sizeSquareMeters: 55,
        totalUnits: 4,
        imageUrls: [
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
        ],
        amenities: [
          { id: "ra-10", name: "Four-Poster Bed" },
          { id: "ra-11", name: "Antique Furnishings" },
          { id: "ra-12", name: "Fort View Window" },
        ],
        viewType: "CITY_VIEW",
        bedConfiguration: "1 King Four-Poster Bed",
        smokingAllowed: false,
        isHourlyBookable: false,
      },
    ],
    dayOutPackages: [
      {
        id: "do-201",
        title: "Colonial High Tea & Courtyard Day Pass",
        description:
          "Enjoy daytime courtyard relaxation (11:00–17:00) with traditional British-Ceylon High Tea tower, cucumber sandwiches, homemade scones, and spa discount.",
        price: 30,
        currency: "USD",
        pricingUnit: "PER_PERSON",
        startTime: "11:00",
        endTime: "17:00",
        inclusions: [
          { id: "di-10", name: "Courtyard Lounge Access" },
          { id: "di-11", name: "Signature High Tea Tower" },
          { id: "di-12", name: "Fresh Ceylon Tea Tasting" },
          { id: "di-13", name: "15% Spa Treatment Discount" },
        ],
        maxOccupancy: 30,
        availableDays: ["TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
        imageUrls: [
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
        ],
        advanceBookingHoursRequired: 24,
      },
    ],
    nightOutPackages: [
      {
        id: "no-201",
        title: "Galle Fort Sunset Cocktails & Seafood Gala",
        description:
          "Evening courtyard cocktail session followed by 5-course fresh Southern ocean seafood feast (18:30–22:30).",
        price: 90,
        currency: "USD",
        pricingUnit: "PER_GROUP",
        startTime: "18:30",
        endTime: "22:30",
        includesOvernightStay: false,
        inclusions: [
          { id: "ni-10", name: "Welcome Ocean Sunset Cocktails" },
          { id: "ni-11", name: "5-Course Fresh Seafood Dinner" },
          { id: "ni-12", name: "Live Saxophone Performance" },
        ],
        maxOccupancy: 20,
        availableDays: ["FRIDAY", "SATURDAY"],
        imageUrls: [
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
        ],
        advanceBookingHoursRequired: 48,
      },
    ],
    tourPackages: [],
  },

  {
    id: "b-3",
    name: "Sigiriya Eco Jungle Retreat",
    tagline: "Sleep in the treetops, wake to the call of the Lion Rock",
    description:
      "Stay in comfortable wooden treehouses surrounded by wildlife and birds, overlooking the majestic Lion Rock fortress.",
    type: "HOTEL",
    propertyType: "RESORT",
    status: "APPROVED",
    verificationStatus: "VERIFIED",
    sltdaLicenseNumber: "SLTDA/HS/2024/0129",
    city: "SIGIRIYA",
    region: "NORTH_CENTRAL",
    addressLine: "Inamaluwa Road, Sigiriya",
    latitude: 7.957,
    longitude: 80.76,
    coverImageUrl:
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
    ],
    contactEmail: "nature@sigiriyaecoretreat.lk",
    contactPhone: "+94 66 228 9012",
    whatsappNumber: "+94 77 228 9012",
    averageRating: 4.95,
    reviewCount: 76,
    responseTimeHours: 3,
    responseRate: 92,
    yearsInBusiness: 2,
    starRating: 3,
    checkInTime: "13:00",
    checkOutTime: "10:00",
    petPolicy: "ALLOWED",
    offersDayOutPackages: true,
    offersNightOutPackages: false,
    offersHourlyBooking: false,
    priceStartFrom: 55,
    amenities: [
      { id: "a-20", name: "Lion Rock Views" },
      { id: "a-21", name: "Traditional Cooking Classes" },
      { id: "a-22", name: "Bicycle Rental" },
      { id: "a-23", name: "Jungle Safaris" },
    ],
    sustainabilityBadges: ["ECO_CERTIFIED", "PLASTIC_FREE", "LOCAL_SOURCING"],
    cancellationPolicy: "FLEXIBLE",
    paymentMethods: ["PAYHERE", "CASH"],
    depositRequired: false,
    host: {
      displayName: "Sunil Rathnayake",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      joinedYear: "2022",
      isSuperhost: true,
    },
    rooms: [
      {
        id: "r-301",
        roomNumber: "T01",
        roomType: "STANDARD",
        displayName: "Treehouse Canopy Room",
        pricePerNight: 55,
        currency: "USD",
        capacity: 2,
        bedCount: 1,
        sizeSquareMeters: 28,
        totalUnits: 6,
        imageUrls: [
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
        ],
        amenities: [
          { id: "ra-20", name: "Jungle Canopy View" },
          { id: "ra-21", name: "Open-Air Shower" },
          { id: "ra-22", name: "Bird Watching Platform" },
        ],
        viewType: "GARDEN_VIEW",
        bedConfiguration: "1 Queen Bed",
        smokingAllowed: false,
        isHourlyBookable: false,
      },
    ],
    dayOutPackages: [
      {
        id: "do-301",
        title: "Sigiriya Jungle Cooking & Clay Pot Day Pass",
        description:
          "Hands-on Sri Lankan village cooking masterclass, garden harvest walk, clay-pot lunch served on lotus leaf, and bicycle rental.",
        price: 25,
        currency: "USD",
        pricingUnit: "PER_PERSON",
        startTime: "10:00",
        endTime: "16:00",
        inclusions: [
          { id: "di-20", name: "Traditional Cooking Class" },
          { id: "di-21", name: "Lotus Leaf Buffet Lunch" },
          { id: "di-22", name: "Fresh Organic Juice" },
          { id: "di-23", name: "Village Bicycle Pass" },
        ],
        maxOccupancy: 15,
        availableDays: ["MONDAY", "WEDNESDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
        imageUrls: [
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
        ],
        advanceBookingHoursRequired: 12,
      },
    ],
    nightOutPackages: [],
    tourPackages: [],
  },
];
