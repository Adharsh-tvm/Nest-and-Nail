"use client";

import * as React from "react";
import { useActionState, useState, useEffect, useRef } from "react";
import { User, Wrench, Shield, KeyRound, AtSign, Loader2, X } from "lucide-react";
import { signup, completeSignup, resendOtp } from "../../actions/signup-actions";
import OtpVerificationForm from "../otp/page";
import { useRouter } from "next/navigation";
import GoogleAuthButton from "@/components/ui/GoogleLoginButton";

type Role = "client" | "worker" | "admin";

const roleConfig = {
  client: {
    icon: <User className="h-6 w-6 text-yellow-400" />,
    buttonClass: "bg-yellow-500 text-gray-900 hover:bg-yellow-500/90",
    focusRingClass: "focus:ring-yellow-500",
    checkboxClass:
      "data-[state=checked]:bg-yellow-500 data-[state=checked]:text-gray-900",
    linkClass: "text-yellow-500 hover:text-yellow-400",
  },
  worker: {
    icon: <Wrench className="h-6 w-6 text-green-400" />,
    buttonClass: "bg-green-500 text-gray-900 hover:bg-green-500/90",
    focusRingClass: "focus:ring-green-500",
    checkboxClass:
      "data-[state=checked]:bg-green-500 data-[state=checked]:text-gray-900",
    linkClass: "text-green-500 hover:text-green-400",
  },
  admin: {
    icon: <Shield className="h-6 w-6 text-teal-400" />,
    buttonClass: "bg-teal-500 text-gray-900 hover:bg-teal-500/90",
    focusRingClass: "focus:ring-teal-500",
    checkboxClass:
      "data-[state=checked]:bg-teal-500 data-[state=checked]:text-gray-900",
    linkClass: "text-teal-500 hover:text-teal-400",
  },
};

type State = Awaited<ReturnType<typeof signup>>;

const initialState: State = { error: null, fields: {} };

