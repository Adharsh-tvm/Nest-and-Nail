"use client";

import { LogIn } from "lucide-react";
import { LoginForm } from "./Login-form";

const LoginPage = () => {
  async function handleLogin() {}

  const linkClass = "text-zinc-400 hover:text-zinc-200";

  return (
    <main className="flex items-center justify-center min-h-screen bg-black font-sans p-4">
      <div className="w-full max-w-sm">
        {/* Card Container */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl">
          {/* Card Header */}
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-full">
                {/* Icon is now white/light grey */}
                <LogIn className="h-6 w-6 text-zinc-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Sign in to your account to continue.
            </p>
          </div>

          {/* Card Content */}

          <LoginForm/>

          {/* Card Footer */}
          <div className="p-6 border-t border-zinc-800 text-center text-sm">
            <p className="text-zinc-500">
              Don't have an account?{" "}
              <a href="/signup" className={`font-medium ${linkClass}`}>
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
