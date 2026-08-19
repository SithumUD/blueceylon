"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, ExternalLink, Compass } from "lucide-react";

interface MapViewProps {
  latitude: number;
  longitude: number;
  title: string;
  address?: string;
  height?: string;
  zoom?: number;
}

declare global {
  interface Window {
    google?: any;
  }
}

export function MapView({
  latitude,
  longitude,
  title,
  address,
  height = "320px",
  zoom = 15,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setLoadError(true);
      return;
    }

    if (window.google && window.google.maps) {
      renderMap();
      return;
    }

    const scriptId = "google-maps-view-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => renderMap();
      script.onerror = () => setLoadError(true);
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(interval);
          renderMap();
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [latitude, longitude, apiKey]);

  const renderMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps) return;

    const pos = { lat: latitude, lng: longitude };

    const map = new window.google.maps.Map(mapRef.current, {
      center: pos,
      zoom: zoom,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
    });

    const marker = new window.google.maps.Marker({
      position: pos,
      map: map,
      title: title,
      animation: window.google.maps.Animation.DROP,
    });

    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding:8px; font-family:sans-serif; max-width:220px;">
          <h4 style="margin:0 0 4px 0; font-size:14px; font-weight:700; color:#003366;">${title}</h4>
          ${address ? `<p style="margin:0; font-size:12px; color:#4A5A62;">${address}</p>` : ""}
          <a href="https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}" target="_blank" rel="noopener noreferrer" style="display:inline-block; margin-top:6px; font-size:11px; color:#008080; text-decoration:underline; font-weight:600;">Open in Google Maps &rarr;</a>
        </div>
      `,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  };

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#0E1B22] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#008080]" />
            <span>Property & Region Location</span>
          </h3>
          {address && <p className="text-xs text-[#4A5A62] mt-0.5">{address}</p>}
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold hover:bg-slate-50 transition-colors"
          style={{ borderColor: "#008080", color: "#008080" }}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Get Directions</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      </div>

      {/* Map Card */}
      <div className="relative rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor: "#E4E9EA", height }}>
        <div ref={mapRef} className="w-full h-full bg-slate-100" />

        {(!apiKey || loadError) && (
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#003366] flex items-center justify-center shadow-lg mb-3">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="font-semibold text-sm text-slate-900 mb-1">{title}</h4>
            <p className="text-xs text-slate-600 max-w-sm mb-3">
              {address || `Location coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
            </p>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#003366] text-white text-xs font-semibold hover:bg-[#002244] transition-colors flex items-center gap-1.5 shadow-md"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>View on Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
