"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Hammer,
  Wrench,
  Zap,
  Droplets,
  PaintBucket,
  Truck,
  ArrowRight,
  ShieldCheck,
  Clock,
  UserCheck,
} from "lucide-react";

// --- Theme Constants ---
// Forest Green: #1B4332 (Primary Brand, Headings, Footer)
// Red Accent:   #DC2626 (Buttons, Highlights, Step Indicators, Hovers)
// White:        #FFFFFF (Cards, Backgrounds)
// Light Gray:   #F9FAFB (Section Backgrounds)

// --- Types ---
interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  count: string;
}

// --- Components ---

const HeroSection = () => {
  const router = useRouter();

  return (
    <div className="relative bg-[#1B4332] overflow-hidden">
      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#DC2626] opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-medium mb-8 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse"></span>
            #1 Home Service Platform in 2024
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight">
            Home Services, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#FF8787] drop-shadow-sm">
              Done Right.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            From leaky faucets to full renovations, connect with vetted local
            experts who treat your home like their own.
          </p>

          {/* Search CTA Button */}
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/client/workers")}
              className="bg-[#DC2626] hover:bg-[#b91c1c] text-white font-extrabold text-lg md:text-xl h-16 px-10 rounded-2xl shadow-xl shadow-red-950/20 transition-all hover:scale-105 hover:-translate-y-0.5 active:translate-y-0 active:scale-100 flex items-center justify-center gap-3 group duration-300"
            >
              <Search size={22} />
              Search Workers
              <ArrowRight
                size={22}
                className="group-hover:translate-x-1.5 transition-transform duration-300"
              />
            </button>
          </div>

        {/* Stats Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { icon: ShieldCheck, label: "Verified Pros", value: "15k+" },
            { icon: Clock, label: "Avg. Response", value: "< 2 mins" },
            { icon: UserCheck, label: "Happy Customers", value: "1.5M+" },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 group">
              <div className="flex items-center gap-2 text-white font-bold text-2xl group-hover:text-[#FF6B6B] transition-colors">
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
};

const ServiceCard = ({ icon: Icon, title, count, onClick }: ServiceCardProps & { onClick?: () => void }) => (
  <div
    onClick={onClick}
    className="bg-white border border-gray-100 p-6 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.1)] hover:border-red-100 transition-all duration-300 group cursor-pointer h-full flex flex-col items-center text-center"
  >
    <div className="w-16 h-16 bg-[#F3F4F6] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#DC2626] group-hover:rotate-3 transition-all duration-300 ease-out">
      <Icon
        size={32}
        className="text-[#1B4332] group-hover:text-white transition-colors duration-300"
      />
    </div>
    <h3 className="text-lg font-bold text-[#1B4332] mb-2 group-hover:text-[#DC2626] transition-colors">
      {title}
    </h3>
    <p className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
      {count} Professionals
    </p>
  </div>
);

const PopularServices = () => {
  const router = useRouter();

  return (
    <section className="py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#DC2626] font-bold text-sm uppercase tracking-wider mb-2 block">
            Our Expertise
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1B4332] mb-6">
            Popular Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            From quick fixes to major renovations, find the right expert for every
            job in your local area.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <ServiceCard icon={Droplets} title="Plumbing" count="450+" onClick={() => router.push("/client/workers?category=PLUMBING")} />
          <ServiceCard icon={Zap} title="Electrical" count="320+" onClick={() => router.push("/client/workers?category=ELECTRICAL")} />
          <ServiceCard icon={PaintBucket} title="Painting" count="210+" onClick={() => router.push("/client/workers?category=PAINTING")} />
          <ServiceCard icon={Hammer} title="Carpentry" count="180+" onClick={() => router.push("/client/workers?category=CARPENTRY")} />
          <ServiceCard icon={Truck} title="Moving" count="150+" onClick={() => router.push("/client/workers?category=MOVING")} />
          <ServiceCard icon={Wrench} title="Repair" count="500+" onClick={() => router.push("/client/workers?category=REPAIR")} />
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => router.push("/client/workers")}
            className="text-[#1B4332] font-bold border-b-2 border-[#DC2626] hover:text-[#DC2626] pb-1 transition-colors text-lg flex items-center gap-2 mx-auto"
          >
            View All 50+ Categories <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => (
  <section className="py-24 bg-white relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="order-2 lg:order-1 relative">
          {/* Decorative Background for Card */}
          <div className="absolute inset-0 bg-[#1B4332] rounded-[2.5rem] rotate-3 opacity-5 scale-105"></div>

          {/* Main App-like Card */}
          <div className="bg-white border border-gray-100 shadow-2xl rounded-[2rem] p-8 relative z-10 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-[#1B4332] text-xl">New Request</h3>
              <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">
                Active
              </span>
            </div>

            {/* Mock Card Items */}
            <div className="space-y-4">
              {[
                {
                  name: "Mike's Plumbing",
                  role: "Top Rated Pro",
                  price: "$85/hr",
                  icon: Wrench,
                  color: "bg-blue-100 text-blue-600",
                },
                {
                  name: "Speedy Fix",
                  role: "Available Now",
                  price: "$90/hr",
                  icon: Zap,
                  color: "bg-yellow-100 text-yellow-600",
                },
                {
                  name: "Green Clean",
                  role: "Eco Friendly",
                  price: "$60/hr",
                  icon: Droplets,
                  color: "bg-green-100 text-green-600",
                },
              ].map((pro, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-red-100 hover:bg-red-50/30 transition-all cursor-pointer group"
                >
                  <div
                    className={`w-12 h-12 ${pro.color} rounded-full flex items-center justify-center`}
                  >
                    <pro.icon size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 group-hover:text-[#DC2626] transition-colors">
                      {pro.name}
                    </div>
                    <div className="text-xs text-gray-500">{pro.role}</div>
                  </div>
                  <div className="ml-auto font-bold text-[#1B4332]">
                    {pro.price}
                  </div>
                </div>
              ))}
            </div>

            {/* Floating "Hired" Badge */}
            <div className="absolute top-1/2 right-10 bg-[#DC2626] text-white px-6 py-3 rounded-xl shadow-lg shadow-red-500/30 font-bold rotate-12 animate-in zoom-in duration-500 delay-500">
              HIRED!
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1B4332] mb-8 leading-tight">
            Hiring made <br />
            <span className="text-[#DC2626] decoration-4 underline underline-offset-4 decoration-gray-200">
              simple & secure.
            </span>
          </h2>

          <div className="space-y-10">
            {[
              {
                title: "Post your request",
                desc: "Describe what you need, attach photos, and set your location.",
                step: "01",
              },
              {
                title: "Compare Professionals",
                desc: "Receive competitive bids and view detailed profiles and reviews.",
                step: "02",
              },
              {
                title: "Hire & Relax",
                desc: "Choose the best fit. Payment is held securely until the job is done.",
                step: "03",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 group">
                <div className="flex-shrink-0 w-14 h-14 bg-white border-2 border-[#E5E7EB] text-[#DC2626] rounded-2xl flex items-center justify-center font-black text-xl shadow-sm group-hover:bg-[#DC2626] group-hover:text-white group-hover:border-[#DC2626] transition-all duration-300">
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

const CTASection = () => {
  const router = useRouter();

  return (
    <section className="py-24 bg-[#1B4332] relative overflow-hidden isolate">
      {/* Complex Background Elements */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#DC2626] opacity-10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#4ADE80] opacity-5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/3"></div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">
          Ready to <span className="text-[#DC2626]">Fix It?</span>
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join thousands of homeowners and professionals who are changing the way
          home services are done.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => router.push("/client/workers")}
            className="w-full sm:w-auto bg-[#DC2626] text-white text-lg font-bold px-10 py-4 rounded-xl hover:bg-[#b91c1c] shadow-xl shadow-red-900/30 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <Search size={20} /> Find a Pro
          </button>
        
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen font-sans bg-white text-gray-900 selection:bg-[#DC2626] selection:text-white">
      <HeroSection />
      <PopularServices />
      <HowItWorks />
      <CTASection />
    </div>
  );
};

export default HomePage;
