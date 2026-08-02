export interface Guide {
  id: string;
  name: string;
  title: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  sltdaVerified: boolean;
  sltdaLicenseNumber: string;
  dailyRateUSD: number;
  avatar: string;
  coverImage: string;
  bio: string;
  specialties: string[];
  vehicle: {
    type: string;
    model: string;
    airConditioned: boolean;
  };
}

export const MOCK_GUIDES: Guide[] = [
  {
    id: "g-1",
    name: "Chaminda Perera",
    title: "Licensed Hill Country & Wildlife Expedition Specialist",
    languages: ["English", "German", "Sinhala"],
    rating: 4.98,
    reviewCount: 164,
    sltdaVerified: true,
    sltdaLicenseNumber: "SLTDA/NTG/2022/1042",
    dailyRateUSD: 65,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80",
    bio: "With over 12 years of experience guiding travelers across Sri Lanka's Cultural Triangle, Yala national park safaris, and tea plantation trekking trails in Nuwara Eliya. Fully licensed by the Sri Lanka Tourism Development Authority.",
    specialties: ["Yala & Udawalawe Leopard Safaris", "Ella & Knuckles Hiking", "Ancient Ruins & Temples"],
    vehicle: {
      type: "Luxury SUV / Van",
      model: "Toyota KDH Super GL (2022)",
      airConditioned: true,
    },
  },
  {
    id: "g-2",
    name: "Niroshan Bandara",
    title: "Heritage & Culinary Secrets Guide",
    languages: ["English", "French", "Sinhala"],
    rating: 4.9,
    reviewCount: 88,
    sltdaVerified: true,
    sltdaLicenseNumber: "SLTDA/NTG/2023/0811",
    dailyRateUSD: 55,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    bio: "Passionate about Sri Lanka's rich history, street food scenes, and spices. Specialized in food walks in Colombo and Galle Fort historic walking tours.",
    specialties: ["Street Food Walks", "UNESCO Heritage Tours", "Photography Expeditions"],
    vehicle: {
      type: "Sedan",
      model: "Toyota Prius Hybrid",
      airConditioned: true,
    },
  },
];
