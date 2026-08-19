"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Star, MapPin, ShieldCheck, Check, Calendar, Sun, Moon, Compass, Users,
  Clock, Coffee, Heart, Plane, Umbrella, Utensils, Dog, Award, Leaf,
  CreditCard, PhoneCall, Globe, MessageCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_BUSINESSES, CITY_LABELS, REGION_LABELS, type SustainabilityBadge } from "@/lib/mock-data/businesses";
import { getBusinessById, getBusinessFaqs } from "@/lib/api/catalog";
import { createInquiry } from "@/lib/api/inquiries";
import { MapView } from "@/components/common/map-view";
import { MOCK_REVIEWS } from "@/lib/mock-data/reviews";
import { format } from "date-fns";

const SUSTAINABILITY_LABELS: Record<SustainabilityBadge, string> = {
  ECO_CERTIFIED: "🌿 Eco Certified",
  SOLAR_POWERED: "☀️ Solar Powered",
  PLASTIC_FREE: "♻️ Plastic-Free",
  LOCAL_SOURCING: "🧑‍🌾 Local Sourcing",
  CARBON_NEUTRAL: "🌍 Carbon Neutral",
};

const PET_POLICY_LABELS = {
  ALLOWED: "Pets Welcome",
  NOT_ALLOWED: "No Pets",
  ALLOWED_ON_REQUEST: "Pets on Request",
};

