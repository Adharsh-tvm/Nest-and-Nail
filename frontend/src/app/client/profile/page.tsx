"use client";

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Briefcase, 
  Home,
  Edit2,
  MapPin,
  Calendar,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';

const UserProfile = () => {
  const [role, setRole] = useState<'client' | 'worker'>('client');
  const [isEditing, setIsEditing] = useState(false);

  // Mock User Data
  const currentUser = useUserStore((state) => state.user);

  const toggleRole = () => {
    // In a real app, this might trigger a server action or redirect
    setRole(prev => prev === 'client' ? 'worker' : 'client');
  };

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
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-[6px] border-white shadow-lg overflow-hidden bg-gray-100 relative z-10">
                  <img  alt={currentUser?.name} className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-2 right-2 z-20 bg-white p-2.5 rounded-full shadow-md text-gray-600 hover:text-[#DC2626] transition-colors border border-gray-100 group-hover:scale-110 duration-200">
                  <Camera size={18} />
                </button>
              </div>
              
              {/* Role Switcher Button */}
              <div className="w-full sm:w-auto mb-2">
                 <button 
                  onClick={toggleRole}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all shadow-md border-2 ${
                    role === 'client' 
                      ? 'bg-white text-[#1B4332] border-[#1B4332] hover:bg-gray-50' 
                      : 'bg-[#1B4332] text-white border-[#1B4332] hover:bg-[#143225] hover:shadow-lg'
                  }`}
                 >
                   {role === 'client' ? <Briefcase size={18} /> : <Home size={18} />}
                   <span>Switch to {role === 'client' ? 'Worker' : 'Client'} Mode</span>
                 </button>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-8 mb-8">
               <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-[#1B4332]">{currentUser?.name}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${role === 'client' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-[#DC2626]'}`}>
                      {role === 'client' ? 'Client' : 'Pro Worker'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-600">
                    {/* <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-[#DC2626]" />
                      {user.location}
                    </div> */}
                    {/* <div className="flex items-center gap-1.5">
                      <Calendar size={16} className="text-[#DC2626]" />
                      Member since {user.joinedDate}
                    </div> */}
                    {role === 'worker' && (
                       <div className="flex items-center gap-1.5 font-semibold text-[#1B4332]">
                         <ShieldCheck size={16} /> Verified Professional
                       </div>
                    )}
                  </div>
               </div>
               
               <button 
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
               >
                 <Edit2 size={16} />
                 {isEditing ? 'Save Profile' : 'Edit Profile'}
               </button>
            </div>

            {/* Contact Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 group">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                 <div className="flex items-center gap-4 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 group-hover:border-[#DC2626]/30 group-hover:bg-white transition-all shadow-sm">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#DC2626] shadow-sm group-hover:scale-110 transition-transform">
                       <Mail size={22} />
                    </div>
                    <div>
                       <span className="block font-bold text-gray-900">{currentUser?.email}</span>
                       <span className="text-xs text-gray-500">Primary Contact</span>
                    </div>
                 </div>
              </div>
              
              <div className="space-y-2 group">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                 <div className="flex items-center gap-4 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 group-hover:border-[#DC2626]/30 group-hover:bg-white transition-all shadow-sm">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#DC2626] shadow-sm group-hover:scale-110 transition-transform">
                       <Phone size={22} />
                    </div>
                    <div>
                       {/* <span className="block font-bold text-gray-900">{currentUser?.phone}</span> */}
                       <span className="text-xs text-gray-500">Mobile</span>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>

        {/* Conditional Dashboard based on Role */}
        {role === 'worker' ? (
           <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
               <div className="bg-[#1B4332] text-white p-6 rounded-3xl relative overflow-hidden md:col-span-2">
                   <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                   <h3 className="text-xl font-bold mb-1">Worker Dashboard</h3>
                   <p className="text-green-200 text-sm mb-6">Overview of your current activity.</p>
                   
                   <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10">
                         <div className="text-3xl font-bold mb-1">12</div>
                         <div className="text-xs text-green-200">Active Jobs</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10">
                         <div className="text-3xl font-bold mb-1">4.9</div>
                         <div className="text-xs text-green-200">Rating</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10">
                         <div className="text-3xl font-bold mb-1">$2k</div>
                         <div className="text-xs text-green-200">Earnings</div>
                      </div>
                   </div>
               </div>

               <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col justify-center items-center text-center shadow-sm">
                   <div className="w-16 h-16 bg-red-50 text-[#DC2626] rounded-full flex items-center justify-center mb-4">
                      <Briefcase size={28} />
                   </div>
                   <h3 className="font-bold text-gray-900">Find New Work</h3>
                   <p className="text-sm text-gray-500 mb-4 mt-1">Browse open jobs in your area.</p>
                   <button className="w-full py-2 bg-[#DC2626] text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">
                     Browse Jobs
                   </button>
               </div>
           </div>
        ) : (
           <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center shadow-sm animate-in slide-in-from-bottom-4 fade-in duration-500">
              <h3 className="text-xl font-bold text-[#1B4332] mb-2">Need something done?</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">Post a job request and get quotes from verified professionals in your area within minutes.</p>
              <button className="px-8 py-3 bg-[#1B4332] text-white rounded-xl font-bold hover:bg-[#143225] transition-colors shadow-lg shadow-green-900/20">
                 Post a New Request
              </button>
           </div>
        )}

      </div>
    </div>
  );
};

export default UserProfile;