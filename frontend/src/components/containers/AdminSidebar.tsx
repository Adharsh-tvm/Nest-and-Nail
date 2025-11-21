"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Wrench,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { id: "customers", label: "Customers", icon: Users, href: "/admin/customers" },
  { id: "workers", label: "Workers", icon: Briefcase, href: "/admin/workers" },
  { id: "services", label: "Services", icon: Wrench, href: "/admin/services" },
  { id: "payments", label: "Payments", icon: CreditCard, href: "/admin/payments" },
  { id: "complaints", label: "Complaints", icon: MessageSquare, href: "/admin/complaints" },
  { id: "verification", label: "Verification", icon: ShieldCheck, href: "/admin/verification" },
  { id: "wallet", label: "Wallet", icon: Wallet, href: "/admin/wallet" },
];

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {!isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-20" />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-screen bg-[#0f172a] text-slate-300 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20 lg:w-20"
        } z-30`}
      >
        <div className={`h-full flex flex-col p-3 ${isOpen ? "lg:p-6" : ""}`}>
          {/* Logo Section */}
          <div className={`flex items-center gap-3 mb-8 border-b border-slate-700/50 pb-6 ${isOpen ? "" : "justify-center"}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            {isOpen && (
              <div>
                <h1 className="text-white font-bold text-lg leading-none">ServicePro</h1>
                <span className="text-xs text-slate-400">Admin Portal</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-4 mb-8 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.id} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#f97316] text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    } ${isOpen ? "" : "justify-center px-3"}`}
                    title={!isOpen ? item.label : ""}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isOpen && <span className="font-medium text-sm">{item.label}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Status Section */}
          <div className={`border-t border-slate-700/50 pt-4 ${isOpen ? "" : "flex justify-center"}`}>
            <div className={`flex items-center gap-3 text-sm text-slate-400 ${isOpen ? "" : "flex-col"}`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
              {isOpen && <span>System Operational</span>}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}