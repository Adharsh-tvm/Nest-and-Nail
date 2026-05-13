"use client";

import { useState, useCallback } from "react";
import { bookWorkerAction } from "@/app/actions/client/service-actions";
import { BookingPayload, BookingResult, SlotType, SlotAvailability } from "@/shared/types/serviceTypes";

export type BookingState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: BookingResult }
  | { status: "error"; message: string };

export function useBookWorker(refetchAvailability: () => Promise<SlotAvailability | null>) {
  const [bookingState, setBookingState] = useState<BookingState>({
    status: "idle",
  });

  const book = useCallback(
    async ({
      workerId,
      category,
      date,
      selectedSlots,
      slotType,
      numberOfDays,
      numberOfWorkers,
      pricePerWorker,
      title,
      description,
      address,
    }: {
      workerId: string;
      category: string;
      date: string;
      selectedSlots?: { date: string; slotType: SlotType }[];
      slotType: SlotType;
      numberOfDays?: number;
      numberOfWorkers?: number;
      pricePerWorker?: number;
      title?: string;
      description?: string;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zip?: string;
        label?: string;
      };
    }) => {
      setBookingState({ status: "loading" });

      // Re-fetch availability right before booking to catch race conditions
      const freshAvail = await refetchAvailability();

      if (freshAvail) {
        let slotKey: keyof SlotAvailability | null = null;
        if (slotType === SlotType.MORNING_HALF) slotKey = "morningAvailable";
        if (slotType === SlotType.EVENING_HALF) slotKey = "eveningAvailable";
        if (slotType === SlotType.FULL_DAY) slotKey = "fullDayAvailable";

        if (slotKey && freshAvail && !freshAvail[slotKey]) {
          setBookingState({
            status: "error",
            message: "Slot just got booked. Please select another slot.",
          });
          return;
        }
      }

      const payload: BookingPayload = { 
        workerId, category, date, selectedSlots, slotType, numberOfDays, numberOfWorkers, pricePerWorker, title, description, address 
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
