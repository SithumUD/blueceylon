export interface Review {
  id: string;
  businessId: string;
  guestName: string;
  guestCountry: string;
  rating: number;
  date: string;
  verifiedStay: boolean;
  bookingRef: string;
  comment: string;
  ownerResponse?: {
    date: string;
    comment: string;
  };
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    businessId: "b-1",
    guestName: "Charlotte Miller",
    guestCountry: "United Kingdom",
    rating: 5,
    date: "July 12, 2026",
    verifiedStay: true,
    bookingRef: "BC-2026-8819",
    comment: "Absolutely breathtaking view of the Ella gap and Nine Arch Bridge! Kasun and his family made us feel right at home with homemade hopper breakfasts every morning. High quality bed linens and spotless bathroom.",
    ownerResponse: {
      date: "July 13, 2026",
      comment: "Thank you so much Charlotte! It was a pleasure hosting you both. Safe travels on your train journey to Kandy!",
    },
  },
  {
    id: "rev-2",
    businessId: "b-1",
    guestName: "Marcus Vance",
    guestCountry: "Australia",
    rating: 4.8,
    date: "June 28, 2026",
    verifiedStay: true,
    bookingRef: "BC-2026-7712",
    comment: "The plunge pool after hiking Ella Rock was a lifesaver. Quiet, peaceful, and super authentic.",
  },
  {
    id: "rev-3",
    businessId: "b-2",
    guestName: "Elena Rostova",
    guestCountry: "Germany",
    rating: 5,
    date: "July 04, 2026",
    verifiedStay: true,
    bookingRef: "BC-2026-9102",
    comment: "Staying inside Galle Fort is a dream. The colonial architecture has been preserved with such care. Highly recommend the evening cocktails in the courtyard.",
  },
];
