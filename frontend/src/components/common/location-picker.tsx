"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Compass, AlertCircle, Check } from "lucide-react";

interface LocationPickerProps {
  latitude: string | number;
  longitude: string | number;
  onChange: (lat: number, lng: number) => void;
  cityName?: string;
}

// Sri Lanka default coordinates (Colombo center fallback)
const DEFAULT_LAT = 6.9271;
const DEFAULT_LNG = 79.8612;

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  COLOMBO: { lat: 6.9271, lng: 79.8612 },
  KANDY: { lat: 7.2906, lng: 80.6337 },
  GALLE: { lat: 6.0535, lng: 80.221 },
  ELLA: { lat: 6.8667, lng: 81.0466 },
  SIGIRIYA: { lat: 7.957, lng: 80.7603 },
  MIRISSA: { lat: 5.9483, lng: 80.4716 },
  NUWARA_ELIYA: { lat: 6.9497, lng: 80.7891 },
  YALA: { lat: 6.3694, lng: 81.5173 },
  TRINCOMALEE: { lat: 8.5874, lng: 81.2152 },
  NEGOMBO: { lat: 7.2008, lng: 79.8737 },
  ANURADHAPURA: { lat: 8.3114, lng: 80.4037 },
  MATARA: { lat: 5.9549, lng: 80.555 },
};

declare global {
  interface Window {
    google?: any;
    initGoogleMapPicker?: () => void;
  }
}

export function LocationPicker({ latitude, longitude, onChange, cityName }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  const parsedLat = Number(latitude) || (cityName && CITY_COORDINATES[cityName]?.lat) || DEFAULT_LAT;
  const parsedLng = Number(longitude) || (cityName && CITY_COORDINATES[cityName]?.lng) || DEFAULT_LNG;

  const [currentLat, setCurrentLat] = useState<number>(parsedLat);
  const [currentLng, setCurrentLng] = useState<number>(parsedLng);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Sync internal state when parent props change
  useEffect(() => {
    if (latitude && longitude) {
      const latNum = Number(latitude);
      const lngNum = Number(longitude);
      if (!isNaN(latNum) && !isNaN(lngNum)) {
        setCurrentLat(latNum);
        setCurrentLng(lngNum);
        if (markerInstance.current) {
          markerInstance.current.setPosition({ lat: latNum, lng: lngNum });
        }
        if (googleMapInstance.current) {
          googleMapInstance.current.panTo({ lat: latNum, lng: lngNum });
        }
      }
    } else if (cityName && CITY_COORDINATES[cityName]) {
      const coords = CITY_COORDINATES[cityName];
      setCurrentLat(coords.lat);
      setCurrentLng(coords.lng);
      onChange(coords.lat, coords.lng);
    }
  }, [latitude, longitude, cityName]);

  // Load Google Maps Script
  useEffect(() => {
    if (!apiKey) {
      setLoadError(true);
      return;
    }

    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    const scriptId = "google-maps-picker-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
        initMap();
      };
      script.onerror = () => {
        setLoadError(true);
      };
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(interval);
          initMap();
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [apiKey]);

  const initMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps) return;

    const initialPos = { lat: currentLat, lng: currentLng };

    const map = new window.google.maps.Map(mapRef.current, {
      center: initialPos,
      zoom: 14,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    });

    const marker = new window.google.maps.Marker({
      position: initialPos,
      map: map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
      title: "Drag to pin exact property location",
    });

    googleMapInstance.current = map;
    markerInstance.current = marker;

    // Handle marker drag
    marker.addListener("dragend", (e: any) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      setCurrentLat(newLat);
      setCurrentLng(newLng);
      onChange(newLat, newLng);
    });

    // Handle map click
    map.addListener("click", (e: any) => {
      const clickLat = e.latLng.lat();
      const clickLng = e.latLng.lng();
      marker.setPosition({ lat: clickLat, lng: clickLng });
      setCurrentLat(clickLat);
      setCurrentLng(clickLng);
      onChange(clickLat, clickLng);
    });

    setIsLoaded(true);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLat = pos.coords.latitude;
          const newLng = pos.coords.longitude;
          setCurrentLat(newLat);
          setCurrentLng(newLng);
          onChange(newLat, newLng);
          if (markerInstance.current) {
            markerInstance.current.setPosition({ lat: newLat, lng: newLng });
          }
          if (googleMapInstance.current) {
            googleMapInstance.current.panTo({ lat: newLat, lng: newLng });
            googleMapInstance.current.setZoom(16);
          }
        },
        (err) => {
          alert("Could not access your location. Please select manually on the map.");
        }
      );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs uppercase tracking-widest font-semibold" style={{ color: "#4A5A62" }}>
          Select Location on Google Map <span style={{ color: "#D64545" }}>*</span>
        </label>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold hover:bg-slate-50 transition-colors"
          style={{ borderColor: "#008080", color: "#008080" }}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Use My Current Location</span>
        </button>
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor: "#E4E9EA" }}>
        {/* Real Google Map Container */}
        <div ref={mapRef} className="w-full h-72 bg-slate-100" />

        {/* Fallback View if API Key is missing or loading */}
        {(!apiKey || loadError) && (
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#003366] flex items-center justify-center shadow-lg mb-3">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="font-semibold text-sm text-slate-900 mb-1">Interactive Map Location Selector</h4>
            <p className="text-xs text-slate-600 max-w-sm mb-3">
              Click anywhere on the map or drag the location pin to mark your exact property location.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="px-3 py-1 rounded-lg bg-white border text-xs font-medium text-slate-700 shadow-sm flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#008080]" />
                <span>Lat: {currentLat.toFixed(5)}, Lng: {currentLng.toFixed(5)}</span>
              </div>
            </div>
            {!apiKey && (
              <p className="mt-2 text-[11px] text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Tip: Add <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to <code>.env.local</code> to activate live satellite vector tiles.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Location Selected Confirmation Badge */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border bg-emerald-50/50" style={{ borderColor: "rgba(16,185,129,0.2)" }}>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-medium text-emerald-900">
            Coordinates Selected: <strong className="font-bold">{currentLat.toFixed(5)}, {currentLng.toFixed(5)}</strong>
          </span>
        </div>
        <span className="text-[11px] text-emerald-700 font-semibold">Ready for search distance calculations</span>
      </div>
    </div>
  );
}
