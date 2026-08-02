export interface TourAgency {
  id: string;
  agencyName: string;
  tagline: string;
  description: string;
  city: string;
  region: string;
  sltdaLicenseNumber: string;
  sltdaVerified: boolean;
  yearsInOperation: number;
  rating: number;
  reviewCount: number;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  coverImage: string;
  specializations: string[];
  fleetTypes: string[];
  featuredPackage: {
    title: string;
    duration: string;
    price: number;
  };
}

export const MOCK_AGENCIES: TourAgency[] = [
  {
    id: "agency-1",
    agencyName: "Ceylon Heritage Safaris & Expeditions",
    tagline: "Accredited wildlife safaris & hill country trekking specialists",
    description: "Premier SLTDA registered travel operator offering private leopard safaris in Yala, Knuckles mountain trekking, and luxury chauffeur tours across Sri Lanka.",
    city: "Colombo",
    region: "WESTERN_PROVINCE",
    sltdaLicenseNumber: "SLTDA/TA/2026/0411",
    sltdaVerified: true,
    yearsInOperation: 8,
    rating: 4.95,
    reviewCount: 142,
    contactEmail: "tours@ceylonheritage.lk",
    contactPhone: "+94 11 234 5678",
    whatsappNumber: "+94 77 987 6543",
    coverImage: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80",
    specializations: ["Wildlife Safaris", "Mountain Trekking", "Luxury Island Escapes", "Honeymoon Packages"],
    fleetTypes: ["4x4 Luxury SUVs", "AC Passenger Vans", "Mini Coaches"],
    featuredPackage: {
      title: "7-Day Signature Wildlife & Hill Country Circuit",
      duration: "7 Days / 6 Nights",
      price: 850,
    },
  },
  {
    id: "agency-2",
    agencyName: "Blue Ocean Island Travel Agency",
    tagline: "South Coast beach hopping, whale watching & surf expeditions",
    description: "Specialized travel operator based in Mirissa & Galle offering private catamaran cruises, blue whale watching safaris, and coastal heritage tours.",
    city: "Mirissa",
    region: "SOUTH_COAST",
    sltdaLicenseNumber: "SLTDA/TA/2024/0988",
    sltdaVerified: true,
    yearsInOperation: 6,
    rating: 4.88,
    reviewCount: 96,
    contactEmail: "info@blueoceantravel.lk",
    contactPhone: "+94 41 222 3344",
    whatsappNumber: "+94 71 555 6677",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    specializations: ["Whale & Dolphin Watching", "Coastal Surfing Tours", "Galle Fort Heritage Walks"],
    fleetTypes: ["Luxury Catamarans", "AC Speedboats", "Private Vans"],
    featuredPackage: {
      title: "Mirissa Blue Whale Safari & Galle Fort Sunset Cruise",
      duration: "Full Day (10 Hours)",
      price: 120,
    },
  },
  {
    id: "agency-3",
    agencyName: "Kingdoms of Lanka Cultural Tours",
    tagline: "UNESCO Heritage Sites & Ancient Civilization Expeditions",
    description: "Expert cultural agency providing deep-dive guided explorations of Sigiriya Rock Fortress, Polonnaruwa ancient kingdom, and Dambulla cave temples.",
    city: "Kandy",
    region: "CULTURAL_TRIANGLE",
    sltdaLicenseNumber: "SLTDA/TA/2023/1102",
    sltdaVerified: true,
    yearsInOperation: 12,
    rating: 4.92,
    reviewCount: 210,
    contactEmail: "heritage@kingdomsoflanka.lk",
    contactPhone: "+94 81 333 4455",
    whatsappNumber: "+94 77 333 8899",
    coverImage: "https://images.unsplash.com/photo-1588598056914-7223b9d04261?auto=format&fit=crop&w=1200&q=80",
    specializations: ["UNESCO World Heritage Sites", "Temple Architecture", "Kandyan Cultural Dance"],
    fleetTypes: ["AC Hybrid Sedans", "Luxury Vans", "Coaches"],
    featuredPackage: {
      title: "Cultural Triangle 4-Day Expedition (Sigiriya, Dambulla & Kandy)",
      duration: "4 Days / 3 Nights",
      price: 480,
    },
  },
];
