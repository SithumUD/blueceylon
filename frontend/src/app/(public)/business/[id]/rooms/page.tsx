"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBusinessById } from "@/lib/api/catalog";

export default function BusinessRoomsPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.id as string;
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!businessId) return;
      setLoading(true);
      try {
        const res = await getBusinessById(businessId);
        setBusiness(res);
      } catch {
        setBusiness(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [businessId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center text-sm text-[#4A5A62]">
        Loading rooms...
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center space-y-4">
        <h1 className="text-2xl font-bold">Business not found</h1>
        <Button onClick={() => router.push("/rooms")} variant="ghost">Back to Stays</Button>
      </div>
    );
  }

  const rooms = business.rooms || [];

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

      {rooms.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#0F252E] rounded-3xl border border-[#E4E9EA] dark:border-[#20353D]">
          <BedDouble className="w-12 h-12 text-[#9AAAB0] mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4] mb-1">
            No Rooms Available
          </h3>
          <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] max-w-sm mx-auto">
            This property currently has no active room inventory listed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room: any) => (
            <div
              key={room.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={room.imageUrls?.[0] || business.coverImageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945"}
                  alt={room.displayName || "Room"}
                  className="w-24 h-24 rounded-2xl object-cover"
                />
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4]">
                    {room.displayName || room.roomType}
                  </h3>
                  <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                    {room.bedConfiguration || `${room.bedCount || 1} Bed(s)`} • Max {room.capacity ?? 2} Guests
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
                  <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]"> {room.currency || "USD"} / night</span>
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
      )}
    </div>
  );
}
