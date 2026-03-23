"use client";

import { useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateAvailabilitySummary } from "@/shared/types/serviceTypes";

interface CalendarSelectorProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
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
  selectedDate,
  onDateSelect,
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

  const checkIsSelectedRange = (date: Date) => {
    if (!selectedDate) return false;

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + numberOfDays - 1);

    return d >= start && d <= end;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    const d1 = new Date(date);
    d1.setHours(0, 0, 0, 0);
    const d2 = new Date(selectedDate);
    d2.setHours(0, 0, 0, 0);
    return d1.getTime() === d2.getTime();
  };

  const getDayClass = (date: Date | null, isPast: boolean) => {
    if (!date) return '';

    let classes = 'relative flex flex-col items-center justify-center p-2 rounded-xl transition-all h-14 w-full cursor-pointer ';

    if (isPast) {
      return classes + 'text-gray-300 cursor-not-allowed bg-gray-50/50';
    }

    const isSelectedStart = isDateSelected(date);
    const isInRange = checkIsSelectedRange(date);

    if (isSelectedStart && numberOfDays === 1) {
      classes += 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-200 ring-2 ring-emerald-600 ring-offset-2 z-10 rounded-xl';
    } else if (isSelectedStart) {
      classes += 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-200 z-10 rounded-l-xl rounded-r-none';
    } else if (isInRange) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const end = new Date(selectedDate!);
      end.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() + numberOfDays - 1);
      if (d.getTime() === end.getTime()) {
        classes += 'bg-emerald-100 text-emerald-800 font-bold border-y-2 border-r-2 border-emerald-200 z-0 rounded-r-xl rounded-l-none';
      } else {
        classes += 'bg-emerald-100 text-emerald-800 font-bold border-y-2 border-emerald-200 z-0 rounded-none';
      }
    } else {
      classes += 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium active:scale-95 border border-transparent hover:border-emerald-100';
    }

    return classes;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
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

          return (
            <div
              key={key}
              className="flex items-center justify-center py-0.5"
              onClick={() => !isPast && onDateSelect(dateObj)}
            >
              <div className={getDayClass(dateObj, isPast)}>
                {day}
                {/* Indicator Dots */}
                {(!checkIsSelectedRange(dateObj) || isDateSelected(dateObj)) && (
                  <div className="absolute bottom-1.5 flex gap-1">
                    {dayAvailability ? (
                      <div className={`w-1.5 h-1.5 rounded-full ${isDateSelected(dateObj) ? 'bg-white/80' :
                        dayAvailability.highlight === 'red' ? 'bg-red-400' :
                          dayAvailability.highlight === 'yellow' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
          Available
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
          Limited
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
          Fully booked
        </div>
      </div>
    </div>
  );
}
