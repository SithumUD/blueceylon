"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Navigation, ExternalLink, Compass } from "lucide-react";

interface MapViewProps {
  latitude: number;
  longitude: number;
  title: string;
  address?: string;
  height?: string;
  zoom?: number;
}

export function MapView({
  latitude,
  longitude,
  title,
  address,
  height = "340px",
  zoom = 15,
}: MapViewProps) {
  const [mapType, setMapType] = useState<"osm" | "google">("osm");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Safe coordinates with fallback to Sri Lanka center
  const validLat = Number.isFinite(Number(latitude)) && Number(latitude) !== 0 ? Number(latitude) : 6.9271;
  const validLng = Number.isFinite(Number(longitude)) && Number(longitude) !== 0 ? Number(longitude) : 79.8612;

  const delta = 0.012;
  const bbox = `${validLng - delta},${validLat - delta},${validLng + delta},${validLat + delta}`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${validLat},${validLng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${validLat},${validLng}`;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#008080] dark:text-[#3FCFC0]" />
            <span>Property & Surroundings Map</span>
          </h3>
          {address && <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] mt-0.5">{address}</p>}
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold text-[#008080] dark:text-[#3FCFC0] border-[#008080]/30 dark:border-[#3FCFC0]/30 hover:bg-[#008080]/10 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Get Directions in Google Maps</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      </div>

      {/* Interactive Map Frame */}
      <div 
        className="relative rounded-2xl overflow-hidden border border-[#E4E9EA] dark:border-[#20353D] shadow-sm bg-slate-100 dark:bg-[#0F252E]" 
        style={{ height }}
      >
        <iframe
          title={`Map location for ${title}`}
          src={osmEmbedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
        />

        {/* Location badge overlay */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-[#0F252E]/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] shadow-md flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-[#1F9D6C] animate-ping" />
          <span className="font-bold text-[#0E1B22] dark:text-[#EAF2F4] line-clamp-1">{title}</span>
        </div>
      </div>
    </div>
  );
}
