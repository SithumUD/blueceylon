"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Navigation, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LocationPermissionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "granted" | "denied">("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Check if user has already made a choice
    const hasChosen = localStorage.getItem("blueceylon_location_choice");
    if (!hasChosen) {
      // Show modal after 1 second delay on site entry
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllowLocation = () => {
    setLocationStatus("loading");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationStatus("granted");
          localStorage.setItem("blueceylon_location_choice", "granted");
          setTimeout(() => setIsOpen(false), 1200);
        },
        (error) => {
          console.warn("Location permission denied or unavailable:", error.message);
          setLocationStatus("denied");
          localStorage.setItem("blueceylon_location_choice", "denied");
          setTimeout(() => setIsOpen(false), 1500);
        }
      );
    } else {
      setLocationStatus("denied");
      localStorage.setItem("blueceylon_location_choice", "denied");
      setTimeout(() => setIsOpen(false), 1500);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("blueceylon_location_choice", "dismissed");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="max-w-md w-full p-6 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-2xl space-y-5 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 text-[#008080] dark:text-[#3FCFC0] flex items-center justify-center mx-auto">
          <Navigation className="w-6 h-6 animate-pulse" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
            Enable Location Services?
          </h3>
          <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
            Allow Blue Ceylon to access your current GPS location to highlight nearby SLTDA-certified hotels, homestays, and tour guides around your area in Sri Lanka.
          </p>
        </div>

        {locationStatus === "granted" && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Location Detected! Showing Nearby Stays.</span>
          </div>
        )}

        {locationStatus === "denied" && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold text-center">
            Location Access Denied. Defaulting to All Regions.
          </div>
        )}

        {locationStatus === "idle" && (
          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAllowLocation}
              className="w-full rounded-xl font-bold shadow-md gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Allow Location Access</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="w-full text-xs text-gray-400 hover:text-gray-600"
            >
              Not Now, Browse Manually
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
