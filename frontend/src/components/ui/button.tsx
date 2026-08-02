import React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-98 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
      primary: "bg-[#003366] hover:bg-[#004080] text-white focus:ring-[#003366]",
      secondary: "border-1.5 border-[#006666] text-[#006666] hover:bg-[#006666]/10 focus:ring-[#006666]",
      gold: "bg-[#FDA301] hover:bg-[#E88A00] text-[#001F3D] font-semibold shadow-sm focus:ring-[#FDA301]",
      ghost: "text-[#4A5A62] hover:text-[#0E1B22] hover:bg-black/5 focus:ring-gray-300",
      destructive: "bg-[#D64545] hover:bg-[#b83838] text-white focus:ring-[#D64545]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
