"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Sun,
  Moon,
  Clock,
  ArrowLeft,
  ShieldCheck,
  Check,
  Sparkles,
  Calendar,
  MapPin,
  Building2,
  Hotel,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CITY_LABELS } from "@/lib/mock-data/businesses";
import { getDayOutPackageById, getNightOutPackageById } from "@/lib/api/catalog";
import { createInquiry } from "@/lib/api/inquiries";

export default function ExtraPackageDetailPage() {
  const params = useParams();
  const packageId = params.id as string;

  const [foundPkg, setFoundPkg] = useState<any>(null);
  const [pkgType, setPkgType] = useState<"DAYOUT" | "NIGHTOUT">("DAYOUT");
  const [loading, setLoading] = useState(true);

  // Inquiry State
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySent, setInquirySent] = useState(false);
  const [sendingInquiry, setSendingInquiry] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadPackage() {
      if (!packageId) return;
      setLoading(true);

      // Attempt Day-out lookup from API
      try {
        const doRes: any = await getDayOutPackageById(packageId);
        if (isMounted && doRes && doRes.id) {
          const rawCity = doRes.hotelCity || doRes.city;
          setFoundPkg({
            ...doRes,
            coverImageUrl:
              doRes.coverImageUrl ||
              doRes.imageUrls?.[0] ||
              doRes.hotelCoverImage ||
              "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
            city: CITY_LABELS[rawCity as keyof typeof CITY_LABELS] ?? rawCity ?? "Sri Lanka",
            sltdaVerified: doRes.sltdaVerified ?? true,
            inclusions: doRes.inclusions || [],
            pricingUnit: doRes.pricingUnit || "PER_PERSON",
          });
          setPkgType("DAYOUT");
          setLoading(false);
          return;
        }
      } catch {
        // Try night out lookup
      }

      try {
        const noRes: any = await getNightOutPackageById(packageId);
        if (isMounted && noRes && noRes.id) {
          const rawCity = noRes.hotelCity || noRes.city;
          setFoundPkg({
            ...noRes,
            coverImageUrl:
              noRes.coverImageUrl ||
              noRes.imageUrls?.[0] ||
              noRes.hotelCoverImage ||
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
            city: CITY_LABELS[rawCity as keyof typeof CITY_LABELS] ?? rawCity ?? "Sri Lanka",
            sltdaVerified: noRes.sltdaVerified ?? true,
            inclusions: noRes.inclusions || [],
            pricingUnit: noRes.pricingUnit || "PER_PERSON",
          });
          setPkgType("NIGHTOUT");
          setLoading(false);
          return;
        }
      } catch {
        // Not found
      }

      if (isMounted) {
        setFoundPkg(null);
        setLoading(false);
      }
    }
    loadPackage();
    return () => {
      isMounted = false;
    };
  }, [packageId]);

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundPkg) return;
    setSendingInquiry(true);
    try {
      if (foundPkg.hotelId) {
        await createInquiry({
          businessId: foundPkg.hotelId,
          subject: `${pkgType === "DAYOUT" ? "Day Pass" : "Night Dining"} Inquiry: ${foundPkg.title}`,
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
        Loading package details...
      </div>
    );
  }

  if (!foundPkg) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center space-y-4">
        <Sun className="w-12 h-12 text-[#9AAAB0] mx-auto mb-2" />
        <h1
          className="text-2xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Package Not Found
        </h1>
        <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2]">
          The requested day out or night out package could not be found.
        </p>
        <Link href="/extra-packages">
          <Button variant="ghost" className="mt-4">
            Back to Extra Packages
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        href="/extra-packages"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006666] dark:text-[#3FCFC0] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Extra Packages</span>
      </Link>

      {/* Header Banner */}
      <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden border border-[#E4E9EA] dark:border-[#20353D]">
        <img
          src={foundPkg.coverImageUrl}
          alt={foundPkg.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  pkgType === "DAYOUT"
                    ? "bg-[#FDA301] text-[#001F3D]"
                    : "bg-[#7C3AED] text-white"
                }`}
              >
                {pkgType === "DAYOUT" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                {pkgType === "DAYOUT" ? "Day Out Experience" : "Night Out Experience"}
              </span>
              {foundPkg.sltdaVerified && <Badge variant="sltda" />}
              {foundPkg.startTime && foundPkg.endTime && (
                <span className="text-xs uppercase font-bold text-[#FDA301] bg-black/60 backdrop-blur-md px-3 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {foundPkg.startTime} – {foundPkg.endTime}
                  </span>
                </span>
              )}
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold">
              {foundPkg.title}
            </h1>
            <p className="text-xs text-gray-300 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-[#3FCFC0]" />
              <span>Host Hotel: {foundPkg.hotelName || "Partner Hotel"}</span>
              <span>•</span>
              <MapPin className="w-3.5 h-3.5 text-[#FDA301]" />
              <span>Location: {foundPkg.city}</span>
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-gray-300">Package Price</span>
            <div className="text-3xl font-bold font-sans text-[#FDA301]">
              ${foundPkg.price} <span className="text-xs text-gray-300">{foundPkg.currency || "USD"}</span>
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

            {/* Extra tags if available */}
            {foundPkg.occasionTags && foundPkg.occasionTags.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-[#4A5A62] dark:text-[#A9BCC2] mr-2">Occasions:</span>
                <div className="inline-flex flex-wrap gap-1.5">
                  {foundPkg.occasionTags.map((tag: string, idx: number) => (
                    <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#008080]/10 text-[#008080] dark:text-[#3FCFC0]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {foundPkg.availableDays && foundPkg.availableDays.length > 0 && (
              <div className="pt-1 flex items-center gap-1.5 text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                <Calendar className="w-3.5 h-3.5 text-[#008080] dark:text-[#3FCFC0]" />
                <span>Available Days: {foundPkg.availableDays.join(", ")}</span>
              </div>
            )}
          </div>

          {/* Inclusions */}
          {foundPkg.inclusions && foundPkg.inclusions.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-4 shadow-sm">
              <h3 className="font-display font-bold text-xl text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FDA301]" />
                <span>Full Inclusions Checklist</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {foundPkg.inclusions.map((inc: any, idx: number) => {
                  const label = typeof inc === "string" ? inc : inc.name || inc.label || `Inclusion #${idx + 1}`;
                  return (
                    <div
                      key={inc.id || idx}
                      className="flex items-center gap-2 text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4]"
                    >
                      <div className="w-6 h-6 rounded-md bg-[#FDA301]/10 text-[#FDA301] flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-[#FDA301]" />
                      </div>
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Host Hotel Card */}
          {foundPkg.hotelName && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] flex items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#008080] dark:text-[#3FCFC0]">
                  Provided by Partner Hotel
                </span>
                <h4 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4]">
                  {foundPkg.hotelName}
                </h4>
                <p className="text-xs text-gray-400">{foundPkg.city}</p>
              </div>
              {foundPkg.hotelId && (
                <Link href={`/business/${foundPkg.hotelId}`}>
                  <Button variant="secondary" size="sm" className="text-xs font-semibold">
                    View Hotel & Stays
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Inquiry & Hotel Booking Connection */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 p-6 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-lg space-y-6">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4]">
                Inquire With Hotel
              </h3>
              <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                Day and night passes are arranged directly with the host property reception.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              {foundPkg.startTime && foundPkg.endTime && (
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-400">Access Hours</span>
                  <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                    {foundPkg.startTime} – {foundPkg.endTime}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-400">Price</span>
                <span className="font-bold text-[#003366] dark:text-[#3FCFC0]">
                  ${foundPkg.price} {foundPkg.currency || "USD"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-400">Pricing Unit</span>
                <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                  {(foundPkg.pricingUnit || "PER_PERSON").replace("_", " ")}
                </span>
              </div>
              {foundPkg.maxOccupancy && (
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-400">Max Capacity</span>
                  <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
                    {foundPkg.maxOccupancy} Guests
                  </span>
                </div>
              )}
            </div>

            {inquirySent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-2 animate-in fade-in">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4]">
                  Inquiry Sent to Hotel!
                </h4>
                <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                  The hotel team will reply to your request promptly.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInquirySent(false)}
                  className="text-xs mt-2"
                >
                  Send Another Inquiry
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
                    placeholder="e.g. David Miller"
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
                    placeholder="david@example.com"
                    className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs text-[#0E1B22] dark:text-[#EAF2F4] outline-none focus:ring-1 focus:ring-[#003366]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#9AAAB0] block mb-1">
                    Requested Date & Party Size
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="e.g. We are 3 guests planning for next Sunday. Is pool towel service included?"
                    className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs text-[#0E1B22] dark:text-[#EAF2F4] outline-none focus:ring-1 focus:ring-[#003366]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sendingInquiry}
                  variant="gold"
                  size="lg"
                  className="w-full rounded-xl py-3 font-bold text-xs shadow-md"
                >
                  {sendingInquiry ? "Sending Inquiry..." : "Inquire with Hotel Reception"}
                </Button>
              </form>
            )}

            {foundPkg.hotelId && (
              <div className="pt-3 border-t border-[#E4E9EA] dark:border-[#20353D] text-center">
                <Link
                  href={`/business/${foundPkg.hotelId}`}
                  className="text-xs font-bold text-[#006666] dark:text-[#3FCFC0] hover:underline inline-flex items-center gap-1"
                >
                  <Hotel className="w-3.5 h-3.5" />
                  <span>Looking to stay overnight? View Hotel Rooms</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
