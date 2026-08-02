import React from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#003366] to-[#008080] text-white flex items-center justify-center shadow-lg">
        <Compass className="w-8 h-8 text-[#5CE1E6]" />
      </div>
      <div className="space-y-2">
        <h1 className="font-display font-bold text-4xl text-[#0E1B22] dark:text-[#EAF2F4]">
          404 — Page Not Found
        </h1>
        <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] max-w-md mx-auto">
          The beach cove or heritage villa route you are looking for doesn't exist or has moved.
        </p>
      </div>
      <Link href="/">
        <Button variant="primary" size="lg">
          Return to Homepage
        </Button>
      </Link>
    </div>
  );
}
