"use client";

import React from "react";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  ArrowUpRight,
  Plus,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon?: React.ComponentType<any>;
  theme: "green" | "white";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  theme,
}) => (
  <div
    className={`p-6 rounded-3xl flex flex-col justify-between h-48 relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
      theme === "green"
        ? "bg-[#1B4332] text-white shadow-lg shadow-[#1B4332]/20"
        : "bg-white text-gray-800 shadow-sm border border-gray-100"
    }`}
  >
    <div className="flex justify-between items-start z-10">
      <div>
        <p
          className={`font-medium mb-2 ${
            theme === "green" ? "text-emerald-100" : "text-gray-500"
          }`}
        >
          {title}
        </p>
        <h3 className="text-4xl font-bold">{value}</h3>
      </div>
      <button
        className={`p-2 rounded-full transition-colors ${
          theme === "green"
            ? "bg-white/10 hover:bg-white/20 text-white"
            : "bg-gray-50 hover:bg-gray-100 text-gray-400"
        }`}
      >
        <ArrowUpRight size={20} />
      </button>
    </div>

    {change && (
      <div className="flex items-center gap-2 z-10">
        <span
          className={`px-2 py-1 rounded-lg text-xs font-bold ${
            theme === "green"
              ? "bg-emerald-500/20 text-emerald-100"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {change}
        </span>
        <span
          className={`text-xs ${
            theme === "green" ? "text-emerald-200" : "text-gray-400"
          }`}
        >
          Increased from last month
        </span>
      </div>
    )}

    {/* Decorative background elements for green card */}
    {theme === "green" && (
      <>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full -ml-10 -mb-5 blur-xl" />
      </>
    )}
  </div>
);

// --- Mock Components ---

const ServiceCategoryBar = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div className="flex flex-col gap-2 group cursor-pointer">
    <div className="h-32 w-full bg-gray-50 rounded-2xl relative flex items-end overflow-hidden">
      <div
        className={`w-full ${color} rounded-2xl transition-all duration-500 group-hover:opacity-90`}
        style={{ height: `${value}%` }}
      />
    </div>
    <span className="text-xs font-medium text-gray-500 text-center">
      {label}
    </span>
  </div>
);

const WorkerRow = ({
  name,
  role,
  status,
}: {
  name: string;
  role: string;
  status: "Completed" | "In Progress" | "Pending";
}) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
          alt={name}
        />
      </div>
      <div>
        <h4 className="font-bold text-sm text-gray-900">{name}</h4>
        <p className="text-xs text-gray-500">Working on {role}</p>
      </div>
    </div>
    <span
      className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
        status === "Completed"
          ? "bg-green-50 text-green-600"
          : status === "In Progress"
          ? "bg-amber-50 text-amber-600"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {status}
    </span>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500">
            Plan, prioritize, and accomplish your tasks with ease.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[#1B4332] text-white font-bold rounded-xl shadow-lg shadow-[#1B4332]/20 hover:bg-[#153426] transition-colors flex items-center gap-2">
            <Plus size={18} /> Add Service
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Services"
          value="24"
          change="+12%"
          theme="green"
        />
        <StatCard
          title="Completed"
          value="10"
          change="+5%"
          theme="white"
        />
        <StatCard
          title="Active Jobs"
          value="12"
          change="+8%"
          theme="white"
        />
        <StatCard
          title="Pending"
          value="2"
          theme="white"
        />
      </div>

      {/* Middle Section: Analytics & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900">Service Analytics</h3>
            <select className="bg-gray-50 border-none text-sm font-medium text-gray-500 rounded-lg py-1 px-3 focus:ring-0">
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>
          <div className="grid grid-cols-7 gap-4 h-64 items-end px-2">
             {/* Mock Bar Chart */}
             <ServiceCategoryBar label="Mon" value={40} color="bg-emerald-200" />
             <ServiceCategoryBar label="Tue" value={65} color="bg-[#1B4332]" />
             <ServiceCategoryBar label="Wed" value={45} color="bg-emerald-300" />
             <ServiceCategoryBar label="Thu" value={80} color="bg-[#1B4332]" />
             <ServiceCategoryBar label="Fri" value={55} color="bg-emerald-200" />
             <ServiceCategoryBar label="Sat" value={30} color="bg-emerald-100" />
             <ServiceCategoryBar label="Sun" value={20} color="bg-emerald-100" />
          </div>
        </div>

        {/* Reminders / Quick Actions */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <div className="mb-6">
            <h3 className="font-bold text-lg text-gray-900">Reminders</h3>
            <p className="text-gray-500 text-sm">Upcoming tasks & meetings</p>
          </div>
          
          <div className="flex-1 space-y-4">
             <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <h4 className="font-bold text-gray-800 mb-1">Weekly Team Sync</h4>
                <p className="text-xs text-gray-500 mb-3">Today, 02:00 pm - 03:00 pm</p>
                <button className="w-full py-2 bg-[#1B4332] text-white rounded-xl text-xs font-bold hover:bg-[#153426] transition-colors">
                   Join Meeting
                </button>
             </div>
             
             <div className="p-4 rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                      <AlertCircle size={20} />
                   </div>
                   <div>
                      <h4 className="font-bold text-sm text-gray-800 group-hover:text-[#1B4332]">Review Complaints</h4>
                      <p className="text-xs text-gray-500">3 new items</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Team & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Team Collaboration */}
         <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-lg text-gray-900">Active Workers</h3>
               <button className="text-xs font-bold text-[#1B4332] hover:underline">+ Add</button>
            </div>
            <div className="space-y-2">
               <WorkerRow name="Alexandra Deff" role="Plumbing Service" status="Completed" />
               <WorkerRow name="Edwin Adenike" role="Electrical Repair" status="In Progress" />
               <WorkerRow name="Isaac Oluwa" role="House Cleaning" status="Pending" />
            </div>
         </div>

         {/* Project Progress */}
         <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-[#1B4332]" />
             <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Simple CSS Circle Chart */}
                <svg className="w-full h-full transform -rotate-90">
                   <circle cx="80" cy="80" r="70" fill="none" stroke="#F3F4F6" strokeWidth="12" />
                   <circle cx="80" cy="80" r="70" fill="none" stroke="#1B4332" strokeWidth="12" strokeDasharray="440" strokeDashoffset="132" strokeLinecap="round" />
                </svg>
                <div className="absolute text-center">
                   <span className="text-4xl font-bold text-[#1B4332]">70%</span>
                   <p className="text-xs text-gray-500">Goal Reached</p>
                </div>
             </div>
             <div className="mt-6 text-center">
                <h3 className="font-bold text-lg text-gray-900">Monthly Target</h3>
                <div className="flex items-center gap-4 mt-2 justify-center text-xs font-medium text-gray-500">
                   <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#1B4332]" /> Completed
                   </div>
                   <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-200" /> Pending
                   </div>
                </div>
             </div>
         </div>
         
         {/* Recent Projects/Tasks */}
         <div className="lg:col-span-1 bg-[#1B4332] p-6 rounded-3xl shadow-lg shadow-[#1B4332]/20 text-white flex flex-col justify-between relative overflow-hidden">
             {/* Background Effects */}
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
             
             <div className="relative z-10">
                <h3 className="font-bold text-lg mb-1">Time Tracker</h3>
                <p className="text-emerald-200 text-sm mb-8">Track your productivity</p>
                
                <div className="text-5xl font-mono font-bold tracking-wider mb-8">
                   01:24:08
                </div>
                
                <div className="flex items-center gap-4">
                   <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1B4332] hover:bg-emerald-50 transition-colors">
                      <div className="w-3 h-3 bg-[#1B4332] rounded-sm" />
                   </button>
                   <button className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-900/20">
                      <div className="w-3 h-3 bg-white rounded-full" />
                   </button>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
}
