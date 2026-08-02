"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_DASHBOARD_BOOKINGS, DashboardBooking } from "@/lib/mock-data/bookings";

export default function DashboardBookingsSubPage() {
  const [bookings, setBookings] = useState<DashboardBooking[]>(MOCK_DASHBOARD_BOOKINGS);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
    return true;
  });

  const updateStatus = (id: string, newStatus: "CONFIRMED" | "CANCELLED") => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
            All Property Bookings
          </h2>
          <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
            Detailed guest log & status management
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] rounded-xl">
          {["ALL", "CONFIRMED", "PENDING"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? "bg-[#003366] text-white"
                  : "text-[#4A5A62] dark:text-[#A9BCC2] hover:text-[#0E1B22]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0E1B22] dark:text-[#EAF2F4]">
            <thead className="bg-gray-50 dark:bg-[#15323D] border-b border-[#E4E9EA] dark:border-[#20353D] uppercase text-[10px] font-bold text-[#4A5A62] dark:text-[#A9BCC2] tracking-wider">
              <tr>
                <th className="p-4">Booking Ref</th>
                <th className="p-4">Guest Details</th>
                <th className="p-4">Room Reserved</th>
                <th className="p-4">Check-In / Check-Out</th>
                <th className="p-4">Status</th>
                <th className="p-4">Amount</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9EA] dark:divide-[#20353D]">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono font-bold text-[#003366] dark:text-[#3FCFC0]">
                    {b.bookingRef}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold">{b.guestName}</div>
                    <div className="text-[11px] text-[#4A5A62] dark:text-[#A9BCC2]">{b.guestEmail}</div>
                  </td>
                  <td className="p-4 font-medium">{b.roomName}</td>
                  <td className="p-4 font-mono text-[11px]">
                    {b.checkIn} → {b.checkOut}
                  </td>
                  <td className="p-4">
                    {b.status === "CONFIRMED" && <Badge variant="success">Confirmed</Badge>}
                    {b.status === "PENDING" && <Badge variant="pending">Pending Approval</Badge>}
                    {b.status === "CANCELLED" && <Badge variant="cancelled">Cancelled</Badge>}
                  </td>
                  <td className="p-4 font-bold font-sans">
                    ${b.totalPriceUSD} USD
                    <div className="text-[10px] text-gray-400 font-normal">
                      {b.paymentMethod === "PAY_AT_PROPERTY" ? "Pay at Property" : "Prepaid"}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {b.status === "PENDING" && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => updateStatus(b.id, "CONFIRMED")}
                          className="text-[11px] py-1 px-2.5"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => updateStatus(b.id, "CANCELLED")}
                          className="text-[11px] py-1 px-2.5"
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {b.status === "CONFIRMED" && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Ready for Guest
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
