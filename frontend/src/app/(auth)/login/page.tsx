"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, KeyRound } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";


function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs uppercase tracking-widest font-semibold mb-1.5" style={{ color: "#4A5A62", letterSpacing: "0.06em" }}>
      {children}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 mt-1.5 text-xs" style={{ color: "#D64545" }}>
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {msg}
    </p>
  );
}

function InputIcon({ children }: { children: React.ReactNode }) {
  return <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none" style={{ color: "#9AAAB0" }}>{children}</span>;
}

const inputBase = "w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-all duration-150 bg-white outline-none";
const inputStyle = { borderColor: "#E4E9EA", color: "#0E1B22" };
const inputFocusClass = "focus:ring-2 focus:ring-[#006666]/30 focus:border-[#006666]";

interface LoginForm { email: string; password: string; otp: string; }
interface LoginErrors { email?: string; password?: string; general?: string; }

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "", otp: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const validate = (): boolean => {
    const next: LoginErrors = {};
    if (!form.email) next.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const login = useAuthStore((s) => s.login);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      // Role-based redirect after successful login
      const user = useAuthStore.getState().user;
      if (user?.role === "ADMIN") {
        router.push("/admin");
      } else if (user?.role === "BUSINESS_OWNER" || user?.role === "TOUR_GUIDE") {
        router.push(redirectTo || "/dashboard");
      } else {
        router.push(redirectTo || "/");
      }
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : "Login failed" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen bg-[#F4F6F8] dark:bg-[#081419]">
      {/* ══ LEFT PANEL — immersive destination panel ══ */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[44%] flex-col relative overflow-hidden flex-shrink-0"
        style={{ background: "linear-gradient(160deg, #001528 0%, #003366 35%, #005F73 68%, #008080 100%)" }}>
        
        {/* Layered glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(92,225,230,0.12) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 -right-40 w-[520px] h-[520px] rounded-full" style={{ background: "radial-gradient(circle, rgba(253,163,1,0.10) 0%, transparent 65%)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,128,128,0.08) 0%, transparent 60%)" }} />
        </div>

        {/* Subtle grid texture overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        {/* Top: Logo */}
        <div className="relative z-10 px-10 pt-9">
          <Link href="/" className="inline-block group">
            <Image src="/images/blueceylon-navbar.svg" alt="Blue Ceylon" width={148} height={36} priority className="opacity-90 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* Center: Hero copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 py-12 gap-10">
          <div className="inline-flex items-center gap-2 self-start">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#FDA301" }} />
            <span className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: "#FDA301" }}>Sri Lanka's #1 Tourism Platform</span>
          </div>

          <div>
            <h2 className="text-4xl xl:text-5xl font-bold leading-[1.12] tracking-tight text-white" style={{ fontFamily: "'Fraunces', serif" }}>
              Discover the<br />
              <span style={{ background: "linear-gradient(90deg, #5CE1E6, #3FCFC0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Pearl of the</span><br />
              Indian Ocean
            </h2>
            <p className="mt-5 text-sm leading-relaxed max-w-xs" style={{ color: "rgba(220,238,242,0.70)" }}>
              SLTDA-verified hotels, boutique villas, licensed private guides, and unforgettable day experiences — all in one place.
            </p>
          </div>

          <div className="flex flex-col gap-3 max-w-xs">
            {[
              { icon: "🏨", label: "500+ SLTDA-Verified Hotels & Villas" },
              { icon: "🧭", label: "Licensed Private Tour Guides" },
              { icon: "🌊", label: "Curated Day Out & Night Experiences" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(220,238,242,0.88)", backdropFilter: "blur(8px)" }}>
                <span className="text-base flex-shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="relative z-10">
          <div className="px-10 py-5 flex items-center gap-8 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            {[{ value: "500+", label: "Properties" }, { value: "200+", label: "Guides" }, { value: "25k+", label: "Travelers" }].map((stat) => (
              <div key={stat.label}>
                <p className="text-lg font-bold text-white" style={{ fontFamily: "'Fraunces', serif" }}>{stat.value}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="px-10 pb-7">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>© {new Date().getFullYear()} Blue Ceylon. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — form area ══ */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Mobile-only header */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b bg-white dark:bg-[#0F252E]" style={{ borderColor: "#E4E9EA" }}>
          <Link href="/"><Image src="/images/blueceylon-navbar.svg" alt="Blue Ceylon" width={120} height={30} priority className="dark:brightness-200" /></Link>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#FDA301" }} />
            <span className="text-xs font-semibold text-[#4A5A62] dark:text-[#A9BCC2]">SLTDA Verified</span>
          </div>
        </div>

        {/* Centered form card */}
        <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-[#0F252E] rounded-2xl shadow-lg overflow-hidden border border-[#E4E9EA] dark:border-[#20353D]">
              <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #003366, #005F73, #008080, #3FCFC0)" }} />

              <div className="px-8 py-9 space-y-7">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>
                    Welcome back
                  </h1>
                  <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2]">Sign in to your Blue Ceylon account to continue your journey.</p>
                </div>

                {errors.general && (
                  <div className="flex items-start gap-2 px-4 py-3 rounded-lg text-sm" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#D64545" }}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{errors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <InputIcon><Mail className="w-4 h-4" /></InputIcon>
                      <input id="email" type="email" required placeholder="you@example.com" value={form.email} onChange={set("email")}
                        className={`${inputBase} ${inputFocusClass} dark:bg-[#15323D] dark:text-white`}
                        style={{ ...inputStyle, borderColor: errors.email ? "#D64545" : "inherit" }} />
                    </div>
                    <FieldError msg={errors.email} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/forgot-password" className="text-xs font-semibold hover:underline" style={{ color: "#006666" }}>Forgot password?</Link>
                    </div>
                    <div className="relative">
                      <InputIcon><Lock className="w-4 h-4" /></InputIcon>
                      <input id="password" type={showPass ? "text" : "password"} required placeholder="••••••••" value={form.password} onChange={set("password")}
                        className={`${inputBase} ${inputFocusClass} pr-11 dark:bg-[#15323D] dark:text-white`}
                        style={{ ...inputStyle, borderColor: errors.password ? "#D64545" : "inherit" }} />
                      <button type="button" onClick={() => setShowPass(v => !v)} className="absolute inset-y-0 right-3 flex items-center text-[#9AAAB0]" tabIndex={-1}>
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <FieldError msg={errors.password} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label htmlFor="otp">2FA / OTP Code <span style={{ color: "#9AAAB0", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(if enabled)</span></Label>
                    </div>
                    <div className="relative">
                      <InputIcon><KeyRound className="w-4 h-4" /></InputIcon>
                      <input id="otp" type="text" placeholder="6-digit code" maxLength={6} value={form.otp} onChange={set("otp")}
                        className={`${inputBase} ${inputFocusClass} dark:bg-[#15323D] dark:text-white`}
                        style={{ ...inputStyle }} />
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-sm font-semibold text-white transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: loading ? "#004080" : "linear-gradient(135deg, #003366 0%, #005F73 60%, #008080 100%)", boxShadow: "0 4px 12px rgba(0,51,102,0.25)" }}>
                    {loading ? "Signing in…" : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px" style={{ background: "#E4E9EA" }} />
                  <span className="text-xs font-medium" style={{ color: "#9AAAB0" }}>or continue with</span>
                  <div className="flex-1 h-px" style={{ background: "#E4E9EA" }} />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Google */}
                  <button type="button" className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#E4E9EA] dark:border-[#20353D] text-xs font-medium hover:bg-gray-50 dark:hover:bg-[#15323D] transition-all">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="hidden sm:inline">Google</span>
                  </button>
                  {/* Facebook */}
                  <button type="button" className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#E4E9EA] dark:border-[#20353D] text-xs font-medium hover:bg-gray-50 dark:hover:bg-[#15323D] transition-all">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
                    </svg>
                    <span className="hidden sm:inline">Facebook</span>
                  </button>
                  {/* Apple */}
                  <button type="button" className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#E4E9EA] dark:border-[#20353D] text-xs font-medium hover:bg-gray-50 dark:hover:bg-[#15323D] transition-all">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" fill="currentColor" className="text-black dark:text-white" />
                    </svg>
                    <span className="hidden sm:inline">Apple</span>
                  </button>
                </div>

                <p className="text-center text-sm" style={{ color: "#4A5A62" }}>
                  Don&apos;t have an account? <Link href="/register" className="font-semibold hover:underline" style={{ color: "#006666" }}>Create one for free</Link>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><path d="M8 1L10.5 6L16 6.8L12 10.7L13 16L8 13.3L3 16L4 10.7L0 6.8L5.5 6L8 1Z" fill="#FDA301" /></svg>
                <span className="text-xs" style={{ color: "#9AAAB0" }}>SLTDA Approved</span>
              </div>
              <div className="w-px h-3" style={{ background: "#E4E9EA" }} />
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="2" stroke="#9AAAB0" strokeWidth="1.5"/><path d="M5 4V3a3 3 0 016 0v1" stroke="#9AAAB0" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span className="text-xs" style={{ color: "#9AAAB0" }}>256-bit SSL</span>
              </div>
              <div className="w-px h-3" style={{ background: "#E4E9EA" }} />
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#9AAAB0" strokeWidth="1.5"/><path d="M5 8l2 2 4-4" stroke="#9AAAB0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="text-xs" style={{ color: "#9AAAB0" }}>Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
