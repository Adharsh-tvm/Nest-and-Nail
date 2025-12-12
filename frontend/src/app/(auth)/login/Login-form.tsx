"use client";

import React, { useEffect, useState } from "react";
import {
  KeyRound,
  AtSign,
  Loader2,
  X,
  Mail,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Lock,
  ChevronLeft,
} from "lucide-react";
import { login } from "../../actions/login-actions";
import { useActionState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { handleGoogleSignIn } from "@/app/actions/google-actions";
import { redirect, useRouter } from "next/navigation";

import {
  forgotPasswordAction,
  verifyResetOtpAction,
  resetPasswordAction,
} from "@/app/actions/otp-actions";
import toast from "react-hot-toast";

// --- Types ---
type State = {
  error?: string | null;
  fields?: {
    email?: string;
  };
  errorId?: number;
  success?: boolean;
  userRole?: string | null;
};

const initialState: State = {
  error: null,
  fields: {},
  errorId: undefined,
  success: false,
  userRole: null,
};

type Step = "EMAIL" | "OTP" | "NEW_PASSWORD" | "SUCCESS";

// --- Multi-Step Forgot Password Dialog ---
const ForgotPasswordDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [step, setStep] = useState<Step>("EMAIL");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Data State
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // optional: countdown for OTP UX
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  if (!isOpen) return null;

  // --- Handlers for each step ---
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await forgotPasswordAction(email);
    setIsLoading(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    // success -> go to OTP step and start cooldown for resend
    setStep("OTP");
    setResendCooldown(60); // 60s cooldown
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await verifyResetOtpAction(email, otp);
    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    // OTP verified: go to new password screen
    setStep("NEW_PASSWORD");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    const result = await resetPasswordAction(
      email,
      newPassword,
      confirmPassword
    );
    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    // password changed
    setStep("SUCCESS");
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setError(null);
    const result = await forgotPasswordAction(email);
    setIsLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setResendCooldown(60);
  };

  // Reset internal state when closing
  const handleClose = () => {
    setStep("EMAIL");
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Back Button (only for OTP and Password steps) */}
        {step !== "EMAIL" && step !== "SUCCESS" && (
          <button
            onClick={() => setStep(step === "NEW_PASSWORD" ? "OTP" : "EMAIL")}
            className="absolute left-4 top-4 text-zinc-500 hover:text-zinc-200 transition-colors flex items-center text-xs uppercase font-bold tracking-wider"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </button>
        )}

        {/* --- STEP 1: ENTER EMAIL --- */}
        {step === "EMAIL" && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-white">
                Reset Password
              </h2>
              <p className="text-sm text-zinc-400">
                Enter your email to receive a verification code.
              </p>
            </div>
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-black"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-2.5 px-4 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send Code"
                )}
              </button>
            </form>
          </div>
        )}

        {/* --- STEP 2: ENTER OTP --- */}
        {step === "OTP" && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-white">Enter Code</h2>
              <p className="text-sm text-zinc-400">
                We sent a code to <span className="text-zinc-200">{email}</span>
              </p>
            </div>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">
                  Verification Code
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-black tracking-widest"
                  />
                </div>
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Verify Code"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading || resendCooldown > 0}
                  className="px-3 py-2 text-sm rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0
                    ? `Resend (${resendCooldown}s)`
                    : "Resend"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- STEP 3: NEW PASSWORD --- */}
        {step === "NEW_PASSWORD" && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-white">New Password</h2>
              <p className="text-sm text-zinc-400">
                Create a strong password for your account.
              </p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-black"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-black"
                  />
                </div>
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Reset Password <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* --- STEP 4: SUCCESS --- */}
        {step === "SUCCESS" && (
          <div className="flex flex-col items-center justify-center space-y-4 py-4 animate-in fade-in zoom-in duration-300">
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Password Changed
            </h2>
            <p className="text-sm text-zinc-400 text-center max-w-[260px]">
              Your password has been updated successfully. You can now login
              with your new credentials.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 w-full py-2.5 px-4 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-semibold rounded-lg"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Login Form Component (Unchanged mostly) ---
export const LoginForm = () => {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(login, initialState);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const focusRingClass = "focus:ring-zinc-500";
  const buttonClass = "bg-zinc-100 text-zinc-900 hover:bg-zinc-200";
  const linkClass = "text-zinc-400 hover:text-zinc-200";

  async function onGoogleSuccess(credentialResponse: any) {
    const token = credentialResponse.credential;
    const result = await handleGoogleSignIn(token, "client");

    if (result?.success) {
      const redirectPath = result.user.user_role;
      redirect(redirectPath);
    } else {
      console.log("Google login error ", result?.message);
    }
  }

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.errorId]);

  useEffect(() => {
    if (state?.success) {
      toast.success("Signed in successfully");

      setTimeout(() => {
        const role = state.userRole ?? "client";
        if (role === "worker") router.push("/worker");
        else if (role === "admin") router.push("/admin");
        else router.push("/client");
      }, 500);
    }
  }, [state?.success]);

  return (
    <>
      <div className="px-6 pb-6">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-400"
            >
              Email
            </label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={pending}
                defaultValue={state.fields?.email ?? ""}
                placeholder="you@example.com"
                className={`w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed ${focusRingClass}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-400"
            >
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={pending}
                placeholder="••••••••"
                className={`w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed ${focusRingClass}`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className={`text-sm font-medium ${linkClass} focus:outline-none hover:underline`}
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className={`w-full py-2.5 px-4 font-semibold rounded-lg transition-transform transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${buttonClass} ${focusRingClass}`}
          >
            {pending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"></div>
        </div>

        <GoogleLogin
          onSuccess={onGoogleSuccess}
          useOneTap
          theme="filled_black"
          shape="circle"
          width="330"
        />
      </div>

      <ForgotPasswordDialog
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
    </>
  );
};

export default LoginForm;
