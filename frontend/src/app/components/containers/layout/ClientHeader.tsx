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
import { logoutAction } from "@/app/actions/authentication/logout-actions";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";
import { changeRoleAction } from "@/app/actions/users/change-role-action";
import WorkerVerificationFlow from "../../../client/(home)/DocumentsUpload";
import { VerificationStatus } from "@/shared/enums/authEnums";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ClientHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTogglingRole, setIsTogglingRole] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  // NEW: controls worker verification modal
  const [isWorkerFlowOpen, setIsWorkerFlowOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user: currentUser, setUser } = useUserStore();

  const userMode = (currentUser?.role as "client" | "worker") || "client";

  const verificationStatus: VerificationStatus =
    currentUser?.isVerified ?? VerificationStatus.NOT_VERIFIED;

  // convenience booleans
  const isVerified = verificationStatus === VerificationStatus.VERIFIED;
  const isPending = verificationStatus === VerificationStatus.PENDING;

  const profileHref =
    userMode === "worker" ? "/worker/profile" : "/client/profile";

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
      toast.loading("Logging out...", { id: "logout" });
      await logoutAction();
      toast.success("Logged out successfully", { id: "logout" });
      setIsLoggedIn(false);
      setIsUserMenuOpen(false);
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout failed", error);
    }
  };

  let buttonPlaceHolder = "";

  if (
    currentUser?.documents?.length !== 0 &&
    currentUser?.isVerified !== "VERIFIED"
  ) {
    buttonPlaceHolder = "Re-apply";
  } else {
    buttonPlaceHolder = "Become a worker";
  }

  const toggleUserMode = async () => {
    if (!currentUser || isTogglingRole) return;

    const newMode: "client" | "worker" =
      userMode === "client" ? "worker" : "client";

    setIsTogglingRole(true);
    try {
      const updatedUser = await changeRoleAction(newMode);
      setUser({
        ...currentUser,
        role: updatedUser.role,
      });
    } catch (err) {
      console.error("Failed to toggle user mode:", err);
    } finally {
      setIsTogglingRole(false);
    }
  };

  const homeHref =
    currentUser?.role === "worker"
      ? "/worker"
      : currentUser?.role === "client"
      ? "/client"
      : "/";

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* LEFT: Logo */}
            <Link href={homeHref}>
              <div className="flex-shrink-0 flex items-center gap-2 group cursor-pointer mr-4">
                <div className="bg-[#1B4332] text-white flex size-9 items-center justify-center rounded-xl shadow-md group-hover:bg-[#DC2626] transition-colors duration-300">
                  <GalleryVerticalEnd size={20} />
                </div>
                <span className="text-2xl font-bold text-[#1B4332] tracking-tight group-hover:text-[#DC2626] transition-colors duration-300">
                  NEST & NAIL
                </span>
              </div>
            </Link>

            {/* RIGHT: Toggle + User Menu */}
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
              {/* If NOT verified -> show Become a Worker button */}
              {!isVerified && !isPending && (
                <button
                  type="button"
                  onClick={() => setIsWorkerFlowOpen(true)}
                  className="flex items-center gap-2 bg-[#1B4332] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#153426] transition-colors shadow-sm"
                >
                  {buttonPlaceHolder}
                </button>
              )}

              {/* If verification is PENDING -> show disabled status */}
              {isPending && (
                <button
                  type="button"
                  disabled
                  className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-xs font-semibold border border-amber-200 cursor-not-allowed"
                >
                  <Hammer size={14} />
                  Verification Pending
                </button>
              )}

              {/* If VERIFIED -> show client/worker toggle */}
              {isVerified && (
                <div
                  onClick={toggleUserMode}
                  className={`relative flex items-center bg-gray-100 rounded-full p-1 w-32 h-10 border border-gray-200 shadow-inner ${
                    isTogglingRole ? "opacity-50 cursor-wait" : "cursor-pointer"
                  }`}
                >
                  <div
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full shadow-sm transition-all duration-300 ease-out ${
                      userMode === "client"
                        ? "left-1 bg-[#1B4332]"
                        : "left-[calc(50%)] bg-[#DC2626]"
                    }`}
                  />
                  <div
                    className={`flex-1 z-10 text-center text-xs font-bold ${
                      userMode === "client" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    Client
                  </div>
                  <div
                    className={`flex-1 z-10 text-center text-xs font-bold ${
                      userMode === "worker" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    Worker
                  </div>
                </div>
              )}
              <div className="h-6 w-px bg-gray-200 mx-2" />

              {/* User dropdown */}
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
                      <Link href={profileHref} className="block">
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

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#1B4332] p-2 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile menu remains same (you can also wire Become Worker similarly if you want) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 animate-in slide-in-from-top-5 z-40 shadow-xl max-h-[90vh] overflow-y-auto">
            {/* ... your existing mobile menu code ... */}
          </div>
        )}
      </nav>

      {/* 🔥 Worker modal mounted here so it overlays whole screen */}
      <WorkerVerificationFlow
        isOpen={isWorkerFlowOpen}
        onClose={() => setIsWorkerFlowOpen(false)}
      />
    </>
  );
};

export default ClientHeader;
