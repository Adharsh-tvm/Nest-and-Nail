"use client";

import React, { useState } from "react";
import {
  Search,
  MapPin,
  Hammer,
  Wrench,
  Zap,
  Droplets,
  PaintBucket,
  Truck,
  Star,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  ShieldCheck,
  Clock,
  Wallet,
  GalleryVerticalEnd,
  User,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Linkedin,
  Briefcase,
  TrendingUp,
  DollarSign
} from "lucide-react";

// --- Theme Constants ---
// Forest Green: #1B4332 (Primary Brand)
// Red Accent:   #DC2626 (Buttons, Highlights)

// --- Types ---
interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  count: string;
}

// --- Components ---

const HeroSection = () => (
  <div className="relative bg-[#0f291e] overflow-hidden">
    {/* Pattern Overlay */}
    <div
      className="absolute inset-0 opacity-5"
      style={{
        backgroundImage: "linear-gradient(45deg, #ffffff 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    ></div>

    {/* Abstract Shapes */}
    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#1B4332] opacity-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#DC2626] opacity-10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
      <div className="text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md text-green-100 text-sm font-medium mb-8 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
          Now recruiting in your area
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight">
          Work on your terms. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ADE80] to-[#22c55e] drop-shadow-sm">
            Get paid faster.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          Stop chasing leads. We connect you with homeowners who are ready to hire. 
          Set your schedule, pick your price, and build your reputation.
        </p>

        {/* Enhanced Search Bar for Jobs */}
        <div className="bg-white p-2.5 rounded-2xl shadow-2xl shadow-black/20 max-w-3xl mx-auto flex flex-col md:flex-row gap-2 transition-transform hover:scale-[1.01] duration-300">
          <div className="flex-1 flex items-center px-4 h-14 bg-gray-50 rounded-xl md:rounded-r-none md:bg-transparent border-2 border-transparent focus-within:border-[#1B4332]/10 focus-within:bg-white transition-colors">
            <Briefcase className="text-gray-400 mr-3" size={22} />
            <select
              className="w-full bg-transparent outline-none text-gray-800 font-medium text-lg appearance-none cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>Select your trade...</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="cleaning">Cleaning</option>
              <option value="carpentry">Carpentry</option>
            </select>
          </div>
          <div className="w-px bg-gray-200 hidden md:block h-8 self-center"></div>
          <div className="flex-[0.6] flex items-center px-4 h-14 bg-gray-50 rounded-xl md:rounded-none md:bg-transparent border-2 border-transparent focus-within:border-[#1B4332]/10 focus-within:bg-white transition-colors">
            <MapPin className="text-[#DC2626] mr-3" size={22} />
            <input
              type="text"
              placeholder="Zip Code"
              className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium text-lg"
            />
          </div>
          <button className="bg-[#1B4332] hover:bg-[#143225] text-white font-bold h-14 px-8 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group whitespace-nowrap">
            Find Jobs
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { icon: TrendingUp, label: "Jobs Posted Daily", value: "2,500+" },
            { icon: Wallet, label: "Avg. Pro Earnings", value: "$85/hr" },
            { icon: CheckCircle2, label: "Payment Guarantee", value: "100%" },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 group">
              <div className="flex items-center gap-2 text-white font-bold text-2xl group-hover:text-[#4ADE80] transition-colors">
                <stat.icon
                  className="text-[#DC2626] group-hover:scale-110 transition-transform"
                  size={24}
                />
                {stat.value}
              </div>
              <span className="text-gray-400 text-sm font-medium uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ServiceCard = ({ icon: Icon, title, count }: ServiceCardProps) => (
  <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(27,67,50,0.1)] hover:border-green-100 transition-all duration-300 group cursor-pointer h-full flex flex-col items-center text-center">
    <div className="w-16 h-16 bg-[#F3F4F6] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#1B4332] group-hover:rotate-3 transition-all duration-300 ease-out">
      <Icon
        size={32}
        className="text-[#DC2626] group-hover:text-white transition-colors duration-300"
      />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#1B4332] transition-colors">
      {title}
    </h3>
    <p className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full group-hover:bg-green-50 group-hover:text-green-700 transition-colors">
      {count} Active Jobs
    </p>
  </div>
);

const HighDemandJobs = () => (
  <section className="py-24 bg-[#F9FAFB]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <span className="text-[#DC2626] font-bold text-sm uppercase tracking-wider mb-2 block">
          Market Insights
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#1B4332] mb-6">
          High Demand Categories
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          We have homeowners looking for these skills right now. Sign up today and start bidding.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <ServiceCard icon={Droplets} title="Plumbing" count="120+" />
        <ServiceCard icon={Zap} title="Electrical" count="85+" />
        <ServiceCard icon={PaintBucket} title="Painting" count="64+" />
        <ServiceCard icon={Hammer} title="Carpentry" count="50+" />
        <ServiceCard icon={Truck} title="Moving" count="42+" />
        <ServiceCard icon={Wrench} title="HVAC" count="95+" />
      </div>
    </div>
  </section>
);

const HowItWorksWorker = () => (
  <section className="py-24 bg-white relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        
        <div className="relative">
          {/* Decorative Background for Card */}
          <div className="absolute inset-0 bg-[#DC2626] rounded-[2.5rem] -rotate-3 opacity-5 scale-105"></div>

          {/* Main App-like Card */}
          <div className="bg-white border border-gray-100 shadow-2xl rounded-[2rem] p-8 relative z-10 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-[#1B4332] text-xl">My Dashboard</h3>
              <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live
              </span>
            </div>

            {/* Mock Dashboard Earnings */}
            <div className="bg-[#1B4332] rounded-xl p-6 text-white mb-6">
                <div className="text-sm opacity-80 mb-1">This Week's Earnings</div>
                <div className="text-3xl font-bold flex items-center gap-2">
                    $1,240.50 <TrendingUp size={20} className="text-[#4ADE80]" />
                </div>
            </div>

            {/* Mock Job Leads */}
            <div className="space-y-4">
              <div className="text-sm font-bold text-gray-400 uppercase">New Leads Near You</div>
              {[
                {
                  title: "Leaky Faucet Repair",
                  loc: "Downtown • 2.5mi",
                  budget: "Est. $150",
                  urgent: true
                },
                {
                  title: "Full Bath Remodel",
                  loc: "Westside • 5.0mi",
                  budget: "Est. $4,000",
                  urgent: false
                },
              ].map((job, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-[#1B4332] group-hover:text-white transition-colors">
                    <Wrench size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 group-hover:text-[#1B4332] transition-colors">
                      {job.title}
                    </div>
                    <div className="text-xs text-gray-500">{job.loc}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#DC2626] text-sm">{job.budget}</div>
                    {job.urgent && <div className="text-[10px] font-bold text-[#DC2626] bg-red-50 inline-block px-1 rounded">URGENT</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1B4332] mb-8 leading-tight">
            Focus on the work, <br />
            <span className="text-[#DC2626] decoration-4 underline underline-offset-4 decoration-gray-200">
              we handle the rest.
            </span>
          </h2>

          <div className="space-y-10">
            {[
              {
                title: "Create your Pro Profile",
                desc: "Showcase your skills, upload photos of past work, and set your service area. It's free to join.",
                step: "01",
              },
              {
                title: "Get Matched with Leads",
                desc: "We send you jobs that match your expertise. You choose which ones to accept.",
                step: "02",
              },
              {
                title: "Get Paid Instantly",
                desc: "Complete the job and get paid directly to your bank account. No chasing invoices.",
                step: "03",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 group">
                <div className="flex-shrink-0 w-14 h-14 bg-white border-2 border-[#E5E7EB] text-[#1B4332] rounded-2xl flex items-center justify-center font-black text-xl shadow-sm group-hover:bg-[#1B4332] group-hover:text-white group-hover:border-[#1B4332] transition-all duration-300">
                  {item.step}
                </div>
                <div className="pt-2">
                  <h4 className="text-xl font-bold text-[#1B4332] mb-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed max-w-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);



const WorkerHomePage = () => {
  return (
    <div className="min-h-screen font-sans bg-white text-gray-900 selection:bg-[#DC2626] selection:text-white">
      <HeroSection />
      <HighDemandJobs />
      <HowItWorksWorker />
    </div>
  );
};

export default WorkerHomePage;