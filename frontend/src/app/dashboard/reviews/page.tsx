"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_REVIEWS, type Review } from "@/lib/mock-data/reviews";
import { format } from "date-fns";
import { useAuthStore } from "@/store/auth-store";
import { getReviews, respondToReview } from "@/lib/api/reviews";

export default function DashboardReviewsPage() {
  const user = useAuthStore((s) => s.user);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const loadReviews = async () => {
    setLoading(true);
    try {
      const entityId = user?.id || "b-1";
      const res = await getReviews({ entityId, entityType: "HOTEL" });
      setReviewsList(res.content);
    } catch {
      setReviewsList(MOCK_REVIEWS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadReviews();
    }
  }, [user]);

  const handlePostReply = async (reviewId: string) => {
    const text = replyText[reviewId];
    if (!text) return;

    try {
      await respondToReview(reviewId, text);
      loadReviews();
    } catch {
      setReviewsList((prev) =>
        prev.map((r) => {
          if (r.id === reviewId) {
            return {
              ...r,
              providerResponse: text,
              providerResponseAt: new Date().toISOString(),
            };
          }
          return r;
        })
      );
    }
    setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center text-sm text-[#4A5A62] dark:text-[#A9BCC2]">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
          Guest Reviews & Responses
        </h2>
        <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
          Reply to traveler feedback to foster trust and maintain SLTDA partner excellence.
        </p>
      </div>

      <div className="space-y-4">
        {reviewsList.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-2xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4]">
                  {rev.reviewerName} {rev.reviewerCountry && `(${rev.reviewerCountry})`}
                </h4>
                <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                  Stay Date: {format(new Date(rev.stayOrTourDate), "MMM d, yyyy")}
                  {rev.bookingReference && ` • Booking Ref: ${rev.bookingReference}`}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-[#FDA301]">
                <Star className="w-4 h-4 fill-[#FDA301]" />
                <span>{rev.rating}</span>
              </div>
            </div>

            <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed italic">
              "{rev.comment}"
            </p>

            {/* Existing Owner Response */}
            {rev.providerResponse ? (
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#15323D] border-l-3 border-[#003366] space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#003366] dark:text-[#3FCFC0]">
                  <span>Your Published Response</span>
                  <span className="font-normal text-gray-400">
                    {rev.providerResponseAt ? format(new Date(rev.providerResponseAt), "MMM d, yyyy") : "Today"}
                  </span>
                </div>
                <p className="text-xs text-[#0E1B22] dark:text-[#EAF2F4]">
                  "{rev.providerResponse}"
                </p>
              </div>
            ) : (
              /* Reply Form Input */
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <label className="text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#008080]" />
                  <span>Write an official host response</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Thank the guest for their stay..."
                    value={replyText[rev.id] || ""}
                    onChange={(e) =>
                      setReplyText({ ...replyText, [rev.id]: e.target.value })
                    }
                    className="flex-1 p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-xs text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handlePostReply(rev.id)}
                    className="gap-1 px-4 text-xs"
                  >
                    <span>Reply</span>
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
