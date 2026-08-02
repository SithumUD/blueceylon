"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase, MapPin, Globe, ShieldCheck, Check,
  ArrowRight, ArrowLeft, ChevronDown,
} from "lucide-react";

/* ─── shared field atoms ─── */
const inputCls =
  "w-full px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all duration-150 focus:ring-2 focus:ring-[#008080]/20 focus:border-[#008080]";
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

const SPECIALIZATIONS = [
  { id: "WILDLIFE_SAFARI", label: "Wildlife Safari" },
  { id: "HILL_COUNTRY_TREKKING", label: "Mountain Trekking" },
  { id: "CULTURAL_TRIANGLE", label: "Cultural Heritage" },
  { id: "HONEYMOON", label: "Honeymoon & Couples" },
  { id: "FAMILY", label: "Family Tours" },
  { id: "PILGRIMAGE", label: "Pilgrimage Routes" },
  { id: "ADVENTURE", label: "Adventure Sports" },
  { id: "LUXURY", label: "Luxury Escapes" },
  { id: "BUDGET_BACKPACKER", label: "Budget Backpacker" },
];

const FLEET_TYPES = [
  { id: "SUV", label: "4×4 Luxury SUV" },
  { id: "VAN", label: "AC Passenger Van" },
  { id: "COACH", label: "Mini Coach" },
  { id: "TUKTUK", label: "Tuk-Tuk" },
  { id: "SEDAN", label: "Hybrid Sedan" },
];

/* ─── Steps config ─── */
const STEPS = [
  { id: 1, label: "Agency Identity",     sub: "Name, license & contacts",         icon: Briefcase },
  { id: 2, label: "Location & Fleet",    sub: "Address, specializations & vehicles", icon: MapPin },
  { id: 3, label: "Media",               sub: "Photos & promotional video",        icon: Globe },
] as const;

/* ─── Form interface ─── */
interface AgencyForm {
  name: string; tagline: string; description: string;
  contactEmail: string; contactPhone: string; whatsappNumber: string;
  website: string; instagram: string; facebook: string;
  city: string; region: string; addressLine: string; latitude: string; longitude: string;
  licenseNumber: string; yearsInOperation: string; partnerNetworkSize: string;
  specializations: string[]; fleetTypes: string[];
  coverImageUrl: string; videoUrl: string;
}

