"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Building2, CalendarCheck, TrendingUp, Settings, 
  MapPin, Users, PlusCircle, Bell, MessageSquare,
  BedDouble, Briefcase, User, Globe, LogOut, ArrowLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Derive businessType from the real logged-in user
  const rawType = authUser?.businessType?.toLowerCase() ?? "hotel";
  const businessType: "hotel" | "agency" | "guide" = 
    rawType === "tour_agency" || rawType === "agency" ? "agency" :
    rawType === "tour_guide" || rawType === "guide" ? "guide" : "hotel";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <AuthGuard roles={["BUSINESS_OWNER", "TOUR_GUIDE"]}>
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#081419] flex w-full">
      {/* ══ SIDEBAR ══ */}
      <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-[#0F252E] border-r border-[#E4E9EA] dark:border-[#20353D] pt-6 pb-4 px-4 sticky top-0 h-screen shrink-0">
        

        <div className="space-y-6 flex-1 overflow-y-auto">
          
          {/* HOTEL MENU */}
          {businessType === "hotel" && (
            <>
              <div className="space-y-1">
                <h3 className="text-[10px] uppercase font-bold text-[#9AAAB0] tracking-wider mb-2 px-3">Overview</h3>
                <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname === "/dashboard" ? "bg-[#008080]/10 text-[#008080] dark:text-[#3FCFC0]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
                  <TrendingUp className="w-4 h-4" /> Dashboard
                </Link>
                <Link href="/dashboard/bookings" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname.includes("/dashboard/bookings") ? "bg-[#008080]/10 text-[#008080] dark:text-[#3FCFC0]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
                  <CalendarCheck className="w-4 h-4" /> Booking Manage
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D] font-semibold text-sm transition-colors">
                  <MessageSquare className="w-4 h-4" /> Chat
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D] font-semibold text-sm transition-colors">
                  <Bell className="w-4 h-4" /> Notifications
                  <span className="ml-auto bg-[#D64545] text-white text-[10px] px-1.5 py-0.5 rounded-full">3</span>
                </Link>
              </div>

              <div className="space-y-1">
                <h3 className="text-[10px] uppercase font-bold text-[#9AAAB0] tracking-wider mb-2 px-3">Manage Business</h3>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D] font-semibold text-sm transition-colors">
                  <Building2 className="w-4 h-4" /> Hotel Manage
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D] font-semibold text-sm transition-colors">
                  <BedDouble className="w-4 h-4" /> Room Manage
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D] font-semibold text-sm transition-colors">
                  <MapPin className="w-4 h-4" /> Tour Packages
                </Link>
              </div>
            </>
          )}

          {/* AGENCY MENU */}
          {businessType === "agency" && (
            <>
              <div className="space-y-1">
                <h3 className="text-[10px] uppercase font-bold text-[#9AAAB0] tracking-wider mb-2 px-3">Overview</h3>
                <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname === "/dashboard" ? "bg-[#008080]/10 text-[#008080] dark:text-[#3FCFC0]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
                  <TrendingUp className="w-4 h-4" /> Dashboard
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D] font-semibold text-sm transition-colors">
                  <MessageSquare className="w-4 h-4" /> Chat
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D] font-semibold text-sm transition-colors">
                  <Bell className="w-4 h-4" /> Notifications
                  <span className="ml-auto bg-[#D64545] text-white text-[10px] px-1.5 py-0.5 rounded-full">1</span>
                </Link>
              </div>

              <div className="space-y-1">
                <h3 className="text-[10px] uppercase font-bold text-[#9AAAB0] tracking-wider mb-2 px-3">Manage Business</h3>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D] font-semibold text-sm transition-colors">
                  <Briefcase className="w-4 h-4" /> Agency Manage
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D] font-semibold text-sm transition-colors">
                  <MapPin className="w-4 h-4" /> Tour Packages
                </Link>
              </div>
            </>
          )}

          {/* GUIDE MENU */}
          {businessType === "guide" && (
            <>
              <div className="space-y-1">
                <h3 className="text-[10px] uppercase font-bold text-[#9AAAB0] tracking-wider mb-2 px-3">Overview</h3>
                <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname === "/dashboard" ? "bg-[#008080]/10 text-[#008080] dark:text-[#3FCFC0]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
                  <User className="w-4 h-4" /> Profile Dashboard
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D] font-semibold text-sm transition-colors">
                  <MessageSquare className="w-4 h-4" /> Chat
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D] font-semibold text-sm transition-colors">
                  <Bell className="w-4 h-4" /> Notifications
                </Link>
              </div>

              <div className="space-y-1">
                <h3 className="text-[10px] uppercase font-bold text-[#9AAAB0] tracking-wider mb-2 px-3">Manage Activity</h3>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D] font-semibold text-sm transition-colors">
                  <Settings className="w-4 h-4" /> Profile Management
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D] font-semibold text-sm transition-colors">
                  <MapPin className="w-4 h-4" /> Tour Packages
                </Link>
              </div>
            </>
          )}
          
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-auto border-t border-[#E4E9EA] dark:border-[#20353D] space-y-1">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D] font-semibold text-sm transition-colors"
          >
            <Globe className="w-4 h-4 text-[#008080]" /> Back to Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#D64545] hover:bg-red-50 dark:hover:bg-red-950/20 font-semibold text-sm transition-colors text-left"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* ══ MAIN LAYOUT CONTENT ══ */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-8 flex flex-col w-full">
        {/* Dashboard Top Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#001F3D] to-[#004080] text-white flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-md mb-8 w-full">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {businessType !== "guide" && <Badge variant="sltda" />}
              <span className="text-xs text-[#5CE1E6] font-semibold">
                {businessType === "hotel" && "Active Hotel Owner Portal"}
                {businessType === "agency" && "Active Tour Agency Portal"}
                {businessType === "guide" && "Verified Tour Guide Portal"}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              {businessType === "hotel" && "Nine Arch Heritage Villa"}
              {businessType === "agency" && "Ceylon Heritage Safaris"}
              {businessType === "guide" && "Kamal Perera"}
            </h1>
            <p className="text-xs text-[#A9BCC2]">
              {businessType === "hotel" && "Demodara Road, Ella • SLTDA License: SLTDA/B/2024/0984"}
              {businessType === "agency" && "Colombo • SLTDA License: SLTDA/TA/2026/0411"}
              {businessType === "guide" && "National Guide • License: N-0943"}
            </p>
          </div>

          {/* Overview Stats pill */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-300 block">Monthly Revenue</span>
              <span className="text-xl font-bold text-[#FDA301]">$3,420 USD</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-300 block">
                {businessType === "hotel" ? "Occupancy Rate" : "Active Tours"}
              </span>
              <span className="text-xl font-bold text-[#5CE1E6]">
                {businessType === "hotel" ? "92%" : "4"}
              </span>
            </div>
          </div>
        </div>

        {/* Children Rendered Here (Page Content) */}
        <div className="w-full flex-1">
          {children}
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
