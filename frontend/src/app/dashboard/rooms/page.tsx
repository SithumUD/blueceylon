"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Edit2, Trash2, BedDouble, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMyRooms, createRoom, updateRoom, deleteRoom } from "@/lib/api/catalog";
import type { Room, RoomType, ViewType, Currency } from "@/lib/mock-data/businesses";

const ROOM_TYPES: RoomType[] = ["STANDARD", "DELUXE", "SUPERIOR", "SUITE", "PENTHOUSE", "FAMILY", "CONNECTING", "ACCESSIBLE"];
const VIEW_TYPES: ViewType[] = ["LAKE_VIEW", "MOUNTAIN_VIEW", "GARDEN_VIEW", "POOL_VIEW", "OCEAN_VIEW", "CITY_VIEW", "NO_VIEW"];
const CURRENCIES: Currency[] = ["LKR", "USD", "EUR", "GBP"];
const BLANK: Partial<Room> = { roomNumber: "", roomType: "STANDARD", displayName: "", pricePerNight: 0, currency: "USD", capacity: 2, bedCount: 1, totalUnits: 1, viewType: "GARDEN_VIEW", bedConfiguration: "1 Queen Bed", smokingAllowed: false, isHourlyBookable: false, imageUrls: [], amenities: [] };

export default function RoomsManagePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Room>>(BLANK);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => { setLoading(true); try { setRooms(await getMyRooms() || []); } catch { setRooms([]); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditingId(null); setForm(BLANK); setShowForm(true); setError(null); setSuccess(null); };
  const openEdit = (r: Room) => { setEditingId(r.id); setForm({ ...r }); setShowForm(true); setError(null); setSuccess(null); };
  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(BLANK); };
  const set = (k: keyof Room, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError(null);
    try {
      if (editingId) { await updateRoom(editingId, form); setSuccess("Room updated!"); }
      else { await createRoom(form); setSuccess("Room created!"); }
      closeForm(); await load();
    } catch (err: any) { setError(err.message || "Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try { await deleteRoom(id); setRooms((p) => p.filter((r) => r.id !== id)); setSuccess("Room deleted."); }
    catch { setError("Delete failed."); }
    finally { setDeletingId(null); }
  };

  const inputCls = "w-full p-2.5 rounded-xl border border-[#E4E9EA] dark:border-[#20353D] bg-gray-50 dark:bg-[#15323D] text-sm text-[#0E1B22] dark:text-[#EAF2F4] focus:outline-none focus:ring-2 focus:ring-[#003366]";

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>Room Manager</h1>
          <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] mt-1">Create, edit, and remove rooms from your hotel listing.</p>
        </div>
        <Button onClick={openCreate} className="bg-[#003366] text-white font-bold rounded-xl gap-2"><PlusCircle className="w-4 h-4" /> Add New Room</Button>
      </div>

      {success && <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-semibold px-4 py-3 rounded-xl"><Check className="w-4 h-4" /> {success}</div>}
      {error && <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl"><X className="w-4 h-4" /> {error}</div>}

      {showForm && (
        <form onSubmit={handleSave} className="bg-white dark:bg-[#0F252E] rounded-[2rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0E1B22] dark:text-[#EAF2F4]">{editingId ? "Edit Room" : "Add New Room"}</h2>
            <button type="button" onClick={closeForm} className="text-[#4A5A62] hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {([["Room Number","roomNumber","text",true],["Display Name","displayName","text",true],["Price Per Night","pricePerNight","number",true],["Capacity (guests)","capacity","number",true],["Bed Count","bedCount","number",true],["Bed Configuration","bedConfiguration","text",true],["Total Units","totalUnits","number",true],["Size (m²)","sizeSquareMeters","number",false]] as [string,string,string,boolean][]).map(([label,key,type,req]) => (
              <div key={key}>
                <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">{label}</label>
                <input type={type} required={req} value={(form as any)[key] ?? ""} onChange={(e) => set(key as any, type === "number" ? Number(e.target.value) : e.target.value)} className={inputCls} />
              </div>
            ))}
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">Room Type</label>
              <select value={form.roomType ?? "STANDARD"} onChange={(e) => set("roomType", e.target.value)} className={inputCls}>
                {ROOM_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g," ")}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">View Type</label>
              <select value={form.viewType ?? "GARDEN_VIEW"} onChange={(e) => set("viewType", e.target.value)} className={inputCls}>
                {VIEW_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g," ")}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] block mb-1">Currency</label>
              <select value={form.currency ?? "USD"} onChange={(e) => set("currency", e.target.value)} className={inputCls}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-[#4A5A62] dark:text-[#A9BCC2] font-semibold cursor-pointer">
              <input type="checkbox" checked={!!form.smokingAllowed} onChange={(e) => set("smokingAllowed", e.target.checked)} className="w-4 h-4 rounded accent-[#008080]" /> Smoking Allowed
            </label>
            <label className="flex items-center gap-2 text-sm text-[#4A5A62] dark:text-[#A9BCC2] font-semibold cursor-pointer">
              <input type="checkbox" checked={!!form.isHourlyBookable} onChange={(e) => set("isHourlyBookable", e.target.checked)} className="w-4 h-4 rounded accent-[#008080]" /> Hourly Bookable
            </label>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving} className="bg-[#003366] text-white font-bold rounded-xl px-6">{saving ? "Saving..." : editingId ? "Update Room" : "Create Room"}</Button>
            <Button type="button" variant="ghost" onClick={closeForm} className="rounded-xl font-semibold">Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-sm text-[#4A5A62] dark:text-[#A9BCC2]">Loading rooms...</div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0F252E] rounded-[2rem] border border-[#E4E9EA] dark:border-[#20353D]">
          <BedDouble className="w-12 h-12 text-[#9AAAB0] mx-auto mb-4" />
          <h3 className="font-bold text-[#0E1B22] dark:text-[#EAF2F4] mb-1">No rooms yet</h3>
          <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2]">Click "Add New Room" to create your first listing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white dark:bg-[#0F252E] rounded-[1.5rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#008080] dark:text-[#3FCFC0] bg-[#008080]/10 px-2 py-0.5 rounded-full">{room.roomType?.replace(/_/g," ")}</span>
                  <h3 className="font-bold text-[#0E1B22] dark:text-[#EAF2F4] mt-1.5 text-sm">{room.displayName || `Room #${room.roomNumber}`}</h3>
                  <p className="text-xs text-[#4A5A62] dark:text-[#A9BCC2]">#{room.roomNumber} · {room.viewType?.replace(/_/g," ")}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-black text-[#003366] dark:text-[#3FCFC0]">{room.currency} {room.pricePerNight?.toLocaleString()}</div>
                  <div className="text-[10px] text-[#4A5A62] dark:text-[#A9BCC2]">per night</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-[#4A5A62] dark:text-[#A9BCC2]">
                <span className="bg-gray-100 dark:bg-[#15323D] px-2 py-0.5 rounded-full">👥 {room.capacity} guests</span>
                <span className="bg-gray-100 dark:bg-[#15323D] px-2 py-0.5 rounded-full">🛏 {room.bedConfiguration}</span>
                <span className="bg-gray-100 dark:bg-[#15323D] px-2 py-0.5 rounded-full">🏠 {room.totalUnits} unit{room.totalUnits > 1 ? "s" : ""}</span>
                {room.isHourlyBookable && <span className="bg-[#FDA301]/10 text-[#FDA301] px-2 py-0.5 rounded-full">⏰ Hourly</span>}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button onClick={() => openEdit(room)} variant="ghost" className="flex-1 text-xs font-bold rounded-xl gap-1.5 h-8"><Edit2 className="w-3.5 h-3.5" /> Edit</Button>
                <Button onClick={() => handleDelete(room.id)} disabled={deletingId === room.id} variant="ghost" className="flex-1 text-xs font-bold rounded-xl gap-1.5 h-8 text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20">
                  <Trash2 className="w-3.5 h-3.5" /> {deletingId === room.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
