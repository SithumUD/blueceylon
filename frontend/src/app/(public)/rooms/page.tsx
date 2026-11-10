"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Star, MapPin, ShieldCheck, BedDouble, Filter, Users, 
  Hotel as HotelIcon, ArrowRight, LayoutGrid, Layers, Eye, Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CITY_LABELS } from "@/lib/mock-data/businesses";
import { searchRooms } from "@/lib/api/catalog";

export default function RoomsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-8 text-center text-sm text-[#4A5A62]">Loading rooms...</div>}>
      <RoomsPageContent />
    </Suspense>
  );
}

function RoomsPageContent() {
  const searchParams = useSearchParams();
  const queryCity = searchParams.get("city")?.toUpperCase() || "ALL";
  const queryCheckIn = searchParams.get("checkIn") || "";
  const queryCheckOut = searchParams.get("checkOut") || "";
  const queryGuests = searchParams.get("guests") || "";

  const [viewMode, setViewMode] = useState<"PROPERTIES" | "ROOMS">("PROPERTIES");

  // Filters state matching backend RoomRequest
  const [filters, setFilters] = useState({
    city: queryCity,
    checkIn: queryCheckIn,
    checkOut: queryCheckOut,
    roomType: "ALL",
    viewType: "ALL",
    capacity: queryGuests,
    bedCount: "",
    smokingAllowed: false,
    isHourlyBookable: false,
    maxPrice: 1000,
  });

  const [allRooms, setAllRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  React.useEffect(() => {
    let isMounted = true;
    async function loadRooms() {
      setLoading(true);
      try {
        const res = await searchRooms({
          city: filters.city !== "ALL" ? filters.city : undefined,
          maxPrice: filters.maxPrice,
          size: 100,
        });
        if (isMounted && res && Array.isArray(res.content)) {
          let filtered = res.content;
          if (filters.roomType !== "ALL") {
            filtered = filtered.filter((r: any) => r.roomType === filters.roomType);
          }
          if (filters.viewType !== "ALL") {
            filtered = filtered.filter((r: any) => r.viewType === filters.viewType);
          }
          if (filters.capacity) {
            filtered = filtered.filter((r: any) => (r.capacity ?? 0) >= Number(filters.capacity));
          }
          if (filters.bedCount) {
            filtered = filtered.filter((r: any) => (r.bedCount ?? 0) >= Number(filters.bedCount));
          }
          if (filters.smokingAllowed) {
            filtered = filtered.filter((r: any) => r.smokingAllowed);
          }
          if (filters.isHourlyBookable) {
            filtered = filtered.filter((r: any) => r.isHourlyBookable);
          }
          setAllRooms(filtered);
        } else if (isMounted) {
          setAllRooms([]);
        }
      } catch {
        if (isMounted) {
          setAllRooms([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadRooms();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  // Group rooms by hotel for Property-First display (Booking.com model)
  const hotelGroups = useMemo(() => {
    const map = new Map<string, {
      hotelId: string;
      hotelName: string;
      hotelCity: string;
      hotelRating: number;
      hotelCoverImage: string;
      hotelAddress?: string;
      sltdaVerified?: boolean;
      minPrice: number;
      maxPrice: number;
      rooms: any[];
      roomTypes: string[];
    }>();

    allRooms.forEach((r) => {
      const key = r.hotelId || r.hotelName || "unknown";
      if (!map.has(key)) {
        map.set(key, {
          hotelId: r.hotelId,
          hotelName: r.hotelName || "Hotel Property",
          hotelCity: r.hotelCity || r.city,
          hotelRating: r.hotelRating ?? 4.8,
          hotelCoverImage: r.hotelCoverImage || (r.imageUrls && r.imageUrls[0]) || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
          hotelAddress: r.hotelAddress,
          sltdaVerified: r.sltdaVerified,
          minPrice: r.pricePerNight,
          maxPrice: r.pricePerNight,
          rooms: [r],
          roomTypes: [r.roomType || "STANDARD"],
        });
      } else {
        const group = map.get(key)!;
        group.rooms.push(r);
        group.minPrice = Math.min(group.minPrice, r.pricePerNight);
        group.maxPrice = Math.max(group.maxPrice, r.pricePerNight);
        if (r.roomType && !group.roomTypes.includes(r.roomType)) {
          group.roomTypes.push(r.roomType);
        }
      }
    });

    return Array.from(map.values());
  }, [allRooms]);

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#081419] transition-colors pb-16">
      {/* ══ HEADER ══ */}
      <div className="bg-[#001F3D] text-white pt-24 pb-12 border-b border-[#003366]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3FCFC0] mb-2">
              <HotelIcon className="w-4 h-4" />
              <span>Hospitality & Accommodations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Fraunces', serif" }}>
              Hotels, Villas & Room Categories
            </h1>
            <p className="text-sm text-gray-300 mt-2 max-w-xl leading-relaxed">
              Explore SLTDA verified stays across Sri Lanka. Browse by hotel property to compare all available room categories, or view individual room listings.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 flex items-center gap-1 self-start md:self-auto">
            <button
              onClick={() => setViewMode("PROPERTIES")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                viewMode === "PROPERTIES"
                  ? "bg-[#FDA301] text-[#0E1B22] shadow-md"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>By Hotel Property ({hotelGroups.length})</span>
            </button>
            <button
              onClick={() => setViewMode("ROOMS")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                viewMode === "ROOMS"
                  ? "bg-[#FDA301] text-[#0E1B22] shadow-md"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>All Room Types ({allRooms.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* ══ LEFT PANEL — Filters ══ */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
          <div className="bg-white dark:bg-[#0F252E] rounded-3xl p-6 border border-[#E4E9EA] dark:border-[#20353D] shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E9EA] dark:border-[#20353D]">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4]">
                <Filter className="w-4 h-4 text-[#003366] dark:text-[#3FCFC0]" /> Filters
              </div>
              <button 
                onClick={() => setFilters({
                  city: "ALL",
                  checkIn: "",
                  checkOut: "",
                  roomType: "ALL",
                  viewType: "ALL",
                  capacity: "",
                  bedCount: "",
                  smokingAllowed: false,
                  isHourlyBookable: false,
                  maxPrice: 1000,
                })}
                className="text-xs font-semibold text-[#003366] dark:text-[#3FCFC0] hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Destination / City */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#9AAAB0] block">Destination City</label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-[#F4F6F8] dark:bg-[#15323D] text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] outline-none"
              >
                <option value="ALL">All Sri Lanka Locations</option>
                {Object.entries(CITY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            {/* Room Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#9AAAB0] block">Room Category</label>
              <select
                value={filters.roomType}
                onChange={(e) => handleFilterChange("roomType", e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-[#F4F6F8] dark:bg-[#15323D] text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="STANDARD">Standard Room</option>
                <option value="DELUXE">Deluxe Room</option>
                <option value="SUITE">Suite Room</option>
                <option value="FAMILY">Family Suite</option>
                <option value="VILLA">Private Villa</option>
                <option value="COTTAGE">Hillside Cottage</option>
              </select>
            </div>

            {/* View Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#9AAAB0] block">Scenic View</label>
              <select
                value={filters.viewType}
                onChange={(e) => handleFilterChange("viewType", e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-[#F4F6F8] dark:bg-[#15323D] text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] outline-none"
              >
                <option value="ALL">Any View</option>
                <option value="SEA_VIEW">Sea View</option>
                <option value="MOUNTAIN_VIEW">Mountain View</option>
                <option value="GARDEN_VIEW">Garden View</option>
                <option value="POOL_VIEW">Pool View</option>
                <option value="CITY_VIEW">City View</option>
              </select>
            </div>

            {/* Guests Capacity */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#9AAAB0] block">Guests Capacity</label>
              <select
                value={filters.capacity}
                onChange={(e) => handleFilterChange("capacity", e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-[#F4F6F8] dark:bg-[#15323D] text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] outline-none"
              >
                <option value="">Any Capacity</option>
                <option value="1">1+ Guest</option>
                <option value="2">2+ Guests</option>
                <option value="3">3+ Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#9AAAB0] uppercase">Max Price / Night</span>
                <span className="text-[#003366] dark:text-[#3FCFC0]">${filters.maxPrice}</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="1000" 
                step="25"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", Number(e.target.value))}
                className="w-full accent-[#003366] dark:accent-[#3FCFC0]"
              />
            </div>

            {/* Checkbox toggles */}
            <div className="space-y-3 pt-2 border-t border-[#E4E9EA] dark:border-[#20353D]">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#0E1B22] dark:text-[#EAF2F4]">
                <input 
                  type="checkbox"
                  checked={filters.isHourlyBookable}
                  onChange={(e) => handleFilterChange("isHourlyBookable", e.target.checked)}
                  className="rounded text-[#003366] focus:ring-[#003366] dark:focus:ring-[#3FCFC0]"
                />
                Hourly Layover Stays
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#0E1B22] dark:text-[#EAF2F4]">
                <input 
                  type="checkbox"
                  checked={filters.smokingAllowed}
                  onChange={(e) => handleFilterChange("smokingAllowed", e.target.checked)}
                  className="rounded text-[#003366] focus:ring-[#003366] dark:focus:ring-[#3FCFC0]"
                />
                Smoking Allowed
              </label>
            </div>

          </div>
        </aside>

        {/* ══ RIGHT PANEL — Results ══ */}
        <main className="flex-1 space-y-6">

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#4A5A62] dark:text-[#A9BCC2]">
              {loading ? "Searching catalog..." : (
                viewMode === "PROPERTIES"
                  ? `Showing ${hotelGroups.length} Hotel Properties with ${allRooms.length} available room categories`
                  : `Showing ${allRooms.length} Room Categories across Sri Lanka`
              )}
            </p>
          </div>

          {loading ? (
            <div className="p-16 text-center bg-white dark:bg-[#0F252E] rounded-3xl border border-[#E4E9EA] dark:border-[#20353D]">
              <div className="w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-semibold text-[#4A5A62] dark:text-[#A9BCC2]">Loading accommodations from catalog...</p>
            </div>
          ) : (
            <>
              {/* ══════════════════════════════════════════════════════════════ */}
              {/* VIEW MODE 1: BY HOTEL PROPERTY (BOOKING.COM MODEL)           */}
              {/* ══════════════════════════════════════════════════════════════ */}
              {viewMode === "PROPERTIES" && (
                <div className="space-y-6">
                  {hotelGroups.length === 0 ? (
                    <div className="p-12 text-center bg-white dark:bg-[#0F252E] rounded-3xl border border-[#E4E9EA] dark:border-[#20353D]">
                      <p className="text-sm font-semibold text-[#4A5A62] dark:text-[#A9BCC2]">No hotels found matching your filter criteria.</p>
                    </div>
                  ) : (
                    hotelGroups.map((hotel) => (
                      <div 
                        key={hotel.hotelId || hotel.hotelName}
                        className="p-6 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6"
                      >
                        {/* Hotel Thumbnail */}
                        <div className="w-full md:w-64 h-52 md:h-auto rounded-2xl overflow-hidden relative flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                          <img 
                            src={hotel.hotelCoverImage} 
                            alt={hotel.hotelName}
                            className="w-full h-full object-cover"
                          />
                          {hotel.sltdaVerified && (
                            <div className="absolute top-3 left-3 bg-[#FDA301] text-[#0E1B22] px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm">
                              <ShieldCheck className="w-3 h-3" /> SLTDA Verified
                            </div>
                          )}
                        </div>

                        {/* Hotel Details & Available Room Types */}
                        <div className="flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 text-xs text-[#008080] dark:text-[#3FCFC0] font-bold">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{CITY_LABELS[hotel.hotelCity] || hotel.hotelCity || "Sri Lanka"}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
                                <Star className="w-3.5 h-3.5 text-[#FDA301] fill-[#FDA301]" />
                                <span>{hotel.hotelRating}</span>
                              </div>
                            </div>

                            <h2 className="text-xl font-bold text-[#0E1B22] dark:text-[#EAF2F4] mt-1" style={{ fontFamily: "'Fraunces', serif" }}>
                              {hotel.hotelName}
                            </h2>

                            {hotel.hotelAddress && (
                              <p className="text-xs text-[#9AAAB0] mt-0.5">{hotel.hotelAddress}</p>
                            )}

                            {/* Available Room Type Badges */}
                            <div className="mt-3">
                              <div className="text-[11px] font-bold text-[#9AAAB0] uppercase tracking-wider mb-1.5">
                                Available Room Types ({hotel.rooms.length}):
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {hotel.rooms.map((r) => (
                                  <Link 
                                    key={r.id}
                                    href={`/rooms/${r.id}`}
                                    className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-[#15323D] hover:bg-[#003366] hover:text-white dark:hover:bg-[#3FCFC0] dark:hover:text-[#0E1B22] transition-colors text-xs font-medium text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-1.5"
                                  >
                                    <span>{r.displayName || (r.roomType ? `${r.roomType.replace(/_/g, " ")}` : "Room")}</span>
                                    <span className="text-[10px] font-bold text-[#003366] dark:text-[#3FCFC0] group-hover:text-white">
                                      ${r.pricePerNight}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Footer Actions */}
                          <div className="pt-4 border-t border-[#E4E9EA] dark:border-[#20353D] flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <span className="text-xs text-[#9AAAB0] block">Starting from</span>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-[#003366] dark:text-[#3FCFC0]">${hotel.minPrice}</span>
                                {hotel.minPrice !== hotel.maxPrice && (
                                  <span className="text-xs text-[#9AAAB0]"> - ${hotel.maxPrice}</span>
                                )}
                                <span className="text-xs text-[#9AAAB0]"> / night</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Link href={hotel.hotelId ? `/business/${hotel.hotelId}` : "#"}>
                                <Button size="sm" className="bg-[#FDA301] hover:bg-[#E59300] text-[#0E1B22] font-bold rounded-xl text-xs px-5 shadow-sm flex items-center gap-1.5">
                                  <span>View Hotel & Available Rooms</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </Button>
                              </Link>
                            </div>
                          </div>

                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════ */}
              {/* VIEW MODE 2: ALL INDIVIDUAL ROOMS                            */}
              {/* ══════════════════════════════════════════════════════════════ */}
              {viewMode === "ROOMS" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allRooms.length === 0 ? (
                    <div className="col-span-full p-12 text-center bg-white dark:bg-[#0F252E] rounded-3xl border border-[#E4E9EA] dark:border-[#20353D]">
                      <p className="text-sm font-semibold text-[#4A5A62] dark:text-[#A9BCC2]">No individual rooms found matching your filter criteria.</p>
                    </div>
                  ) : (
                    allRooms.map((room) => (
                      <div 
                        key={room.id}
                        className="bg-white dark:bg-[#0F252E] rounded-3xl border border-[#E4E9EA] dark:border-[#20353D] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img 
                              src={(room.imageUrls && room.imageUrls.length > 0 ? room.imageUrls[0] : room.hotelCoverImage) || "https://images.unsplash.com/photo-1590490360182-c33d57733427"} 
                              alt={room.displayName || "Room"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                              <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase">
                                {(room.roomType || "STANDARD").replace(/_/g, " ")}
                              </span>
                              {room.viewType && room.viewType !== "NONE" && (
                                <span className="px-2.5 py-1 bg-[#008080]/80 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase">
                                  {room.viewType.replace(/_/g, " ")}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-5 space-y-2">
                            <div className="flex items-center justify-between text-xs text-[#9AAAB0]">
                              <span className="font-semibold text-[#003366] dark:text-[#3FCFC0]">{room.hotelName || "Hotel Stay"}</span>
                              <span>{CITY_LABELS[room.city] || room.city}</span>
                            </div>

                            <h3 className="font-bold text-base text-[#0E1B22] dark:text-[#EAF2F4] line-clamp-1 group-hover:text-[#003366] dark:group-hover:text-[#3FCFC0] transition-colors">
                              {room.displayName || `${room.roomType || "Deluxe"} Room`}
                            </h3>

                            <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                              {room.bedConfiguration || (room.bedCount ? `${room.bedCount} Bed(s)` : "Queen Bed")} • Max {room.capacity || 2} Guests
                              {room.sizeSquareMeters && ` • ${room.sizeSquareMeters} m²`}
                            </p>
                          </div>
                        </div>

                        <div className="p-5 pt-0 flex items-center justify-between border-t border-[#E4E9EA] dark:border-[#20353D] mt-2">
                          <div className="pt-3">
                            <span className="text-lg font-bold text-[#003366] dark:text-[#3FCFC0]">${room.pricePerNight}</span>
                            <span className="text-xs text-[#9AAAB0]"> / night</span>
                          </div>
                          <div className="pt-3">
                            <Link href={`/rooms/${room.id}`}>
                              <Button size="sm" className="bg-[#FDA301] hover:bg-[#E59300] text-[#0E1B22] font-bold rounded-xl text-xs px-4">
                                View Room <ArrowRight className="w-3.5 h-3.5 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}

        </main>
      </div>
    </div>
  );
}
