"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Edit2, Trash2, Sun, Moon, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getMyDayOutPackages, createDayOutPackage, updateDayOutPackage, deleteDayOutPackage,
  getMyNightOutPackages, createNightOutPackage, updateNightOutPackage, deleteNightOutPackage,
} from "@/lib/api/catalog";
import type { DayOutPackage, NightOutPackage, Currency, PricingUnit } from "@/lib/mock-data/businesses";

const CURRENCIES: Currency[] = ["LKR","USD","EUR","GBP"];
const PRICING_UNITS: PricingUnit[] = ["PER_PERSON","PER_GROUP","FLAT_RATE"];
const ALL_DAYS = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];

const BLANK_DAY: Partial<DayOutPackage> = { title:"", description:"", price:0, currency:"USD", pricingUnit:"PER_PERSON", startTime:"09:00", endTime:"17:00", inclusions:[], maxOccupancy:10, availableDays:[], imageUrls:[], advanceBookingHoursRequired:24 };
const BLANK_NIGHT: Partial<NightOutPackage> = { title:"", description:"", price:0, currency:"USD", pricingUnit:"PER_PERSON", startTime:"18:00", endTime:"23:00", includesOvernightStay:false, inclusions:[], maxOccupancy:10, availableDays:[], imageUrls:[], advanceBookingHoursRequired:24 };

