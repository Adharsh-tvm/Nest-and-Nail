"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleGoogleLogin } from "@/app/actions/google-actions";

interface GoogleAuthButtonProps {
  role?: "client" | "worker";
  mode?: "signup" | "login";
}

export default function GoogleAuthButton({ role, mode = "signup" }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError(null);

      try {

        console.log("ifsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssuo",tokenResponse)
        const accessToken = tokenResponse.access_token;

        if (!accessToken) {
          throw new Error("No access token returned from Google");
        }

        // For login mode without specific role, pass undefined
        // Backend will determine role based on existing user
        const userRole = role ? role.toUpperCase() : undefined;
        
        console.log("[GoogleAuthButton] Calling handleGoogleLogin with:", {
          role: userRole,
          mode,
          hasAccessToken: accessToken
        });
        
        const user = await handleGoogleLogin(accessToken, userRole, mode);
        
        console.log("[GoogleAuthButton] User received:", user);

        router.push(user.role === "worker" ? "/worker" : "/client");

      } catch (err: any) {
        console.error("Google authentication error:", err);
        
        // Handle Axios errors
        if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError(err.message || "Google authentication failed. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      setError("Failed to connect to Google. Please try again.");
    },
  });

  const getButtonText = () => {
    if (isLoading) return "Signing in...";
    
    if (mode === "login") {
      return "Sign in with Google";
    }
    
    return role ? `Sign up as ${role} with Google` : "Continue with Google";
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-2 text-zinc-500">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => login()}
        disabled={isLoading}
        className="w-full inline-flex justify-center items-center gap-x-3 py-2.5 px-4 
                   font-semibold rounded-lg bg-zinc-900 border border-zinc-700 
                   text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-offset-black focus:ring-zinc-500 
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
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
        )}

        {getButtonText()}
      </button>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}