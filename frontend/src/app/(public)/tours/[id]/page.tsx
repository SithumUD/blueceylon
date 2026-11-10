"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Compass,
  Clock,
  MapPin,
  Check,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Car,
  Users,
  Calendar,
  Map,
  Building2,
  Hotel,
  UserCheck,
  ExternalLink,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CITY_LABELS, VEHICLE_TYPE_LABELS } from "@/lib/mock-data/businesses";
import { getTourById, getBusinessTours } from "@/lib/api/catalog";
import { createInquiry } from "@/lib/api/inquiries";

export default function TourDetailPage() {
  const params = useParams();
  const tourId = params.id as string;

  const [foundTour, setFoundTour] = React.useState<any>(null);
  const [siblingTours, setSiblingTours] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Direct Inquiry State
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySent, setInquirySent] = useState(false);
  const [sendingInquiry, setSendingInquiry] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadTour() {
      if (!tourId) return;
      setLoading(true);
      try {
        const res: any = await getTourById(tourId);
        if (isMounted && res && res.id) {
          const formattedTour = {
            ...res,
            coverImageUrl:
              res.coverImageUrl ||
              (res.imageUrls && res.imageUrls.length > 0
                ? res.imageUrls[0]
                : "https://images.unsplash.com/photo-1544644181-1484b3fdfc62"),
            cityLabel:
              CITY_LABELS[res.startingCity as keyof typeof CITY_LABELS] ||
              res.startingCity ||
              "Sri Lanka",
            inclusions: res.inclusions || [],
            itineraryDays: res.itineraryDays || [],
            pricingTiers: res.pricingTiers || [],
            durationLabel:
              res.durationDays && res.durationDays > 1
                ? `${res.durationDays} Days / ${res.durationDays - 1} Nights`
                : "1 Full Day Experience",
            difficultyLevel: res.difficultyLevel || "EASY",
            mealsIncluded: res.mealsIncluded
              ? res.mealsIncluded.replace(/_/g, " ")
              : "Included as per itinerary",
            transportModeIncluded:
              VEHICLE_TYPE_LABELS[
                res.transportModeIncluded as keyof typeof VEHICLE_TYPE_LABELS
              ] ||
              res.transportModeIncluded ||
              "Air-Conditioned Vehicle",
          };
          setFoundTour(formattedTour);

          // Fetch other tours from this provider
          if (res.businessId) {
            try {
              const sibRes = await getBusinessTours(res.businessId);
              if (isMounted && Array.isArray(sibRes)) {
                setSiblingTours(sibRes.filter((t: any) => t.id !== res.id));
              }
            } catch {
              // Ignore sibling fetch error
            }
          }
        } else if (isMounted) {
          setFoundTour(null);
        }
      } catch {
        if (isMounted) {
          setFoundTour(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadTour();
    return () => {
      isMounted = false;
    };
  }, [tourId]);

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundTour) return;
    setSendingInquiry(true);
    try {
      if (foundTour.businessId) {
        await createInquiry({
          businessId: foundTour.businessId,
          subject: `Tour Inquiry: ${foundTour.title}`,
          message: `Sender: ${inquiryName} (${inquiryEmail})\n\nMessage:\n${inquiryMessage}`,
        }).catch(() => null);
      }
      setInquirySent(true);
    } catch {
      setInquirySent(true);
    } finally {
      setSendingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-16 text-center text-sm text-[#4A5A62] dark:text-[#A9BCC2] animate-pulse">
        Loading tour expedition details...
      </div>
    );
  }

  if (!foundTour) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center space-y-4">
        <Compass className="w-12 h-12 text-[#9AAAB0] mx-auto mb-2" />
        <h1
          className="text-2xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Tour Package Not Found
        </h1>
        <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2]">
          The requested tour package could not be found or has been discontinued.
        </p>
        <Link href="/tours">
          <Button variant="ghost" className="mt-4">
            Back to Tours Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        href="/tours"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006666] dark:text-[#3FCFC0] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tours & Excursions</span>
      </Link>

      {/* Header Banner */}
      <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden border border-[#E4E9EA] dark:border-[#20353D]">
        <img
          src={foundTour.coverImageUrl}
          alt={foundTour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  foundTour.providerType === "TOUR_GUIDE"
                    ? "bg-[#008080] text-white"
                    : foundTour.providerType === "HOTEL"
                    ? "bg-[#FDA301] text-[#001F3D]"
                    : "bg-[#003366] text-white"
                }`}
              >
                {foundTour.providerType === "TOUR_GUIDE" ? (
                  <UserCheck className="w-3 h-3" />
                ) : foundTour.providerType === "HOTEL" ? (
                  <Hotel className="w-3 h-3" />
                ) : (
                  <Building2 className="w-3 h-3" />
                )}
                <span>
                  {foundTour.providerType === "TOUR_GUIDE"
                    ? "Licensed Guide Experience"
                    : foundTour.providerType === "HOTEL"
                    ? "Hotel Signature Tour"
                    : "Agency Curated Circuit"}
                </span>
              </span>

              {foundTour.sltdaVerified && <Badge variant="sltda" />}

              <span className="text-xs uppercase font-bold text-[#FDA301] bg-black/60 backdrop-blur-md px-3 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{foundTour.durationLabel}</span>
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-bold">
              {foundTour.title}
            </h1>

            <p className="text-xs text-gray-300 flex items-center gap-2 flex-wrap">
              <span>Hosted by: <strong className="text-white">{foundTour.providerName || "Verified Partner"}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#FDA301]" />
                <span>Departure: {foundTour.cityLabel}</span>
              </span>
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-gray-300">Rate from</span>
            <div className="text-3xl font-bold font-sans text-[#FDA301]">
              ${foundTour.price} <span className="text-xs text-gray-300">{foundTour.currency || "USD"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Tour Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Tour Overview */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
              Experience Description & Highlights
            </h3>
            <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed whitespace-pre-line">
              {foundTour.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#15323D]">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Difficulty</span>
                <span className="font-bold text-xs text-[#0E1B22] dark:text-[#EAF2F4]">{foundTour.difficultyLevel}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#15323D]">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Transport</span>
                <span className="font-bold text-xs text-[#0E1B22] dark:text-[#EAF2F4]">{foundTour.transportModeIncluded}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#15323D]">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Meals</span>
                <span className="font-bold text-xs text-[#0E1B22] dark:text-[#EAF2F4]">{foundTour.mealsIncluded}</span>
              </div>
            </div>
          </div>

          {/* Inclusions */}
          {foundTour.inclusions && foundTour.inclusions.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-4 shadow-sm">
              <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FDA301]" />
                <span>Tour Inclusions & Amenities</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {foundTour.inclusions.map((inc: any, idx: number) => {
                  const label = typeof inc === "string" ? inc : inc.name || inc.label || `Inclusion #${idx + 1}`;
                  return (
                    <div
                      key={inc.id || idx}
                      className="flex items-center gap-2 text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4]"
                    >
                      <div className="w-6 h-6 rounded-md bg-[#008080]/10 text-[#008080] dark:text-[#3FCFC0] flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Daily Itinerary */}
          {foundTour.itineraryDays && foundTour.itineraryDays.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-6 shadow-sm">
              <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-2">
                <Map className="w-5 h-5 text-[#003366] dark:text-[#3FCFC0]" />
                <span>Daily Day-by-Day Itinerary</span>
              </h3>

              <div className="space-y-4 border-l-2 border-[#003366]/20 dark:border-[#3FCFC0]/20 pl-4 sm:pl-6 ml-2">
                {foundTour.itineraryDays.map((day: any) => (
                  <div key={day.id || day.dayNumber} className="relative space-y-1">
                    <div className="absolute -left-[25px] sm:-left-[33px] top-0 w-6 h-6 rounded-full bg-[#003366] text-white text-[11px] font-bold flex items-center justify-center ring-4 ring-white dark:ring-[#0F252E]">
                      {day.dayNumber}
                    </div>
                    <h4 className="font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4]">
                      {day.title || `Day ${day.dayNumber}`}
                    </h4>
                    <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed">
                      {day.description}
                    </p>
                    {day.overnightLocation && (
                      <span className="inline-block text-[10px] font-semibold text-[#008080] dark:text-[#3FCFC0] bg-[#008080]/10 px-2 py-0.5 rounded mt-1">
                        📍 Overnight: {day.overnightLocation}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sibling Tours from Same Host */}
          {siblingTours.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4]">
                Other Excursions by {foundTour.providerName || "This Operator"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {siblingTours.slice(0, 4).map((sib: any) => (
                  <div
                    key={sib.id}
                    className="p-4 rounded-2xl border border-[#E4E9EA] dark:border-[#20353D] bg-white dark:bg-[#0F252E] flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-all"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4] line-clamp-1">
                        {sib.title}
                      </h4>
                      <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] line-clamp-2 mt-1">
                        {sib.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                      <span className="font-bold text-xs text-[#003366] dark:text-[#3FCFC0]">
                        ${sib.price} USD
                      </span>
                      <Link href={`/tours/${sib.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs font-semibold">
                          View Tour
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Operator Inquiry & Direct Contact Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 p-6 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-lg space-y-6">
            <div className="space-y-1">
              <h3
                className="font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Inquire With Operator
              </h3>
              <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                Custom itineraries, group rates & personal arrangements directly with the host.
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-400">Duration</span>
                <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                  {foundTour.durationLabel}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-400">Indicative Rate</span>
                <span className="font-bold text-[#003366] dark:text-[#3FCFC0]">
                  ${foundTour.price} {foundTour.currency || "USD"} <span className="text-[10px] font-normal text-gray-400">/ traveler</span>
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-400">Verified Operator</span>
                <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                  {foundTour.providerName || "Verified Host"}
                </span>
              </div>
            </div>

            {inquirySent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-2 animate-in fade-in">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4]">
                  Inquiry Sent Successfully!
                </h4>
                <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                  {foundTour.providerName} will review your message and reply via email within 1 hour.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInquirySent(false)}
                  className="text-xs mt-2"
                >
                  Send Another Note
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3 pt-1">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#9AAAB0] block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs text-[#0E1B22] dark:text-[#EAF2F4] outline-none focus:ring-1 focus:ring-[#003366]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#9AAAB0] block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs text-[#0E1B22] dark:text-[#EAF2F4] outline-none focus:ring-1 focus:ring-[#003366]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#9AAAB0] block mb-1">
                    Travel Dates & Custom Questions
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="e.g. We are 4 travelers interested in August dates. Do you offer hotel pickups from Kandy?"
                    className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs text-[#0E1B22] dark:text-[#EAF2F4] outline-none focus:ring-1 focus:ring-[#003366]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sendingInquiry}
                  className="w-full rounded-xl py-3 font-bold text-xs shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #003366, #005F73, #008080)",
                    color: "white",
                  }}
                >
                  {sendingInquiry ? "Sending Inquiry..." : "Send Direct Inquiry to Host"}
                </Button>
              </form>
            )}

            {/* Provider Link */}
            {foundTour.businessId && (
              <div className="pt-3 border-t border-[#E4E9EA] dark:border-[#20353D] text-center">
                <Link
                  href={foundTour.providerType === "TOUR_GUIDE" ? `/guide/${foundTour.businessId}` : `/business/${foundTour.businessId}`}
                  className="text-xs font-bold text-[#006666] dark:text-[#3FCFC0] hover:underline inline-flex items-center gap-1"
                >
                  <span>View Host Full Profile & Other Excursions</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
