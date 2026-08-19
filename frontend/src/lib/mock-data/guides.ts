// ============================================================
// BlueCeylon Mock Data — Tour Guides
// Field names aligned to backend TourGuideProfile domain model
// ============================================================

import type { Region, SriLankanCity, VehicleType, VerificationStatus, VEHICLE_TYPE_LABELS } from "./businesses";

export type GuideSpecialtyArea =
  | "WILDLIFE_SAFARI"
  | "CULTURAL_HERITAGE"
  | "MOUNTAIN_TREKKING"
  | "BIRDWATCHING"
  | "CULINARY_TOURS"
  | "PHOTOGRAPHY"
  | "WATER_SPORTS"
  | "ECO_NATURE"
  | "CITY_WALKS";

export const GUIDE_SPECIALTY_LABELS: Record<GuideSpecialtyArea, string> = {
  WILDLIFE_SAFARI: "Wildlife Safaris",
  CULTURAL_HERITAGE: "Cultural Heritage",
  MOUNTAIN_TREKKING: "Mountain Trekking",
  BIRDWATCHING: "Birdwatching",
  CULINARY_TOURS: "Culinary Tours",
  PHOTOGRAPHY: "Photography Expeditions",
  WATER_SPORTS: "Water Sports",
  ECO_NATURE: "Eco & Nature",
  CITY_WALKS: "City Walking Tours",
};

export type LicenseType = "NATIONAL_TOURIST_GUIDE" | "CHAUFFEUR_GUIDE" | "SITE_GUIDE";

export const LICENSE_TYPE_LABELS: Record<LicenseType, string> = {
  NATIONAL_TOURIST_GUIDE: "National Tourist Guide",
  CHAUFFEUR_GUIDE: "Chauffeur Guide",
  SITE_GUIDE: "Site Guide",
};

export interface GuideBlackoutDate {
  startDate: string; // ISO date
  endDate: string;
  reason?: string;
}

export interface Guide {
  id: string;
  name: string;
  tagline: string;              // ← was: title
  description: string;          // ← was: bio
  languagesSpoken: string[];    // ← was: languages
  averageRating: number;        // ← was: rating
  reviewCount: number;
  verificationStatus: VerificationStatus; // ← was: sltdaVerified: boolean
  sltdaLicenseNumber: string;
  licenseType: LicenseType;
  dailyRate: number;            // ← was: dailyRateUSD
  halfDayRate: number;
  currency: "USD" | "LKR";
  avatarUrl: string;            // ← was: avatar
  coverImageUrl: string;        // ← was: coverImage
  specialtyAreas: GuideSpecialtyArea[]; // ← was: specialties: string[]
  vehicleType: VehicleType;     // ← was: vehicle: {type, model, airConditioned}
  vehicleModel: string;         // added to backend recommendation
  vehicleAirConditioned: boolean; // added to backend recommendation
  city: SriLankanCity;
  region: "UVA" | "SOUTHERN" | "WESTERN" | "CENTRAL" | "NORTH_CENTRAL" | "SABARAGAMUWA" | "EASTERN" | "NORTHERN" | "NORTH_WESTERN";
  coverageRegions: string[];
  yearsOfExperience: number;
  maxGroupSizeGuided: number;
  certifications: string[];
  responseTimeHours: number;
  blackoutDates: GuideBlackoutDate[];
  contactPhone: string;
  whatsappNumber: string;
  contactEmail: string;
}

export const MOCK_GUIDES: Guide[] = [
  {
    id: "g-1",
    name: "Chaminda Perera",
    tagline: "Licensed Hill Country & Wildlife Expedition Specialist",
    description:
      "With over 12 years of experience guiding travelers across Sri Lanka's Cultural Triangle, Yala national park safaris, and tea plantation trekking trails in Nuwara Eliya. Fully licensed by the Sri Lanka Tourism Development Authority.",
    languagesSpoken: ["English", "German", "Sinhala"],
    averageRating: 4.98,
    reviewCount: 164,
    verificationStatus: "VERIFIED",
    sltdaLicenseNumber: "SLTDA/NTG/2022/1042",
    licenseType: "NATIONAL_TOURIST_GUIDE",
    dailyRate: 65,
    halfDayRate: 38,
    currency: "USD",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    coverImageUrl:
      "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80",
    specialtyAreas: ["WILDLIFE_SAFARI", "MOUNTAIN_TREKKING", "CULTURAL_HERITAGE"],
    vehicleType: "SUV",
    vehicleModel: "Toyota KDH Super GL (2022)",
    vehicleAirConditioned: true,
    city: "ELLA",
    region: "UVA",
    coverageRegions: ["UVA", "CENTRAL", "SOUTHERN"],
    yearsOfExperience: 12,
    maxGroupSizeGuided: 8,
    certifications: [
      "SLTDA National Tourist Guide License",
      "First Aid & Safety Certified",
      "Wildlife Tracking — Yala NP",
    ],
    responseTimeHours: 1,
    blackoutDates: [],
    contactPhone: "+94 77 112 3456",
    whatsappNumber: "+94 77 112 3456",
    contactEmail: "chaminda.perera.guide@gmail.com",
  },
  {
    id: "g-2",
    name: "Niroshan Bandara",
    tagline: "Heritage & Culinary Secrets Guide — Galle & Colombo",
    description:
      "Passionate about Sri Lanka's rich history, street food scenes, and spices. Specialized in food walks in Colombo and Galle Fort historic walking tours.",
    languagesSpoken: ["English", "French", "Sinhala"],
    averageRating: 4.9,
    reviewCount: 88,
    verificationStatus: "VERIFIED",
    sltdaLicenseNumber: "SLTDA/NTG/2023/0811",
    licenseType: "NATIONAL_TOURIST_GUIDE",
    dailyRate: 55,
    halfDayRate: 30,
    currency: "USD",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    coverImageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    specialtyAreas: ["CULINARY_TOURS", "CULTURAL_HERITAGE", "PHOTOGRAPHY", "CITY_WALKS"],
    vehicleType: "CAR",
    vehicleModel: "Toyota Prius Hybrid (2021)",
    vehicleAirConditioned: true,
    city: "GALLE",
    region: "SOUTHERN",
    coverageRegions: ["SOUTHERN", "WESTERN"],
    yearsOfExperience: 7,
    maxGroupSizeGuided: 6,
    certifications: [
      "SLTDA National Tourist Guide License",
      "Culinary Heritage of Sri Lanka — Certified",
    ],
    responseTimeHours: 2,
    blackoutDates: [
      { startDate: "2026-12-24", endDate: "2026-12-26", reason: "Holiday" },
    ],
    contactPhone: "+94 77 887 6654",
    whatsappNumber: "+94 77 887 6654",
    contactEmail: "niroshan.bandara.tours@gmail.com",
  },
];
