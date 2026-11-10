"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sun,
  Moon,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  CheckCircle2,
  Hotel,
  Search,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CITY_LABELS } from "@/lib/mock-data/businesses";
import { getAllDayOutPackages, getAllNightOutPackages } from "@/lib/api/catalog";

export default function ExtraPackagesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-8 text-center text-sm text-[#4A5A62]">
          Loading extra packages...
        </div>
      }
    >
      <ExtraPackagesPageContent />
    </Suspense>
  );
}

function ExtraPackagesPageContent() {
  const searchParams = useSearchParams();
  const queryCity = searchParams.get("city")?.toUpperCase() || "ALL";

  const [packageType, setPackageType] = useState<"ALL" | "DAYOUT" | "NIGHTOUT">("ALL");
  const [selectedCity, setSelectedCity] = useState(queryCity);
  const [searchTerm, setSearchTerm] = useState("");
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadPackages() {
      setLoading(true);
      try {
        const [dayOuts, nightOuts] = await Promise.all([
          getAllDayOutPackages().catch(() => []),
          getAllNightOutPackages().catch(() => []),
        ]);

        if (isMounted) {
          const formattedDayOuts = (dayOuts || []).map((p: any) => ({
            ...p,
            type: "DAYOUT" as const,
            hotelName: p.hotelName || "Luxury Partner Resort",
            hotelId: p.hotelId,
            city: p.hotelCity || "SRI_LANKA",
            sltdaVerified: p.sltdaVerified ?? true,
            coverImage:
              p.imageUrls?.[0] ||
              p.hotelCoverImage ||
              "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
          }));

          const formattedNightOuts = (nightOuts || []).map((p: any) => ({
            ...p,
            type: "NIGHTOUT" as const,
            hotelName: p.hotelName || "Luxury Partner Resort",
            hotelId: p.hotelId,
            city: p.hotelCity || "SRI_LANKA",
            sltdaVerified: p.sltdaVerified ?? true,
            coverImage:
              p.imageUrls?.[0] ||
              p.hotelCoverImage ||
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
          }));

          setPackages([...formattedDayOuts, ...formattedNightOuts]);
        }
      } catch (err) {
        console.error("Failed to load extra packages:", err);
        if (isMounted) {
          setPackages([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadPackages();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPackages = packages.filter((pkg) => {
    if (packageType !== "ALL" && pkg.type !== packageType) return false;
    if (selectedCity !== "ALL" && pkg.city !== selectedCity) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = pkg.title?.toLowerCase().includes(q);
      const matchDesc = pkg.description?.toLowerCase().includes(q);
      const matchHotel = pkg.hotelName?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchHotel) return false;
    }
    return true;
  });

  return (
    <div className="bg-[#F4F6F8] dark:bg-[#081419] min-h-screen pb-16">
      {/* ══ HEADER ══ */}
      <div className="bg-white dark:bg-[#0F252E] border-b border-[#E4E9EA] dark:border-[#20353D] pt-8 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FDA301] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Short-Stay Hotel Experiences</span>
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Day Out Passes & Evening Dining
            </h1>
            <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-2 max-w-2xl leading-relaxed">
              Experience luxury resorts without staying overnight. Book full-day pool & lunch passes (09:00–18:00) or romantic moonlight seafood BBQ dinners (18:30–23:00).
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#F4F6F8] dark:bg-[#15323D] px-4 py-3 rounded-2xl border border-[#E4E9EA] dark:border-[#20353D] shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#008080] dark:text-[#3FCFC0]" />
            <div className="text-xs">
              <span className="font-bold text-[#0E1B22] dark:text-white block">Verified Hotel Hosts</span>
              <span className="text-[#4A5A62] dark:text-[#A9BCC2]">Direct guaranteed reservations</span>
            </div>
          </div>
        </div>

        {/* ══ FILTER CONTROLS ══ */}
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-[#E4E9EA] dark:border-[#20353D] flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Type Switcher Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full md:w-auto no-scrollbar">
            {[
              { id: "ALL", label: "All Experiences", icon: Sparkles },
              { id: "DAYOUT", label: "☀️ Day Out Passes", icon: Sun },
              { id: "NIGHTOUT", label: "🌙 Evening Dining", icon: Moon },
            ].map((tab) => {
              const active = packageType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setPackageType(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                    active
                      ? "bg-[#003366] text-white border-[#003366] shadow-sm dark:bg-[#008080] dark:border-[#008080]"
                      : "bg-white dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2] border-[#E4E9EA] dark:border-[#20353D] hover:bg-gray-50 dark:hover:bg-[#1D404C]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* City Selector & Search */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] outline-none"
              />
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="p-2 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] outline-none cursor-pointer shrink-0"
            >
              <option value="ALL">📍 All Sri Lanka</option>
              <option value="GALLE">Galle</option>
              <option value="COLOMBO">Colombo</option>
              <option value="KANDY">Kandy</option>
              <option value="ELLA">Ella</option>
              <option value="SIGIRIYA">Sigiriya</option>
              <option value="MIRISSA">Mirissa</option>
              <option value="NUWARA_ELIYA">Nuwara Eliya</option>
            </select>
          </div>
        </div>
      </div>

      {/* ══ RESULTS GRID ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[#4A5A62] dark:text-[#A9BCC2]">
            Showing <span className="text-[#0E1B22] dark:text-white font-extrabold">{filteredPackages.length}</span> luxury experiences
          </p>
        </div>

        {loading ? (
          <div className="p-16 text-center bg-white dark:bg-[#0F252E] rounded-3xl border border-[#E4E9EA] dark:border-[#20353D]">
            <div className="w-8 h-8 border-4 border-[#008080] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-[#4A5A62] dark:text-[#A9BCC2]">
              Loading day out and night out packages...
            </p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="p-16 text-center bg-white dark:bg-[#0F252E] rounded-3xl border border-[#E4E9EA] dark:border-[#20353D]">
            <Sparkles className="w-12 h-12 text-[#9AAAB0] mx-auto mb-3" />
            <h3
              className="text-lg font-bold text-[#0E1B22] dark:text-[#EAF2F4] mb-1"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              No Extra Packages Found
            </h3>
            <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] max-w-sm mx-auto">
              No packages matching your current filter criteria were found. Try selecting "All Sri Lanka" or clearing search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPackages.map((pkg) => {
              const isDayOut = pkg.type === "DAYOUT";
              const cityName =
                CITY_LABELS[pkg.city as keyof typeof CITY_LABELS] ??
                (pkg.city ? String(pkg.city).replace(/_/g, " ") : "Sri Lanka");

              return (
                <div
                  key={pkg.id}
                  className="group bg-white dark:bg-[#0F252E] rounded-[1.75rem] border border-[#E4E9EA] dark:border-[#20353D] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  {/* Media Header */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={pkg.coverImage}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                    {/* Top Left Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      {pkg.sltdaVerified && <Badge variant="sltda" />}
                      <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FDA301]" />
                        {cityName}
                      </span>
                    </div>

                    {/* Top Right Package Type & Timing */}
                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#0E1B22] dark:text-white flex items-center gap-1.5 shadow-sm">
                      {isDayOut ? (
                        <>
                          <Sun className="w-3.5 h-3.5 text-[#FDA301]" />
                          <span>Day Pass ({pkg.startTime || "09:00"} – {pkg.endTime || "18:00"})</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-3.5 h-3.5 text-[#3FCFC0]" />
                          <span>Evening ({pkg.startTime || "18:30"} – {pkg.endTime || "23:00"})</span>
                        </>
                      )}
                    </div>

                    {/* Bottom Hotel Overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/95 dark:bg-[#0F252E]/95 backdrop-blur-md text-[#0E1B22] dark:text-white shadow-md border border-white/20">
                        <Hotel className="w-3.5 h-3.5 text-[#003366] dark:text-[#3FCFC0]" />
                        <span className="truncate max-w-[220px]">{pkg.hotelName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3
                        className="text-xl font-bold text-[#0E1B22] dark:text-[#EAF2F4] line-clamp-1 group-hover:text-[#008080] dark:group-hover:text-[#3FCFC0] transition-colors"
                        style={{ fontFamily: "'Fraunces', serif" }}
                      >
                        {pkg.title}
                      </h3>

                      <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] line-clamp-2 leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* Inclusions */}
                      {pkg.inclusions && pkg.inclusions.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {pkg.inclusions.slice(0, 3).map((inc: any) => (
                            <span
                              key={inc.id || inc.label || inc.code}
                              className="text-[10px] font-semibold bg-gray-50 dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2] px-2.5 py-1 rounded-md flex items-center gap-1 border border-[#E4E9EA] dark:border-[#20353D]"
                            >
                              <CheckCircle2 className="w-3 h-3 text-[#008080]" />
                              {inc.label || inc.name || inc.code}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Pricing & CTA */}
                    <div className="pt-4 border-t border-[#E4E9EA] dark:border-[#20353D] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#9AAAB0] font-semibold uppercase block">Package Rate</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-[#003366] dark:text-[#3FCFC0]">
                            ${pkg.price}
                          </span>
                          <span className="text-xs text-[#9AAAB0]">
                            {pkg.currency || "USD"} / {pkg.pricingUnit ? String(pkg.pricingUnit).replace("PER_", "").toLowerCase() : "person"}
                          </span>
                        </div>
                      </div>

                      <Link href={`/extra-packages/${pkg.id}`}>
                        <Button
                          size="md"
                          className="rounded-xl px-4 font-bold shadow-md hover:shadow-lg transition-all"
                          style={{
                            background: isDayOut ? "#FDA301" : "#008080",
                            color: isDayOut ? "#0E1B22" : "white",
                          }}
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
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
  );
}
