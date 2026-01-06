"use client";

import React from "react";
import { User, Bell, Settings, Menu, ChevronLeft, Search, Mail } from "lucide-react";
import { logoutAction } from "@/app/actions/logout-actions";

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export default function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
  return (
    <header className="bg-[#F3F4F6] sticky top-0 z-10 px-4 py-3 lg:px-6 lg:py-4">
      <div className="flex justify-between items-center gap-4">
        {/* Left Side: Mobile Menu & Search */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-600 hover:bg-white rounded-xl transition-colors lg:hidden"
            title="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search Bar */}
          <div className="relative hidden md:block w-full max-w-md">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
             </div>
             <input
               type="text"
               className="block w-full pl-10 pr-3 py-3 border-none rounded-2xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 sm:text-sm shadow-sm"
               placeholder="Search task"
             />
             <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-gray-400 text-xs border border-gray-200 rounded px-1.5 py-0.5">⌘ F</span>
             </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 lg:gap-4">
           {/* Mail */}
           <button className="p-3 bg-white text-gray-600 hover:text-[#1B4332] rounded-full shadow-sm hover:shadow-md transition-all relative hidden sm:flex">
             <Mail className="w-5 h-5" />
           </button>

           {/* Notifications */}
           <button className="p-3 bg-white text-gray-600 hover:text-[#1B4332] rounded-full shadow-sm hover:shadow-md transition-all relative">
             <Bell className="w-5 h-5" />
             <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
           </button>

           {/* Profile */}
           <div className="flex items-center gap-3 pl-2">
              <div className="hidden md:block text-right">
                 <p className="text-sm font-bold text-gray-900">Totok Michael</p>
                 <p className="text-xs text-gray-500">tmichael20@mail.com</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                 <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
              </div>
           </div>
        </div>
      </div>
    </header>
  );
}
