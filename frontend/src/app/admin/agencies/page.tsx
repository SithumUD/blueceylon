"use client";

import React, { useState, useEffect } from "react";
import { Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { searchBusinesses } from "@/lib/api/catalog";
import type { Business } from "@/lib/mock-data/businesses";

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await searchBusinesses({ type: "TOUR_AGENCY", size: 100 });
        setAgencies(res.content || []);
      } catch { setAgencies([]); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = agencies.filter((a) =>
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.sltdaLicenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>Agency Management</h1>
        <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-1">Manage licensed tour agencies registered on the platform.</p>
      </div>

      <div className="bg-white dark:bg-[#0F252E] rounded-[2rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E4E9EA] dark:border-[#20353D]">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AAAB0]" />
            <input type="text" placeholder="Search by agency name or SLTDA ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#15323D] border border-[#E4E9EA] dark:border-[#20353D] rounded-xl pl-10 pr-4 py-2 text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:border-[#008080]" />
          </div>
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm text-[#4A5A62] dark:text-[#A9BCC2]">Loading agencies...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F4F6F8] dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2] text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Agency Name</th>
                  <th className="px-6 py-4">SLTDA License</th>
                  <th className="px-6 py-4">City</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E9EA] dark:divide-[#20353D]">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-[#4A5A62] dark:text-[#A9BCC2]">No agencies found.</td></tr>
                ) : filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-[#15323D]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0E1B22] dark:text-[#EAF2F4]">{a.name}</div>
                      <div className="text-[10px] text-[#4A5A62]">{a.description?.slice(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-[#4A5A62]">{a.sltdaLicenseNumber || "—"}</td>
                    <td className="px-6 py-4 text-xs text-[#0E1B22] dark:text-[#EAF2F4]">{a.city?.replace(/_/g, " ") || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase ${a.status === "APPROVED" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : a.status === "PENDING" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">{a.contactEmail}</div>
                      <div className="text-[10px] text-[#4A5A62]">{a.contactPhone}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-[#008080] hover:bg-[#008080]/10 rounded-lg" title="View"><Eye className="w-4 h-4" /></Button>
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
