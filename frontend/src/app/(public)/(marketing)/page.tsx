import React from "react";
import Link from "next/link";
import { ShieldCheck, Hotel, Compass, Home, Sparkles, MapPin } from "lucide-react";
import { HeroMap } from "@/components/home/hero-map";
import { UniversalSearchBar } from "@/components/home/universal-search-bar";
import { VerifiedSpotlightRail } from "@/components/home/verified-spotlight-rail";

export default function Homepage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Signature Hero Section */}
      <HeroMap />

      {/* Search Bar Float */}
      <div className="-mt-8 sm:-mt-12 relative z-20 max-w-4xl mx-auto">
        <UniversalSearchBar />
      </div>

      {/* Category Discovery Cards */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
            Explore by Category
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5A62] dark:text-[#A9BCC2]">
            From high-altitude tea estate bungalows to coastal surf villas and accredited private tour guides.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Link
            href="/search?category=villa"
            className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] hover:border-[#008080] dark:hover:border-[#3FCFC0] transition-all text-center space-y-3 group shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-[#003366]/10 text-[#003366] dark:text-[#3FCFC0] mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-base text-[#0E1B22] dark:text-[#EAF2F4]">
              Luxury Villas
            </h3>
            <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
              Private pools & mountain views
            </p>
          </Link>

          <Link
            href="/search?category=hotel"
            className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] hover:border-[#008080] dark:hover:border-[#3FCFC0] transition-all text-center space-y-3 group shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-[#003366]/10 text-[#003366] dark:text-[#3FCFC0] mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <Hotel className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-base text-[#0E1B22] dark:text-[#EAF2F4]">
              Heritage Hotels
            </h3>
            <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
              Colonial forts & boutique suites
            </p>
          </Link>

          <Link
            href="/search?category=homestay"
            className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] hover:border-[#008080] dark:hover:border-[#3FCFC0] transition-all text-center space-y-3 group shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-[#003366]/10 text-[#003366] dark:text-[#3FCFC0] mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-base text-[#0E1B22] dark:text-[#EAF2F4]">
              Eco Homestays
            </h3>
            <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
              Local hosts & authentic meals
            </p>
          </Link>

          <Link
            href="/guide/g-1"
            className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] hover:border-[#008080] dark:hover:border-[#3FCFC0] transition-all text-center space-y-3 group shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-[#003366]/10 text-[#003366] dark:text-[#3FCFC0] mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-base text-[#0E1B22] dark:text-[#EAF2F4]">
              Tour Guides
            </h3>
            <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
              Licensed wildlife & trekking experts
            </p>
          </Link>
        </div>
      </section>

      {/* Verified Spotlight Rail */}
      <VerifiedSpotlightRail />
    </div>
  );
}
