"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Sun, Moon, Clock, ArrowLeft, ShieldCheck, Check, Building, Utensils, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_BUSINESSES } from "@/lib/mock-data/businesses";

export default function ExtraPackageDetailPage() {
  const params = useParams();
  const packageId = params.id as string;

  // Search day out or night out packages
  let foundPkg: any = null;
  let pkgType: "DAYOUT" | "NIGHTOUT" = "DAYOUT";

  for (const b of MOCK_BUSINESSES) {
    const doPkg = (b.dayOutPackages || []).find((d) => d.id === packageId);
    if (doPkg) {
      foundPkg = { ...doPkg, hotelName: b.name, hotelId: b.id, city: b.location.city, sltdaVerified: b.sltdaVerified, address: b.location.address };
      pkgType = "DAYOUT";
      break;
    }
    const noPkg = (b.nightOutPackages || []).find((n) => n.id === packageId);
    if (noPkg) {
      foundPkg = { ...noPkg, hotelName: b.name, hotelId: b.id, city: b.location.city, sltdaVerified: b.sltdaVerified, address: b.location.address };
      pkgType = "NIGHTOUT";
      break;
    }
  }

  if (!foundPkg) {
    const b = MOCK_BUSINESSES[0];
    foundPkg = {
      id: "do-101",
      title: "Ella Infinity Pool & Scenic Lunch Pass",
      description: "Full daytime access (09:00–18:00) to the infinity plunge pool overlooking Ella gap, welcome fresh king coconut, traditional 3-course rice & curry buffet lunch, and afternoon Ceylon tea.",
      price: 35,
      pricingUnit: "PER_PERSON",
      startTime: "09:00",
      endTime: "18:00",
      inclusions: ["Infinity Plunge Pool Access", "3-Course Organic Lunch", "Welcome King Coconut", "Sunbed & Towel Service", "High-Speed Wi-Fi Access"],
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      hotelName: b.name,
      hotelId: b.id,
      city: b.location.city,
      sltdaVerified: b.sltdaVerified,
      address: b.location.address,
    };
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link href="/extra-packages" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006666] dark:text-[#3FCFC0] hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Extra Packages</span>
      </Link>

      {/* Header Banner */}
      <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden border border-[#E4E9EA] dark:border-[#20353D]">
        <img
          src={foundPkg.image}
          alt={foundPkg.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {foundPkg.sltdaVerified && <Badge variant="sltda" />}
              <span className="text-xs uppercase font-bold text-[#FDA301] bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Time Slot: {foundPkg.startTime} – {foundPkg.endTime}</span>
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold">
              {foundPkg.title}
            </h1>
            <p className="text-xs text-gray-300">
              Host Hotel: {foundPkg.hotelName} • Location: {foundPkg.city}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-300">Package Price</span>
            <div className="text-3xl font-bold font-sans text-[#FDA301]">
              ${foundPkg.price} <span className="text-xs text-gray-300">USD</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Package Overview */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
              Package Description & Details
            </h3>
            <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed">
              {foundPkg.description}
            </p>
          </div>

          {/* Inclusions */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
              Full Inclusions Checklist
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {foundPkg.inclusions.map((inc: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                  <div className="w-6 h-6 rounded-md bg-[#FDA301]/10 text-[#FDA301] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-[#001F3D]" />
                  </div>
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Host Hotel Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] flex items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#008080] dark:text-[#3FCFC0]">
                Provided by Partner Hotel
              </span>
              <h4 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4]">
                {foundPkg.hotelName}
              </h4>
              <p className="text-xs text-gray-400">{foundPkg.address}</p>
            </div>
            <Link href={`/business/${foundPkg.hotelId}`}>
              <Button variant="secondary" size="sm" className="text-xs font-semibold">
                View Hotel Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Sidebar Reservation */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 p-6 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-lg space-y-6">
            <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4]">
              Reserve Experience
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-400">Access Hours</span>
                <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">{foundPkg.startTime} – {foundPkg.endTime}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-400">Price</span>
                <span className="font-bold text-[#003366] dark:text-[#3FCFC0]">${foundPkg.price} USD</span>
              </div>
            </div>

            <Link href={`/checkout/${pkgType.toLowerCase()}?businessId=${foundPkg.hotelId}&${pkgType === "DAYOUT" ? "dayOutId" : "nightOutId"}=${foundPkg.id}`}>
              <Button variant="gold" size="lg" className="w-full rounded-xl py-3 font-bold shadow-md">
                Book Extra Package
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
