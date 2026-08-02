"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Hotel, MapPin, Globe, ShieldCheck, Check,
  ArrowRight, ArrowLeft, ChevronDown,
} from "lucide-react";

/* ─── shared field atoms ─── */
const inputCls =
  "w-full px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all duration-150 focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]";
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
const PROPERTY_TYPES = ["HOTEL","RESORT","BOUTIQUE","VILLA","HOMESTAY","ECO_LODGE","GUESTHOUSE"] as const;
const PROPERTY_LABELS: Record<string, string> = { HOTEL:"Hotel",RESORT:"Resort",BOUTIQUE:"Boutique Hotel",VILLA:"Villa",HOMESTAY:"Homestay",ECO_LODGE:"Eco Lodge",GUESTHOUSE:"Guesthouse" };
const PET_POLICIES = ["ALLOWED","NOT_ALLOWED","ON_REQUEST"] as const;
const PET_LABELS: Record<string, string> = { ALLOWED:"Pets Allowed",NOT_ALLOWED:"No Pets",ON_REQUEST:"On Request" };

/* ─── Steps config ─── */
const STEPS = [
  { id: 1, label: "Property Identity",   sub: "Name, contacts & description",     icon: Hotel  },
  { id: 2, label: "Location & Specs",    sub: "Address, type & room details",      icon: MapPin },
  { id: 3, label: "Packages & Media",   sub: "Booking options & media assets",    icon: Globe  },
] as const;

/* ─── Form interface ─── */
interface HotelForm {
  name: string; tagline: string; description: string;
  contactEmail: string; contactPhone: string; whatsappNumber: string;
  website: string; instagram: string; facebook: string;
  city: string; region: string; addressLine: string; latitude: string; longitude: string;
  propertyType: string; starRating: string; totalBranches: string;
  checkInTime: string; checkOutTime: string; petPolicy: string; totalRooms: string;
  offersDayOutPackages: boolean; offersNightOutPackages: boolean; offersHourlyBooking: boolean;
  coverImageUrl: string; videoUrl: string;
}

