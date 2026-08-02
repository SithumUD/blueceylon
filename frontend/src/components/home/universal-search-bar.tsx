"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Users, Hotel, Compass, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UniversalSearchBar() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ALL" | "STAYS" | "TOURS" | "GUIDES">("ALL");
  const [city, setCity] = useState("ALL");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Guests");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams = new URLSearchParams();
    if (city !== "ALL") queryParams.append("city", city);
    if (checkIn) queryParams.append("checkIn", checkIn);
    if (checkOut) queryParams.append("checkOut", checkOut);
    if (guests) queryParams.append("guests", guests.replace(/\D/g, "") || "2");

    const queryString = queryParams.toString();
    const queryPrefix = queryString ? `?${queryString}` : "";

    if (activeTab === "STAYS") {
      router.push(`/rooms${queryPrefix}`);
    } else if (activeTab === "TOURS") {
      router.push(`/tours${queryPrefix}`);
    } else if (activeTab === "GUIDES") {
      router.push(`/tour-guides${queryPrefix}`);
    } else {
      router.push(`/rooms${queryPrefix}`);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Category Tabs (STAYS, TOURS, GUIDES, ALL) — No Experiences or Day Passes */}
      <div className="flex items-center justify-center gap-2 max-w-md mx-auto p-1.5 rounded-full bg-white/90 dark:bg-[#0F252E]/90 border border-[#E4E9EA] dark:border-[#20353D] shadow-sm backdrop-blur-md">
        <button
          type="button"
          onClick={() => setActiveTab("ALL")}
          className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "ALL"
              ? "bg-[#008080] text-white shadow-sm"
              : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-black/5 dark:hover:bg-white/5"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("STAYS")}
          className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "STAYS"
              ? "bg-[#008080] text-white shadow-sm"
              : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-black/5 dark:hover:bg-white/5"
          }`}
        >
          <Hotel className="w-3.5 h-3.5" />
          Stays
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("TOURS")}
          className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "TOURS"
              ? "bg-[#008080] text-white shadow-sm"
              : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-black/5 dark:hover:bg-white/5"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Tours
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("GUIDES")}
          className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "GUIDES"
              ? "bg-[#008080] text-white shadow-sm"
              : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-black/5 dark:hover:bg-white/5"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Guides
        </button>
      </div>

      {/* Main Availability Search Form */}
      <form
        onSubmit={handleSearch}
        className="p-3 sm:p-4 rounded-3xl md:rounded-full bg-white dark:bg-[#0F252E] shadow-xl border border-[#E4E9EA] dark:border-[#20353D] flex flex-col md:flex-row items-center gap-3 transition-all"
      >
        {/* Destination Input */}
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 rounded-2xl md:rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <MapPin className="w-5 h-5 text-[#008080] shrink-0" />
          <div className="flex flex-col w-full">
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">
              Destination
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-transparent text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="dark:bg-[#0F252E]">All Sri Lanka</option>
              <option value="Ella" className="dark:bg-[#0F252E]">Ella (Hill Country)</option>
              <option value="Galle" className="dark:bg-[#0F252E]">Galle (Southern Coast)</option>
              <option value="Sigiriya" className="dark:bg-[#0F252E]">Sigiriya (Cultural Triangle)</option>
              <option value="Mirissa" className="dark:bg-[#0F252E]">Mirissa (South Coast)</option>
              <option value="Kandy" className="dark:bg-[#0F252E]">Kandy (Central Province)</option>
              <option value="Colombo" className="dark:bg-[#0F252E]">Colombo (Commercial Hub)</option>
              <option value="Nuwara Eliya" className="dark:bg-[#0F252E]">Nuwara Eliya (Tea Country)</option>
            </select>
          </div>
        </div>

        <div className="hidden md:block w-px h-8 bg-[#E4E9EA] dark:bg-[#20353D]" />

        {/* Check-in / Check-out Availability Dates */}
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 rounded-2xl md:rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <Calendar className="w-5 h-5 text-[#008080] shrink-0" />
          <div className="flex flex-col w-full">
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">
              Check In / Out
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none cursor-pointer w-28"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none cursor-pointer w-28"
              />
            </div>
          </div>
        </div>

        <div className="hidden md:block w-px h-8 bg-[#E4E9EA] dark:bg-[#20353D]" />

        {/* Guest Selector */}
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 rounded-2xl md:rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <Users className="w-5 h-5 text-[#008080] shrink-0" />
          <div className="flex flex-col w-full">
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">
              Travelers
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="bg-transparent text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none cursor-pointer"
            >
              <option value="1 Guest" className="dark:bg-[#0F252E]">1 Traveler</option>
              <option value="2 Guests" className="dark:bg-[#0F252E]">2 Travelers (Couple)</option>
              <option value="4 Guests" className="dark:bg-[#0F252E]">4 Travelers (Family)</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" variant="primary" size="lg" className="w-full md:w-auto rounded-full gap-2 px-8 py-3.5 shadow-md font-bold">
          <Search className="w-4 h-4" />
          <span>Check Availability</span>
        </Button>
      </form>
    </div>
  );
}
