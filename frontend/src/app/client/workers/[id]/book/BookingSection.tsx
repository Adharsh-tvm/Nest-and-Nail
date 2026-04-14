"use client";

import { useState, useEffect } from "react";
import { User } from "@/shared/types/userTypes";
import { SlotType, SLOT_PRICES } from "@/shared/types/serviceTypes";
import { useWorkerAvailability } from "@/hooks/useWorkerAvailability";
import { useBookWorker } from "@/hooks/useBookWorker";
import { CalendarSelector } from "./CalendarSelector";

import { AddressSelectionStep } from "./AddressSelectionStep";
import { AddAddressModal } from "@/app/components/containers/layout/AddAddressModal";
import { useUserStore } from "@/store/userStore";
import { addUSerAddressAction } from "@/app/actions/users/user-profile-actions";
import { Address } from "@/shared/types/addressType";
import toast from "react-hot-toast";
import { DaysSelectionStep } from "./DaysSelectionStep";
import { ServiceDetailsStep } from "./ServiceDetailsStep";
import { BookingSummaryStep } from "./BookingSummaryStep";
import { StepsIndicator } from "./StepsIndicator";
import { CheckCircle2, ChevronRight, ChevronLeft, CreditCard, Wallet, RotateCcw } from "lucide-react";
import Link from "next/link";
import { loadRazorpay } from "@/utils/loadRazorpay";
import { createPaymentOrderAction, verifyPaymentAction, processWalletPaymentAction } from "@/app/actions/client/payment-actions";
import { getWalletBalanceAction } from "@/app/actions/client/wallet-actions";

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
  const { user, setUser } = useUserStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [numberOfWorkers, setNumberOfWorkers] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoriesPool[0]);
  const [selectedSlots, setSelectedSlots] = useState<Record<string, SlotType>>({});
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "wallet">("razorpay");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

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

  // Fetch wallet balance from API on mount
  useEffect(() => {
    getWalletBalanceAction().then((res) => {
      if (res.success && res.data) {
        setWalletBalance(res.data.balance);
      }
    });
  }, []);

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
    
    const finalSlot = slotsArray[0].slotType;

    book({
      workerId: worker.userId || worker.id,
      category: selectedCategory,
      date: slotsArray[0].date,
      selectedSlots: slotsArray,
      slotType: finalSlot,
      numberOfDays,
      numberOfWorkers,
      pricePerWorker: SLOT_PRICES[finalSlot],
      title,
      description,
      address: selectedAddress,
    });
  };

  const handleSaveAddress = async (addressData: Address) => {
    if (!user) return;
    const oldUser = user;
    const updatedAddresses = [...(user.address || []), addressData];
    setUser({ ...user, address: updatedAddresses });
    try {
      const response = await addUSerAddressAction(user.id, addressData);
      if (!response.success) {
        setUser(oldUser);
        toast.error(response.message);
        return;
      }
      setUser(response.payload || oldUser);
      toast.success("Address added successfully");
      setIsAddAddressOpen(false);
    } catch (err: any) {
      setUser(oldUser);
      toast.error(err.message || "Failed to save address");
    }
  };

  const nextStep = () => setCurrentStep((p) => Math.min(p + 1, 5));
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 1));

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

    const { orderId: order_id, amount, currency } = orderRes.data;

    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_YourKeyHere",
        amount: amount.toString(),
        currency: currency,
        name: "Nest & Nail",
        description: "Service Booking – Full Payment",
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
            contact: user?.phone_number?.toString()
        },
        theme: { color: "#10b981" },
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

  // ---------------------------------------------------------------------------
  // SUCCESS STATE
  // ---------------------------------------------------------------------------
  if (bookingState.status === "success" && bookingState.data) {
    if (paymentSuccess) {
      return (
        <div className="bg-white rounded-[24px] border border-emerald-200 p-8 shadow-sm text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-8">Your service has been successfully scheduled and paid in full.</p>
        </div>
      );
    } else {
      // Compute totals for display
      const slotsArr = Object.entries(selectedSlots).map(([date, slotType]) => ({ date, slotType }));
      const totalAmount = slotsArr.reduce((sum, s) => sum + SLOT_PRICES[s.slotType], 0) * numberOfWorkers;
      const walletSufficient = walletBalance >= totalAmount;

      return (
        <div className="bg-white rounded-[24px] border border-emerald-200 p-8 shadow-sm text-center animate-in zoom-in-95 duration-500">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Complete Payment</h2>
          <p className="text-gray-500 mb-2">Total amount: <span className="font-bold text-emerald-600 text-lg">₹{totalAmount}</span></p>
          <p className="text-gray-400 text-sm mb-8">Full payment required to confirm your booking.</p>

          {/* Payment Method Selector */}
          <div className="flex gap-4 mb-8 justify-center">
            {/* Razorpay Option */}
            <button
              onClick={() => setPaymentMethod("razorpay")}
              className={`flex-1 max-w-[180px] flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                paymentMethod === "razorpay"
                  ? "border-emerald-500 bg-emerald-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === "razorpay" ? "bg-emerald-100" : "bg-gray-100"}`}>
                <CreditCard className={`w-5 h-5 ${paymentMethod === "razorpay" ? "text-emerald-600" : "text-gray-400"}`} />
              </div>
              <span className={`text-sm font-bold ${paymentMethod === "razorpay" ? "text-emerald-700" : "text-gray-500"}`}>Razorpay</span>
              <span className="text-xs text-gray-400">UPI, Cards, NetBanking</span>
              {paymentMethod === "razorpay" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </button>

            {/* Wallet Option */}
            <button
              onClick={() => setPaymentMethod("wallet")}
              className={`flex-1 max-w-[180px] flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                paymentMethod === "wallet"
                  ? "border-purple-500 bg-purple-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === "wallet" ? "bg-purple-100" : "bg-gray-100"}`}>
                <Wallet className={`w-5 h-5 ${paymentMethod === "wallet" ? "text-purple-600" : "text-gray-400"}`} />
              </div>
              <span className={`text-sm font-bold ${paymentMethod === "wallet" ? "text-purple-700" : "text-gray-500"}`}>Wallet</span>
              <span className={`text-xs font-medium ${walletSufficient ? "text-gray-400" : "text-red-400"}`}>
                Balance: ₹{walletBalance}
              </span>
              {!walletSufficient && <span className="text-xs text-red-500 font-semibold">Insufficient</span>}
              {paymentMethod === "wallet" && <CheckCircle2 className="w-4 h-4 text-purple-500" />}
            </button>
          </div>

          {isProcessingPayment ? (
            <div className="text-emerald-500 font-bold mb-4 flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4 animate-spin" /> Processing... Please do not refresh.
            </div>
          ) : (
            <button
              onClick={() => handlePayment(bookingState.data)}
              disabled={paymentMethod === "wallet" && !walletSufficient}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {paymentMethod === "wallet" ? <Wallet className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
              {paymentMethod === "wallet" ? "Pay with Wallet" : "Pay with Razorpay"}
            </button>
          )}
        </div>
      );
    }
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

        {isAddAddressOpen && (
          <AddAddressModal
            isOpen={isAddAddressOpen}
            onClose={() => setIsAddAddressOpen(false)}
            onSave={handleSaveAddress}
            mode="add"
          />
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
            }}
            numberOfWorkers={numberOfWorkers}
            onSelectWorkers={(workers) => {
               setNumberOfWorkers(workers);
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


        {/* Step 3: Address Selection */}
        {currentStep === 3 && (
          <AddressSelectionStep
            user={user}
            selectedAddress={selectedAddress}
            onSelectAddress={setSelectedAddress}
            onNext={nextStep}
            onOpenAddModal={() => setIsAddAddressOpen(true)}
          />
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
            numberOfWorkers={numberOfWorkers}
            startDate={Object.keys(selectedSlots).length > 0 ? new Date(Object.keys(selectedSlots)[0]) : null}
            selectedSlots={Object.entries(selectedSlots).map(([date, slotType]) => ({ date, slotType }))}
            slotType={Object.keys(selectedSlots).length > 0 ? Object.values(selectedSlots)[0] : null}
            workerName={worker.name}
            category={selectedCategory}
            address={selectedAddress}
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
