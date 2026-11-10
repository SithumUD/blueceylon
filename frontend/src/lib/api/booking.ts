import { apiFetch } from "./client";
import type { DashboardBooking, BookingStatus, PaymentMethod } from "../mock-data/bookings";

export interface BookingRequest {
  businessId: string;
  itemType: "ROOM" | "TOUR_PACKAGE" | "DAY_OUT_PACKAGE" | "NIGHT_OUT_PACKAGE" | "GUIDE";
  itemId: string;
  checkInDate: string;  // ISO Date "YYYY-MM-DD"
  checkOutDate?: string; // ISO Date "YYYY-MM-DD" (optional for day/night passes)
  startTime?: string;   // "HH:mm" (optional)
  endTime?: string;     // "HH:mm" (optional)
  quantity?: number;
  guestCount?: number;
  paymentMethod: PaymentMethod;
}

export async function createBooking(req: BookingRequest): Promise<DashboardBooking> {
  return apiFetch<DashboardBooking>("/api/v1/bookings", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function getMyBookings(): Promise<DashboardBooking[]> {
  return apiFetch<DashboardBooking[]>("/api/v1/bookings/me", {
    method: "GET",
  });
}

export async function getBusinessBookings(businessId: string): Promise<DashboardBooking[]> {
  return apiFetch<DashboardBooking[]>(`/api/v1/bookings/business/${businessId}`, {
    method: "GET",
  });
}

export async function cancelBooking(id: string): Promise<DashboardBooking> {
  return apiFetch<DashboardBooking>(`/api/v1/bookings/${id}/cancel`, {
    method: "PUT",
  });
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<DashboardBooking> {
  return apiFetch<DashboardBooking>(`/api/v1/bookings/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export interface AvailabilityCheckResponse {
  available: boolean;
  availableUnits: number;
  message: string;
  pricePerNight?: number;
  totalNights?: number;
  totalPrice?: number;
}

export async function checkRoomAvailability(params: {
  roomId: string;
  checkIn: string;
  checkOut: string;
  quantity?: number;
  guestCount?: number;
}): Promise<AvailabilityCheckResponse> {
  return apiFetch<AvailabilityCheckResponse>(`/api/v1/bookings/public/availability/rooms/${params.roomId}`, {
    method: "GET",
    params: {
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      quantity: params.quantity || 1,
      guestCount: params.guestCount || 1,
    },
  });
}

