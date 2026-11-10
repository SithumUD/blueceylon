"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  User,
  ShieldCheck,
  Star,
  Languages,
  Car,
  MapPin,
  ArrowRight,
  Check,
  CheckCircle2,
  Users,
  Award,
  Search,
  Filter,
  Sparkles,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GUIDE_SPECIALTY_LABELS, LICENSE_TYPE_LABELS } from "@/lib/mock-data/guides";
import { VEHICLE_TYPE_LABELS, CITY_LABELS } from "@/lib/mock-data/businesses";
import { searchBusinesses } from "@/lib/api/catalog";

export default function TourGuidesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-8 text-center text-sm text-[#4A5A62]">
          Loading certified tour guides...
        </div>
      }
    >
      <TourGuidesPageContent />
    </Suspense>
  );
}

function TourGuidesPageContent() {
  const searchParams = useSearchParams();
  const queryCity = searchParams.get("city")?.toUpperCase() || "ALL";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState(queryCity);
  const [selectedLanguage, setSelectedLanguage] = useState("ALL");
  const [selectedVehicle, setSelectedVehicle] = useState("ALL");
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    let isMounted = true;
    async function loadGuides() {
      setLoading(true);
      try {
        const res = await searchBusinesses({
          type: "TOUR_GUIDE",
          city: selectedCity !== "ALL" ? selectedCity : undefined,
        });
        if (isMounted && res?.content && Array.isArray(res.content)) {
          setGuides(res.content);
        } else if (isMounted) {
          setGuides([]);
        }
      } catch (err) {
        console.error("Failed to fetch tour guides:", err);
        if (isMounted) {
          setGuides([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadGuides();
    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  // Client-side filtering for language, vehicle, and search text
  const filteredGuides = guides.filter((g) => {
    if (
      selectedLanguage !== "ALL" &&
      g.languagesSpoken &&
      !g.languagesSpoken.some((l: string) => l.toLowerCase() === selectedLanguage.toLowerCase())
    ) {
      return false;
    }
    if (selectedVehicle !== "ALL" && g.vehicleType !== selectedVehicle) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = g.name?.toLowerCase().includes(q);
      const matchTagline = g.tagline?.toLowerCase().includes(q);
      const matchBio = g.description?.toLowerCase().includes(q);
      const matchLicense = g.sltdaLicenseNumber?.toLowerCase().includes(q);
      const matchSpecialty = g.specialtyAreas?.some((s: string) => s.toLowerCase().includes(q));
      if (!matchName && !matchTagline && !matchBio && !matchLicense && !matchSpecialty) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="bg-[#F4F6F8] dark:bg-[#081419] min-h-screen pb-16">
      {/* ══ HEADER ══ */}
      <div className="bg-white dark:bg-[#0F252E] border-b border-[#E4E9EA] dark:border-[#20353D] pt-8 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#008080] dark:text-[#3FCFC0] mb-2">
              <User className="w-4 h-4" />
              <span>Verified Tourism Professionals</span>
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Licensed Private Tour Guides
            </h1>
            <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-2 max-w-2xl leading-relaxed">
              Connect with SLTDA-certified national guides, local site experts, and private chauffeur drivers with verified credentials and guest reviews.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#F4F6F8] dark:bg-[#15323D] px-4 py-3 rounded-2xl border border-[#E4E9EA] dark:border-[#20353D] shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#008080] dark:text-[#3FCFC0]" />
            <div className="text-xs">
              <span className="font-bold text-[#0E1B22] dark:text-white block">100% SLTDA Licensed</span>
              <span className="text-[#4A5A62] dark:text-[#A9BCC2]">Background verified & certified</span>
            </div>
          </div>
        </div>

        {/* ══ SEARCH & FILTER BAR ══ */}
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-[#E4E9EA] dark:border-[#20353D] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guide name, specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:ring-2 focus:ring-[#008080] outline-none"
            />
          </div>

          {/* City / Region */}
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:ring-2 focus:ring-[#008080] outline-none cursor-pointer"
            >
              <option value="ALL">📍 All Sri Lanka</option>
              <option value="COLOMBO">Colombo (Capital)</option>
              <option value="KANDY">Kandy (Central Highlands)</option>
              <option value="GALLE">Galle (South Coast)</option>
              <option value="ELLA">Ella (Hill Country)</option>
              <option value="SIGIRIYA">Sigiriya (Cultural Triangle)</option>
              <option value="MIRISSA">Mirissa (South Coast)</option>
              <option value="NUWARA_ELIYA">Nuwara Eliya (Tea Country)</option>
              <option value="ANURADHAPURA">Anuradhapura (Ancient Kingdom)</option>
              <option value="TRINCOMALEE">Trincomalee (East Coast)</option>
              <option value="JAFFNA">Jaffna (Northern Peninsula)</option>
            </select>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:ring-2 focus:ring-[#008080] outline-none cursor-pointer"
            >
              <option value="ALL">🌐 All Languages</option>
              <option value="English">English</option>
              <option value="German">German (Deutsch)</option>
              <option value="French">French (Français)</option>
              <option value="Sinhala">Sinhala</option>
              <option value="Tamil">Tamil</option>
              <option value="Russian">Russian</option>
              <option value="Italian">Italian</option>
              <option value="Chinese">Chinese (Mandarin)</option>
            </select>
          </div>

          {/* Vehicle Type Selector */}
          <div className="relative">
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:ring-2 focus:ring-[#008080] outline-none cursor-pointer"
            >
              <option value="ALL">🚘 Any Vehicle / Transport</option>
              <option value="SUV">SUV (e.g. 4x4 Prado)</option>
              <option value="VAN">Van (e.g. KDH Luxury)</option>
              <option value="SEDAN">Sedan / Hybrid Car</option>
              <option value="TUK_TUK">Tuk-Tuk</option>
              <option value="NONE">Walking / Client Vehicle</option>
            </select>
          </div>
        </div>
      </div>

      {/* ══ CONTENT GRID ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[#4A5A62] dark:text-[#A9BCC2]">
            Showing <span className="text-[#0E1B22] dark:text-white font-extrabold">{filteredGuides.length}</span> licensed guides
          </p>
        </div>

        {loading ? (
          <div className="p-16 text-center bg-white dark:bg-[#0F252E] rounded-3xl border border-[#E4E9EA] dark:border-[#20353D]">
            <div className="w-8 h-8 border-4 border-[#008080] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-[#4A5A62] dark:text-[#A9BCC2]">
              Loading verified tour guides from catalog...
            </p>
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="p-16 text-center bg-white dark:bg-[#0F252E] rounded-3xl border border-[#E4E9EA] dark:border-[#20353D]">
            <User className="w-12 h-12 text-[#9AAAB0] mx-auto mb-3" />
            <h3
              className="text-lg font-bold text-[#0E1B22] dark:text-[#EAF2F4] mb-1"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              No Tour Guides Found
            </h3>
            <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] max-w-sm mx-auto">
              No tour guides matched your search criteria. Try clearing search keywords or selecting "All Sri Lanka".
            </p>
            <Button
              variant="ghost"
              className="mt-4 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] text-xs font-bold"
              onClick={() => {
                setSearchTerm("");
                setSelectedCity("ALL");
                setSelectedLanguage("ALL");
                setSelectedVehicle("ALL");
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGuides.map((guide) => {
              const photoUrl =
                guide.coverImageUrl ||
                guide.avatarUrl ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d";

              const formattedLicenseType =
                LICENSE_TYPE_LABELS[guide.licenseType as keyof typeof LICENSE_TYPE_LABELS] ??
                (guide.licenseType ? String(guide.licenseType).replace(/_/g, " ") : "National Tourist Guide");

              const cityName = CITY_LABELS[guide.city as keyof typeof CITY_LABELS] ?? guide.city ?? "Sri Lanka";

              const hasVehicle = guide.vehicleType && guide.vehicleType !== "NONE";

              return (
                <div
                  key={guide.id}
                  className="group bg-white dark:bg-[#0F252E] rounded-[1.75rem] border border-[#E4E9EA] dark:border-[#20353D] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  {/* Card Header & Bio */}
                  <div className="p-6 space-y-5">
                    {/* Top Identity Row */}
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={photoUrl}
                          alt={guide.name}
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-[#FDA301] shadow-md group-hover:scale-105 transition-transform"
                        />
                        <div
                          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0F252E] flex items-center justify-center text-white"
                          title="Verified Active Guide"
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="sltda" />
                          <div className="flex items-center gap-1 text-xs font-bold text-[#FDA301] bg-[#FDA301]/10 px-2 py-0.5 rounded-md">
                            <Star className="w-3.5 h-3.5 fill-[#FDA301]" />
                            <span>{guide.averageRating ? Number(guide.averageRating).toFixed(1) : "5.0"}</span>
                            <span className="text-[10px] text-gray-500 font-normal">
                              ({guide.reviewCount ?? 0} reviews)
                            </span>
                          </div>
                        </div>

                        <h3
                          className="text-xl font-bold text-[#0E1B22] dark:text-[#EAF2F4] truncate group-hover:text-[#008080] dark:group-hover:text-[#3FCFC0] transition-colors"
                          style={{ fontFamily: "'Fraunces', serif" }}
                        >
                          {guide.name}
                        </h3>

                        {guide.tagline && (
                          <p className="text-xs text-[#008080] dark:text-[#3FCFC0] font-semibold line-clamp-1">
                            {guide.tagline}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-[11px] text-[#4A5A62] dark:text-[#A9BCC2] flex-wrap">
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="w-3 h-3 text-[#FDA301]" />
                            {cityName}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-gray-400">
                            {guide.sltdaLicenseNumber || guide.licenseNumber || "SLTDA Licensed"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bio Description */}
                    {guide.description && (
                      <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] line-clamp-3 leading-relaxed">
                        {guide.description}
                      </p>
                    )}

                    {/* Feature Badges: Experience, Group Size, License */}
                    <div className="flex flex-wrap gap-1.5">
                      {guide.yearsOfExperience && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#003366]/5 dark:bg-[#003366]/30 text-[#003366] dark:text-[#3FCFC0] px-2.5 py-1 rounded-lg border border-[#003366]/10">
                          <Award className="w-3 h-3 text-[#FDA301]" />
                          {guide.yearsOfExperience}+ Years Experience
                        </span>
                      )}

                      {guide.maxGroupSizeGuided && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-gray-100 dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2] px-2.5 py-1 rounded-lg">
                          <Users className="w-3 h-3 text-[#008080]" />
                          Up to {guide.maxGroupSizeGuided} Guests
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-gray-100 dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2] px-2.5 py-1 rounded-lg">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {formattedLicenseType}
                      </span>
                    </div>

                    {/* Languages & Transport Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-[#15323D] border border-[#E4E9EA] dark:border-[#20353D] text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">
                          Languages Spoken
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {guide.languagesSpoken && guide.languagesSpoken.length > 0 ? (
                            guide.languagesSpoken.map((lang: string, idx: number) => (
                              <span
                                key={idx}
                                className="bg-white dark:bg-[#0F252E] px-2 py-0.5 rounded-md font-semibold text-[#0E1B22] dark:text-[#EAF2F4] border border-[#E4E9EA] dark:border-[#20353D] text-[11px]"
                              >
                                🌐 {lang}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400">English</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">
                          Transport Provided
                        </span>
                        <span className="font-semibold text-[#003366] dark:text-[#3FCFC0] block leading-snug">
                          {hasVehicle ? (
                            <>
                              🚘 {VEHICLE_TYPE_LABELS[guide.vehicleType as keyof typeof VEHICLE_TYPE_LABELS] ?? guide.vehicleType}
                              {guide.vehicleModel ? ` (${guide.vehicleModel})` : ""}
                              {guide.vehicleAirConditioned ? " • A/C Included" : ""}
                            </>
                          ) : (
                            "🚶 Walking Tours / Guest Vehicle"
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Specialty Areas */}
                    {guide.specialtyAreas && guide.specialtyAreas.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-gray-400">
                          Specialty Guidance
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {guide.specialtyAreas.slice(0, 4).map((spec: string) => (
                            <span
                              key={spec}
                              className="text-[10px] font-semibold bg-white dark:bg-[#0F252E] text-[#0E1B22] dark:text-[#EAF2F4] px-2.5 py-1 rounded-md border border-[#E4E9EA] dark:border-[#20353D] flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3 text-[#008080]" />
                              {GUIDE_SPECIALTY_LABELS[spec as keyof typeof GUIDE_SPECIALTY_LABELS] ?? spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer — Rates & Booking CTA */}
                  <div className="p-6 pt-4 border-t border-[#E4E9EA] dark:border-[#20353D] flex items-center justify-between bg-gray-50/50 dark:bg-[#0B1E26]">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-[#003366] dark:text-[#3FCFC0]">
                          ${guide.dailyRate ?? 80}
                        </span>
                        <span className="text-xs text-gray-400">
                          {guide.currency || "USD"} / full day
                        </span>
                      </div>
                      {guide.halfDayRate && (
                        <span className="text-[10px] text-gray-400 block">
                          Half-day: ${guide.halfDayRate} {guide.currency || "USD"}
                        </span>
                      )}
                    </div>

                    <Link href={`/tour-guides/${guide.id}`}>
                      <Button
                        variant="gold"
                        size="md"
                        className="rounded-xl px-4 py-2 font-bold shadow-md hover:shadow-lg transition-all"
                      >
                        <span>View Guide Profile</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
