"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { User, ShieldCheck, Star, Languages, Car, MapPin, ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_GUIDES, GUIDE_SPECIALTY_LABELS } from "@/lib/mock-data/guides";
import { VEHICLE_TYPE_LABELS } from "@/lib/mock-data/businesses";
import { searchBusinesses } from "@/lib/api/catalog";

export default function TourGuidesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-8 text-center text-sm text-[#4A5A62]">Loading guides...</div>}>
      <TourGuidesPageContent />
    </Suspense>
  );
}

function TourGuidesPageContent() {
  const searchParams = useSearchParams();
  const queryCity = searchParams.get("city")?.toUpperCase() || "ALL";

  const [selectedLanguage, setSelectedLanguage] = useState("ALL");
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    let isMounted = true;
    async function loadGuides() {
      setLoading(true);
      try {
        const res = await searchBusinesses({ type: "TOUR_GUIDE" });
        if (isMounted && res?.content && res.content.length > 0) {
          setGuides(res.content);
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to local mock data
      }
      if (isMounted) {
        setGuides(MOCK_GUIDES);
        setLoading(false);
      }
    }
    loadGuides();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredGuides = guides.filter((g) => {
    if (selectedLanguage !== "ALL" && g.languagesSpoken && !g.languagesSpoken.includes(selectedLanguage)) {
      return false;
    }
    if (queryCity !== "ALL" && g.city !== queryCity && !g.description?.toLowerCase().includes(queryCity.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E9EA] dark:border-[#20353D] pb-6">
        <div>
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#FDA301] mb-1">
            <User className="w-4 h-4 text-[#001F3D]" />
            <span>SLTDA Certified Tourist Guides</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
            Licensed Private Tour Guides
          </h1>
          <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
            Book national, chauffeur, and site-specific licensed tourist guides across Sri Lanka
          </p>
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2]">
            Language:
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-white dark:bg-[#0F252E] text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none"
          >
            <option value="ALL">All Languages</option>
            <option value="English">English</option>
            <option value="German">German</option>
            <option value="French">French</option>
          </select>
        </div>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            className="p-6 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={guide.avatarUrl}
                  alt={guide.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#FDA301] shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {guide.verificationStatus === "VERIFIED" && <Badge variant="sltda" />}
                    <div className="flex items-center gap-1 text-xs font-bold text-[#FDA301]">
                      <Star className="w-3.5 h-3.5 fill-[#FDA301]" />
                      <span>{guide.averageRating ?? 5.0}</span>
                      <span className="text-[10px] text-gray-400">({guide.reviewCount ?? 0})</span>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
                    {guide.name}
                  </h3>
                  {guide.tagline && (
                    <p className="text-xs text-[#008080] dark:text-[#3FCFC0] font-semibold">
                      {guide.tagline}
                    </p>
                  )}
                  <span className="text-[11px] font-mono text-gray-400 block">
                    License: {guide.sltdaLicenseNumber || guide.licenseNumber || "Verified"}{guide.licenseType ? ` (${String(guide.licenseType).replace(/_/g, " ")})` : ""}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] line-clamp-3 leading-relaxed">
                {guide.description}
              </p>

              {/* Spoken Languages & Vehicle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-[#15323D] text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Languages Spoken</span>
                  <div className="flex flex-wrap gap-1">
                    {(guide.languagesSpoken || []).map((lang: any, idx: any) => (
                      <span key={idx} className="bg-white dark:bg-[#0F252E] px-2 py-0.5 rounded-md font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                        🌐 {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Guide Transport</span>
                  <span className="font-semibold text-[#003366] dark:text-[#3FCFC0]">
                    🚘 {guide.vehicleType ? (VEHICLE_TYPE_LABELS[guide.vehicleType as keyof typeof VEHICLE_TYPE_LABELS] ?? guide.vehicleType) : "Walking / Client Vehicle"}
                    {guide.vehicleModel && ` (${guide.vehicleModel})`}
                  </span>
                </div>
              </div>

              {/* Specialties */}
              {guide.specialtyAreas && guide.specialtyAreas.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-[#E4E9EA] dark:border-[#20353D]">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Specialty Areas</span>
                  <div className="flex flex-wrap gap-1">
                    {(guide.specialtyAreas || []).map((spec: any) => (
                      <span key={spec} className="text-[11px] bg-gray-100 dark:bg-[#15323D] px-2.5 py-0.5 rounded-full font-medium text-[#0E1B22] dark:text-[#EAF2F4]">
                        ✓ {GUIDE_SPECIALTY_LABELS[spec as keyof typeof GUIDE_SPECIALTY_LABELS] ?? spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E4E9EA] dark:border-[#20353D] flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block">Daily Rate</span>
                <span className="font-sans text-2xl font-bold text-[#003366] dark:text-[#3FCFC0]">
                  ${guide.dailyRate ?? 80}
                </span>
                <span className="text-xs text-gray-400"> {guide.currency || "USD"} / day</span>
              </div>
              <Link href={`/tour-guides/${guide.id}`}>
                <Button variant="gold" size="md" className="gap-1.5 rounded-xl font-bold">
                  <span>View Guide Profile</span>
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
