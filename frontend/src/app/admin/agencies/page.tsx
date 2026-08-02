"use client";

import React, { useState } from "react";
import { Search, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

// MOCK DATA matching backend PublicBusinessController response for Agencies
const mockAgencies = [
  {
    id: "agency_1",
    name: "Lanka Wildlife Treks",
    businessType: "TOUR_AGENCY",
    sltdaRegistrationNumber: "SLTDA/TA/2026/044",
    contactEmail: "hello@lankawildlife.lk",
    contactPhone: "+94 71 987 6543",
    status: "APPROVED",
    yearsOfExperience: 8,
    languages: ["ENGLISH", "SINHALA"],
    fleetSize: 12
  },
  {
    id: "agency_2",
    name: "Ceylon Serenity Tours",
    businessType: "TOUR_AGENCY",
    sltdaRegistrationNumber: "SLTDA/TA/2019/102",
    contactEmail: "bookings@serenity.lk",
    contactPhone: "+94 77 333 4444",
    status: "APPROVED",
    yearsOfExperience: 15,
    languages: ["ENGLISH", "GERMAN", "FRENCH"],
    fleetSize: 25
  }
];

export default function AgenciesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>
            Tour Agency Management
          </h1>
          <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-1">
            Manage approved tour agency listings. (Maps to <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1 rounded">GET /api/v1/catalog/public/businesses?type=TOUR_AGENCY</code>)
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0F252E] rounded-[2rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#E4E9EA] dark:border-[#20353D] flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AAAB0]" />
            <input 
              type="text" 
              placeholder="Search by agency name or SLTDA ID..."
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
                <th className="px-6 py-4">Agency Name</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4">Languages</th>
                <th className="px-6 py-4">Fleet Size</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9EA] dark:divide-[#20353D]">
              {mockAgencies.map((agency) => (
                <tr key={agency.id} className="hover:bg-gray-50 dark:hover:bg-[#15323D]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#0E1B22] dark:text-[#EAF2F4]">{agency.name}</div>
                    <div className="text-[10px] text-[#4A5A62] font-mono">{agency.sltdaRegistrationNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-[#0E1B22] dark:text-[#EAF2F4] font-medium">
                    {agency.yearsOfExperience} Years
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {agency.languages.map((lang, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-[#4A5A62] dark:text-[#A9BCC2]">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[#0E1B22] dark:text-[#EAF2F4]">
                    {agency.fleetSize} Vehicles
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-[#0E1B22] dark:text-[#EAF2F4] font-semibold">{agency.contactEmail}</div>
                    <div className="text-[10px] text-[#4A5A62]">{agency.contactPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-[#008080] hover:bg-[#008080]/10 rounded-lg" title="View Details">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-600/10 rounded-lg" title="Edit">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-[#D64545] hover:bg-[#D64545]/10 rounded-lg" title="Delete">
                      <Trash2 className="w-4 h-4" />
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
