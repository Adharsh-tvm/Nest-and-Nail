"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateAvailabilitySummary, SlotType } from "@/shared/types/serviceTypes";

interface CalendarSelectorProps {
  selectedSlots: Record<string, SlotType>;
  onSlotChange: (slots: Record<string, SlotType>) => void;
  availabilityData: Record<string, DateAvailabilitySummary>;
  isLoadingDate: boolean;
  numberOfDays: number;
  onMonthChange?: (fromDate: Date) => void;
  viewYear: number;
  viewMonth: number; // 0-indexed
  onViewChange: (year: number, month: number) => void;
}

function toDateKey(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HIGHLIGHT_CLASSES: Record<string, string> = {
  green: "bg-emerald-500 text-white",
  yellow: "bg-amber-400 text-white",
  red: "bg-red-400 text-white",
};

const HIGHLIGHT_DOT: Record<string, string> = {
  green: "bg-emerald-400",
  yellow: "bg-amber-400",
  red: "bg-red-400",
};

export function CalendarSelector({
  selectedSlots,
  onSlotChange,
  availabilityData,
  isLoadingDate,
  numberOfDays,
  onMonthChange,
  viewYear,
  viewMonth,
  onViewChange,
}: CalendarSelectorProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const [focusedDate, setFocusedDate] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Re-check selected dates if availability updates behind the scenes
  useEffect(() => {
    let changed = false;
    const newSlots = { ...selectedSlots };
    
    Object.keys(newSlots).forEach((date) => {
      const avail = availabilityData[date];
      if (!avail) return;
      
      const slot = newSlots[date];
      if (
        avail.highlight === "red" ||
        (slot === SlotType.FULL_DAY && !avail.fullDayAvailable) ||
        (slot === SlotType.MORNING_HALF && !avail.morningAvailable) ||
        (slot === SlotType.EVENING_HALF && !avail.eveningAvailable)
      ) {
        delete newSlots[date];
        changed = true;
      }
    });

    if (changed) {
      onSlotChange(newSlots);
      setWarningMessage("Some selected dates are unavailable and were removed.");
      setTimeout(() => setWarningMessage(null), 5000);
    }
  }, [availabilityData, selectedSlots, onSlotChange]);

  const cells = useMemo(() => {
    const arr: Array<number | null> = [];
    for (let i = 0; i < firstDayOfMonth; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    // Pad to multiples of 7
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [firstDayOfMonth, daysInMonth]);

  const goToPrev = () => {
    const prev = viewMonth === 0 ? { year: viewYear - 1, month: 11 } : { year: viewYear, month: viewMonth - 1 };
    onViewChange(prev.year, prev.month);
    onMonthChange?.(new Date(prev.year, prev.month, 1));
  };

  const goToNext = () => {
    const next = viewMonth === 11 ? { year: viewYear + 1, month: 0 } : { year: viewYear, month: viewMonth + 1 };
    onViewChange(next.year, next.month);
    onMonthChange?.(new Date(next.year, next.month, 1));
  };

  const isPastMonth =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth < today.getMonth());

  const isDateSelected = (date: Date) => {
    const key = toDateKey(date.getFullYear(), date.getMonth(), date.getDate());
    return !!selectedSlots[key];
  };

  const getSlotSelectionClass = (date: Date) => {
    const key = toDateKey(date.getFullYear(), date.getMonth(), date.getDate());
    const slot = selectedSlots[key];
    if (!slot) return '';
    if (slot === SlotType.FULL_DAY) {
      return 'bg-emerald-500 text-white font-bold ring-2 ring-emerald-500 ring-offset-2 shadow-md shadow-emerald-200 z-10';
    } else {
      return 'bg-amber-400 text-white font-bold ring-2 ring-amber-400 ring-offset-2 shadow-md shadow-amber-200 z-10';
    }
  };

  const isDateUnavailable = (availability: DateAvailabilitySummary | undefined) => {
    if (!availability) return false;
    if (availability.highlight === "red") return true;
    return false;
  };

  const getDayClass = (date: Date | null, isPast: boolean, isUnavailable: boolean) => {
    if (!date) return '';

    const key = toDateKey(date.getFullYear(), date.getMonth(), date.getDate());
    let classes = 'relative flex flex-col items-center justify-center p-2 rounded-xl transition-all h-14 w-full cursor-pointer ';

    if (isPast) {
      return classes + 'text-gray-300 cursor-not-allowed bg-gray-50/50';
    }
    if (isUnavailable) {
      return classes + 'text-red-400 cursor-not-allowed bg-red-50';
    }

    const isSelected = isDateSelected(date);
    const isFocused = focusedDate === key;

    if (isSelected) {
      classes += `${getSlotSelectionClass(date)} rounded-xl`;
      if (isFocused) classes += ' ring-4 ring-emerald-400';
    } else {
      classes += 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium active:scale-95 border border-transparent hover:border-emerald-100';
      if (isFocused) classes += ' ring-2 ring-gray-900 ring-offset-1 rounded-xl font-bold bg-gray-50';
    }

    return classes;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      {warningMessage && (
        <div className="mb-5 bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 text-sm font-bold text-center animate-in fade-in duration-300">
          {warningMessage}
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={goToPrev}
          disabled={isPastMonth}
          className={`p-2 rounded-xl transition-colors ${
            isPastMonth
              ? "text-gray-200 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          }`}
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-gray-900 tracking-tight">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </h3>

        <button
          onClick={goToNext}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day Cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} />;
          }

          const key = toDateKey(viewYear, viewMonth, day);
          const dateObj = new Date(viewYear, viewMonth, day);
          const isPast = dateObj < today;
          const dayAvailability = availabilityData[key];
          const isUnavailable = isDateUnavailable(dayAvailability);

          return (
            <div
              key={key}
              className="flex items-center justify-center py-0.5"
              onClick={() => {
                if (isPast || isUnavailable) return;
                
                if (isDateSelected(dateObj)) {
                  // If already selected, clicking the DATE toggles it off
                  const newSlots = { ...selectedSlots };
                  delete newSlots[key];
                  onSlotChange(newSlots);
                  if (focusedDate === key) setFocusedDate(null);
                } else {
                  // Not selected. Focus it to show the panel.
                  setFocusedDate(key);
                }
              }}
            >
              <div className={getDayClass(dateObj, isPast, isUnavailable)}>
                {day}
                {/* Indicator Dots */}
                <div className="absolute bottom-1.5 flex gap-1">
                  {isDateSelected(dateObj) ? (
                     <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                  ) : isUnavailable ? (
                     <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  ) : (
                     <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
          Selected (Full)
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-md bg-amber-400 inline-block" />
          Selected (Half)
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
          Fully booked
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-200 inline-block" />
          Available
        </div>
      </div>

      {/* Secondary Slot Picker Panel */}
      {focusedDate && availabilityData[focusedDate] && (
        <div className="mt-6 p-5 border-2 border-gray-900 rounded-2xl bg-gray-50 animate-in slide-in-from-top-4 fade-in duration-300">
           <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
             <span>Select Slot for {new Date(focusedDate).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
             <button onClick={() => setFocusedDate(null)} className="text-gray-400 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
           </h4>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
             <button
               onClick={() => {
                 const newSlots = { ...selectedSlots };
                 if (Object.keys(newSlots).length >= numberOfDays && !newSlots[focusedDate]) {
                    alert(`You have already selected ${numberOfDays} day(s). Deselect a date first.`);
                    return;
                 }
                 newSlots[focusedDate] = SlotType.MORNING_HALF;
                 onSlotChange(newSlots);
               }}
               disabled={!availabilityData[focusedDate].morningAvailable}
               className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border-2 flex flex-col items-center justify-center gap-1 
                ${selectedSlots[focusedDate] === SlotType.MORNING_HALF 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                  : !availabilityData[focusedDate].morningAvailable 
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'}`}
             >
                <span>Morning</span>
                <span className="text-xs font-medium opacity-80">(4-5 hrs)</span>
             </button>

             <button
               onClick={() => {
                 const newSlots = { ...selectedSlots };
                 if (Object.keys(newSlots).length >= numberOfDays && !newSlots[focusedDate]) {
                    alert(`You have already selected ${numberOfDays} day(s). Deselect a date first.`);
                    return;
                 }
                 newSlots[focusedDate] = SlotType.EVENING_HALF;
                 onSlotChange(newSlots);
               }}
               disabled={!availabilityData[focusedDate].eveningAvailable}
               className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border-2 flex flex-col items-center justify-center gap-1 
                ${selectedSlots[focusedDate] === SlotType.EVENING_HALF 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                  : !availabilityData[focusedDate].eveningAvailable
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'}`}
             >
                <span>Evening</span>
                <span className="text-xs font-medium opacity-80">(4-5 hrs)</span>
             </button>

             <button
               onClick={() => {
                 const newSlots = { ...selectedSlots };
                 if (Object.keys(newSlots).length >= numberOfDays && !newSlots[focusedDate]) {
                    alert(`You have already selected ${numberOfDays} day(s). Deselect a date first.`);
                    return;
                 }
                 newSlots[focusedDate] = SlotType.FULL_DAY;
                 onSlotChange(newSlots);
               }}
               disabled={!availabilityData[focusedDate].fullDayAvailable}
               className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border-2 flex flex-col items-center justify-center gap-1 
                ${selectedSlots[focusedDate] === SlotType.FULL_DAY 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                  : !availabilityData[focusedDate].fullDayAvailable
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'}`}
             >
                <span>Full Day</span>
                <span className="text-xs font-medium opacity-80">(8-9 hrs)</span>
             </button>
           </div>
        </div>
      )}
    </div>
  );
}
