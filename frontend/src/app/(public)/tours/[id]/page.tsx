"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Compass, Clock, MapPin, Check, ArrowLeft, ShieldCheck, Car, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_BUSINESSES } from "@/lib/mock-data/businesses";
import { MOCK_GUIDES } from "@/lib/mock-data/guides";

export default function TourDetailPage() {
  const params = useParams();
  const tourId = params.id as string;

  // Search in hotel tours or guide tours
  let foundTour = MOCK_BUSINESSES.flatMap((b) =>
    (b.tourPackages || []).map((tp) => ({
      ...tp,
      providerName: b.name,
      providerId: b.id,
      providerType: "HOTEL",
      location: b.location.city,
      sltdaVerified: b.sltdaVerified,
      avatar: b.host.avatar,
    }))
  ).find((t) => t.id === tourId);

  if (!foundTour) {
    const guide = MOCK_GUIDES[0];
    foundTour = {
      id: `g-tour-${guide.id}`,
      title: `${guide.name} — Private Excursion & Wildlife Tour`,
      description: guide.bio,
      duration: "Full Day (8 Hours)",
      price: guide.dailyRateUSD,
      pricingUnit: "PER_PERSON" as const,
      highlights: guide.specialties,
      includedTransport: guide.vehicle.type,
      image: guide.coverImage,
      providerName: guide.name,
      providerId: guide.id,
      providerType: "GUIDE",
      location: "Ella & Hill Country",
      sltdaVerified: guide.sltdaVerified,
      avatar: guide.avatar,
    };
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link href="/tours" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006666] dark:text-[#3FCFC0] hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tours & Excursions</span>
      </Link>

      {/* Header Banner */}
      <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden border border-[#E4E9EA] dark:border-[#20353D]">
        <img
          src={foundTour.image}
          alt={foundTour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {foundTour.sltdaVerified && <Badge variant="sltda" />}
              <span className="text-xs uppercase font-bold text-[#5CE1E6] bg-black/50 px-2.5 py-1 rounded-full">
                {foundTour.duration}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold">
              {foundTour.title}
            </h1>
            <p className="text-xs text-gray-300">
              Provided by {foundTour.providerName} • Location: {foundTour.location}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-300">Excursion Rate</span>
            <div className="text-3xl font-bold font-sans text-[#5CE1E6]">
              ${foundTour.price} <span className="text-xs text-gray-300">USD / person</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tour Details */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
              Tour Overview
            </h3>
            <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed">
              {foundTour.description}
            </p>
          </div>

          {/* Highlights */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
              Excursion Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {foundTour.highlights.map((hl, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                  <div className="w-6 h-6 rounded-md bg-[#008080]/10 text-[#008080] dark:text-[#3FCFC0] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transport Specs */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-2 shadow-sm">
            <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-2">
              <Car className="w-5 h-5 text-[#008080]" />
              <span>Included Transport & Pickup</span>
            </h3>
            <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
              {foundTour.includedTransport} (Includes hotel pick & drop)
            </p>
          </div>
        </div>

        {/* Reservation Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 p-6 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-lg space-y-6">
            <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4]">
              Book This Tour
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-400">Duration</span>
                <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">{foundTour.duration}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-400">Rate / Traveler</span>
                <span className="font-bold text-[#003366] dark:text-[#3FCFC0]">${foundTour.price} USD</span>
              </div>
            </div>

            <Link href={`/checkout/tour?tourPackageId=${foundTour.id}`}>
              <Button variant="primary" size="lg" className="w-full rounded-xl py-3 font-bold shadow-md">
                Book Tour Excursion
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
