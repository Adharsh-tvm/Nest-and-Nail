"use client";

import { ClientSideAuthProtection } from "@/components/containers/HistoryProtection";
import { KeyRound, AtSign, Loader2 } from "lucide-react";
import { login } from "../../actions/login-actions";
import { useActionState } from "react";
import GoogleAuthButton from "@/components/ui/GoogleLoginButton";

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
         <GoogleAuthButton />
        </div>
      </div>
    </>
  );
};