export default function HotelRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const TOTAL = STEPS.length;

  const [form, setForm] = useState<HotelForm>({
    name: "", tagline: "", description: "",
    contactEmail: "", contactPhone: "", whatsappNumber: "", website: "", instagram: "", facebook: "",
    city: "COLOMBO", region: "WESTERN_PROVINCE", addressLine: "", latitude: "", longitude: "",
    propertyType: "HOTEL", starRating: "3", totalBranches: "1",
    checkInTime: "14:00", checkOutTime: "11:00", petPolicy: "NOT_ALLOWED", totalRooms: "",
    offersDayOutPackages: false, offersNightOutPackages: false, offersHourlyBooking: false,
    coverImageUrl: "", videoUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (f: keyof HotelForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }));
  const toggle = (f: keyof HotelForm) => () => setForm(p => ({ ...p, [f]: !p[f] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < TOTAL) { setStep(s => s + 1); return; }
    setLoading(true);
    /* TODO: POST /api/v1/owner/businesses/hotel (user already authenticated) */
    setTimeout(() => { setLoading(false); router.push("/dashboard"); }, 1000);
  };

  return (
    <div className="flex min-h-screen">
      {/* ══ LEFT SIDEBAR ══ */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 flex-shrink-0 sticky top-0 h-screen"
        style={{ background: "linear-gradient(175deg,#0A1E2A 0%,#0D2B3A 60%,#0C2535 100%)" }}>

        {/* Brand */}
        <div className="px-6 py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#003366,#008080)", boxShadow: "0 4px 12px rgba(0,51,102,0.4)" }}>
              <Hotel className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: "#3FCFC0" }}>Blue Ceylon</p>
              <p className="text-sm font-bold text-white leading-tight">Hotel Registration</p>
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
                  {/* Circle + connector */}
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
                  {/* Text */}
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

        {/* Footer note */}
        <div className="px-6 py-5 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: "#FDA301" }} />
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
              All listings are verified against SLTDA records before publishing.
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
            <Hotel className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "#4A5A62" }}>
              Step {step}/{TOTAL} — {STEPS[step - 1].label}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {STEPS.map(s => (
              <div key={s.id} className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: step === s.id ? 18 : 6, background: step >= s.id ? "#003366" : "#E4E9EA" }} />
            ))}
          </div>
        </div>

        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10">

            {/* Step heading */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-xs font-semibold"
                style={{ background: "rgba(0,51,102,0.08)", color: "#003366" }}>
                Step {step} of {TOTAL}
              </div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: "'Fraunces',serif", color: "#0E1B22" }}>
                {STEPS[step - 1].label}
              </h1>
              <p className="text-sm mt-1" style={{ color: "#4A5A62" }}>{STEPS[step - 1].sub}</p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* ── STEP 1: Property Identity & Contact ── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <div>
                      <Label required>Property / Business Name</Label>
                      {/* → HotelDraftRequest.name */}
                      <input name="name" type="text" required placeholder="e.g. Kandy Horizon Boutique Hotel"
                        value={form.name} onChange={set("name")} className={inputCls} style={inputStyle} />
                    </div>
                    <div>
                      <Label>Tagline</Label>
                      {/* → HotelDraftRequest.tagline (max 100 chars) */}
                      <input name="tagline" type="text" maxLength={100} placeholder="Boutique hillside retreat overlooking Kandy lake"
                        value={form.tagline} onChange={set("tagline")} className={inputCls} style={inputStyle} />
                      <Hint>Max 100 characters — shown on search result cards.</Hint>
                    </div>
                    <div>
                      <Label required>Full Description</Label>
                      {/* → HotelDraftRequest.description */}
                      <textarea name="description" rows={4} required
                        placeholder="Describe your property, location highlights, style, and what makes it unique..."
                        value={form.description} onChange={set("description")} className={inputCls} style={inputStyle} />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Contact Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label required>Contact Email</Label>
                        {/* → HotelDraftRequest.contactEmail */}
                        <input name="contactEmail" type="email" required placeholder="stay@yourhotel.lk"
                          value={form.contactEmail} onChange={set("contactEmail")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label required>Contact Phone</Label>
                        {/* → HotelDraftRequest.contactPhone */}
                        <input name="contactPhone" type="tel" required placeholder="+94 81 223 4567"
                          value={form.contactPhone} onChange={set("contactPhone")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label>WhatsApp</Label>
                        {/* → HotelDraftRequest.whatsappNumber */}
                        <input name="whatsappNumber" type="tel" placeholder="+94 77 123 4567"
                          value={form.whatsappNumber} onChange={set("whatsappNumber")} className={inputCls} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <Label>Website URL</Label>
                      {/* → HotelDraftRequest.website */}
                      <input name="website" type="url" placeholder="https://yourhotel.lk"
                        value={form.website} onChange={set("website")} className={inputCls} style={inputStyle} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Instagram</Label>
                        {/* → HotelDraftRequest.socialLinks["instagram"] */}
                        <input name="instagram" type="text" placeholder="@yourhotel"
                          value={form.instagram} onChange={set("instagram")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label>Facebook</Label>
                        {/* → HotelDraftRequest.socialLinks["facebook"] */}
                        <input name="facebook" type="text" placeholder="facebook.com/yourhotel"
                          value={form.facebook} onChange={set("facebook")} className={inputCls} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Location & Property Specs ── */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Location</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label required>City / Town</Label>
                        {/* → HotelDraftRequest.city (SriLankanCity enum) */}
                        <div className="relative">
                          <select name="city" value={form.city} onChange={set("city")} className={selectCls} style={inputStyle}>
                            {CITIES.map(c => <option key={c} value={c}>{CITY_LABELS[c]}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none" style={{ color: "#9AAAB0" }} />
                        </div>
                      </div>
                      <div>
                        <Label required>Tourism Region</Label>
                        {/* → HotelDraftRequest.region (Region enum) */}
                        <div className="relative">
                          <select name="region" value={form.region} onChange={set("region")} className={selectCls} style={inputStyle}>
                            {REGIONS.map(r => <option key={r} value={r}>{REGION_LABELS[r]}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none" style={{ color: "#9AAAB0" }} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label required>Full Street Address</Label>
                      {/* → HotelDraftRequest.addressLine */}
                      <input name="addressLine" type="text" required placeholder="12 Rajapihilla Mawatha, Kandy 20000"
                        value={form.addressLine} onChange={set("addressLine")} className={inputCls} style={inputStyle} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Latitude</Label>
                        {/* → HotelDraftRequest.latitude (Double) */}
                        <input name="latitude" type="number" step="any" placeholder="7.2906"
                          value={form.latitude} onChange={set("latitude")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label>Longitude</Label>
                        {/* → HotelDraftRequest.longitude (Double) */}
                        <input name="longitude" type="number" step="any" placeholder="80.6337"
                          value={form.longitude} onChange={set("longitude")} className={inputCls} style={inputStyle} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Property Specifications</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label required>Property Type</Label>
                        {/* → HotelDraftRequest.propertyType (PropertyType enum) */}
                        <div className="relative">
                          <select name="propertyType" value={form.propertyType} onChange={set("propertyType")} className={selectCls} style={inputStyle}>
                            {PROPERTY_TYPES.map(p => <option key={p} value={p}>{PROPERTY_LABELS[p]}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none" style={{ color: "#9AAAB0" }} />
                        </div>
                      </div>
                      <div>
                        <Label>Star Rating</Label>
                        {/* → HotelDraftRequest.starRating (Integer 1–5) */}
                        <div className="relative">
                          <select name="starRating" value={form.starRating} onChange={set("starRating")} className={selectCls} style={inputStyle}>
                            {[5,4,3,2,1].map(n => <option key={n} value={String(n)}>{n} Star{n > 1 ? "s" : ""}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none" style={{ color: "#9AAAB0" }} />
                        </div>
                      </div>
                      <div>
                        <Label>Total Branches</Label>
                        {/* → HotelDraftRequest.totalBranches (Integer) */}
                        <input name="totalBranches" type="number" min="1" placeholder="1"
                          value={form.totalBranches} onChange={set("totalBranches")} className={inputCls} style={inputStyle} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label>Check-In Time</Label>
                        {/* → HotelDraftRequest.checkInTime (HH:mm) */}
                        <input name="checkInTime" type="time" value={form.checkInTime} onChange={set("checkInTime")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label>Check-Out Time</Label>
                        {/* → HotelDraftRequest.checkOutTime (HH:mm) */}
                        <input name="checkOutTime" type="time" value={form.checkOutTime} onChange={set("checkOutTime")} className={inputCls} style={inputStyle} />
                      </div>
                      <div>
                        <Label>Total Rooms</Label>
                        {/* → HotelDraftRequest.totalRooms (Integer) */}
                        <input name="totalRooms" type="number" min="1" placeholder="e.g. 24"
                          value={form.totalRooms} onChange={set("totalRooms")} className={inputCls} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <Label>Pet Policy</Label>
                      {/* → HotelDraftRequest.petPolicy (PetPolicy enum) */}
                      <div className="grid grid-cols-3 gap-3">
                        {PET_POLICIES.map(p => {
                          const active = form.petPolicy === p;
                          return (
                            <button key={p} type="button" onClick={() => setForm(f => ({ ...f, petPolicy: p }))}
                              className="py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all"
                              style={{ borderColor: active ? "#003366" : "#E4E9EA", background: active ? "#003366" : "#fff", color: active ? "#fff" : "#4A5A62" }}>
                              {PET_LABELS[p]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Packages & Media ── */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Booking Features</p>
                    {[
                      { field: "offersDayOutPackages" as const, label: "Offers Day Out Packages", sub: "Enable Day Out pool/beach pass tab" },
                      { field: "offersNightOutPackages" as const, label: "Offers Night Out Packages", sub: "Enable Evening event & gala packages" },
                      { field: "offersHourlyBooking" as const, label: "Offers Hourly / Layover Booking", sub: "Enable short-stay layover bookings" },
                    ].map(({ field, label, sub }) => {
                      const active = form[field] as boolean;
                      return (
                        <label key={field} className="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all"
                          style={{ borderColor: active ? "#003366" : "#E8EDEF", background: active ? "rgba(0,51,102,0.04)" : "#fff" }}>
                          <div>
                            {/* → HotelDraftRequest Boolean flags */}
                            <p className="text-sm font-semibold" style={{ color: "#0E1B22" }}>{label}</p>
                            <p className="text-xs mt-0.5" style={{ color: "#4A5A62" }}>{sub}</p>
                          </div>
                          <div className="relative ml-4 flex-shrink-0">
                            <input type="checkbox" className="sr-only" checked={active} onChange={toggle(field)} />
                            <div className="w-10 h-5 rounded-full transition-colors duration-200"
                              style={{ background: active ? "#003366" : "#E4E9EA" }}>
                              <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                                style={{ transform: active ? "translateX(22px)" : "translateX(2px)" }} />
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5" style={{ borderColor: "#E8EDEF" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9AAAB0" }}>Media Assets</p>
                    <div>
                      <Label>Cover Image URL</Label>
                      {/* → HotelDraftRequest.coverImageUrl */}
                      <input name="coverImageUrl" type="url" placeholder="https://res.cloudinary.com/..."
                        value={form.coverImageUrl} onChange={set("coverImageUrl")} className={inputCls} style={inputStyle} />
                      <Hint>Main hero image shown on your listing card.</Hint>
                    </div>
                    <div>
                      <Label>Promo Video URL</Label>
                      {/* → HotelDraftRequest.videoUrl */}
                      <input name="videoUrl" type="url" placeholder="https://youtube.com/watch?v=..."
                        value={form.videoUrl} onChange={set("videoUrl")} className={inputCls} style={inputStyle} />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ background: "#FFFBEB", borderColor: "rgba(253,163,1,0.3)" }}>
                    <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#FDA301" }} />
                    <p className="text-xs leading-relaxed" style={{ color: "#4A5A62" }}>
                      Your property listing will be reviewed against SLTDA hotel registration records before being published on Blue Ceylon.
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
                  style={{ background: "linear-gradient(135deg,#003366,#008080)", boxShadow: "0 4px 16px rgba(0,51,102,0.25)" }}>
                  {loading ? "Submitting…" : step < TOTAL ? (<>Continue <ArrowRight className="w-4 h-4" /></>) : (<><Check className="w-4 h-4" /> Submit Hotel Profile</>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
