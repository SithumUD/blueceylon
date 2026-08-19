import { apiFetch } from "./client";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../auth/types";

export async function login(req: LoginRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function register(req: RegisterRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function refreshTokenApi(refreshToken: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/v1/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: "GET",
  });
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("/api/v1/auth/logout", {
      method: "POST",
    });
  } catch {
    // Gracefully handle or log logout backend failures (e.g., if token already expired)
  }
}

export async function getAdminUsers(params?: { search?: string; role?: string }): Promise<any[]> {
  return apiFetch<any[]>("/api/v1/auth/admin/users", {
    method: "GET",
    params,
  });
}

export async function updateUserRole(userId: string, role: string, businessType?: string | null): Promise<any> {
  return apiFetch<any>(`/api/v1/auth/admin/users/${userId}/role`, {
    method: "PUT",
    body: JSON.stringify({ role, businessType }),
  });
}

export async function deleteUser(userId: string): Promise<void> {
  return apiFetch<void>(`/api/v1/auth/admin/users/${userId}/soft-delete`, {
    method: "DELETE",
  });
}

export async function updateMyAccount(payload: {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImageUrl?: string;
}): Promise<any> {
  return apiFetch<any>("/api/v1/auth/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
