"use client";

import React from "react";
import {
  User,
  Bell,
  Settings,
  Menu,
  ChevronLeft,
  Search,
  Mail,
  LogOut,
} from "lucide-react";

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
        </div>
      </div>
    </header>
  );
}
