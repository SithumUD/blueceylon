"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { ShieldCheck, CheckCircle2, CreditCard, Home, Calendar, Users, ArrowLeft, Sun, Moon, Compass, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_BUSINESSES } from "@/lib/mock-data/businesses";
import { MOCK_GUIDES } from "@/lib/mock-data/guides";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const bookingType = params.bookingType as string; // 'room' | 'dayout' | 'nightout' | 'tour'

  const businessId = searchParams.get("businessId") || "b-1";
  const roomId = searchParams.get("roomId");
  const dayOutId = searchParams.get("dayOutId");
  const nightOutId = searchParams.get("nightOutId");
  const tourPackageId = searchParams.get("tourPackageId");
  const guideId = searchParams.get("guideId");

  const business = MOCK_BUSINESSES.find((b) => b.id === businessId) || MOCK_BUSINESSES[0];
  const guide = MOCK_GUIDES.find((g) => g.id === guideId);

  const room = business.rooms.find((r) => r.id === roomId) || business.rooms[0];
  const dayOut = business.dayOutPackages?.find((d) => d.id === dayOutId);
  const nightOut = business.nightOutPackages?.find((n) => n.id === nightOutId);
  const tourPackage = business.tourPackages?.find((t) => t.id === tourPackageId);

  // Compute pricing
  let itemTitle = room.name;
  let itemPrice = room.pricePerNight * 3; // 3 nights default
  let pricingUnitLabel = "$85 x 3 Nights";

  if (bookingType === "dayout" && dayOut) {
    itemTitle = dayOut.title;
    itemPrice = dayOut.price * 2; // 2 persons
    pricingUnitLabel = `$${dayOut.price} x 2 Persons (Day Pass 09:00–18:00)`;
  } else if (bookingType === "nightout" && nightOut) {
    itemTitle = nightOut.title;
    itemPrice = nightOut.price;
    pricingUnitLabel = `$${nightOut.price} / Couple (Evening Dinner)`;
  } else if (bookingType === "tour" && tourPackage) {
    itemTitle = tourPackage.title;
    itemPrice = tourPackage.price * 2;
    pricingUnitLabel = `$${tourPackage.price} x 2 Travelers`;
  } else if (bookingType === "tour" && guide) {
    itemTitle = `Private Guide Hire (${guide.name})`;
    itemPrice = guide.dailyRateUSD * 2; // 2 days
    pricingUnitLabel = `$${guide.dailyRateUSD} x 2 Days Hire`;
  }

  const taxFee = Number((itemPrice * 0.03).toFixed(2));
  const totalPrice = itemPrice + taxFee;

  const [fullName, setFullName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex.johnson@example.com");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [paymentMethod, setPaymentMethod] = useState<"PAY_AT_PROPERTY" | "CREDIT_CARD">("PAY_AT_PROPERTY");
  const [specialRequests, setSpecialRequests] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRef = `BC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(generatedRef);
    setIsSuccess(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back link */}
      <Link href={guide ? `/guide/${guide.id}` : `/business/${business.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006666] dark:text-[#3FCFC0] hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {guide ? guide.name : business.name}</span>
      </Link>

      <div className="border-b border-[#E4E9EA] dark:border-[#20353D] pb-4">
        <h1 className="font-display text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
          Confirm Your Reservation
        </h1>
        <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
          SLTDA Verified Booking Engine • Instant confirmation with zero cancellation penalty
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form */}
        <form onSubmit={handleConfirmBooking} className="lg:col-span-7 space-y-6">
          {/* Guest Information */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4]">
              1. Primary Guest Details
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">
                  Special Instructions or Dietary Notes
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  placeholder="e.g. Vegetarian lunch preference or high floor suite"
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>
            </div>
          </div>

          {/* Payment Selection */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4]">
              2. Choose Payment Method
            </h3>

            <div className="space-y-3">
              <label
                onClick={() => setPaymentMethod("PAY_AT_PROPERTY")}
                className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === "PAY_AT_PROPERTY"
                    ? "border-[#003366] dark:border-[#3FCFC0] bg-[#003366]/5 dark:bg-[#3FCFC0]/5"
                    : "border-[#E4E9EA] dark:border-[#20353D]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-[#003366] flex items-center justify-center">
                    {paymentMethod === "PAY_AT_PROPERTY" && <div className="w-2.5 h-2.5 rounded-full bg-[#003366]" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4]">
                      Pay at Property / On Arrival
                    </h4>
                    <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                      Pay cash (USD/LKR) or card directly at {guide ? guide.name : business.name}.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">Zero Deposit</span>
              </label>

              <label
                onClick={() => setPaymentMethod("CREDIT_CARD")}
                className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === "CREDIT_CARD"
                    ? "border-[#003366] dark:border-[#3FCFC0] bg-[#003366]/5 dark:bg-[#3FCFC0]/5"
                    : "border-[#E4E9EA] dark:border-[#20353D]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-[#003366] flex items-center justify-center">
                    {paymentMethod === "CREDIT_CARD" && <div className="w-2.5 h-2.5 rounded-full bg-[#003366]" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4]">
                      Credit / Debit Card Online
                    </h4>
                    <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                      Instant pre-payment via secure gateway.
                    </p>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-[#008080]" />
              </label>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full rounded-xl py-3.5 text-base font-bold shadow-md">
            Confirm & Complete Booking
          </Button>
        </form>

        {/* Right Summary */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-lg space-y-6">
            <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4] border-b border-[#E4E9EA] dark:border-[#20353D] pb-3">
              Booking Summary
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={guide ? guide.avatar : business.coverImage}
                alt={guide ? guide.name : business.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4]">
                  {guide ? guide.name : business.name}
                </h4>
                <span className="text-[11px] text-[#008080] font-semibold block">{itemTitle}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-b border-[#E4E9EA] dark:border-[#20353D] py-4">
              <div className="flex justify-between">
                <span className="text-[#4A5A62]">Offering Type</span>
                <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4] capitalize">{bookingType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5A62]">Schedule</span>
                <span className="font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">Aug 12, 2026</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#4A5A62] dark:text-[#A9BCC2]">
                <span>{pricingUnitLabel}</span>
                <span>${itemPrice.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-[#4A5A62] dark:text-[#A9BCC2]">
                <span>SLTDA Tourism Fee (3%)</span>
                <span>${taxFee.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between font-bold text-base text-[#0E1B22] dark:text-[#EAF2F4] pt-3 border-t border-gray-200 dark:border-gray-800">
                <span>Total Amount Due</span>
                <span className="text-[#003366] dark:text-[#3FCFC0]">${totalPrice.toFixed(2)} USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal Simulation */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#0F252E] text-center space-y-6 shadow-2xl border border-[#E4E9EA] dark:border-[#20353D] animate-in fade-in zoom-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-bold text-2xl text-[#0E1B22] dark:text-[#EAF2F4]">
                Reservation Confirmed!
              </h2>
              <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                Your booking ref is <span className="font-mono font-bold text-[#003366] dark:text-[#3FCFC0] text-sm">{bookingRef}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#15323D] text-xs text-left space-y-1">
              <p><strong className="text-[#0E1B22] dark:text-[#EAF2F4]">Provider:</strong> {guide ? guide.name : business.name}</p>
              <p><strong className="text-[#0E1B22] dark:text-[#EAF2F4]">Reserved:</strong> {itemTitle}</p>
              <p><strong className="text-[#0E1B22] dark:text-[#EAF2F4]">Guest:</strong> {fullName}</p>
              <p><strong className="text-[#0E1B22] dark:text-[#EAF2F4]">Payment:</strong> {paymentMethod === "PAY_AT_PROPERTY" ? "Pay upon arrival at property" : "Paid via Card"}</p>
            </div>

            <div className="flex gap-3">
              <Link href="/dashboard" className="w-full">
                <Button variant="secondary" className="w-full text-xs">
                  View in Dashboard
                </Button>
              </Link>
              <Link href="/" className="w-full">
                <Button variant="primary" className="w-full text-xs">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
