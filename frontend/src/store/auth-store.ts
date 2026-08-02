// src/store/auth-store.ts
// Zustand store for authentication state with localStorage persistence.
// Uses TanStack Query for async mutations (login/register).

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, LoginRequest, RegisterRequest } from "@/lib/auth/types";
import {
  loginService,
  registerService,
  logoutService,
} from "@/lib/auth/auth-service";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (req: LoginRequest) => Promise<void>;
  register: (req: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      error: null,

      login: async (req) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginService(req);
          set({
            user: response.user,
            accessToken: response.accessToken,
            isLoading: false,
            error: null,
          });
        } catch (err: unknown) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : "Login failed",
          });
          throw err;
        }
      },

      register: async (req) => {
        set({ isLoading: true, error: null });
        try {
          const response = await registerService(req);
          set({
            user: response.user,
            accessToken: response.accessToken,
            isLoading: false,
            error: null,
          });
        } catch (err: unknown) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : "Registration failed",
          });
          throw err;
        }
      },

      logout: () => {
        logoutService();
        set({ user: null, accessToken: null, error: null });
      },

      clearError: () => set({ error: null }),
      setLoading: (v) => set({ isLoading: v }),
    }),
    {
      name: "bc-auth-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist the user + token, not transient loading/error state
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);

// ── Selector helpers (use these in components for minimal re-renders) ──────
export const selectUser = (s: AuthState) => s.user;
export const selectIsAuthenticated = (s: AuthState) => s.user !== null;
export const selectIsLoading = (s: AuthState) => s.isLoading;
export const selectError = (s: AuthState) => s.error;
export const selectRole = (s: AuthState) => s.user?.role ?? null;
export const selectBusinessType = (s: AuthState) => s.user?.businessType ?? null;
