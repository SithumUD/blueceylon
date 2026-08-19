"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Edit2, Trash2, MapPin, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMyTourPackages, createTourPackage, updateTourPackage, deleteTourPackage } from "@/lib/api/catalog";
import type { TourPackage, TourCategory, DifficultyLevel, VehicleType, MealPlan, Currency, SriLankanCity } from "@/lib/mock-data/businesses";

const CATEGORIES: TourCategory[] = ["CULTURAL","ADVENTURE","WILDLIFE","BEACH","SPIRITUAL","WELLNESS","HISTORICAL","ECO","CULINARY"];
const DIFFICULTIES: DifficultyLevel[] = ["EASY","MODERATE","CHALLENGING","EXTREME"];
const VEHICLES: VehicleType[] = ["TUK_TUK","CAR","VAN","SUV","MINIBUS","COACH","MOTORBIKE","NONE"];
const MEALS: MealPlan[] = ["NONE","BREAKFAST_ONLY","HALF_BOARD","FULL_BOARD","ALL_INCLUSIVE"];
const CURRENCIES: Currency[] = ["LKR","USD","EUR","GBP"];
const CITIES: SriLankanCity[] = ["COLOMBO","KANDY","GALLE","NUWARA_ELIYA","ELLA","NEGOMBO","SIGIRIYA","MIRISSA","HIKKADUWA","ANURADHAPURA","TRINCOMALEE","JAFFNA","DAMBULLA","POLONNARUWA","MATARA","BENTOTA"];

const BLANK: Partial<TourPackage> = { title: "", description: "", price: 0, currency: "USD", durationDays: 1, durationLabel: "1 Day", category: "CULTURAL", startingCity: "COLOMBO", minGroupSize: 1, maxGroupSize: 10, imageUrls: [], itineraryDays: [], pricingTiers: [], inclusions: [], scheduledDepartureDates: [], difficultyLevel: "EASY", transportModeIncluded: "CAR", mealsIncluded: "NONE", accommodationIncluded: false, isPrivateTour: false };

