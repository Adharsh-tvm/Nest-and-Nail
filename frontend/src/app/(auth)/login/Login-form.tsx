"use client";

import { ClientSideAuthProtection } from "@/components/containers/HistoryProtection";
import { KeyRound, AtSign, Loader2 } from "lucide-react";
import { login } from "./actions";
import { useActionState } from "react";

type State = {
  error: string | null;
  fields?: {
    email?: string;
  };
};

const initialState: State = {
  error: null,
  fields: {},
};

export const LoginForm = () => {
  const [state, formAction, pending] = useActionState(login, initialState);

  const focusRingClass = "focus:ring-zinc-500";
  const buttonClass = "bg-zinc-100 text-zinc-900 hover:bg-zinc-200";
  const checkboxClass =
    "data-[state=checked]:bg-zinc-700 data-[state=checked]:text-zinc-100";
  const linkClass = "text-zinc-400 hover:text-zinc-200";

  return (
    <>
      <ClientSideAuthProtection />
      <div className="px-6 pb-6">
        <form action={formAction} className="space-y-4">
          {/* Email Input */}
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

          {/* Password Input */}
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

          {/* Options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember-me"
                name="remember"
                disabled={pending}
                className={`h-4 w-4 shrink-0 rounded-sm border border-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50 ${focusRingClass} ${checkboxClass}`}
              />
              <label htmlFor="remember-me" className="text-sm text-zinc-400">
                Remember me
              </label>
            </div>
            <a href="#" className={`text-sm font-medium ${linkClass}`}>
              Forgot password?
            </a>
          </div>

          {/* Error Message */}
          {state?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{state.error}</p>
            </div>
          )}

          {/* Submit Button */}
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

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-700"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-950 px-2 text-zinc-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Auth Button */}
        <div>
          <button
            type="button"
            disabled={pending}
            className="w-full inline-flex justify-center items-center gap-x-3 py-2.5 px-4 font-semibold rounded-lg bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-zinc-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_17_40)">
                <path
                  d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.253v9.0642H37.4346C36.9242 32.0422 35.1818 34.0058 32.7483 35.6197V41.6192H40.2192C44.7856 37.458 47.532 31.571 47.532 24.5528Z"
                  fill="#4285F4"
                />
                <path
                  d="M24.253 48.0001C30.6502 48.0001 36.0526 45.9388 40.2192 42.6192L32.7483 36.6197C30.5633 38.2336 27.6749 39.214 24.253 39.214C17.932 39.214 12.5855 34.8216 10.6518 29.0888H2.97363V35.244C7.03608 43.4353 15.0132 48.0001 24.253 48.0001Z"
                  fill="#34A853"
                />
                <path
                  d="M10.6518 29.0887C10.1742 27.5192 9.88934 25.8679 9.88934 24.1666C9.88934 22.4653 10.1742 20.814 10.6518 19.2445V13.0889H2.97363C1.08203 16.745 0 20.359 0 24.1666C0 27.9742 1.08203 31.5882 2.97363 35.244L10.6518 29.0887Z"
                  fill="#FBBC05"
                />
                <path
                  d="M24.253 9.11932C27.9961 9.11932 30.9839 10.4326 32.6384 11.9965L40.334 4.30078C36.0437 0.509086 30.6502 0 24.253 0C15.0132 0 7.03608 4.56475 2.97363 12.756L10.6518 18.9115C12.5855 13.1788 17.932 9.11932 24.253 9.11932Z"
                  fill="#EB4335"
                />
              </g>
              <defs>
                <clipPath id="clip0_17_40">
                  <rect width="48" height="48" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </>
  );
};
