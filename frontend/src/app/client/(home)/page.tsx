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
  UserCheck,
  GalleryVerticalEnd,
  User,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Linkedin,
  Briefcase,
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

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-[#1B4332] text-white flex size-9 items-center justify-center rounded-xl shadow-md group-hover:bg-[#DC2626] transition-colors duration-300">
              <GalleryVerticalEnd size={20} />
            </div>
            <span className="text-2xl font-bold text-[#1B4332] tracking-tight group-hover:text-[#DC2626] transition-colors duration-300">
              NEST & NAIL
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {["Services", "Find Workers", "For Professionals", "Support"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-600 hover:text-[#DC2626] font-medium transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#DC2626] after:transition-all hover:after:w-full"
                >
                  {item}
                </a>
              )
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-[#1B4332] font-semibold hover:text-[#DC2626] transition-colors px-4 py-2">
              Log In
            </button>
            <button className="bg-[#DC2626] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#b91c1c] transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 active:translate-y-0">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#1B4332] p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 animate-in slide-in-from-top-5 z-40 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {["Services", "Find Workers", "For Professionals", "Support"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-red-50 hover:text-[#DC2626] rounded-xl transition-colors"
                >
                  {item}
                </a>
              )
            )}
            <div className="pt-4 flex flex-col gap-3 mt-4 border-t border-gray-100">
              <button className="w-full text-center py-3 border-2 border-[#1B4332] text-[#1B4332] font-bold rounded-xl hover:bg-[#1B4332] hover:text-white transition-colors">
                Log In
              </button>
              <button className="w-full text-center py-3 bg-[#DC2626] text-white font-bold rounded-xl hover:bg-[#b91c1c] transition-colors shadow-lg shadow-red-500/20">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const HeroSection = () => (
  <div className="relative bg-[#1B4332] overflow-hidden">
    {/* Pattern Overlay */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: "radial-gradient(#ffffff 1.5px, transparent 1.5px)",
        backgroundSize: "32px 32px",
      }}
    ></div>

    {/* Abstract Shapes */}
    <div
      className="absolute top-0 right-0 w-[800px] h-[800px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"
      style={{ animationDuration: "10s" }}
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

        {/* Enhanced Search Bar */}
        <div className="bg-white p-2.5 rounded-2xl shadow-2xl shadow-black/20 max-w-3xl mx-auto flex flex-col md:flex-row gap-2 transition-transform hover:scale-[1.01] duration-300">
          <div className="flex-1 flex items-center px-4 h-14 bg-gray-50 rounded-xl md:rounded-r-none md:bg-transparent border-2 border-transparent focus-within:border-[#1B4332]/10 focus-within:bg-white transition-colors">
            <Search className="text-gray-400 mr-3" size={22} />
            <input
              type="text"
              placeholder="What do you need help with?"
              className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium text-lg"
            />
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
          <button className="bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold h-14 px-8 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group whitespace-nowrap">
            Search
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
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

const ServiceCard = ({ icon: Icon, title, count }: ServiceCardProps) => (
  <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.1)] hover:border-red-100 transition-all duration-300 group cursor-pointer h-full flex flex-col items-center text-center">
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

const PopularServices = () => (
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
        <ServiceCard icon={Droplets} title="Plumbing" count="450+" />
        <ServiceCard icon={Zap} title="Electrical" count="320+" />
        <ServiceCard icon={PaintBucket} title="Painting" count="210+" />
        <ServiceCard icon={Hammer} title="Carpentry" count="180+" />
        <ServiceCard icon={Truck} title="Moving" count="150+" />
        <ServiceCard icon={Wrench} title="Repair" count="500+" />
      </div>

      <div className="mt-12 text-center">
        <button className="text-[#1B4332] font-bold border-b-2 border-[#DC2626] hover:text-[#DC2626] pb-1 transition-colors text-lg flex items-center gap-2 mx-auto">
          View All 50+ Categories <ArrowRight size={18} />
        </button>
      </div>
    </div>
  </section>
);

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

const CTASection = () => (
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
        <button className="w-full sm:w-auto bg-[#DC2626] text-white text-lg font-bold px-10 py-4 rounded-xl hover:bg-[#b91c1c] shadow-xl shadow-red-900/30 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2">
          <Search size={20} /> Find a Pro
        </button>
        <button className="w-full sm:w-auto bg-transparent border-2 border-white/20 text-white text-lg font-bold px-10 py-4 rounded-xl hover:bg-white/10 hover:border-white transition-all flex items-center justify-center gap-2">
          <Briefcase size={20} /> Join as a Worker
        </button>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-[#0f291e] pt-20 pb-10 text-gray-400">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="bg-white text-[#1B4332] flex size-8 items-center justify-center rounded-lg shadow-sm">
              <GalleryVerticalEnd size={18} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              NEST & NAIL
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            The most trusted marketplace for home services. We connect you with
            skilled professionals to make your home better, safer, and more
            comfortable.
          </p>
          <div className="flex gap-4">
            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-full bg-[#1B4332] flex items-center justify-center hover:bg-[#DC2626] hover:text-white transition-all duration-300"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Links Columns */}
        <div>
          <h4 className="font-bold text-white mb-6 text-lg">Company</h4>
          <ul className="space-y-4 text-sm">
            {["About Us", "Careers", "Press", "Blog", "Contact"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-[#DC2626] transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 text-lg">
            Popular Services
          </h4>
          <ul className="space-y-4 text-sm">
            {[
              "Plumbing Repair",
              "Electrical Wiring",
              "Home Cleaning",
              "Interior Painting",
              "Furniture Assembly",
            ].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-[#DC2626] transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 text-lg">Get the App</h4>
          <p className="text-sm mb-6">Manage your projects on the go.</p>
          <div className="space-y-3">
            <button className="w-full bg-[#1B4332] hover:bg-[#255c45] text-white py-3 px-4 rounded-xl flex items-center gap-3 transition-colors border border-white/5">
              <div className="text-2xl"></div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-white/60">
                  Download on the
                </div>
                <div className="text-sm font-bold leading-none">App Store</div>
              </div>
            </button>
            <button className="w-full bg-[#1B4332] hover:bg-[#255c45] text-white py-3 px-4 rounded-xl flex items-center gap-3 transition-colors border border-white/5">
              <div className="text-2xl">▶</div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-white/60">
                  Get it on
                </div>
                <div className="text-sm font-bold leading-none">
                  Google Play
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>© 2024 Mendon Inc. All rights reserved.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Sitemap
          </a>
        </div>
      </div>
    </div>
  </footer>
);

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
