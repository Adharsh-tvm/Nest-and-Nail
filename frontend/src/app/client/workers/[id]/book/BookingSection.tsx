"use client";

import { useState, useEffect } from "react";
import { User } from "@/shared/types/userTypes";
import { SlotType } from "@/shared/types/serviceTypes";
import { useWorkerAvailability } from "@/hooks/useWorkerAvailability";
import { useBookWorker } from "@/hooks/useBookWorker";
import { CalendarSelector } from "./CalendarSelector";

import { DaysSelectionStep } from "./DaysSelectionStep";
import { ServiceDetailsStep } from "./ServiceDetailsStep";
import { BookingSummaryStep } from "./BookingSummaryStep";
import { StepsIndicator } from "./StepsIndicator";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface BookingSectionProps {
  worker: User;
}

export function BookingSection({ worker }: BookingSectionProps) {
  const categoriesPool = worker.categories?.length 
    ? worker.categories 
    : worker.skills?.length 
    ? worker.skills 
    : ["Service"];

  // Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoriesPool[0]);
  const [selectedSlots, setSelectedSlots] = useState<Record<string, SlotType>>({});

  const {
    selectedDate,
    currentAvailability,
    isLoadingDate,
    dateError,
    calendarHighlights,
    selectDate,
    prefetchDays,
    refetchCurrentDate,
  } = useWorkerAvailability(worker.userId || worker.id);

  const { bookingState, book, reset: resetBookingError } = useBookWorker(refetchCurrentDate);

  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  // Auto-clear error when dates change
  useEffect(() => {
    resetBookingError();
  }, [selectedSlots, resetBookingError]);

  // Initial fetch for calendar dots
  useEffect(() => {
    const d = new Date(viewYear, viewMonth, 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fetchStart = d < today ? today : d;
    prefetchDays(fetchStart, 35);
  }, [viewYear, viewMonth, prefetchDays]);

  const handleConfirm = () => {
    const slotsArray = Object.entries(selectedSlots).map(([date, slotType]) => ({ date, slotType }));
    if (slotsArray.length === 0) return;
    
    // finalSlot fallback for backend constraints if needed, but we pass selectedSlots anyway
    const finalSlot = slotsArray[0].slotType;

    book({
      workerId: worker.userId || worker.id,
      category: selectedCategory,
      date: slotsArray[0].date,
      selectedSlots: slotsArray,
      slotType: finalSlot,
      numberOfDays,
      title,
      description,
    });
  };

  // Skip Step 3 entirely since slots are picked on the Calendar
  const nextStep = () => setCurrentStep((p) => {
    if (p === 2) return 4;
    return Math.min(p + 1, 5);
  });
  const prevStep = () => setCurrentStep((p) => {
    if (p === 4) return 2;
    return Math.max(p - 1, 1);
  });

  // ---------------------------------------------------------------------------
  // SUCCESS STATE (Step 6 intrinsically)
  // ---------------------------------------------------------------------------
  if (bookingState.status === "success" && bookingState.data) {
    return (
      <div className="bg-white rounded-[24px] border border-emerald-200 p-8 shadow-sm text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-gray-500 mb-8">
          Your service request has been successfully scheduled.
        </p>
        {/* <Link
          href={`/client/bookings/${bookingState.data.id || bookingState.data.serviceId}`}
          className="w-full inline-flex items-center justify-center bg-gray-900 hover:bg-black text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          View Request Details
          <ChevronRight className="w-5 h-5 ml-1" />
        </Link> */}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // WIZARD FLOW
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full">
      <StepsIndicator currentStep={currentStep} numberOfDays={numberOfDays} />

      <div className="relative mt-8">
        {/* Back Button (Only visible if step > 1 and not loading API) */}
        {currentStep > 1 && bookingState.status !== "loading" && (
          <div className="mb-4">
            <button 
              onClick={prevStep}
              className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </button>
          </div>
        )}

        {/* Step 1: Duration */}
        {currentStep === 1 && (
          <DaysSelectionStep
            categories={categoriesPool}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedDays={numberOfDays}
            onSelectDays={(days) => {
               setNumberOfDays(days);
               // If going from 1 to >1 days, optionally clear any previous selectedSlot 
               // so it defaults to FULL_DAY on confirm.
               nextStep();
            }}
            onNext={nextStep}
          />
        )}

        {/* Step 2: Calendar */}
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">Select Start Date</h2>
            <CalendarSelector
              selectedSlots={selectedSlots}
              onSlotChange={(newSlots) => {
                setSelectedSlots(newSlots);
              }}
              availabilityData={Object.fromEntries(calendarHighlights.entries()) as any}
              isLoadingDate={isLoadingDate}
              numberOfDays={numberOfDays || 1}
              viewYear={viewYear}
              viewMonth={viewMonth}
              onViewChange={(y, m) => {
                setViewYear(y);
                setViewMonth(m);
              }}
            />

            {/* Selected Range Preview */}
            <div className="mt-8 bg-white border-2 border-emerald-100 rounded-3xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Selected Dates</h3>
                  <p className="font-bold text-gray-900 text-lg flex items-center flex-wrap gap-2">
                     {Object.keys(selectedSlots).length} of {numberOfDays} days selected
                  </p>
                  {Object.keys(selectedSlots).length === numberOfDays ? (
                    <p className="text-sm font-medium text-emerald-600 mt-1 bg-emerald-50 inline-block px-2.5 py-1 rounded-lg">
                      All required days selected
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-amber-600 mt-1 bg-amber-50 inline-block px-2.5 py-1 rounded-lg">
                      Please select {numberOfDays - Object.keys(selectedSlots).length} more day(s)
                    </p>
                  )}
                </div>
                
                <button
                  onClick={nextStep}
                  disabled={Object.keys(selectedSlots).length !== numberOfDays}
                  className="w-full sm:w-auto bg-gray-900 hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 text-white font-bold py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 group shrink-0"
                >
                  Continue
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}



        {/* Step 4: Details */}
        {currentStep === 4 && (
          <ServiceDetailsStep
            title={title}
            description={description}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onNext={nextStep}
          />
        )}

        {/* Step 5: Summary */}
        {currentStep === 5 && (
          <BookingSummaryStep
            title={title}
            description={description}
            numberOfDays={numberOfDays}
            startDate={Object.keys(selectedSlots).length > 0 ? new Date(Object.keys(selectedSlots)[0]) : null}
            selectedSlots={Object.entries(selectedSlots).map(([date, slotType]) => ({ date, slotType }))}
            slotType={Object.keys(selectedSlots).length > 0 ? Object.values(selectedSlots)[0] : null}
            workerName={worker.name}
            category={selectedCategory}
            isBooking={bookingState.status === "loading"}
            onConfirm={handleConfirm}
          />
        )}

        {bookingState.status === "error" && currentStep === 5 && (
          <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-bold text-center">
            {bookingState.message}
          </div>
        )}
      </div>
    </div>
  );
}
