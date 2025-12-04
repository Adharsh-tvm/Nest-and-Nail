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
  Briefcase,
  Hammer,
} from "lucide-react";
import { logoutAction } from "@/app/actions/logout-actions";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";
import { updateUserMode } from "@/services/auth/user.api";

const ClientHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTogglingRole, setIsTogglingRole] = useState(false);

  // start falsy; set after we read store to avoid mismatch/flicker
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user: currentUser, setUser } = useUserStore();

  // Get userMode from Zustand store
  const userMode = (currentUser?.role as "client" | "worker") || "client";

  useEffect(() => {
    setIsLoggedIn(Boolean(currentUser && Object.keys(currentUser).length));
  }, [currentUser]);

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

  const toggleUserMode = async () => {
    if (!currentUser || isTogglingRole) return;

    const newMode: "client" | "worker" = userMode === "client" ? "worker" : "client";

    setIsTogglingRole(true);
    try {
      // Call API to update role in database
      const updatedUser = await updateUserMode(newMode);
      
      console.log("Role updated successfully:", updatedUser);

      // Update Zustand store with new role
      setUser({
        ...currentUser,
        role: updatedUser.role, // Use role from server response
      });

    } catch (err) {
      console.error("Failed to toggle user mode:", err);
      // Optionally show error toast to user
    } finally {
      setIsTogglingRole(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. LEFT: Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 group cursor-pointer mr-4">
            <div className="bg-[#1B4332] text-white flex size-9 items-center justify-center rounded-xl shadow-md group-hover:bg-[#DC2626] transition-colors duration-300">
              <GalleryVerticalEnd size={20} />
            </div>
            <span className="text-2xl font-bold text-[#1B4332] tracking-tight group-hover:text-[#DC2626] transition-colors duration-300">
              NEST & NAIL
            </span>
          </div>

          {/* 2. CENTER: Desktop Nav Links */}
          

          {/* 3. RIGHT: Toggle + Auth Buttons/User Menu */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            
            {/* Mode Toggle Switch */}
            <div 
              onClick={toggleUserMode}
              className={`relative flex items-center bg-gray-100 rounded-full p-1 w-32 h-10 border border-gray-200 shadow-inner ${
                isTogglingRole ? 'opacity-50 cursor-wait' : 'cursor-pointer'
              }`}
            >
               {/* Sliding Background */}
               <div 
                 className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full shadow-sm transition-all duration-300 ease-out ${
                    userMode === 'client' 
                    ? 'left-1 bg-[#1B4332]' 
                    : 'left-[calc(50%)] bg-[#DC2626]'
                 }`} 
               />
               
               {/* Client Text */}
               <div className={`flex-1 z-10 text-center text-xs font-bold transition-colors duration-300 flex items-center justify-center gap-1 ${userMode === 'client' ? 'text-white' : 'text-gray-500'}`}>
                  Client
               </div>

               {/* Worker Text */}
               <div className={`flex-1 z-10 text-center text-xs font-bold transition-colors duration-300 flex items-center justify-center gap-1 ${userMode === 'worker' ? 'text-white' : 'text-gray-500'}`}>
                  Worker
               </div>
            </div>

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-[#1B4332] hover:bg-gray-50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center shadow-sm">
                    <User size={18} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-[#1B4332] max-w-[100px] truncate">
                    {currentUser?.name}
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
                      <p className="text-sm font-bold text-gray-800">
                        {currentUser?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate capitalize">
                        {currentUser?.role}
                      </p>
                    </div>

                    <div className="p-1.5 space-y-0.5">
                      <Link href="/client/profile" className="block">
                        <div className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1B4332] rounded-lg transition-colors text-left group cursor-pointer">
                          <User
                            size={16}
                            className="text-gray-400 group-hover:text-[#1B4332]"
                          />
                          Profile
                        </div>
                      </Link>
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
          
          </div>

          {/* Mobile Menu Button (Right side on mobile) */}
          <button
            className="md:hidden text-[#1B4332] p-2 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 animate-in slide-in-from-top-5 z-40 shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="px-4 pt-2 pb-6 space-y-2">
            
            {/* Mobile Toggle Switch */}
            <div className="flex justify-center py-4 border-b border-gray-100 mb-2">
              <div className={`bg-gray-100 p-1 rounded-lg flex w-full ${isTogglingRole ? 'opacity-50' : ''}`}>
                <button 
                  onClick={toggleUserMode}
                  disabled={isTogglingRole || userMode === "client"}
                  className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${userMode === 'client' ? 'bg-white text-[#1B4332] shadow-sm' : 'text-gray-500'}`}
                >
                  <Briefcase size={16} /> Client Mode
                </button>
                <button 
                  onClick={toggleUserMode}
                  disabled={isTogglingRole || userMode === "worker"}
                  className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${userMode === 'worker' ? 'bg-white text-[#DC2626] shadow-sm' : 'text-gray-500'}`}
                >
                   <Hammer size={16} /> Worker Mode
                </button>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100">
              <div className="space-y-2">
                <div className="px-4 py-2 flex items-center gap-3 mb-2 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#1B4332] text-white flex items-center justify-center shadow-sm">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1B4332]">
                      {currentUser?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate capitalize">
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
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-base font-bold text-[#DC2626] hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ClientHeader;