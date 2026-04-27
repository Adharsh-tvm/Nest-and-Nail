import SignUpComponent from "@/app/(auth)/signup/signup-form";
import React from "react";
import Image from "next/image";
import { GalleryVerticalEnd, Sparkles, ShieldCheck, Clock } from "lucide-react";

type Props = {};

async function ClientSignup({ }: Props) {
  return (
    <main className="min-h-screen bg-white font-sans flex text-gray-900">
      {/* Left Column - Image & Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0f291e] flex-col justify-between p-12">
        <Image
          src="/images/auth-bg.png"
          alt="Premium home services"
          fill
          className="object-cover opacity-40 mix-blend-overlay"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f291e] via-transparent to-transparent opacity-80" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <GalleryVerticalEnd className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">Nest & Nail</span>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight">
            Premium care for your pristine home.
          </h1>
          <p className="text-lg text-emerald-100/80 leading-relaxed font-medium">
            Join thousands of users who trust our verified professionals for their home maintenance and improvement needs.
          </p>

          <div className="pt-8 flex gap-6">
            <div className="flex flex-col gap-2">
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
              <span className="text-sm font-bold text-white">Verified Pros</span>
            </div>
            <div className="flex flex-col gap-2">
              <Clock className="h-8 w-8 text-emerald-400" />
              <span className="text-sm font-bold text-white">Faster Bookings</span>
            </div>
            <div className="flex flex-col gap-2">
              <Sparkles className="h-8 w-8 text-emerald-400" />
              <span className="text-sm font-bold text-white">Premium Quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form Segment */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md flex flex-col items-center py-10">
          
          {/* Mobile Only Header inside Form Column */}
          <div className="lg:hidden flex items-center gap-3 mb-10 w-full justify-center">
            <div className="p-2.5 bg-[#0f291e] rounded-xl shadow-lg">
              <GalleryVerticalEnd className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black text-[#0f291e] tracking-tight">Nest & Nail</span>
          </div>

          <div className="w-full">
            <SignUpComponent role="client" />
          </div>

        </div>
      </div>
    </main>
  );
}

export default ClientSignup;
