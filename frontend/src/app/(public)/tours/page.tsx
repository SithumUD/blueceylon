"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Compass, Filter, MapPin, Check, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_BUSINESSES, CITY_LABELS } from "@/lib/mock-data/businesses";
import { MOCK_GUIDES, GUIDE_SPECIALTY_LABELS } from "@/lib/mock-data/guides";
import { VEHICLE_TYPE_LABELS } from "@/lib/mock-data/businesses";
import { searchTours } from "@/lib/api/catalog";

export default function ToursPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-8 text-center text-sm text-[#4A5A62]">Loading tours...</div>}>
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
    difficultyLevel: "ALL",
    transportModeIncluded: "ALL",
    mealsIncluded: "ALL",
    durationDays: "",
    isPrivateTour: false,
    accommodationIncluded: false,
    maxPrice: 2000,
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
          maxPrice: filters.maxPrice,
        });
        if (isMounted && res?.content && res.content.length > 0) {
          setAllTours(res.content);
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to local mock data
      }

      const hotelTours = MOCK_BUSINESSES.flatMap((b) =>
        (b.tourPackages || []).map((tp) => ({
          id: tp.id,
          title: tp.title,
          description: tp.description,
          durationLabel: tp.durationLabel,
          durationDays: tp.durationDays,
          price: tp.price,
          currency: tp.currency,
          pricingUnit: "PER_PERSON" as const,
          inclusions: tp.inclusions,
          transportModeIncluded: tp.transportModeIncluded,
          coverImageUrl: tp.imageUrls[0],
          providerName: b.name,
          providerId: b.id,
          providerType: "HOTEL",
          location: b.city,
          sltdaVerified: b.verificationStatus === "VERIFIED",
        }))
      );

      const guideTours = MOCK_GUIDES.map((g) => ({
        id: `g-tour-${g.id}`,
        title: `${g.name} — Private Excursion & Wildlife Tour`,
        description: g.description,
        durationLabel: "Full Day (8 Hours)",
        durationDays: 1,
        price: g.dailyRate,
        currency: g.currency,
        pricingUnit: "PER_PERSON" as const,
        inclusions: g.specialtyAreas.map((sa, i) => ({ id: `sa-${i}`, name: GUIDE_SPECIALTY_LABELS[sa] })),
        transportModeIncluded: g.vehicleType,
        coverImageUrl: g.coverImageUrl,
        providerName: g.name,
        providerId: g.id,
        providerType: "GUIDE",
        location: g.city,
        sltdaVerified: g.verificationStatus === "VERIFIED",
      }));

      const mockCombined = [...hotelTours, ...guideTours].filter((t) => {
        if (filters.city !== "ALL" && t.location !== filters.city) return false;
        if (t.price > filters.maxPrice) return false;
        return true;
      });

      if (isMounted) {
        setAllTours(mockCombined);
        setLoading(false);
      }
    }
    loadTours();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  return (
    <div className="bg-[#F4F6F8] dark:bg-[#081419] min-h-screen pb-16">
      {/* ══ HEADER ══ */}
      <div className="bg-white dark:bg-[#0F252E] border-b border-[#E4E9EA] dark:border-[#20353D] pt-8 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#008080] dark:text-[#3FCFC0] mb-2">
              <Compass className="w-4 h-4" />
              <span>Excursions & Safaris</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>
              Explore Curated Tours
            </h1>
            <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-2 max-w-xl leading-relaxed">
              Discover thrilling safaris, cultural treks, and beach excursions led by certified guides and trusted hotel partners.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* ══ LEFT PANEL — Filters ══ */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
          <div className="bg-white dark:bg-[#0F252E] rounded-3xl p-6 border border-[#E4E9EA] dark:border-[#20353D] shadow-sm sticky top-24">
            <div className="flex items-center gap-2 font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4] mb-6 pb-4 border-b border-[#E4E9EA] dark:border-[#20353D]" style={{ fontFamily: "'Fraunces', serif" }}>
              <Filter className="w-5 h-5 text-[#008080] dark:text-[#3FCFC0]" />
              Filter Tours
            </div>

            <div className="space-y-6">
              {/* Tour Category */}
              <div className="space-y-3">
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
                  <input type="number" min="10" placeholder="2000" value={filters.maxPrice} onChange={(e) => handleFilterChange("maxPrice", Number(e.target.value))} className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm text-[#0E1B22] dark:text-[#EAF2F4] outline-none" />
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

              <Button variant="ghost" className="w-full rounded-xl mt-4 font-bold border border-[#E4E9EA] dark:border-[#20353D]" onClick={() => setFilters({city: "ALL", category: "ALL", difficultyLevel: "ALL", transportModeIncluded: "ALL", mealsIncluded: "ALL", durationDays: "", isPrivateTour: false, accommodationIncluded: false, maxPrice: 2000})}>
                Reset Filters
              </Button>
            </div>
          </div>
        </aside>

        {/* ══ RIGHT PANEL — Results ══ */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-[#4A5A62] dark:text-[#A9BCC2]">
              Showing <span className="text-[#0E1B22] dark:text-white">{allTours.length}</span> curated tours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {allTours.map((tour) => (
              <div key={tour.id} className="group bg-white dark:bg-[#0F252E] rounded-[1.5rem] border border-[#E4E9EA] dark:border-[#20353D] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={tour.coverImageUrl || "https://images.unsplash.com/photo-1534177616072-ef7dc120449d"} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#0E1B22] dark:text-white flex items-center gap-1 shadow-sm">
                    <Clock className="w-3 h-3 text-[#008080] dark:text-[#3FCFC0]" /> {tour.durationLabel}
                  </div>
                  {tour.sltdaVerified && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="sltda" />
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${tour.providerType === "HOTEL" ? "bg-[#003366]/10 text-[#003366] dark:text-[#3FCFC0]" : "bg-[#FDA301]/10 text-[#FDA301]"}`}>
                      By {tour.providerName}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0E1B22] dark:text-[#EAF2F4] line-clamp-2 leading-snug" style={{ fontFamily: "'Fraunces', serif" }}>
                    {tour.title}
                  </h3>
                  
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tour.inclusions?.slice(0, 3).map((hl: any) => (
                      <span key={hl.id} className="text-[10px] font-semibold bg-gray-50 dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2] px-2 py-1 rounded-md flex items-center gap-1 border border-[#E4E9EA] dark:border-[#20353D]">
                        <CheckCircle2 className="w-3 h-3 text-[#008080]" /> {hl.name}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-5 border-t border-[#E4E9EA] dark:border-[#20353D] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#9AAAB0] font-semibold uppercase">From</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-[#003366] dark:text-[#3FCFC0]">${tour.price}</span>
                        <span className="text-xs text-[#9AAAB0]"> {tour.currency} / person</span>
                      </div>
                    </div>
                    <Link href={`/tours/${tour.id}`}>
                      <Button size="sm" className="rounded-xl px-4 font-bold shadow-md hover:shadow-lg transition-all" style={{ background: "#008080", color: "white" }}>
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
