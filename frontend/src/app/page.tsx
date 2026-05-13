"use client"

import React from 'react';
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  GalleryVerticalEnd,
  ExternalLink,
  Instagram,
  Twitter,
  Linkedin,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';

const App = () => {



  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-white">

      {/* --- NAVIGATION (Simplified: Logo Only) --- */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center md:justify-start h-20 items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-[#0f291e] text-white flex size-10 items-center justify-center rounded-lg shadow-sm">
                <GalleryVerticalEnd size={20} />
              </div>
              <span className="text-2xl font-bold text-[#0f291e] tracking-tight">
                NEST & NAIL
              </span>
            </div>
            {/* No other links or buttons here as requested */}
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-20">

        {/* --- HERO SECTION --- */}
        <section className="relative bg-[#0f291e] overflow-hidden py-24 lg:py-32">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#DC2626] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#DC2626] rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight">
              Home Repair, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DC2626] to-red-400">
                Simplified.
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Stop searching. Start fixing. Join the network that connects homeowners with trusted professionals instantly.
            </p>

            {/* THE GET STARTED BUTTON */}
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-[#DC2626] font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-lg shadow-red-900/30 hover:scale-105 hover:bg-red-700"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="mt-4 text-xs text-gray-500 uppercase tracking-widest">Free to join • No credit card required</p>
          </div>
        </section>

        {/* --- ADS SECTION (Promotional Banners) --- */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0f291e]">Exclusive Offers</h2>
              <p className="text-gray-500 mt-2">Limited time promotions for new members.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

              {/* Ad 1 */}
              <div className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer h-96">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1581578731117-104f885d3254?auto=format&fit=crop&q=80&w=600"
                  alt="Cleaning Ad"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <div className="bg-[#DC2626] w-fit px-3 py-1 rounded-full text-xs font-bold mb-3 flex items-center gap-1">
                    <Sparkles size={12} /> NEW USER PROMO
                  </div>
                  <h3 className="text-2xl font-bold mb-2">50% Off First Cleaning</h3>
                  <p className="text-gray-300 text-sm mb-4">Book a top-rated home cleaner today and cut the cost in half. Valid for first-time users.</p>
                  <span className="inline-block border border-white/30 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-mono tracking-wider">
                    CODE: CLEAN50
                  </span>
                </div>
              </div>

              {/* Ad 2 */}
              <div className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer h-96">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600"
                  alt="Electrical Ad"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f291e]/90 via-[#0f291e]/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <div className="bg-yellow-500 text-black w-fit px-3 py-1 rounded-full text-xs font-bold mb-3 flex items-center gap-1">
                    <Zap size={12} /> FLASH DEAL
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Free Safety Check</h3>
                  <p className="text-gray-300 text-sm mb-4">Get a complimentary electrical safety inspection with any wiring job over $200.</p>
                  <button className="text-[#DC2626] font-bold text-sm hover:text-white transition-colors flex items-center gap-1">
                    Claim Offer <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Ad 3 */}
              <div className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer h-96">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600"
                  alt="Worker Ad"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <div className="bg-blue-500 w-fit px-3 py-1 rounded-full text-xs font-bold mb-3 flex items-center gap-1">
                    <ShieldCheck size={12} /> FOR PROS
                  </div>
                  <h3 className="text-2xl font-bold mb-2">$0 Commission Fees</h3>
                  <p className="text-gray-300 text-sm mb-4">Are you a skilled worker? Join Nest & Nail today and keep 100% of your earnings for the first month.</p>
                  <Link
                    href="/login"
                    className="bg-white text-[#0f291e] px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    Join as a Pro
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* --- FOOTER (Your Custom Design) --- */}
      <footer className="bg-[#0f291e] border-t-4 border-[#DC2626] pt-16 pb-8 text-gray-400 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand & Contact Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white text-[#1B4332] flex size-8 items-center justify-center rounded-lg shadow-sm">
                  <GalleryVerticalEnd size={18} />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  NEST & NAIL
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                Making home maintenance effortless. Professional services delivered to your doorstep.
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 group cursor-pointer">
                  <MapPin className="w-5 h-5 text-[#DC2626] mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm group-hover:text-gray-300 transition-colors">
                    123 Innovation Drive,<br />
                    San Francisco, CA 94103
                  </span>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <Phone className="w-5 h-5 text-[#DC2626] group-hover:scale-110 transition-transform" />
                  <span className="text-sm group-hover:text-gray-300 transition-colors">+1 (888) 555-0123</span>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <Mail className="w-5 h-5 text-[#DC2626] group-hover:scale-110 transition-transform" />
                  <span className="text-sm group-hover:text-gray-300 transition-colors">help@nestandnail.com</span>
                </div>
              </div>
            </div>

            {/* Services Column */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                Services
              </h4>
              <ul className="space-y-4 text-sm">
                {["Home Cleaning", "Plumbing & Water", "Electrical Repairs", "Painting & Decor", "Smart Home Setup"].map((item) => (
                  <li key={item}>
                    <a href="#" className="flex items-center justify-between group hover:text-white transition-colors border-b border-[#1B4332] pb-2">
                      <span>{item}</span>
                      <ExternalLink size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#DC2626]" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-4 text-sm">
                {["Our Story", "Careers", "Partner Program", "Reviews", "Press Kit"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-[#DC2626] hover:pl-2 transition-all duration-300 block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Working Hours & Socials */}
            <div className="bg-[#1B4332]/20 p-6 rounded-2xl border border-[#1B4332]">
              <h4 className="text-white font-bold text-lg mb-4">Working Hours</h4>
              <div className="space-y-3 text-sm mb-8">
                <div className="flex justify-between">
                  <span>Mon - Fri</span>
                  <span className="text-white">8:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-white">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-[#DC2626]">Emergency Only</span>
                </div>
              </div>

              <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Follow Us</h4>
              <div className="flex gap-4">
                {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="bg-[#1B4332] p-2.5 rounded-lg text-white hover:bg-[#DC2626] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#1B4332] flex flex-col md:flex-row justify-between items-center text-xs gap-4">
            <p>© 2024 Nest & Nail Inc. Licensed & Insured.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#DC2626] transition-colors">Privacy Policy</a>
              <span className="text-[#1B4332]">|</span>
              <a href="#" className="hover:text-[#DC2626] transition-colors">Terms of Service</a>
              <span className="text-[#1B4332]">|</span>
              <a href="#" className="hover:text-[#DC2626] transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;