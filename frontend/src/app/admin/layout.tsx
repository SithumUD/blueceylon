"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  TrendingUp, Users, ShieldAlert, BadgeCheck, 
  Settings, MessageSquare, FileText, Database,
  Activity, DollarSign, LifeBuoy, Building2,
  Briefcase, User, BarChart4, PieChart, Globe, LogOut
} from "lucide-react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useAuthStore } from "@/store/auth-store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push("/");
  };
  
  return (
    <AuthGuard roles={["ADMIN"]}>
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#081419] flex w-full">
      {/* ══ ADMIN SIDEBAR ══ */}
      <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-[#0F252E] border-r border-[#E4E9EA] dark:border-[#20353D] pt-6 pb-4 px-4 sticky top-0 h-screen shrink-0">
        
        <div className="mb-6 px-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#D64545]/10 flex items-center justify-center text-[#D64545]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#0E1B22] dark:text-[#EAF2F4]">Admin Portal</h2>
            <div className="text-[10px] text-[#4A5A62] font-semibold">Super Administrator</div>
          </div>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto">
          
          <div className="space-y-1">
            <h3 className="text-[10px] uppercase font-bold text-[#9AAAB0] tracking-wider mb-2 px-3">Core Platform</h3>
            <Link href="/admin" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname === "/admin" ? "bg-[#D64545]/10 text-[#D64545]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
              <TrendingUp className="w-4 h-4" /> System Overview
            </Link>
            <Link href="/admin/revenue" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname.includes("/admin/revenue") ? "bg-[#D64545]/10 text-[#D64545]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
              <DollarSign className="w-4 h-4" /> Revenue & Payouts
            </Link>
            <Link href="/admin/logs" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname.includes("/admin/logs") ? "bg-[#D64545]/10 text-[#D64545]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
              <Activity className="w-4 h-4" /> Activity Logs
            </Link>
          </div>

          <div className="space-y-1">
            <h3 className="text-[10px] uppercase font-bold text-[#9AAAB0] tracking-wider mb-2 px-3">Provider Management</h3>
            <Link href="/admin/verifications" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors flex-wrap ${pathname.includes("/admin/verifications") ? "bg-[#D64545]/10 text-[#D64545]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
              <BadgeCheck className="w-4 h-4" /> Pending Verifications
              <span className="ml-auto bg-[#FDA301] text-black text-[10px] px-1.5 py-0.5 rounded-full">14</span>
            </Link>
            <Link href="/admin/hotels" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname.includes("/admin/hotels") ? "bg-[#D64545]/10 text-[#D64545]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
              <Building2 className="w-4 h-4" /> Hotel Management
            </Link>
            <Link href="/admin/agencies" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname.includes("/admin/agencies") ? "bg-[#D64545]/10 text-[#D64545]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
              <Briefcase className="w-4 h-4" /> Tour Agency Management
            </Link>
            <Link href="/admin/guides" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname.includes("/admin/guides") ? "bg-[#D64545]/10 text-[#D64545]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
              <User className="w-4 h-4" /> Tour Guide Management
            </Link>
          </div>

          <div className="space-y-1">
            <h3 className="text-[10px] uppercase font-bold text-[#9AAAB0] tracking-wider mb-2 px-3">Directory & Users</h3>
            <Link href="/admin/users" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname.includes("/admin/users") ? "bg-[#D64545]/10 text-[#D64545]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
              <Users className="w-4 h-4" /> User Management
            </Link>
          </div>

          <div className="space-y-1">
            <h3 className="text-[10px] uppercase font-bold text-[#9AAAB0] tracking-wider mb-2 px-3">Reports & Analytics</h3>
            <Link href="/admin/analytics" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname.includes("/admin/analytics") ? "bg-[#D64545]/10 text-[#D64545]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
              <PieChart className="w-4 h-4" /> Analytics Overview
            </Link>
            <Link href="/admin/trends" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname.includes("/admin/trends") ? "bg-[#D64545]/10 text-[#D64545]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
              <BarChart4 className="w-4 h-4" /> Revenue & Booking Trends
            </Link>
            <Link href="/admin/reports" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname.includes("/admin/reports") ? "bg-[#D64545]/10 text-[#D64545]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
              <FileText className="w-4 h-4" /> Report Generation
            </Link>
          </div>

          <div className="space-y-1">
            <h3 className="text-[10px] uppercase font-bold text-[#9AAAB0] tracking-wider mb-2 px-3">System & Support</h3>
            <Link href="/admin/content" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname.includes("/admin/content") ? "bg-[#D64545]/10 text-[#D64545]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
              <Database className="w-4 h-4" /> Content & Data
            </Link>
            <Link href="/admin/support" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname.includes("/admin/support") ? "bg-[#D64545]/10 text-[#D64545]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
              <LifeBuoy className="w-4 h-4" /> Support Tickets
            </Link>
            <Link href="/admin/broadcast" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname.includes("/admin/broadcast") ? "bg-[#D64545]/10 text-[#D64545]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
              <MessageSquare className="w-4 h-4" /> Broadcast Messages
            </Link>
          </div>
          
        </div>

        <div className="pt-4 mt-auto border-t border-[#E4E9EA] dark:border-[#20353D] space-y-1">
          <Link href="/admin/settings" className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${pathname.includes("/admin/settings") ? "bg-[#D64545]/10 text-[#D64545]" : "text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
            <Settings className="w-4 h-4" /> Platform Settings
          </Link>
          <Link 
            href="/" 
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D] font-semibold text-sm transition-colors"
          >
            <Globe className="w-4 h-4 text-[#D64545]" /> Back to Public Site
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
        {/* Admin Top Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] text-white flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-md mb-8 w-full border border-gray-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-gray-300 font-semibold uppercase tracking-wider">
                System Status: All Systems Operational
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Blue Ceylon Administration
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Data center connected • Last backup: 14 mins ago
            </p>
          </div>

          {/* Quick Platform Stats */}
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Users</span>
              <span className="text-xl font-bold text-white">12,482</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Active Providers</span>
              <span className="text-xl font-bold text-[#5CE1E6]">4,120</span>
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
