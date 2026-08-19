"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User, Languages, DollarSign, ShieldCheck, Check,
  ArrowRight, ArrowLeft, ChevronDown, Save, CheckCircle2, Clock
} from "lucide-react";
import { getMyBusiness, createGuideDraft, submitBusiness } from "@/lib/api/catalog";
import { useAuthStore } from "@/store/auth-store";

/* ─── shared field atoms ─── */
const inputCls =
  "w-full px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all duration-150 focus:ring-2 focus:ring-[#FDA301]/20 focus:border-[#FDA301]";
const inputStyle = { borderColor: "#E4E9EA", color: "#0E1B22" };
const selectCls = `${inputCls} appearance-none`;

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs uppercase tracking-widest font-semibold mb-1.5" style={{ color: "#4A5A62" }}>
      {children}{required && <span style={{ color: "#D64545" }}> *</span>}
    </label>
  );
}
function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs" style={{ color: "#9AAAB0" }}>{children}</p>;
}

/* ─── Enum options ─── */
const CITIES = ["COLOMBO","KANDY","GALLE","ELLA","SIGIRIYA","MIRISSA","NUWARA_ELIYA","YALA","TRINCOMALEE","NEGOMBO","ANURADHAPURA"] as const;
const CITY_LABELS: Record<string, string> = { COLOMBO:"Colombo",KANDY:"Kandy",GALLE:"Galle",ELLA:"Ella",SIGIRIYA:"Sigiriya",MIRISSA:"Mirissa",NUWARA_ELIYA:"Nuwara Eliya",YALA:"Yala",TRINCOMALEE:"Trincomalee",NEGOMBO:"Negombo",ANURADHAPURA:"Anuradhapura" };
const REGIONS = ["HILL_COUNTRY","SOUTH_COAST","CULTURAL_TRIANGLE","WESTERN_PROVINCE","WILDLIFE_BELT","EAST_COAST","NORTH"] as const;
const REGION_LABELS: Record<string, string> = { HILL_COUNTRY:"Hill Country",SOUTH_COAST:"South Coast",CULTURAL_TRIANGLE:"Cultural Triangle",WESTERN_PROVINCE:"Western Province",WILDLIFE_BELT:"Wildlife Belt",EAST_COAST:"East Coast",NORTH:"North" };

const VEHICLE_TYPES = [
  { id: "SUV", label: "4×4 Luxury SUV" },
  { id: "VAN", label: "AC Passenger Van" },
  { id: "SEDAN", label: "Hybrid Sedan" },
  { id: "TUK_TUK", label: "Tuk-Tuk" },
  { id: "CAR", label: "Sedan Car" },
  { id: "MINIBUS", label: "Minibus" },
  { id: "MOTORBIKE", label: "Motorbike" },
  { id: "NONE", label: "Walking / Client Vehicle" },
];

const LANGUAGES = ["English","Sinhala","Tamil","German","French","Japanese","Chinese","Russian","Italian","Spanish","Korean","Arabic"];

/* ─── Steps config ─── */
const STEPS = [
  { id: 1, label: "Guide Identity",       sub: "Profile, license & contacts",       icon: User       },
  { id: 2, label: "Location & Languages", sub: "Base city, region & languages",     icon: Languages  },
  { id: 3, label: "Rates & Vehicle",      sub: "Pricing, experience & transport",   icon: DollarSign },
] as const;

/* ─── Form interface ─── */
interface GuideForm {
  name: string;
  tagline: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  city: string;
  region: string;
  coverImageUrl: string;
  licenseNumber: string;
  licenseType: string;
  languagesSpoken: string[];
  yearsOfExperience: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleAirConditioned: boolean;
  maxGroupSizeGuided: string;
  dailyRate: string;
  halfDayRate: string;
}

