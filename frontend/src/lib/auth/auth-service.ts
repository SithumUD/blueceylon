// src/lib/auth/auth-service.ts
//
// ⚡ BACKEND SWAP POINT ⚡
// This is the ONLY file that changes when connecting to the real backend.
// Replace the dummy implementations below with real fetch() calls to:
//   POST /api/v1/auth/login
//   POST /api/v1/auth/register
//   POST /api/v1/auth/logout
// All types already match the backend AuthResponse / UserProfileDto spec.

import type { AuthResponse, LoginRequest, RegisterRequest } from "./types";
import { DUMMY_USERS } from "./dummy-users";

export const AUTH_TOKEN_KEY = "bc_access_token";
export const AUTH_USER_KEY = "bc_auth_user";

// ─────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────
export async function loginService(req: LoginRequest): Promise<AuthResponse> {
  // TODO (backend): Replace with:
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(req),
  // });
  // if (!res.ok) throw new Error((await res.json()).message || "Login failed");
  // return res.json() as Promise<AuthResponse>;

  await new Promise((r) => setTimeout(r, 600)); // simulate network delay

  const match = DUMMY_USERS.find(
    (u) => u.email === req.email && u._password === req.password
  );

  if (!match) {
    throw new Error("Invalid email or password.");
  }

  const { _password: _, ...user } = match;

  const response: AuthResponse = {
    accessToken: `dummy_access_${user.id}_${Date.now()}`,
    refreshToken: `dummy_refresh_${user.id}`,
    expiresIn: 3600,
    user,
  };

  persistSession(response);
  return response;
}

// ─────────────────────────────────────────
// REGISTER (Traveler only via main register page)
// ─────────────────────────────────────────
export async function registerService(req: RegisterRequest): Promise<AuthResponse> {
  // TODO (backend): Replace with:
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(req),
  // });
  // if (!res.ok) throw new Error((await res.json()).message || "Registration failed");
  // return res.json() as Promise<AuthResponse>;

  await new Promise((r) => setTimeout(r, 800));

  const existing = DUMMY_USERS.find((u) => u.email === req.email);
  if (existing) throw new Error("An account with this email already exists.");

  const newUser = {
    id: `usr_new_${Date.now()}`,
    keycloakSub: `kc-sub-new-${Date.now()}`,
    email: req.email,
    firstName: req.firstName,
    lastName: req.lastName,
    phoneNumber: req.phoneNumber || null,
    profileImageUrl: null,
    role: req.role,
    businessType: null as null,
  };

  const response: AuthResponse = {
    accessToken: `dummy_access_${newUser.id}`,
    refreshToken: `dummy_refresh_${newUser.id}`,
    expiresIn: 3600,
    user: newUser,
  };

  persistSession(response);
  return response;
}

// ─────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────
export function logoutService(): void {
  // TODO (backend): Call POST /api/v1/auth/logout with refresh token if needed
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
