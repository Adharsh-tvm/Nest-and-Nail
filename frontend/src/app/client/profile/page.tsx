"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Camera,
  MapPin,
  Edit2,
  Calendar,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";

const ClientProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const currentUser = useUserStore((state: any) => state.user);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          {/* Banner Area */}
          <div className="h-40 bg-[#1B4332] relative overflow-hidden">
            {/* Decorative Patterns */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#DC2626] opacity-20 blur-3xl rounded-full"></div>
          </div>

          <div className="relative px-8 pb-8">
            {/* Avatar Row */}
            <div className="flex flex-col sm:flex-row justify-between items-end -mt-16 mb-6 gap-4">
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-[6px] border-white shadow-lg overflow-hidden bg-gray-100 relative z-10 flex items-center justify-center">
                  {/* Fallback to Icon since we don't have a real image URL */}
                  <User size={64} className="text-gray-300" />
                  {/* <img src={currentUser?.avatar} alt={currentUser?.name} className="w-full h-full object-cover" /> */}
                </div>
                <button className="absolute bottom-2 right-2 z-20 bg-white p-2.5 rounded-full shadow-md text-gray-600 hover:text-[#DC2626] transition-colors border border-gray-100 group-hover:scale-110 duration-200">
                  <Camera size={18} />
                </button>
              </div>

              {/* Edit Button (Moved here since toggle is gone) */}
              <div className="w-full sm:w-auto mb-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-50 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
                >
                  <Edit2 size={16} />
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </button>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-8 mb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-[#1B4332]">
                    {currentUser?.name}
                  </h1>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-gray-100 text-gray-600">
                    Client
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-[#DC2626]" />
                    {currentUser?.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} className="text-[#DC2626]" />
                    Member since {currentUser?.joinedDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="flex items-center gap-4 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 group-hover:border-[#DC2626]/30 group-hover:bg-white transition-all shadow-sm">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#DC2626] shadow-sm group-hover:scale-110 transition-transform">
                    <Mail size={22} />
                  </div>
                  <div className="overflow-hidden">
                    <span className="block font-bold text-gray-900 truncate">
                      {currentUser?.email}
                    </span>
                    <span className="text-xs text-gray-500">
                      Primary Contact
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  Phone Number
                </label>
                <div className="flex items-center gap-4 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 group-hover:border-[#DC2626]/30 group-hover:bg-white transition-all shadow-sm">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#DC2626] shadow-sm group-hover:scale-110 transition-transform">
                    <Phone size={22} />
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900">
                      {currentUser?.phone}
                    </span>
                    <span className="text-xs text-gray-500">Mobile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Specific CTA */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center shadow-sm animate-in slide-in-from-bottom-4 fade-in duration-500">
          <h3 className="text-xl font-bold text-[#1B4332] mb-2">
            Need something done?
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Post a job request and get quotes from verified professionals in
            your area within minutes.
          </p>
          <button className="px-8 py-3 bg-[#1B4332] text-white rounded-xl font-bold hover:bg-[#143225] transition-colors shadow-lg shadow-green-900/20">
            Post a New Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
