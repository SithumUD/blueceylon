// ============================================================
// BlueCeylon Mock Data — Bookings (Dashboard)
// Field names aligned to backend Booking domain model
// ============================================================

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "EXPIRED";
export type PaymentMethod = "PAYHERE" | "CASH" | "BANK_TRANSFER";  // ← was: PAY_AT_PROPERTY | CREDIT_CARD
export type BookingItemType = "ROOM" | "TOUR_PACKAGE" | "DAY_OUT_PACKAGE" | "NIGHT_OUT_PACKAGE" | "GUIDE";

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pending Confirmation",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  EXPIRED: "Expired",
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
  CONFIRMED: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
  CANCELLED: "text-red-500 bg-red-50 dark:bg-red-900/20",
  COMPLETED: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
  EXPIRED: "text-gray-500 bg-gray-100 dark:bg-gray-800",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  PAYHERE: "Online Payment (PayHere)",
  CASH: "Cash at Property",
  BANK_TRANSFER: "Bank Transfer",
};

export interface DashboardBooking {
  id: string;
  bookingReference: string;      // ← was: bookingRef (human-readable BC-XXXX)
  guestName: string;
  guestEmail: string;
  propertyName: string;          // denormalized display name
  itemType: BookingItemType;     // ← NEW: what was booked
  itemName: string;              // denormalized item name (room name, tour title etc.)
  checkIn: string;               // ISO date
  checkOut?: string;             // ISO date (optional for day/night packages)
  status: BookingStatus;         // ← added COMPLETED + EXPIRED states
  totalPrice: number;            // ← was: totalPriceUSD (currency-agnostic field name)
  currency: "USD" | "LKR";
  paymentMethod: PaymentMethod;  // ← was: PAY_AT_PROPERTY | CREDIT_CARD
  guestCount?: number;
}

export const MOCK_DASHBOARD_BOOKINGS: DashboardBooking[] = [
  {
    id: "bk-1",
    bookingReference: "BC-2026-8819",
    guestName: "Charlotte Miller",
    guestEmail: "charlotte.m@example.com",
    propertyName: "Nine Arch Heritage Villa",
    itemType: "ROOM",
    itemName: "Mountain Mist Deluxe King Suite",
    checkIn: "2026-08-10",
    checkOut: "2026-08-14",
    status: "CONFIRMED",
    totalPrice: 340,
    currency: "USD",
    paymentMethod: "CASH",
    guestCount: 2,
  },
  {
    id: "bk-2",
    bookingReference: "BC-2026-9041",
    guestName: "Liam Hemsworth",
    guestEmail: "liam.h@example.com",
    propertyName: "Nine Arch Heritage Villa",
    itemType: "ROOM",
    itemName: "Nine Arch Panorama Family Loft",
    checkIn: "2026-08-18",
    checkOut: "2026-08-21",
    status: "PENDING",
    totalPrice: 420,
    currency: "USD",
    paymentMethod: "PAYHERE",
    guestCount: 4,
  },
  {
    id: "bk-3",
    bookingReference: "BC-2026-7712",
    guestName: "Marcus Vance",
    guestEmail: "marcus.v@example.com",
    propertyName: "Nine Arch Heritage Villa",
    itemType: "ROOM",
    itemName: "Mountain Mist Deluxe King Suite",
    checkIn: "2026-07-20",
    checkOut: "2026-07-23",
    status: "COMPLETED",
    totalPrice: 255,
    currency: "USD",
    paymentMethod: "PAYHERE",
    guestCount: 2,
  },
  {
    id: "bk-4",
    bookingReference: "BC-2026-6610",
    guestName: "Sophia Muller",
    guestEmail: "sophia.m@example.com",
    propertyName: "Nine Arch Heritage Villa",
    itemType: "TOUR_PACKAGE",
    itemName: "Ella Rock & Nine Arch Sunrise Trekking Experience",
    checkIn: "2026-09-08",
    status: "CONFIRMED",
    totalPrice: 40,
    currency: "USD",
    paymentMethod: "BANK_TRANSFER",
    guestCount: 1,
  },
  {
    id: "bk-5",
    bookingReference: "BC-2026-5511",
    guestName: "James Thornton",
    guestEmail: "james.t@example.com",
    propertyName: "Nine Arch Heritage Villa",
    itemType: "DAY_OUT_PACKAGE",
    itemName: "Ella Infinity Pool & Scenic Lunch Pass",
    checkIn: "2026-07-05",
    status: "COMPLETED",
    totalPrice: 70,
    currency: "USD",
    paymentMethod: "CASH",
    guestCount: 2,
  },
];
