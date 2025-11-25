"use client";

import { KeyRound, AtSign, Loader2 } from "lucide-react";
import { login } from "../../actions/login-actions";
import { useActionState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { handleGoogleSignIn } from "@/app/actions/google-actions";
import { redirect, useRouter } from "next/navigation";

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
  const router = useRouter();
  const [state, formAction, pending] = useActionState(login, initialState);

  const focusRingClass = "focus:ring-zinc-500";
  const buttonClass = "bg-zinc-100 text-zinc-900 hover:bg-zinc-200";
  const checkboxClass =
    "data-[state=checked]:bg-zinc-700 data-[state=checked]:text-zinc-100";
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

  return (
    <>
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
            <div className="flex items-center  space-x-2">
            <a href="#" className={`text-sm font-medium ${linkClass}`}>
              Forgot password?
            </a>
            </div>
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
          <div className="absolute inset-0 flex items-center"></div>
        </div>

        {/* Google Auth Button */}

                      <GoogleLogin
                        onSuccess={onGoogleSuccess}
                        useOneTap
                        theme="filled_black"
                        shape="circle"
                        width="330"
                      />
      </div>
    </>
  );
};
