"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User, Languages, DollarSign, ShieldCheck, Check,
  ArrowRight, ArrowLeft, ChevronDown,
} from "lucide-react";

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
  { id: "TUKTUK", label: "Tuk-Tuk" },
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
    licenseNumber: "", licenseType: "National",
    languagesSpoken: [],
    yearsOfExperience: "", vehicleType: "VAN",
    maxGroupSizeGuided: "",
    dailyRate: "", halfDayRate: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (f: keyof GuideForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }));

  const toggleLang = (lang: string) =>
    setForm(p => ({
      ...p,
      languagesSpoken: p.languagesSpoken.includes(lang)
        ? p.languagesSpoken.filter(x => x !== lang)
        : [...p.languagesSpoken, lang],
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < TOTAL) { setStep(s => s + 1); return; }
    setLoading(true);
    /* TODO: POST /api/v1/owner/businesses/tour-guide (user already authenticated) */
    setTimeout(() => { setLoading(false); router.push("/dashboard"); }, 1000);
  };

  const goldActive = { borderColor: "#FDA301", background: "#FDA301", color: "#0E1B22" };
  const chipInactive = { borderColor: "#E4E9EA", background: "#fff", color: "#4A5A62" };
  const tealActive = { borderColor: "#008080", background: "#008080", color: "#fff" };

  return (
    <div className="flex min-h-screen">
      {/* ══ LEFT SIDEBAR ══ */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 flex-shrink-0 sticky top-0 h-screen"
        style={{ background: "linear-gradient(175deg,#1A1200 0%,#241800 60%,#1C1400 100%)" }}>

        {/* Brand */}
        <div className="px-6 py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#003366,#FDA301)", boxShadow: "0 4px 12px rgba(253,163,1,0.35)" }}>
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: "#FDA301" }}>Blue Ceylon</p>
              <p className="text-sm font-bold text-white leading-tight">Guide Registration</p>
            </div>
          </div>
        </div>

        {/* Step list */}
        <div className="flex-1 px-6 py-8">
          <p className="text-xs uppercase tracking-widest font-bold mb-7" style={{ color: "rgba(255,255,255,0.3)" }}>
            Your Progress
          </p>
          <div className="flex flex-col">
            {STEPS.map((s, idx) => {
              const done = step > s.id;
              const active = step === s.id;
              const Icon = s.icon;
              return (
                <div key={s.id} className="flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        background: done ? "#FDA301" : active ? "rgba(253,163,1,0.15)" : "transparent",
                        border: done ? "none" : active ? "2px solid #FDA301" : "2px solid rgba(255,255,255,0.15)",
                      }}>
                      {done
                        ? <Check className="w-3.5 h-3.5 text-black" />
                        : <Icon className="w-3.5 h-3.5" style={{ color: active ? "#FDA301" : "rgba(255,255,255,0.3)" }} />
                      }
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className="w-px my-1 flex-1 transition-all duration-500"
                        style={{ background: done ? "#FDA301" : "rgba(255,255,255,0.08)", minHeight: 36 }} />
                    )}
                  </div>
                  <div className="pb-9">
                    <p className="text-sm font-semibold leading-tight transition-colors"
                      style={{ color: done ? "#FDA301" : active ? "#fff" : "rgba(255,255,255,0.4)" }}>
                      {s.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>{s.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: "#FDA301" }} />
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
              Only SLTDA licensed guides are verified and published.
            </p>
          </div>
        </div>
      </aside>

      {/* ══ RIGHT CONTENT ══ */}
      <div className="flex-1 flex flex-col" style={{ background: "#F4F6F8" }}>

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3.5 border-b bg-white">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#003366,#FDA301)" }}>
            <User className="w-4 h-4 text-white" />
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
                style={{ background: "rgba(253,163,1,0.10)", color: "#B87A00" }}>
                Step {step} of {TOTAL}
              </div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: "'Fraunces',serif", color: "#0E1B22" }}>
                {STEPS[step - 1].label}
              </h1>
              <p className="text-sm mt-1" style={{ color: "#4A5A62" }}>{STEPS[step - 1].sub}</p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* ── STEP 1: Guide Identity & SLTDA License ── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <div>
                      <Label required>Official Guide Full Name</Label>
                      {/* → TourGuideDraftRequest.name */}
                      <input name="name" type="text" required placeholder="As it appears on your SLTDA certificate"
                        value={form.name} onChange={set("name")} className={inputCls} style={inputStyle} />
                    </div>
                    <div>
                      <Label>Professional Tagline / Title</Label>
                      {/* → TourGuideDraftRequest.tagline (max 100 chars) */}
                      <input name="tagline" type="text" maxLength={100}
                        placeholder="e.g. Licensed Hill Country & Wildlife Expedition Specialist"
                        value={form.tagline} onChange={set("tagline")} className={inputCls} style={inputStyle} />
                      <Hint>Max 100 characters — shown on your guide profile card.</Hint>
                    </div>
                    <div>
                      <Label required>Bio & Guiding Philosophy</Label>
                      {/* → TourGuideDraftRequest.description */}
                      <textarea name="description" rows={4} required
                        placeholder="Describe your experience, specialist regions, tour style, and what makes your guiding unique..."
                        value={form.description} onChange={set("description")} className={inputCls} style={inputStyle} />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <div className="p-4 rounded-xl border space-y-4" style={{ background: "#FFFBEB", borderColor: "rgba(253,163,1,0.4)" }}>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" style={{ color: "#FDA301" }} />
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4A5A62" }}>SLTDA Accreditation</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label required>Tourist Guide License No.</Label>
                          {/* → TourGuideDraftRequest.licenseNumber (SLTDA/NTG/YYYY/XXXX) */}
                          <input name="licenseNumber" type="text" required placeholder="SLTDA/NTG/YYYY/XXXX"
                            value={form.licenseNumber} onChange={set("licenseNumber")} className={inputCls} style={inputStyle} />
                          <Hint>Format: SLTDA/NTG/2024/1042</Hint>
                        </div>
                        <div>
                          <Label required>License Classification</Label>
                          {/* → TourGuideDraftRequest.licenseType ("National" | "Chauffeur" | "Site") */}
                          <div className="relative">
                            <select name="licenseType" value={form.licenseType} onChange={set("licenseType")} className={selectCls} style={inputStyle}>
                              <option value="National">National Tourist Guide</option>
                              <option value="Chauffeur">Chauffeur Tourist Guide</option>
                              <option value="Site">Site-Specific Guide</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none" style={{ color: "#9AAAB0" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label required>Contact Email</Label>
                        {/* → TourGuideDraftRequest.contactEmail */}
                        <input name="contactEmail" type="email" required placeholder="guide@example.lk"
                          value={form.contactEmail} onChange={set("contactEmail")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label required>Contact Phone</Label>
                        {/* → TourGuideDraftRequest.contactPhone */}
                        <input name="contactPhone" type="tel" required placeholder="+94 77 123 9988"
                          value={form.contactPhone} onChange={set("contactPhone")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label>WhatsApp</Label>
                        {/* → TourGuideDraftRequest.whatsappNumber */}
                        <input name="whatsappNumber" type="tel" placeholder="+94 77 123 9988"
                          value={form.whatsappNumber} onChange={set("whatsappNumber")} className={inputCls} style={inputStyle} />
                      </div>
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
                        <Label required>Primary Base City</Label>
                        {/* → TourGuideDraftRequest.city (SriLankanCity enum) */}
                        <div className="relative">
                          <select name="city" value={form.city} onChange={set("city")} className={selectCls} style={inputStyle}>
                            {CITIES.map(c => <option key={c} value={c}>{CITY_LABELS[c]}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none" style={{ color: "#9AAAB0" }} />
                        </div>
                      </div>
                      <div>
                        <Label required>Coverage Region</Label>
                        {/* → TourGuideDraftRequest.region (Region enum) */}
                        <div className="relative">
                          <select name="region" value={form.region} onChange={set("region")} className={selectCls} style={inputStyle}>
                            {REGIONS.map(r => <option key={r} value={r}>{REGION_LABELS[r]}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none" style={{ color: "#9AAAB0" }} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Profile / Cover Image URL</Label>
                      {/* → TourGuideDraftRequest.coverImageUrl */}
                      <input name="coverImageUrl" type="url" placeholder="https://res.cloudinary.com/..."
                        value={form.coverImageUrl} onChange={set("coverImageUrl")} className={inputCls} style={inputStyle} />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Spoken Languages</p>
                    {/* → TourGuideDraftRequest.languagesSpoken (List<String>) */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {LANGUAGES.map(lang => {
                        const active = form.languagesSpoken.includes(lang);
                        return (
                          <button key={lang} type="button" onClick={() => toggleLang(lang)}
                            className="flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-semibold transition-all"
                            style={active ? tealActive : chipInactive}>
                            <span>{lang}</span>
                            {active && <Check className="w-3 h-3 ml-1 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                    <Hint>Select all languages you can guide in.</Hint>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Rates, Vehicle & Experience ── */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Daily Rates (USD)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label required>Full-Day Rate</Label>
                        {/* → TourGuideDraftRequest.dailyRate (Double) */}
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-sm font-semibold" style={{ color: "#9AAAB0" }}>$</span>
                          <input name="dailyRate" type="number" min="1" step="0.01" required placeholder="65.00"
                            value={form.dailyRate} onChange={set("dailyRate")} className={`${inputCls} pl-7`} style={inputStyle} />
                        </div>
                        <Hint>Per full day (8+ hrs) charged to travelers.</Hint>
                      </div>
                      <div>
                        <Label required>Half-Day Rate</Label>
                        {/* → TourGuideDraftRequest.halfDayRate (Double) */}
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-sm font-semibold" style={{ color: "#9AAAB0" }}>$</span>
                          <input name="halfDayRate" type="number" min="1" step="0.01" required placeholder="40.00"
                            value={form.halfDayRate} onChange={set("halfDayRate")} className={`${inputCls} pl-7`} style={inputStyle} />
                        </div>
                        <Hint>Half-day rate (typically 4–5 hrs).</Hint>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Experience & Group</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Years of Experience</Label>
                        {/* → TourGuideDraftRequest.yearsOfExperience (Integer > 0) */}
                        <input name="yearsOfExperience" type="number" min="1" placeholder="e.g. 12"
                          value={form.yearsOfExperience} onChange={set("yearsOfExperience")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label>Max Group Size</Label>
                        {/* → TourGuideDraftRequest.maxGroupSizeGuided (Integer) */}
                        <input name="maxGroupSizeGuided" type="number" min="1" placeholder="e.g. 12"
                          value={form.maxGroupSizeGuided} onChange={set("maxGroupSizeGuided")} className={inputCls} style={inputStyle} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Primary Vehicle</p>
                    {/* → TourGuideDraftRequest.vehicleType (VehicleType enum) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {VEHICLE_TYPES.map(v => {
                        const active = form.vehicleType === v.id;
                        return (
                          <button key={v.id} type="button" onClick={() => setForm(f => ({ ...f, vehicleType: v.id }))}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all"
                            style={active ? goldActive : chipInactive}>
                            <span>{v.label}</span>
                            {active && <Check className="w-3.5 h-3.5 ml-1 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ background: "#FFFBEB", borderColor: "rgba(253,163,1,0.3)" }}>
                    <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#FDA301" }} />
                    <p className="text-xs leading-relaxed" style={{ color: "#4A5A62" }}>
                      Your profile will be reviewed against official SLTDA Tourist Guide records. Only licensed guides are verified and published on Blue Ceylon.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Navigation ── */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: "#E8EDEF" }}>
                {step > 1 ? (
                  <button type="button" onClick={() => setStep(s => s - 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:bg-white"
                    style={{ borderColor: "#E4E9EA", color: "#4A5A62" }}>
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                ) : (
                  <Link href="/dashboard"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold"
                    style={{ borderColor: "#E4E9EA", color: "#4A5A62" }}>
                    <ArrowLeft className="w-4 h-4" /> Cancel
                  </Link>
                )}
                <button type="submit" disabled={loading}
                  className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#003366,#FDA301)", boxShadow: "0 4px 16px rgba(253,163,1,0.3)" }}>
                  {loading ? "Submitting…" : step < TOTAL ? (<>Continue <ArrowRight className="w-4 h-4" /></>) : (<><Check className="w-4 h-4" /> Submit Guide Profile</>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
