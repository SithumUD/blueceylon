"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Star, MapPin, ShieldCheck, Check, Calendar, Sun, Moon, Compass, Users, Clock, Coffee, Heart, Plane, Umbrella, Utensils, Dog, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_BUSINESSES } from "@/lib/mock-data/businesses";
import { MOCK_REVIEWS } from "@/lib/mock-data/reviews";

export default function BusinessProfilePage() {
  const params = useParams();
  const businessId = params.id as string;

  const business = MOCK_BUSINESSES.find((b) => b.id === businessId) || MOCK_BUSINESSES[0];
  const reviews = MOCK_REVIEWS.filter((r) => r.businessId === business.id);

  const [activeTab, setActiveTab] = useState<"rooms" | "dayout" | "nightout" | "tours">("rooms");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Title & Header Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {business.sltdaVerified && <Badge variant="sltda" />}
              <span className="text-xs text-[#006666] dark:text-[#3FCFC0] font-semibold uppercase tracking-wider">
                {business.category} • {business.location.city} ({business.location.region})
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
              {business.name}
            </h1>
            <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#008080]" />
              <span>{business.location.address}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-sm font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
                <Star className="w-4 h-4 text-[#FDA301] fill-[#FDA301]" />
                <span>{business.rating}</span>
                <span className="text-xs font-normal text-[#4A5A62] dark:text-[#A9BCC2]">
                  ({business.reviewCount} reviews)
                </span>
              </div>
              {business.sltdaVerified && (
                <span className="text-[11px] font-mono text-[#008080] dark:text-[#3FCFC0] block">
                  License: {business.sltdaLicenseNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Image Mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9]">
          <div className="md:col-span-2 h-full">
            <img
              src={business.galleryImages[0] || business.coverImage}
              alt={business.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-3 md:col-span-2">
            <div className="grid grid-cols-2 gap-3 h-full">
              <img
                src={business.galleryImages[1] || business.coverImage}
                alt="Gallery preview"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded-lg"
              />
              <img
                src={business.galleryImages[2] || business.coverImage}
                alt="Gallery preview"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded-lg"
              />
            </div>
            <div className="relative h-full overflow-hidden rounded-lg">
              <img
                src={business.galleryImages[3] || business.coverImage}
                alt="Gallery preview"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
                + View Full Gallery
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Overview vs Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-10">
          {/* Host Info & Quick Catalog Attributes */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-4 shadow-sm">
            <div className="flex items-center gap-4">
              <img
                src={business.host.avatar}
                alt={business.host.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#FDA301]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-lg text-[#0E1B22] dark:text-[#EAF2F4]">
                    Hosted by {business.host.name}
                  </h3>
                  {business.host.superhost && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FDA301]/20 text-[#FDA301] text-[10px] font-bold uppercase">
                      Superhost
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                  Hosting in {business.location.city} since {business.host.joinedYear} • SLTDA Verified Partner
                </p>
              </div>
            </div>

            {/* Distance & Catalog Attributes Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E4E9EA] dark:border-[#20353D] text-xs">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-[#008080]" />
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Airport Dist.</span>
                  <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">185 km</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Umbrella className="w-4 h-4 text-[#008080]" />
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Beach Dist.</span>
                  <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">12 km</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#008080]" />
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Check-In / Out</span>
                  <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">14:00 / 11:00</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Dog className="w-4 h-4 text-[#008080]" />
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Pet Policy</span>
                  <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">On Request</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Description */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
              About this accommodation & experience
            </h3>
            <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed">
              {business.description}
            </p>
          </div>

          {/* Nearby Attractions */}
          <div className="space-y-3 p-5 rounded-2xl bg-[#008080]/5 border border-[#008080]/20">
            <h4 className="font-display font-bold text-sm text-[#008080] dark:text-[#3FCFC0] uppercase tracking-wider">
              📍 Nearby Attractions & Landmarks
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-white dark:bg-[#0F252E] font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                Nine Arch Bridge (0.8 km)
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-[#0F252E] font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                Little Adam's Peak (2.1 km)
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-[#0F252E] font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                Ella Rock Trailhead (3.5 km)
              </div>
            </div>
          </div>

          {/* Property Amenities */}
          <div className="space-y-4 border-t border-[#E4E9EA] dark:border-[#20353D] pt-6">
            <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
              Property Amenities & Facilities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {business.amenities.map((item, index) => (
                <div key={index} className="flex items-center gap-2.5 text-xs text-[#0E1B22] dark:text-[#EAF2F4]">
                  <div className="w-7 h-7 rounded-lg bg-[#008080]/10 text-[#008080] dark:text-[#3FCFC0] flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* OFFERINGS TABBED SELECTOR (Rooms vs Day Out vs Night Out vs Tours) */}
          <div className="space-y-6 border-t border-[#E4E9EA] dark:border-[#20353D] pt-6">
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
                Bookable Experience Packages & Accommodations
              </h3>
              <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                Select between overnight room stays, daytime passes (09:00–18:00), or evening romantic dinners.
              </p>
            </div>

            {/* Tab Buttons */}
            <div className="flex border-b border-[#E4E9EA] dark:border-[#20353D] gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab("rooms")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === "rooms"
                    ? "border-[#003366] text-[#003366] dark:border-[#3FCFC0] dark:text-[#3FCFC0]"
                    : "border-transparent text-[#4A5A62] dark:text-[#A9BCC2]"
                }`}
              >
                <span>🛏️ Overnight Rooms ({business.rooms.length})</span>
              </button>

              {business.dayOutPackages && business.dayOutPackages.length > 0 && (
                <button
                  onClick={() => setActiveTab("dayout")}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                    activeTab === "dayout"
                      ? "border-[#003366] text-[#003366] dark:border-[#3FCFC0] dark:text-[#3FCFC0]"
                      : "border-transparent text-[#4A5A62] dark:text-[#A9BCC2]"
                  }`}
                >
                  <Sun className="w-4 h-4 text-[#FDA301]" />
                  <span>Day Out Packages ({business.dayOutPackages.length})</span>
                </button>
              )}

              {business.nightOutPackages && business.nightOutPackages.length > 0 && (
                <button
                  onClick={() => setActiveTab("nightout")}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                    activeTab === "nightout"
                      ? "border-[#003366] text-[#003366] dark:border-[#3FCFC0] dark:text-[#3FCFC0]"
                      : "border-transparent text-[#4A5A62] dark:text-[#A9BCC2]"
                  }`}
                >
                  <Moon className="w-4 h-4 text-[#008080]" />
                  <span>Night Out & Dining ({business.nightOutPackages.length})</span>
                </button>
              )}

              {business.tourPackages && business.tourPackages.length > 0 && (
                <button
                  onClick={() => setActiveTab("tours")}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                    activeTab === "tours"
                      ? "border-[#003366] text-[#003366] dark:border-[#3FCFC0] dark:text-[#3FCFC0]"
                      : "border-transparent text-[#4A5A62] dark:text-[#A9BCC2]"
                  }`}
                >
                  <Compass className="w-4 h-4 text-[#008080]" />
                  <span>Excursions & Tours ({business.tourPackages.length})</span>
                </button>
              )}
            </div>

            {/* TAB CONTENT: ROOMS */}
            {activeTab === "rooms" && (
              <div className="space-y-4">
                {business.rooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-5 rounded-2xl border border-[#E4E9EA] dark:border-[#20353D] bg-white dark:bg-[#0F252E] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-display font-bold text-base text-[#0E1B22] dark:text-[#EAF2F4]">
                          {room.name}
                        </h4>
                        <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                          {room.bedType} • Max {room.capacity} Guests
                        </p>
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          ✓ Pay at Property Accepted
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <div className="text-right">
                        <span className="font-sans text-xl font-bold text-[#003366] dark:text-[#EAF2F4]">
                          ${room.pricePerNight}
                        </span>
                        <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]"> / night</span>
                      </div>
                      <Link href={`/checkout/room?businessId=${business.id}&roomId=${room.id}`}>
                        <Button variant="primary" size="sm">
                          Book Room
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: DAY OUT PACKAGES */}
            {activeTab === "dayout" && business.dayOutPackages && (
              <div className="space-y-4">
                {business.dayOutPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-5 rounded-2xl border border-[#FDA301]/40 bg-white dark:bg-[#0F252E] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#FDA301] bg-[#FDA301]/10 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3" />
                          <span>Day Pass ({pkg.startTime} – {pkg.endTime})</span>
                        </div>
                        <h4 className="font-display font-bold text-base text-[#0E1B22] dark:text-[#EAF2F4]">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                          {pkg.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                      <div className="text-right">
                        <span className="font-sans text-xl font-bold text-[#003366] dark:text-[#EAF2F4]">
                          ${pkg.price}
                        </span>
                        <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]"> USD</span>
                      </div>
                      <Link href={`/extra-packages/${pkg.id}`}>
                        <Button variant="gold" size="sm">
                          View Package Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: NIGHT OUT PACKAGES */}
            {activeTab === "nightout" && business.nightOutPackages && (
              <div className="space-y-4">
                {business.nightOutPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-5 rounded-2xl border border-[#008080]/40 bg-white dark:bg-[#0F252E] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#008080] dark:text-[#3FCFC0] bg-[#008080]/10 px-2 py-0.5 rounded-md">
                          <Moon className="w-3 h-3" />
                          <span>Evening Dinner ({pkg.startTime} – {pkg.endTime})</span>
                        </div>
                        <h4 className="font-display font-bold text-base text-[#0E1B22] dark:text-[#EAF2F4]">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                          {pkg.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                      <div className="text-right">
                        <span className="font-sans text-xl font-bold text-[#003366] dark:text-[#EAF2F4]">
                          ${pkg.price}
                        </span>
                        <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]"> USD</span>
                      </div>
                      <Link href={`/extra-packages/${pkg.id}`}>
                        <Button variant="secondary" size="sm">
                          View Dinner Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: TOUR PACKAGES */}
            {activeTab === "tours" && business.tourPackages && (
              <div className="space-y-4">
                {business.tourPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-5 rounded-2xl border border-[#003366]/30 bg-white dark:bg-[#0F252E] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#003366] dark:text-[#3FCFC0] bg-[#003366]/10 px-2 py-0.5 rounded-md">
                          <Compass className="w-3 h-3" />
                          <span>Excursion Tour ({pkg.duration})</span>
                        </div>
                        <h4 className="font-display font-bold text-base text-[#0E1B22] dark:text-[#EAF2F4]">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                          {pkg.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                      <div className="text-right">
                        <span className="font-sans text-xl font-bold text-[#003366] dark:text-[#EAF2F4]">
                          ${pkg.price}
                        </span>
                        <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]"> USD</span>
                      </div>
                      <Link href={`/tours/${pkg.id}`}>
                        <Button variant="primary" size="sm">
                          View Tour Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verified Reviews Section */}
          <div className="space-y-6 border-t border-[#E4E9EA] dark:border-[#20353D] pt-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
                Verified Traveler Reviews ({reviews.length})
              </h3>
              <Link href={`/business/${business.id}/reviews`} className="text-xs font-semibold text-[#006666] dark:text-[#3FCFC0] hover:underline">
                Write a Review →
              </Link>
            </div>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4]">
                        {rev.guestName}
                      </h4>
                      <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                        {rev.guestCountry} • Reviewed {rev.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#FDA301]">
                      <Star className="w-3.5 h-3.5 fill-[#FDA301]" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>

                  {rev.verifiedStay && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#008080] dark:text-[#3FCFC0] bg-[#008080]/10 px-2 py-0.5 rounded-full">
                      <span>✓ Verified Booking Ref: {rev.bookingRef}</span>
                    </div>
                  )}

                  <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Reservation Box */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 p-6 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-lg space-y-6">
            <div className="flex items-end justify-between border-b border-[#E4E9EA] dark:border-[#20353D] pb-4">
              <div>
                <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">Nightly stays from</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-sans text-3xl font-bold text-[#003366] dark:text-[#EAF2F4]">
                    ${business.priceStartFrom}
                  </span>
                  <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]"> USD</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
                <Star className="w-4 h-4 text-[#FDA301] fill-[#FDA301]" />
                <span>{business.rating}</span>
              </div>
            </div>

            <Link href={`/checkout/room?businessId=${business.id}&roomId=${business.rooms[0]?.id || "r-101"}`} className="block">
              <Button variant="primary" size="lg" className="w-full rounded-xl py-3 font-semibold shadow-md">
                Reserve Overnight Room
              </Button>
            </Link>

            {business.dayOutPackages && business.dayOutPackages.length > 0 && (
              <Link href={`/extra-packages/${business.dayOutPackages[0].id}`} className="block">
                <Button variant="gold" size="lg" className="w-full rounded-xl py-3 font-bold shadow-md">
                  View Day Out Pass
                </Button>
              </Link>
            )}

            <p className="text-[11px] text-center text-[#4A5A62] dark:text-[#A9BCC2]">
              🔒 Instant Confirmation • SLTDA Verified Partner
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
