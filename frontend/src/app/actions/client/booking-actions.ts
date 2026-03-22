import { SlotType } from "@/shared/types/serviceTypes";

/**
 * Static mock or API wrapper for fetching a booking by ID
 * Note: Since there isn't a dedicated getBookingById API mentioned in the prompt,
 * we will build a placeholder visual for the booking confirmation page.
 * In a real scenario, this would call GET /api/client/services/bookings/:id
 */
export async function getBookingDetailAction(id: string) {
  // Simulating an API call
  return {
    success: true,
    data: {
      id,
      workerName: "Professional Worker",
      category: "Service",
      scheduledDate: new Date().toISOString(),
      slotType: SlotType.HALF_DAY,
      status: "CONFIRMED",
      amount: 700,
    },
  };
}