export default function TourGuideRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const TOTAL = STEPS.length;

  const [form, setForm] = useState<GuideForm>({
    name: "", tagline: "", description: "",
    contactEmail: "", contactPhone: "", whatsappNumber: "",
    city: "ELLA", region: "HILL_COUNTRY",
    coverImageUrl: "",
    licenseNumber: "", licenseType: "NATIONAL_TOURIST_GUIDE",
    languagesSpoken: [],
    yearsOfExperience: "", vehicleType: "VAN", vehicleModel: "", vehicleAirConditioned: true,
    maxGroupSizeGuided: "",
    dailyRate: "", halfDayRate: "",
  });
  const [loading, setLoading] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const [draftSavedMsg, setDraftSavedMsg] = useState(false);
  const [isPendingApproval, setIsPendingApproval] = useState(false);

  // Auto-load existing draft on mount if logged in
  useEffect(() => {
    async function loadDraft() {
      const token = useAuthStore.getState().accessToken;
      if (!token) return;

      try {
        const existing = await getMyBusiness();
        if (existing) {
          if (existing.status === "PENDING_APPROVAL" || existing.status === "PENDING") {
            setIsPendingApproval(true);
          }
          setForm((p) => ({
            ...p,
            name: existing.name || p.name,
            tagline: existing.tagline || p.tagline,
            description: existing.description || p.description,
            contactEmail: existing.contactEmail || p.contactEmail,
            contactPhone: existing.contactPhone || p.contactPhone,
            whatsappNumber: existing.whatsappNumber || p.whatsappNumber,
            city: existing.city || p.city,
            region: existing.region || p.region,
            coverImageUrl: existing.coverImageUrl || p.coverImageUrl,
            licenseNumber: (existing as any).licenseNumber || p.licenseNumber,
            licenseType: (existing as any).licenseType || p.licenseType,
            languagesSpoken: (existing as any).languagesSpoken || p.languagesSpoken,
            yearsOfExperience: (existing as any).yearsOfExperience ? String((existing as any).yearsOfExperience) : p.yearsOfExperience,
            vehicleType: (existing as any).vehicleType || p.vehicleType,
            vehicleModel: (existing as any).vehicleModel || p.vehicleModel,
            vehicleAirConditioned: (existing as any).vehicleAirConditioned ?? p.vehicleAirConditioned,
            maxGroupSizeGuided: (existing as any).maxGroupSizeGuided ? String((existing as any).maxGroupSizeGuided) : p.maxGroupSizeGuided,
            dailyRate: (existing as any).dailyRate ? String((existing as any).dailyRate) : p.dailyRate,
            halfDayRate: (existing as any).halfDayRate ? String((existing as any).halfDayRate) : p.halfDayRate,
          }));
        }
      } catch {
        // No draft existing or unauthenticated
      }
    }
    loadDraft();
  }, []);

  const set = (f: keyof GuideForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }));
  const toggle = (f: keyof GuideForm) => () => setForm(p => ({ ...p, [f]: !p[f] }));

  const toggleLang = (lang: string) =>
    setForm(p => ({
      ...p,
      languagesSpoken: p.languagesSpoken.includes(lang)
        ? p.languagesSpoken.filter(x => x !== lang)
        : [...p.languagesSpoken, lang],
    }));

  const buildPayload = () => ({
    name: form.name,
    tagline: form.tagline,
    description: form.description,
    contactEmail: form.contactEmail,
    contactPhone: form.contactPhone,
    whatsappNumber: form.whatsappNumber,
    city: form.city as any,
    region: form.region as any,
    coverImageUrl: form.coverImageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    licenseNumber: form.licenseNumber,
    licenseType: form.licenseType as any,
    languagesSpoken: form.languagesSpoken as any,
    yearsOfExperience: Number(form.yearsOfExperience || 1),
    vehicleType: form.vehicleType as any,
    vehicleModel: form.vehicleModel,
    vehicleAirConditioned: form.vehicleAirConditioned,
    maxGroupSizeGuided: form.maxGroupSizeGuided ? Number(form.maxGroupSizeGuided) : 0,
    dailyRate: Number(form.dailyRate || 100),
    halfDayRate: Number(form.halfDayRate || 60),
  });

  const handleSaveDraft = async () => {
    setDraftSaving(true);
    try {
      await createGuideDraft(buildPayload());
      setDraftSavedMsg(true);
      setTimeout(() => setDraftSavedMsg(false), 3000);
    } catch {
      // Ignore background draft errors
    } finally {
      setDraftSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < TOTAL) {
      setStep((s) => s + 1);
      return;
    }
    setLoading(true);
    try {
      await createGuideDraft(buildPayload());
      await submitBusiness();
      setLoading(false);
      router.push("/my-bookings");
    } catch {
      setLoading(false);
      router.push("/my-bookings");
    }
  };

  const goldActive = { borderColor: "#FDA301", background: "#FDA301", color: "#0E1B22" };
  const chipInactive = { borderColor: "#E4E9EA", background: "#fff", color: "#4A5A62" };
  const tealActive = { borderColor: "#008080", background: "#008080", color: "#fff" };

  return (
    <div className="flex min-h-screen">
      {/* ══ LEFT SIDEBAR ══ */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 flex-shrink-0 sticky top-0 h-screen"
        style={{ background: "linear-gradient(175deg,#1E1500 0%,#2D1F00 60%,#281C00 100%)" }}>

        {/* Top Logo */}
        <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#FDA301" }}>
              <User className="w-5 h-5 text-[#0E1B22]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-wide">Blue Ceylon</p>
              <p className="text-[10px] tracking-wider uppercase font-semibold" style={{ color: "#FDA301" }}>Tour Guide Portal</p>
            </div>
          </Link>
        </div>

        {/* Steps */}
        <div className="flex-1 p-6 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase font-bold tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
            Registration Steps
          </p>
          <div className="space-y-4">
            {STEPS.map((s) => {
              const active = step === s.id;
              const done = step > s.id;
              const Icon = s.icon;
              return (
                <div key={s.id} className="flex items-start gap-3 cursor-pointer" onClick={() => !isPendingApproval && setStep(s.id)}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all duration-200"
                    style={{
                      background: done ? "#3FCFC0" : active ? "#FDA301" : "rgba(255,255,255,0.07)",
                      color: done ? "#fff" : active ? "#0E1B22" : "rgba(255,255,255,0.4)",
                      boxShadow: active ? "0 0 12px rgba(253,163,1,0.5)" : "none",
                    }}>
                    {done ? <Check className="w-4 h-4" /> : s.id}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-semibold leading-tight transition-colors"
                      style={{ color: done ? "#3FCFC0" : active ? "#fff" : "rgba(255,255,255,0.4)" }}>
                      {s.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>{s.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer note */}
        <div className="p-6 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: "#FDA301" }} />
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
              SLTDA License number verified before public listing.
            </p>
          </div>
        </div>
      </aside>

      {/* ══ RIGHT CONTENT ══ */}
      <div className="flex-1 flex flex-col" style={{ background: "#F4F6F8" }}>

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3.5 border-b bg-white">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#FDA301" }}>
            <User className="w-4 h-4 text-[#0E1B22]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "#4A5A62" }}>
              Step {step}/{TOTAL} — {STEPS[step - 1].label}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {STEPS.map(s => (
              <div key={s.id} className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: step === s.id ? 18 : 6, background: step >= s.id ? "#FDA301" : "#E4E9EA" }} />
            ))}
          </div>
        </div>

        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10">

            {/* Step heading */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-xs font-semibold"
                style={{ background: "rgba(253,163,1,0.12)", color: "#B87800" }}>
                Step {step} of {TOTAL}
              </div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: "'Fraunces',serif", color: "#0E1B22" }}>
                {STEPS[step - 1].label}
              </h1>
              <p className="text-sm mt-1" style={{ color: "#4A5A62" }}>{STEPS[step - 1].sub}</p>
            </div>

            {isPendingApproval && (
              <div className="mb-6 p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 flex items-start gap-3 shadow-sm">
                <Clock className="w-6 h-6 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h3 className="font-bold text-base text-amber-900 dark:text-amber-200">
                    Profile Currently Under Review
                  </h3>
                  <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                    Your tour guide profile has been submitted and is currently being verified by our team. You cannot edit any fields or resubmit details until the verification process is complete.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <fieldset disabled={isPendingApproval} className="space-y-5 disabled:opacity-85">

              {/* ── STEP 1: Guide Identity ── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <div>
                      <Label required>Full Name (as on SLTDA License)</Label>
                      <input name="name" type="text" required placeholder="e.g. Kasun Fernando"
                        value={form.name} onChange={set("name")} className={inputCls} style={inputStyle} />
                    </div>

                    <div>
                      <Label>Professional Tagline</Label>
                      <input name="tagline" type="text" placeholder="e.g. SLTDA Chauffeur & Wildlife Specialist"
                        value={form.tagline} onChange={set("tagline")} className={inputCls} style={inputStyle} />
                    </div>

                    <div>
                      <Label required>About You & Guiding Bio</Label>
                      <textarea name="description" rows={4} required
                        placeholder="Introduce yourself, your guiding experience, specialized regions, safety standards..."
                        value={form.description} onChange={set("description")}
                        className="w-full px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all duration-150 focus:ring-2 focus:ring-[#FDA301]/20 focus:border-[#FDA301]"
                        style={inputStyle} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label required>SLTDA License Number</Label>
                        <input name="licenseNumber" type="text" required placeholder="e.g. TG/2023/00421"
                          value={form.licenseNumber} onChange={set("licenseNumber")} className={inputCls} style={inputStyle} />
                        <Hint>National / Site guide license</Hint>
                      </div>
                      <div>
                        <Label required>License Category</Label>
                        <div className="relative">
                          <select name="licenseType" value={form.licenseType} onChange={set("licenseType")} className={selectCls} style={inputStyle}>
                            <option value="National">National Tourist Guide</option>
                            <option value="Chauffeur">Chauffeur Tourist Guide</option>
                            <option value="Site">Site Guide (Local)</option>
                            <option value="Area">Area Guide</option>
                          </select>
                          <ChevronDown className="w-4 h-4 absolute right-3 top-3.5 pointer-events-none" style={{ color: "#9AAAB0" }} />
                        </div>
                      </div>
                    </div>

                    {/* Cover Photo Picker */}
                    <div className="space-y-2 pt-2">
                      <Label>Profile Photo / Cover Image</Label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-dashed" style={{ borderColor: "#CBD5E1", background: "#F8FAFC" }}>
                        {form.coverImageUrl ? (
                          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border relative">
                            <img src={form.coverImageUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-xs font-bold text-gray-500">
                            No Photo
                          </div>
                        )}
                        <div className="flex-1 space-y-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target?.result) {
                                    setForm(p => ({ ...p, coverImageUrl: event.target!.result as string }));
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#FDA301] file:text-slate-900 hover:file:bg-[#e59300] cursor-pointer"
                          />
                          <Hint>Select a photo file from your device, or paste a URL below.</Hint>
                          <input
                            name="coverImageUrl"
                            type="url"
                            placeholder="Or paste photo URL: https://..."
                            value={form.coverImageUrl}
                            onChange={set("coverImageUrl")}
                            className={inputCls}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Direct Contact</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label required>Email Address</Label>
                        <input name="contactEmail" type="email" required placeholder="kasun.guides@gmail.com"
                          value={form.contactEmail} onChange={set("contactEmail")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label required>Phone Number</Label>
                        <input name="contactPhone" type="tel" required placeholder="+94 77 987 6543"
                          value={form.contactPhone} onChange={set("contactPhone")} className={inputCls} style={inputStyle} />
                      </div>
                    </div>

                    <div>
                      <Label>WhatsApp Number</Label>
                      <input name="whatsappNumber" type="tel" placeholder="+94 77 987 6543"
                        value={form.whatsappNumber} onChange={set("whatsappNumber")} className={inputCls} style={inputStyle} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Location & Languages ── */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Base Location</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label required>Base City</Label>
                        <div className="relative">
                          <select name="city" value={form.city} onChange={set("city")} className={selectCls} style={inputStyle}>
                            {CITIES.map(c => <option key={c} value={c}>{CITY_LABELS[c]}</option>)}
                          </select>
                          <ChevronDown className="w-4 h-4 absolute right-3 top-3.5 pointer-events-none" style={{ color: "#9AAAB0" }} />
                        </div>
                      </div>
                      <div>
                        <Label required>Primary Region</Label>
                        <div className="relative">
                          <select name="region" value={form.region} onChange={set("region")} className={selectCls} style={inputStyle}>
                            {REGIONS.map(r => <option key={r} value={r}>{REGION_LABELS[r]}</option>)}
                          </select>
                          <ChevronDown className="w-4 h-4 absolute right-3 top-3.5 pointer-events-none" style={{ color: "#9AAAB0" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Languages Spoken */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4" style={{ borderColor: "#E8EDEF" }}>
                    <div>
                      <Label required>Languages Spoken</Label>
                      <Hint>Select all languages you can fluently conduct tours in</Hint>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {LANGUAGES.map((lang) => {
                        const sel = form.languagesSpoken.includes(lang);
                        return (
                          <button key={lang} type="button" onClick={() => toggleLang(lang)}
                            className="px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all duration-150 flex items-center gap-1.5"
                            style={sel ? goldActive : chipInactive}>
                            {sel && <Check className="w-3.5 h-3.5" />} {lang}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Rates & Vehicle ── */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Experience & Transport</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label required>Years of Guiding Experience</Label>
                        <input name="yearsOfExperience" type="number" min={1} required placeholder="e.g. 6"
                          value={form.yearsOfExperience} onChange={set("yearsOfExperience")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label required>Max Group Size Guided</Label>
                        <input name="maxGroupSizeGuided" type="number" min={1} required placeholder="e.g. 12"
                          value={form.maxGroupSizeGuided} onChange={set("maxGroupSizeGuided")} className={inputCls} style={inputStyle} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label required>Transport / Vehicle Offered</Label>
                        <div className="relative">
                          <select name="vehicleType" value={form.vehicleType} onChange={set("vehicleType")} className={selectCls} style={inputStyle}>
                            {VEHICLE_TYPES.map(vt => <option key={vt.id} value={vt.id}>{vt.label}</option>)}
                          </select>
                          <ChevronDown className="w-4 h-4 absolute right-3 top-3.5 pointer-events-none" style={{ color: "#9AAAB0" }} />
                        </div>
                      </div>
                      <div>
                        <Label>Vehicle Model & Year</Label>
                        <input name="vehicleModel" type="text" placeholder="e.g. Toyota KDH Super GL (2022)"
                          value={form.vehicleModel} onChange={set("vehicleModel")} className={inputCls} style={inputStyle} />
                      </div>
                    </div>
                    {form.vehicleType !== "NONE" && (
                      <label className="flex items-center justify-between p-3.5 rounded-xl border cursor-pointer" style={{ borderColor: "#E8EDEF" }}>
                        <div>
                          <p className="text-xs font-semibold" style={{ color: "#0E1B22" }}>Air-Conditioned Vehicle</p>
                          <p className="text-[11px]" style={{ color: "#9AAAB0" }}>Vehicle has climate control for guest comfort</p>
                        </div>
                        <input type="checkbox" checked={form.vehicleAirConditioned} onChange={toggle("vehicleAirConditioned")} className="w-4 h-4 rounded text-[#FDA301]" />
                      </label>
                    )}
                  </div>

                  {/* Rates */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Guiding Rates (USD)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label required>Full Day Rate ($)</Label>
                        <input name="dailyRate" type="number" min={10} required placeholder="e.g. 80"
                          value={form.dailyRate} onChange={set("dailyRate")} className={inputCls} style={inputStyle} />
                        <Hint>Per day guiding fee</Hint>
                      </div>
                      <div>
                        <Label>Half Day Rate ($)</Label>
                        <input name="halfDayRate" type="number" min={5} placeholder="e.g. 50"
                          value={form.halfDayRate} onChange={set("halfDayRate")} className={inputCls} style={inputStyle} />
                        <Hint>4-5 hour tour rate</Hint>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ background: "#FFFBEB", borderColor: "rgba(253,163,1,0.3)" }}>
                    <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#FDA301" }} />
                    <p className="text-xs leading-relaxed" style={{ color: "#4A5A62" }}>
                      Your guide profile will be verified against official SLTDA Guide License records before appearing in public searches.
                    </p>
                  </div>
                </div>
              )}

              </fieldset>

              {/* ── Navigation ── */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t" style={{ borderColor: "#E8EDEF" }}>
                <div className="flex items-center gap-3">
                  {step > 1 ? (
                    <button type="button" onClick={() => setStep(s => s - 1)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:bg-white"
                      style={{ borderColor: "#E4E9EA", color: "#4A5A62" }}>
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  ) : (
                    <Link href="/my-bookings"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold"
                      style={{ borderColor: "#E4E9EA", color: "#4A5A62" }}>
                      <ArrowLeft className="w-4 h-4" /> Cancel
                    </Link>
                  )}

                  {/* Save Draft Button (Hidden if pending approval) */}
                  {!isPendingApproval && (
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={draftSaving}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:bg-amber-100 dark:hover:bg-white/10"
                      style={{ borderColor: "#FDA301", color: "#B87800" }}
                    >
                      <Save className="w-4 h-4" />
                      {draftSaving ? "Saving Draft..." : "Save Draft"}
                    </button>
                  )}

                  {draftSavedMsg && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Draft Saved!
                    </span>
                  )}
                </div>

                {isPendingApproval ? (
                  step < TOTAL ? (
                    <button type="button" onClick={() => setStep(s => s + 1)}
                      className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-slate-900 transition-all bg-[#FDA301]">
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button type="button" disabled
                      className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-amber-800 bg-amber-200 dark:bg-amber-900/60 dark:text-amber-200 cursor-not-allowed">
                      <Clock className="w-4 h-4" /> Profile Under Review
                    </button>
                  )
                ) : (
                  <button type="submit" disabled={loading}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-[#0E1B22] transition-all active:scale-[0.98] disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg,#FDA301,#E59300)", boxShadow: "0 4px 16px rgba(253,163,1,0.3)" }}>
                    {loading ? "Submitting…" : step < TOTAL ? (<>Continue <ArrowRight className="w-4 h-4" /></>) : (<><Check className="w-4 h-4" /> Submit Guide Profile</>)}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
