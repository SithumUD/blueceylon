export interface DashboardBooking {
  id: string;
  bookingRef: string;
  guestName: string;
  guestEmail: string;
  propertyName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: "CONFIRMED" | "PENDING" | "CANCELLED";
  totalPriceUSD: number;
  paymentMethod: "PAY_AT_PROPERTY" | "CREDIT_CARD";
}

export const MOCK_DASHBOARD_BOOKINGS: DashboardBooking[] = [
  {
    id: "bk-1",
    bookingRef: "BC-2026-8819",
    guestName: "Charlotte Miller",
    guestEmail: "charlotte.m@example.com",
    propertyName: "Nine Arch Heritage Villa",
    roomName: "Mountain Mist Deluxe King Suite",
    checkIn: "2026-08-10",
    checkOut: "2026-08-14",
    status: "CONFIRMED",
    totalPriceUSD: 340,
    paymentMethod: "PAY_AT_PROPERTY",
  },
  {
    id: "bk-2",
    bookingRef: "BC-2026-9041",
    guestName: "Liam Hemsworth",
    guestEmail: "liam.h@example.com",
    propertyName: "Nine Arch Heritage Villa",
    roomName: "Nine Arch Panorama Family Loft",
    checkIn: "2026-08-18",
    checkOut: "2026-08-21",
    status: "PENDING",
    totalPriceUSD: 420,
    paymentMethod: "PAY_AT_PROPERTY",
  },
  {
    id: "bk-3",
    bookingRef: "BC-2026-7712",
    guestName: "Marcus Vance",
    guestEmail: "marcus.v@example.com",
    propertyName: "Nine Arch Heritage Villa",
    roomName: "Mountain Mist Deluxe King Suite",
    checkIn: "2026-07-20",
    checkOut: "2026-07-23",
    status: "CONFIRMED",
    totalPriceUSD: 255,
    paymentMethod: "CREDIT_CARD",
  },
];
