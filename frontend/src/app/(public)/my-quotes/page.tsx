"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquareQuote, Compass, UserCheck, Clock, Send, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

interface CustomQuote {
  id: string;
  recipientName: string;
  recipientType: "TOUR_AGENCY" | "TOUR_GUIDE";
  destination: string;
  travelDates: string;
  paxCount: number;
  status: "PENDING" | "RESPONDED" | "ACCEPTED";
  estimatedPrice?: string;
  requestedAt: string;
}

const MOCK_QUOTES: CustomQuote[] = [
  {
    id: "q-101",
    recipientName: "Lanka Heritage Tours & Travels",
    recipientType: "TOUR_AGENCY",
    destination: "Sigiriya, Polonnaruwa & Dambulla (3 Days)",
    travelDates: "2026-09-10 → 2026-09-13",
    paxCount: 4,
    status: "RESPONDED",
    estimatedPrice: "LKR 125,000",
    requestedAt: "2026-08-14",
  },
  {
    id: "q-102",
    recipientName: "Kasun Perera (Licensed Guide)",
    recipientType: "TOUR_GUIDE",
    destination: "Ella Rock Hike & Nine Arches Safari",
    travelDates: "2026-09-18",
    paxCount: 2,
    status: "PENDING",
    requestedAt: "2026-08-16",
  },
];

export default function MyQuotesPage() {
  const user = useAuthStore((s) => s.user);
  const [quotes, setQuotes] = useState<CustomQuote[]>(MOCK_QUOTES);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] text-center space-y-4 shadow-xl">
          <MessageSquareQuote className="w-12 h-12 text-[#008080] mx-auto" />
          <h2 className="text-xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">Please Log In</h2>
          <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
            Log in to your Blue Ceylon account to view your tour quotes and requests.
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
            <MessageSquareQuote className="w-8 h-8 text-[#008080]" />
            My Tour Quotes & Custom Requests
          </h1>
          <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] mt-1">
            Review custom itinerary quotes requested from verified tour agencies and tour guides.
          </p>
        </div>
        <Link href="/tour-guides">
          <Button variant="gold" className="font-bold gap-2 rounded-xl">
            <span>Find Tour Guides</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Quotes List */}
      {quotes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0F252E] rounded-3xl border border-[#E4E9EA] dark:border-[#20353D] p-8 space-y-4">
          <Send className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-bold text-[#0E1B22] dark:text-[#EAF2F4]">No Active Quotes</h3>
          <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
            You haven't requested any custom tour quotes yet. Contact a tour agency or guide to request a tailored itinerary!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <div key={q.id} className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#003366]/10 text-[#003366] dark:text-[#008080] flex items-center justify-center shrink-0">
                  {q.recipientType === "TOUR_AGENCY" ? <Compass className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                      {q.recipientType === "TOUR_AGENCY" ? "TOUR AGENCY" : "TOUR GUIDE"}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                      q.status === "RESPONDED"
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                    }`}>
                      {q.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4]">
                    {q.recipientName}
                  </h3>
                  <p className="text-xs text-[#008080] font-semibold">{q.destination}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#4A5A62] dark:text-[#A9BCC2] pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {q.travelDates} ({q.paxCount} Travelers)
                    </span>
                    <span>Requested: {q.requestedAt}</span>
                  </div>
                </div>
              </div>

              <div className="text-right flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-[#E4E9EA] dark:border-[#20353D]">
                {q.estimatedPrice ? (
                  <>
                    <div className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">Offered Quote</div>
                    <div className="font-display font-black text-xl text-[#008080]">
                      {q.estimatedPrice}
                    </div>
                  </>
                ) : (
                  <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Awaiting Provider Response
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
