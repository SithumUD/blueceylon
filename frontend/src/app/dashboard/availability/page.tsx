"use client";

import React, { useState, useEffect } from "react";
import { CalendarX, PlusCircle, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api/client";

interface BlackoutDate {
  id: string;
  date: string;
  reason?: string;
}

async function getMyBlackoutDates(): Promise<BlackoutDate[]> {
  return apiFetch<BlackoutDate[]>("/api/v1/catalog/business/me/blackout-dates", { method: "GET" });
}
async function addBlackoutDate(payload: { date: string; reason?: string }): Promise<BlackoutDate> {
  return apiFetch<BlackoutDate>("/api/v1/catalog/business/me/blackout-dates", { method: "POST", body: JSON.stringify(payload) });
}
async function removeBlackoutDate(id: string): Promise<void> {
  return apiFetch<void>(`/api/v1/catalog/business/me/blackout-dates/${id}`, { method: "DELETE" });
}

export default function AvailabilityPage() {
  const [dates, setDates] = useState<BlackoutDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try { setDates(await getMyBlackoutDates() || []); }
    catch { setDates([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;
    setSaving(true); setError(null);
    try {
      const result = await addBlackoutDate({ date: newDate, reason: newReason || undefined });
      setDates((prev) => [...prev, result]);
      setNewDate(""); setNewReason("");
      setSuccess("Blackout date added!");
    } catch (err: any) { setError(err.message || "Failed to add date."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try { await removeBlackoutDate(id); setDates((p) => p.filter((d) => d.id !== id)); setSuccess("Date removed."); }
    catch { setError("Delete failed."); }
    finally { setDeletingId(null); }
  };

  const inputCls = "w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:ring-2 focus:ring-[#003366]";

  // Group dates by month
  const byMonth: Record<string, BlackoutDate[]> = {};
  [...dates].sort((a, b) => a.date.localeCompare(b.date)).forEach((d) => {
    const key = d.date.substring(0, 7);
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(d);
  });

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>Availability Calendar</h1>
        <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-1">Mark dates when you are unavailable to accept bookings.</p>
      </div>

      {success && <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-semibold px-4 py-3 rounded-xl"><Check className="w-4 h-4" /> {success}</div>}
      {error && <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl"><X className="w-4 h-4" /> {error}</div>}

      {/* Add Blackout Date Form */}
      <form onSubmit={handleAdd} className="bg-white dark:bg-[#0F252E] rounded-[2rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-[#0E1B22] dark:text-[#EAF2F4]">Add Blackout Date</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">Date</label>
            <input type="date" required value={newDate} onChange={(e) => setNewDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">Reason (optional)</label>
            <input type="text" value={newReason} onChange={(e) => setNewReason(e.target.value)} placeholder="e.g. Personal leave, Holiday..." className={inputCls} />
          </div>
        </div>
        <Button type="submit" disabled={saving || !newDate} className="bg-[#003366] text-white font-bold rounded-xl gap-2">
          <PlusCircle className="w-4 h-4" /> {saving ? "Adding..." : "Add Blackout Date"}
        </Button>
      </form>

      {/* Calendar View */}
      {loading ? (
        <div className="text-center py-12 text-sm text-[#4A5A62] dark:text-[#A9BCC2]">Loading availability...</div>
      ) : dates.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0F252E] rounded-[2rem] border border-[#E4E9EA] dark:border-[#20353D]">
          <CalendarX className="w-12 h-12 text-[#9AAAB0] mx-auto mb-4" />
          <h3 className="font-bold text-[#0E1B22] dark:text-[#EAF2F4] mb-1">No blackout dates set</h3>
          <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2]">You are currently showing as available on all dates.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(byMonth).map(([month, monthDates]) => (
            <div key={month} className="bg-white dark:bg-[#0F252E] rounded-[1.5rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm p-5">
              <h3 className="text-sm font-bold text-[#003366] dark:text-[#3FCFC0] mb-3">
                {new Date(month + "-01").toLocaleDateString("en-US", { year: "numeric", month: "long" })}
              </h3>
              <div className="space-y-2">
                {monthDates.map((d) => (
                  <div key={d.id} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                    <div className="flex items-center gap-3">
                      <CalendarX className="w-4 h-4 text-red-500 shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-[#0E1B22] dark:text-[#EAF2F4]">
                          {new Date(d.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </div>
                        {d.reason && <div className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">{d.reason}</div>}
                      </div>
                    </div>
                    <Button onClick={() => handleDelete(d.id)} disabled={deletingId === d.id} variant="ghost" className="shrink-0 text-xs font-bold rounded-xl gap-1 h-8 text-red-500 border-red-200 hover:bg-red-100 dark:hover:bg-red-950/30">
                      <Trash2 className="w-3.5 h-3.5" /> {deletingId === d.id ? "..." : "Remove"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
