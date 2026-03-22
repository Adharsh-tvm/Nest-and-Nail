export enum SlotType {
  HALF_DAY = "HALF_DAY",
  FULL_DAY = "FULL_DAY",
}

export interface SlotAvailability {
  halfDayAvailable: boolean;
  fullDayAvailable: boolean;
}

export interface BookingPayload {
  workerId: string;
  category: string;
  date: string; // ISO date string YYYY-MM-DD
  slotType: SlotType;
  numberOfDays?: number;
  title?: string;
  description?: string;
}

export interface BookingResult {
  id: string;
  serviceId: string;
  clientId: string;
  workerId: string;
  category: string;
  scheduledDate: string;
  slotType: SlotType;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface DateAvailabilitySummary {
  date: string; // YYYY-MM-DD
  halfDayAvailable: boolean;
  fullDayAvailable: boolean;
  /** computed highlight: 'green' | 'yellow' | 'red' */
  highlight: "green" | "yellow" | "red";
}

export const SLOT_PRICES: Record<SlotType, number> = {
  [SlotType.HALF_DAY]: 700,
  [SlotType.FULL_DAY]: 1300,
};

export const SLOT_LABELS: Record<SlotType, string> = {
  [SlotType.HALF_DAY]: "Half Day",
  [SlotType.FULL_DAY]: "Full Day",
};

export const SLOT_DURATION_LABEL: Record<SlotType, string> = {
  [SlotType.HALF_DAY]: "4–5 hours",
  [SlotType.FULL_DAY]: "8–9 hours",
};
