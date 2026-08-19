"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_BUSINESSES } from "@/lib/mock-data/businesses";

export default function BusinessRoomsPage() {
  const params = useParams();
  const businessId = params.id as string;
  const business = MOCK_BUSINESSES.find((b) => b.id === businessId) || MOCK_BUSINESSES[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link href={`/business/${business.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006666] dark:text-[#3FCFC0] hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {business.name} Overview</span>
      </Link>

      <div className="border-b border-[#E4E9EA] dark:border-[#20353D] pb-4">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
          Select Room at {business.name}
        </h1>
        <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
          Choose your preferred suite or room configuration
        </p>
      </div>

      <div className="space-y-4">
        {business.rooms.map((room) => (
          <div
            key={room.id}
            className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <img
                src={room.imageUrls[0]}
                alt={room.displayName}
                className="w-24 h-24 rounded-2xl object-cover"
              />
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4]">
                  {room.displayName}
                </h3>
                <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                  {room.bedConfiguration} • Max {room.capacity} Guests
                </p>
                <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>Free Cancellation & Cash/Card Accepted</span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
              <div className="text-right">
                <span className="font-sans text-2xl font-bold text-[#003366] dark:text-[#EAF2F4]">
                  ${room.pricePerNight}
                </span>
                <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]"> {room.currency} / night</span>
              </div>
              <Link href={`/checkout/room?businessId=${business.id}&roomId=${room.id}`}>
                <Button variant="primary" size="md">
                  Reserve Room
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
