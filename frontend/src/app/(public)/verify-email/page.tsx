"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/lib/api/auth";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white dark:bg-[#0F252E] rounded-3xl border border-[#E4E9EA] dark:border-[#20353D]">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#008080] mb-3" />
        <p className="text-sm font-semibold text-[#4A5A62] dark:text-[#A9BCC2]">Verifying your email...</p>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Missing verification token. Please check your email link.");
      return;
    }

    let isMounted = true;
    async function doVerify() {
      try {
        await verifyEmail(token!);
        if (isMounted) {
          setStatus("success");
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus("error");
          setErrorMessage(err?.message || "Invalid or expired verification token.");
        }
      }
    }

    doVerify();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] shadow-xl text-center space-y-6">
        {status === "loading" && (
          <div className="space-y-4 py-6">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#008080]" />
            <h2 className="font-display text-2xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
              Verifying Email
            </h2>
            <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
              Please wait while we confirm your email address with Blue Ceylon...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
              Email Verified Successfully!
            </h2>
            <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">
              Your email address has been verified. You now have full access to your Blue Ceylon account and booking features.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button variant="primary" size="lg" className="w-full gap-2 font-bold rounded-xl">
                  <span>Proceed to Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
              Verification Failed
            </h2>
            <p className="text-xs text-red-500 font-medium">
              {errorMessage}
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <Link href="/login">
                <Button variant="ghost" size="lg" className="w-full font-bold rounded-xl border border-[#E4E9EA] dark:border-[#20353D]">
                  Go to Login Page
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
