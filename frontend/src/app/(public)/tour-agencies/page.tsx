"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, Star, Mail, Phone, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_AGENCIES, AGENCY_SPECIALIZATION_LABELS, VEHICLE_FLEET_LABELS } from "@/lib/mock-data/agencies";
import { CITY_LABELS } from "@/lib/mock-data/businesses";
import { searchBusinesses } from "@/lib/api/catalog";

export default function TourAgenciesPage() {
  const [agencies, setAgencies] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    async function loadAgencies() {
      setLoading(true);
      try {
        const res = await searchBusinesses({ type: "TOUR_AGENCY" });
        if (isMounted && res?.content && res.content.length > 0) {
          setAgencies(res.content);
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to local mock data
      }
      if (isMounted) {
        setAgencies(MOCK_AGENCIES);
        setLoading(false);
      }
    }
    loadAgencies();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="border-b border-[#E4E9EA] dark:border-[#20353D] pb-6 space-y-2">
        <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#008080] dark:text-[#3FCFC0]">
          <Briefcase className="w-4 h-4" />
          <span>Accredited Travel Operators</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
          Registered Tour Agencies in Sri Lanka
        </h1>
        <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] max-w-2xl">
          Connect with SLTDA-licensed travel agencies offering custom itineraries, private safari fleets, and island-wide chauffeur expeditions.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-[#4A5A62]">Loading registered tour agencies...</div>
      ) : (
        /* Agency Cards List */
        <div className="space-y-6">
          {agencies.map((agency) => (
          <div
            key={agency.id}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm hover:shadow-md transition-all space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Cover Image */}
              <div className="md:col-span-4 aspect-[4/3] rounded-2xl overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                <img
                  src={agency.coverImageUrl}
                  alt={agency.name}
                  className="w-full h-full object-cover"
                />
                {agency.verificationStatus === "VERIFIED" && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="sltda" />
                  </div>
                )}
              </div>

              {/* Agency Details */}
              <div className="md:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs uppercase font-bold text-[#008080] dark:text-[#3FCFC0]">
                      License: {agency.sltdaLicenseNumber || agency.licenseNumber || "Verified"} • {agency.yearsInBusiness || agency.yearsInOperation || 1} Years in Business
                    </span>
                    <h2 className="font-display font-bold text-2xl text-[#0E1B22] dark:text-[#EAF2F4]">
                      {agency.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4]">
                    <Star className="w-4 h-4 text-[#FDA301] fill-[#FDA301]" />
                    <span>{agency.averageRating ?? 5.0}</span>
                    <span className="text-xs font-normal text-gray-400">({agency.reviewCount ?? 0})</span>
                  </div>
                </div>

                <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed">
                  {agency.description}
                </p>

                {/* Specializations & Fleet */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-[#15323D] text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Tour Specializations</span>
                    <div className="flex flex-wrap gap-1">
                      {(agency.specializations || []).map((sp: any) => (
                        <span key={sp} className="bg-white dark:bg-[#0F252E] px-2 py-0.5 rounded-md font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                          ✓ {AGENCY_SPECIALIZATION_LABELS[sp as keyof typeof AGENCY_SPECIALIZATION_LABELS] ?? sp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Vehicle Fleet Capabilities</span>
                    <div className="flex flex-wrap gap-1">
                      {(agency.fleetTypes || []).map((fl: any) => (
                        <span key={fl} className="bg-white dark:bg-[#0F252E] px-2 py-0.5 rounded-md font-semibold text-[#003366] dark:text-[#3FCFC0]">
                          🚘 {VEHICLE_FLEET_LABELS[fl as keyof typeof VEHICLE_FLEET_LABELS] ?? fl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Featured Package Bar */}
                {agency.featuredPackage && (
                  <div className="p-3 rounded-xl border border-[#008080]/30 bg-[#008080]/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#008080] dark:text-[#3FCFC0]">Featured Itinerary</span>
                      <div className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">{agency.featuredPackage.title} ({agency.featuredPackage.duration})</div>
                    </div>
                    <span className="font-bold text-base text-[#003366] dark:text-[#3FCFC0]">${agency.featuredPackage.price} {agency.featuredPackage.currency}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3 text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                    <span className="flex items-center gap-1 font-semibold">
                      <Mail className="w-3.5 h-3.5 text-[#008080]" />
                      {agency.contactEmail}
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-[#008080]" />
                      {agency.contactPhone}
                    </span>
                  </div>

                  <Link href={`/tour-agencies/${agency.id}`}>
                    <Button variant="primary" size="md" className="gap-1.5 rounded-xl font-bold">
                      <span>View Agency Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
