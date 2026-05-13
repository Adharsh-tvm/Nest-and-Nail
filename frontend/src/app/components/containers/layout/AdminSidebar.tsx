"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Wrench,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Wallet,
  LogOut,
  Settings,
  HelpCircle,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/authentication/logout-actions";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  { id: "clients", label: "Clients", icon: Users, href: "/admin/users" },
  {
    id: "categories",
    label: "Categories",
    icon: Briefcase,
    href: "/admin/categories",
  },
  {
    id: "services",
    label: "Services",
    icon: Wrench,
    href: "/admin/services",
  },
  {
    id: "meetings",
    label: "Meetings",
    icon: Calendar,
    href: "/admin/meetings",
  },
  {
    id: "verification",
    label: "Verification",
    icon: ShieldCheck,
    href: "/admin/verification",
  },

  {
    id: "transactions",
    label: "Transactions",
    icon: CreditCard,
    href: "/admin/transactions",
  }, 
  {
    id: "concerns",
    label: "Concerns",
    icon: MessageSquare,
    href: "/admin/concerns",
  },
  { id: "wallet", label: "Wallet", icon: Wallet, href: "/admin/wallet" },
];

const generalItems = [
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
  { id: "help", label: "Help", icon: HelpCircle, href: "/admin/help" },
];

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await logoutAction();
    window.location.replace("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out ${isOpen ? "w-72" : "w-0 lg:w-20"
          } flex flex-col`}
      >
        {/* Glassmorphism Background Layer */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-r border-white/20 shadow-2xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo Section */}
          <div
            className={`h-24 flex items-center mb-2 transition-all duration-300 ${isOpen ? "px-6" : "justify-center px-0"
              }`}
          >
            <div
              className={`flex items-center gap-4 overflow-hidden ${isOpen ? "w-full" : "w-auto justify-center"
                }`}
            >
              <div
                className="w-10 h-10 bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-900/20 cursor-pointer"
                onClick={toggleSidebar}
              >
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <div
                className={`transition-all duration-300 ${isOpen
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4 lg:hidden"
                  }`}
              >
                <h1 className="text-[#1B4332] font-black text-xl tracking-tight whitespace-nowrap">
                  Nest & Nail
                </h1>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-2 px-4 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Main Menu */}
            <div>
              <h3
                className={`text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2 ${!isOpen && "lg:hidden"
                  }`}
              >
                Menu
              </h3>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="block w-full"
                    >
                      <div
                        className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden ${isActive
                          ? "bg-[#1B4332] text-white shadow-lg shadow-[#1B4332]/25"
                          : "hover:bg-emerald-50 text-gray-500 hover:text-[#1B4332]"
                          } ${!isOpen ? "lg:justify-center lg:px-0" : ""}`}
                        title={!isOpen ? item.label : ""}
                      >
                        {/* Selection Indicator for condensed mode */}
                        {isActive && !isOpen && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full lg:block hidden" />
                        )}

                        <Icon
                          className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive
                            ? "text-white"
                            : "text-gray-400 group-hover:text-[#1B4332] group-hover:scale-110"
                            }`}
                        />
                        <span
                          className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${isOpen
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-4 lg:hidden"
                            }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* General Settings */}
            <div>
              <h3
                className={`text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2 ${!isOpen && "lg:hidden"
                  }`}
              >
                General
              </h3>
              <nav className="space-y-1">
                {generalItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="block w-full"
                    >
                      <div
                        className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 cursor-pointer ${isActive
                          ? "bg-[#1B4332] text-white shadow-lg shadow-[#1B4332]/25"
                          : "hover:bg-emerald-50 text-gray-500 hover:text-[#1B4332]"
                          } ${!isOpen ? "lg:justify-center lg:px-0" : ""}`}
                        title={!isOpen ? item.label : ""}
                      >
                        <Icon
                          className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive
                            ? "text-white"
                            : "text-gray-400 group-hover:text-[#1B4332] group-hover:scale-110"
                            }`}
                        />
                        <span
                          className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${isOpen
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-4 lg:hidden"
                            }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    </Link>
                  );
                })}

                {/* Logout Button */}
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className={`w-full group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 text-gray-500 hover:text-red-600 transition-all duration-300 cursor-pointer mt-4 ${!isOpen ? "lg:justify-center lg:px-0" : ""
                    }`}
                >
                  <LogOut className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-red-600 group-hover:-translate-x-1 transition-transform" />
                  <span
                    className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${isOpen
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4 lg:hidden"
                      }`}
                  >
                    Logout
                  </span>
                </button>
              </nav>
            </div>
          </div>

          {/* Premium Card for Sidebar (Only visible when open) */}
          <div
            className={`p-4 transition-all duration-300 ${isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 lg:hidden"
              }`}
          ></div>
        </div>
      </aside>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
