"use client";

import * as React from "react";
import { useActionState } from "react";
import { User, Wrench, Shield, KeyRound, AtSign, Loader2 } from "lucide-react";
import { signup } from "./actions";

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
  const [state, formAction, pending] = useActionState(signup, initialState);

  const currentRoleConfig = roleConfig[role];
  const roleName = role.charAt(0).toUpperCase() + role.slice(1);

  return (
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
          <form action={formAction} className="space-y-4">
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
                  Creating {roleName} Account...
                </span>
              ) : (
                `Sign Up as ${roleName}`
              )}
            </button>
          </form>
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
  );
};

export default SignUpComponent;