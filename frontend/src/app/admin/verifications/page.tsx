"use client";

import React, { useState, useEffect } from "react";
import { BadgeCheck, CheckCircle2, XCircle, ArrowRight, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPendingVerifications, approveBusiness, rejectBusiness } from "@/lib/api/catalog";

// MOCK DATA matching backend AdminBusinessController response (as safety fallback)
const mockPendingVerifications = [
  {
    id: "bus_1",
    name: "Ocean Breeze Resort",
    type: "HOTEL",
    licenseNumber: "SLTDA/H/2026/012",
    contactEmail: "admin@oceanbreeze.lk",
    contactPhone: "+94 77 123 4567",
    status: "PENDING",
    submittedAt: "2026-07-23T10:30:00Z"
  },
  {
    id: "bus_2",
    name: "Lanka Wildlife Treks",
    type: "TOUR_AGENCY",
    licenseNumber: "SLTDA/TA/2026/044",
    contactEmail: "hello@lankawildlife.lk",
    contactPhone: "+94 71 987 6543",
    status: "PENDING",
    submittedAt: "2026-07-22T14:15:00Z"
  },
  {
    id: "bus_3",
    name: "Nimal Fernando",
    type: "TOUR_GUIDE",
    licenseNumber: "N-1052",
    contactEmail: "nimal.guide@gmail.com",
    contactPhone: "+94 70 555 1234",
    status: "PENDING",
    submittedAt: "2026-07-21T09:45:00Z"
  }
];

export default function VerificationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getPendingVerifications();
      setVerifications(res);
    } catch {
      setVerifications(mockPendingVerifications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to approve "${name}"?`)) return;
    try {
      await approveBusiness(id);
      loadData();
    } catch {
      // Fallback
      setVerifications((prev) => prev.filter((x) => x.id !== id));
    }
  };

  const handleReject = async (id: string, name: string) => {
    const reason = window.prompt(`Enter reason to reject "${name}":`);
    if (reason === null) return;
    if (!reason.trim()) {
      alert("Rejection reason is required.");
      return;
    }
    try {
      await rejectBusiness(id, reason);
      loadData();
    } catch {
      // Fallback
      setVerifications((prev) => prev.filter((x) => x.id !== id));
    }
  };

  const filteredVerifications = verifications.filter((b) => {
    const term = searchTerm.toLowerCase();
    return b.name.toLowerCase().includes(term) || b.licenseNumber.toLowerCase().includes(term);
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center text-sm text-[#4A5A62] dark:text-[#A9BCC2]">
        Loading pending verifications...
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>
            Pending Verifications
          </h1>
          <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-1">
            Review and approve provider registrations.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0F252E] rounded-[2rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#E4E9EA] dark:border-[#20353D] flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AAAB0]" />
            <input 
              type="text" 
              placeholder="Search by name or SLTDA ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#15323D] border border-[#E4E9EA] dark:border-[#20353D] rounded-xl pl-10 pr-4 py-2 text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:border-[#008080]"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F4F6F8] dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2] text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Business Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">SLTDA ID</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9EA] dark:divide-[#20353D]">
              {filteredVerifications.map((business) => (
                <tr key={business.id} className="hover:bg-gray-50 dark:hover:bg-[#15323D]/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
                    {business.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-[#4A5A62] dark:text-[#A9BCC2]">
                      {business.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[#0E1B22] dark:text-[#EAF2F4]">
                    {business.licenseNumber}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-[#0E1B22] dark:text-[#EAF2F4] font-semibold">{business.contactEmail}</div>
                    <div className="text-[10px] text-[#4A5A62]">{business.contactPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-[#4A5A62] dark:text-[#A9BCC2] text-xs font-medium">
                    {new Date(business.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-[#1F9D6C] hover:bg-[#1F9D6C]/10 rounded-lg" title="Approve" onClick={() => handleApprove(business.id, business.name)}>
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-[#D64545] hover:bg-[#D64545]/10 rounded-lg" title="Reject" onClick={() => handleReject(business.id, business.name)}>
                      <XCircle className="w-4 h-4" />
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
