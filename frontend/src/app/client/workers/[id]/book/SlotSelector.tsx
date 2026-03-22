"use client";

import { CheckCircle2, Clock, Lock } from "lucide-react";
import {
  SlotAvailability,
  SlotType,
  SLOT_LABELS,
  SLOT_PRICES,
  SLOT_DURATION_LABEL,
} from "@/shared/types/serviceTypes";

interface SlotSelectorProps {
  availability: SlotAvailability;
  selectedSlot: SlotType | null;
  onSlotSelect: (slot: SlotType) => void;
  isLoading?: boolean;
}

const ALL_SLOTS: SlotType[] = [SlotType.HALF_DAY, SlotType.FULL_DAY];

function isSlotAvailable(slot: SlotType, avail: SlotAvailability): boolean {
  return slot === SlotType.HALF_DAY
    ? avail.halfDayAvailable
    : avail.fullDayAvailable;
}

function getBadge(
  slot: SlotType,
  avail: SlotAvailability
): "recommended" | "limited" | null {
  const halfFree = avail.halfDayAvailable;
  const fullFree = avail.fullDayAvailable;

  if (halfFree && fullFree) {
    // Both available → recommend full day (more work value)
    if (slot === SlotType.FULL_DAY) return "recommended";
    return null;
  }
  if (halfFree && !fullFree) {
    if (slot === SlotType.HALF_DAY) return "limited";
    return null;
  }
  if (!halfFree && fullFree) {
    if (slot === SlotType.FULL_DAY) return "limited";
    return null;
  }
  return null;
}

function SlotSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="h-36 rounded-2xl bg-gray-100 animate-pulse border border-gray-200"
        />
      ))}
    </div>
  );
}

export function SlotSelector({
  availability,
  selectedSlot,
  onSlotSelect,
  isLoading,
}: SlotSelectorProps) {
  if (isLoading) return <SlotSkeleton />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {ALL_SLOTS.map((slot) => {
        const available = isSlotAvailable(slot, availability);
        const isSelected = selectedSlot === slot;
        const badge = available ? getBadge(slot, availability) : null;

        return (
          <button
            key={slot}
            disabled={!available}
            onClick={() => available && onSlotSelect(slot)}
            className={`
              relative flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all duration-200
              ${
                !available
                  ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                  : isSelected
                  ? "bg-gray-900 border-gray-900 text-white shadow-xl scale-[1.02]"
                  : "bg-white border-gray-200 hover:border-emerald-400 hover:shadow-md cursor-pointer hover:scale-[1.01]"
              }
            `}
          >
            {/* Badge */}
            {badge && (
              <span
                className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${
                  badge === "recommended"
                    ? isSelected
                      ? "bg-emerald-400 text-white"
                      : "bg-emerald-100 text-emerald-700"
                    : isSelected
                    ? "bg-amber-400 text-white"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {badge === "recommended" ? "⭐ Best" : "⚡ Limited"}
              </span>
            )}

            {/* Icon */}
            <div
              className={`mb-3 p-2 rounded-xl ${
                !available
                  ? "bg-gray-200 text-gray-400"
                  : isSelected
                  ? "bg-white/20 text-white"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {!available ? (
                <Lock className="w-5 h-5" />
              ) : (
                <Clock className="w-5 h-5" />
              )}
            </div>

            {/* Label */}
            <p
              className={`font-bold text-base mb-0.5 ${
                !available ? "text-gray-400" : isSelected ? "text-white" : "text-gray-900"
              }`}
            >
              {SLOT_LABELS[slot]}
            </p>

            {/* Duration */}
            <p
              className={`text-xs mb-3 ${
                !available ? "text-gray-400" : isSelected ? "text-gray-300" : "text-gray-500"
              }`}
            >
              {SLOT_DURATION_LABEL[slot]}
            </p>

            {/* Price / Status */}
            <div className="flex items-center gap-2 mt-auto">
              {available ? (
                <>
                  <span
                    className={`text-xl font-black ${isSelected ? "text-white" : "text-gray-900"}`}
                  >
                    ₹{SLOT_PRICES[slot]}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-1" />
                  )}
                </>
              ) : (
                <span className="text-xs font-semibold text-red-400 bg-red-50 px-2 py-1 rounded-lg">
                  Booked
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
