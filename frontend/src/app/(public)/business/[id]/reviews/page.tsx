"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Star, ShieldCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_BUSINESSES } from "@/lib/mock-data/businesses";
import { MOCK_REVIEWS, Review } from "@/lib/mock-data/reviews";

export default function BusinessReviewsPage() {
  const params = useParams();
  const businessId = params.id as string;
  const business = MOCK_BUSINESSES.find((b) => b.id === businessId) || MOCK_BUSINESSES[0];

  const [reviewsList, setReviewsList] = useState<Review[]>(
    MOCK_REVIEWS.filter((r) => r.businessId === business.id)
  );

  const [guestName, setGuestName] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || !guestName) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      businessId: business.id,
      guestName,
      guestCountry: "Traveler",
      rating,
      date: "Today",
      verifiedStay: Boolean(bookingRef),
      bookingRef: bookingRef || "Unverified",
      comment,
    };

    setReviewsList([newRev, ...reviewsList]);
    setGuestName("");
    setBookingRef("");
    setComment("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link href={`/business/${business.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006666] dark:text-[#3FCFC0] hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {business.name} Overview</span>
      </Link>

      <div className="border-b border-[#E4E9EA] dark:border-[#20353D] pb-4">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
          Verified Reviews for {business.name}
        </h1>
        <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
          Read verified traveler feedback or submit a review for your stay
        </p>
      </div>

      {/* Write a Review Form */}
      <form onSubmit={handleAddReview} className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-4 shadow-sm">
        <h3 className="font-display font-bold text-lg text-[#0E1B22] dark:text-[#EAF2F4]">
          Write a Review
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sarah Jenkins"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs text-[#0E1B22] dark:text-[#EAF2F4]"
            />
          </div>

          <div>
            <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">
              Booking Ref (For Verified Badge)
            </label>
            <input
              type="text"
              placeholder="BC-2026-XXXX"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs text-[#0E1B22] dark:text-[#EAF2F4]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">
            Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1"
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= rating ? "text-[#FDA301] fill-[#FDA301]" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">
            Your Review
          </label>
          <textarea
            rows={3}
            required
            placeholder="Share details of your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs text-[#0E1B22] dark:text-[#EAF2F4]"
          />
        </div>

        <Button type="submit" variant="primary" size="sm" className="gap-1.5">
          <span>Submit Review</span>
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviewsList.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4]">
                  {rev.guestName}
                </h4>
                <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                  {rev.guestCountry} • Reviewed {rev.date}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-[#FDA301]">
                <Star className="w-3.5 h-3.5 fill-[#FDA301]" />
                <span>{rev.rating}</span>
              </div>
            </div>

            {rev.verifiedStay && (
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#008080] dark:text-[#3FCFC0] bg-[#008080]/10 px-2 py-0.5 rounded-full">
                <span>✓ Verified Booking Ref: {rev.bookingRef}</span>
              </div>
            )}

            <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed">
              "{rev.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
