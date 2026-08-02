"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sun, Moon, Clock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_BUSINESSES } from "@/lib/mock-data/businesses";

export default function ExtraPackagesPage() {
  const [packageType, setPackageType] = useState<"ALL" | "DAYOUT" | "NIGHTOUT">("ALL");

  // Collect Day Out & Night Out packages
  const dayOutList = MOCK_BUSINESSES.flatMap((b) =>
    (b.dayOutPackages || []).map((pkg) => ({
      ...pkg,
      type: "DAYOUT" as const,
      hotelName: b.name,
      hotelId: b.id,
      city: b.location.city,
      sltdaVerified: b.sltdaVerified,
    }))
  );

  const nightOutList = MOCK_BUSINESSES.flatMap((b) =>
    (b.nightOutPackages || []).map((pkg) => ({
      ...pkg,
      type: "NIGHTOUT" as const,
      hotelName: b.name,
      hotelId: b.id,
      city: b.location.city,
      sltdaVerified: b.sltdaVerified,
    }))
  );

  const allExtraPackages = [...dayOutList, ...nightOutList].filter((pkg) => {
    if (packageType !== "ALL" && pkg.type !== packageType) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E9EA] dark:border-[#20353D] pb-6">
        <div>
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#FDA301] mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Short-Stay Hotel Experiences</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
            Hotel Day Out & Night Out Packages
          </h1>
          <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
            Enjoy daytime pool/lunch passes (09:00–18:00) or romantic evening dinners (19:00–23:00) without booking a room
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] rounded-xl">
          {[
            { id: "ALL", label: "All Packages" },
            { id: "DAYOUT", label: "☀️ Day Out Passes" },
            { id: "NIGHTOUT", label: "🌙 Night Out Dining" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPackageType(item.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                packageType === item.id
                  ? "bg-[#003366] text-white"
                  : "text-[#4A5A62] dark:text-[#A9BCC2] hover:text-[#0E1B22]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Package Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allExtraPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`p-6 rounded-3xl bg-white dark:bg-[#0F252E] border shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
              pkg.type === "DAYOUT" ? "border-[#FDA301]/40" : "border-[#008080]/40"
            }`}
          >
            <div className="space-y-4">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
                {pkg.sltdaVerified && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="sltda" />
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5">
                  {pkg.type === "DAYOUT" ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-[#FDA301]" />
                      <span>Day Pass ({pkg.startTime} – {pkg.endTime})</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-[#5CE1E6]" />
                      <span>Evening ({pkg.startTime} – {pkg.endTime})</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#008080] dark:text-[#3FCFC0] tracking-wider">
                  Hotel: {pkg.hotelName} • {pkg.city}
                </span>
                <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
                  {pkg.title}
                </h3>
                <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] line-clamp-2 mt-1">
                  {pkg.description}
                </p>
              </div>

              {/* Inclusions */}
              <div className="space-y-1 pt-2 border-t border-[#E4E9EA] dark:border-[#20353D]">
                <span className="text-[10px] uppercase font-bold text-gray-400">Package Inclusions</span>
                <div className="flex flex-wrap gap-1.5">
                  {pkg.inclusions.map((inc, idx) => (
                    <span key={idx} className="text-[11px] bg-gray-100 dark:bg-[#15323D] px-2.5 py-0.5 rounded-full font-medium text-[#0E1B22] dark:text-[#EAF2F4]">
                      ✓ {inc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E4E9EA] dark:border-[#20353D] flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block">Package Price</span>
                <span className="font-sans text-2xl font-bold text-[#003366] dark:text-[#3FCFC0]">
                  ${pkg.price}
                </span>
                <span className="text-xs text-gray-400"> USD</span>
              </div>
              <Link href={`/extra-packages/${pkg.id}`}>
                <Button variant={pkg.type === "DAYOUT" ? "gold" : "secondary"} size="md" className="gap-1.5 rounded-xl font-bold">
                  <span>View Package Details</span>
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
