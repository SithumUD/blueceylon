"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Moon, Sun, UserCheck, Menu, X, ChevronDown,
  Hotel, Briefcase, User, Sparkles,
  LayoutDashboard, ShieldAlert, Settings, LogOut, UserCircle2, LogIn,
  CalendarCheck, MessageSquareQuote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme") as "dark" | "light";
    if (currentTheme) setTheme(currentTheme);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRegisterDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  // Real auth state from Zustand store
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isLoggedIn = user !== null;

  // Derived display values
  const displayName = user ? `${user.firstName} ${user.lastName}` : "";
  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "";

  // Role-based visibility flags
  const showDashboard =
    user?.role === "BUSINESS_OWNER" || user?.role === "TOUR_GUIDE";
  const showAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#FDF6EC]/90 dark:bg-[#081419]/90 border-b border-[#E4E9EA] dark:border-[#20353D] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side Brand SVG Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <img
            src="/images/blueceylon-navbar.svg"
            alt="Blue Ceylon Logo"
            className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-sm font-semibold text-[#4A5A62] dark:text-[#A9BCC2]">
          <Link href="/" className="hover:text-[#003366] dark:hover:text-[#3FCFC0] transition-colors">
            Explore
          </Link>
          <Link href="/rooms" className="hover:text-[#003366] dark:hover:text-[#3FCFC0] transition-colors">
            Rooms
          </Link>
          <Link href="/tours" className="hover:text-[#003366] dark:hover:text-[#3FCFC0] transition-colors">
            Tours
          </Link>
          <Link href="/hotels" className="hover:text-[#003366] dark:hover:text-[#3FCFC0] transition-colors">
            Hotels
          </Link>
          <Link href="/tour-agencies" className="hover:text-[#003366] dark:hover:text-[#3FCFC0] transition-colors">
            Tour Agencies
          </Link>
          <Link href="/tour-guides" className="hover:text-[#003366] dark:hover:text-[#3FCFC0] transition-colors">
            Tour Guides
          </Link>
          <Link href="/extra-packages" className="hover:text-[#003366] dark:hover:text-[#3FCFC0] transition-colors flex items-center gap-1 text-[#FDA301]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Extra Packages</span>
          </Link>
        </nav>

        {/* Right Side Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#FDA301]" />}
          </button>

          {/* Register Property Dropdown Button */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
              className="gap-1.5 shadow-sm font-bold"
            >
              <UserCheck className="w-4 h-4" />
              <span>Register Property</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${registerDropdownOpen ? "rotate-180" : ""}`} />
            </Button>

            {registerDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-xl p-2 space-y-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-[#4A5A62] dark:text-[#A9BCC2] tracking-wider">
                  Choose Business Profile
                </div>
                <Link
                  href="/register/hotel"
                  onClick={() => setRegisterDropdownOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4]"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#003366]/10 text-[#003366] dark:text-[#3FCFC0] flex items-center justify-center shrink-0">
                    <Hotel className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Hotel / Accommodation</div>
                    <div className="text-[10px] text-[#4A5A62] dark:text-[#A9BCC2] font-normal">Hotels, Villas, Homestays</div>
                  </div>
                </Link>
                <Link
                  href="/register/tour-agency"
                  onClick={() => setRegisterDropdownOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4]"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#008080]/10 text-[#008080] dark:text-[#3FCFC0] flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Tour Agency</div>
                    <div className="text-[10px] text-[#4A5A62] dark:text-[#A9BCC2] font-normal">Registered Travel Operators</div>
                  </div>
                </Link>
                <Link
                  href="/register/tour-guide"
                  onClick={() => setRegisterDropdownOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4]"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FDA301]/10 text-[#FDA301] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Tour Guide</div>
                    <div className="text-[10px] text-[#4A5A62] dark:text-[#A9BCC2] font-normal">Independent Licensed Guides</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* ── Profile / Auth Dropdown ── */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 group focus:outline-none"
              aria-label="Account menu"
            >
              {isLoggedIn ? (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#003366] to-[#008080] flex items-center justify-center text-white text-xs font-black tracking-wide shadow ring-2 ring-transparent group-hover:ring-[#008080]/50 transition-all">
                  {initials}
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#20353D] flex items-center justify-center text-[#4A5A62] dark:text-[#A9BCC2] shadow hover:bg-gray-200 dark:hover:bg-[#2A4550] transition-colors">
                  <UserCircle2 className="w-5 h-5" />
                </div>
              )}
              <ChevronDown className={`w-3.5 h-3.5 text-[#4A5A62] dark:text-[#A9BCC2] transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                {isLoggedIn ? (
                  <>
                    {/* User Info Header */}
                    <div className="px-4 py-4 bg-gradient-to-r from-[#003366]/5 to-[#008080]/5 dark:from-[#003366]/20 dark:to-[#008080]/20 border-b border-[#E4E9EA] dark:border-[#20353D]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003366] to-[#008080] flex items-center justify-center text-white text-sm font-black shadow">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-[#0E1B22] dark:text-[#EAF2F4] truncate">{displayName}</div>
                          <div className="text-[10px] text-[#4A5A62] dark:text-[#A9BCC2] truncate">{user?.email}</div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#008080]/10 text-[#008080] flex items-center justify-center shrink-0">
                          <UserCircle2 className="w-4 h-4" />
                        </div>
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/my-bookings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#008080]/10 text-[#008080] flex items-center justify-center shrink-0">
                          <CalendarCheck className="w-4 h-4" />
                        </div>
                        <span>My Bookings</span>
                      </Link>

                      <Link
                        href="/my-quotes"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#003366]/10 text-[#003366] dark:text-[#008080] flex items-center justify-center shrink-0">
                          <MessageSquareQuote className="w-4 h-4" />
                        </div>
                        <span>My Quotes</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#20353D] text-[#4A5A62] dark:text-[#A9BCC2] flex items-center justify-center shrink-0">
                          <Settings className="w-4 h-4" />
                        </div>
                        <span>Settings</span>
                      </Link>

                      {(showDashboard || showAdmin) && (
                        <div className="h-px bg-[#E4E9EA] dark:bg-[#20353D] my-1" />
                      )}

                      {showDashboard && (
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#008080]/5 transition-colors text-sm font-semibold text-[#008080] dark:text-[#3FCFC0]"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#008080]/10 text-[#008080] dark:text-[#3FCFC0] flex items-center justify-center shrink-0">
                            <LayoutDashboard className="w-4 h-4" />
                          </div>
                          <span>Host Dashboard</span>
                        </Link>
                      )}

                      {showAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#D64545]/5 transition-colors text-sm font-semibold text-[#D64545]"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#D64545]/10 text-[#D64545] flex items-center justify-center shrink-0">
                            <ShieldAlert className="w-4 h-4" />
                          </div>
                          <span>Admin Portal</span>
                        </Link>
                      )}

                      <div className="h-px bg-[#E4E9EA] dark:bg-[#20353D] my-1" />

                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-sm font-semibold text-[#D64545]"
                        onClick={handleLogout}
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#D64545]/10 text-[#D64545] flex items-center justify-center shrink-0">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <span>Log Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* Not logged in state */
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-2 text-xs text-[#4A5A62] dark:text-[#A9BCC2] font-semibold text-center">
                      Welcome to Blue Ceylon
                    </div>
                    <Link
                      href="/login"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#20353D] text-[#4A5A62] flex items-center justify-center shrink-0">
                        <LogIn className="w-4 h-4" />
                      </div>
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#008080]/10 text-[#008080] flex items-center justify-center shrink-0">
                        <UserCircle2 className="w-4 h-4" />
                      </div>
                      <span>Create Account</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[#4A5A62] dark:text-[#A9BCC2]"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#FDA301]" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#0E1B22] dark:text-[#EAF2F4]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E4E9EA] dark:border-[#20353D] bg-[#FDF6EC] dark:bg-[#0F252E] px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#E4E9EA] dark:border-[#20353D]">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
              Explore
            </Link>
            <Link href="/rooms" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
              Rooms
            </Link>
            <Link href="/tours" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
              Tours
            </Link>
            <Link href="/hotels" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
              Hotels
            </Link>
            <Link href="/tour-agencies" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
              Tour Agencies
            </Link>
            <Link href="/tour-guides" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm font-semibold text-[#0E1B22] dark:text-[#EAF2F4]">
              Tour Guides
            </Link>
            <Link href="/extra-packages" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm font-bold text-[#FDA301]">
              Extra Packages
            </Link>
          </div>

          {/* Mobile Profile Section */}
          <div className="pt-2 space-y-2">
            {isLoggedIn ? (
              <>
                {/* User card */}
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#003366]/5 to-[#008080]/5 dark:from-[#003366]/20 dark:to-[#008080]/20 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003366] to-[#008080] flex items-center justify-center text-white text-sm font-black shadow">
                    {initials}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0E1B22] dark:text-[#EAF2F4]">{displayName}</div>
                    <div className="text-[10px] text-[#4A5A62] dark:text-[#A9BCC2]">{user?.email}</div>
                  </div>
                </div>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-3 text-xs font-semibold">
                    <UserCircle2 className="w-4 h-4" /> My Profile
                  </Button>
                </Link>
                <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-3 text-xs font-semibold">
                    <Settings className="w-4 h-4" /> Settings
                  </Button>
                </Link>
                {showDashboard && (
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-xs font-semibold text-[#008080]">
                      <LayoutDashboard className="w-4 h-4" /> Host Dashboard
                    </Button>
                  </Link>
                )}
                {showAdmin && (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-xs font-semibold text-[#D64545]">
                      <ShieldAlert className="w-4 h-4" /> Admin Portal
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" className="w-full justify-start gap-3 text-xs font-semibold text-[#D64545]" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" /> Log Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-center text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full justify-center text-xs">
                    Register (Traveler)
                  </Button>
                </Link>
              </>
            )}


            <div className="pt-2 text-[10px] uppercase font-bold text-gray-400">Register Business Profile</div>
            <div className="grid grid-cols-3 gap-1">
              <Link href="/register/hotel" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl bg-gray-100 dark:bg-[#15323D] text-[11px] text-center font-semibold">
                Hotel
              </Link>
              <Link href="/register/tour-agency" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl bg-gray-100 dark:bg-[#15323D] text-[11px] text-center font-semibold">
                Agency
              </Link>
              <Link href="/register/tour-guide" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl bg-gray-100 dark:bg-[#15323D] text-[11px] text-center font-semibold">
                Guide
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
