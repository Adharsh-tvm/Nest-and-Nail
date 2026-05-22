"use client";

import { useState, useRef, useCallback } from "react";
import { getWorkerAvailabilityAction, getWorkerAvailabilityBulkAction } from "@/app/actions/client/service-actions";
import {
  DateAvailabilitySummary,
  SlotAvailability,
} from "@/shared/types/serviceTypes";

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function computeHighlight(
  avail: SlotAvailability
): DateAvailabilitySummary["highlight"] {
  if (avail.morningAvailable && avail.eveningAvailable && avail.fullDayAvailable) return "green";
  if (!avail.morningAvailable && !avail.eveningAvailable && !avail.fullDayAvailable) return "red";
  return "yellow";
}

export function useWorkerAvailability(workerId: string) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentAvailability, setCurrentAvailability] =
    useState<SlotAvailability | null>(null);
  const [isLoadingDate, setIsLoadingDate] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  // Cache: date string -> DateAvailabilitySummary
  const cache = useRef<Map<string, DateAvailabilitySummary>>(new Map());

  // Pre-fetched highlights for 7 days (used by calendar)
  const [calendarHighlights, setCalendarHighlights] = useState<
    Map<string, DateAvailabilitySummary>
  >(new Map());
  const [isPrefetching, setIsPrefetching] = useState(false);

  const prefetchDays = useCallback(
    async (fromDate: Date, days = 35) => {
      setIsPrefetching(true);

      const startDate = new Date(fromDate);
      const endDate = new Date(fromDate);
      endDate.setDate(endDate.getDate() + days - 1);
      
      const startStr = toDateKey(startDate);
      const endStr = toDateKey(endDate);

      try {
           const res = await getWorkerAvailabilityBulkAction(workerId, startStr, endStr);
           if (res.success && res.data) {
              const bulkData = res.data;
              setCalendarHighlights((prev) => {
                 const map = new Map(prev);
                 Object.entries(bulkData).forEach(([date, avail]) => {
                    const highlight = computeHighlight(avail);
                    const summary: DateAvailabilitySummary = {
                      date,
                      morningAvailable: avail.morningAvailable,
                      eveningAvailable: avail.eveningAvailable,
                      fullDayAvailable: avail.fullDayAvailable,
                      highlight,
                      bookedSlots: avail.bookedSlots,
                    };
                    cache.current.set(date, summary);
                    map.set(date, summary);
                 });
                 return map;
              });
           }
      } catch (e) {
          console.error("Bulk fetch error", e);
      }

      setIsPrefetching(false);
    },
    [workerId]
  );

  /** Select a date and load its availability */
  const selectDate = useCallback(
    async (dateStr: string) => {
      setSelectedDate(dateStr);
      setDateError(null);

      // Use cache if available
      if (cache.current.has(dateStr)) {
        const cached = cache.current.get(dateStr)!;
        setCurrentAvailability({
          morningAvailable: cached.morningAvailable,
          eveningAvailable: cached.eveningAvailable,
          fullDayAvailable: cached.fullDayAvailable,
        });
        return;
      }

      setIsLoadingDate(true);
      setCurrentAvailability(null);

      const res = await getWorkerAvailabilityAction(workerId, dateStr);

      if (!res.success || !res.data) {
        setDateError(res.error || "Could not load availability");
        setIsLoadingDate(false);
        return;
      }

      const avail = res.data;
      const highlight = computeHighlight(avail);
      const summary: DateAvailabilitySummary = {
        date: dateStr,
        morningAvailable: avail.morningAvailable,
        eveningAvailable: avail.eveningAvailable,
        fullDayAvailable: avail.fullDayAvailable,
        highlight,
        bookedSlots: avail.bookedSlots,
      };
      cache.current.set(dateStr, summary);

      // Update calendar highlights too
      setCalendarHighlights((prev) => {
        const next = new Map(prev);
        next.set(dateStr, summary);
        return next;
      });

      setCurrentAvailability(avail);
      setIsLoadingDate(false);
    },
    [workerId]
  );

  /** Re-fetch current date (used before booking to avoid race conditions) */
  const refetchCurrentDate = useCallback(async (): Promise<SlotAvailability | null> => {
    if (!selectedDate) return null;
    // Bypass cache for fresh check
    cache.current.delete(selectedDate);
    const res = await getWorkerAvailabilityAction(workerId, selectedDate);
    if (!res.success || !res.data) return null;
    setCurrentAvailability(res.data);
    return res.data;
  }, [workerId, selectedDate]);

  return {
    selectedDate,
    currentAvailability,
    isLoadingDate,
    dateError,
    calendarHighlights,
    isPrefetching,
    selectDate,
    prefetchDays,
    refetchCurrentDate,
  };
}
