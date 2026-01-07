"use client";

import React from "react";
import { User, Bell, Settings, Menu, ChevronLeft, Search, Mail, LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/logout-actions";

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export default function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
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

          {/* Logout Button */}
          {/* Logout Button */}
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="px-5 py-2.5 bg-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2 border border-red-100 shadow-sm"
          >
            <LogOut size={18} /> Logout
          </button>

          {/* Logout Confirmation Modal - Rendered via Portal */}
          {isLogoutModalOpen && (
            <LogoutModal onClose={() => setIsLogoutModalOpen(false)} />
          )}
        </div>
      </div>
    </header>
  );
}

import { createPortal } from "react-dom";

function LogoutModal({ onClose }: { onClose: () => void }) {
  // Ensure we are on the client
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 overflow-hidden animate-in zoom-in-95 fade-in duration-300 border border-gray-100 ring-1 ring-black/5">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-red-100">
          <LogOut className="text-red-500 w-8 h-8" />
        </div>
        <h3 className="text-center text-2xl font-black text-gray-900 mb-2 tracking-tight">Log Out?</h3>
        <p className="text-center text-gray-500 font-medium mb-8 leading-relaxed">
          Are you sure you want to end your session?
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={async () => {
              await logoutAction();
              onClose();
            }}
            className="w-full py-3.5 bg-red-600 text-white font-bold text-base rounded-xl hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-[0.98] transition-all"
          >
            Yes, Log Me Out
          </button>
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-white text-gray-700 font-bold text-base rounded-xl hover:bg-gray-50 border-2 border-gray-100 hover:border-gray-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