export default function ExperiencesManagePage() {
  const [tab, setTab] = useState<"day"|"night">("day");
  const [dayPkgs, setDayPkgs] = useState<DayOutPackage[]>([]);
  const [nightPkgs, setNightPkgs] = useState<NightOutPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formDay, setFormDay] = useState<Partial<DayOutPackage>>(BLANK_DAY);
  const [formNight, setFormNight] = useState<Partial<NightOutPackage>>(BLANK_NIGHT);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [d, n] = await Promise.all([getMyDayOutPackages(), getMyNightOutPackages()]);
      setDayPkgs(d || []); setNightPkgs(n || []);
    } catch { setDayPkgs([]); setNightPkgs([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditingId(null); if(tab==="day") setFormDay(BLANK_DAY); else setFormNight(BLANK_NIGHT); setShowForm(true); setError(null); setSuccess(null); };
  const openEditDay = (p: DayOutPackage) => { setEditingId(p.id); setFormDay({...p}); setShowForm(true); setTab("day"); setError(null); setSuccess(null); };
  const openEditNight = (p: NightOutPackage) => { setEditingId(p.id); setFormNight({...p}); setShowForm(true); setTab("night"); setError(null); setSuccess(null); };
  const closeForm = () => { setShowForm(false); setEditingId(null); };
  const setD = (k: keyof DayOutPackage, v: any) => setFormDay((p) => ({...p,[k]:v}));
  const setN = (k: keyof NightOutPackage, v: any) => setFormNight((p) => ({...p,[k]:v}));

  const toggleDayDay = (day: string) => {
    const days = formDay.availableDays || [];
    setD("availableDays", days.includes(day) ? days.filter((d) => d !== day) : [...days, day]);
  };
  const toggleNightDay = (day: string) => {
    const days = formNight.availableDays || [];
    setN("availableDays", days.includes(day) ? days.filter((d) => d !== day) : [...days, day]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError(null);
    try {
      if (tab === "day") {
        if (editingId) { await updateDayOutPackage(editingId, formDay); setSuccess("Day-Out updated!"); }
        else { await createDayOutPackage(formDay); setSuccess("Day-Out created!"); }
      } else {
        if (editingId) { await updateNightOutPackage(editingId, formNight); setSuccess("Night-Out updated!"); }
        else { await createNightOutPackage(formNight); setSuccess("Night-Out created!"); }
      }
      closeForm(); await load();
    } catch (err: any) { setError(err.message || "Save failed."); }
    finally { setSaving(false); }
  };

  const handleDeleteDay = async (id: string) => { setDeletingId(id); try { await deleteDayOutPackage(id); setDayPkgs((p) => p.filter((x) => x.id !== id)); setSuccess("Deleted."); } catch { setError("Delete failed."); } finally { setDeletingId(null); } };
  const handleDeleteNight = async (id: string) => { setDeletingId(id); try { await deleteNightOutPackage(id); setNightPkgs((p) => p.filter((x) => x.id !== id)); setSuccess("Deleted."); } catch { setError("Delete failed."); } finally { setDeletingId(null); } };

  const inputCls = "w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:ring-2 focus:ring-[#003366]";

  const form = tab === "day" ? formDay : formNight;
  const setFn = tab === "day" ? setD : (setN as any);
  const toggleDay = tab === "day" ? toggleDayDay : toggleNightDay;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>Experience Packages</h1>
          <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-1">Manage your Day-Out and Night-Out experience packages.</p>
        </div>
        <Button onClick={openCreate} className="bg-[#003366] text-white font-bold rounded-xl gap-2"><PlusCircle className="w-4 h-4" /> Add Experience</Button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        {(["day","night"] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setShowForm(false); }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${tab===t ? "bg-[#003366] text-white" : "bg-white dark:bg-[#0F252E] border border-[#E4E9EA] dark:border-[#20353D] text-[#4A5A62] dark:text-[#A9BCC2] hover:bg-gray-50 dark:hover:bg-[#15323D]"}`}>
            {t === "day" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {t === "day" ? "Day-Out" : "Night-Out"}
          </button>
        ))}
      </div>

      {success && <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-semibold px-4 py-3 rounded-xl"><Check className="w-4 h-4" /> {success}</div>}
      {error && <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl"><X className="w-4 h-4" /> {error}</div>}

      {showForm && (
        <form onSubmit={handleSave} className="bg-white dark:bg-[#0F252E] rounded-[2rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0E1B22] dark:text-[#EAF2F4]">{editingId ? "Edit" : "New"} {tab === "day" ? "Day-Out" : "Night-Out"} Package</h2>
            <button type="button" onClick={closeForm} className="text-[#4A5A62] hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">Title</label>
              <input type="text" required value={(form as any).title ?? ""} onChange={(e) => setFn("title", e.target.value)} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">Description</label>
              <textarea rows={2} value={(form as any).description ?? ""} onChange={(e) => setFn("description", e.target.value)} className={inputCls} />
            </div>
            {([["Price","price","number"],["Max Occupancy","maxOccupancy","number"],["Advance Booking (hrs)","advanceBookingHoursRequired","number"],["Start Time","startTime","time"],["End Time","endTime","time"]] as [string,string,string][]).map(([label,key,type]) => (
              <div key={key}>
                <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">{label}</label>
                <input type={type} value={(form as any)[key] ?? ""} onChange={(e) => setFn(key as any, type === "number" ? Number(e.target.value) : e.target.value)} className={inputCls} />
              </div>
            ))}
            {([["Currency","currency",CURRENCIES],["Pricing Unit","pricingUnit",PRICING_UNITS]] as [string,string,string[]][]).map(([label,key,opts]) => (
              <div key={key}>
                <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">{label}</label>
                <select value={(form as any)[key] ?? opts[0]} onChange={(e) => setFn(key as any, e.target.value)} className={inputCls}>
                  {opts.map((o) => <option key={o} value={o}>{o.replace(/_/g," ")}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-2">Available Days</label>
            <div className="flex flex-wrap gap-2">
              {ALL_DAYS.map((day) => {
                const active = ((form as any).availableDays || []).includes(day);
                return (
                  <button key={day} type="button" onClick={() => toggleDay(day)} className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${active ? "bg-[#003366] text-white" : "bg-gray-100 dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2]"}`}>
                    {day.slice(0,3)}
                  </button>
                );
              })}
            </div>
          </div>
          {tab === "night" && (
            <label className="flex items-center gap-2 text-sm text-[#4A5A62] dark:text-[#A9BCC2] font-semibold cursor-pointer">
              <input type="checkbox" checked={!!(formNight as any).includesOvernightStay} onChange={(e) => setN("includesOvernightStay", e.target.checked)} className="w-4 h-4 rounded accent-[#008080]" /> Includes Overnight Stay
            </label>
          )}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving} className="bg-[#003366] text-white font-bold rounded-xl px-6">{saving ? "Saving..." : editingId ? "Update" : "Create"}</Button>
            <Button type="button" variant="ghost" onClick={closeForm} className="rounded-xl font-semibold">Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-sm text-[#4A5A62] dark:text-[#A9BCC2]">Loading packages...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {(tab === "day" ? dayPkgs : nightPkgs).map((pkg) => (
            <div key={pkg.id} className="bg-white dark:bg-[#0F252E] rounded-[1.5rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${tab==="day" ? "text-amber-600 bg-amber-50 dark:bg-amber-900/20" : "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"}`}>
                    {tab === "day" ? "☀️ Day-Out" : "🌙 Night-Out"}
                  </span>
                  <h3 className="font-bold text-[#0E1B22] dark:text-[#EAF2F4] mt-1.5 text-sm">{(pkg as any).title}</h3>
                  <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">{(pkg as any).startTime} – {(pkg as any).endTime}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-black text-[#003366] dark:text-[#3FCFC0]">{(pkg as any).currency} {(pkg as any).price?.toLocaleString()}</div>
                  <div className="text-[10px] text-[#4A5A62] dark:text-[#A9BCC2]">{(pkg as any).pricingUnit?.replace(/_/g," ")}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {((pkg as any).availableDays || []).map((d: string) => (
                  <span key={d} className="text-[10px] font-bold bg-gray-100 dark:bg-[#15323D] text-[#4A5A62] dark:text-[#A9BCC2] px-2 py-0.5 rounded-full">{d.slice(0,3)}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button onClick={() => tab==="day" ? openEditDay(pkg as DayOutPackage) : openEditNight(pkg as NightOutPackage)} variant="ghost" className="flex-1 text-xs font-bold rounded-xl gap-1 h-8"><Edit2 className="w-3.5 h-3.5" /> Edit</Button>
                <Button onClick={() => tab==="day" ? handleDeleteDay(pkg.id) : handleDeleteNight(pkg.id)} disabled={deletingId === pkg.id} variant="ghost" className="flex-1 text-xs font-bold rounded-xl gap-1 h-8 text-red-500 border-red-200 hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5" /> {deletingId === pkg.id ? "..." : "Del"}
                </Button>
              </div>
            </div>
          ))}
          {(tab === "day" ? dayPkgs : nightPkgs).length === 0 && !loading && (
            <div className="sm:col-span-2 xl:col-span-3 text-center py-12 text-sm text-[#4A5A62] dark:text-[#A9BCC2]">
              No {tab === "day" ? "day-out" : "night-out"} packages yet. Click "Add Experience" to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
