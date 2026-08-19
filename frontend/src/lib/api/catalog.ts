import { apiFetch } from "./client";
import type { Business, Room, TourPackage, DayOutPackage, NightOutPackage } from "../mock-data/businesses";

// ─────────────────────────────────────────
// PUBLIC ENDPOINTS
// ─────────────────────────────────────────

export async function searchBusinesses(params: {
  type?: string;
  city?: string;
  page?: number;
  size?: number;
}): Promise<{ content: Business[]; totalElements: number }> {
  return apiFetch<{ content: Business[]; totalElements: number }>("/api/v1/catalog/public/search/businesses", {
    method: "GET",
    params,
  });
}

export async function getBusinessById(id: string): Promise<Business> {
  return apiFetch<Business>(`/api/v1/catalog/public/search/business/${id}`, {
    method: "GET",
  });
}

export async function searchRooms(params: {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
}): Promise<{ content: Room[]; totalElements: number }> {
  return apiFetch<{ content: Room[]; totalElements: number }>("/api/v1/catalog/public/search/rooms", {
    method: "GET",
    params,
  });
}

export async function searchTours(params: {
  city?: string;
  category?: string;
  providerType?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
}): Promise<{ content: TourPackage[]; totalElements: number }> {
  return apiFetch<{ content: TourPackage[]; totalElements: number }>("/api/v1/catalog/public/search/tours", {
    method: "GET",
    params,
  });
}

export async function getRoomById(id: string): Promise<Room> {
  return apiFetch<Room>(`/api/v1/catalog/public/items/rooms/${id}`, {
    method: "GET",
  });
}

export async function getDayOutPackageById(id: string): Promise<DayOutPackage> {
  return apiFetch<DayOutPackage>(`/api/v1/catalog/public/items/day-out/${id}`, {
    method: "GET",
  });
}

export async function getNightOutPackageById(id: string): Promise<NightOutPackage> {
  return apiFetch<NightOutPackage>(`/api/v1/catalog/public/items/night-out/${id}`, {
    method: "GET",
  });
}

export async function getTourById(id: string): Promise<TourPackage> {
  return apiFetch<TourPackage>(`/api/v1/catalog/public/items/tours/${id}`, {
    method: "GET",
  });
}

// FAQs
export async function getBusinessFaqs(businessId: string): Promise<Array<{ id: string; question: string; answer: string }>> {
  return apiFetch<Array<{ id: string; question: string; answer: string }>>(`/api/v1/catalog/public/businesses/${businessId}/faqs`, {
    method: "GET",
  });
}

// ─────────────────────────────────────────
// OWNER REGISTER & PROFILE MANAGEMENT
// ─────────────────────────────────────────

export async function getMyBusiness(): Promise<Business> {
  return apiFetch<Business>("/api/v1/catalog/business/me", {
    method: "GET",
  });
}

