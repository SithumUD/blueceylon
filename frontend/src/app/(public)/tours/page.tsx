"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Compass,
  Filter,
  MapPin,
  Check,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Building2,
  Hotel,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CITY_LABELS } from "@/lib/mock-data/businesses";
import { searchTours } from "@/lib/api/catalog";

export default function ToursPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-8 text-center text-sm text-[#4A5A62]">
          Loading tours...
        </div>
      }
    >
      <ToursPageContent />
    </Suspense>
  );
}

function ToursPageContent() {
  const searchParams = useSearchParams();
  const queryCity = searchParams.get("city")?.toUpperCase() || "ALL";

  // Filters state matching backend TourPackageRequest
  const [filters, setFilters] = useState({
    city: queryCity,
    category: "ALL",
    providerType: "ALL",
    difficultyLevel: "ALL",
    transportModeIncluded: "ALL",
    mealsIncluded: "ALL",
    durationDays: "",
    isPrivateTour: false,
    accommodationIncluded: false,
    maxPrice: "",
  });

  const [allTours, setAllTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  React.useEffect(() => {
    let isMounted = true;
    async function loadTours() {
      setLoading(true);
      try {
        const res = await searchTours({
          city: filters.city !== "ALL" ? filters.city : undefined,
          category: filters.category !== "ALL" ? filters.category : undefined,
          providerType: filters.providerType !== "ALL" ? filters.providerType : undefined,
          maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        });
        if (isMounted && res?.content && Array.isArray(res.content)) {
          let filtered = res.content;
          if (filters.providerType !== "ALL") {
            filtered = filtered.filter((t: any) => t.providerType === filters.providerType);
          }
          if (filters.difficultyLevel !== "ALL") {
            filtered = filtered.filter((t: any) => t.difficultyLevel === filters.difficultyLevel);
          }
          if (filters.transportModeIncluded !== "ALL") {
            filtered = filtered.filter((t: any) => t.transportModeIncluded === filters.transportModeIncluded);
          }
          if (filters.mealsIncluded !== "ALL") {
            filtered = filtered.filter((t: any) => t.mealsIncluded === filters.mealsIncluded);
          }
          if (filters.durationDays) {
            filtered = filtered.filter((t: any) => (t.durationDays ?? 1) <= Number(filters.durationDays));
          }
          if (filters.isPrivateTour) {
            filtered = filtered.filter((t: any) => t.isPrivateTour);
          }
          if (filters.accommodationIncluded) {
            filtered = filtered.filter((t: any) => t.accommodationIncluded);
          }
          setAllTours(filtered);
        } else if (isMounted) {
          setAllTours([]);
        }
      } catch {
        if (isMounted) {
          setAllTours([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadTours();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  const providerPills = [
    { id: "ALL", label: "All Experiences", icon: Compass },
    { id: "TOUR_AGENCY", label: "Tour Agencies", icon: Building2 },
    { id: "HOTEL", label: "Hotels & Resorts", icon: Hotel },
    { id: "TOUR_GUIDE", label: "Licensed Tour Guides", icon: UserCheck },
  ];

  return (
    <div className="bg-[#F4F6F8] dark:bg-[#081419] min-h-screen pb-16">
      {/* ══ HEADER ══ */}
      <div className="bg-white dark:bg-[#0F252E] border-b border-[#E4E9EA] dark:border-[#20353D] pt-8 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#008080] dark:text-[#3FCFC0] mb-2">
              <Compass className="w-4 h-4" />
              <span>Sri Lanka Excursions & Safaris</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>
              Explore Curated Tours & Experiences
            </h1>
            <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-2 max-w-2xl leading-relaxed">
              Discover thrilling wildlife safaris, cultural heritage expeditions, and scenic hill country treks led by verified hotels, top tour agencies, and licensed local guides.
            </p>
          </div>

          {/* Quick Stats / Trust */}
          <div className="flex items-center gap-3 bg-[#F4F6F8] dark:bg-[#15323D] px-4 py-3 rounded-2xl border border-[#E4E9EA] dark:border-[#20353D] shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#008080] dark:text-[#3FCFC0]" />
            <div className="text-xs">
              <span className="font-bold text-[#0E1B22] dark:text-white block">SLTDA Certified Operators</span>
              <span className="text-[#4A5A62] dark:text-[#A9BCC2]">Verified authentic experiences</span>
            </div>
          </div>
        </div>

        {/* Quick Operator Filter Pills */}
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-[#E4E9EA] dark:border-[#20353D] flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] mr-2 shrink-0">
            Operator Type:
          </span>
          {providerPills.map((pill) => {
            const Icon = pill.icon;
            const active = filters.providerType === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => handleFilterChange("providerType", pill.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                  active
                    ? "bg-[#003366] text-white border-[#003366] shadow-sm dark:bg-[#008080] dark:border-[#008080]"
                    : "bg-white dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2] border-[#E4E9EA] dark:border-[#20353D] hover:bg-gray-50 dark:hover:bg-[#1D404C]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-[#FDA301] dark:text-[#3FCFC0]" : "text-[#9AAAB0]"}`} />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* ══ LEFT PANEL — Filters ══ */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
          <div className="bg-white dark:bg-[#0F252E] rounded-3xl p-6 border border-[#E4E9EA] dark:border-[#20353D] shadow-sm sticky top-24">
            <div className="flex items-center justify-between font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4] mb-6 pb-4 border-b border-[#E4E9EA] dark:border-[#20353D]" style={{ fontFamily: "'Fraunces', serif" }}>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#008080] dark:text-[#3FCFC0]" />
                Filter Tours
              </div>
            </div>

            <div className="space-y-6">
              {/* Provider / Operator Type */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Provider / Host Type</label>
                <div className="flex flex-col gap-2">
                  {[
                    { id: "ALL", label: "All Providers", icon: Compass },
                    { id: "TOUR_AGENCY", label: "Tour Agencies", icon: Building2 },
                    { id: "HOTEL", label: "Hotels & Resorts", icon: Hotel },
                    { id: "TOUR_GUIDE", label: "Tour Guides", icon: UserCheck },
                  ].map((prov) => {
                    const ProvIcon = prov.icon;
                    const isSelected = filters.providerType === prov.id;
                    return (
                      <label key={prov.id} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="sidebarProviderType"
                          checked={isSelected}
                          onChange={() => handleFilterChange("providerType", prov.id)}
                          className="w-4 h-4 accent-[#008080] cursor-pointer"
                        />
                        <div className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                          isSelected ? "text-[#008080] dark:text-[#3FCFC0] font-bold" : "text-[#0E1B22] dark:text-[#EAF2F4] group-hover:text-[#008080] dark:group-hover:text-[#3FCFC0]"
                        }`}>
                          <ProvIcon className={`w-3.5 h-3.5 ${isSelected ? "text-[#008080] dark:text-[#3FCFC0]" : "text-[#9AAAB0]"}`} />
                          <span>{prov.label}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Tour Category */}
              <div className="space-y-3 pt-3 border-t border-[#E4E9EA] dark:border-[#20353D]">
                <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Tour Category</label>
                <div className="flex flex-col gap-2">
                  {["ALL", "ADVENTURE", "WILDLIFE", "CULTURAL", "BEACH"].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="category" checked={filters.category === cat} onChange={() => handleFilterChange("category", cat)} className="w-4 h-4 accent-[#008080] cursor-pointer" />
                      <span className="text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4] group-hover:text-[#008080] dark:group-hover:text-[#3FCFC0] transition-colors">{cat === "ALL" ? "Any Category" : cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Destination Filter */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Departure / City</label>
                <select value={filters.city} onChange={(e) => handleFilterChange("city", e.target.value)} className="w-full p-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:ring-2 focus:ring-[#008080] outline-none cursor-pointer">
                  <option value="ALL">All Sri Lanka</option>
                  <option value="ELLA">Ella (Hill Country)</option>
                  <option value="GALLE">Galle (South Coast)</option>
                  <option value="SIGIRIYA">Sigiriya (Cultural)</option>
                  <option value="MIRISSA">Mirissa (South Coast)</option>
                  <option value="KANDY">Kandy (Central)</option>
                  <option value="COLOMBO">Colombo (Capital)</option>
                  <option value="NUWARA_ELIYA">Nuwara Eliya (Tea)</option>
                </select>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Difficulty Level</label>
                <select value={filters.difficultyLevel} onChange={(e) => handleFilterChange("difficultyLevel", e.target.value)} className="w-full p-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:ring-2 focus:ring-[#008080] outline-none">
                  <option value="ALL">Any Difficulty</option>
                  <option value="EASY">Easy</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="CHALLENGING">Challenging</option>
                </select>
              </div>

              {/* Transport Included */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Transport Type</label>
                <select value={filters.transportModeIncluded} onChange={(e) => handleFilterChange("transportModeIncluded", e.target.value)} className="w-full p-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:ring-2 focus:ring-[#008080] outline-none">
                  <option value="ALL">Any Transport</option>
                  <option value="SUV">SUV</option>
                  <option value="VAN">Van</option>
                  <option value="COACH">Coach</option>
                  <option value="TUK_TUK">Tuk-Tuk</option>
                  <option value="NONE">Not Included</option>
                </select>
              </div>
              
              {/* Meals Included */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Meal Plan</label>
                <select value={filters.mealsIncluded} onChange={(e) => handleFilterChange("mealsIncluded", e.target.value)} className="w-full p-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:ring-2 focus:ring-[#008080] outline-none">
                  <option value="ALL">Any Meal Plan</option>
                  <option value="NONE">None</option>
                  <option value="BREAKFAST_ONLY">Breakfast Only</option>
                  <option value="HALF_BOARD">Half Board</option>
                  <option value="FULL_BOARD">Full Board</option>
                  <option value="ALL_INCLUSIVE">All Inclusive</option>
                </select>
              </div>

              {/* Duration & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Max Days</label>
                  <input type="number" min="1" placeholder="e.g. 3" value={filters.durationDays} onChange={(e) => handleFilterChange("durationDays", e.target.value)} className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm text-[#0E1B22] dark:text-[#EAF2F4] outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Max Price ($)</label>
                  <input type="number" min="1" placeholder="Any Price" value={filters.maxPrice} onChange={(e) => handleFilterChange("maxPrice", e.target.value)} className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm text-[#0E1B22] dark:text-[#EAF2F4] outline-none" />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-4 border-t border-[#E4E9EA] dark:border-[#20353D]">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={filters.isPrivateTour} onChange={(e) => handleFilterChange("isPrivateTour", e.target.checked)} className="w-4 h-4 rounded text-[#008080] accent-[#008080]" />
                  <span className="text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">Private Tour Only</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={filters.accommodationIncluded} onChange={(e) => handleFilterChange("accommodationIncluded", e.target.checked)} className="w-4 h-4 rounded text-[#008080] accent-[#008080]" />
                  <span className="text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">Includes Overnight Stay</span>
                </label>
              </div>

              <Button
                variant="ghost"
                className="w-full rounded-xl mt-4 font-bold border border-[#E4E9EA] dark:border-[#20353D]"
                onClick={() =>
                  setFilters({
                    city: "ALL",
                    category: "ALL",
                    providerType: "ALL",
                    difficultyLevel: "ALL",
                    transportModeIncluded: "ALL",
                    mealsIncluded: "ALL",
                    durationDays: "",
                    isPrivateTour: false,
                    accommodationIncluded: false,
                    maxPrice: "",
                  })
                }
              >
                Reset All Filters
              </Button>
            </div>
          </div>
        </aside>

        {/* ══ RIGHT PANEL — Results ══ */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-[#4A5A62] dark:text-[#A9BCC2]">
              Showing <span className="text-[#0E1B22] dark:text-white font-extrabold">{allTours.length}</span> curated tour experiences
            </p>
          </div>

          {loading ? (
            <div className="bg-white dark:bg-[#0F252E] rounded-3xl p-12 text-center border border-[#E4E9EA] dark:border-[#20353D]">
              <div className="w-8 h-8 border-4 border-[#008080] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-semibold text-[#4A5A62] dark:text-[#A9BCC2]">Searching tours from verified operators...</p>
            </div>
          ) : allTours.length === 0 ? (
            <div className="bg-white dark:bg-[#0F252E] rounded-3xl p-12 text-center border border-[#E4E9EA] dark:border-[#20353D]">
              <Compass className="w-12 h-12 text-[#9AAAB0] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#0E1B22] dark:text-[#EAF2F4] mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
                No Tour Packages Found
              </h3>
              <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] max-w-sm mx-auto">
                No tour packages matched your current filter criteria. Try selecting all Sri Lanka or resetting your operator filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allTours.map((tour) => {
                const isHotel = tour.providerType === "HOTEL";
                const isAgency = tour.providerType === "TOUR_AGENCY";
                const isGuide = tour.providerType === "TOUR_GUIDE";

                return (
                  <div
                    key={tour.id}
                    className="group bg-white dark:bg-[#0F252E] rounded-[1.5rem] border border-[#E4E9EA] dark:border-[#20353D] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
                  >
                    {/* Media Header */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={tour.coverImageUrl || "https://images.unsplash.com/photo-1534177616072-ef7dc120449d"}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                        {tour.sltdaVerified && <Badge variant="sltda" />}
                        {tour.startingCity && (
                          <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1 shadow-sm">
                            <MapPin className="w-3 h-3 text-[#FDA301]" />
                            {CITY_LABELS[tour.startingCity as keyof typeof CITY_LABELS] ?? tour.startingCity}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 bg-white/95 dark:bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#0E1B22] dark:text-white flex items-center gap-1 shadow-sm">
                        <Clock className="w-3 h-3 text-[#008080] dark:text-[#3FCFC0]" />
                        {tour.durationLabel || `${tour.durationDays ?? 1} Days`}
                      </div>

                      {/* Operator Badge on Image Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/95 dark:bg-[#0F252E]/95 backdrop-blur-md text-[#0E1B22] dark:text-white shadow-md border border-white/20">
                          {isHotel ? (
                            <Hotel className="w-3.5 h-3.5 text-[#003366] dark:text-[#3FCFC0]" />
                          ) : isAgency ? (
                            <Building2 className="w-3.5 h-3.5 text-[#008080] dark:text-[#3FCFC0]" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5 text-[#FDA301]" />
                          )}
                          <span className="truncate max-w-[180px]">
                            {tour.providerName || (isHotel ? "Partner Hotel" : isAgency ? "Tour Agency" : "Certified Guide")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3
                          className="text-lg font-bold text-[#0E1B22] dark:text-[#EAF2F4] line-clamp-2 leading-snug group-hover:text-[#008080] dark:group-hover:text-[#3FCFC0] transition-colors"
                          style={{ fontFamily: "'Fraunces', serif" }}
                        >
                          {tour.title}
                        </h3>

                        <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] line-clamp-2 leading-relaxed">
                          {tour.description}
                        </p>

                        {/* Inclusions */}
                        {tour.inclusions && tour.inclusions.length > 0 && (
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {tour.inclusions.slice(0, 3).map((hl: any) => (
                              <span
                                key={hl.id || hl.name}
                                className="text-[10px] font-semibold bg-gray-50 dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2] px-2 py-1 rounded-md flex items-center gap-1 border border-[#E4E9EA] dark:border-[#20353D]"
                              >
                                <CheckCircle2 className="w-3 h-3 text-[#008080]" />
                                {hl.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer Price & Single Primary Action */}
                      <div className="pt-4 border-t border-[#E4E9EA] dark:border-[#20353D] flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-[#9AAAB0] font-semibold uppercase">From</div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-[#003366] dark:text-[#3FCFC0]">${tour.price}</span>
                            <span className="text-xs text-[#9AAAB0]"> {tour.currency || "USD"} / traveler</span>
                          </div>
                        </div>

                        <Link href={`/tours/${tour.id}`}>
                          <Button
                            size="sm"
                            className="rounded-xl px-4 font-bold shadow-md hover:shadow-lg transition-all"
                            style={{ background: "#008080", color: "white" }}
                          >
                            <span>View Tour</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

