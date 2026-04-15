"use client";

import { useState, useEffect } from "react";
import { User } from "@/shared/types/userTypes";
import { SlotType, SLOT_PRICES } from "@/shared/types/serviceTypes";
import { useWorkerAvailability } from "@/hooks/useWorkerAvailability";
import { useBookWorker } from "@/hooks/useBookWorker";
import { MeetingCalendarSelector } from "./MeetingCalendarSelector";
import { ServiceDetailsStep } from "../book/ServiceDetailsStep";
import { BookingSummaryStep } from "../book/BookingSummaryStep";
import { CheckCircle2, ChevronRight, ChevronLeft, CreditCard, Wallet, RotateCcw } from "lucide-react";
import { loadRazorpay } from "@/utils/loadRazorpay";
import { createPaymentOrderAction, verifyPaymentAction, processWalletPaymentAction } from "@/app/actions/client/payment-actions";
import { getWalletBalanceAction } from "@/app/actions/client/wallet-actions";
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
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "wallet">("razorpay");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    resetBookingError();
  }, [selectedSlots, resetBookingError]);

  // Fetch wallet balance from API on mount
  useEffect(() => {
    getWalletBalanceAction().then((res) => {
      if (res.success && res.data) {
        setWalletBalance(res.data.balance);
      }
    });
  }, []);

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
      address: undefined,
    });
  };

  const nextStep = () => {
    setCurrentStep((p) => Math.min(p + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const prevStep = () => {
    setCurrentStep((p) => Math.max(p - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRazorpayPayment = async (bookingData: any) => {
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

    const orderData = orderRes.data;
    if (!orderData || orderData.amount == null || !orderData.currency || !orderData.orderId) {
      toast.error("Invalid payment order response. Please try again.");
      setIsProcessingPayment(false);
      return;
    }

    const { orderId: order_id, amount, currency } = orderData;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_YourKeyHere",
      amount: amount.toString(),
      currency: currency,
      name: "Nest & Nail",
      description: "Video Consultation – Full Payment",
      order_id: order_id,
      handler: async function (response: any) {
        try {
          setIsProcessingPayment(true);
          const verifyRes = await verifyPaymentAction({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.success) {
            toast.success("Payment successful!");
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
        contact: user?.phone_number?.toString(),
      },
      theme: { color: "#7c3aed" },
      modal: {
        ondismiss: function () {
          setIsProcessingPayment(false);
          toast.error("Payment was cancelled.");
        },
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.on("payment.failed", function (response: any) {
      toast.error(response.error?.description || "Payment failed");
      setIsProcessingPayment(false);
    });
    paymentObject.open();
  };

  const handleWalletPayment = async (bookingData: any) => {
    setIsProcessingPayment(true);
    try {
      const res = await processWalletPaymentAction(bookingData.serviceId || bookingData.id);
      if (res.success) {
        toast.success("Payment successful via Wallet!");
        setPaymentSuccess(true);
      } else {
        toast.error(res.error || "Wallet payment failed.");
      }
    } catch (err: any) {
      toast.error(err.message || "Wallet payment failed.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePayment = (bookingData: any) => {
    if (paymentMethod === "wallet") {
      handleWalletPayment(bookingData);
    } else {
      handleRazorpayPayment(bookingData);
    }
  };

  // ── Booked + Paid ──
  if (bookingState.status === "success" && bookingState.data) {
    if (paymentSuccess) {
      return (
        <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-sm text-center animate-in zoom-in-95 duration-500 mt-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Meeting Scheduled!</h2>
          <p className="text-sm text-gray-500 mb-4">
            Your video consultation has been successfully scheduled and paid in full.
          </p>
        </div>
      );
    }

    // Compute meeting total for display
    const slotsArr = Object.entries(selectedSlots).map(([date, slotType]) => ({ date, slotType }));
    const meetingTotal = slotsArr.reduce((sum, s) => sum + (SLOT_PRICES[s.slotType] || 0), 0);
    const walletSufficient = walletBalance >= meetingTotal;

    return (
      <div className="bg-white rounded-xl border border-purple-100 p-6 shadow-sm text-center animate-in zoom-in-95 duration-500 mt-4">
        <h2 className="text-xl font-black text-gray-900 mb-2">Complete Payment</h2>
        <p className="text-sm text-gray-500 mb-1">
          Total: <span className="font-bold text-purple-600 text-lg">₹{meetingTotal}</span>
        </p>
        <p className="text-xs text-gray-400 mb-5">Full payment required to confirm your meeting.</p>

        {/* Payment Method Selector */}
        <div className="flex gap-3 mb-6 justify-center">
          {/* Razorpay */}
          <button
            onClick={() => setPaymentMethod("razorpay")}
            className={`flex-1 max-w-[160px] flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${paymentMethod === "razorpay"
                ? "border-purple-500 bg-purple-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300"
              }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentMethod === "razorpay" ? "bg-purple-100" : "bg-gray-100"}`}>
              <CreditCard className={`w-4 h-4 ${paymentMethod === "razorpay" ? "text-purple-600" : "text-gray-400"}`} />
            </div>
            <span className={`text-sm font-bold ${paymentMethod === "razorpay" ? "text-purple-700" : "text-gray-500"}`}>Razorpay</span>
            <span className="text-[10px] text-gray-400">UPI, Cards, NetBanking</span>
            {paymentMethod === "razorpay" && <CheckCircle2 className="w-4 h-4 text-purple-500" />}
          </button>

          {/* Wallet */}
          <button
            onClick={() => setPaymentMethod("wallet")}
            className={`flex-1 max-w-[160px] flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${paymentMethod === "wallet"
                ? "border-indigo-500 bg-indigo-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300"
              }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentMethod === "wallet" ? "bg-indigo-100" : "bg-gray-100"}`}>
              <Wallet className={`w-4 h-4 ${paymentMethod === "wallet" ? "text-indigo-600" : "text-gray-400"}`} />
            </div>
            <span className={`text-sm font-bold ${paymentMethod === "wallet" ? "text-indigo-700" : "text-gray-500"}`}>Wallet</span>
            <span className={`text-[10px] font-medium ${walletSufficient ? "text-gray-400" : "text-red-400"}`}>
              Balance: ₹{walletBalance}
            </span>
            {!walletSufficient && <span className="text-xs text-red-500 font-semibold">Insufficient</span>}
            {paymentMethod === "wallet" && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
          </button>
        </div>

        {isProcessingPayment ? (
          <div className="text-purple-500 font-bold mb-4 flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4 animate-spin" /> Processing... Please do not refresh.
          </div>
        ) : (
          <button
            onClick={() => handlePayment(bookingState.data)}
            disabled={paymentMethod === "wallet" && !walletSufficient}
            className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            {paymentMethod === "wallet" ? <Wallet className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
            {paymentMethod === "wallet" ? "Pay with Wallet" : "Pay with Razorpay"}
          </button>
        )}
      </div>
    );
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
