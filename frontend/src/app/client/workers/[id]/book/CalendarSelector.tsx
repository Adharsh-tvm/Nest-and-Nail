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



const isSlotWithin12Hours = (dateKey: string, slotType: SlotType): boolean => {
  const slotDate = new Date(dateKey);
  let startHour = 9;
  if (slotType === SlotType.EVENING_HALF) {
    startHour = 14;
  }
  slotDate.setUTCHours(startHour, 0, 0, 0);
  return slotDate.getTime() < Date.now() + 12 * 60 * 60 * 1000;
};

export function CalendarSelector({
  selectedSlots,
  onSlotChange,
  availabilityData,
  numberOfDays,
  onMonthChange,
  viewYear,
  viewMonth,
  onViewChange,
}: CalendarSelectorProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
        (slot === SlotType.FULL_DAY && (!avail.fullDayAvailable || isSlotWithin12Hours(date, SlotType.FULL_DAY))) ||
        (slot === SlotType.MORNING_HALF && (!avail.morningAvailable || isSlotWithin12Hours(date, SlotType.MORNING_HALF))) ||
        (slot === SlotType.EVENING_HALF && (!avail.eveningAvailable || isSlotWithin12Hours(date, SlotType.EVENING_HALF)))
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

  const isDateUnavailable = (dateKey: string, availability: DateAvailabilitySummary | undefined) => {
    if (!availability) return false;
    if (availability.highlight === "red") return true;

    // Also mark as unavailable if ALL available slots for this date are blocked by the 12 hr rule.
    const morningBlocked = !availability.morningAvailable || isSlotWithin12Hours(dateKey, SlotType.MORNING_HALF);
    const eveningBlocked = !availability.eveningAvailable || isSlotWithin12Hours(dateKey, SlotType.EVENING_HALF);
    const fullDayBlocked = !availability.fullDayAvailable || isSlotWithin12Hours(dateKey, SlotType.FULL_DAY);

    if (morningBlocked && eveningBlocked && fullDayBlocked) {
       return true;
    }

    return false;
  };

  const getDayClass = (date: Date | null, isPast: boolean, isUnavailable: boolean) => {
    if (!date) return '';

    const key = toDateKey(date.getFullYear(), date.getMonth(), date.getDate());
    let classes = 'relative flex flex-col items-center justify-center p-1 rounded-lg transition-all h-10 w-full cursor-pointer ';

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
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
      {warningMessage && (
        <div className="mb-5 bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 text-sm font-bold text-center animate-in fade-in duration-300">
          {warningMessage}
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
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
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1 uppercase tracking-wider">
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
          const isUnavailable = isDateUnavailable(key, dayAvailability);

          return (
            <div
              key={key}
              className="flex items-center justify-center py-0.5"
              onClick={() => {
                if (isPast || isUnavailable) return;
                
                if (isDateSelected(dateObj)) {
                  if (focusedDate === key) {
                    // If already focused, clicking again toggles it off
                    const newSlots = { ...selectedSlots };
                    delete newSlots[key];
                    onSlotChange(newSlots);
                    setFocusedDate(null);
                  } else {
                    // Selected but not focused: open the slot picker to allow changing the slot!
                    setFocusedDate(key);
                  }
                } else {
                  if (numberOfDays > 1) {
                    let newSlots = { ...selectedSlots };
                    // If already fully selected, reset and start over from this click
                    if (Object.keys(newSlots).length >= numberOfDays) {
                      newSlots = {};
                    }
                    
                    const needed = numberOfDays - Object.keys(newSlots).length;
                    const current = new Date(dateObj);
                    
                    for (let i = 0; i < needed; i++) {
                       const cKey = toDateKey(current.getFullYear(), current.getMonth(), current.getDate());
                       const avail = availabilityData[cKey];
                       
                       const isPastCheck = current < today;
                       if (isPastCheck || isDateUnavailable(cKey, avail) || !avail?.fullDayAvailable || isSlotWithin12Hours(cKey, SlotType.FULL_DAY) || newSlots[cKey]) {
                           break; // Hit a blocked day, stop auto-selecting
                       }
                       
                       newSlots[cKey] = SlotType.FULL_DAY;
                       current.setDate(current.getDate() + 1);
                    }
                    
                    onSlotChange(newSlots);
                    setFocusedDate(null);
                  } else {
                    // Not selected. Focus it to show the panel.
                    setFocusedDate(key);
                  }
                }
              }}
            >
              <div className={getDayClass(dateObj, isPast, isUnavailable)}>
                <span className="text-sm">{day}</span>
                {/* Indicator Dots */}
                <div className="absolute bottom-1 flex gap-0.5">
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
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
          Full
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
          <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" />
          Half
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
          <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
          Busy
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
          <span className="w-2 h-2 rounded-full bg-gray-200 inline-block" />
          Free
        </div>
      </div>

      {/* Secondary Slot Picker Panel */}
      {focusedDate && availabilityData[focusedDate] && (
        <div className="mt-4 p-4 border-2 border-gray-900 rounded-xl bg-gray-50 animate-in slide-in-from-top-4 fade-in duration-300">
           <h4 className="text-xs font-bold text-gray-900 mb-2 flex items-center justify-between uppercase tracking-wider">
             <span>Slot for {new Date(focusedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
             <button onClick={() => setFocusedDate(null)} className="text-gray-400 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">✕</button>
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
               disabled={!availabilityData[focusedDate].morningAvailable || isSlotWithin12Hours(focusedDate, SlotType.MORNING_HALF)}
               className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border-2 flex flex-col items-center justify-center gap-1 relative overflow-hidden
                ${selectedSlots[focusedDate] === SlotType.MORNING_HALF 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                  : (!availabilityData[focusedDate].morningAvailable || isSlotWithin12Hours(focusedDate, SlotType.MORNING_HALF))
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'}`}
             >
                {isSlotWithin12Hours(focusedDate, SlotType.MORNING_HALF) && (
                  <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-[9px] px-1.5 py-0.5 rounded-bl-lg font-black uppercase">
                    &lt;12h
                  </div>
                )}
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
               disabled={!availabilityData[focusedDate].eveningAvailable || isSlotWithin12Hours(focusedDate, SlotType.EVENING_HALF)}
               className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border-2 flex flex-col items-center justify-center gap-1 relative overflow-hidden
                ${selectedSlots[focusedDate] === SlotType.EVENING_HALF 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                  : (!availabilityData[focusedDate].eveningAvailable || isSlotWithin12Hours(focusedDate, SlotType.EVENING_HALF))
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'}`}
             >
                {isSlotWithin12Hours(focusedDate, SlotType.EVENING_HALF) && (
                  <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-[9px] px-1.5 py-0.5 rounded-bl-lg font-black uppercase">
                    &lt;12h
                  </div>
                )}
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
               disabled={!availabilityData[focusedDate].fullDayAvailable || isSlotWithin12Hours(focusedDate, SlotType.FULL_DAY)}
               className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border-2 flex flex-col items-center justify-center gap-1 relative overflow-hidden
                ${selectedSlots[focusedDate] === SlotType.FULL_DAY 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                  : (!availabilityData[focusedDate].fullDayAvailable || isSlotWithin12Hours(focusedDate, SlotType.FULL_DAY))
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'}`}
             >
                {isSlotWithin12Hours(focusedDate, SlotType.FULL_DAY) && (
                  <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-[9px] px-1.5 py-0.5 rounded-bl-lg font-black uppercase">
                    &lt;12h
                  </div>
                )}
                <span>Full Day</span>
                <span className="text-xs font-medium opacity-80">(8-9 hrs)</span>
             </button>
           </div>
           
           <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 border-t border-gray-200 pt-3 gap-2">
             <span className="text-xs text-gray-500">Tip: You can also click the date cell again to deselect it.</span>
             {selectedSlots[focusedDate] && (
               <button 
                 onClick={() => {
                   const newSlots = { ...selectedSlots };
                   delete newSlots[focusedDate];
                   onSlotChange(newSlots);
                   setFocusedDate(null);
                 }}
                 className="text-red-600 hover:text-red-700 font-bold text-xs px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
               >
                 Remove Date
               </button>
             )}
           </div>
        </div>
      )}
    </div>
  );
}
