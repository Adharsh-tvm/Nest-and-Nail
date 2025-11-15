// app/components/OtpVerificationForm.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

interface OtpVerificationFormProps {
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
}

const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
  email,
  onVerify,
  onResend,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // --- NEW: Handle Paste Event ---
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Extract only numbers from the pasted data
    const pastedNumbers = pastedData.replace(/\D/g, "").slice(0, 6).split("");

    if (pastedNumbers.length > 0) {
      const newOtp = [...otp];
      pastedNumbers.forEach((num, index) => {
        newOtp[index] = num;
      });
      setOtp(newOtp);

      // Focus the input box after the last pasted digit
      const nextFocusIndex = Math.min(pastedNumbers.length, 5);
      inputRefs.current[nextFocusIndex]?.focus();

      // Optional: Auto-submit if the length is exactly 6
      if (pastedNumbers.length === 6) {
        // You can uncomment the line below if you want auto-submit on paste
        // onVerify(pastedNumbers.join(""));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length === 6) {
      onVerify(otpCode);
    }
  };

  const handleResendClick = () => {
    if (canResend) {
      onResend();
      setTimer(60);
      setCanResend(false);
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md rounded-lg bg-gray-900 p-6 shadow-xl md:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
            <ShieldCheckIcon className="h-8 w-8 text-500" />
          </div>
          <h1 className="text-2xl font-semibold text-white">
            Verify Your Account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter the 6-digit code sent to <br />
            <span className="font-medium text-gray-200">{email}</span>
          </p>

          <div className="my-8 flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste} // <--- Added the onPaste handler here
                className="h-12 w-10 rounded-md border border-gray-700 bg-gray-800 text-center text-2xl font-semibold text-white shadow-inner focus:border-white-500 focus:outline-none focus:ring-1 focus:ring-white-500 sm:h-14 sm:w-12"
                required
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-white py-3 text-base font-semibold text-black transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Verify Account
          </button>

          <div className="mt-6 text-center text-sm text-gray-400">
            <p>
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendClick}
                disabled={!canResend}
                className={`font-medium ${
                  canResend
                    ? "text-white-500 hover:text-white-400"
                    : "cursor-not-allowed text-gray-600"
                } transition-colors duration-200 focus:outline-none`}
              >
                Resend Code
              </button>
              {!canResend && (
                <span className="ml-1 text-gray-500">(in {timer}s)</span>
              )}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerificationForm;