export default function BusinessProfilePage() {
  const params = useParams();
  const businessId = params.id as string;

  const [business, setBusiness] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    async function loadBusiness() {
      if (!businessId) return;
      setLoading(true);
      try {
        const res = await getBusinessById(businessId);
        if (isMounted && res && res.id) {
          setBusiness({
            ...res,
            sustainabilityBadges: res.sustainabilityBadges || [],
            paymentMethods: res.paymentMethods || ["PAYHERE", "CASH"],
            amenities: res.amenities || [],
            rooms: res.rooms || [],
            galleryImageUrls: res.galleryImageUrls?.length ? res.galleryImageUrls : [res.coverImageUrl],
            host: res.host || { displayName: "Sri Lankan Host", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb", isSuperhost: true, joinedYear: 2022 },
          });
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to local mock data lookup
      }

      const mock = MOCK_BUSINESSES.find((b) => b.id === businessId) || MOCK_BUSINESSES[0];
      if (isMounted) {
        setBusiness(mock);
        setLoading(false);
      }
    }
    loadBusiness();
    return () => {
      isMounted = false;
    };
  }, [businessId]);

  const [activeTab, setActiveTab] = useState<"rooms" | "dayout" | "nightout" | "tours">("rooms");

  // Inquiry form state
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquirySubject, setInquirySubject] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquirySending, setInquirySending] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business?.id) return;
    setInquirySending(true);
    setInquiryError(null);
    try {
      await createInquiry({
        businessId: business.id,
        subject: inquirySubject,
        message: inquiryMessage,
        contactEmail: inquiryEmail || undefined,
      });
      setInquirySuccess(true);
      setInquirySubject("");
      setInquiryMessage("");
      setInquiryEmail("");
    } catch (err: any) {
      setInquiryError(err.message || "Failed to send inquiry. Please try again.");
    } finally {
      setInquirySending(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center text-sm text-[#4A5A62]">
        Loading business profile...
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center text-sm text-[#4A5A62]">
        Business profile not found.
      </div>
    );
  }

  // Filter reviews by entityId matching business (HOTEL type)
  const reviews = MOCK_REVIEWS.filter(
    (r) => r.entityId === business.id && r.entityType === "HOTEL"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Title & Header Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {business.verificationStatus === "VERIFIED" && <Badge variant="sltda" />}
              <span className="text-xs text-[#006666] dark:text-[#3FCFC0] font-semibold uppercase tracking-wider">
                {business.propertyType?.replace("_", " ")} • {CITY_LABELS[business.city] ?? business.city} ({REGION_LABELS[business.region as keyof typeof REGION_LABELS] || business.region})
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
              {business.name}
            </h1>
            {business.tagline && (
              <p className="text-sm italic text-[#008080] dark:text-[#3FCFC0]">
                "{business.tagline}"
              </p>
            )}
            <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#008080]" />
              <span>{business.addressLine}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-sm font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
                <Star className="w-4 h-4 text-[#FDA301] fill-[#FDA301]" />
                <span>{business.averageRating}</span>
                <span className="text-xs font-normal text-[#4A5A62] dark:text-[#A9BCC2]">
                  ({business.reviewCount} reviews)
                </span>
              </div>
              {business.sltdaLicenseNumber && (
                <span className="text-[11px] font-mono text-[#008080] dark:text-[#3FCFC0] block">
                  License: {business.sltdaLicenseNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Image Mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9]">
          <div className="md:col-span-2 h-full">
            <img
              src={business.galleryImageUrls[0] || business.coverImageUrl}
              alt={business.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-3 md:col-span-2">
            <div className="grid grid-cols-2 gap-3 h-full">
              <img
                src={business.galleryImageUrls[1] || business.coverImageUrl}
                alt="Gallery preview"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded-lg"
              />
              <img
                src={business.galleryImageUrls[2] || business.coverImageUrl}
                alt="Gallery preview"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded-lg"
              />
            </div>
            <div className="relative h-full overflow-hidden rounded-lg">
              <img
                src={business.galleryImageUrls[3] || business.coverImageUrl}
                alt="Gallery preview"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
                + View Full Gallery
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Overview vs Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-10">
          {/* Host Info & Quick Catalog Attributes */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-4 shadow-sm">
            <div className="flex items-center gap-4">
              <img
                src={business.host.avatarUrl}
                alt={business.host.displayName}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#FDA301]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-lg text-[#0E1B22] dark:text-[#EAF2F4]">
                    Hosted by {business.host.displayName}
                  </h3>
                  {business.host.isSuperhost && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FDA301]/20 text-[#FDA301] text-[10px] font-bold uppercase">
                      Superhost
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                  Hosting in {CITY_LABELS[business.city] ?? business.city} since {business.host.joinedYear} • SLTDA Verified Partner
                </p>
              </div>
            </div>

            {/* Quick Attributes Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E4E9EA] dark:border-[#20353D] text-xs">
              {business.checkInTime && business.checkOutTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#008080]" />
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Check-In / Out</span>
                    <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                      {business.checkInTime} / {business.checkOutTime}
                    </span>
                  </div>
                </div>
              )}
              {business.petPolicy && (
                <div className="flex items-center gap-2">
                  <Dog className="w-4 h-4 text-[#008080]" />
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Pet Policy</span>
                    <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                      {PET_POLICY_LABELS[business.petPolicy as keyof typeof PET_POLICY_LABELS] || business.petPolicy}
                    </span>
                  </div>
                </div>
              )}
              {business.responseTimeHours && (
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#008080]" />
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Response Time</span>
                    <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                      ~{business.responseTimeHours}h
                    </span>
                  </div>
                </div>
              )}
              {business.yearsInBusiness && (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#008080]" />
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Est.</span>
                    <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                      {business.yearsInBusiness}+ Yrs
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* About Description */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
              About this accommodation & experience
            </h3>
            <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed">
              {business.description}
            </p>
          </div>

          {/* Sustainability Badges */}
          {business.sustainabilityBadges && business.sustainabilityBadges.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Leaf className="w-4 h-4" /> Sustainability Commitments
              </h4>
              <div className="flex flex-wrap gap-2">
                {business.sustainabilityBadges.map((badge: any) => (
                  <span
                    key={badge}
                    className="text-xs font-semibold bg-white dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-700"
                  >
                    {SUSTAINABILITY_LABELS[badge as SustainabilityBadge] || badge}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cancellation & Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {business.cancellationPolicy && (
              <div className="p-4 rounded-xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">Cancellation Policy</span>
                <span className="font-semibold text-sm text-[#0E1B22] dark:text-[#EAF2F4]">
                  {business.cancellationPolicy}
                </span>
                {business.depositRequired && business.depositPercentage && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    {business.depositPercentage}% deposit required to confirm
                  </p>
                )}
              </div>
            )}
            {business.paymentMethods.length > 0 && (
              <div className="p-4 rounded-xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">Payment Options</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {business.paymentMethods.map((method: any) => (
                    <span key={method} className="text-[11px] font-semibold bg-gray-100 dark:bg-[#15323D] text-[#0E1B22] dark:text-[#EAF2F4] px-2 py-0.5 rounded-md">
                      {method === "PAYHERE" ? "💳 PayHere" : method === "CASH" ? "💵 Cash" : "🏦 Bank Transfer"}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Property Amenities */}
          <div className="space-y-4 border-t border-[#E4E9EA] dark:border-[#20353D] pt-6">
            <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
              Property Amenities & Facilities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {business.amenities.map((item: any) => (
                <div key={item.id} className="flex items-center gap-2.5 text-xs text-[#0E1B22] dark:text-[#EAF2F4]">
                  <div className="w-7 h-7 rounded-lg bg-[#008080]/10 text-[#008080] dark:text-[#3FCFC0] flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* OFFERINGS TABBED SELECTOR */}
          <div className="space-y-6 border-t border-[#E4E9EA] dark:border-[#20353D] pt-6">
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
                Bookable Experience Packages & Accommodations
              </h3>
              <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                Select between overnight room stays, daytime passes, or evening romantic dinners.
              </p>
            </div>

            {/* Tab Buttons */}
            <div className="flex border-b border-[#E4E9EA] dark:border-[#20353D] gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab("rooms")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === "rooms"
                    ? "border-[#003366] text-[#003366] dark:border-[#3FCFC0] dark:text-[#3FCFC0]"
                    : "border-transparent text-[#4A5A62] dark:text-[#A9BCC2]"
                }`}
              >
                <span>🛏️ Overnight Rooms ({business.rooms.length})</span>
              </button>

              {business.dayOutPackages && business.dayOutPackages.length > 0 && (
                <button
                  onClick={() => setActiveTab("dayout")}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                    activeTab === "dayout"
                      ? "border-[#003366] text-[#003366] dark:border-[#3FCFC0] dark:text-[#3FCFC0]"
                      : "border-transparent text-[#4A5A62] dark:text-[#A9BCC2]"
                  }`}
                >
                  <Sun className="w-4 h-4 text-[#FDA301]" />
                  <span>Day Out Packages ({business.dayOutPackages.length})</span>
                </button>
              )}

              {business.nightOutPackages && business.nightOutPackages.length > 0 && (
                <button
                  onClick={() => setActiveTab("nightout")}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                    activeTab === "nightout"
                      ? "border-[#003366] text-[#003366] dark:border-[#3FCFC0] dark:text-[#3FCFC0]"
                      : "border-transparent text-[#4A5A62] dark:text-[#A9BCC2]"
                  }`}
                >
                  <Moon className="w-4 h-4 text-[#008080]" />
                  <span>Night Out & Dining ({business.nightOutPackages.length})</span>
                </button>
              )}

              {business.tourPackages && business.tourPackages.length > 0 && (
                <button
                  onClick={() => setActiveTab("tours")}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                    activeTab === "tours"
                      ? "border-[#003366] text-[#003366] dark:border-[#3FCFC0] dark:text-[#3FCFC0]"
                      : "border-transparent text-[#4A5A62] dark:text-[#A9BCC2]"
                  }`}
                >
                  <Compass className="w-4 h-4 text-[#008080]" />
                  <span>Excursions & Tours ({business.tourPackages.length})</span>
                </button>
              )}
            </div>

            {/* TAB CONTENT: ROOMS */}
            {activeTab === "rooms" && (
              <div className="space-y-4">
                {business.rooms.map((room: any) => (
                  <div
                    key={room.id}
                    className="p-5 rounded-2xl border border-[#E4E9EA] dark:border-[#20353D] bg-white dark:bg-[#0F252E] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={room.imageUrls[0]}
                        alt={room.displayName}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#003366]/10 text-[#003366] dark:text-[#3FCFC0]">
                            {room.roomType}
                          </span>
                          {room.viewType !== "NO_VIEW" && (
                            <span className="text-[10px] font-semibold text-[#008080] dark:text-[#3FCFC0]">
                              {room.viewType.replace("_", " ")}
                            </span>
                          )}
                        </div>
                        <h4 className="font-display font-bold text-base text-[#0E1B22] dark:text-[#EAF2F4]">
                          {room.displayName}
                        </h4>
                        <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                          {room.bedConfiguration} • Max {room.capacity} Guests
                          {room.sizeSquareMeters && ` • ${room.sizeSquareMeters} m²`}
                        </p>
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          ✓ Cash & Online Payment Accepted
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <div className="text-right">
                        <span className="font-sans text-xl font-bold text-[#003366] dark:text-[#EAF2F4]">
                          ${room.pricePerNight}
                        </span>
                        <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]"> {room.currency} / night</span>
                      </div>
                      <Link href={`/checkout/room?businessId=${business.id}&roomId=${room.id}`}>
                        <Button variant="primary" size="sm">
                          Book Room
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: DAY OUT PACKAGES */}
            {activeTab === "dayout" && business.dayOutPackages && (
              <div className="space-y-4">
                {business.dayOutPackages.map((pkg: any) => (
                  <div
                    key={pkg.id}
                    className="p-5 rounded-2xl border border-[#FDA301]/40 bg-white dark:bg-[#0F252E] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={pkg.imageUrls[0]}
                        alt={pkg.title}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#FDA301] bg-[#FDA301]/10 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3" />
                          <span>Day Pass ({pkg.startTime} – {pkg.endTime})</span>
                        </div>
                        <h4 className="font-display font-bold text-base text-[#0E1B22] dark:text-[#EAF2F4]">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                          {pkg.description}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Max {pkg.maxOccupancy} guests • Book {pkg.advanceBookingHoursRequired}h in advance
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {pkg.inclusions.slice(0, 3).map((inc: any) => (
                            <span key={inc.id} className="text-[10px] bg-gray-100 dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2] px-2 py-0.5 rounded-md">
                              ✓ {inc.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                      <div className="text-right">
                        <span className="font-sans text-xl font-bold text-[#003366] dark:text-[#EAF2F4]">
                          ${pkg.price}
                        </span>
                        <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]"> {pkg.currency}</span>
                        <span className="text-[10px] text-gray-400 block">{pkg.pricingUnit.replace("_", " ")}</span>
                      </div>
                      <Link href={`/extra-packages/${pkg.id}`}>
                        <Button variant="gold" size="sm">
                          View Package Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: NIGHT OUT PACKAGES */}
            {activeTab === "nightout" && business.nightOutPackages && (
              <div className="space-y-4">
                {business.nightOutPackages.map((pkg: any) => (
                  <div
                    key={pkg.id}
                    className="p-5 rounded-2xl border border-[#008080]/40 bg-white dark:bg-[#0F252E] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={pkg.imageUrls[0]}
                        alt={pkg.title}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#008080] dark:text-[#3FCFC0] bg-[#008080]/10 px-2 py-0.5 rounded-md">
                          <Moon className="w-3 h-3" />
                          <span>Evening Dinner ({pkg.startTime} – {pkg.endTime})</span>
                        </div>
                        <h4 className="font-display font-bold text-base text-[#0E1B22] dark:text-[#EAF2F4]">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                          {pkg.description}
                        </p>
                        {pkg.includesOvernightStay && (
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            ✓ Includes Overnight Stay
                          </span>
                        )}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {pkg.inclusions.slice(0, 3).map((inc: any) => (
                            <span key={inc.id} className="text-[10px] bg-gray-100 dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2] px-2 py-0.5 rounded-md">
                              ✓ {inc.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                      <div className="text-right">
                        <span className="font-sans text-xl font-bold text-[#003366] dark:text-[#EAF2F4]">
                          ${pkg.price}
                        </span>
                        <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]"> {pkg.currency}</span>
                        <span className="text-[10px] text-gray-400 block">{pkg.pricingUnit.replace("_", " ")}</span>
                      </div>
                      <Link href={`/extra-packages/${pkg.id}`}>
                        <Button variant="secondary" size="sm">
                          View Dinner Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: TOUR PACKAGES */}
            {activeTab === "tours" && business.tourPackages && (
              <div className="space-y-4">
                {business.tourPackages.map((pkg: any) => (
                  <div
                    key={pkg.id}
                    className="p-5 rounded-2xl border border-[#003366]/30 bg-white dark:bg-[#0F252E] flex flex-col sm:flex-row items-start justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-start gap-4 w-full sm:w-auto">
                      <img
                        src={pkg.imageUrls[0]}
                        alt={pkg.title}
                        className="w-24 h-24 rounded-xl object-cover shrink-0"
                      />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#003366] dark:text-[#3FCFC0] bg-[#003366]/10 px-2 py-0.5 rounded-md">
                            <Compass className="w-3 h-3" />
                            <span>{pkg.durationLabel}</span>
                          </div>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
                            {pkg.difficultyLevel}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#008080]/10 text-[#008080] dark:text-[#3FCFC0]">
                            {pkg.category}
                          </span>
                          {pkg.isPrivateTour && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                              🔒 Private
                            </span>
                          )}
                        </div>
                        <h4 className="font-display font-bold text-base text-[#0E1B22] dark:text-[#EAF2F4]">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                          {pkg.description}
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {pkg.inclusions.slice(0, 4).map((inc: any) => (
                            <span key={inc.id} className="text-[10px] bg-gray-100 dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2] px-2 py-0.5 rounded-md">
                              ✓ {inc.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                      <div className="text-right">
                        <span className="font-sans text-xl font-bold text-[#003366] dark:text-[#EAF2F4]">
                          ${pkg.price}
                        </span>
                        <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]"> {pkg.currency} / person</span>
                      </div>
                      <Link href={`/tours/${pkg.id}`}>
                        <Button variant="primary" size="sm">
                          View Tour Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Google Map Location Section */}
          <div className="border-t border-[#E4E9EA] dark:border-[#20353D] pt-6">
            <MapView
              latitude={Number(business.latitude) || 6.9271}
              longitude={Number(business.longitude) || 79.8612}
              title={business.name}
              address={business.addressLine ? `${business.addressLine}, ${CITY_LABELS[business.city] || business.city}` : undefined}
            />
          </div>

          {/* Verified Reviews Section */}
          <div className="space-y-6 border-t border-[#E4E9EA] dark:border-[#20353D] pt-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
                Verified Traveler Reviews ({reviews.length})
              </h3>
              <Link href={`/business/${business.id}/reviews`} className="text-xs font-semibold text-[#006666] dark:text-[#3FCFC0] hover:underline">
                Write a Review →
              </Link>
            </div>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4]">
                        {rev.reviewerName}
                      </h4>
                      <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                        {rev.reviewerCountry && `${rev.reviewerCountry} • `}
                        Stayed {format(new Date(rev.stayOrTourDate), "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#FDA301]">
                      <Star className="w-3.5 h-3.5 fill-[#FDA301]" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>

                  {rev.verified && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#008080] dark:text-[#3FCFC0] bg-[#008080]/10 px-2 py-0.5 rounded-full">
                      <span>✓ Verified Booking</span>
                      {rev.bookingReference && <span className="font-mono">· {rev.bookingReference}</span>}
                    </div>
                  )}

                  <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed">
                    "{rev.comment}"
                  </p>

                  {rev.providerResponse && (
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#15323D] border-l-2 border-[#008080] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#008080] dark:text-[#3FCFC0] tracking-wider">
                        Host Response
                        {rev.providerResponseAt && (
                          <span className="ml-2 text-gray-400 font-normal normal-case">
                            {format(new Date(rev.providerResponseAt), "MMM d, yyyy")}
                          </span>
                        )}
                      </span>
                      <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed">
                        {rev.providerResponse}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Reservation Box */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 p-6 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-lg space-y-6">
            <div className="flex items-end justify-between border-b border-[#E4E9EA] dark:border-[#20353D] pb-4">
              <div>
                <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">Nightly stays from</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-sans text-3xl font-bold text-[#003366] dark:text-[#EAF2F4]">
                    ${business.priceStartFrom}
                  </span>
                  <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]"> USD</span>
                </div>
                {business.starRating && (
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: business.starRating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#FDA301] text-[#FDA301]" />
                    ))}
                    <span className="text-[10px] text-gray-400 ml-1">Star Property</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
                <Star className="w-4 h-4 text-[#FDA301] fill-[#FDA301]" />
                <span>{business.averageRating}</span>
              </div>
            </div>

            <Link href={`/checkout/room?businessId=${business.id}&roomId=${business.rooms[0]?.id || "r-101"}`} className="block">
              <Button variant="primary" size="lg" className="w-full rounded-xl py-3 font-semibold shadow-md">
                Reserve Overnight Room
              </Button>
            </Link>

            {business.dayOutPackages && business.dayOutPackages.length > 0 && (
              <Link href={`/extra-packages/${business.dayOutPackages[0].id}`} className="block">
                <Button variant="gold" size="lg" className="w-full rounded-xl py-3 font-bold shadow-md">
                  View Day Out Pass
                </Button>
              </Link>
            )}

            {/* Contact Info */}
            <div className="space-y-2 pt-2 border-t border-[#E4E9EA] dark:border-[#20353D]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Contact</span>
              {business.whatsappNumber && (
                <a
                  href={`https://wa.me/${business.whatsappNumber.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp: {business.whatsappNumber}
                </a>
              )}
              {business.contactPhone && (
                <p className="flex items-center gap-2 text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                  <PhoneCall className="w-4 h-4 text-[#008080]" /> {business.contactPhone}
                </p>
              )}
            </div>

            {/* Inquiry Form */}
            <div className="pt-2 border-t border-[#E4E9EA] dark:border-[#20353D]">
              {!showInquiry && !inquirySuccess && (
                <button
                  onClick={() => setShowInquiry(true)}
                  className="w-full text-xs font-bold text-[#008080] dark:text-[#3FCFC0] border border-[#008080]/30 dark:border-[#3FCFC0]/30 rounded-xl py-2.5 hover:bg-[#008080]/5 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Send an Inquiry
                </button>
              )}

              {inquirySuccess && (
                <div className="text-center py-3 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">✅ Inquiry sent successfully!</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-500 mt-1">The host will respond to your message soon.</p>
                  <button onClick={() => { setInquirySuccess(false); setShowInquiry(false); }} className="mt-2 text-[11px] text-[#008080] underline">Send another</button>
                </div>
              )}

              {showInquiry && !inquirySuccess && (
                <form onSubmit={handleSendInquiry} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Send an Inquiry</span>
                    <button type="button" onClick={() => setShowInquiry(false)} className="text-[#4A5A62] hover:text-red-500 text-xs">✕ Close</button>
                  </div>
                  {inquiryError && (
                    <p className="text-[11px] text-red-500 font-semibold">{inquiryError}</p>
                  )}
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full p-2 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:ring-1 focus:ring-[#008080]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Room availability for September"
                      value={inquirySubject}
                      onChange={(e) => setInquirySubject(e.target.value)}
                      className="w-full p-2 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:ring-1 focus:ring-[#008080]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">Message</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Hi, I'm interested in..."
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      className="w-full p-2 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:ring-1 focus:ring-[#008080] resize-none"
                    />
                  </div>
                  <Button type="submit" disabled={inquirySending} variant="secondary" className="w-full text-xs font-bold rounded-xl py-2">
                    {inquirySending ? "Sending..." : "Send Inquiry"}
                  </Button>
                </form>
              )}
            </div>

            <p className="text-[11px] text-center text-[#4A5A62] dark:text-[#A9BCC2]">
              🔒 Instant Confirmation • SLTDA Verified Partner
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
