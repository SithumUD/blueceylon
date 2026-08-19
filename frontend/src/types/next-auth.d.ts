import { UserRole, BusinessType } from "@/lib/auth/types";
import DefaultSession from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      email: string;
      name?: string | null;
      role?: UserRole;
      businessType?: BusinessType;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    accessToken?: string;
    refreshToken?: string;
    role?: UserRole;
    businessType?: BusinessType;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    role?: UserRole;
    businessType?: BusinessType;
  }
}