export async function createHotelDraft(req: Partial<Business>): Promise<Business> {
  return apiFetch<Business>("/api/v1/catalog/business/me/hotel/draft", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function createAgencyDraft(req: Partial<Business>): Promise<Business> {
  return apiFetch<Business>("/api/v1/catalog/business/me/agency/draft", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function createGuideDraft(req: Partial<Business>): Promise<Business> {
  return apiFetch<Business>("/api/v1/catalog/business/me/guide/draft", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function submitBusiness(): Promise<Business> {
  return apiFetch<Business>("/api/v1/catalog/business/me/submit", {
    method: "POST",
  });
}

export async function deleteMyBusiness(): Promise<void> {
  return apiFetch<void>("/api/v1/catalog/business/me", {
    method: "DELETE",
  });
}

// Rooms
export async function createRoom(req: Partial<Room>): Promise<Room> {
  return apiFetch<Room>("/api/v1/catalog/business/me/rooms", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function getMyRooms(): Promise<Room[]> {
  return apiFetch<Room[]>("/api/v1/catalog/business/me/rooms", {
    method: "GET",
  });
}

export async function updateRoom(roomId: string, req: Partial<Room>): Promise<Room> {
  return apiFetch<Room>(`/api/v1/catalog/business/me/rooms/${roomId}`, {
    method: "PUT",
    body: JSON.stringify(req),
  });
}

export async function deleteRoom(roomId: string): Promise<void> {
  return apiFetch<void>(`/api/v1/catalog/business/me/rooms/${roomId}`, {
    method: "DELETE",
  });
}

// Day-Out Packages
export async function createDayOutPackage(req: Partial<DayOutPackage>): Promise<DayOutPackage> {
  return apiFetch<DayOutPackage>("/api/v1/catalog/business/me/day-out-packages", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function getMyDayOutPackages(): Promise<DayOutPackage[]> {
  return apiFetch<DayOutPackage[]>("/api/v1/catalog/business/me/day-out-packages", {
    method: "GET",
  });
}

export async function updateDayOutPackage(packageId: string, req: Partial<DayOutPackage>): Promise<DayOutPackage> {
  return apiFetch<DayOutPackage>(`/api/v1/catalog/business/me/day-out-packages/${packageId}`, {
    method: "PUT",
    body: JSON.stringify(req),
  });
}

export async function deleteDayOutPackage(packageId: string): Promise<void> {
  return apiFetch<void>(`/api/v1/catalog/business/me/day-out-packages/${packageId}`, {
    method: "DELETE",
  });
}

// Night-Out Packages
export async function createNightOutPackage(req: Partial<NightOutPackage>): Promise<NightOutPackage> {
  return apiFetch<NightOutPackage>("/api/v1/catalog/business/me/night-out-packages", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function getMyNightOutPackages(): Promise<NightOutPackage[]> {
  return apiFetch<NightOutPackage[]>("/api/v1/catalog/business/me/night-out-packages", {
    method: "GET",
  });
}

export async function updateNightOutPackage(packageId: string, req: Partial<NightOutPackage>): Promise<NightOutPackage> {
  return apiFetch<NightOutPackage>(`/api/v1/catalog/business/me/night-out-packages/${packageId}`, {
    method: "PUT",
    body: JSON.stringify(req),
  });
}

export async function deleteNightOutPackage(packageId: string): Promise<void> {
  return apiFetch<void>(`/api/v1/catalog/business/me/night-out-packages/${packageId}`, {
    method: "DELETE",
  });
}

// Tour Packages
export async function createTourPackage(req: Partial<TourPackage>): Promise<TourPackage> {
  return apiFetch<TourPackage>("/api/v1/catalog/business/me/tour-packages", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function getMyTourPackages(): Promise<TourPackage[]> {
  return apiFetch<TourPackage[]>("/api/v1/catalog/business/me/tour-packages", {
    method: "GET",
  });
}

export async function updateTourPackage(packageId: string, req: Partial<TourPackage>): Promise<TourPackage> {
  return apiFetch<TourPackage>(`/api/v1/catalog/business/me/tour-packages/${packageId}`, {
    method: "PUT",
    body: JSON.stringify(req),
  });
}

export async function deleteTourPackage(packageId: string): Promise<void> {
  return apiFetch<void>(`/api/v1/catalog/business/me/tour-packages/${packageId}`, {
    method: "DELETE",
  });
}

// ─────────────────────────────────────────
// ADMIN MODERATION ENDPOINTS
// ─────────────────────────────────────────

export async function getPendingVerifications(): Promise<Business[]> {
  return apiFetch<Business[]>("/api/v1/catalog/admin/business/pending", {
    method: "GET",
  });
}

export async function approveBusiness(id: string): Promise<void> {
  return apiFetch<void>(`/api/v1/catalog/admin/business/${id}/approve`, {
    method: "POST",
  });
}

export async function rejectBusiness(id: string, reason: string): Promise<void> {
  return apiFetch<void>(`/api/v1/catalog/admin/business/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}
