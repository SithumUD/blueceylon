"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Mail, Phone, Camera, CheckCircle2, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { updateMyAccount } from "@/lib/api/auth";

export default function UserProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateUserStore = useAuthStore((s) => s.updateUser);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhoneNumber(user.phoneNumber || "");
      setProfileImageUrl(user.profileImageUrl || "");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] text-center space-y-4">
          <User className="w-12 h-12 text-gray-400 mx-auto" />
          <h2 className="text-xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">Please Log In</h2>
          <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
            You need to be logged in to view and manage your account profile.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <Button variant="primary" className="w-full font-bold rounded-xl">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveSuccess(false);
    setErrorMessage("");

    try {
      const res = await updateMyAccount({
        firstName,
        lastName,
        phoneNumber,
        profileImageUrl,
      });

      if (res) {
        updateUserStore(res);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to update profile details.");
    } finally {
      setSavingProfile(false);
    }
  };

  const displayName = `${firstName} ${lastName}`.trim() || user.email;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

  return (
    <div className="min-h-screen py-10 px-4 max-w-5xl mx-auto space-y-8">
      {/* Header Banner & User Summary */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#003366] via-[#005580] to-[#008080] p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-white text-3xl font-black shadow-inner overflow-hidden">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="text-center md:text-left space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="font-display text-2xl md:text-3xl font-extrabold">{displayName}</h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md">
                {user.role}
              </span>
            </div>
            <p className="text-sm text-white/80 flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" /> {user.email}
            </p>

            {/* Email Verification Status */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-200 border border-emerald-400/30 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Email Verified
              </span>
            </div>
          </div>

          {/* Host / Admin Dashboard Quick Link */}
          {(user.role === "BUSINESS_OWNER" || user.role === "TOUR_GUIDE" || user.role === "ADMIN") && (
            <div className="shrink-0 pt-2 md:pt-0">
              <Link href="/dashboard">
                <Button variant="gold" size="lg" className="gap-2 font-bold rounded-xl shadow-lg">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Host Dashboard</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Settings Card */}
      <div className="bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
        <div className="border-b border-[#E4E9EA] dark:border-[#20353D] pb-4">
          <h2 className="font-display text-xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
            Personal Account Information
          </h2>
          <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] mt-1">
            Update your personal profile details across Blue Ceylon.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar URL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#4A5A62] dark:text-[#A9BCC2] flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" /> Profile Photo URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={profileImageUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileImageUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#4A5A62] dark:text-[#A9BCC2]">First Name</label>
              <input
                required
                type="text"
                value={firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#4A5A62] dark:text-[#A9BCC2]">Last Name</label>
              <input
                required
                type="text"
                value={lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#4A5A62] dark:text-[#A9BCC2] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <input
                disabled
                type="email"
                value={user.email}
                className="w-full px-4 py-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-white/5 text-sm cursor-not-allowed text-gray-500"
              />
              <span className="text-[10px] text-gray-400">Email address cannot be modified directly.</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#4A5A62] dark:text-[#A9BCC2] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Phone Number
              </label>
              <input
                type="tel"
                placeholder="+94 77 123 4567"
                value={phoneNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs font-bold text-red-500">{errorMessage}</p>
          )}

          {saveSuccess && (
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Profile details updated successfully!
            </p>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              disabled={savingProfile}
              variant="primary"
              size="lg"
              className="font-bold rounded-xl"
            >
              {savingProfile ? "Saving Profile..." : "Save Profile Details"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
