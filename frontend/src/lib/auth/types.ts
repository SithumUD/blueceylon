// src/lib/auth/types.ts
// Mirrors UserProfileDto from backend spec exactly.
// When integrating backend, these types stay the same — only auth-service.ts changes.

export type UserRole = "TRAVELER" | "BUSINESS_OWNER" | "TOUR_GUIDE" | "ADMIN";
export type BusinessType = "HOTEL" | "TOUR_AGENCY" | "TOUR_GUIDE" | null;

export interface User {
  id: string;
  keycloakSub: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  profileImageUrl: string | null;
  role: UserRole;
  businessType: BusinessType;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
}
