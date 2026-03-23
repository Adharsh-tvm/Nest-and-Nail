"use client";

import { useState, useCallback } from "react";
import { bookWorkerAction } from "@/app/actions/client/service-actions";
import { BookingPayload, BookingResult, SlotType } from "@/shared/types/serviceTypes";

export type BookingState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: BookingResult }
  | { status: "error"; message: string };

export function useBookWorker(refetchAvailability: () => Promise<any>) {
  const [bookingState, setBookingState] = useState<BookingState>({
    status: "idle",
  });

  const book = useCallback(
    async ({
      workerId,
      category,
      date,
      slotType,
      numberOfDays,
      title,
      description,
    }: {
      workerId: string;
      category: string;
      date: string;
      slotType: SlotType;
      numberOfDays?: number;
      title?: string;
      description?: string;
    }) => {
      setBookingState({ status: "loading" });

      // Re-fetch availability right before booking to catch race conditions
      const freshAvail = await refetchAvailability();

      if (freshAvail) {
        const slotKey =
          slotType === SlotType.HALF_DAY ? "halfDayAvailable" : "fullDayAvailable";
        if (!freshAvail[slotKey]) {
          setBookingState({
            status: "error",
            message: "Slot just got booked. Please select another slot.",
          });
          return;
        }
      }

      const payload: BookingPayload = { 
        workerId, category, date, slotType, numberOfDays, title, description 
      };
      const res = await bookWorkerAction(payload);

      if (!res.success || !res.data) {
        const errorMsg =
          res.error?.toLowerCase().includes("booked") ||
          res.error?.toLowerCase().includes("slot")
            ? "Slot just got booked. Please select another slot."
            : res.error || "Booking failed. Please try again.";

        setBookingState({ status: "error", message: errorMsg });
        return;
      }

      setBookingState({ status: "success", data: res.data });
    },
    [refetchAvailability]
  );

  const reset = useCallback(() => {
    setBookingState({ status: "idle" });
  }, []);

  return { bookingState, book, reset };
}
