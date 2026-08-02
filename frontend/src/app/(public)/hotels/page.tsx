"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, MapPin, ShieldCheck, Hotel as HotelIcon, Check, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_BUSINESSES } from "@/lib/mock-data/businesses";

export default function HotelsPage() {
  const [selectedRegion, setSelectedRegion] = useState("ALL");

  const filteredHotels = MOCK_BUSINESSES.filter((b) => {
    if (selectedRegion !== "ALL" && b.location.region !== selectedRegion) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E9EA] dark:border-[#20353D] pb-6">
        <div>
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#003366] dark:text-[#3FCFC0] mb-1">
            <HotelIcon className="w-4 h-4" />
            <span>Sri Lanka Hospitality Directory</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
            All Hotels, Villas & Homestays
          </h1>
          <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
            Discover SLTDA verified boutique hotels, hill country retreats, and beachside villas
          </p>
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">
            Region:
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-white dark:bg-[#0F252E] text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none"
          >
            <option value="ALL">All Tourism Regions</option>
            <option value="HILL_COUNTRY">Hill Country (Ella, Nuwara Eliya)</option>
            <option value="SOUTH_COAST">South Coast (Galle, Mirissa)</option>
            <option value="CULTURAL_TRIANGLE">Cultural Triangle (Sigiriya)</option>
          </select>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="p-6 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={hotel.coverImage}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                {hotel.sltdaVerified && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="sltda" />
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#FDA301] fill-[#FDA301]" />
                  <span>{hotel.rating}</span>
                  <span className="text-[10px] text-gray-300">({hotel.reviewCount})</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#008080] dark:text-[#3FCFC0] tracking-wider">
                  {hotel.category} • {hotel.location.city}
                </span>
                <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
                  {hotel.name}
                </h3>
                <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] line-clamp-2 mt-1">
                  {hotel.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#E4E9EA] dark:border-[#20353D]">
                {hotel.amenities.slice(0, 4).map((am, idx) => (
                  <span key={idx} className="text-[11px] bg-gray-100 dark:bg-[#15323D] px-2 py-0.5 rounded-md font-medium text-[#0E1B22] dark:text-[#EAF2F4]">
                    ✓ {am}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E4E9EA] dark:border-[#20353D] flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block">Stays From</span>
                <span className="font-sans text-2xl font-bold text-[#003366] dark:text-[#3FCFC0]">
                  ${hotel.priceStartFrom}
                </span>
                <span className="text-xs text-gray-400"> / night</span>
              </div>
              <Link href={`/business/${hotel.id}`}>
                <Button variant="primary" size="md" className="gap-1.5 rounded-xl font-bold">
                  <span>View Hotel Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
