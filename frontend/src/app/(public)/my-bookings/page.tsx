"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CalendarCheck, Hotel, Clock, MapPin, CheckCircle2, ArrowRight, 
  X, Phone, Mail, MessageCircle, ExternalLink, ShieldCheck, CreditCard, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { getMyBookings } from "@/lib/api/booking";
import { DashboardBooking, MOCK_DASHBOARD_BOOKINGS, BOOKING_STATUS_COLORS, BOOKING_STATUS_LABELS } from "@/lib/mock-data/bookings";

export default function MyBookingsPage() {
  const user = useAuthStore((s) => s.user);
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<DashboardBooking | null>(null);

  useEffect(() => {
    async function loadBookings() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await getMyBookings();
        setBookings(res && res.length > 0 ? res : MOCK_DASHBOARD_BOOKINGS);
      } catch {
        setBookings(MOCK_DASHBOARD_BOOKINGS);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] text-center space-y-4 shadow-xl">
          <CalendarCheck className="w-12 h-12 text-[#008080] mx-auto" />
          <h2 className="text-xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">Please Log In</h2>
          <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
            Log in to your Blue Ceylon account to view your bookings and reservations.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <Button variant="primary" className="w-full font-bold rounded-xl">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E4E9EA] dark:border-[#20353D] pb-6">
        <div>
          <h1 className="font-display text-3xl font-black text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-3">
            <CalendarCheck className="w-8 h-8 text-[#008080]" />
            My Bookings & Reservations
          </h1>
          <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] mt-1">
            Track and manage all your active, confirmed, and completed travel reservations across Sri Lanka. Click any booking to view full details and hotel contact info.
          </p>
        </div>
        <Link href="/hotels">
          <Button variant="gold" className="font-bold gap-2 rounded-xl">
            <span>Explore Hotels & Tours</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-16 text-sm text-[#4A5A62] dark:text-[#A9BCC2]">
          Loading your travel bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0F252E] rounded-3xl border border-[#E4E9EA] dark:border-[#20353D] p-8 space-y-4">
          <CalendarCheck className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-bold text-[#0E1B22] dark:text-[#EAF2F4]">No Active Bookings Yet</h3>
          <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
            You haven't made any hotel or tour package bookings yet. Start planning your Sri Lankan journey today!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedBooking(item)}
              className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm hover:shadow-lg hover:border-[#008080] transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 text-[#008080] group-hover:bg-[#008080] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                  <Hotel className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-[#008080]/10 text-[#008080]">
                      {item.itemType || "ROOM"}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${BOOKING_STATUS_COLORS[item.status] || "bg-emerald-100 text-emerald-600"}`}>
                      {BOOKING_STATUS_LABELS[item.status] || item.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4] group-hover:text-[#008080] transition-colors">
                    {item.propertyName || item.itemName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#008080]" />
                      {item.checkIn} {item.checkOut ? `→ ${item.checkOut}` : ""}
                    </span>
                    <span className="font-mono text-[11px] text-gray-500 font-semibold">
                      Ref: {item.bookingReference}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-[#E4E9EA] dark:border-[#20353D]">
                <div className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">Total Price</div>
                <div className="font-display font-black text-xl text-[#008080]">
                  {item.currency || "LKR"} {(item.totalPrice || 15000).toLocaleString()}
                </div>
                <span className="text-[11px] font-bold text-[#008080] group-hover:underline mt-1 flex items-center gap-1">
                  View Full Details <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Booking Details & Contact Info Modal ── */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative my-8">
            {/* Close Button */}
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 border-b border-[#E4E9EA] dark:border-[#20353D] pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[#008080]/10 text-[#008080]">
                  {selectedBooking.itemType || "RESERVATION"}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${BOOKING_STATUS_COLORS[selectedBooking.status] || "bg-emerald-100 text-emerald-600"}`}>
                  {BOOKING_STATUS_LABELS[selectedBooking.status] || selectedBooking.status}
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
                {selectedBooking.propertyName}
              </h2>
              <p className="text-xs text-[#008080] font-semibold">
                Item: {selectedBooking.itemName} • Reference Code: <strong className="font-mono">{selectedBooking.bookingReference}</strong>
              </p>
            </div>

            {/* Booking Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-[#E4E9EA] dark:border-[#20353D]">
              <div className="space-y-1">
                <span className="text-[11px] text-[#4A5A62] dark:text-[#A9BCC2] font-semibold">Check-In Date</span>
                <p className="text-sm font-bold text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#008080]" /> {selectedBooking.checkIn}
                </p>
              </div>

              {selectedBooking.checkOut && (
                <div className="space-y-1">
                  <span className="text-[11px] text-[#4A5A62] dark:text-[#A9BCC2] font-semibold">Check-Out Date</span>
                  <p className="text-sm font-bold text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#008080]" /> {selectedBooking.checkOut}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[11px] text-[#4A5A62] dark:text-[#A9BCC2] font-semibold">Total Price Paid</span>
                <p className="text-base font-black text-[#008080]">
                  {selectedBooking.currency || "LKR"} {(selectedBooking.totalPrice || 15000).toLocaleString()}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-[#4A5A62] dark:text-[#A9BCC2] font-semibold">Payment Method</span>
                <p className="text-sm font-bold text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#008080]" /> {selectedBooking.paymentMethod}
                </p>
              </div>
            </div>

            {/* Hotel / Property Contact Details */}
            <div className="space-y-3 p-5 rounded-2xl bg-gradient-to-r from-[#003366]/5 to-[#008080]/5 dark:from-[#003366]/20 dark:to-[#008080]/20 border border-[#008080]/20">
              <h4 className="font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-2">
                <Hotel className="w-4 h-4 text-[#008080]" />
                Property & Host Contact Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <a
                  href="tel:+94771234567"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] hover:border-[#008080] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#008080]" />
                  <div>
                    <span className="text-[10px] text-[#4A5A62] block">Phone Line</span>
                    <strong className="text-[#0E1B22] dark:text-[#EAF2F4]">+94 77 123 4567</strong>
                  </div>
                </a>

                <a
                  href="https://wa.me/94771234567"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/50 hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 block">WhatsApp Chat</span>
                    <strong className="text-emerald-800 dark:text-emerald-200">Chat with Hotel</strong>
                  </div>
                </a>

                <a
                  href="mailto:reservations@blueceylon.lk"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] hover:border-[#008080] transition-colors sm:col-span-2"
                >
                  <Mail className="w-4 h-4 text-[#008080]" />
                  <div>
                    <span className="text-[10px] text-[#4A5A62] block">Email Reservations</span>
                    <strong className="text-[#0E1B22] dark:text-[#EAF2F4]">reservations@blueceylon.lk</strong>
                  </div>
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                onClick={() => setSelectedBooking(null)}
                className="font-bold rounded-xl px-6"
              >
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
