"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Star, ShieldCheck, Car, Languages, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_GUIDES, LICENSE_TYPE_LABELS } from "@/lib/mock-data/guides";
import { VEHICLE_TYPE_LABELS, CITY_LABELS } from "@/lib/mock-data/businesses";
import { getBusinessById } from "@/lib/api/catalog";
import { MapView } from "@/components/common/map-view";

export default function GuideProfilePage() {
  const params = useParams();
  const guideId = params.id as string;

  const [guide, setGuide] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    async function loadGuide() {
      if (!guideId) return;
      setLoading(true);
      try {
        const res: any = await getBusinessById(guideId);
        if (isMounted && res && res.id) {
          setGuide({
            ...res,
            sltdaLicenseNumber: res.sltdaLicenseNumber || res.licenseNumber || "SLTDA/G/2026",
            certifications: res.certifications || ["Wilderness First Aid", "SLTDA Tour Guide License"],
            languagesSpoken: res.languagesSpoken || ["English"],
            dailyRate: res.dailyRate || 120,
            halfDayRate: res.halfDayRate || 70,
            currency: res.currency || "USD",
          });
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to local mock data lookup
      }

      const mock = MOCK_GUIDES.find((g) => g.id === guideId) || MOCK_GUIDES[0];
      if (isMounted) {
        setGuide(mock);
        setLoading(false);
      }
    }
    loadGuide();
    return () => {
      isMounted = false;
    };
  }, [guideId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center text-sm text-[#4A5A62]">
        Loading guide profile...
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center text-sm text-[#4A5A62]">
        Guide profile not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Cover Banner */}
      <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden border border-[#E4E9EA] dark:border-[#20353D]">
        <img
          src={guide.coverImageUrl}
          alt={guide.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <img
              src={guide.avatarUrl}
              alt={guide.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#FDA301] shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold">
                  {guide.name}
                </h1>
                {guide.verificationStatus === "VERIFIED" && <Badge variant="sltda" />}
              </div>
              <p className="text-xs text-gray-200">{guide.tagline}</p>
              <div className="flex items-center gap-1 text-xs text-[#FDA301] font-semibold mt-1">
                <Star className="w-3.5 h-3.5 fill-[#FDA301]" />
                <span>{guide.averageRating}</span>
                <span className="text-gray-300">({guide.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-gray-300">Daily Hire Rate</span>
            <div className="text-2xl font-bold font-sans text-[#5CE1E6]">
              ${guide.dailyRate} <span className="text-xs text-gray-300">{guide.currency} / day</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Bio & Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* SLTDA Accreditation Card */}
          <div className="p-5 rounded-2xl bg-[#FDA301]/10 border border-[#FDA301]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[#FDA301]" />
              <div>
                <h4 className="font-display font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4]">
                  {LICENSE_TYPE_LABELS[guide.licenseType as keyof typeof LICENSE_TYPE_LABELS] ?? guide.licenseType}
                </h4>
                <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                  Licensed by Sri Lanka Tourism Development Authority ({guide.sltdaLicenseNumber})
                </p>
              </div>
            </div>
          </div>

          {/* About Bio */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
              About {guide.name}
            </h3>
            <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed">
              {guide.description}
            </p>
          </div>

          {/* Languages Spoken */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-2">
              <Languages className="w-5 h-5 text-[#008080]" />
              <span>Languages Spoken</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {guide.languagesSpoken.map((lang: any, idx: any) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4]"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          {guide.certifications.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#008080]" />
                <span>Certifications & Badges</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                {guide.certifications.map((cert: any, idx: any) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#008080]/10 text-[#008080] flex items-center justify-center">
                      ✓
                    </div>
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Info */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-3">
            <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-2">
              <Car className="w-5 h-5 text-[#008080]" />
              <span>Private Transport Vehicle</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block">Vehicle Type</span>
                <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                  {VEHICLE_TYPE_LABELS[guide.vehicleType as keyof typeof VEHICLE_TYPE_LABELS] ?? guide.vehicleType}
                </span>
              </div>
              {guide.vehicleModel && (
                <div>
                  <span className="text-gray-400 block">Model & Specification</span>
                  <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                    {guide.vehicleModel} {guide.vehicleAirConditioned ? "(A/C)" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Guide Base Location Google Map */}
          <div className="pt-2">
            <MapView
              latitude={Number(guide.latitude || 6.8667)}
              longitude={Number(guide.longitude || 81.0466)}
              title={`${guide.name} — Guide Location`}
              address={guide.addressLine ? `${guide.addressLine}, ${CITY_LABELS[guide.city] || guide.city}` : `${CITY_LABELS[guide.city] || guide.city || "Ella"}, Sri Lanka`}
            />
          </div>
        </div>

        {/* Right Hiring CTA */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 p-6 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-lg space-y-6">
            <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4]">
              Reserve Private Guide
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-400">Daily Rate</span>
                <span className="font-bold text-[#003366] dark:text-[#3FCFC0]">${guide.dailyRate} {guide.currency}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-400">Half Day Rate</span>
                <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">${guide.halfDayRate} {guide.currency}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-400">Includes Fuel & Driver Allowance</span>
                <span className="font-semibold text-emerald-600">✓ Included</span>
              </div>
            </div>

            <Link href={`/checkout/tour?guideId=${guide.id}`}>
              <Button variant="gold" size="lg" className="w-full rounded-xl py-3 font-bold shadow-md">
                Book Guide Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
