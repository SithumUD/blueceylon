"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
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
const inputFocusClass = "focus:ring-2 focus:ring-[#006666]/30 focus:border-[#006666]";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ["#D64545", "#FDA301", "#1F9D6C"];
  const labels = ["Weak", "Fair", "Strong"];

  if (!password) return null;
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: i < score ? colors[score - 1] : "#E4E9EA" }} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map(c => (
            <span key={c.label} className="flex items-center gap-1 text-xs" style={{ color: c.ok ? "#1F9D6C" : "#9AAAB0" }}>
              <CheckCircle2 className="w-3 h-3" />{c.label}
            </span>
          ))}
        </div>
        <span className="text-xs font-semibold" style={{ color: colors[score - 1] ?? "#9AAAB0" }}>{score > 0 ? labels[score - 1] : ""}</span>
      </div>
    </div>
  );
}

interface RegisterForm { firstName: string; lastName: string; email: string; phoneNumber: string; password: string; confirmPassword: string; }
interface FormErrors { firstName?: string; lastName?: string; email?: string; phoneNumber?: string; password?: string; confirmPassword?: string; general?: string; }

export default function TravelerRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({ firstName: "", lastName: "", email: "", phoneNumber: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const set = (field: keyof RegisterForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";
    if (!form.email) next.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address";
    if (form.phoneNumber && !/^\+?[0-9\s\-().]{7,20}$/.test(form.phoneNumber)) next.phoneNumber = "Enter a valid phone number";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 8) next.password = "Password must be at least 8 characters";
    if (!form.confirmPassword) next.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const register = useAuthStore((s) => s.register);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!agreed) {
      setErrors(p => ({ ...p, general: "Please accept the Terms & Privacy Policy to continue." }));
      return;
    }
    setLoading(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber || undefined,
        role: "TRAVELER",
      });
      router.push("/");
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : "Registration failed" });
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
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-8">
          <div className="w-full max-w-lg">
            <div className="bg-white dark:bg-[#0F252E] rounded-2xl shadow-lg overflow-hidden border border-[#E4E9EA] dark:border-[#20353D]">
              <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #003366, #005F73, #008080, #3FCFC0)" }} />

              <div className="px-8 py-9 space-y-7">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>
                    Create your account
                  </h1>
                  <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2]">Join Blue Ceylon and explore verified stays & experiences.</p>
                </div>

                {errors.general && (
                  <div className="flex items-start gap-2 px-4 py-3 rounded-lg text-sm" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#D64545" }}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{errors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <InputIcon><User className="w-4 h-4" /></InputIcon>
                        <input id="firstName" type="text" required placeholder="Emma" value={form.firstName} onChange={set("firstName")}
                          className={`${inputBase} ${inputFocusClass} dark:bg-[#15323D] dark:text-white`}
                          style={{ borderColor: errors.firstName ? "#D64545" : "inherit" }} />
                      </div>
                      <FieldError msg={errors.firstName} />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <InputIcon><User className="w-4 h-4" /></InputIcon>
                        <input id="lastName" type="text" required placeholder="Roberts" value={form.lastName} onChange={set("lastName")}
                          className={`${inputBase} ${inputFocusClass} dark:bg-[#15323D] dark:text-white`}
                          style={{ borderColor: errors.lastName ? "#D64545" : "inherit" }} />
                      </div>
                      <FieldError msg={errors.lastName} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <InputIcon><Mail className="w-4 h-4" /></InputIcon>
                      <input id="email" type="email" required placeholder="you@example.com" value={form.email} onChange={set("email")}
                        className={`${inputBase} ${inputFocusClass} dark:bg-[#15323D] dark:text-white`}
                        style={{ borderColor: errors.email ? "#D64545" : "inherit" }} />
                    </div>
                    <FieldError msg={errors.email} />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number <span style={{ color: "#9AAAB0", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></Label>
                    <div className="relative">
                      <InputIcon><Phone className="w-4 h-4" /></InputIcon>
                      <input id="phoneNumber" type="tel" placeholder="+94 77 123 4567" value={form.phoneNumber} onChange={set("phoneNumber")}
                        className={`${inputBase} ${inputFocusClass} dark:bg-[#15323D] dark:text-white`}
                        style={{ borderColor: errors.phoneNumber ? "#D64545" : "inherit" }} />
                    </div>
                    <FieldError msg={errors.phoneNumber} />
                  </div>

                  <div>
                    <Label htmlFor="password">Create Password</Label>
                    <div className="relative">
                      <InputIcon><Lock className="w-4 h-4" /></InputIcon>
                      <input id="password" type={showPass ? "text" : "password"} required placeholder="Min 8 characters" value={form.password} onChange={set("password")}
                        className={`${inputBase} ${inputFocusClass} pr-11 dark:bg-[#15323D] dark:text-white`}
                        style={{ borderColor: errors.password ? "#D64545" : "inherit" }} />
                      <button type="button" onClick={() => setShowPass(v => !v)} className="absolute inset-y-0 right-3 flex items-center text-[#9AAAB0]" tabIndex={-1}>
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <FieldError msg={errors.password} />
                    <PasswordStrength password={form.password} />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <InputIcon><Lock className="w-4 h-4" /></InputIcon>
                      <input id="confirmPassword" type={showConfirm ? "text" : "password"} required placeholder="Re-enter your password" value={form.confirmPassword} onChange={set("confirmPassword")}
                        className={`${inputBase} ${inputFocusClass} pr-11 dark:bg-[#15323D] dark:text-white`}
                        style={{ borderColor: errors.confirmPassword ? "#D64545" : "inherit" }} />
                      <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute inset-y-0 right-3 flex items-center text-[#9AAAB0]" tabIndex={-1}>
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <FieldError msg={errors.confirmPassword} />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group pt-1">
                    <input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setErrors(p => ({ ...p, general: undefined })); }}
                      className="mt-0.5 w-4 h-4 rounded accent-[#003366] cursor-pointer" />
                    <span className="text-xs leading-relaxed" style={{ color: "#4A5A62" }}>
                      I agree to Blue Ceylon's <Link href="/terms" className="font-semibold hover:underline" style={{ color: "#006666" }}>Terms of Service</Link> and <Link href="/privacy" className="font-semibold hover:underline" style={{ color: "#006666" }}>Privacy Policy</Link>
                    </span>
                  </label>

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 mt-2 rounded-lg text-sm font-semibold text-white transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: loading ? "#004080" : "linear-gradient(135deg, #003366 0%, #005F73 60%, #008080 100%)", boxShadow: "0 4px 12px rgba(0,51,102,0.25)" }}>
                    {loading ? "Creating your account…" : <>Create Traveler Account <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>

                <p className="text-center text-sm" style={{ color: "#4A5A62" }}>
                  Already have an account? <Link href="/login" className="font-semibold hover:underline" style={{ color: "#006666" }}>Sign In</Link>
                </p>

                <div className="rounded-xl px-4 py-3 text-center text-xs dark:bg-[#15323D]" style={{ background: "#F5E8D3", border: "1px solid #E4E9EA" }}>
                  <span style={{ color: "#4A5A62" }}>Registering a hotel, agency, or as a guide? </span>
                  <Link href="/register/hotel" className="font-semibold hover:underline" style={{ color: "#003366" }}>Register a Property →</Link>
                </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
