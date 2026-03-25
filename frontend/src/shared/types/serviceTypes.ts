export enum SlotType {
  MORNING_HALF = "MORNING_HALF",
  EVENING_HALF = "EVENING_HALF",
  FULL_DAY = "FULL_DAY",
}

export interface SlotAvailability {
  morningAvailable: boolean;
  eveningAvailable: boolean;
  fullDayAvailable: boolean;
}

export interface BookingPayload {
  workerId: string;
  category: string;
  date: string; // ISO date string YYYY-MM-DD
  selectedSlots?: { date: string; slotType: SlotType }[];
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
  selectedSlots?: { date: string; slotType: SlotType }[];
  slotType: SlotType;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface DateAvailabilitySummary {
  date: string; // YYYY-MM-DD
  morningAvailable: boolean;
  eveningAvailable: boolean;
  fullDayAvailable: boolean;
  highlight: "green" | "yellow" | "red";
}

export const SLOT_PRICES: Record<SlotType, number> = {
  [SlotType.MORNING_HALF]: 700,
  [SlotType.EVENING_HALF]: 750,
  [SlotType.FULL_DAY]: 1300,
};

export const SLOT_LABELS: Record<SlotType, string> = {
  [SlotType.MORNING_HALF]: "Morning Half",
  [SlotType.EVENING_HALF]: "Evening Half",
  [SlotType.FULL_DAY]: "Full Day",
};

export const SLOT_DURATION_LABEL: Record<SlotType, string> = {
  [SlotType.MORNING_HALF]: "4–5 hours (Morning)",
  [SlotType.EVENING_HALF]: "4–5 hours (Evening)",
  [SlotType.FULL_DAY]: "8–9 hours",
};

export enum ServiceStatus {
  OPEN = "OPEN",
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED_BY_CLIENT = "CANCELLED_BY_CLIENT",
  CANCELLED_BY_WORKER = "CANCELLED_BY_WORKER",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PARTIAL = "PARTIAL",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED"
}

export interface ServiceResponseDTO {
  serviceId: string;
  clientId: string;
  workerId: string;
  category: string;
  scheduledDate: string;
  selectedSlots: Array<{ date: string; slotType: SlotType }>;
  status: ServiceStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}
