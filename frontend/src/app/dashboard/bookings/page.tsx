"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_DASHBOARD_BOOKINGS, DashboardBooking, BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS, PAYMENT_METHOD_LABELS } from "@/lib/mock-data/bookings";
import { useAuthStore } from "@/store/auth-store";
import { getMyBookings, getBusinessBookings, cancelBooking, updateBookingStatus } from "@/lib/api/booking";

export default function DashboardBookingsSubPage() {
  const user = useAuthStore((s) => s.user);
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const loadBookings = async () => {
    setLoading(true);
    try {
      if (user?.role === "TRAVELER") {
        const res = await getMyBookings();
        setBookings(res);
      } else {
        const businessId = user?.id || "b-1";
        const res = await getBusinessBookings(businessId);
        setBookings(res);
      }
    } catch {
      // Fallback
      setBookings(MOCK_DASHBOARD_BOOKINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
    return true;
  });

  const handleCancel = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(id);
      loadBookings();
    } catch {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" as any } : b))
      );
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "CONFIRMED" | "CANCELLED") => {
    try {
      await updateBookingStatus(id, newStatus);
      loadBookings();
    } catch {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center text-sm text-[#4A5A62] dark:text-[#A9BCC2]">
        Loading bookings...
      </div>
    );
  }

  const isTraveler = user?.role === "TRAVELER";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
            {isTraveler ? "My Bookings & Trips" : "All Property Bookings"}
          </h2>
          <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
            {isTraveler ? "View your reservation history and details" : "Detailed guest log & status management"}
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] rounded-xl">
          {["ALL", "CONFIRMED", "PENDING", "COMPLETED"].map((st) => (
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
                <th className="p-4">{isTraveler ? "Property/Provider" : "Guest Details"}</th>
                <th className="p-4">Reserved Item</th>
                <th className="p-4">Schedule Dates</th>
                <th className="p-4">Status</th>
                <th className="p-4">Amount</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9EA] dark:divide-[#20353D]">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono font-bold text-[#003366] dark:text-[#3FCFC0]">
                    {b.bookingReference}
                  </td>
                  <td className="p-4">
                    {isTraveler ? (
                      <div className="font-semibold">{b.propertyName}</div>
                    ) : (
                      <>
                        <div className="font-semibold">{b.guestName}</div>
                        <div className="text-[11px] text-[#4A5A62] dark:text-[#A9BCC2]">{b.guestEmail}</div>
                      </>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{b.itemName}</div>
                    <div className="text-[10px] text-gray-400 capitalize">{b.itemType.toLowerCase().replace("_", " ")} {!isTraveler && `(${b.propertyName})`}</div>
                  </td>
                  <td className="p-4 font-mono text-[11px]">
                    {b.checkIn}{b.checkOut ? ` → ${b.checkOut}` : " (Single Day)"}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${BOOKING_STATUS_COLORS[b.status]}`}>
                      {BOOKING_STATUS_LABELS[b.status]}
                    </span>
                  </td>
                  <td className="p-4 font-bold font-sans">
                    ${b.totalPrice} {b.currency}
                    <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                      {PAYMENT_METHOD_LABELS[b.paymentMethod]}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {isTraveler ? (
                      (b.status === "PENDING" || b.status === "CONFIRMED") ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancel(b.id)}
                          className="text-[11px] py-1 px-2.5"
                        >
                          Cancel Booking
                        </Button>
                      ) : (
                        <span className="text-[11px] text-gray-400">No actions</span>
                      )
                    ) : (
                      <>
                        {b.status === "PENDING" && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleUpdateStatus(b.id, "CONFIRMED")}
                              className="text-[11px] py-1 px-2.5"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleUpdateStatus(b.id, "CANCELLED")}
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
                        {b.status === "COMPLETED" && (
                          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                            Completed
                          </span>
                        )}
                      </>
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
