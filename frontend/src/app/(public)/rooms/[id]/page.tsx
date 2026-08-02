"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, BedDouble, Users, Maximize, Mountain, Wind, 
  CigaretteOff, Clock, ShieldCheck, MapPin, Star, CalendarDays,
  CheckCircle2, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_BUSINESSES } from "@/lib/mock-data/businesses";
import { Badge } from "@/components/ui/badge";

export default function RoomDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  // Find the room from the flattened mock data
  const roomData = MOCK_BUSINESSES.flatMap(b => (b.rooms || []).map(r => ({
    ...r,
    hotelId: b.id,
    hotelName: b.name,
    hotelCity: b.location.city,
    hotelRegion: b.location.region,
    hotelAddress: b.location.address,
    hotelRating: b.rating,
    sltdaVerified: b.sltdaVerified,
    // Add mock data for the backend fields that aren't strictly in the simple mock interface
    roomType: r.name.includes("Suite") ? "SUITE" : r.name.includes("Family") ? "FAMILY" : "DOUBLE",
    viewType: "MOUNTAIN_VIEW",
    sizeSquareMeters: 45,
    smokingAllowed: false,
    isHourlyBookable: true,
    bedCount: r.capacity > 2 ? 2 : 1,
  }))).find(r => r.id === id);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  // If room not found (which happens if navigated directly without proper id in this mock environment)
  if (!roomData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8] dark:bg-[#081419]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Room not found</h1>
          <Button onClick={() => router.push("/rooms")} variant="ghost">Back to Rooms</Button>
        </div>
      </div>
    );
  }

  const handleBook = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      alert("Booking Request Initiated!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#081419] pb-24">
      {/* ══ HEADER BAR ══ */}
      <div className="bg-white dark:bg-[#0F252E] border-b border-[#E4E9EA] dark:border-[#20353D] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-sm font-bold text-[#4A5A62] dark:text-[#A9BCC2] hover:text-[#003366] dark:hover:text-[#3FCFC0] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-[#003366] dark:text-[#3FCFC0]">${roomData.pricePerNight} <span className="text-xs text-[#9AAAB0] font-normal">/ night</span></span>
            <Button size="sm" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="font-bold bg-[#FDA301] hover:bg-[#E59300] text-[#0E1B22] rounded-xl px-5">
              Check Availability
            </Button>
          </div>
        </div>
      </div>

      {/* ══ HERO IMAGE ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] rounded-[2rem] overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800">
          <img src={roomData.image || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"} alt={roomData.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/30">
                {roomData.roomType} CATEGORY
              </span>
              {roomData.sltdaVerified && (
                <span className="px-3 py-1 bg-[#FDA301]/90 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#0E1B22] flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" /> SLTDA Verified
                </span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
              {roomData.name}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-sm font-medium text-white/90">
              <Link href={`/business/${roomData.hotelId}`} className="flex items-center gap-1.5 hover:text-[#3FCFC0] transition-colors underline decoration-white/30 underline-offset-4">
                <MapPin className="w-4 h-4" /> {roomData.hotelName}, {roomData.hotelCity}
              </Link>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[#FDA301] fill-[#FDA301]" /> {roomData.hotelRating}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left Column: Details */}
        <div className="flex-1 space-y-10">
          
          {/* Room Specifications */}
          <section>
            <h2 className="text-2xl font-bold text-[#0E1B22] dark:text-[#EAF2F4] mb-6" style={{ fontFamily: "'Fraunces', serif" }}>Room Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { icon: Users, label: "Capacity", value: `Up to ${roomData.capacity} Guests` },
                { icon: BedDouble, label: "Bed Configuration", value: `${roomData.bedCount} ${roomData.bedType}` },
                { icon: Maximize, label: "Room Size", value: `${roomData.sizeSquareMeters} m²` },
                { icon: Mountain, label: "View Type", value: roomData.viewType.replace("_", " ") },
                { icon: CigaretteOff, label: "Smoking", value: roomData.smokingAllowed ? "Allowed" : "Non-Smoking" },
                { icon: Clock, label: "Hourly Layover", value: roomData.isHourlyBookable ? "Eligible" : "Not Eligible" },
              ].map((spec, i) => {
                const Icon = spec.icon;
                return (
                  <div key={i} className="p-4 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#15323D]">
                      <Icon className="w-5 h-5 text-[#003366] dark:text-[#3FCFC0]" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#9AAAB0] uppercase tracking-wider">{spec.label}</div>
                      <div className="text-sm font-bold text-[#0E1B22] dark:text-[#EAF2F4] mt-0.5">{spec.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <hr className="border-[#E4E9EA] dark:border-[#20353D]" />

          {/* Description */}
          <section>
            <h2 className="text-2xl font-bold text-[#0E1B22] dark:text-[#EAF2F4] mb-4" style={{ fontFamily: "'Fraunces', serif" }}>About this Space</h2>
            <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed">
              Experience the perfect blend of luxury and comfort in this beautiful {roomData.name.toLowerCase()} at {roomData.hotelName}. 
              Carefully designed to reflect the local heritage while offering modern amenities, this space provides a tranquil retreat 
              after a long day of exploring {roomData.hotelRegion}. Enjoy breathtaking {roomData.viewType.replace("_", " ").toLowerCase()}s right from your window.
            </p>
          </section>

          <hr className="border-[#E4E9EA] dark:border-[#20353D]" />

          {/* Amenities checklist */}
          <section>
            <h2 className="text-2xl font-bold text-[#0E1B22] dark:text-[#EAF2F4] mb-4" style={{ fontFamily: "'Fraunces', serif" }}>Included Amenities</h2>
            <div className="grid grid-cols-2 gap-4">
              {["High-Speed Wi-Fi", "Air Conditioning", "En-suite Bathroom", "Mini Bar & Fridge", "Flat-screen TV", "Daily Housekeeping", "Safe Deposit Box", "Tea/Coffee Maker"].map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                  <CheckCircle2 className="w-4 h-4 text-[#1F9D6C]" /> {amenity}
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column: Booking Widget */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white dark:bg-[#0F252E] rounded-[2rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-xl p-6 sm:p-8 sticky top-24">
            
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold text-[#003366] dark:text-[#3FCFC0]">${roomData.pricePerNight}</span>
              <span className="text-sm font-medium text-[#4A5A62] dark:text-[#A9BCC2]">USD / night</span>
            </div>

            <div className="space-y-4 mb-6">
              {/* Check-In / Check-Out */}
              <div className="grid grid-cols-2 gap-px bg-[#E4E9EA] dark:bg-[#20353D] border border-[#E4E9EA] dark:border-[#20353D] rounded-xl overflow-hidden">
                <div className="bg-white dark:bg-[#0F252E] p-3">
                  <label className="text-[10px] uppercase font-bold text-[#9AAAB0] block mb-1">Check-in</label>
                  <input 
                    type="date" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4] bg-transparent outline-none cursor-pointer"
                  />
                </div>
                <div className="bg-white dark:bg-[#0F252E] p-3">
                  <label className="text-[10px] uppercase font-bold text-[#9AAAB0] block mb-1">Check-out</label>
                  <input 
                    type="date" 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4] bg-transparent outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] rounded-xl p-3 flex justify-between items-center">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#9AAAB0] block mb-1">Guests</label>
                  <div className="text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">{guests} Guest{guests > 1 ? 's' : ''}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-full border border-[#E4E9EA] dark:border-[#20353D] flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#15323D] transition-colors">-</button>
                  <span className="font-bold w-4 text-center">{guests}</span>
                  <button onClick={() => setGuests(Math.min(roomData.capacity, guests + 1))} className="w-8 h-8 rounded-full border border-[#E4E9EA] dark:border-[#20353D] flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#15323D] transition-colors">+</button>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleBook} 
              disabled={isBooking || !checkIn || !checkOut}
              className="w-full h-12 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              style={{ background: (isBooking || !checkIn || !checkOut) ? "#9AAAB0" : "linear-gradient(135deg, #003366, #005F73, #008080)", color: "white" }}
            >
              {isBooking ? "Confirming..." : "Reserve Now"}
            </Button>
            
            {!checkIn || !checkOut ? (
              <p className="text-xs text-center text-[#D64545] mt-3 font-semibold">Please select dates to check availability</p>
            ) : (
              <p className="text-xs text-center text-[#4A5A62] dark:text-[#A9BCC2] mt-3 font-medium">You won't be charged yet</p>
            )}

            <div className="mt-6 pt-6 border-t border-[#E4E9EA] dark:border-[#20353D]">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#4A5A62] dark:text-[#A9BCC2]">
                <ShieldCheck className="w-4 h-4 text-[#1F9D6C]" /> Secure Booking via SLTDA Gateway
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