export default function TourAgencyRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const TOTAL = STEPS.length;

  const [form, setForm] = useState<AgencyForm>({
    name: "", tagline: "", description: "",
    contactEmail: "", contactPhone: "", whatsappNumber: "", website: "", instagram: "", facebook: "",
    city: "COLOMBO", region: "WESTERN_PROVINCE", addressLine: "", latitude: "", longitude: "",
    licenseNumber: "", yearsInOperation: "", partnerNetworkSize: "",
    specializations: [], fleetTypes: [],
    coverImageUrl: "", videoUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (f: keyof AgencyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }));

  const toggleArr = (field: "specializations" | "fleetTypes", val: string) =>
    setForm(p => {
      const arr = p[field] as string[];
      return { ...p, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < TOTAL) { setStep(s => s + 1); return; }
    setLoading(true);
    /* TODO: POST /api/v1/owner/businesses/tour-agency (user already authenticated) */
    setTimeout(() => { setLoading(false); router.push("/dashboard"); }, 1000);
  };

  const ACCENT = "#008080";
  const chipActive = { borderColor: ACCENT, background: ACCENT, color: "#fff" };
  const chipInactive = { borderColor: "#E4E9EA", background: "#fff", color: "#4A5A62" };

  return (
    <div className="flex min-h-screen">
      {/* ══ LEFT SIDEBAR ══ */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 flex-shrink-0 sticky top-0 h-screen"
        style={{ background: "linear-gradient(175deg,#0A2020 0%,#092D2D 60%,#082828 100%)" }}>

        {/* Brand */}
        <div className="px-6 py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#003366,#008080)", boxShadow: "0 4px 12px rgba(0,128,128,0.4)" }}>
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: "#3FCFC0" }}>Blue Ceylon</p>
              <p className="text-sm font-bold text-white leading-tight">Agency Registration</p>
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
                        background: done ? "#3FCFC0" : active ? "rgba(63,207,192,0.15)" : "transparent",
                        border: done ? "none" : active ? "2px solid #3FCFC0" : "2px solid rgba(255,255,255,0.15)",
                      }}>
                      {done
                        ? <Check className="w-3.5 h-3.5 text-white" />
                        : <Icon className="w-3.5 h-3.5" style={{ color: active ? "#3FCFC0" : "rgba(255,255,255,0.3)" }} />
                      }
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className="w-px my-1 flex-1 transition-all duration-500"
                        style={{ background: done ? "#3FCFC0" : "rgba(255,255,255,0.08)", minHeight: 36 }} />
                    )}
                  </div>
                  <div className="pb-9">
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

        {/* Footer */}
        <div className="px-6 py-5 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: "#FDA301" }} />
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
              All agencies verified against SLTDA Travel Agent records.
            </p>
          </div>
        </div>
      </aside>

      {/* ══ RIGHT CONTENT ══ */}
      <div className="flex-1 flex flex-col" style={{ background: "#F4F6F8" }}>

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3.5 border-b bg-white">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#003366,#008080)" }}>
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "#4A5A62" }}>
              Step {step}/{TOTAL} — {STEPS[step - 1].label}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {STEPS.map(s => (
              <div key={s.id} className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: step === s.id ? 18 : 6, background: step >= s.id ? "#008080" : "#E4E9EA" }} />
            ))}
          </div>
        </div>

        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10">

            {/* Step heading */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-xs font-semibold"
                style={{ background: "rgba(0,128,128,0.08)", color: "#008080" }}>
                Step {step} of {TOTAL}
              </div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: "'Fraunces',serif", color: "#0E1B22" }}>
                {STEPS[step - 1].label}
              </h1>
              <p className="text-sm mt-1" style={{ color: "#4A5A62" }}>{STEPS[step - 1].sub}</p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* ── STEP 1: Agency Identity & Contact ── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <div>
                      <Label required>Official Agency Name</Label>
                      {/* → TourAgencyDraftRequest.name */}
                      <input name="name" type="text" required placeholder="e.g. Ceylon Heritage Safaris & Expeditions"
                        value={form.name} onChange={set("name")} className={inputCls} style={inputStyle} />
                    </div>

                    <div className="p-4 rounded-xl border space-y-3" style={{ background: "#FFFBEB", borderColor: "rgba(253,163,1,0.35)" }}>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" style={{ color: "#FDA301" }} />
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4A5A62" }}>SLTDA Accreditation</span>
                      </div>
                      <div>
                        <Label required>Travel Agent License Number</Label>
                        {/* → TourAgencyDraftRequest.licenseNumber (SLTDA/TA/YYYY/XXXX) */}
                        <input name="licenseNumber" type="text" required placeholder="SLTDA/TA/YYYY/XXXX"
                          value={form.licenseNumber} onChange={set("licenseNumber")} className={inputCls} style={inputStyle} />
                        <Hint>Format: SLTDA/TA/2024/0123 — must match your official certificate.</Hint>
                      </div>
                    </div>

                    <div>
                      <Label>Tagline</Label>
                      {/* → TourAgencyDraftRequest.tagline (max 100 chars) */}
                      <input name="tagline" type="text" maxLength={100} placeholder="SLTDA-accredited wildlife safari & cultural heritage specialists"
                        value={form.tagline} onChange={set("tagline")} className={inputCls} style={inputStyle} />
                      <Hint>Max 100 characters.</Hint>
                    </div>

                    <div>
                      <Label required>Agency Overview & Services</Label>
                      {/* → TourAgencyDraftRequest.description */}
                      <textarea name="description" rows={4} required
                        placeholder="Describe your agency, key tour types, destinations covered, and what sets you apart..."
                        value={form.description} onChange={set("description")} className={inputCls} style={inputStyle} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Years in Operation</Label>
                        {/* → TourAgencyDraftRequest.yearsInOperation (Integer) */}
                        <input name="yearsInOperation" type="number" min="1" placeholder="e.g. 8"
                          value={form.yearsInOperation} onChange={set("yearsInOperation")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label>Partner Network Size</Label>
                        {/* → TourAgencyDraftRequest.partnerNetworkSize (Integer) */}
                        <input name="partnerNetworkSize" type="number" min="0" placeholder="e.g. 500"
                          value={form.partnerNetworkSize} onChange={set("partnerNetworkSize")} className={inputCls} style={inputStyle} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Contact Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label required>Contact Email</Label>
                        {/* → TourAgencyDraftRequest.contactEmail */}
                        <input name="contactEmail" type="email" required placeholder="tours@youragency.lk"
                          value={form.contactEmail} onChange={set("contactEmail")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label required>Contact Phone</Label>
                        {/* → TourAgencyDraftRequest.contactPhone */}
                        <input name="contactPhone" type="tel" required placeholder="+94 11 234 5678"
                          value={form.contactPhone} onChange={set("contactPhone")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label>WhatsApp</Label>
                        {/* → TourAgencyDraftRequest.whatsappNumber */}
                        <input name="whatsappNumber" type="tel" placeholder="+94 77 987 6543"
                          value={form.whatsappNumber} onChange={set("whatsappNumber")} className={inputCls} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <Label>Website URL</Label>
                      {/* → TourAgencyDraftRequest.website */}
                      <input name="website" type="url" placeholder="https://youragency.lk"
                        value={form.website} onChange={set("website")} className={inputCls} style={inputStyle} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Instagram</Label>
                        {/* → TourAgencyDraftRequest.socialLinks["instagram"] */}
                        <input name="instagram" type="text" placeholder="@youragency"
                          value={form.instagram} onChange={set("instagram")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label>Facebook</Label>
                        {/* → TourAgencyDraftRequest.socialLinks["facebook"] */}
                        <input name="facebook" type="text" placeholder="facebook.com/youragency"
                          value={form.facebook} onChange={set("facebook")} className={inputCls} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Location, Specializations & Fleet ── */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Head Office Location</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label required>Primary City</Label>
                        {/* → TourAgencyDraftRequest.city (SriLankanCity enum) */}
                        <div className="relative">
                          <select name="city" value={form.city} onChange={set("city")} className={selectCls} style={inputStyle}>
                            {CITIES.map(c => <option key={c} value={c}>{CITY_LABELS[c]}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none" style={{ color: "#9AAAB0" }} />
                        </div>
                      </div>
                      <div>
                        <Label required>Tourism Region</Label>
                        {/* → TourAgencyDraftRequest.region (Region enum) */}
                        <div className="relative">
                          <select name="region" value={form.region} onChange={set("region")} className={selectCls} style={inputStyle}>
                            {REGIONS.map(r => <option key={r} value={r}>{REGION_LABELS[r]}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none" style={{ color: "#9AAAB0" }} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label required>Street Address</Label>
                      {/* → TourAgencyDraftRequest.addressLine */}
                      <input name="addressLine" type="text" required placeholder="75 Galle Road, Colombo 03"
                        value={form.addressLine} onChange={set("addressLine")} className={inputCls} style={inputStyle} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Latitude</Label>
                        {/* → TourAgencyDraftRequest.latitude (Double) */}
                        <input name="latitude" type="number" step="any" placeholder="6.9271"
                          value={form.latitude} onChange={set("latitude")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label>Longitude</Label>
                        {/* → TourAgencyDraftRequest.longitude (Double) */}
                        <input name="longitude" type="number" step="any" placeholder="79.8612"
                          value={form.longitude} onChange={set("longitude")} className={inputCls} style={inputStyle} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Tour Specializations</p>
                    {/* → TourAgencyDraftRequest.specializations (List<AgencySpecialization>) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {SPECIALIZATIONS.map(s => {
                        const active = form.specializations.includes(s.id);
                        return (
                          <button key={s.id} type="button" onClick={() => toggleArr("specializations", s.id)}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all"
                            style={active ? chipActive : chipInactive}>
                            <span>{s.label}</span>
                            {active && <Check className="w-3.5 h-3.5 ml-1 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Vehicle Fleet</p>
                    {/* → TourAgencyDraftRequest.fleetTypes (List<VehicleType>) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {FLEET_TYPES.map(f => {
                        const active = form.fleetTypes.includes(f.id);
                        return (
                          <button key={f.id} type="button" onClick={() => toggleArr("fleetTypes", f.id)}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all"
                            style={active ? { borderColor: "#003366", background: "#003366", color: "#fff" } : chipInactive}>
                            <span>{f.label}</span>
                            {active && <Check className="w-3.5 h-3.5 ml-1 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Media ── */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Media Assets</p>
                    <div>
                      <Label>Cover Image URL</Label>
                      {/* → TourAgencyDraftRequest.coverImageUrl */}
                      <input name="coverImageUrl" type="url" placeholder="https://res.cloudinary.com/..."
                        value={form.coverImageUrl} onChange={set("coverImageUrl")} className={inputCls} style={inputStyle} />
                      <Hint>Main hero image shown on search cards and your agency profile.</Hint>
                    </div>
                    <div>
                      <Label>Promo Video URL</Label>
                      {/* → TourAgencyDraftRequest.videoUrl */}
                      <input name="videoUrl" type="url" placeholder="https://youtube.com/watch?v=..."
                        value={form.videoUrl} onChange={set("videoUrl")} className={inputCls} style={inputStyle} />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ background: "#FFFBEB", borderColor: "rgba(253,163,1,0.3)" }}>
                    <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#FDA301" }} />
                    <p className="text-xs leading-relaxed" style={{ color: "#4A5A62" }}>
                      Your agency profile will be reviewed against SLTDA Travel Agent records before being published on Blue Ceylon.
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
                  style={{ background: "linear-gradient(135deg,#003366,#008080)", boxShadow: "0 4px 16px rgba(0,128,128,0.25)" }}>
                  {loading ? "Submitting…" : step < TOTAL ? (<>Continue <ArrowRight className="w-4 h-4" /></>) : (<><Check className="w-4 h-4" /> Submit Agency Profile</>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
