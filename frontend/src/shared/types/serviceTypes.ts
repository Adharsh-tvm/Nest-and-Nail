export enum SlotType {
  MORNING_HALF = "MORNING_HALF",
  EVENING_HALF = "EVENING_HALF",
  FULL_DAY = "FULL_DAY",
  VIDEO_SLOT_1 = "VIDEO_8_00_8_15",
  VIDEO_SLOT_2 = "VIDEO_8_15_8_30",
  VIDEO_SLOT_3 = "VIDEO_8_30_8_45",
  VIDEO_SLOT_4 = "VIDEO_8_45_9_00",
}

export interface SlotAvailability {
  morningAvailable: boolean;
  eveningAvailable: boolean;
  fullDayAvailable: boolean;
  isBooked?: boolean;
  isUnavailable?: boolean;
  bookedSlots?: SlotType[];
}

export interface BookingPayload {
  workerId: string;
  category: string;
  date: string; // ISO date string YYYY-MM-DD
  selectedSlots?: { date: string; slotType: SlotType }[];
  slotType: SlotType;
  numberOfDays?: number;
  numberOfWorkers?: number;
  pricePerWorker?: number;
  title?: string;
  description?: string;
  address?: any;
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
  bookedSlots?: SlotType[];
}

export const SLOT_PRICES: Record<SlotType, number> = {
  [SlotType.MORNING_HALF]: 700,
  [SlotType.EVENING_HALF]: 750,
  [SlotType.FULL_DAY]: 1300,
  [SlotType.VIDEO_SLOT_1]: 50,
  [SlotType.VIDEO_SLOT_2]: 50,
  [SlotType.VIDEO_SLOT_3]: 50,
  [SlotType.VIDEO_SLOT_4]: 50,
};

export const SLOT_LABELS: Record<SlotType, string> = {
  [SlotType.MORNING_HALF]: "Morning Half",
  [SlotType.EVENING_HALF]: "Evening Half",
  [SlotType.FULL_DAY]: "Full Day",
  [SlotType.VIDEO_SLOT_1]: "8:00 PM - 8:15 PM",
  [SlotType.VIDEO_SLOT_2]: "8:15 PM - 8:30 PM",
  [SlotType.VIDEO_SLOT_3]: "8:30 PM - 8:45 PM",
  [SlotType.VIDEO_SLOT_4]: "8:45 PM - 9:00 PM",
};

export const SLOT_DURATION_LABEL: Record<SlotType, string> = {
  [SlotType.MORNING_HALF]: "4–5 hours (Morning)",
  [SlotType.EVENING_HALF]: "4–5 hours (Evening)",
  [SlotType.FULL_DAY]: "8–9 hours",
  [SlotType.VIDEO_SLOT_1]: "15 mins",
  [SlotType.VIDEO_SLOT_2]: "15 mins",
  [SlotType.VIDEO_SLOT_3]: "15 mins",
  [SlotType.VIDEO_SLOT_4]: "15 mins",
};

export enum ServiceStatus {
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

  pricePerWorker?: number;
  totalAmount?: number;

  client?: {
    name: string;
    email: string;
    phone?: number;
    profilePictureUrl?: string;
    profileImageUrl?: string;
  };
  worker?: {
    name: string;
    email?: string;
    profilePictureUrl?: string;
    profileImageUrl?: string;
  };
  location?: {
    type: "Point" | string;
    coordinates: number[];
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    label?: string;
  };
  title?: string;
  description?: string;
  numberOfDays?: number;

    videoCall?: {
        roomId?: string;
        startTime?: string | Date;
        endTime?: string | Date;
        joinUrl?: string;
        meetingLink?: string;
        status: string;
        startedAt?: string | Date;
        endedAt?: string | Date;
        duration?: string;
    };
}

export interface AdminServiceResponseDTO {
  serviceId: string;
  category: string;
  status: string;
  paymentStatus: string;

  scheduledDate: string;
  selectedSlots: { date: string; slotType: string }[];

  location: {
    type: "Point";
    coordinates: [number, number];
  };

  client: {
    userId: string;
    name: string;
    email: string;
    phone?: string;
    address?: {
      addressId?: string;
      label?: string;
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zip?: string;
      location?: any;
      isDefault?: boolean;
    } | string;
  };

  worker: {
    userId: string;
    name: string;
    rating?: number;
    skills?: string[];
  };

  title?: string;
  description?: string;
  numberOfDays?: number;

  createdAt: string;
  updatedAt?: string;
  videoCall?: {
    roomId?: string;
    startTime?: string | Date;
    endTime?: string | Date;
    meetingLink?: string;
    status: string;
    startedAt?: string | Date;
    endedAt?: string | Date;
    duration?: string;
  };
}
