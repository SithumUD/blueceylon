import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#001F3D] text-[#A9BCC2] border-t border-[#003366]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info with Navbar SVG Logo */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="inline-block group">
            <img
              src="/images/blueceylon-navbar.svg"
              alt="Blue Ceylon Logo"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform brightness-110"
            />
          </Link>
          <p className="text-xs leading-relaxed text-[#9AAAB0]">
            The premier SLTDA-aligned discovery and verified booking engine for boutique hotels, eco-lodges, homestays, and tour experts in Sri Lanka.
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#003366] text-[#FDA301] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>SLTDA Compliant Framework</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white font-semibold mb-4">
            Explore Destinations
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/rooms" className="hover:text-white transition-colors">Overnight Stays & Rooms</Link></li>
            <li><Link href="/tours" className="hover:text-white transition-colors">Safaris & Excursions</Link></li>
            <li><Link href="/hotels" className="hover:text-white transition-colors">Hotels & Villas Directory</Link></li>
            <li><Link href="/extra-packages" className="hover:text-white transition-colors">Day Out Pool & Lunch Passes</Link></li>
          </ul>
        </div>

        {/* Portals */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white font-semibold mb-4">
            Portals & Registration
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/dashboard" className="hover:text-[#3FCFC0] transition-colors">Business Owner Dashboard</Link></li>
            <li><Link href="/register/hotel" className="hover:text-[#3FCFC0] transition-colors">Register Hotel / Villa</Link></li>
            <li><Link href="/register/tour-agency" className="hover:text-[#3FCFC0] transition-colors">Register Tour Agency</Link></li>
            <li><Link href="/register/tour-guide" className="hover:text-[#3FCFC0] transition-colors">Register Tour Guide</Link></li>
            <li><Link href="/login" className="hover:text-[#3FCFC0] transition-colors">Sign In to Account</Link></li>
          </ul>
        </div>

        {/* Trust Notice */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white font-semibold mb-4">
            Verified Stays Promise
          </h4>
          <p className="text-xs leading-relaxed text-[#9AAAB0] mb-3">
            Every verified listing features an official SLTDA license identifier and confirmed stay review badges.
          </p>
          <span className="text-[11px] text-[#3FCFC0] font-mono">
            V1.0.0-PROTOTYPE (SLTDA VERIFIED)
          </span>
        </div>
      </div>

      <div className="border-t border-[#003366] py-6 text-center text-xs text-[#9AAAB0] flex items-center justify-center gap-1">
        <span>Crafted with</span>
        <Heart className="w-3.5 h-3.5 text-[#FF6B4A] fill-[#FF6B4A]" />
        <span>for Sri Lanka Tourism Discovery</span>
      </div>
    </footer>
  );
}
