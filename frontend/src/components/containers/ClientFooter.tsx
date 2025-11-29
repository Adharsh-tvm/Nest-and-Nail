"use client"

import { GalleryVerticalEnd, Instagram, Twitter, Linkedin } from "lucide-react";

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
              MENDON
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
        <p>© 2024 MendOn Inc. All rights reserved.</p>
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


export default Footer;