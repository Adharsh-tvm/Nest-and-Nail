"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  MapPin,
  Edit2,
  Calendar,
  Camera,
  ShieldCheck,
  LogOut,
  Settings,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";

const ClientProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Use mock data for display; in production: const currentUser = useUserStore((state) => state.user);
  const currentUser = useUserStore((state: any) => state.user);

  console.log("sidghisdhgosfuihvfoijdhvoaofsjhnvaoswj", currentUser);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your profile…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 relative group">
          {/* Header Banner */}
          <div className="h-48 bg-[#1B4332] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#DC2626] opacity-10 blur-[100px] rounded-full"></div>

            {/* Quick Actions (Top Right) */}
            <div className="absolute top-6 right-6 flex gap-3"></div>
          </div>

          <div className="px-8 pb-8 relative">
            {/* Avatar & Main Info Row */}
            <div className="flex flex-col sm:flex-row items-end -mt-20 mb-6 gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-[6px] border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center group-hover:shadow-2xl transition-all duration-300">
                  {currentUser.profileImageUrl ? (
                    <img
                      src={currentUser.profileImageUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-gray-300" />
                  )}
                </div>
                {/* Camera Edit Icon */}
                <button className="absolute bottom-2 right-2 bg-white p-2.5 rounded-full shadow-md text-gray-600 hover:text-[#DC2626] border border-gray-100 hover:scale-110 transition-all duration-200 z-10">
                  <Camera size={18} />
                </button>
              </div>

              {/* Name & Role */}
              <div className="flex-1 pb-2 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-[#1B4332] mb-1">
                  {currentUser.name}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100">
                    <ShieldCheck size={14} />
                    {currentUser.role}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={14} /> Joined {currentUser.joinedDate}
                  </span>
                </div>
              </div>

              {/* Edit Profile Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mb-2 w-full sm:w-auto px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-[#1B4332] font-semibold rounded-xl border border-gray-200 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Edit2 size={16} />
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>

            {/* Content Divider */}
            <div className="h-px bg-gray-100 w-full mb-8"></div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Address Section */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={14} /> Primary Address
                </label>
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4 hover:border-green-200 transition-colors group/card">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#DC2626] shadow-sm group-hover/card:scale-110 transition-transform">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 leading-relaxed">
                      {currentUser.address}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Visible to workers only after you hire them.
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Section */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Mail size={14} /> Contact Email
                </label>
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4 hover:border-green-200 transition-colors group/card">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1B4332] shadow-sm group-hover/card:scale-110 transition-transform">
                    <Mail size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-gray-900 truncate">
                      {currentUser.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Used for notifications and invoices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Banner */}
        <div className="bg-[#1B4332] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg text-white">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Have a project in mind?</h3>
            <p className="text-green-100 text-sm max-w-md">
              Post a request today and get matched with top-rated professionals
              in your area.
            </p>
          </div>
          <button className="px-8 py-3 bg-[#DC2626] hover:bg-[#b91c1c] text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 whitespace-nowrap">
            Post a Job Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
