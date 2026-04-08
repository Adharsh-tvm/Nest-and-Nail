import React from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { SlotType, SLOT_LABELS, SLOT_PRICES } from "@/shared/types/serviceTypes";

interface BookingSummaryStepProps {
  title: string;
  description: string;
  numberOfDays: number;
  numberOfWorkers: number;
  startDate: Date | null;
  selectedSlots: { date: string; slotType: SlotType }[];
  slotType: SlotType | null;
  workerName: string;
  category: string;
  address?: any;
  isBooking: boolean;
  onConfirm: () => void;
  onBackReq?: () => void;
}

export function BookingSummaryStep({
  title,
  description,
  numberOfDays,
  numberOfWorkers,
  startDate,
  selectedSlots,
  slotType,
  workerName,
  category,
  address,
  isBooking,
  onConfirm,
}: BookingSummaryStepProps) {
  
  if (!selectedSlots || selectedSlots.length === 0) return null;

  const formatOpts: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  
  // Format the dates visually nicely
  const sortedDates = [...selectedSlots].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const dateString = sortedDates.length === 1 
      ? new Date(sortedDates[0].date).toLocaleDateString("en-US", formatOpts)
      : sortedDates.map(s => new Date(s.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })).join(', ');

  const pricePerWorkerPerDay = selectedSlots.reduce((sum, slot) => sum + SLOT_PRICES[slot.slotType], 0) / (selectedSlots.length || 1);
  const totalAmount = selectedSlots.reduce((sum, slot) => sum + SLOT_PRICES[slot.slotType], 0) * numberOfWorkers;

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Review & Confirm</h2>
        <p className="text-gray-500">Please review your booking details before paying.</p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 space-y-4">
        <div className="flex justify-between items-start pb-4 border-b border-gray-200">
          <div>
            <p className="text-sm font-bold text-gray-500 mb-1">Professional</p>
            <p className="font-bold text-gray-900">{workerName}</p>
            <p className="text-sm text-gray-500">{category}</p>
          </div>
        </div>

        {address && (
          <div className="flex justify-between items-start pb-4 border-b border-gray-200">
             <div>
              <p className="text-sm font-bold text-gray-500 mb-1">Service Location</p>
              <p className="font-bold text-gray-900">{address.label}</p>
              <p className="text-sm text-gray-600 mt-1">{address.street}, {address.city}, {address.state} {address.zip}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-start pb-4 border-b border-gray-200">
           <div>
            <p className="text-sm font-bold text-gray-500 mb-1">Service Details</p>
            <p className="font-bold text-gray-900">{title}</p>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
           <div>
            <p className="text-sm font-bold text-gray-500 mb-1">Date, Duration & Team</p>
            <p className="font-bold text-gray-900">{dateString}</p>
            <p className="text-sm text-gray-500">
               {numberOfDays} {numberOfDays === 1 ? 'Day' : 'Days'} • {numberOfWorkers} {numberOfWorkers === 1 ? 'Worker' : 'Workers'}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
           <div>
            <p className="text-sm font-bold text-gray-500 mb-1">Daily Slot</p>
            <p className="font-bold text-gray-900">
               {selectedSlots.length === 1 ? SLOT_LABELS[selectedSlots[0].slotType] : 'Mixed Slots / Full Days'}
            </p>
            <p className="text-xs text-gray-500 mt-1">₹{pricePerWorkerPerDay} per worker / day</p>
          </div>
           <div className="text-right">
            <p className="text-sm font-bold text-gray-500 mb-1">Total Expected</p>
            <p className="text-xl font-bold text-emerald-600">₹{totalAmount}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onConfirm}
        disabled={isBooking}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 group relative overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2">
           {isBooking ? (
              <RotateCcw className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
            {isBooking ? 'Confirming...' : 'Confirm & Request Booking'}
        </span>
      </button>      
    </div>
  );
}
