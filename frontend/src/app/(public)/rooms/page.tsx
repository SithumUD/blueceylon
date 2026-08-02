"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Star, MapPin, ShieldCheck, BedDouble, Search, Filter, ArrowRight, Check, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MOCK_BUSINESSES } from "@/lib/mock-data/businesses";

export default function RoomsPage() {
  const searchParams = useSearchParams();
  const queryCity = searchParams.get("city") || "ALL";
  const queryCheckIn = searchParams.get("checkIn") || "";
  const queryCheckOut = searchParams.get("checkOut") || "";
  const queryGuests = searchParams.get("guests") || "";

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

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Flatten rooms and apply filters
  const allRooms = MOCK_BUSINESSES.flatMap((b) =>
    (b.rooms || []).map((r) => ({
      ...r,
      hotelId: b.id,
      hotelName: b.name,
      city: b.location.city,
      hotelRating: b.rating,
      hotelCoverImage: b.coverImage,
      sltdaVerified: b.sltdaVerified,
    }))
  ).filter((room) => {
    if (filters.city !== "ALL" && room.city.toLowerCase() !== filters.city.toLowerCase()) return false;
    if (filters.roomType !== "ALL" && room.name.toUpperCase().indexOf(filters.roomType) === -1) return false;
    if (filters.capacity && room.capacity < Number(filters.capacity)) return false;
    if (room.pricePerNight > filters.maxPrice) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#081419] transition-colors pb-16">
      {/* ══ HEADER ══ */}
      <div className="bg-[#001F3D] text-white pt-24 pb-12 border-b border-[#003366]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#008080] dark:text-[#3FCFC0] mb-2">
              <BedDouble className="w-4 h-4" />
              <span>Accommodation Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Fraunces', serif" }}>
              Explore Available Rooms
            </h1>
            <p className="text-sm text-gray-300 mt-2 max-w-xl leading-relaxed">
              Find the perfect room across Sri Lanka's SLTDA verified hotels, villas, and eco-lodges. Filter by capacity, view, and layout.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* ══ LEFT PANEL — Filters ══ */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
          <div className="bg-white dark:bg-[#0F252E] rounded-3xl p-6 border border-[#E4E9EA] dark:border-[#20353D] shadow-sm sticky top-24">
            <div className="flex items-center gap-2 font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4] mb-6 pb-4 border-b border-[#E4E9EA] dark:border-[#20353D]" style={{ fontFamily: "'Fraunces', serif" }}>
              <Filter className="w-5 h-5 text-[#003366] dark:text-[#3FCFC0]" />
              Filter Rooms
            </div>

            <div className="space-y-6">
              {/* Place / Destination Filter */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Place / City</label>
                <select value={filters.city} onChange={(e) => handleFilterChange("city", e.target.value)} className="w-full p-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:ring-2 focus:ring-[#003366] outline-none cursor-pointer">
                  <option value="ALL">All Sri Lanka</option>
                  <option value="Ella">Ella (Hill Country)</option>
                  <option value="Galle">Galle (South Coast)</option>
                  <option value="Sigiriya">Sigiriya (Cultural)</option>
                  <option value="Mirissa">Mirissa (South Coast)</option>
                  <option value="Kandy">Kandy (Central)</option>
                  <option value="Colombo">Colombo (Capital)</option>
                  <option value="Nuwara Eliya">Nuwara Eliya (Tea)</option>
                </select>
              </div>

              {/* Availability Interactive Date Range Calendar */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Availability Search</label>
                <DateRangePicker
                  checkInDate={filters.checkIn}
                  checkOutDate={filters.checkOut}
                  onChange={({ checkIn, checkOut }) => {
                    handleFilterChange("checkIn", checkIn);
                    handleFilterChange("checkOut", checkOut);
                  }}
                />
              </div>

              {/* Room Type */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Room Category</label>
                <div className="flex flex-col gap-2">
                  {["ALL", "SINGLE", "DOUBLE", "SUITE", "FAMILY"].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="roomType" checked={filters.roomType === type} onChange={() => handleFilterChange("roomType", type)} className="w-4 h-4 accent-[#003366] cursor-pointer" />
                      <span className="text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4] group-hover:text-[#003366] dark:group-hover:text-[#3FCFC0] transition-colors">{type === "ALL" ? "Any Category" : type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* View Type */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Room View</label>
                <select value={filters.viewType} onChange={(e) => handleFilterChange("viewType", e.target.value)} className="w-full p-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:ring-2 focus:ring-[#003366] outline-none">
                  <option value="ALL">Any View</option>
                  <option value="SEA_VIEW">Sea View</option>
                  <option value="GARDEN_VIEW">Garden View</option>
                  <option value="MOUNTAIN_VIEW">Mountain View</option>
                  <option value="POOL_VIEW">Pool View</option>
                  <option value="CITY_VIEW">City View</option>
                  <option value="NONE">No Specific View</option>
                </select>
              </div>

              {/* Capacity & Beds */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Min Guests</label>
                  <input type="number" min="1" placeholder="e.g. 2" value={filters.capacity} onChange={(e) => handleFilterChange("capacity", e.target.value)} className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm text-[#0E1B22] dark:text-[#EAF2F4] outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Min Beds</label>
                  <input type="number" min="1" placeholder="e.g. 1" value={filters.bedCount} onChange={(e) => handleFilterChange("bedCount", e.target.value)} className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm text-[#0E1B22] dark:text-[#EAF2F4] outline-none" />
                </div>
              </div>

              {/* Max Price */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">Max Price / Night</label>
                  <span className="text-xs font-bold text-[#003366] dark:text-[#3FCFC0]">${filters.maxPrice}</span>
                </div>
                <input type="range" min="10" max="1000" step="10" value={filters.maxPrice} onChange={(e) => handleFilterChange("maxPrice", Number(e.target.value))} className="w-full accent-[#003366]" />
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-4 border-t border-[#E4E9EA] dark:border-[#20353D]">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={filters.smokingAllowed} onChange={(e) => handleFilterChange("smokingAllowed", e.target.checked)} className="w-4 h-4 rounded text-[#003366] accent-[#003366]" />
                  <span className="text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">Smoking Allowed</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={filters.isHourlyBookable} onChange={(e) => handleFilterChange("isHourlyBookable", e.target.checked)} className="w-4 h-4 rounded text-[#003366] accent-[#003366]" />
                  <span className="text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">Hourly / Layover Bookable</span>
                </label>
              </div>

              <Button variant="ghost" className="w-full rounded-xl mt-4 font-bold border border-[#E4E9EA] dark:border-[#20353D]" onClick={() => setFilters({city: "ALL", checkIn: "", checkOut: "", roomType: "ALL", viewType: "ALL", capacity: "", bedCount: "", smokingAllowed: false, isHourlyBookable: false, maxPrice: 1000})}>
                Reset Filters
              </Button>
            </div>
          </div>
        </aside>

        {/* ══ RIGHT PANEL — Results ══ */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-[#4A5A62] dark:text-[#A9BCC2]">
              Showing <span className="text-[#0E1B22] dark:text-white">{allRooms.length}</span> available rooms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {allRooms.map((room, idx) => (
              <div key={idx} className="group bg-white dark:bg-[#0F252E] rounded-[1.5rem] border border-[#E4E9EA] dark:border-[#20353D] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={room.hotelCoverImage} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#0E1B22] dark:text-white flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-[#FDA301] fill-[#FDA301]" /> {room.hotelRating}
                  </div>
                  {room.sltdaVerified && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="sltda" />
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#0E1B22] dark:text-[#EAF2F4] line-clamp-1" style={{ fontFamily: "'Fraunces', serif" }}>
                        {room.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-[#008080] dark:text-[#3FCFC0] uppercase tracking-wider bg-[#008080]/10 inline-flex px-2 py-1 rounded-md">
                        {room.hotelName}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#4A5A62] dark:text-[#A9BCC2]">
                      <Users className="w-3.5 h-3.5" /> Max {room.capacity} Guests
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#4A5A62] dark:text-[#A9BCC2]">
                      <BedDouble className="w-3.5 h-3.5" /> {room.bedType}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#4A5A62] dark:text-[#A9BCC2]">
                      <MapPin className="w-3.5 h-3.5" /> {room.city}
                    </div>
                    {room.sltdaVerified && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#FDA301]">
                        <ShieldCheck className="w-3.5 h-3.5" /> SLTDA Verified
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-[#E4E9EA] dark:border-[#20353D] bg-gray-50/50 dark:bg-[#15323D]/50 flex items-center justify-between mt-auto">
                  <div>
                    <div className="text-[10px] text-[#9AAAB0] font-semibold uppercase">Nightly Rate</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-[#003366] dark:text-[#3FCFC0]">${room.pricePerNight}</span>
                      <span className="text-xs text-[#9AAAB0]">USD</span>
                    </div>
                  </div>
                  <Link href={`/rooms/${room.id}`}>
                    <Button size="sm" className="rounded-xl px-4 font-bold shadow-md hover:shadow-lg transition-all" style={{ background: "#003366", color: "white" }}>
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
