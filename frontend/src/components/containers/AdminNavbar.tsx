"use client";

import React from "react";
import { User, Bell, Settings, Menu, ChevronLeft } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export default function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Toggle Button - Desktop & Mobile */}
          <button
            onClick={onMenuClick}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors hidden lg:flex"
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
            title="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
            <p className="text-sm text-slate-500 hidden sm:block">
              Manage your service booking platform
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notifications - Hidden on mobile */}
          <button className="hidden sm:flex items-center justify-center p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Settings - Hidden on mobile */}
          <button className="hidden sm:flex items-center justify-center p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {/* Profile - Desktop */}
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">Profile</span>
          </button>

          {/* Mobile Profile Icon */}
          <button className="sm:hidden p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
            <User className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
