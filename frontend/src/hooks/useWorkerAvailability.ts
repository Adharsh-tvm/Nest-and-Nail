"use client";

import { useState, useRef, useCallback } from "react";
import { getWorkerAvailabilityAction } from "@/app/actions/client/service-actions";
import {
  DateAvailabilitySummary,
  SlotAvailability,
} from "@/shared/types/serviceTypes";

function toDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

function computeHighlight(
  avail: SlotAvailability
): DateAvailabilitySummary["highlight"] {
  if (avail.halfDayAvailable && avail.fullDayAvailable) return "green";
  if (!avail.halfDayAvailable && !avail.fullDayAvailable) return "red";
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
    Map<string, DateAvailabilitySummary["highlight"]>
  >(new Map());
  const [isPrefetching, setIsPrefetching] = useState(false);

  /** Pre-fetch next N days availability for calendar highlights */
  const prefetchDays = useCallback(
    async (fromDate: Date, days = 30) => {
      setIsPrefetching(true);
      const dates: string[] = [];
      for (let i = 0; i < days; i++) {
        const d = new Date(fromDate);
        d.setDate(d.getDate() + i);
        const key = toDateKey(d);
        if (!cache.current.has(key)) {
          // Immediately mark as loading in cache to prevent duplicate queued requests
          cache.current.set(key, { pending: true } as any);
          dates.push(key);
        }
      }

      // Fetch sequentially to avoid locking the dev server / browser connection pool
      for (const date of dates) {
         try {
           const res = await getWorkerAvailabilityAction(workerId, date);
           if (res.success && res.data) {
              const avail = res.data;
              const highlight = computeHighlight(avail);
              const summary: DateAvailabilitySummary = {
                date,
                halfDayAvailable: avail.halfDayAvailable,
                fullDayAvailable: avail.fullDayAvailable,
                highlight,
              };
              cache.current.set(date, summary);
              
              setCalendarHighlights((prev) => {
                const map = new Map(prev);
                map.set(date, highlight);
                return map;
              });
           } else {
             // Cache as failed so we don't infinitely retry
             cache.current.set(date, { failed: true } as any);
           }
         } catch (e) {
           cache.current.set(date, { failed: true } as any);
         }
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
          halfDayAvailable: cached.halfDayAvailable,
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
        halfDayAvailable: avail.halfDayAvailable,
        fullDayAvailable: avail.fullDayAvailable,
        highlight,
      };
      cache.current.set(dateStr, summary);

      // Update calendar highlights too
      setCalendarHighlights((prev) => {
        const next = new Map(prev);
        next.set(dateStr, highlight);
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
