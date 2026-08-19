"use client";

import React from "react";
import { BadgeCheck, DollarSign, Activity, Users, ArrowRight, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>
            Platform Overview
          </h1>
          <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-1">
            Real-time insights and moderation tasks for Blue Ceylon.
          </p>
        </div>
        <Button className="font-bold bg-[#D64545] hover:bg-[#B33A3A] text-white rounded-xl gap-2">
          <ShieldAlert className="w-4 h-4" /> Trigger System Alert
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Pending Verifications", value: "14", trend: "3 Urgent", icon: BadgeCheck, color: "text-[#FDA301]", bg: "bg-[#FDA301]/10" },
          { label: "Daily Revenue", value: "$12,450", trend: "+8.4% today", icon: DollarSign, color: "text-[#1F9D6C]", bg: "bg-[#1F9D6C]/10" },
          { label: "New Users (24h)", value: "342", trend: "Mostly Travelers", icon: Users, color: "text-[#008080]", bg: "bg-[#008080]/10" },
          { label: "System Errors", value: "0", trend: "All systems go", icon: Activity, color: "text-[#003366]", bg: "bg-[#003366]/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#0F252E] p-6 rounded-[1.5rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#0E1B22] dark:text-[#EAF2F4] mb-1">{stat.value}</div>
            <div className="text-xs font-bold text-[#9AAAB0] uppercase tracking-wider mb-2">{stat.label}</div>
            <div className="text-xs font-semibold text-[#4A5A62] dark:text-[#A9BCC2] mt-auto pt-4 border-t border-[#E4E9EA] dark:border-[#20353D]">
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Pending Approvals Table */}
      <div className="bg-white dark:bg-[#0F252E] rounded-[2rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 flex items-center justify-between border-b border-[#E4E9EA] dark:border-[#20353D]">
          <h2 className="text-xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>
            Pending Provider Verifications
          </h2>
          <Button variant="ghost" size="sm" className="font-bold text-[#008080] dark:text-[#3FCFC0]">
            View All Requests <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F4F6F8] dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2] text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Business / Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4">License / ID</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9EA] dark:divide-[#20353D]">
              {[
                { name: "Ocean Breeze Resort", type: "Hotel", date: "2 hours ago", licenseNumber: "SLTDA/H/2026/012", highlight: true },
                { name: "Lanka Wildlife Treks", type: "Tour Agency", date: "5 hours ago", licenseNumber: "SLTDA/TA/2026/044", highlight: false },
                { name: "Nimal Fernando", type: "Tour Guide", date: "1 day ago", licenseNumber: "N-1052", highlight: false },
              ].map((req, i) => (
                <tr key={i} className={`hover:bg-gray-50 dark:hover:bg-[#15323D]/50 transition-colors ${req.highlight ? "bg-orange-50/50 dark:bg-orange-900/10" : ""}`}>
                  <td className="px-6 py-4 font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
                    {req.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-[#4A5A62] dark:text-[#A9BCC2]">
                      {req.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#4A5A62] dark:text-[#A9BCC2] font-medium">{req.date}</td>
                  <td className="px-6 py-4 font-mono text-xs text-[#0E1B22] dark:text-[#EAF2F4]">{req.licenseNumber}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-[#1F9D6C] hover:bg-[#1F9D6C]/10 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-[#D64545] hover:bg-[#D64545]/10 rounded-lg">
                      <XCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-8 text-xs font-bold rounded-lg px-3">
                      Review
                    </Button>
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
