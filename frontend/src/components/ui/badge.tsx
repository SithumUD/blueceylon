import React from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sltda" | "success" | "pending" | "cancelled" | "neutral";
}

export function Badge({ className, variant = "neutral", children, ...props }: BadgeProps) {
  if (variant === "sltda") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FDA301] text-[#001F3D] shadow-sm border border-[#E88A00]/30",
          className
        )}
        {...props}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-[#001F3D]" />
        <span>SLTDA Verified</span>
      </div>
    );
  }

  const variants = {
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300/30",
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300/30",
    cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-300/30",
    neutral: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
