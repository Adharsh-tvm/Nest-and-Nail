"use client";

import * as React from "react";
import { useActionState, useState, useEffect, useRef } from "react";
import {
  User,
  Wrench,
  Shield,
  KeyRound,
  AtSign,
  Loader2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  signup,
  completeSignup,
  resendOtp,
} from "../../actions/authentication/signup-actions";
import OtpVerificationForm from "../otp/page";
import { redirect, useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { handleGoogleSignIn } from "@/app/actions/authentication/google-actions";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";

const roleConfig = {
  client: {
    icon: <User className="h-6 w-6 text-yellow-600" />,
    buttonClass:
      "bg-[#0f291e] text-white hover:bg-[#1B4332] shadow-lg shadow-green-900/20",
    focusRingClass: "focus:ring-[#0f291e]",
    checkboxClass:
      "data-[state=checked]:bg-[#0f291e] data-[state=checked]:text-white",
    linkClass: "text-yellow-600 hover:text-yellow-700",
    badgeClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  worker: {
    icon: <Wrench className="h-6 w-6 text-green-600" />,
    buttonClass:
      "bg-[#0f291e] text-white hover:bg-[#1B4332] shadow-lg shadow-green-900/20",
    focusRingClass: "focus:ring-[#0f291e]",
    checkboxClass:
      "data-[state=checked]:bg-[#0f291e] data-[state=checked]:text-white",
    linkClass: "text-green-600 hover:text-green-700",
    badgeClass: "bg-green-50 text-green-700 border-green-200",
  },
  admin: {
    icon: <Shield className="h-6 w-6 text-teal-600" />,
    buttonClass:
      "bg-[#0f291e] text-white hover:bg-[#1B4332] shadow-lg shadow-green-900/20",
    focusRingClass: "focus:ring-[#0f291e]",
    checkboxClass:
      "data-[state=checked]:bg-[#0f291e] data-[state=checked]:text-white",
    linkClass: "text-teal-600 hover:text-teal-700",
    badgeClass: "bg-teal-50 text-teal-700 border-teal-200",
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

  const passwordCaptureRef = useRef<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  const currentRoleConfig = roleConfig[role];
  const roleName = role.charAt(0).toUpperCase() + role.slice(1);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;

    console.log("[SignUpComponent] Form submit - capturing password:", {
      hasPassword: !!password,
      length: password?.length,
      preview: password ? password.substring(0, 3) + "..." : "[EMPTY]",
    });

    passwordCaptureRef.current = password;
  };

  useEffect(() => {
    if (state.errorId && state.error) {
      toast.error(state.error);
    }
  }, [state.errorId]);

  useEffect(() => {
    if (state.otpSent) {
      toast.success("OTP sent to your email!");
    }
  }, [state.otpSent]);

  useEffect(() => {
    if (state.otpSent && state.fields) {
      const capturedData = {
        name: state.fields.name || "",
        email: state.fields.email || "",
        password: passwordCaptureRef.current,
        role: role,
      };

      console.log(
        "[SignUpComponent] Capturing signup data from state.fields:",
        {
          ...capturedData,
          password: capturedData.password
            ? `[${capturedData.password.length} chars]`
            : "[EMPTY]",
          ACTUAL_PASSWORD_DEBUG: capturedData.password,
        }
      );

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
      password: signupData.password
        ? `[${signupData.password.length} chars]`
        : "[EMPTY]",
      otp: otp ? `[${otp.length} chars]` : "[EMPTY]",
      ACTUAL_PASSWORD_DEBUG: signupData.password,
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

      console.log(
        "[SignUpComponent CLIENT] Calling completeSignup with payload:",
        {
          ...payload,
          password: payload.password
            ? `[${payload.password.length} chars]`
            : "[EMPTY]",
          ACTUAL_PASSWORD_DEBUG: payload.password,
        }
      );

      const result = await completeSignup(payload);

      if (result.success) {
        if (signupData.role === "worker") {
          if (result.isVerified === "VERIFIED") {
            router.replace("/worker");
          } else {
            router.replace("/worker/documents");
          }
        } else {
          router.replace("/client");
        }
      } else {
        toast.error(result.error || "Verification failed");
      }
    } catch (err) {
      console.error("[SignUpComponent] Verification error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsVerifying(false);
    }
  };

  async function onGoogleSuccess(credentialResponse: any) {
    const token = credentialResponse.credential;

    const result = await handleGoogleSignIn(token, role);

    if (result?.success) {
      const redirectPath = result.user.user_role;
      toast.success(result?.message)
      redirect(redirectPath);
    } else {
      toast.error("Google login error")
      console.log("Google login error");
    }
  }

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

  const inputClass = `w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-all ${currentRoleConfig.focusRingClass}`;

  return (
    <>
      {/* <Toaster /> */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        <div className="w-full">
          <div className="p-6 pb-0 text-center">
            <div className="flex justify-center mb-4">
              <div
                className={`p-2.5 rounded-xl shadow-md border ${currentRoleConfig.badgeClass}`}
              >
                {currentRoleConfig.icon}
              </div>
            </div>
            <h1 className="text-xl font-bold text-[#0f291e]">
              Create {roleName} Account
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Join us by filling out the form below.
            </p>
          </div>

          <div className="px-6 pb-6 pt-4">
            <form
              ref={formRef}
              action={formAction}
              onSubmit={handleFormSubmit}
              data-signup-form
              className="space-y-3"
            >
              {/* Hidden field for role */}
              <input type="hidden" name="role" value={role} />

              <div className="space-y-1.5">
                <label
                  htmlFor={`fullName-signup-${role}`}
                  className="text-xs font-bold text-gray-700"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id={`fullName-signup-${role}`}
                    name="name"
                    type="text"
                    required
                    disabled={pending}
                    defaultValue={state.fields?.name ?? ""}
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor={`email-signup-${role}`}
                  className="text-xs font-bold text-gray-700"
                >
                  Email
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id={`email-signup-${role}`}
                    name="email"
                    type="email"
                    required
                    disabled={pending}
                    defaultValue={state.fields?.email ?? ""}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor={`password-signup-${role}`}
                  className="text-xs font-bold text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id={`password-signup-${role}`}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    disabled={pending}
                    placeholder="••••••••"
                    className={`${inputClass} pr-10`}
                  />
                  {passwordValue && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor={`confirm-password-signup-${role}`}
                  className="text-xs font-bold text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id={`confirm-password-signup-${role}`}
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPasswordValue}
                    onChange={(e) => setConfirmPasswordValue(e.target.value)}
                    disabled={pending}
                    placeholder="••••••••"
                    className={`${inputClass} pr-10`}
                  />
                  {confirmPasswordValue && (
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={pending}
                className={`w-full py-2.5 px-4 font-bold rounded-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${currentRoleConfig.buttonClass} ${currentRoleConfig.focusRingClass}`}
              >
                {pending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending OTP...
                  </span>
                ) : (
                  `Sign Up`
                )}
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-400 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center w-full">
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                useOneTap
                theme="outline"
                shape="circle"
                width="330"
              />
            </div>
          </div>

          <div className="p-4 pt-0 pb-6 text-center text-xs bg-white">
            <p className="text-gray-500">
              Already have an account?{" "}
              <a
                href="/login"
                className={`font-bold ${currentRoleConfig.linkClass} transition-colors`}
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </motion.div>

      {showOtpModal && signupData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1 rounded-full hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-6">
                <OtpVerificationForm
                  email={signupData.email}
                  onVerify={handleVerifyOtp}
                  onResend={handleResendOtp}
                />
              </div>
            </div>

            {otpError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg shadow-sm">
                <p className="text-sm text-red-600 text-center font-medium">
                  {otpError}
                </p>
              </div>
            )}

            {isVerifying && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-xl flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#DC2626] mx-auto" />
                  <p className="text-gray-900 mt-4 text-sm font-medium">
                    Verifying OTP...
                  </p>
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
