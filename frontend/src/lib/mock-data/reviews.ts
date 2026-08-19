// ============================================================
// BlueCeylon Mock Data — Reviews
// Field names aligned to backend Review domain model
// ============================================================

export type ReviewEntityType =
  | "HOTEL"
  | "ROOM"
  | "TOUR_PACKAGE"
  | "TOUR_GUIDE"
  | "TOUR_AGENCY"
  | "DAY_OUT_PACKAGE"
  | "NIGHT_OUT_PACKAGE";

export interface Review {
  id: string;
  entityId: string;               // ← was: businessId (now more generic: hotel/room/tour/guide)
  entityType: ReviewEntityType;   // ← NEW: needed alongside entityId
  reviewerName: string;           // ← was: guestName
  reviewerCountry?: string;       // ← was: guestCountry (optional, display only)
  rating: number;
  stayOrTourDate: string;         // ← was: date (ISO format: "2026-07-12")
  verified: boolean;              // ← was: verifiedStay
  bookingId?: string;             // ← was: bookingRef (UUID from booking-service)
  bookingReference?: string;      // human-readable display ref e.g. "BC-2026-8819"
  comment: string;
  providerResponse?: string;      // ← was: ownerResponse.comment (flat string now)
  providerResponseAt?: string;    // ← added: ISO datetime of response
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    entityId: "b-1",
    entityType: "HOTEL",
    reviewerName: "Charlotte Miller",
    reviewerCountry: "United Kingdom",
    rating: 5,
    stayOrTourDate: "2026-07-12",
    verified: true,
    bookingId: "bk-uuid-8819",
    bookingReference: "BC-2026-8819",
    comment:
      "Absolutely breathtaking view of the Ella gap and Nine Arch Bridge! Kasun and his family made us feel right at home with homemade hopper breakfasts every morning. High quality bed linens and spotless bathroom.",
    providerResponse:
      "Thank you so much Charlotte! It was a pleasure hosting you both. Safe travels on your train journey to Kandy!",
    providerResponseAt: "2026-07-13T09:30:00Z",
  },
  {
    id: "rev-2",
    entityId: "b-1",
    entityType: "HOTEL",
    reviewerName: "Marcus Vance",
    reviewerCountry: "Australia",
    rating: 4.8,
    stayOrTourDate: "2026-06-28",
    verified: true,
    bookingId: "bk-uuid-7712",
    bookingReference: "BC-2026-7712",
    comment:
      "The plunge pool after hiking Ella Rock was a lifesaver. Quiet, peaceful, and super authentic.",
  },
  {
    id: "rev-3",
    entityId: "b-2",
    entityType: "HOTEL",
    reviewerName: "Elena Rostova",
    reviewerCountry: "Germany",
    rating: 5,
    stayOrTourDate: "2026-07-04",
    verified: true,
    bookingId: "bk-uuid-9102",
    bookingReference: "BC-2026-9102",
    comment:
      "Staying inside Galle Fort is a dream. The colonial architecture has been preserved with such care. Highly recommend the evening cocktails in the courtyard.",
    providerResponse:
      "Dear Elena, we were so delighted to have you stay with us. Come back soon!",
    providerResponseAt: "2026-07-05T14:00:00Z",
  },
];
