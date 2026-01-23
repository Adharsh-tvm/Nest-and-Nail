"use client";

import React, { useState } from "react";
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Phone,
  MessageSquare,
  ImageIcon,
  ArrowRight,
  ShieldCheck,
  Star,
  User
} from "lucide-react";
import { ServiceRequestModal } from "@/components/ServiceRequestModal";
import { ServiceRequest } from "@/shared/types/serviceTypes";

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [services, setServices] = useState<ServiceRequest[]>([
    {
      id: "SR-9821-X",
      title: "Emergency Pipe Leakage",
      description: "Main water line in the basement has burst. Water is flooding the floor. Needs immediate attention.",
      category: "PLUMBING",
      status: "in_progress",
      createdAt: new Date().toISOString(),
      images: ["placeholder"]
    },
    // Other Services hidden as per request
  ]);

  const handleAddService = async (data: any) => {
    const newService: ServiceRequest = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
      description: data.description,
      category: data.category,
      status: "pending",
      createdAt: new Date().toISOString(),
      images: data.images.map((file: File) => URL.createObjectURL(file)),
    };
    setServices((prev) => [newService, ...prev]);
  };

  const activeService = services.find(s => s.status === 'in_progress');

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">

      {/* Navbar Placeholder / Back Button Area */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="font-bold text-xl text-[#1B4332] tracking-tight">Service Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1B4332] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#143326] transition-colors"
          >
            <Plus size={16} /> New Request
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {activeService ? (
          <div className="space-y-6">

            {/* 1. Status Card - Hero */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                <div className="h-full bg-[#DC2626] w-[60%] animate-pulse"></div>
              </div>

              <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-red-50 text-[#DC2626] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span>
                        Technician On The Way
                      </span>
                      <span className="text-gray-400 text-sm font-medium">Est. Arrival: 15 mins</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{activeService.title}</h2>
                    <p className="text-gray-500 font-medium">Job ID: {activeService.id}</p>
                  </div>

                  {/* Pro Profile Mini */}
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 w-full md:w-auto">
                    <div className="relative">
                      <div className="w-14 h-14 bg-[#1B4332] rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-white shadow-sm">
                        JD
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">John Doe</div>
                      <div className="text-xs text-green-600 font-bold flex items-center gap-1">
                        <ShieldCheck size={12} /> Verified Pro
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                        <span>4.9 (120 jobs)</span>
                      </div>
                    </div>
                    <div className="ml-auto md:ml-4 flex gap-2">
                      <button className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-[#1B4332] hover:border-[#1B4332] transition-colors shadow-sm">
                        <Phone size={16} />
                      </button>
                      <button className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-[#1B4332] hover:border-[#1B4332] transition-colors shadow-sm">
                        <MessageSquare size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline / Steps */}
              <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 overflow-x-auto">
                <div className="flex items-center justify-between min-w-[500px]">
                  {['Request Sent', 'Pro Assigned', 'On The Way', 'Work Started', 'Completed'].map((step, i) => {
                    const activeStep = 2; // Fixed for demo
                    const isCompleted = i < activeStep;
                    const isCurrent = i === activeStep;

                    return (
                      <div key={i} className="flex flex-col items-center relative z-10">
                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all duration-300
                                            ${isCompleted ? 'bg-[#1B4332] text-white shadow-lg shadow-green-900/20' :
                            isCurrent ? 'bg-[#DC2626] text-white scale-110 shadow-lg shadow-red-500/30' :
                              'bg-gray-200 text-gray-400'}
                                        `}>
                          {isCompleted ? <CheckCircle2 size={14} /> : i + 1}
                        </div>
                        <span className={`text-xs font-bold ${isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step}
                        </span>
                        {/* Connector Line (Hack for visual simplicity) */}
                        {i < 4 && (
                          <div className={`absolute top-4 left-[50%] w-[200%] h-0.5 -z-10 ${i < activeStep ? 'bg-[#1B4332]' : 'bg-gray-200'}`}></div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 2. Details & Actions Split */}
            <div className="grid md:grid-cols-3 gap-6">

              {/* Left: Description & Location */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#DC2626] rounded-full"></span>
                    Service Details
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {activeService.description}
                  </p>

                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Service Location</h4>
                    <p className="text-gray-500 text-sm mt-1">123 Green Street, Apartment 4B<br />New York, NY 10001</p>
                  </div>
                </div>
              </div>

              {/* Right: Payment & Summary */}
              <div className="md:col-span-1 space-y-6">
                <div className="bg-[#1B4332] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

                  <h3 className="font-bold text-white/90 mb-6">Estimated Cost</h3>
                  <div className="text-4xl font-extrabold mb-1">$85.00</div>
                  <p className="text-white/60 text-sm mb-6">Standard visitation fee included.</p>

                  <button className="w-full py-3 bg-white text-[#1B4332] font-bold rounded-xl hover:bg-gray-100 transition-colors">
                    View Breakdown
                  </button>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                  <h4 className="font-bold text-gray-900 mb-2">Need Help?</h4>
                  <p className="text-xs text-gray-500 mb-4">Issues with this request?</p>
                  <button className="text-[#DC2626] font-bold text-sm hover:underline">
                    Report a Problem
                  </button>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400 animate-in zoom-in duration-300">
              <Calendar size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Jobs</h2>
            <p className="text-gray-500 max-w-sm mb-8">Your dashboard is empty. Ready to start a new project?</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#DC2626] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#b91c1c] transition-all shadow-lg shadow-red-500/30"
            >
              Create Request
            </button>
          </div>
        )}

      </div>

      <ServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddService}
      />
    </div>
  );
}