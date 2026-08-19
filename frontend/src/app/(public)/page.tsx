"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, Hotel, Compass, User, ArrowRight, Sparkles, 
  MapPin, Star, CheckCircle2, Award, HeartHandshake, Car, 
  TreePine, Waves, Landmark, Mountain, Check, Clock, Eye,
  Calendar, Users, Briefcase, Languages, Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MOCK_BUSINESSES, CITY_LABELS, REGION_LABELS } from "@/lib/mock-data/businesses";

export default function ExploreLandingPage() {
  const router = useRouter();

  // Search Panel State
  const [activeTab, setActiveTab] = useState<"STAYS" | "TOURS" | "AGENCIES" | "GUIDES">("STAYS");

  // Tab 1: Rooms & Stays State
  const [staysCity, setStaysCity] = useState("ALL");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [staysGuests, setStaysGuests] = useState("2 Guests");

  // Tab 2: Tour Packages State
  const [toursCity, setToursCity] = useState("ALL");
  const [toursDuration, setToursDuration] = useState("ALL");
  const [toursPeople, setToursPeople] = useState("2 Travelers");

  // Tab 3: Tour Agencies State
  const [agencyCity, setAgencyCity] = useState("ALL");
  const [agencyCategory, setAgencyCategory] = useState("ALL");

  // Tab 4: Tour Guides State
  const [guideCity, setGuideCity] = useState("ALL");
  const [guideLanguage, setGuideLanguage] = useState("ALL");
  const [guideLicense, setGuideLicense] = useState("ALL");

  // Search Submission Handlers
  const handleStaysSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (staysCity !== "ALL") params.append("city", staysCity);
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (staysGuests) params.append("guests", staysGuests.replace(/\D/g, "") || "2");
    router.push(`/rooms?${params.toString()}`);
  };

  const handleToursSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (toursCity !== "ALL") params.append("city", toursCity);
    if (toursDuration !== "ALL") params.append("duration", toursDuration);
    if (toursPeople) params.append("guests", toursPeople.replace(/\D/g, "") || "2");
    router.push(`/tours?${params.toString()}`);
  };

  const handleAgencySearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (agencyCity !== "ALL") params.append("city", agencyCity);
    if (agencyCategory !== "ALL") params.append("category", agencyCategory);
    router.push(`/tour-agencies?${params.toString()}`);
  };

  const handleGuideSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (guideCity !== "ALL") params.append("city", guideCity);
    if (guideLanguage !== "ALL") params.append("language", guideLanguage);
    if (guideLicense !== "ALL") params.append("license", guideLicense);
    router.push(`/tour-guides?${params.toString()}`);
  };

  const DESTINATIONS = [
    {
      id: "ella",
      name: "Ella & Hill Country",
      tagline: "Misty tea hills, Nine Arch Viaduct & waterfalls",
      image: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80",
      city: "Ella",
      staysCount: "24 Verified Stays",
      badge: "Hill Country",
    },
    {
      id: "galle",
      name: "Galle Fort & South Coast",
      tagline: "Colonial Dutch ramparts, boutique cafes & surf breaks",
      image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
      city: "Galle",
      staysCount: "18 Heritage Villas",
      badge: "UNESCO Heritage",
    },
    {
      id: "sigiriya",
      name: "Sigiriya & Cultural Triangle",
      tagline: "5th century fortress, ancient ruins & wild elephants",
      image: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80",
      city: "Sigiriya",
      staysCount: "15 Eco Lodges",
      badge: "Cultural Wonder",
    },
    {
      id: "mirissa",
      name: "Mirissa & South Coast",
      tagline: "Whale watching, Coconut Tree Hill & golden beaches",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      city: "Mirissa",
      staysCount: "20 Surf Boutiques",
      badge: "Coastal Paradise",
    },
    {
      id: "yala",
      name: "Yala & Wildlife Parks",
      tagline: "Leopard safaris, elephant herds & coastal wilderness",
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
      city: "Yala",
      staysCount: "12 Wildlife Camps",
      badge: "Safari Zone",
    },
    {
      id: "kandy",
      name: "Kandy & Sacred Valley",
      tagline: "Temple of the Tooth, lake drives & royal botanical gardens",
      image: "https://images.unsplash.com/photo-1588598056914-e4e151d9c777?auto=format&fit=crop&w=800&q=80",
      city: "Kandy",
      staysCount: "16 Hill Resorts",
      badge: "Royal City",
    },
  ];

  const PLATFORM_FEATURES = [
    {
      icon: ShieldCheck,
      title: "100% SLTDA Verified",
      desc: "Every hotel, villa, tour agency, and guide is officially accredited by Sri Lanka Tourism Development Authority.",
      color: "text-[#008080]",
      bgColor: "bg-[#008080]/10",
    },
    {
      icon: HeartHandshake,
      title: "Direct Local Host Booking",
      desc: "Book directly with independent Sri Lankan hosts and certified guides without intermediary markups.",
      color: "text-[#003366]",
      bgColor: "bg-[#003366]/10",
    },
    {
      icon: Car,
      title: "Accredited Chauffeur Guides",
      desc: "Travel safely across the island with licensed multi-lingual national guides operating insured luxury vehicles.",
      color: "text-[#FDA301]",
      bgColor: "bg-[#FDA301]/10",
    },
    {
      icon: Award,
      title: "Guaranteed Authenticity",
      desc: "Verified reviews from real travelers, clear cancellation policies, and 24/7 island customer support.",
      color: "text-[#3FCFC0]",
      bgColor: "bg-[#3FCFC0]/10",
    },
  ];

  const CATEGORY_COLLECTIONS = [
    {
      icon: Hotel,
      title: "Boutique Stays & Villas",
      desc: "Tea estate bungalows, private beachfront villas, and restored colonial mansions.",
      link: "/rooms",
      cta: "Browse Stays",
      gradient: "from-[#003366] to-[#005F73]",
    },
    {
      icon: Compass,
      title: "Bespoke Island Tours",
      desc: "Multi-day cultural circuits, Knuckles mountain trekking, and Yala wildlife safaris.",
      link: "/tours",
      cta: "Explore Tour Packages",
      gradient: "from-[#005F73] to-[#008080]",
    },
    {
      icon: User,
      title: "Private Licensed Guides",
      desc: "Certified national tour guides providing personalized island itineraries and private transport.",
      link: "/tour-guides",
      cta: "Find Private Guides",
      gradient: "from-[#008080] to-[#0A4D68]",
    },
  ];

  const TESTIMONIALS = [
    {
      name: "Eleanor & Mark Vance",
      country: "United Kingdom",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      quote: "Booking our Nine Arch villa and private guide through Blue Ceylon made our 14-day Sri Lanka trip completely effortless. Knowing every host was SLTDA verified gave us true peace of mind.",
      stay: "Nine Arch Heritage Villa, Ella",
      rating: 5,
    },
    {
      name: "Dr. Julian Sommer",
      country: "Germany",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      quote: "Our guide Chaminda was remarkable. His knowledge of Yala wildlife and Anuradhapura history was world-class. Blue Ceylon is the gold standard for authentic Sri Lankan travel.",
      stay: "Private Safari & Chauffeur Tour",
      rating: 5,
    },
  ];

  // Featured Hotels subset
  const FEATURED_HOTELS = MOCK_BUSINESSES.slice(0, 3);

  // Featured Tour Packages subset
  const FEATURED_TOURS = MOCK_BUSINESSES.flatMap((b) =>
    (b.tourPackages || []).map((tp) => ({
      ...tp,
      hotelName: b.name,
      hotelId: b.id,
      city: b.city,
      rating: b.averageRating,
      sltdaVerified: b.verificationStatus === "VERIFIED",
    }))
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#081419] transition-colors">
      
      {/* ══ 1. HERO SECTION WITH INTEGRATED SEARCH PANEL ══ */}
      <section className="relative min-h-[88vh] flex flex-col justify-center pt-20 pb-20 z-20">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=2000&q=80" 
            alt="Sri Lanka Tea Country & Nine Arch Viaduct" 
            className="w-full h-full object-cover scale-105 animate-pulse"
            style={{ animationDuration: "12s" }}
          />
          {/* Layered Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#001528]/85 via-[#003366]/70 to-[#F4F6F8] dark:to-[#081419]" />
        </div>

        {/* Hero Content Box */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* SLTDA Verified Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg animate-in fade-in zoom-in-95 duration-700">
            <ShieldCheck className="w-4 h-4 text-[#FDA301]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Official Sri Lanka Tourism Accredited Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Unveil the Wonders of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5CE1E6] via-[#FDA301] to-[#3FCFC0]">Ceylon</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-gray-200 max-w-3xl mx-auto font-medium leading-relaxed">
            Boutique heritage stays, accredited tour agencies, bespoke wildlife safaris, and private licensed guides — all in one verified directory.
          </p>

          {/* ══ INTERACTIVE 4-OPTION SEARCH PANEL ══ */}
          <div className="w-full max-w-4xl mx-auto pt-4 text-left relative z-40">
            <div className="bg-white/95 dark:bg-[#0F252E]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 dark:border-[#20353D] p-4 sm:p-6 space-y-4">
              
              {/* TAB SELECTOR (4 OPTIONS: Rooms & Stays, Tour Packages, Tour Agencies, Tour Guides) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#E4E9EA] dark:border-[#20353D] hide-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab("STAYS")}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === "STAYS"
                      ? "bg-[#008080] text-white shadow-md"
                      : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <Hotel className="w-4 h-4" />
                  <span>Rooms & Stays</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("TOURS")}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === "TOURS"
                      ? "bg-[#008080] text-white shadow-md"
                      : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Tour Packages</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("AGENCIES")}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === "AGENCIES"
                      ? "bg-[#008080] text-white shadow-md"
                      : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Tour Agencies</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("GUIDES")}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === "GUIDES"
                      ? "bg-[#008080] text-white shadow-md"
                      : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Tour Guides</span>
                </button>
              </div>

              {/* TAB 1: ROOMS & STAYS FORM */}
              {activeTab === "STAYS" && (
                <form onSubmit={handleStaysSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                  {/* Destination / Place */}
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#15323D] border border-gray-200 dark:border-gray-700">
                    <MapPin className="w-5 h-5 text-[#008080] shrink-0" />
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Place / Destination</label>
                      <select value={staysCity} onChange={(e) => setStaysCity(e.target.value)} className="bg-transparent text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] outline-none cursor-pointer">
                        <option value="ALL" className="dark:bg-[#0F252E]">All Sri Lanka</option>
                        <option value="Ella" className="dark:bg-[#0F252E]">Ella (Hill Country)</option>
                        <option value="Galle" className="dark:bg-[#0F252E]">Galle (South Coast)</option>
                        <option value="Sigiriya" className="dark:bg-[#0F252E]">Sigiriya (Cultural)</option>
                        <option value="Mirissa" className="dark:bg-[#0F252E]">Mirissa (South Coast)</option>
                        <option value="Kandy" className="dark:bg-[#0F252E]">Kandy (Central)</option>
                        <option value="Colombo" className="dark:bg-[#0F252E]">Colombo (Capital)</option>
                        <option value="Nuwara Eliya" className="dark:bg-[#0F252E]">Nuwara Eliya (Tea)</option>
                      </select>
                    </div>
                  </div>

                  {/* Check-In / Check-Out Interactive Date Range Calendar */}
                  <DateRangePicker
                    checkInDate={checkIn}
                    checkOutDate={checkOut}
                    onChange={({ checkIn, checkOut }) => {
                      setCheckIn(checkIn);
                      setCheckOut(checkOut);
                    }}
                  />

                  {/* Guest Count */}
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#15323D] border border-gray-200 dark:border-gray-700">
                    <Users className="w-5 h-5 text-[#008080] shrink-0" />
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Guest Count</label>
                      <select value={staysGuests} onChange={(e) => setStaysGuests(e.target.value)} className="bg-transparent text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] outline-none cursor-pointer">
                        <option value="1 Guest" className="dark:bg-[#0F252E]">1 Traveler (Solo)</option>
                        <option value="2 Guests" className="dark:bg-[#0F252E]">2 Guests (Couple)</option>
                        <option value="4 Guests" className="dark:bg-[#0F252E]">4 Guests (Family)</option>
                        <option value="6 Guests" className="dark:bg-[#0F252E]">6+ Group / Villa</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" variant="primary" size="lg" className="w-full rounded-2xl gap-2 font-bold py-3.5 shadow-md">
                    <Search className="w-4 h-4" />
                    <span>Search Stays</span>
                  </Button>
                </form>
              )}

              {/* TAB 2: TOUR PACKAGES FORM */}
              {activeTab === "TOURS" && (
                <form onSubmit={handleToursSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                  {/* Place / Region */}
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#15323D] border border-gray-200 dark:border-gray-700">
                    <MapPin className="w-5 h-5 text-[#008080] shrink-0" />
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Place / Region</label>
                      <select value={toursCity} onChange={(e) => setToursCity(e.target.value)} className="bg-transparent text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] outline-none cursor-pointer">
                        <option value="ALL" className="dark:bg-[#0F252E]">All Regions</option>
                        <option value="Ella" className="dark:bg-[#0F252E]">Ella (Hiking & Tea)</option>
                        <option value="Sigiriya" className="dark:bg-[#0F252E]">Sigiriya (Culture)</option>
                        <option value="Yala" className="dark:bg-[#0F252E]">Yala (Safari Wildlife)</option>
                        <option value="Galle" className="dark:bg-[#0F252E]">Galle (Coastal)</option>
                      </select>
                    </div>
                  </div>

                  {/* Days Count / Duration */}
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#15323D] border border-gray-200 dark:border-gray-700">
                    <Clock className="w-5 h-5 text-[#008080] shrink-0" />
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Days Count</label>
                      <select value={toursDuration} onChange={(e) => setToursDuration(e.target.value)} className="bg-transparent text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] outline-none cursor-pointer">
                        <option value="ALL" className="dark:bg-[#0F252E]">Any Duration</option>
                        <option value="1" className="dark:bg-[#0F252E]">1 Day Excursion</option>
                        <option value="3" className="dark:bg-[#0F252E]">2-3 Days Circuit</option>
                        <option value="5" className="dark:bg-[#0F252E]">4-7 Days Expedition</option>
                      </select>
                    </div>
                  </div>

                  {/* People Count */}
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#15323D] border border-gray-200 dark:border-gray-700">
                    <Users className="w-5 h-5 text-[#008080] shrink-0" />
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">People Count</label>
                      <select value={toursPeople} onChange={(e) => setToursPeople(e.target.value)} className="bg-transparent text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] outline-none cursor-pointer">
                        <option value="1 Traveler" className="dark:bg-[#0F252E]">1 Traveler</option>
                        <option value="2 Travelers" className="dark:bg-[#0F252E]">2 Travelers (Couple)</option>
                        <option value="4 Travelers" className="dark:bg-[#0F252E]">4 Travelers (Family)</option>
                        <option value="6 Group" className="dark:bg-[#0F252E]">Group 6+</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" variant="primary" size="lg" className="w-full rounded-2xl gap-2 font-bold py-3.5 shadow-md">
                    <Search className="w-4 h-4" />
                    <span>Search Packages</span>
                  </Button>
                </form>
              )}

              {/* TAB 3: TOUR AGENCIES FORM */}
              {activeTab === "AGENCIES" && (
                <form onSubmit={handleAgencySearch} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                  {/* City / Hub */}
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#15323D] border border-gray-200 dark:border-gray-700">
                    <MapPin className="w-5 h-5 text-[#008080] shrink-0" />
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Service Hub / City</label>
                      <select value={agencyCity} onChange={(e) => setAgencyCity(e.target.value)} className="bg-transparent text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] outline-none cursor-pointer">
                        <option value="ALL" className="dark:bg-[#0F252E]">All Sri Lanka Hubs</option>
                        <option value="Colombo" className="dark:bg-[#0F252E]">Colombo (Headquarters)</option>
                        <option value="Kandy" className="dark:bg-[#0F252E]">Kandy (Central)</option>
                        <option value="Galle" className="dark:bg-[#0F252E]">Galle (South Coast)</option>
                        <option value="Ella" className="dark:bg-[#0F252E]">Ella (Hill Country)</option>
                      </select>
                    </div>
                  </div>

                  {/* Agency Category / Fleet */}
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#15323D] border border-gray-200 dark:border-gray-700">
                    <Briefcase className="w-5 h-5 text-[#008080] shrink-0" />
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Agency Speciality</label>
                      <select value={agencyCategory} onChange={(e) => setAgencyCategory(e.target.value)} className="bg-transparent text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] outline-none cursor-pointer">
                        <option value="ALL" className="dark:bg-[#0F252E]">All Agency Types</option>
                        <option value="SLTDA" className="dark:bg-[#0F252E]">SLTDA Accredited Only</option>
                        <option value="Safari" className="dark:bg-[#0F252E]">Wildlife & Safari Specialists</option>
                        <option value="Chauffeur" className="dark:bg-[#0F252E]">Luxury Transport & Fleet</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" variant="primary" size="lg" className="w-full rounded-2xl gap-2 font-bold py-3.5 shadow-md">
                    <Search className="w-4 h-4" />
                    <span>Find Tour Agencies</span>
                  </Button>
                </form>
              )}

              {/* TAB 4: TOUR GUIDES FORM */}
              {activeTab === "GUIDES" && (
                <form onSubmit={handleGuideSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                  {/* Location / City */}
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#15323D] border border-gray-200 dark:border-gray-700">
                    <MapPin className="w-5 h-5 text-[#008080] shrink-0" />
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Location / City</label>
                      <select value={guideCity} onChange={(e) => setGuideCity(e.target.value)} className="bg-transparent text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] outline-none cursor-pointer">
                        <option value="ALL" className="dark:bg-[#0F252E]">Island-wide Guides</option>
                        <option value="Ella" className="dark:bg-[#0F252E]">Ella & Knuckles</option>
                        <option value="Sigiriya" className="dark:bg-[#0F252E]">Sigiriya & Culture</option>
                        <option value="Yala" className="dark:bg-[#0F252E]">Yala & Safaris</option>
                        <option value="Galle" className="dark:bg-[#0F252E]">Galle & Fort</option>
                      </select>
                    </div>
                  </div>

                  {/* Language */}
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#15323D] border border-gray-200 dark:border-gray-700">
                    <Languages className="w-5 h-5 text-[#008080] shrink-0" />
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Language</label>
                      <select value={guideLanguage} onChange={(e) => setGuideLanguage(e.target.value)} className="bg-transparent text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] outline-none cursor-pointer">
                        <option value="ALL" className="dark:bg-[#0F252E]">All Languages</option>
                        <option value="English" className="dark:bg-[#0F252E]">English</option>
                        <option value="German" className="dark:bg-[#0F252E]">German</option>
                        <option value="French" className="dark:bg-[#0F252E]">French</option>
                        <option value="Japanese" className="dark:bg-[#0F252E]">Japanese</option>
                      </select>
                    </div>
                  </div>

                  {/* License Type */}
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#15323D] border border-gray-200 dark:border-gray-700">
                    <Award className="w-5 h-5 text-[#008080] shrink-0" />
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">License Type</label>
                      <select value={guideLicense} onChange={(e) => setGuideLicense(e.target.value)} className="bg-transparent text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] outline-none cursor-pointer">
                        <option value="ALL" className="dark:bg-[#0F252E]">All Licensed Guides</option>
                        <option value="National" className="dark:bg-[#0F252E]">National Tourist Guide</option>
                        <option value="Chauffeur" className="dark:bg-[#0F252E]">Chauffeur Guide (With Vehicle)</option>
                        <option value="Site" className="dark:bg-[#0F252E]">Site Guide Specialist</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" variant="primary" size="lg" className="w-full rounded-2xl gap-2 font-bold py-3.5 shadow-md">
                    <Search className="w-4 h-4" />
                    <span>Search Guides</span>
                  </Button>
                </form>
              )}

            </div>
          </div>

          {/* Key Stat Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white">
              <div className="text-2xl font-black text-[#5CE1E6]">150+</div>
              <div className="text-[11px] text-gray-300 font-semibold uppercase tracking-wider">Verified Hotels & Villas</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white">
              <div className="text-2xl font-black text-[#FDA301]">80+</div>
              <div className="text-[11px] text-gray-300 font-semibold uppercase tracking-wider">Licensed National Guides</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white">
              <div className="text-2xl font-black text-[#3FCFC0]">45+</div>
              <div className="text-[11px] text-gray-300 font-semibold uppercase tracking-wider">Bespoke Tour Packages</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white">
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-[11px] text-gray-300 font-semibold uppercase tracking-wider">SLTDA License Compliant</div>
            </div>
          </div>

        </div>
      </section>

      {/* ══ 2. TOP DESTINATIONS GRID ══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#008080] dark:text-[#3FCFC0] mb-2">
              <MapPin className="w-4 h-4" />
              <span>Iconic Regions</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
              Explore Sri Lanka by Region
            </h2>
            <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-1 max-w-xl">
              From high-altitude tea plantations to UNESCO world heritage fortresses and secluded surfing bays.
            </p>
          </div>
          <Link href="/rooms" className="inline-flex items-center gap-2 text-sm font-bold text-[#008080] dark:text-[#3FCFC0] hover:underline">
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {DESTINATIONS.map((dest) => (
            <Link
              key={dest.id}
              href={`/rooms?city=${encodeURIComponent(dest.city)}`}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-[#E4E9EA] dark:border-[#20353D]"
            >
              {/* Card Image */}
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#001528]/90 via-[#001528]/40 to-transparent" />

              {/* Top Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-bold uppercase tracking-wider">
                  {dest.badge}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2 z-10">
                <div className="text-xs text-[#5CE1E6] font-semibold">{dest.staysCount}</div>
                <h3 className="font-display text-2xl font-bold group-hover:text-[#FDA301] transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed">
                  {dest.tagline}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-white group-hover:translate-x-2 transition-transform">
                  <span>Explore Listings</span>
                  <ArrowRight className="w-4 h-4 text-[#FDA301]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ 3. FEATURED HOTELS SHOWCASE ══ */}
      <section className="bg-white dark:bg-[#0F252E] border-y border-[#E4E9EA] dark:border-[#20353D] py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#003366] dark:text-[#3FCFC0] mb-2">
                <Hotel className="w-4 h-4" />
                <span>Verified Accommodations</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
                Featured Boutique Hotels & Stays
              </h2>
              <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-1 max-w-xl">
                Handpicked, SLTDA-certified luxury villas, heritage hotels, and eco-lodges across Sri Lanka.
              </p>
            </div>
            
            <Link href="/rooms">
              <Button variant="secondary" size="md" className="rounded-2xl gap-2 font-bold shrink-0">
                <span>View More Hotels & Rooms</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Hotel Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_HOTELS.map((hotel) => (
              <div
                key={hotel.id}
                className="rounded-3xl bg-[#F4F6F8] dark:bg-[#081419] border border-[#E4E9EA] dark:border-[#20353D] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={hotel.coverImageUrl}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      {hotel.verificationStatus === "VERIFIED" && <Badge variant="sltda" />}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#FDA301] fill-[#FDA301]" />
                      <span>{hotel.averageRating}</span>
                      <span className="text-gray-300 font-normal">({hotel.reviewCount})</span>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-[#008080] dark:text-[#3FCFC0] font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{CITY_LABELS[hotel.city] ?? hotel.city}, {REGION_LABELS[hotel.region] ?? hotel.region}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#0E1B22] dark:text-[#EAF2F4] group-hover:text-[#008080] transition-colors">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] line-clamp-2 leading-relaxed">
                      {hotel.description}
                    </p>
                  </div>
                </div>

                {/* Footer Price & Action */}
                <div className="p-6 pt-0 flex items-center justify-between border-t border-[#E4E9EA] dark:border-[#20353D]/50 mt-4 pt-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#4A5A62] dark:text-[#A9BCC2] block">From</span>
                    <span className="text-xl font-extrabold text-[#003366] dark:text-[#3FCFC0]">${hotel.priceStartFrom}</span>
                    <span className="text-xs text-gray-500"> / night</span>
                  </div>
                  <Link href={`/rooms?city=${encodeURIComponent(hotel.city)}`}>
                    <Button variant="primary" size="sm" className="rounded-xl font-bold gap-1">
                      <span>View Details</span>
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button Centered */}
          <div className="text-center pt-4">
            <Link href="/rooms">
              <Button size="lg" variant="primary" className="rounded-full px-8 py-4 text-base font-bold shadow-lg gap-2">
                <Hotel className="w-5 h-5" />
                <span>View More Hotels & Rooms</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ══ 4. FEATURED TOUR PACKAGES SHOWCASE ══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FDA301] mb-2">
              <Compass className="w-4 h-4" />
              <span>Curated Expeditions</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
              Popular Island Tour Packages
            </h2>
            <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-1 max-w-xl">
              Multi-day heritage circuits, Knuckles mountain treks, and Yala wildlife safaris managed by verified providers.
            </p>
          </div>

          <Link href="/tours">
            <Button variant="secondary" size="md" className="rounded-2xl gap-2 font-bold shrink-0">
              <span>View More Tour Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Tour Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_TOURS.map((tour) => (
            <div
              key={tour.id}
              className="rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={tour.imageUrls[0]}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-[#001F3D]/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#5CE1E6]" />
                      {tour.durationLabel}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#5CE1E6]" />
                    <span>{CITY_LABELS[tour.city] ?? tour.city}</span>
                  </div>
                </div>

                {/* Tour Info */}
                <div className="p-6 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-[#008080] dark:text-[#3FCFC0] block">
                    By {tour.hotelName}
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#0E1B22] dark:text-[#EAF2F4] group-hover:text-[#008080] transition-colors">
                    {tour.title}
                  </h3>
                  <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] line-clamp-2 leading-relaxed">
                    {tour.description}
                  </p>

                  {/* Highlights/Inclusions pills */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {tour.inclusions.slice(0, 2).map((inc) => (
                      <span key={inc.id} className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2]">
                        {inc.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-6 pt-0 flex items-center justify-between border-t border-[#E4E9EA] dark:border-[#20353D]/50 mt-4 pt-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#4A5A62] dark:text-[#A9BCC2] block">Package Price</span>
                  <span className="text-xl font-extrabold text-[#008080] dark:text-[#3FCFC0]">${tour.price}</span>
                  <span className="text-xs text-gray-500"> {tour.currency} / person</span>
                </div>
                <Link href="/tours">
                  <Button variant="secondary" size="sm" className="rounded-xl font-bold gap-1">
                    <span>View Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button Centered */}
        <div className="text-center pt-4">
          <Link href="/tours">
            <Button size="lg" variant="secondary" className="rounded-full px-8 py-4 text-base font-bold shadow-lg gap-2">
              <Compass className="w-5 h-5 text-[#5CE1E6]" />
              <span>View More Tour Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

      </section>

      {/* ══ 5. HANDPICKED CATEGORIES ══ */}
      <section className="bg-white dark:bg-[#0F252E] border-y border-[#E4E9EA] dark:border-[#20353D] py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FDA301]">
              <Sparkles className="w-4 h-4" />
              <span>Tailored Island Experiences</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
              Crafted for Mindful Travelers
            </h2>
            <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2]">
              Choose how you want to experience Sri Lanka — from luxury staycations to private guided expeditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CATEGORY_COLLECTIONS.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl bg-[#F4F6F8] dark:bg-[#081419] p-8 border border-[#E4E9EA] dark:border-[#20353D] flex flex-col justify-between space-y-6 hover:border-[#008080] dark:hover:border-[#3FCFC0] transition-all shadow-sm hover:shadow-md"
                >
                  <div className="space-y-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
                      {cat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <Link href={cat.link}>
                    <Button variant="primary" size="md" className="w-full rounded-2xl gap-2 font-bold justify-between">
                      <span>{cat.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══ 6. WHY BLUE CEYLON (PLATFORM TRUST) ══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#008080] dark:text-[#3FCFC0]">
            <ShieldCheck className="w-4 h-4" />
            <span>The Blue Ceylon Standard</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
            Why Book with Blue Ceylon?
          </h2>
          <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2]">
            We bridge the gap between discerning international travelers and accredited Sri Lankan hospitality providers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLATFORM_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl ${feat.bgColor} ${feat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4]">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ 7. TRAVELER TESTIMONIALS ══ */}
      <section className="bg-[#001F3D] text-white py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5CE1E6]">
              <Star className="w-4 h-4 text-[#FDA301] fill-[#FDA301]" />
              <span>Verified Guest Reviews</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Loved by Travelers Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex gap-1 text-[#FDA301]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-200 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/15">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#5CE1E6]"
                  />
                  <div>
                    <div className="font-bold text-sm text-white">{t.name}</div>
                    <div className="text-xs text-[#5CE1E6]">{t.country} • <span className="text-gray-300">{t.stay}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══ 8. PROVIDER REGISTRATION CTA BANNER ══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#003366] via-[#005F73] to-[#008080] text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-[#5CE1E6]">
              <Building2 className="w-4 h-4 text-[#FDA301]" />
              <span>For Hotel Owners, Agencies & Private Guides</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Grow Your Tourism Business with Blue Ceylon
            </h2>
            <p className="text-sm text-gray-200 leading-relaxed">
              Register your hotel, tour agency, or licensed tour guide profile today. Connect directly with global travelers and enjoy zero commission surcharges.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 relative z-10 shrink-0">
            <Link href="/register/hotel">
              <Button size="lg" className="w-full sm:w-auto rounded-2xl font-bold bg-[#FDA301] hover:bg-[#E59300] text-black gap-2">
                <Hotel className="w-4 h-4" />
                <span>Register Hotel</span>
              </Button>
            </Link>

            <Link href="/register/tour-guide">
              <Button size="lg" className="w-full sm:w-auto rounded-2xl font-bold bg-white text-[#003366] hover:bg-gray-100 gap-2">
                <User className="w-4 h-4" />
                <span>Register Guide</span>
              </Button>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

function Building2({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H7m4 0V7m0 0h4m-4 0H7" />
    </svg>
  );
}
