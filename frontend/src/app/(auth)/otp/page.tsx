"use client";

import React, { useState, useRef, useEffect } from "react";
import { ShieldCheck } from "lucide-react";

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
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

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

    // Auto-submit when all 6 digits are entered
    if (value && index === 5 && newOtp.every((digit) => digit !== "")) {
      onVerify(newOtp.join(""));
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

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    const pastedNumbers = pastedData.replace(/\D/g, "").slice(0, 6).split("");

    if (pastedNumbers.length > 0) {
      const newOtp = [...otp];
      pastedNumbers.forEach((num, index) => {
        newOtp[index] = num;
      });
      setOtp(newOtp);

      const nextFocusIndex = Math.min(pastedNumbers.length, 5);
      inputRefs.current[nextFocusIndex]?.focus();

      // Auto-submit if 6 digits are pasted
      if (pastedNumbers.length === 6) {
        onVerify(pastedNumbers.join(""));
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
    <div className="w-full p-6 md:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 border border-gray-200">
          <ShieldCheck className="h-8 w-8 text-gray-900" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Verify Your Email
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Enter the 6-digit code sent to <br />
          <span className="font-medium text-gray-900">{email}</span>
        </p>

        <div className="my-8 flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="h-12 w-10 rounded-md border border-gray-300 bg-gray-50 text-center text-2xl font-semibold text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black sm:h-14 sm:w-12"
              required
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-gray-900 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          Verify Email
        </button>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            {"Didn't receive the code?"}{" "}
            <button
              type="button"
              onClick={handleResendClick}
              disabled={!canResend}
              className={`font-medium ${canResend
                  ? "text-gray-900 hover:text-gray-700"
                  : "cursor-not-allowed text-gray-400"
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
  );
};

export default OtpVerificationForm;