const SignUpComponent = ({ role }: { role: "client" | "worker" }) => {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(signup, initialState);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [signupData, setSignupData] = useState<{
    name: string;
    email: string;
    password: string;
    role: "client" | "worker";
  } | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // ✅ Store password in a ref that persists across renders
  const passwordCaptureRef = useRef<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  const currentRoleConfig = roleConfig[role];
  const roleName = role.charAt(0).toUpperCase() + role.slice(1);

  // ✅ Handle form submission to capture password BEFORE it's cleared
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Capture password immediately before form processing
    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    
    console.log("[SignUpComponent] Form submit - capturing password:", {
      hasPassword: !!password,
      length: password?.length,
      preview: password ? password.substring(0, 3) + "..." : "[EMPTY]"
    });
    
    passwordCaptureRef.current = password;
    
  
  };

  // When OTP is sent successfully, use the captured password
  useEffect(() => {
    if (state.otpSent && state.fields) {
      const capturedData = {
        name: state.fields.name || "",
        email: state.fields.email || "",
        password: passwordCaptureRef.current, // Use the captured password
        role: role,
      };

      console.log("[SignUpComponent] Capturing signup data from state.fields:", {
        ...capturedData,
        password: capturedData.password ? `[${capturedData.password.length} chars]` : "[EMPTY]",
        ACTUAL_PASSWORD_DEBUG: capturedData.password
      });

      setSignupData(capturedData);
      setShowOtpModal(true);
    }
  }, [state.otpSent, state.fields, role]);

  const handleVerifyOtp = async (otp: string) => {
    if (!signupData) {
      console.error("[SignUpComponent] No signup data available");
      return;
    }

    // 🔍 CRITICAL DEBUG: Log exactly what we're sending
    console.log("[SignUpComponent CLIENT] Verifying OTP with data:", {
      ...signupData,
      password: signupData.password ? `[${signupData.password.length} chars]` : "[EMPTY]",
      otp: otp ? `[${otp.length} chars]` : "[EMPTY]",
      ACTUAL_PASSWORD_DEBUG: signupData.password
    });

    setIsVerifying(true);
    setOtpError(null);

    try {
      const payload = {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        role: signupData.role,
        otp: otp,
      };

      console.log("[SignUpComponent CLIENT] Calling completeSignup with payload:", {
        ...payload,
        password: payload.password ? `[${payload.password.length} chars]` : "[EMPTY]",
        ACTUAL_PASSWORD_DEBUG: payload.password
      });

      const result = await completeSignup(payload);

      if (result.success) {
        if (signupData.role === "worker") {
          if (result.isVerified) {
            router.push("/worker");
          } else {
            router.push("/worker/documents");
          }
        } else {
          router.push("/client");
        }
      } else {
        setOtpError(result.error || "Verification failed");
      }
    } catch (err) {
      console.error("[SignUpComponent] Verification error:", err);
      setOtpError("An unexpected error occurred");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!signupData?.email) return;

    setOtpError(null);

    try {
      const result = await resendOtp(signupData.email, role);

      if (!result.success) {
        setOtpError(result.error || "Failed to resend OTP");
      }
    } catch (err) {
      setOtpError("Failed to resend OTP");
    }
  };

  const handleCloseModal = () => {
    setShowOtpModal(false);
    setSignupData(null);
    setOtpError(null);
    passwordCaptureRef.current = "";
  };

  return (
    <>
      <div className="w-full max-w-sm">
        <div className="bg-black border border-zinc-800 rounded-xl shadow-2xl">
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-full">
                {currentRoleConfig.icon}
              </div>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100">
              Create {roleName} Account
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Join us by filling out the form below.
            </p>
          </div>

          <div className="px-6 pb-6">
            <form 
              ref={formRef}
              action={formAction} 
              onSubmit={handleFormSubmit}
              data-signup-form 
              className="space-y-4"
            >
              {/* Hidden field for role */}
              <input type="hidden" name="role" value={role} />

              <div className="space-y-2">
                <label
                  htmlFor={`fullName-signup-${role}`}
                  className="text-sm font-medium text-zinc-400"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    id={`fullName-signup-${role}`}
                    name="name"
                    type="text"
                    required
                    disabled={pending}
                    defaultValue={state.fields?.name ?? ""}
                    placeholder="John Doe"
                    className={`w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed ${currentRoleConfig.focusRingClass}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor={`email-signup-${role}`}
                  className="text-sm font-medium text-zinc-400"
                >
                  Email
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    id={`email-signup-${role}`}
                    name="email"
                    type="email"
                    required
                    disabled={pending}
                    defaultValue={state.fields?.email ?? ""}
                    placeholder="you@example.com"
                    className={`w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed ${currentRoleConfig.focusRingClass}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor={`password-signup-${role}`}
                  className="text-sm font-medium text-zinc-400"
                >
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    id={`password-signup-${role}`}
                    name="password"
                    type="password"
                    required
                    disabled={pending}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed ${currentRoleConfig.focusRingClass}`}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor={`confirm-password-signup-${role}`}
                  className="text-sm font-medium text-zinc-400"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    id={`confirm-password-signup-${role}`}
                    name="confirmPassword"
                    type="password"
                    required
                    disabled={pending}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed ${currentRoleConfig.focusRingClass}`}
                  />
                </div>
              </div>

              {state?.error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">{state.error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={pending}
                className={`w-full py-2.5 px-4 font-semibold rounded-lg transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${currentRoleConfig.buttonClass} ${currentRoleConfig.focusRingClass}`}
              >
                {pending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending OTP...
                  </span>
                ) : (
                  `Sign Up as ${roleName}`
                )}
              </button>
            </form>

            <div className="mt-4">
              <GoogleAuthButton role={role} mode="signup" />
            </div>
          </div>

          <div className="p-6 border-t border-zinc-800 text-center text-sm">
            <p className="text-zinc-500">
              Already have an account?{" "}
              <a
                href="/login"
                className={`font-medium ${currentRoleConfig.linkClass} transition-colors`}
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>

      {showOtpModal && signupData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={handleCloseModal}
              className="absolute -top-12 right-0 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="h-8 w-8" />
            </button>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
              <OtpVerificationForm
                email={signupData.email}
                onVerify={handleVerifyOtp}
                onResend={handleResendOtp}
              />
            </div>

            {otpError && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400 text-center">{otpError}</p>
              </div>
            )}

            {isVerifying && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-white mx-auto" />
                  <p className="text-white mt-4 text-sm">Verifying OTP...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SignUpComponent;