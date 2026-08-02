import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MOCK_BUSINESSES } from "@/lib/mock-data/businesses";

export function VerifiedSpotlightRail() {
  const verifiedListings = MOCK_BUSINESSES.filter((b) => b.sltdaVerified);

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#FDA301] mb-1">
            <span>SLTDA Certified Portfolio</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
            Verified Stays & Heritage Villas
          </h2>
        </div>
        <Link href="/search" className="text-xs font-semibold text-[#006666] dark:text-[#3FCFC0] hover:underline">
          View All ({MOCK_BUSINESSES.length}) →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {verifiedListings.map((item) => (
          <Link
            key={item.id}
            href={`/business/${item.id}`}
            className="group rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={item.coverImage}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <Badge variant="sltda" />
              </div>
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#FDA301] fill-[#FDA301]" />
                <span>{item.rating}</span>
                <span className="text-gray-300">({item.reviewCount})</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                <MapPin className="w-3.5 h-3.5 text-[#008080]" />
                <span>{item.location.city}, {item.location.region}</span>
              </div>

              <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4] group-hover:text-[#003366] dark:group-hover:text-[#3FCFC0] transition-colors line-clamp-1">
                {item.name}
              </h3>

              <div className="pt-2 border-t border-[#E4E9EA] dark:border-[#20353D] flex items-center justify-between">
                <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">From per night</span>
                <div className="text-right">
                  <span className="font-sans text-xl font-bold text-[#003366] dark:text-[#EAF2F4]">
                    ${item.priceStartFrom}
                  </span>
                  <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]"> USD</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
