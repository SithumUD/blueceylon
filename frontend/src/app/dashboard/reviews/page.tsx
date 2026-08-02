"use client";

import React, { useState } from "react";
import { Star, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_REVIEWS, Review } from "@/lib/mock-data/reviews";

export default function DashboardReviewsPage() {
  const [reviewsList, setReviewsList] = useState<Review[]>(MOCK_REVIEWS);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const handlePostReply = (reviewId: string) => {
    const text = replyText[reviewId];
    if (!text) return;

    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            ownerResponse: {
              date: "Today",
              comment: text,
            },
          };
        }
        return r;
      })
    );

    setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
  };

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
                  {rev.guestName} ({rev.guestCountry})
                </h4>
                <span className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
                  Stay Date: {rev.date} • Booking Ref: {rev.bookingRef}
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
            {rev.ownerResponse ? (
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#15323D] border-l-3 border-[#003366] space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#003366] dark:text-[#3FCFC0]">
                  <span>Your Published Response</span>
                  <span className="font-normal text-gray-400">{rev.ownerResponse.date}</span>
                </div>
                <p className="text-xs text-[#0E1B22] dark:text-[#EAF2F4]">
                  "{rev.ownerResponse.comment}"
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
