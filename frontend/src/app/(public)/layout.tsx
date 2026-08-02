import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LocationPermissionModal } from "@/components/common/location-permission-modal";

/**
 * (public) layout — wraps all public-facing pages.
 * Renders the shared Navbar and Footer.
 * The admin and dashboard route groups have their own isolated layouts.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LocationPermissionModal />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
