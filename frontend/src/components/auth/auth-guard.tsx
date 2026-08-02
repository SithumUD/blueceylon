"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import type { UserRole } from "@/lib/auth/types";

interface AuthGuardProps {
  children: React.ReactNode;
  /** Roles that are allowed to access the wrapped content */
  roles: UserRole[];
  /** Where to redirect unauthenticated users. Defaults to /login */
  redirectTo?: string;
  /** Where to redirect authenticated but wrong-role users. Defaults to / */
  unauthorizedRedirect?: string;
}

export function AuthGuard({
  children,
  roles,
  redirectTo = "/login",
  unauthorizedRedirect = "/",
}: AuthGuardProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [hydrated, setHydrated] = useState(false);

  // Wait for Zustand to hydrate from localStorage before making decisions
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!user) {
      // Not logged in → go to login, preserve intended destination
      const currentPath = window.location.pathname;
      router.replace(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (!roles.includes(user.role)) {
      // Logged in but wrong role → go to home/unauthorized
      router.replace(unauthorizedRedirect);
    }
  }, [hydrated, user, roles, redirectTo, unauthorizedRedirect, router]);

  // While hydrating or while redirecting, show a loading screen
  if (!hydrated || !user || !roles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#081419] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#003366] to-[#008080] animate-pulse" />
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-[#008080] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-xs text-[#4A5A62] font-semibold">Verifying access…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
