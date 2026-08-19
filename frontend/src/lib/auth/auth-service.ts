// src/lib/auth/auth-service.ts
//
// ⚡ BACKEND SWAP POINT ⚡
// This file is now connected to the real backend using the src/lib/api/auth endpoints.
// All types spec-aligned.

import type { AuthResponse, LoginRequest, RegisterRequest } from "./types";
import { login, register, logout } from "../api/auth";

export const AUTH_TOKEN_KEY = "bc_access_token";
export const AUTH_USER_KEY = "bc_auth_user";

// ─────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────
export async function loginService(req: LoginRequest): Promise<AuthResponse> {
  const response = await login(req);
  persistSession(response);
  return response;
}

// ─────────────────────────────────────────
// REGISTER (Traveler only via main register page)
// ─────────────────────────────────────────
export async function registerService(req: RegisterRequest): Promise<AuthResponse> {
  const response = await register(req);
  persistSession(response);
  return response;
}

// ─────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────
export function logoutService(): void {
  logout().catch(() => {});
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }
}

// ─────────────────────────────────────────
// SESSION PERSISTENCE HELPERS
// ─────────────────────────────────────────
function persistSession(response: AuthResponse): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
  }
}

export function getPersistedUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getPersistedToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}
