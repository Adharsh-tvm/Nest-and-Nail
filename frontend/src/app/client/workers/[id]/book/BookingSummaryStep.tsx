import React from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { SlotType, SLOT_LABELS, SLOT_PRICES } from "@/shared/types/serviceTypes";

interface BookingSummaryStepProps {
  title: string;
  description: string;
  numberOfDays: number;
  startDate: Date | null;
  slotType: SlotType | null;
  workerName: string;
  category: string;
  isBooking: boolean;
  onConfirm: () => void;
  onBackReq?: () => void;
}

export function BookingSummaryStep({
  title,
  description,
  numberOfDays,
  startDate,
  slotType,
  workerName,
  category,
  isBooking,
  onConfirm,
}: BookingSummaryStepProps) {
  
  if (!startDate || !slotType) return null;

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + numberOfDays - 1);

  const formatOpts: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  const dateString = 
    numberOfDays === 1 
      ? startDate.toLocaleDateString("en-US", formatOpts)
      : `${startDate.toLocaleDateString("en-US", formatOpts)} - ${endDate.toLocaleDateString("en-US", formatOpts)}`;

  const totalAmount = SLOT_PRICES[slotType] * numberOfDays;

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

        <div className="flex justify-between items-start pb-4 border-b border-gray-200">
           <div>
            <p className="text-sm font-bold text-gray-500 mb-1">Service Details</p>
            <p className="font-bold text-gray-900">{title}</p>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
           <div>
            <p className="text-sm font-bold text-gray-500 mb-1">Date & Duration</p>
            <p className="font-bold text-gray-900">{dateString}</p>
            <p className="text-sm text-gray-500">{numberOfDays} {numberOfDays === 1 ? 'Day' : 'Days'}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
           <div>
            <p className="text-sm font-bold text-gray-500 mb-1">Daily Slot</p>
            <p className="font-bold text-gray-900">{SLOT_LABELS[slotType]}</p>
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
