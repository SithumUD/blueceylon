"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Check } from "lucide-react";

interface DateRangePickerProps {
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  onChange: (range: { checkIn: string; checkOut: string }) => void;
  className?: string;
}

export function DateRangePicker({ checkInDate, checkOutDate, onChange, className = "" }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse YYYY-MM-DD or default to null
  const parseDate = (str: string): Date | null => {
    if (!str) return null;
    const [y, m, d] = str.split("-").map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  };

  const formatDateStr = (date: Date | null): string => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const formatDisplay = (str: string): string => {
    const d = parseDate(str);
    if (!d) return "";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const startD = parseDate(checkInDate);
  const endD = parseDate(checkOutDate);

  // Month navigation state (defaults to checkIn month or current month)
  const [currentMonth, setCurrentMonth] = useState<Date>(() => startD || new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calendar math
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDateClick = (dayNum: number) => {
    const selected = new Date(year, month, dayNum);

    if (!startD || (startD && endD)) {
      // Set new start date, clear end date
      onChange({ checkIn: formatDateStr(selected), checkOut: "" });
    } else if (startD && !endD) {
      if (selected < startD) {
        // Clicked earlier date -> make it new start date
        onChange({ checkIn: formatDateStr(selected), checkOut: "" });
      } else {
        // Clicked date after start -> set end date and close
        onChange({ checkIn: formatDateStr(startD), checkOut: formatDateStr(selected) });
        setIsOpen(false);
      }
    }
  };

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isInRange = (date: Date) => {
    if (startD && endD) {
      return date > startD && date < endD;
    }
    if (startD && !endD && hoverDate) {
      return date > startD && date < hoverDate;
    }
    return false;
  };

  // Calculate nights count
  const calculateNights = (): number => {
    if (!startD || !endD) return 0;
    const diffTime = Math.abs(endD.getTime() - startD.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div ref={containerRef} className={`relative z-[100] ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-2xl bg-gray-50 dark:bg-[#15323D] border border-gray-200 dark:border-gray-700 hover:border-[#008080] dark:hover:border-[#3FCFC0] transition-colors text-left"
      >
        <CalendarIcon className="w-5 h-5 text-[#008080] shrink-0" />
        <div className="flex flex-col w-full overflow-hidden">
          <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5A62] dark:text-[#A9BCC2] cursor-pointer">
            Check In & Out
          </label>
          <div className="text-xs font-semibold text-[#0E1B22] dark:text-[#EAF2F4] truncate">
            {startD && endD ? (
              <span className="text-[#008080] dark:text-[#3FCFC0] font-bold">
                {formatDisplay(checkInDate)} – {formatDisplay(checkOutDate)} {nights > 0 ? `(${nights} ${nights === 1 ? "Night" : "Nights"})` : ""}
              </span>
            ) : startD ? (
              <span>
                {formatDisplay(checkInDate)} – <span className="text-gray-400 italic">Select Check Out</span>
              </span>
            ) : (
              <span className="text-gray-400 font-normal">Select Check-in & Check-out</span>
            )}
          </div>
        </div>
      </button>

      {/* Popover Calendar Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-[9999] w-80 sm:w-88 p-4 rounded-3xl bg-white dark:bg-[#0F252E] shadow-2xl border border-[#E4E9EA] dark:border-[#20353D] space-y-4 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Calendar Header / Month Nav */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-[#20353D]">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="font-display font-bold text-sm text-[#0E1B22] dark:text-[#EAF2F4]">
              {monthNames[month]} {year}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <span key={day} className="text-[11px] font-bold text-gray-400 uppercase">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-1 text-center">
            {/* Empty slots for month start padding */}
            {[...Array(firstDayOfMonth)].map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Month Day Numbers */}
            {[...Array(daysInMonth)].map((_, i) => {
              const dayNum = i + 1;
              const thisDate = new Date(year, month, dayNum);
              const isStart = isSameDay(thisDate, startD);
              const isEnd = isSameDay(thisDate, endD);
              const inRange = isInRange(thisDate);

              let buttonStyle = "hover:bg-[#008080]/15 text-[#0E1B22] dark:text-[#EAF2F4]";
              if (isStart || isEnd) {
                buttonStyle = "bg-[#008080] text-white font-bold shadow-md shadow-[#008080]/30 scale-105 z-10";
              } else if (inRange) {
                buttonStyle = "bg-[#008080]/20 text-[#008080] dark:text-[#3FCFC0] font-semibold";
              }

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleDateClick(dayNum)}
                  onMouseEnter={() => setHoverDate(thisDate)}
                  className={`h-9 w-full rounded-lg text-xs transition-all flex items-center justify-center relative ${buttonStyle}`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Selection Hint & Footer Actions */}
          <div className="pt-2 border-t border-gray-100 dark:border-[#20353D] flex items-center justify-between">
            <div className="text-[11px] text-[#008080] dark:text-[#3FCFC0] font-semibold">
              {!startD ? "Click Check-in Date" : !endD ? "Click Check-out Date" : `${nights} Nights Selected`}
            </div>

            <div className="flex items-center gap-2">
              {(startD || endD) && (
                <button
                  type="button"
                  onClick={() => onChange({ checkIn: "", checkOut: "" })}
                  className="text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors px-2 py-1"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 rounded-xl bg-[#008080] text-white text-xs font-bold shadow-sm hover:bg-[#006666] transition-colors"
              >
                Apply
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
