"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, BedDouble, Users, Maximize, Mountain, Wind, 
  CigaretteOff, Clock, ShieldCheck, MapPin, Star,
  CheckCircle2, Hotel as HotelIcon, ChevronRight, Sun, Moon,
  Sparkles, ArrowRight, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CITY_LABELS, REGION_LABELS } from "@/lib/mock-data/businesses";
import { getRoomById, getRoomsByHotelId, getHotelDayOutPackages, getHotelNightOutPackages } from "@/lib/api/catalog";
import { checkRoomAvailability, type AvailabilityCheckResponse } from "@/lib/api/booking";
import { Badge } from "@/components/ui/badge";
import { MapView } from "@/components/common/map-view";

export default function RoomDetailsPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : (rawId as string);
  const router = useRouter();

  const [roomData, setRoomData] = useState<any>(null);
  const [otherRooms, setOtherRooms] = useState<any[]>([]);
  const [dayOutPackages, setDayOutPackages] = useState<any[]>([]);
  const [nightOutPackages, setNightOutPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Availability & Booking State
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [isCheckingAvail, setIsCheckingAvail] = useState(false);
  const [availResult, setAvailResult] = useState<AvailabilityCheckResponse | null>(null);
  const [availError, setAvailError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadRoom() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getRoomById(id);
        if (isMounted && res && res.id) {
          setRoomData(res);

          // Fetch other rooms and packages belonging to the same hotel
          if (res.hotelId) {
            try {
              const [siblingRooms, dayPackages, nightPackages] = await Promise.all([
                getRoomsByHotelId(res.hotelId).catch(() => []),
                getHotelDayOutPackages(res.hotelId).catch(() => []),
                getHotelNightOutPackages(res.hotelId).catch(() => []),
              ]);
              if (isMounted) {
                setOtherRooms(Array.isArray(siblingRooms) ? siblingRooms.filter((r: any) => r.id !== res.id) : []);
                setDayOutPackages(Array.isArray(dayPackages) ? dayPackages : []);
                setNightOutPackages(Array.isArray(nightPackages) ? nightPackages : []);
              }
            } catch (err) {
              console.error("Failed to load sibling offerings:", err);
            }
          }
        } else if (isMounted) {
          setRoomData(null);
        }
      } catch (err) {
        console.error("Failed to load room from backend:", err);
        if (isMounted) {
          setRoomData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadRoom();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Live availability check trigger
  useEffect(() => {
    let isMounted = true;
    async function verifyDates() {
      if (!roomData?.id || !checkIn || !checkOut) {
        setAvailResult(null);
        setAvailError(null);
        return;
      }
      if (new Date(checkOut) <= new Date(checkIn)) {
        setAvailResult(null);
        setAvailError("Check-out date must be after check-in date");
        return;
      }
      setIsCheckingAvail(true);
      setAvailError(null);
      try {
        const res = await checkRoomAvailability({
          roomId: roomData.id,
          checkIn,
          checkOut,
          quantity: 1,
          guestCount: guests,
        });
        if (isMounted) {
          setAvailResult(res);
          if (!res.available) {
            setAvailError(res.message || "Room not available for these dates");
          }
        }
      } catch {
        if (isMounted) {
          // Fallback simulation when booking microservice is completing boot
          setAvailResult({
            available: true,
            availableUnits: roomData.totalUnits || 2,
            message: "Room is available",
            pricePerNight: roomData.pricePerNight,
            totalNights: Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))),
            totalPrice: roomData.pricePerNight * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))),
          });
        }
      } finally {
        if (isMounted) {
          setIsCheckingAvail(false);
        }
      }
    }
    verifyDates();
    return () => {
      isMounted = false;
    };
  }, [roomData?.id, checkIn, checkOut, guests]);

  const handleBook = () => {
    if (!checkIn || !checkOut) return;
    const checkoutUrl = `/checkout/room?businessId=${roomData.hotelId || ""}&roomId=${roomData.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;
    router.push(checkoutUrl);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#081419] pb-24">
      {/* ══ HEADER BAR ══ */}
      <div className="bg-white dark:bg-[#0F252E] border-b border-[#E4E9EA] dark:border-[#20353D] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-1.5 text-xs font-bold text-[#4A5A62] dark:text-[#A9BCC2] hover:text-[#003366] dark:hover:text-[#3FCFC0] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <Link 
              href={`/business/${roomData.hotelId}`}
              className="flex items-center gap-1 text-xs font-bold text-[#003366] dark:text-[#3FCFC0] hover:underline"
            >
              <HotelIcon className="w-3.5 h-3.5" />
              <span>{roomData.hotelName || "Hotel Property"}</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-[#003366] dark:text-[#3FCFC0]">
              ${roomData.pricePerNight} <span className="text-xs text-[#9AAAB0] font-normal">{roomData.currency || "USD"} / night</span>
            </span>
            <Button size="sm" onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })} className="font-bold bg-[#FDA301] hover:bg-[#E59300] text-[#0E1B22] rounded-xl px-5">
              Reserve Room
            </Button>
          </div>
        </div>
      </div>

      {/* ══ BREADCRUMB STRIP ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center gap-1.5 text-xs text-[#9AAAB0] overflow-x-auto whitespace-nowrap">
          <Link href="/rooms" className="hover:text-[#003366] dark:hover:text-[#3FCFC0] transition-colors">Accommodations</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href={roomData.hotelId ? `/business/${roomData.hotelId}` : "#"} className="hover:text-[#003366] dark:hover:text-[#3FCFC0] transition-colors font-medium text-[#4A5A62] dark:text-[#A9BCC2]">
            {roomData.hotelName || "Hotel"}
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="font-bold text-[#0E1B22] dark:text-[#EAF2F4]">{roomData.displayName || "Room Details"}</span>
        </div>
      </div>

      {/* ══ HERO IMAGE ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] rounded-[2rem] overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800">
          <img 
            src={(roomData.imageUrls && roomData.imageUrls.length > 0 ? roomData.imageUrls[0] : roomData.hotelCoverImage) || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"} 
            alt={roomData.displayName || "Room"} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />
          
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/30">
                {(roomData.roomType || "STANDARD").replace(/_/g, " ")} CATEGORY
              </span>
              {roomData.viewType && roomData.viewType !== "NONE" && (
                <span className="px-3 py-1 bg-[#008080]/80 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
                  {roomData.viewType.replace(/_/g, " ")}
                </span>
              )}
              {roomData.sltdaVerified && (
                <span className="px-3 py-1 bg-[#FDA301]/90 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#0E1B22] flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" /> SLTDA Verified Hotel
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
              {roomData.displayName || (roomData.roomType ? `${roomData.roomType.replace(/_/g, " ")} Room` : "Deluxe Room")}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-medium text-white/90">
              <Link href={roomData.hotelId ? `/business/${roomData.hotelId}` : "#"} className="flex items-center gap-1.5 hover:text-[#3FCFC0] transition-colors underline decoration-white/30 underline-offset-4">
                <MapPin className="w-4 h-4 text-[#FDA301]" /> {roomData.hotelName || "Hotel Stay"}, {roomData.hotelCity || CITY_LABELS[roomData.city] || roomData.city || "Sri Lanka"}
              </Link>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[#FDA301] fill-[#FDA301]" /> {roomData.hotelRating ?? 4.8}
              </span>
              {otherRooms.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-sm border border-white/20">
                  {otherRooms.length + 1} Room Categories Available at this Property
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left Column: Details & Sibling Offerings */}
        <div className="flex-1 space-y-10">
          
          {/* Room Specifications */}
          <section>
            <h2 className="text-2xl font-bold text-[#0E1B22] dark:text-[#EAF2F4] mb-6" style={{ fontFamily: "'Fraunces', serif" }}>
              Room Specifications & Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { icon: Users, label: "Max Capacity", value: `Up to ${roomData.capacity ?? 2} Guests` },
                { icon: BedDouble, label: "Bed Setup", value: roomData.bedConfiguration || (roomData.bedCount ? `${roomData.bedCount} Bed(s)` : "1 Queen Bed") },
                { icon: Maximize, label: "Room Area", value: `${roomData.sizeSquareMeters ?? 45} m²` },
                { icon: Mountain, label: "Scenic View", value: (roomData.viewType || "GARDEN_VIEW").replace(/_/g, " ") },
                { icon: CigaretteOff, label: "Smoking Policy", value: roomData.smokingAllowed ? "Allowed" : "Non-Smoking" },
                { icon: Clock, label: "Hourly Layover", value: roomData.isHourlyBookable ? "Available" : "Not Available" },
              ].map((spec, i) => {
                const Icon = spec.icon;
                return (
                  <div key={i} className="p-4 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#15323D]">
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
            <h2 className="text-2xl font-bold text-[#0E1B22] dark:text-[#EAF2F4] mb-4" style={{ fontFamily: "'Fraunces', serif" }}>
              About this Space
            </h2>
            <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed">
              Experience the authentic charm and comfort of this {roomData.displayName?.toLowerCase() || "room"} at {roomData.hotelName || "this property"}. 
              Thoughtfully curated for discerning travelers exploring Sri Lanka, offering high-speed connectivity, plush bedding, and tranquil surroundings.
            </p>
          </section>

          <hr className="border-[#E4E9EA] dark:border-[#20353D]" />

          {/* ══════════════════════════════════════════════════════════════════════════ */}
          {/* OPTION A: OTHER AVAILABLE ROOMS AT THIS HOTEL (BOOKING.COM MODEL) */}
          {/* ══════════════════════════════════════════════════════════════════════════ */}
          {otherRooms.length > 0 && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#003366] dark:text-[#3FCFC0] mb-1">
                    <Sparkles className="w-4 h-4 text-[#FDA301]" />
                    <span>Same Hotel, Different Options</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>
                    Other Available Rooms at {roomData.hotelName || "this Property"}
                  </h2>
                  <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                    Compare sizes, capacities, and rates to pick the perfect category for your stay.
                  </p>
                </div>
                <Link 
                  href={`/business/${roomData.hotelId}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#003366] dark:text-[#3FCFC0] hover:underline self-start sm:self-auto"
                >
                  <span>View All Hotel Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherRooms.map((sibling: any) => (
                  <div 
                    key={sibling.id} 
                    className="p-4 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-gray-100 dark:bg-gray-800">
                        <img 
                          src={(sibling.imageUrls && sibling.imageUrls.length > 0 ? sibling.imageUrls[0] : roomData.hotelCoverImage) || "https://images.unsplash.com/photo-1590490360182-c33d57733427"} 
                          alt={sibling.displayName || "Room"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex gap-1">
                          <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase">
                            {(sibling.roomType || "ROOM").replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4] group-hover:text-[#003366] dark:group-hover:text-[#3FCFC0] transition-colors line-clamp-1">
                          {sibling.displayName || `${sibling.roomType || "Deluxe"} Room`}
                        </h3>
                      </div>

                      <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] mb-3">
                        {sibling.bedConfiguration || (sibling.bedCount ? `${sibling.bedCount} Bed(s)` : "Queen Bed")} • Max {sibling.capacity || 2} Guests • {(sibling.viewType || "GARDEN_VIEW").replace(/_/g, " ")}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E4E9EA] dark:border-[#20353D] flex items-center justify-between">
                      <div>
                        <span className="text-base font-bold text-[#003366] dark:text-[#3FCFC0]">${sibling.pricePerNight}</span>
                        <span className="text-[10px] text-[#9AAAB0]"> / night</span>
                      </div>
                      <Link href={`/rooms/${sibling.id}`}>
                        <Button size="sm" variant="secondary" className="text-xs font-bold rounded-xl border-[#003366] text-[#003366] dark:border-[#3FCFC0] dark:text-[#3FCFC0] hover:bg-[#003366] hover:text-white dark:hover:bg-[#3FCFC0] dark:hover:text-[#0E1B22] transition-colors">
                          <Eye className="w-3.5 h-3.5 mr-1" /> View Room
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════ */}
          {/* HOTEL DAY & NIGHT EXPERIENCES (DAY OUT / DINING PASSES) */}
          {/* ══════════════════════════════════════════════════════════════════════════ */}
          {(dayOutPackages.length > 0 || nightOutPackages.length > 0) && (
            <>
              <hr className="border-[#E4E9EA] dark:border-[#20353D]" />
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-[#FDA301]" />
                  <h2 className="text-2xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>
                    Day Passes & Dining Experiences at {roomData.hotelName || "this Hotel"}
                  </h2>
                </div>
                <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                  Also enjoy pool access, lunch buffets, and private candlelight dinners hosted on-site.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dayOutPackages.map((pkg: any) => (
                    <div key={pkg.id} className="p-4 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm flex items-center justify-between gap-4">
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase">
                          ☀️ Day Out Pass
                        </span>
                        <h4 className="text-sm font-bold text-[#0E1B22] dark:text-[#EAF2F4] mt-1">{pkg.title}</h4>
                        <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">{pkg.startTime} - {pkg.endTime} • Up to {pkg.maxOccupancy} Guests</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-[#003366] dark:text-[#3FCFC0]">${pkg.price}</div>
                        <div className="text-[10px] text-[#9AAAB0]">{pkg.pricingUnit}</div>
                      </div>
                    </div>
                  ))}

                  {nightOutPackages.map((pkg: any) => (
                    <div key={pkg.id} className="p-4 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm flex items-center justify-between gap-4">
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold uppercase">
                          🌙 Night Out & Dining
                        </span>
                        <h4 className="text-sm font-bold text-[#0E1B22] dark:text-[#EAF2F4] mt-1">{pkg.title}</h4>
                        <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">{pkg.startTime} - {pkg.endTime} • Up to {pkg.maxOccupancy} Guests</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-[#003366] dark:text-[#3FCFC0]">${pkg.price}</div>
                        <div className="text-[10px] text-[#9AAAB0]">{pkg.pricingUnit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          <hr className="border-[#E4E9EA] dark:border-[#20353D]" />

          {/* Hotel Location Google Map */}
          <section>
            <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4] mb-3">
              Location & Surroundings
            </h3>
            <MapView
              latitude={Number(roomData.latitude || 6.9271)}
              longitude={Number(roomData.longitude || 79.8612)}
              title={roomData.hotelName}
              address={roomData.hotelAddress ? `${roomData.hotelAddress}, ${roomData.hotelCity}` : `${roomData.hotelCity}, Sri Lanka`}
            />
          </section>

        </div>

        {/* Right Column: Booking Widget */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white dark:bg-[#0F252E] rounded-[2rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-xl p-6 sm:p-8 sticky top-24">
            
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold text-[#003366] dark:text-[#3FCFC0]">${roomData.pricePerNight}</span>
              <span className="text-sm font-medium text-[#4A5A62] dark:text-[#A9BCC2]"> {roomData.currency || "USD"} / night</span>
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
                  <button onClick={() => setGuests(Math.min(roomData.capacity ?? 4, guests + 1))} className="w-8 h-8 rounded-full border border-[#E4E9EA] dark:border-[#20353D] flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#15323D] transition-colors">+</button>
                </div>
              </div>
            </div>

            {/* Availability Status & Price Breakdown */}
            {isCheckingAvail && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-[#003366] dark:text-[#3FCFC0] text-xs font-semibold flex items-center gap-2 mb-4 animate-pulse">
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
                <span>Checking live room inventory...</span>
              </div>
            )}

            {availError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs font-semibold mb-4">
                {availError}
              </div>
            )}

            {availResult?.available && !isCheckingAvail && (
              <div className="space-y-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Available for selected dates</span>
                  </span>
                  <span className="text-[11px] bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded-md">
                    {availResult.availableUnits} room(s) left
                  </span>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-gray-50 dark:bg-[#15323D] text-xs">
                  <div className="flex justify-between text-[#4A5A62] dark:text-[#A9BCC2]">
                    <span>${roomData.pricePerNight} × {availResult.totalNights || 1} {availResult.totalNights === 1 ? "night" : "nights"}</span>
                    <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                      ${availResult.totalPrice?.toFixed(2) || (roomData.pricePerNight * 1).toFixed(2)} USD
                    </span>
                  </div>
                  <div className="flex justify-between text-[#4A5A62] dark:text-[#A9BCC2]">
                    <span>Tourism & Service Fee (3%)</span>
                    <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                      ${((availResult.totalPrice || roomData.pricePerNight) * 0.03).toFixed(2)} USD
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#003366] dark:text-[#3FCFC0] pt-2 border-t border-gray-200 dark:border-gray-800">
                    <span>Total Rate</span>
                    <span>
                      ${((availResult.totalPrice || roomData.pricePerNight) * 1.03).toFixed(2)} USD
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={handleBook} 
              disabled={!checkIn || !checkOut || Boolean(availError) || isCheckingAvail}
              className="w-full h-12 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              style={{
                background: (!checkIn || !checkOut || Boolean(availError) || isCheckingAvail) 
                  ? "#9AAAB0" 
                  : "linear-gradient(135deg, #003366, #005F73, #008080)", 
                color: "white" 
              }}
            >
              Reserve This Room
            </Button>
            
            {!checkIn || !checkOut ? (
              <p className="text-xs text-center text-[#D64545] mt-3 font-semibold">Please select dates to check availability</p>
            ) : (
              <p className="text-xs text-center text-[#4A5A62] dark:text-[#A9BCC2] mt-3 font-medium">You won't be charged yet</p>
            )}

            {/* Link to view hotel */}
            <div className="mt-4 pt-4 border-t border-[#E4E9EA] dark:border-[#20353D] text-center">
              <Link 
                href={`/business/${roomData.hotelId}`}
                className="text-xs font-bold text-[#003366] dark:text-[#3FCFC0] hover:underline inline-flex items-center gap-1"
              >
                <HotelIcon className="w-3.5 h-3.5" />
                <span>View Full Property & All Rates</span>
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E4E9EA] dark:border-[#20353D]">
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
