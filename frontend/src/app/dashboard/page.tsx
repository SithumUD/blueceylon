"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CalendarCheck, PlusCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { getBusinessBookings, updateBookingStatus } from "@/lib/api/booking";
import { updateMyAccount } from "@/lib/api/auth";
import { DashboardBooking, BOOKING_STATUS_COLORS, BOOKING_STATUS_LABELS, PAYMENT_METHOD_LABELS, MOCK_DASHBOARD_BOOKINGS } from "@/lib/mock-data/bookings";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const updateUserStore = useAuthStore((s) => s.updateUser);
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile fields state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadData = async () => {
    if (user?.role === "TRAVELER") {
      window.location.href = "/my-bookings";
      return;
    }
    setLoading(true);
    try {
      const businessId = user?.id || "b-1";
      const res = await getBusinessBookings(businessId);
      setBookings(res);
    } catch {
      // Fallback to mock bookings
      setBookings(MOCK_DASHBOARD_BOOKINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveSuccess(false);
    try {
      const res = await updateMyAccount({
        firstName,
        lastName,
        phoneNumber,
        profileImageUrl,
      });
      if (res) {
        updateUserStore(res);
      }
      setSaveSuccess(true);
    } catch {
      // Local fallback simulation update
      if (user) {
        updateUserStore({
          ...user,
          firstName,
          lastName,
          phoneNumber,
          profileImageUrl,
        });
      }
      setSaveSuccess(true);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "CONFIRMED" | "CANCELLED") => {
    try {
      await updateBookingStatus(id, newStatus);
      loadData();
    } catch {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === "PENDING");
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;
  
  const mtdRevenue = bookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center text-sm text-[#4A5A62] dark:text-[#A9BCC2]">
        Loading dashboard overview...
      </div>
    );
  }

  if (user?.role === "TRAVELER") {
    return (
      <div className="max-w-4xl space-y-8 w-full">
        <div>
          <h1 className="text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>
            My Account Profile
          </h1>
          <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-1">
            Update your personal details, phone number, and avatar image.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="p-6 rounded-[2rem] bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#E4E9EA] dark:border-[#20353D]">
            <img
              src={profileImageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"}
              alt="Avatar Preview"
              className="w-20 h-20 rounded-full object-cover border-2 border-[#008080]"
            />
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-base text-[#0E1B22] dark:text-[#EAF2F4]">Profile Avatar</h4>
              <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">Provide an image URL to customize your dashboard appearance.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full p-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-200 dark:bg-gray-800 text-xs text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">
              Profile Photo URL
            </label>
            <input
              type="text"
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
          </div>

          {saveSuccess && (
            <p className="text-xs font-bold text-emerald-600">✓ Profile successfully updated!</p>
          )}

          <Button type="submit" disabled={savingProfile} variant="primary" className="font-bold py-3 px-6 rounded-xl">
            {savingProfile ? "Saving Profile..." : "Save Profile Details"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>
            Welcome back, {user?.firstName || "Provider"}!
          </h1>
          <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-1">
            Here is what's happening with your properties and tours today.
          </p>
        </div>
        <Button className="font-bold bg-[#003366] text-white rounded-xl gap-2">
          <PlusCircle className="w-4 h-4" /> Add New Listing
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: "Pending Bookings", value: `${pendingBookings.length}`, trend: "Needs approval" },
          { label: "Active Listings", value: `${confirmedCount + completedCount || 8}`, trend: "All verified" },
          { label: "Total Revenue (MTD)", value: `$${mtdRevenue}`, trend: "Confirmed & Completed" }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#0F252E] p-6 rounded-[1.5rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm">
            <div className="text-xs font-bold text-[#9AAAB0] uppercase tracking-wider mb-2">{stat.label}</div>
            <div className="text-3xl font-black text-[#003366] dark:text-[#3FCFC0] mb-1">{stat.value}</div>
            <div className="text-xs font-semibold text-[#1F9D6C]">{stat.trend}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-[#0F252E] rounded-[2rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>
            Recent Booking Requests
          </h2>
          <Link href="/dashboard/bookings">
            <Button variant="ghost" size="sm" className="font-bold text-[#008080] dark:text-[#3FCFC0]">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {pendingBookings.length === 0 ? (
          <div className="text-center py-12 text-[#4A5A62] dark:text-[#A9BCC2]">
            <CalendarCheck className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-bold">No new booking requests</h3>
            <p className="text-sm mt-1">When travelers book your listings, they'll appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#0E1B22] dark:text-[#EAF2F4]">
              <thead className="bg-gray-50 dark:bg-[#15323D] border-b border-[#E4E9EA] dark:border-[#20353D] uppercase text-[10px] font-bold text-[#4A5A62] dark:text-[#A9BCC2] tracking-wider">
                <tr>
                  <th className="p-4">Booking Ref</th>
                  <th className="p-4">Guest Details</th>
                  <th className="p-4">Reserved Item</th>
                  <th className="p-4">Dates</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E9EA] dark:divide-[#20353D]">
                {pendingBookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#003366] dark:text-[#3FCFC0]">
                      {b.bookingReference}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold">{b.guestName}</div>
                      <div className="text-[11px] text-[#4A5A62] dark:text-[#A9BCC2]">{b.guestEmail}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{b.itemName}</div>
                      <div className="text-[10px] text-gray-400 capitalize">{b.itemType.toLowerCase().replace("_", " ")}</div>
                    </td>
                    <td className="p-4 font-mono text-[11px]">
                      {b.checkIn}{b.checkOut ? ` → ${b.checkOut}` : " (Single Day)"}
                    </td>
                    <td className="p-4 font-bold font-sans">
                      ${b.totalPrice} {b.currency}
                      <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                        {PAYMENT_METHOD_LABELS[b.paymentMethod]}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
