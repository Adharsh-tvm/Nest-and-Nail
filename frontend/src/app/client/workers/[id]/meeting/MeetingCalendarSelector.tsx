"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SlotType, SLOT_LABELS, SLOT_DURATION_LABEL } from "@/shared/types/serviceTypes";

interface MeetingCalendarSelectorProps {
  selectedSlots: Record<string, SlotType>;
  onSlotChange: (slots: Record<string, SlotType>) => void;
  isLoadingDate: boolean;
  onMonthChange?: (fromDate: Date) => void;
  viewYear: number;
  viewMonth: number;
  availabilityData?: Record<string, { isBooked?: boolean; bookedSlots?: string[] }>;
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
  let startMinute = 0;

  if (slotType.toString().startsWith("VIDEO_")) {
    const parts = slotType.toString().split("_");
    if (parts.length >= 3) {
      startHour = parseInt(parts[1], 10);
      startMinute = parseInt(parts[2], 10);
    }
  }

  slotDate.setUTCHours(startHour, startMinute, 0, 0);
  return slotDate.getTime() < Date.now() + 12 * 60 * 60 * 1000;
};

const meetingSlots = [
  SlotType.VIDEO_SLOT_1,
  SlotType.VIDEO_SLOT_2,
  SlotType.VIDEO_SLOT_3,
  SlotType.VIDEO_SLOT_4,
];

export function MeetingCalendarSelector({
  selectedSlots,
  onSlotChange,
  onMonthChange,
  viewYear,
  viewMonth,
  availabilityData = {},
  onViewChange,
}: MeetingCalendarSelectorProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const [focusedDate, setFocusedDate] = useState<string | null>(null);

  const cells = useMemo(() => {
    const arr: Array<number | null> = [];
    for (let i = 0; i < firstDayOfMonth; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
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
    return 'bg-emerald-500 text-white font-bold ring-2 ring-emerald-500 ring-offset-2 shadow-md shadow-emerald-200 z-10';
  };

  const getDayClass = (date: Date | null, isPast: boolean) => {
    if (!date) return '';

    const key = toDateKey(date.getFullYear(), date.getMonth(), date.getDate());
    let classes = 'relative flex flex-col items-center justify-center p-2 rounded-xl transition-all h-14 w-full cursor-pointer ';

    if (isPast) {
      return classes + 'text-gray-300 cursor-not-allowed bg-gray-50/50';
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
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={goToPrev}
          disabled={isPastMonth}
          className={`p-2 rounded-xl transition-colors ${isPastMonth
              ? "text-gray-200 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-base font-bold text-gray-900 tracking-tight">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </h3>
        <button
          onClick={goToNext}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} />;
          }

          const key = toDateKey(viewYear, viewMonth, day);
          const dateObj = new Date(viewYear, viewMonth, day);
          const isPast = dateObj < today;

          return (
            <div
              key={key}
              className="flex items-center justify-center py-0.5"
              onClick={() => {
                if (isPast) return;
                if (isDateSelected(dateObj)) {
                  onSlotChange({});
                  if (focusedDate === key) setFocusedDate(null);
                } else {
                  setFocusedDate(key);
                }
              }}
            >
              <div className={getDayClass(dateObj, isPast)}>
                {day}
                <div className="absolute bottom-1.5 flex gap-1">
                  {isDateSelected(dateObj) ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {focusedDate && (
        <div className="mt-6 p-5 border-2 border-gray-900 rounded-2xl bg-gray-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
            <span>Select Meeting Slot for {new Date(focusedDate).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
            <button onClick={() => setFocusedDate(null)} className="text-gray-400 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {meetingSlots.map(slotType => {
              const isSelected = selectedSlots[focusedDate] === slotType;
              const isTooSoon = isSlotWithin12Hours(focusedDate, slotType);
              const slotData = availabilityData[focusedDate];
              const isBooked = slotData?.bookedSlots?.includes(slotType) || false;

              const isDisabled = isTooSoon || isBooked;

              return (
                <button
                  key={slotType}
                  onClick={() => {
                    if (isDisabled) return;
                    const newSlots = { [focusedDate]: slotType };
                    onSlotChange(newSlots);
                    setFocusedDate(null);
                  }}
                  disabled={isDisabled}
                  className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border-2 flex flex-col items-center justify-center gap-1 relative overflow-hidden
                        ${isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : isDisabled
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'}`}
                >
                  {isTooSoon && !isBooked && (
                    <div className="absolute top-0 right-0 bg-amber-100 text-amber-600 text-[9px] px-1.5 py-0.5 rounded-bl-lg font-black uppercase">
                      &lt;12h
                    </div>
                  )}
                  {isBooked && (
                    <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-[9px] px-1.5 py-0.5 rounded-bl-lg font-black flex items-center justify-center w-full">
                      BOOKED
                    </div>
                  )}
                  <span>{SLOT_LABELS[slotType]}</span>
                  <span className="text-xs font-medium opacity-80">({SLOT_DURATION_LABEL[slotType]})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
