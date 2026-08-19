// ============================================================
// BlueCeylon Mock Data — Tour Agencies
// Field names aligned to backend TourAgency domain model
// ============================================================

import type { Region, SriLankanCity, VehicleType, VerificationStatus, AgencySpecialization } from "./businesses";

export const AGENCY_SPECIALIZATION_LABELS: Record<AgencySpecialization, string> = {
  ADVENTURE: "Adventure & Extreme",
  CULTURAL: "Cultural Heritage",
  ECO: "Eco & Nature",
  WELLNESS: "Wellness Retreat",
  BEACH: "Beach & Coastal",
  WILDLIFE: "Wildlife Safaris",
  HISTORICAL: "Historical Sites",
  CULINARY: "Culinary Experiences",
  SPIRITUAL: "Spiritual Journeys",
};

export interface FeaturedPackage {
  title: string;
  duration: string;
  price: number;
  currency: "USD" | "LKR";
}

export interface TourAgency {
  id: string;
  name: string;                       // ← was: agencyName
  tagline: string;
  description: string;
  city: SriLankanCity;                // ← was: string (enum now)
  region: Region;                     // ← was: custom string (proper Region enum now)
  sltdaLicenseNumber: string;
  licenseNumber?: string;             // alias used for display
  verificationStatus: VerificationStatus; // ← was: sltdaVerified: boolean
  yearsInBusiness: number;            // ← was: yearsInOperation
  averageRating: number;              // ← was: rating
  reviewCount: number;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  coverImageUrl: string;              // ← was: coverImage
  specializations: AgencySpecialization[]; // ← was: string[]
  fleetTypes: VehicleType[];          // ← was: string[]
  partnerNetworkSize?: number;
  featuredPackage: FeaturedPackage;
}

export const VEHICLE_FLEET_LABELS: Record<VehicleType, string> = {
  TUK_TUK: "Tuk-Tuk",
  CAR: "Sedan / Car",
  VAN: "Passenger Van",
  SUV: "4x4 Luxury SUV",
  MINIBUS: "Minibus",
  COACH: "AC Coach",
  MOTORBIKE: "Motorbike",
  NONE: "Walking Tours",
};

export const MOCK_AGENCIES: TourAgency[] = [
  {
    id: "agency-1",
    name: "Ceylon Heritage Safaris & Expeditions",
    tagline: "Accredited wildlife safaris & hill country trekking specialists",
    description:
      "Premier SLTDA registered travel operator offering private leopard safaris in Yala, Knuckles mountain trekking, and luxury chauffeur tours across Sri Lanka.",
    city: "COLOMBO",
    region: "WESTERN",
    sltdaLicenseNumber: "SLTDA/TA/2026/0411",
    verificationStatus: "VERIFIED",
    yearsInBusiness: 8,
    averageRating: 4.95,
    reviewCount: 142,
    contactEmail: "tours@ceylonheritage.lk",
    contactPhone: "+94 11 234 5678",
    whatsappNumber: "+94 77 987 6543",
    coverImageUrl:
      "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80",
    specializations: ["WILDLIFE", "ADVENTURE", "ECO", "WELLNESS"],
    fleetTypes: ["SUV", "VAN", "COACH"],
    partnerNetworkSize: 34,
    featuredPackage: {
      title: "7-Day Signature Wildlife & Hill Country Circuit",
      duration: "7 Days / 6 Nights",
      price: 850,
      currency: "USD",
    },
  },
  {
    id: "agency-2",
    name: "Blue Ocean Island Travel Agency",
    tagline: "South Coast beach hopping, whale watching & surf expeditions",
    description:
      "Specialized travel operator based in Mirissa & Galle offering private catamaran cruises, blue whale watching safaris, and coastal heritage tours.",
    city: "MIRISSA",
    region: "SOUTHERN",
    sltdaLicenseNumber: "SLTDA/TA/2024/0988",
    verificationStatus: "VERIFIED",
    yearsInBusiness: 6,
    averageRating: 4.88,
    reviewCount: 96,
    contactEmail: "info@blueoceantravel.lk",
    contactPhone: "+94 41 222 3344",
    whatsappNumber: "+94 71 555 6677",
    coverImageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    specializations: ["WILDLIFE", "BEACH", "CULTURAL"],
    fleetTypes: ["VAN", "COACH"],
    partnerNetworkSize: 18,
    featuredPackage: {
      title: "Mirissa Blue Whale Safari & Galle Fort Sunset Cruise",
      duration: "Full Day (10 Hours)",
      price: 120,
      currency: "USD",
    },
  },
  {
    id: "agency-3",
    name: "Kingdoms of Lanka Cultural Tours",
    tagline: "UNESCO Heritage Sites & Ancient Civilization Expeditions",
    description:
      "Expert cultural agency providing deep-dive guided explorations of Sigiriya Rock Fortress, Polonnaruwa ancient kingdom, and Dambulla cave temples.",
    city: "KANDY",
    region: "CENTRAL",
    sltdaLicenseNumber: "SLTDA/TA/2023/1102",
    verificationStatus: "VERIFIED",
    yearsInBusiness: 12,
    averageRating: 4.92,
    reviewCount: 210,
    contactEmail: "heritage@kingdomsoflanka.lk",
    contactPhone: "+94 81 333 4455",
    whatsappNumber: "+94 77 333 8899",
    coverImageUrl:
      "https://images.unsplash.com/photo-1588598056914-7223b9d04261?auto=format&fit=crop&w=1200&q=80",
    specializations: ["CULTURAL", "HISTORICAL", "SPIRITUAL"],
    fleetTypes: ["CAR", "VAN", "COACH"],
    partnerNetworkSize: 52,
    featuredPackage: {
      title: "Cultural Triangle 4-Day Expedition (Sigiriya, Dambulla & Kandy)",
      duration: "4 Days / 3 Nights",
      price: 480,
      currency: "USD",
    },
  },
];
