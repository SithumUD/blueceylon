"use client";

import React from "react";
import { CalendarCheck, PlusCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>
            Welcome back, Provider!
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
          { label: "Pending Bookings", value: "12", trend: "+2 this week" },
          { label: "Active Listings", value: "8", trend: "All verified" },
          { label: "Total Revenue (MTD)", value: "$4,250", trend: "+15% vs last month" }
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
          <Button variant="ghost" size="sm" className="font-bold text-[#008080] dark:text-[#3FCFC0]">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="text-center py-12 text-[#4A5A62] dark:text-[#A9BCC2]">
          <CalendarCheck className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-bold">No new booking requests</h3>
          <p className="text-sm mt-1">When travelers book your listings, they'll appear here.</p>
        </div>
      </div>
    </div>
  );
}
