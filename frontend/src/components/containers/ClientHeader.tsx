"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  GalleryVerticalEnd,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { logoutAction } from "@/app/actions/logout-actions";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";

type Props = {
  user?: {
    name?: string;
    email?: string;
    image?: string;
  } | null;
};

const ClientHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Use a mock logged-in state. Toggle this to false to see the logged-out view.
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const userMenuRef = useRef<HTMLDivElement>(null);

  const currentUser = useUserStore((state) => state.user);
  console.log(currentUser);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAction();
      setIsLoggedIn(false);
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-[#1B4332] text-white flex size-9 items-center justify-center rounded-xl shadow-md group-hover:bg-[#DC2626] transition-colors duration-300">
                <GalleryVerticalEnd size={20} />
              </div>
              <span className="text-2xl font-bold text-[#1B4332] tracking-tight group-hover:text-[#DC2626] transition-colors duration-300">
                NEST & NAIL
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {["Services", "Find Workers", "For Professionals", "Support"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-gray-600 hover:text-[#DC2626] font-medium transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#DC2626] after:transition-all hover:after:w-full"
                  >
                    {item}
                  </a>
                )
              )}
            </div>

            {/* Desktop: Auth Buttons OR User Menu */}
            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-[#1B4332] hover:bg-gray-50 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center shadow-sm">
                      <User size={18} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-[#1B4332]">
                      <p>{currentUser?.name}</p>
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform duration-200 ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Dialog */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right ring-1 ring-black/5">
                      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-xs text-gray-500 truncate">
                          {currentUser?.role}
                        </p>
                      </div>

                      <div className="p-1.5 space-y-0.5">
                        <Link href="/client/profile" className="block">
                          <div
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 
    hover:bg-gray-50 hover:text-[#1B4332] rounded-lg transition-colors text-left group cursor-pointer"
                          >
                            <User
                              size={16}
                              className="text-gray-400 group-hover:text-[#1B4332]"
                            />
                            Profile
                          </div>
                        </Link>

                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1B4332] rounded-lg transition-colors text-left group">
                          <Settings
                            size={16}
                            className="text-gray-400 group-hover:text-[#1B4332]"
                          />
                          Settings
                        </button>
                      </div>

                      <div className="border-t border-gray-100 p-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#DC2626] hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors text-left group"
                        >
                          <LogOut
                            size={16}
                            className="group-hover:text-red-700"
                          />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button className="text-[#1B4332] font-semibold hover:text-[#DC2626] transition-colors px-4 py-2">
                    Log In
                  </button>
                  <button className="bg-[#DC2626] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#b91c1c] transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 active:translate-y-0">
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#1B4332] p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 animate-in slide-in-from-top-5 z-40 shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {["Services", "Find Workers", "For Professionals", "Support"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-red-50 hover:text-[#DC2626] rounded-xl transition-colors"
                  >
                    {item}
                  </a>
                )
              )}

              <div className="pt-4 mt-4 border-t border-gray-100">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2 flex items-center gap-3 mb-2 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-[#1B4332] text-white flex items-center justify-center shadow-sm">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1B4332]">
                          {currentUser?.name}
                        </p>

                        <p className="text-xs text-gray-500 truncate">
                          {currentUser?.role}
                        </p>
                      </div>
                    </div>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                      <User size={18} /> Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                      <Settings size={18} /> Settings
                    </button>
                    <button
                      onClick={logoutAction}
                      className="w-full flex items-center gap-3 px-4 py-3 text-base font-bold text-[#DC2626] hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut size={18} /> Log Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button className="w-full text-center py-3 border-2 border-[#1B4332] text-[#1B4332] font-bold rounded-xl hover:bg-[#1B4332] hover:text-white transition-colors">
                      Log In
                    </button>
                    <button className="w-full text-center py-3 bg-[#DC2626] text-white font-bold rounded-xl hover:bg-[#b91c1c] transition-colors shadow-lg shadow-red-500/20">
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default ClientHeader;
