"use client";

import { useState, useEffect } from "react";
import { User } from "@/shared/types/userTypes";
import { SlotType, SLOT_PRICES } from "@/shared/types/serviceTypes";
import { useWorkerAvailability } from "@/hooks/useWorkerAvailability";
import { useBookWorker } from "@/hooks/useBookWorker";
import { MeetingCalendarSelector } from "./MeetingCalendarSelector";
import { ServiceDetailsStep } from "../book/ServiceDetailsStep";
import { BookingSummaryStep } from "../book/BookingSummaryStep";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { loadRazorpay } from "@/utils/loadRazorpay";
import { createPaymentOrderAction, verifyPaymentAction } from "@/app/actions/client/payment-actions";
import { useUserStore } from "@/store/userStore";
import toast from "react-hot-toast";

interface MeetingBookingSectionProps {
  worker: User;
}

export function MeetingBookingSection({ worker }: MeetingBookingSectionProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("Meeting with worker");
  const [description, setDescription] = useState("15-minute video consultation.");
  const [selectedSlots, setSelectedSlots] = useState<Record<string, SlotType>>({});

  const {
    isLoadingDate,
    calendarHighlights,
    prefetchDays,
    refetchCurrentDate,
  } = useWorkerAvailability(worker.userId || worker.id);

  const { bookingState, book, reset: resetBookingError } = useBookWorker(refetchCurrentDate);

  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());

  const { user } = useUserStore();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    resetBookingError();
  }, [selectedSlots, resetBookingError]);

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
    
    const finalSlot = slotsArray[0].slotType;

    book({
      workerId: worker.userId || worker.id,
      category: "VIDEO_CALL",
      date: slotsArray[0].date,
      selectedSlots: slotsArray,
      slotType: finalSlot,
      numberOfDays: 1,
      numberOfWorkers: 1,
      pricePerWorker: SLOT_PRICES[finalSlot] || 0,
      title,
      description,
      address: undefined, // Location provided by controller automatically
    });
  };

  const nextStep = () => setCurrentStep((p) => Math.min(p + 1, 3));
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 1));

  const handlePayment = async (bookingData: any) => {
    setIsProcessingPayment(true);
    
    const res = await loadRazorpay();
    if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setIsProcessingPayment(false);
        return;
    }

    const orderRes = await createPaymentOrderAction(bookingData.serviceId || bookingData.id);
    if (!orderRes.success) {
        toast.error(orderRes.error || "Failed to create payment order");
        setIsProcessingPayment(false);
        return;
    }

    const { orderId: order_id, amount, currency } = orderRes.data;

    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_YourKeyHere",
        amount: amount.toString(),
        currency: currency,
        name: "Nest & Nail",
        description: "Video Consultation Payment",
        order_id: order_id,
        handler: async function (response: any) {
            try {
                setIsProcessingPayment(true);
                const verifyRes = await verifyPaymentAction({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature
                });

                if (verifyRes.success) {
                    toast.success("Payment verified successfully!");
                    setPaymentSuccess(true);
                } else {
                    toast.error("Payment verification failed. Please contact support.");
                }
            } catch (error) {
                toast.error("An error occurred during verification.");
            } finally {
                setIsProcessingPayment(false);
            }
        },
        prefill: {
            name: user?.name,
            email: user?.email,
            contact: user?.phone?.toString()
        },
        theme: {
            color: "#10b981",
        },
        modal: {
            ondismiss: function () {
                setIsProcessingPayment(false);
                toast.error("Payment was cancelled.");
            }
        }
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.on("payment.failed", function (response: any) {
        toast.error(response.error?.description || "Payment failed");
        setIsProcessingPayment(false);
    });

    paymentObject.open();
  };

  if (bookingState.status === "success" && bookingState.data) {
    if (paymentSuccess) {
      return (
        <div className="bg-white rounded-[24px] border border-emerald-200 p-8 shadow-sm text-center animate-in zoom-in-95 duration-500 mt-8">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Meeting Scheduled!
          </h2>
          <p className="text-gray-500 mb-8">
            Your video consultation has been successfully scheduled and paid.
          </p>
        </div>
      );
    } else {
      return (
        <div className="bg-white rounded-[24px] border border-emerald-200 p-8 shadow-sm text-center animate-in zoom-in-95 duration-500 mt-8">
           <h2 className="text-2xl font-black text-gray-900 mb-2">Payment Required</h2>
           <p className="text-gray-500 mb-8">Please complete the payment to confirm your video consultation.</p>
           {isProcessingPayment ? (
               <div className="text-emerald-500 font-bold mb-4">Processing payment... Please do not refresh.</div>
           ) : (
               <button 
                   onClick={() => handlePayment(bookingState.data)}
                   className="w-full inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
               >
                   Pay Now
               </button>
           )}
        </div>
      );
    }
  }

  return (
    <div className="w-full">
      {/* Basic Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
         {[1, 2, 3].map(step => (
            <div key={step} className="flex items-center gap-2">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep >= step ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {step}
               </div>
               {step < 3 && <div className={`w-10 h-1 rounded-full ${currentStep > step ? 'bg-emerald-600' : 'bg-gray-100'}`} />}
            </div>
         ))}
      </div>

      <div className="relative">
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

        {/* Step 1: Calendar */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">Select Meeting Date & Time</h2>
            <MeetingCalendarSelector
              selectedSlots={selectedSlots}
              onSlotChange={setSelectedSlots}
              availabilityData={Object.fromEntries(calendarHighlights.entries()) as any}
              isLoadingDate={isLoadingDate}
              viewYear={viewYear}
              viewMonth={viewMonth}
              onViewChange={(y, m) => {
                setViewYear(y);
                setViewMonth(m);
              }}
            />

            <div className="mt-8 bg-white border-2 border-emerald-100 rounded-3xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Selection Status</h3>
                  <p className="font-bold text-gray-900 text-lg flex items-center flex-wrap gap-2">
                     {Object.keys(selectedSlots).length === 1 ? 'Slot Selected' : 'No slot selected'}
                  </p>
                </div>
                <button
                  onClick={nextStep}
                  disabled={Object.keys(selectedSlots).length !== 1}
                  className="w-full sm:w-auto bg-gray-900 hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 text-white font-bold py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 group shrink-0"
                >
                  Continue
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {currentStep === 2 && (
          <ServiceDetailsStep
            title={title}
            description={description}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onNext={nextStep}
          />
        )}

        {/* Step 3: Summary */}
        {currentStep === 3 && (
          <BookingSummaryStep
            title={title}
            description={description}
            numberOfDays={1}
            numberOfWorkers={1}
            startDate={Object.keys(selectedSlots).length > 0 ? new Date(Object.keys(selectedSlots)[0]) : null}
            selectedSlots={Object.entries(selectedSlots).map(([date, slotType]) => ({ date, slotType }))}
            slotType={Object.keys(selectedSlots).length > 0 ? Object.values(selectedSlots)[0] : null}
            workerName={worker.name}
            category="Video Consultation"
            address={undefined}
            isBooking={bookingState.status === "loading"}
            onConfirm={handleConfirm}
          />
        )}

        {bookingState.status === "error" && currentStep === 3 && (
          <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-bold text-center">
            {bookingState.message}
          </div>
        )}
      </div>
    </div>
  );
}
