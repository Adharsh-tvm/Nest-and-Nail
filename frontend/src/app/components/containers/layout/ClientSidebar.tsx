"use client";

import React, { useState } from "react";
import {
  User as UserIcon,
  MapPin,
  Settings,
  Wallet as WalletIcon,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Clock,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { VerificationStatus } from "@/shared/enums/authEnums";
import { User } from "@/shared/types/userTypes";

// --- Types ---

export type Tab = "profile" | "addresses" | "wallet" | "settings";

// --- Mock Data (Internalized for Layout Shell) ---

interface SidebarProps {
  children?: React.ReactNode;
}

// --- Components ---

const StatusBadge = ({ status }: { status: VerificationStatus }) => {
  switch (status) {
    case "VERIFIED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#1B4332] text-white uppercase tracking-wider">
          <ShieldCheck size={10} /> Verified
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700 uppercase tracking-wider">
          <Clock size={10} /> Pending
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 uppercase tracking-wider">
          Unverified
        </span>
      );
  }
};

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  // State is now managed internally or via Context in a real app
  const [user] = useState<User>();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    setIsOpen(false);
    // In a real Next.js app, you would use router.push('/path') here
    // based on the tab selected.
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="p-1 text-gray-500" />
            )}
          </div>
          <span className="font-bold text-gray-900">{user.name}</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:h-screen md:sticky md:top-0
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900"
        >
          <X size={20} />
        </button>

        {/* User Brief */}
        <div className="p-8 border-b border-gray-100 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 mb-4 overflow-hidden border-4 border-white shadow-lg relative">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-full h-full p-6 text-gray-300" />
            )}
          </div>
          <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
          <div className="flex items-center gap-2 mt-1 mb-3">
            <StatusBadge status={user.isVerified} />
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium bg-gray-50 px-3 py-1 rounded-full">
            <Calendar size={12} />
            Member since{" "}
            {user.createdAt ? new Date(user.createdAt).getFullYear() : "—"}
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => handleTabClick("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-all ${
              activeTab === "profile"
                ? "bg-[#1B4332] text-white shadow-md shadow-green-900/10"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <UserIcon size={18} />
            Profile Information
          </button>

          <button
            onClick={() => handleTabClick("addresses")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-all ${
              activeTab === "addresses"
                ? "bg-[#1B4332] text-white shadow-md shadow-green-900/10"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <MapPin size={18} />
            Addresses
          </button>

          <button
            onClick={() => handleTabClick("wallet")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-all ${
              activeTab === "wallet"
                ? "bg-[#1B4332] text-white shadow-md shadow-green-900/10"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <WalletIcon size={18} />
            Wallet
          </button>

          <div className="pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={() => handleTabClick("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-all ${
                activeTab === "settings"
                  ? "bg-[#1B4332] text-white shadow-md shadow-green-900/10"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Settings size={18} />
              Settings
            </button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold shadow-sm border border-blue-100">
            <CheckCircle2 size={16} className="flex-shrink-0" />
            <span>Profile 100% Complete</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Renders the children passed from layout */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
