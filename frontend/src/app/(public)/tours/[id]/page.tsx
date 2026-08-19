"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Compass, Clock, MapPin, Check, ArrowLeft, ShieldCheck, Car, Users, Calendar, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_BUSINESSES, CITY_LABELS } from "@/lib/mock-data/businesses";
import { MOCK_GUIDES, GUIDE_SPECIALTY_LABELS } from "@/lib/mock-data/guides";
import { VEHICLE_TYPE_LABELS } from "@/lib/mock-data/businesses";
import { getTourById } from "@/lib/api/catalog";

export default function TourDetailPage() {
  const params = useParams();
  const tourId = params.id as string;

  const [foundTour, setFoundTour] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    async function loadTour() {
      if (!tourId) return;
      setLoading(true);
      try {
        const res: any = await getTourById(tourId);
        if (isMounted && res && res.id) {
          setFoundTour({
            ...res,
            durationLabel: res.durationLabel || `${res.durationDays || 1} Day(s)`,
            location: CITY_LABELS[res.location as keyof typeof CITY_LABELS] ?? res.location,
            sltdaVerified: true,
            coverImageUrl: res.coverImageUrl || res.imageUrls?.[0] || "https://images.unsplash.com/photo-1534177616072-ef7dc120449d",
            inclusions: res.inclusions || [],
            itineraryDays: res.itineraryDays || [],
          });
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to local mock data lookup
      }

      let mock = MOCK_BUSINESSES.flatMap((b) =>
        (b.tourPackages || []).map((tp) => ({
          id: tp.id,
          title: tp.title,
          description: tp.description,
          durationLabel: tp.durationLabel,
          price: tp.price,
          currency: tp.currency,
          pricingUnit: "PER_PERSON" as const,
          inclusions: tp.inclusions,
          transportModeIncluded: tp.transportModeIncluded,
          coverImageUrl: tp.imageUrls[0],
          providerName: b.name,
          providerId: b.id,
          providerType: "HOTEL",
          location: CITY_LABELS[b.city] ?? b.city,
          sltdaVerified: b.verificationStatus === "VERIFIED",
          avatarUrl: b.host.avatarUrl,
          itineraryDays: tp.itineraryDays,
        }))
      ).find((t) => t.id === tourId);

      if (!mock) {
        const guide = MOCK_GUIDES.find(g => `g-tour-${g.id}` === tourId) || MOCK_GUIDES[0];
        mock = {
          id: `g-tour-${guide.id}`,
          title: `${guide.name} — Private Excursion & Wildlife Tour`,
          description: guide.description,
          durationLabel: "Full Day (8 Hours)",
          price: guide.dailyRate,
          currency: guide.currency,
          pricingUnit: "PER_PERSON" as const,
          inclusions: guide.specialtyAreas.map((sa, i) => ({ id: `sa-${i}`, name: GUIDE_SPECIALTY_LABELS[sa] })),
          transportModeIncluded: guide.vehicleType,
          coverImageUrl: guide.coverImageUrl,
          providerName: guide.name,
          providerId: guide.id,
          providerType: "GUIDE",
          location: CITY_LABELS[guide.city] ?? guide.city,
          sltdaVerified: guide.verificationStatus === "VERIFIED",
          avatarUrl: guide.avatarUrl,
          itineraryDays: [
            {
              dayNumber: 1,
              title: "Custom Guided Excursion",
              description: guide.description,
              destinations: [CITY_LABELS[guide.city] ?? guide.city, "Surrounding Wilderness & Historic Trails"],
            }
          ],
        };
      }

      if (isMounted) {
        setFoundTour(mock);
        setLoading(false);
      }
    }
    loadTour();
    return () => {
      isMounted = false;
    };
  }, [tourId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8 text-center text-sm text-[#4A5A62]">
        Loading tour details...
      </div>
    );
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
          src={foundTour.coverImageUrl}
          alt={foundTour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {foundTour.sltdaVerified && <Badge variant="sltda" />}
              <span className="text-xs uppercase font-bold text-[#5CE1E6] bg-black/50 px-2.5 py-1 rounded-full">
                {foundTour.durationLabel}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold">
              {foundTour.title}
            </h1>
            <p className="text-xs text-gray-300">
              Provided by {foundTour.providerName} • Location: {foundTour.location}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-gray-300">Excursion Rate</span>
            <div className="text-3xl font-bold font-sans text-[#5CE1E6]">
              ${foundTour.price} <span className="text-xs text-gray-300">{foundTour.currency} / person</span>
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

          {/* Highlights / Inclusions */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
              Excursion Inclusions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {foundTour.inclusions.map((hl: any) => (
                <div key={hl.id} className="flex items-center gap-2 text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                  <div className="w-6 h-6 rounded-md bg-[#008080]/10 text-[#008080] dark:text-[#3FCFC0] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{hl.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Day-by-Day Itinerary (Rich UX Backend Data Integration) */}
          {foundTour.itineraryDays && foundTour.itineraryDays.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-4 shadow-sm">
              <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-2">
                <Map className="w-5 h-5 text-[#008080]" />
                <span>Tour Itinerary</span>
              </h3>
              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-150 dark:before:bg-gray-800">
                {foundTour.itineraryDays.map((day: any) => (
                  <div key={day.dayNumber} className="relative pl-8 space-y-1">
                    <div className="absolute left-0 w-7.5 h-7.5 rounded-full bg-[#008080] text-white text-xs font-bold flex items-center justify-center border-4 border-white dark:border-[#0F252E]">
                      {day.dayNumber}
                    </div>
                    <h4 className="font-display font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4]">
                      Day {day.dayNumber}: {day.title}
                    </h4>
                    <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed">
                      {day.description}
                    </p>
                    {day.destinations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {day.destinations.map((dest: any, i: any) => (
                          <span key={i} className="text-[10px] bg-gray-50 dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2] px-2 py-0.5 rounded-md border border-[#E4E9EA] dark:border-[#20353D]">
                            📍 {dest}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transport Specs */}
          {foundTour.transportModeIncluded && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-2 shadow-sm">
              <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-2">
                <Car className="w-5 h-5 text-[#008080]" />
                <span>Included Transport & Pickup</span>
              </h3>
              <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                Chauffeur vehicle provided: <span className="font-bold text-[#003366] dark:text-[#3FCFC0]">{VEHICLE_TYPE_LABELS[foundTour.transportModeIncluded as keyof typeof VEHICLE_TYPE_LABELS] ?? foundTour.transportModeIncluded}</span> (Includes hotel pick & drop)
              </p>
            </div>
          )}
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
                <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">{foundTour.durationLabel}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-400">Rate / Traveler</span>
                <span className="font-bold text-[#003366] dark:text-[#3FCFC0]">${foundTour.price} {foundTour.currency}</span>
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
