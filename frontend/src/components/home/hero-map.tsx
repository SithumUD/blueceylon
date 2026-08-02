"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Hotspot {
  id: string;
  name: string;
  region: string;
  count: number;
  xPercent: number; // SVG % offset
  yPercent: number;
}

const REGION_HOTSPOTS: Hotspot[] = [
  { id: "ella", name: "Ella", region: "Hill Country", count: 34, xPercent: 58, yPercent: 62 },
  { id: "galle", name: "Galle Fort", region: "Southern Coast", count: 28, xPercent: 32, yPercent: 82 },
  { id: "sigiriya", name: "Sigiriya", region: "Cultural Triangle", count: 19, xPercent: 52, yPercent: 38 },
  { id: "kandy", name: "Kandy", region: "Central Kingdom", count: 42, xPercent: 48, yPercent: 50 },
  { id: "mirissa", name: "Mirissa", region: "South Ocean", count: 25, xPercent: 44, yPercent: 86 },
];

export function HeroMap() {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot>(REGION_HOTSPOTS[0]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#001F3D] via-[#003366] to-[#008080] text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-[#004080]">
      {/* Decorative ambient sheen */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-[#5CE1E6]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-[#FDA301]/10 blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Hero Content */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-[#FDA301]">
            <ShieldCheck className="w-4 h-4 text-[#FDA301]" />
            <span>Sri Lanka Tourism Development Authority Aligned</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
            Discover Verified Stays Across{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5CE1E6] via-[#FDA301] to-white">
              Paradise Island
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#A9BCC2] leading-relaxed max-w-xl font-sans">
            Authentic homestays, colonial forts, eco-lodges, and certified tour experts in Sri Lanka. Every property carries verified license credentials.
          </p>

          {/* Active Hotspot Preview Card */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FDA301] text-[#001F3D] flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5 fill-[#001F3D]" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-white text-lg leading-snug">
                  {activeHotspot.name}
                </h4>
                <p className="text-xs text-[#A9BCC2]">
                  {activeHotspot.region} • <span className="text-[#FDA301] font-semibold">{activeHotspot.count} verified listings</span>
                </p>
              </div>
            </div>

            <Link
              href={`/search?city=${encodeURIComponent(activeHotspot.name)}`}
              className="px-4 py-2 rounded-xl bg-white text-[#003366] font-semibold text-xs hover:bg-[#5CE1E6] transition-colors flex items-center gap-1.5 shadow-md"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Illustrated SVG Island Hotspot Map */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[340px] sm:min-h-[400px]">
          <div className="relative w-full max-w-md aspect-[4/5] flex items-center justify-center">
            {/* SVG Stylized Island Silhouette */}
            <svg
              viewBox="0 0 300 400"
              className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.3)] filter"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Island Path Graphic */}
              <path
                d="M130,40 C170,55 210,90 225,145 C240,200 230,260 200,310 C170,360 110,375 75,340 C45,310 40,240 60,180 C80,120 90,25 130,40 Z"
                fill="url(#islandGrad)"
                stroke="#5CE1E6"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <defs>
                <linearGradient id="islandGrad" x1="50" y1="40" x2="250" y2="360" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#004080" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#008080" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Render Interactive Hotspot Pins over SVG */}
            {REGION_HOTSPOTS.map((hotspot) => {
              const isActive = activeHotspot.id === hotspot.id;
              return (
                <button
                  key={hotspot.id}
                  onClick={() => setActiveHotspot(hotspot)}
                  style={{ top: `${hotspot.yPercent}%`, left: `${hotspot.xPercent}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 ${
                    isActive ? "scale-125 z-20" : "scale-100 opacity-85 hover:opacity-100 z-10"
                  }`}
                  title={`${hotspot.name} (${hotspot.count} stays)`}
                >
                  <span className="relative flex h-5 w-5 items-center justify-center">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isActive ? "bg-[#FDA301]" : "bg-[#5CE1E6]"
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-4 w-4 border-2 border-white items-center justify-center text-[9px] font-bold text-[#001F3D] ${
                        isActive ? "bg-[#FDA301]" : "bg-[#5CE1E6]"
                      }`}
                    />
                  </span>
                  <span
                    className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md tracking-tight whitespace-nowrap block transition-colors ${
                      isActive
                        ? "bg-[#FDA301] text-[#001F3D] font-bold shadow-md"
                        : "bg-[#001F3D]/80 text-white border border-white/20"
                    }`}
                  >
                    {hotspot.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