export default function ToursManagePage() {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<TourPackage>>(BLANK);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => { setLoading(true); try { setTours(await getMyTourPackages() || []); } catch { setTours([]); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditingId(null); setForm(BLANK); setShowForm(true); setError(null); setSuccess(null); };
  const openEdit = (t: TourPackage) => { setEditingId(t.id); setForm({ ...t }); setShowForm(true); setError(null); setSuccess(null); };
  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(BLANK); };
  const set = (k: keyof TourPackage, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError(null);
    try {
      if (editingId) { await updateTourPackage(editingId, form); setSuccess("Tour package updated!"); }
      else { await createTourPackage(form); setSuccess("Tour package created!"); }
      closeForm(); await load();
    } catch (err: any) { setError(err.message || "Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try { await deleteTourPackage(id); setTours((p) => p.filter((t) => t.id !== id)); setSuccess("Tour deleted."); }
    catch { setError("Delete failed."); }
    finally { setDeletingId(null); }
  };

  const inputCls = "w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:ring-2 focus:ring-[#003366]";

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>Tour Package Manager</h1>
          <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-1">Create and manage your tour packages and itineraries.</p>
        </div>
        <Button onClick={openCreate} className="bg-[#003366] text-white font-bold rounded-xl gap-2"><PlusCircle className="w-4 h-4" /> Add Tour Package</Button>
      </div>

      {success && <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-semibold px-4 py-3 rounded-xl"><Check className="w-4 h-4" /> {success}</div>}
      {error && <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl"><X className="w-4 h-4" /> {error}</div>}

      {showForm && (
        <form onSubmit={handleSave} className="bg-white dark:bg-[#0F252E] rounded-[2rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0E1B22] dark:text-[#EAF2F4]">{editingId ? "Edit Tour Package" : "New Tour Package"}</h2>
            <button type="button" onClick={closeForm} className="text-[#4A5A62] hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">Title</label>
              <input type="text" required value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">Description</label>
              <textarea rows={3} required value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} className={inputCls} />
            </div>
            {([["Price","price","number",true],["Duration (days)","durationDays","number",true],["Duration Label","durationLabel","text",true],["Min Group Size","minGroupSize","number",true],["Max Group Size","maxGroupSize","number",true]] as [string,string,string,boolean][]).map(([label,key,type,req]) => (
              <div key={key}>
                <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">{label}</label>
                <input type={type} required={req} value={(form as any)[key] ?? ""} onChange={(e) => set(key as any, type === "number" ? Number(e.target.value) : e.target.value)} className={inputCls} />
              </div>
            ))}
            {([["Category","category",CATEGORIES],["Difficulty","difficultyLevel",DIFFICULTIES],["Transport","transportModeIncluded",VEHICLES],["Meals","mealsIncluded",MEALS],["Currency","currency",CURRENCIES],["Starting City","startingCity",CITIES]] as [string,string,string[]][]).map(([label,key,opts]) => (
              <div key={key}>
                <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">{label}</label>
                <select value={(form as any)[key] ?? opts[0]} onChange={(e) => set(key as any, e.target.value)} className={inputCls}>
                  {opts.map((o) => <option key={o} value={o}>{o.replace(/_/g," ")}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-[#4A5A62] dark:text-[#A9BCC2] font-semibold cursor-pointer">
              <input type="checkbox" checked={!!form.accommodationIncluded} onChange={(e) => set("accommodationIncluded", e.target.checked)} className="w-4 h-4 rounded accent-[#008080]" /> Accommodation Included
            </label>
            <label className="flex items-center gap-2 text-sm text-[#4A5A62] dark:text-[#A9BCC2] font-semibold cursor-pointer">
              <input type="checkbox" checked={!!form.isPrivateTour} onChange={(e) => set("isPrivateTour", e.target.checked)} className="w-4 h-4 rounded accent-[#008080]" /> Private Tour
            </label>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving} className="bg-[#003366] text-white font-bold rounded-xl px-6">{saving ? "Saving..." : editingId ? "Update Package" : "Create Package"}</Button>
            <Button type="button" variant="ghost" onClick={closeForm} className="rounded-xl font-semibold">Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-sm text-[#4A5A62] dark:text-[#A9BCC2]">Loading tour packages...</div>
      ) : tours.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0F252E] rounded-[2rem] border border-[#E4E9EA] dark:border-[#20353D]">
          <MapPin className="w-12 h-12 text-[#9AAAB0] mx-auto mb-4" />
          <h3 className="font-bold text-[#0E1B22] dark:text-[#EAF2F4] mb-1">No tour packages yet</h3>
          <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2]">Click "Add Tour Package" to create your first itinerary.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white dark:bg-[#0F252E] rounded-[1.5rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm p-5 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#008080] dark:text-[#3FCFC0] bg-[#008080]/10 px-2 py-0.5 rounded-full">{tour.category?.replace(/_/g," ")}</span>
                <h3 className="font-bold text-[#0E1B22] dark:text-[#EAF2F4] mt-1.5 text-sm">{tour.title}</h3>
                <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2] line-clamp-2 mt-0.5">{tour.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-[#4A5A62] dark:text-[#A9BCC2]">
                <span className="bg-gray-100 dark:bg-[#15323D] px-2 py-0.5 rounded-full">⏱ {tour.durationLabel || `${tour.durationDays}D`}</span>
                <span className="bg-gray-100 dark:bg-[#15323D] px-2 py-0.5 rounded-full">👥 {tour.minGroupSize}–{tour.maxGroupSize} pax</span>
                <span className="bg-gray-100 dark:bg-[#15323D] px-2 py-0.5 rounded-full">🏙 {tour.startingCity?.replace(/_/g," ")}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-black text-[#003366] dark:text-[#3FCFC0]">{tour.currency} {tour.price?.toLocaleString()}</div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => openEdit(tour)} variant="ghost" className="text-xs font-bold rounded-xl gap-1 h-8"><Edit2 className="w-3.5 h-3.5" /> Edit</Button>
                  <Button onClick={() => handleDelete(tour.id)} disabled={deletingId === tour.id} variant="ghost" className="text-xs font-bold rounded-xl gap-1 h-8 text-red-500 border-red-200 hover:bg-red-50">
                    <Trash2 className="w-3.5 h-3.5" /> {deletingId === tour.id ? "..." : "Del"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
