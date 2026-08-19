"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase, MapPin, Globe, ShieldCheck, Check,
  ArrowRight, ArrowLeft, ChevronDown, Save, CheckCircle2, Clock
} from "lucide-react";
import { getMyBusiness, createAgencyDraft, submitBusiness } from "@/lib/api/catalog";
import { useAuthStore } from "@/store/auth-store";
import { LocationPicker } from "@/components/common/location-picker";

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
  { id: "TUK_TUK", label: "Tuk-Tuk" },
  { id: "CAR", label: "Hybrid Sedan" },
  { id: "MINIBUS", label: "Minibus" },
  { id: "MOTORBIKE", label: "Motorbike" },
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
  cancellationPolicy: string;
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
    cancellationPolicy: "FLEXIBLE",
    specializations: [], fleetTypes: [],
    coverImageUrl: "", videoUrl: "",
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
            website: existing.website || p.website,
            instagram: existing.socialLinks?.instagram || p.instagram,
            facebook: existing.socialLinks?.facebook || p.facebook,
            city: existing.city || p.city,
            region: existing.region || p.region,
            addressLine: existing.addressLine || p.addressLine,
            latitude: existing.latitude ? String(existing.latitude) : p.latitude,
            longitude: existing.longitude ? String(existing.longitude) : p.longitude,
            licenseNumber: (existing as any).licenseNumber || p.licenseNumber,
            yearsInOperation: (existing as any).yearsInOperation ? String((existing as any).yearsInOperation) : p.yearsInOperation,
            partnerNetworkSize: (existing as any).partnerNetworkSize ? String((existing as any).partnerNetworkSize) : p.partnerNetworkSize,
            cancellationPolicy: existing.cancellationPolicy || p.cancellationPolicy,
            specializations: (existing as any).specializations || p.specializations,
            fleetTypes: (existing as any).fleetTypes || p.fleetTypes,
            coverImageUrl: existing.coverImageUrl || p.coverImageUrl,
            videoUrl: existing.videoUrl || p.videoUrl,
          }));
        }
      } catch {
        // No draft existing
      }
    }
    loadDraft();
  }, []);

  const set = (f: keyof AgencyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }));

  const toggleArr = (field: "specializations" | "fleetTypes", val: string) =>
    setForm(p => {
      const arr = p[field] as string[];
      return { ...p, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });

  const buildPayload = () => ({
    name: form.name,
    tagline: form.tagline,
    description: form.description,
    contactEmail: form.contactEmail,
    contactPhone: form.contactPhone,
    whatsappNumber: form.whatsappNumber,
    website: form.website,
    socialLinks: { instagram: form.instagram, facebook: form.facebook },
    city: form.city as any,
    region: form.region as any,
    addressLine: form.addressLine,
    latitude: form.latitude ? Number(form.latitude) : 6.9271,
    longitude: form.longitude ? Number(form.longitude) : 79.8612,
    licenseNumber: form.licenseNumber,
    yearsInOperation: Number(form.yearsInOperation || 1),
    yearsInBusiness: Number(form.yearsInOperation || 1),
    partnerNetworkSize: form.partnerNetworkSize ? Number(form.partnerNetworkSize) : 0,
    cancellationPolicy: form.cancellationPolicy as any,
    specializations: form.specializations as any,
    fleetTypes: form.fleetTypes as any,
    coverImageUrl: form.coverImageUrl || "https://images.unsplash.com/photo-1534177616072-ef7dc120449d",
    videoUrl: form.videoUrl,
  });

  const handleSaveDraft = async () => {
    setDraftSaving(true);
    try {
      await createAgencyDraft(buildPayload());
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
      await createAgencyDraft(buildPayload());
      await submitBusiness();
      setLoading(false);
      router.push("/my-bookings");
    } catch {
      setLoading(false);
      router.push("/my-bookings");
    }
  };

  const ACCENT = "#008080";
  const chipActive = { borderColor: ACCENT, background: ACCENT, color: "#fff" };
  const chipInactive = { borderColor: "#E4E9EA", background: "#fff", color: "#4A5A62" };

  return (
    <div className="flex min-h-screen">
      {/* ══ LEFT SIDEBAR ══ */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 flex-shrink-0 sticky top-0 h-screen"
        style={{ background: "linear-gradient(175deg,#0A2020 0%,#092D2D 60%,#082828 100%)" }}>

        {/* Top Logo */}
        <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: ACCENT }}>
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-wide">Blue Ceylon</p>
              <p className="text-[10px] tracking-wider uppercase font-semibold" style={{ color: "#3FCFC0" }}>Tour Agency Portal</p>
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
                      background: done ? "#3FCFC0" : active ? ACCENT : "rgba(255,255,255,0.07)",
                      color: done || active ? "#fff" : "rgba(255,255,255,0.4)",
                      boxShadow: active ? `0 0 12px ${ACCENT}80` : "none",
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
              Verified against SLTDA Travel Agent Registry before publishing.
            </p>
          </div>
        </div>
      </aside>

      {/* ══ RIGHT CONTENT ══ */}
      <div className="flex-1 flex flex-col" style={{ background: "#F4F6F8" }}>

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3.5 border-b bg-white">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: ACCENT }}>
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
                style={{ width: step === s.id ? 18 : 6, background: step >= s.id ? ACCENT : "#E4E9EA" }} />
            ))}
          </div>
        </div>

        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10">

            {/* Step heading */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-xs font-semibold"
                style={{ background: "rgba(0,128,128,0.08)", color: ACCENT }}>
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
                    Your tour agency profile has been submitted and is currently being verified by our team. You cannot edit any fields or resubmit details until the verification process is complete.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <fieldset disabled={isPendingApproval} className="space-y-5 disabled:opacity-85">

              {/* ── STEP 1: Agency Identity ── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <div>
                      <Label required>Tour Agency / Company Name</Label>
                      <input name="name" type="text" required placeholder="e.g. Ceylon Heritage Travels & Safaris"
                        value={form.name} onChange={set("name")} className={inputCls} style={inputStyle} />
                    </div>

                    <div>
                      <Label>Tagline</Label>
                      <input name="tagline" type="text" placeholder="e.g. Custom Tailored Safaris & Island Expeditions"
                        value={form.tagline} onChange={set("tagline")} className={inputCls} style={inputStyle} />
                    </div>

                    <div>
                      <Label required>Company Description</Label>
                      <textarea name="description" rows={4} required
                        placeholder="Describe your tour services, expertise, client experience, custom itineraries..."
                        value={form.description} onChange={set("description")}
                        className="w-full px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all duration-150 focus:ring-2 focus:ring-[#008080]/20 focus:border-[#008080]"
                        style={inputStyle} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label required>SLTDA License Number</Label>
                        <input name="licenseNumber" type="text" required placeholder="e.g. TA/2024/00842"
                          value={form.licenseNumber} onChange={set("licenseNumber")} className={inputCls} style={inputStyle} />
                        <Hint>Official SLTDA registration code</Hint>
                      </div>
                      <div>
                        <Label required>Years in Operation</Label>
                        <input name="yearsInOperation" type="number" min={1} required placeholder="e.g. 8"
                          value={form.yearsInOperation} onChange={set("yearsInOperation")} className={inputCls} style={inputStyle} />
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Contact Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label required>Contact Email</Label>
                        <input name="contactEmail" type="email" required placeholder="info@ceylonheritagetravels.com"
                          value={form.contactEmail} onChange={set("contactEmail")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label required>Contact Phone</Label>
                        <input name="contactPhone" type="tel" required placeholder="+94 77 123 4567"
                          value={form.contactPhone} onChange={set("contactPhone")} className={inputCls} style={inputStyle} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>WhatsApp Hotline</Label>
                        <input name="whatsappNumber" type="tel" placeholder="+94 77 123 4567"
                          value={form.whatsappNumber} onChange={set("whatsappNumber")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label>Official Website</Label>
                        <input name="website" type="url" placeholder="https://ceylonheritagetravels.com"
                          value={form.website} onChange={set("website")} className={inputCls} style={inputStyle} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Instagram Handle</Label>
                        <input name="instagram" type="text" placeholder="@ceylonheritagetravels"
                          value={form.instagram} onChange={set("instagram")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label>Facebook Page URL</Label>
                        <input name="facebook" type="url" placeholder="https://facebook.com/ceylonheritagetravels"
                          value={form.facebook} onChange={set("facebook")} className={inputCls} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Location & Fleet ── */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Head Office Location</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label required>City</Label>
                        <div className="relative">
                          <select name="city" value={form.city} onChange={set("city")} className={selectCls} style={inputStyle}>
                            {CITIES.map(c => <option key={c} value={c}>{CITY_LABELS[c]}</option>)}
                          </select>
                          <ChevronDown className="w-4 h-4 absolute right-3 top-3.5 pointer-events-none" style={{ color: "#9AAAB0" }} />
                        </div>
                      </div>
                      <div>
                        <Label required>Region</Label>
                        <div className="relative">
                          <select name="region" value={form.region} onChange={set("region")} className={selectCls} style={inputStyle}>
                            {REGIONS.map(r => <option key={r} value={r}>{REGION_LABELS[r]}</option>)}
                          </select>
                          <ChevronDown className="w-4 h-4 absolute right-3 top-3.5 pointer-events-none" style={{ color: "#9AAAB0" }} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label required>Street Address</Label>
                        <input name="addressLine" type="text" required placeholder="e.g. 42 Main Street, Colombo 03"
                          value={form.addressLine} onChange={set("addressLine")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label>Cancellation Terms</Label>
                        <div className="relative">
                          <select name="cancellationPolicy" value={form.cancellationPolicy} onChange={set("cancellationPolicy")} className={selectCls} style={inputStyle}>
                            <option value="FLEXIBLE">Flexible</option>
                            <option value="MODERATE">Moderate</option>
                            <option value="STRICT">Strict</option>
                            <option value="NON_REFUNDABLE">Non-Refundable</option>
                          </select>
                          <ChevronDown className="w-4 h-4 absolute right-3 top-3.5 pointer-events-none" style={{ color: "#9AAAB0" }} />
                        </div>
                      </div>
                    </div>

                    <LocationPicker
                      latitude={form.latitude}
                      longitude={form.longitude}
                      cityName={form.city}
                      onChange={(lat, lng) => setForm((f) => ({ ...f, latitude: String(lat), longitude: String(lng) }))}
                    />
                  </div>

                  {/* Specializations */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4" style={{ borderColor: "#E8EDEF" }}>
                    <div>
                      <Label>Tour Specializations</Label>
                      <Hint>Select all primary tour types your agency offers</Hint>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {SPECIALIZATIONS.map((spec) => {
                        const sel = form.specializations.includes(spec.id);
                        return (
                          <button key={spec.id} type="button" onClick={() => toggleArr("specializations", spec.id)}
                            className="px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-150 flex items-center gap-1.5"
                            style={sel ? chipActive : chipInactive}>
                            {sel && <Check className="w-3.5 h-3.5" />} {spec.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fleet Types */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4" style={{ borderColor: "#E8EDEF" }}>
                    <div>
                      <Label>Fleet Vehicles</Label>
                      <Hint>Select the vehicle types in your agency fleet</Hint>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {FLEET_TYPES.map((ft) => {
                        const sel = form.fleetTypes.includes(ft.id);
                        return (
                          <button key={ft.id} type="button" onClick={() => toggleArr("fleetTypes", ft.id)}
                            className="px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-150 flex items-center gap-1.5"
                            style={sel ? chipActive : chipInactive}>
                            {sel && <Check className="w-3.5 h-3.5" />} {ft.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2">
                      <Label>Partner Network Size</Label>
                      <input name="partnerNetworkSize" type="number" min={0} placeholder="e.g. 15 hotel partners & guides"
                        value={form.partnerNetworkSize} onChange={set("partnerNetworkSize")} className={inputCls} style={inputStyle} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Media ── */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Media Assets</p>
                    
                    {/* Cover Image File Picker & Preview */}
                    <div className="space-y-2">
                      <Label>Cover Image</Label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-dashed" style={{ borderColor: "#CBD5E1", background: "#F8FAFC" }}>
                        {form.coverImageUrl ? (
                          <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 border relative">
                            <img src={form.coverImageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-24 h-16 rounded-lg bg-gray-200 flex items-center justify-center shrink-0 text-xs font-bold text-gray-500">
                            No File
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
                            className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#008080] file:text-white hover:file:bg-[#006666] cursor-pointer"
                          />
                          <Hint>Select an image file from your device, or paste a URL below.</Hint>
                          <input
                            name="coverImageUrl"
                            type="url"
                            placeholder="Or paste image URL: https://..."
                            value={form.coverImageUrl}
                            onChange={set("coverImageUrl")}
                            className={inputCls}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Promo Video File Picker */}
                    <div className="space-y-2">
                      <Label>Promo Video</Label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-dashed" style={{ borderColor: "#CBD5E1", background: "#F8FAFC" }}>
                        <div className="flex-1 space-y-1">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target?.result) {
                                    setForm(p => ({ ...p, videoUrl: event.target!.result as string }));
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#003366] file:text-white hover:file:bg-[#002244] cursor-pointer"
                          />
                          <Hint>Select a video file from your device, or paste a URL below.</Hint>
                          <input
                            name="videoUrl"
                            type="url"
                            placeholder="Or paste video URL: https://..."
                            value={form.videoUrl}
                            onChange={set("videoUrl")}
                            className={inputCls}
                            style={inputStyle}
                          />
                        </div>
                      </div>
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
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:bg-slate-100 dark:hover:bg-white/10"
                      style={{ borderColor: "#008080", color: "#008080" }}
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
                      className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white transition-all bg-[#008080]">
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
                    className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg,#003366,#008080)", boxShadow: "0 4px 16px rgba(0,128,128,0.25)" }}>
                    {loading ? "Submitting…" : step < TOTAL ? (<>Continue <ArrowRight className="w-4 h-4" /></>) : (<><Check className="w-4 h-4" /> Submit Agency Profile</>)}
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
