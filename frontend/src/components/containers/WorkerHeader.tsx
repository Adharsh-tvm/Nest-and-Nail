"use client";

import {
  Home,
  Briefcase,
  Calendar,
  CreditCard,
  Users,
  User,
  MessageCircle,
  Power,
  Menu,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/button";
import { logoutAction } from "@/app/actions/logout-actions";
import { useState } from "react";

type UserType = { isVerified?: boolean } | null;

const WorkerHeader: React.FC = () => {
  type NavItemProps = {
    icon: React.ElementType;
    label: string;
    href: string;
    active?: boolean;
  };

  const NavItem: React.FC<NavItemProps> = ({
    icon: Icon,
    label,
    href,
    active,
  }) => (
    <a
      href={href}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
        active
          ? "bg-green-600 text-white"
          : "text-neutral-300 hover:bg-neutral-700 hover:text-white"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </a>
  );

  let user = {
    user_id: "string",
    user_name: "string",
    email_address: "string",
    phone_number: "number",
    user_role: "Role",
    profileImageUrl: "string",
    isBlocked: "boolean",
    isVerified: "boolean",
  };

  const [isOnline, setIsOnline] = useState(true)

  // VERIFIED USER VIEW
  if (user?.isVerified) {
    return (
      <header className="bg-neutral-900 text-white p-4 flex flex-col md:flex-row items-center justify-between border-b border-neutral-800">
        <div className="flex items-center justify-between w-full md:w-auto">
          <h1 className="text-2xl font-bold text-green-400">ServiceHub</h1>
          <button className="md:hidden text-neutral-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        <nav className="hidden md:flex items-center space-x-2 mt-4 md:mt-0">
          <NavItem icon={Home} label="Home" href="#" active />
          <NavItem icon={Briefcase} label="Jobs" href="#" />
          <NavItem icon={Calendar} label="Bookings" href="#" />
          <NavItem icon={CreditCard} label="Payments" href="#" />
          <NavItem icon={Users} label="Meetings" href="#" />
          <NavItem icon={User} label="Profile" href="#" />
        </nav>

        <div className="hidden md:flex items-center space-x-4 mt-4 md:mt-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-400">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isOnline
                  ? "bg-green-800 text-green-200"
                  : "bg-neutral-700 text-neutral-300"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>

          <button className="text-neutral-300 hover:text-white">
            <MessageCircle className="w-6 h-6" />
          </button>

          {/* LOGOUT BUTTON - VERIFIED VIEW */}
          <button
            onClick={logoutAction}
            className="text-neutral-300 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-6 h-6" />
          </button>

          <img
            src="https://placehold.co/40x40/334155/e2e8f0?text=U"
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-neutral-700"
          />
        </div>
      </header>
    );
  }

  // UNVERIFIED USER VIEW
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-lg font-bold text-white tracking-tight">
            <span className="text-emerald-500">Mend</span> On
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnline((v) => !v)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
              isOnline
                ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-500"
                : "bg-zinc-900 border-zinc-700 text-zinc-400"
            }`}
          >
            <Power className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">
              {isOnline ? "Online" : "Offline"}
            </span>
          </button>

          {/* LOGOUT BUTTON - UNVERIFIED VIEW */}
          <button
            onClick={logoutAction}
            className="h-9 w-9 flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-900/50 transition-all"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>

          <div className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
            <User className="h-5 w-5 text-zinc-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default WorkerHeader;
