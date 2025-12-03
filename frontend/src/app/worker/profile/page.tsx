"use client";

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  MapPin,
  Edit2,
  Calendar,
  Star,
  ShieldCheck,
  Briefcase,
  Award,
  CheckCircle2,
  Hammer,
  Clock
} from 'lucide-react';

// --- Mock Store for standalone demonstration ---
const useUserStore = ((selector: any) => {
    // Mock worker state
    const user = { 
        name: "Alex Johnson", 
        email: "alex.j@pro-services.com",
        phone: "+1 (555) 987-6543",
        location: "Chicago, IL",
        joinedDate: "March 2022",
        role: "worker",
        rating: 4.9,
        reviewCount: 128,
        jobsCompleted: 342,
        verified: true,
        bio: "Master Plumber & General Contractor with over 10 years of experience. Specializing in emergency repairs, bathroom remodels, and eco-friendly installations.",
        skills: ["Plumbing", "Pipe Fitting", "Water Heaters", "Tiling", "Drywall"]
    }; 
    return selector({ user });
}) as any;
// ------------------------------------------

const WorkerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  // Mock User Data
  const currentUser = useUserStore((state: any) => state.user);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          {/* Banner Area */}
          <div className="h-40 bg-[#1B4332] relative overflow-hidden">
             {/* Decorative Patterns */}
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(45deg, #ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
             <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#4ADE80] opacity-10 blur-3xl rounded-full"></div>
             
             {/* Availability Badge (Top Right) */}
             <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                    {isAvailable ? 'Available for Jobs' : 'Unavailable'}
                </span>
             </div>
          </div>

          <div className="relative px-8 pb-8">
            {/* Avatar Row */}
            <div className="flex flex-col sm:flex-row justify-between items-end -mt-16 mb-6 gap-4">
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-[6px] border-white shadow-lg overflow-hidden bg-white relative z-10 flex items-center justify-center">
                   <User size={64} className="text-[#1B4332]" />
                </div>
                {currentUser?.verified && (
                    <div className="absolute bottom-2 right-2 z-20 bg-[#DC2626] text-white p-1.5 rounded-full border-4 border-white shadow-sm" title="Verified Pro">
                        <ShieldCheck size={16} />
                    </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="w-full sm:w-auto mb-2 flex gap-3">
                 <button 
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`flex-1 sm:flex-none py-2.5 px-4 rounded-xl font-bold text-sm transition-colors border ${isAvailable ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                 >
                    {isAvailable ? 'Go Offline' : 'Go Online'}
                 </button>
                 <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1B4332] text-white font-semibold rounded-xl hover:bg-[#143225] transition-colors shadow-lg shadow-green-900/20"
                 >
                   <Edit2 size={16} />
                   {isEditing ? 'Save' : 'Edit Profile'}
                 </button>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-8 mb-8">
               <div className="space-y-3 w-full">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-bold text-[#1B4332]">{currentUser?.name}</h1>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-[#DC2626] text-white flex items-center gap-1">
                      <Hammer size={12} /> Pro Worker
                    </span>
                  </div>

                  <p className="text-gray-600 max-w-2xl leading-relaxed">
                    {currentUser?.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-600">
                     <div className="flex items-center gap-1.5">
                       <MapPin size={16} className="text-[#DC2626]" />
                       {currentUser?.location}
                     </div>
                     <div className="flex items-center gap-1.5">
                       <Calendar size={16} className="text-[#DC2626]" />
                       Joined {currentUser?.joinedDate}
                     </div>
                  </div>
               </div>
            </div>

            {/* Stats Grid (Worker Specific) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-1 text-[#DC2626] font-bold text-xl mb-1">
                        4.9 <Star size={18} fill="#DC2626" />
                    </div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Rating</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-1 text-[#1B4332] font-bold text-xl mb-1">
                        {currentUser?.jobsCompleted}
                    </div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Jobs Done</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-1 text-[#1B4332] font-bold text-xl mb-1">
                        100%
                    </div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Completion</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-1 text-[#1B4332] font-bold text-xl mb-1">
                        <Award size={20} />
                    </div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Top Rated</div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Col: Contact & Skills */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-[#1B4332] flex items-center gap-2">
                            <User size={18} /> Contact Info
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-[#1B4332]">
                                    <Mail size={16} />
                                </div>
                                <div className="text-sm overflow-hidden text-ellipsis w-full">
                                    <span className="block font-medium text-gray-900 truncate">{currentUser?.email}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-[#1B4332]">
                                    <Phone size={16} />
                                </div>
                                <div className="text-sm">
                                    <span className="block font-medium text-gray-900">{currentUser?.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-[#1B4332] flex items-center gap-2">
                            <Briefcase size={18} /> Skills & Trades
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {currentUser?.skills.map((skill: string, i: number) => (
                                <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                                    {skill}
                                </span>
                            ))}
                            <button className="px-3 py-1.5 border border-dashed border-gray-300 text-gray-400 rounded-lg text-sm hover:text-[#DC2626] hover:border-[#DC2626] transition-colors">
                                + Add
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Col: Badges & Verification */}
                <div className="lg:col-span-2 space-y-6">
                     <h4 className="font-bold text-[#1B4332] flex items-center gap-2">
                        <ShieldCheck size={18} /> Trust & Verification
                    </h4>
                    
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-green-500 mt-0.5" size={20} />
                                <div>
                                    <div className="font-bold text-gray-900">Identity Verified</div>
                                    <div className="text-sm text-gray-500">Government ID check passed</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-green-500 mt-0.5" size={20} />
                                <div>
                                    <div className="font-bold text-gray-900">Background Check</div>
                                    <div className="text-sm text-gray-500">Clear criminal record</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-green-500 mt-0.5" size={20} />
                                <div>
                                    <div className="font-bold text-gray-900">License Valid</div>
                                    <div className="text-sm text-gray-500">State Contractor Lic #9923</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-green-500 mt-0.5" size={20} />
                                <div>
                                    <div className="font-bold text-gray-900">Insured</div>
                                    <div className="text-sm text-gray-500">$1M Liability Coverage</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex items-center justify-between gap-4">
                        <div>
                            <h5 className="font-bold text-blue-900">Boost your profile</h5>
                            <p className="text-sm text-blue-700 mt-1">Add photos of your recent work to attract more clients.</p>
                        </div>
                        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-50 transition-colors">
                            Upload Photos
                        </button>
                    </div>
                </div>
            </div>

          </div>
        </div>

        {/* Worker Dashboard CTA */}
        <div className="grid md:grid-cols-2 gap-4">
            <button className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#1B4332] hover:shadow-md transition-all text-left group">
                <div className="w-10 h-10 bg-green-50 text-[#1B4332] rounded-full flex items-center justify-center mb-3 group-hover:bg-[#1B4332] group-hover:text-white transition-colors">
                    <Briefcase size={20} />
                </div>
                <h4 className="font-bold text-gray-900 text-lg">Find Leads</h4>
                <p className="text-gray-500 text-sm mt-1">Browse 12 new jobs in your area matching your skills.</p>
            </button>

             <button className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#1B4332] hover:shadow-md transition-all text-left group">
                <div className="w-10 h-10 bg-red-50 text-[#DC2626] rounded-full flex items-center justify-center mb-3 group-hover:bg-[#DC2626] group-hover:text-white transition-colors">
                    <Clock size={20} />
                </div>
                <h4 className="font-bold text-gray-900 text-lg">Schedule</h4>
                <p className="text-gray-500 text-sm mt-1">Manage your upcoming appointments and availability.</p>
            </button>
        </div>

      </div>
    </div>
  );
};

export default WorkerProfile;