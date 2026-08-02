"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Star, ShieldCheck, Car, Languages, Calendar, Award, CheckCircle, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_GUIDES } from "@/lib/mock-data/guides";

export default function GuideProfilePage() {
  const params = useParams();
  const guideId = params.id as string;

  const guide = MOCK_GUIDES.find((g) => g.id === guideId) || MOCK_GUIDES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Cover Banner */}
      <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden border border-[#E4E9EA] dark:border-[#20353D]">
        <img
          src={guide.coverImage}
          alt={guide.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <img
              src={guide.avatar}
              alt={guide.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#FDA301] shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold">
                  {guide.name}
                </h1>
                {guide.sltdaVerified && <Badge variant="sltda" />}
              </div>
              <p className="text-xs text-gray-200">{guide.title}</p>
              <div className="flex items-center gap-1 text-xs text-[#FDA301] font-semibold mt-1">
                <Star className="w-3.5 h-3.5 fill-[#FDA301]" />
                <span>{guide.rating}</span>
                <span className="text-gray-300">({guide.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-300">Daily Hire Rate</span>
            <div className="text-2xl font-bold font-sans text-[#5CE1E6]">
              ${guide.dailyRateUSD} <span className="text-xs text-gray-300">USD / day</span>
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
                  Certified National Tourist Guide Lecturer
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
              {guide.bio}
            </p>
          </div>

          {/* Languages Spoken */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-2">
              <Languages className="w-5 h-5 text-[#008080]" />
              <span>Languages Spoken</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {guide.languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4]"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-3">
            <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-2">
              <Car className="w-5 h-5 text-[#008080]" />
              <span>Private Transport Vehicle</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block">Vehicle Type</span>
                <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">{guide.vehicle.type}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Model & Specification</span>
                <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">{guide.vehicle.model}</span>
              </div>
            </div>
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
                <span className="font-bold text-[#003366] dark:text-[#3FCFC0]">${guide.dailyRateUSD} USD</span>
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
