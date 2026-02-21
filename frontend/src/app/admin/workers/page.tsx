"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Wrench,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Wallet,
  Menu,
  User,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Search,
  Star,
  Phone,
  Mail,
  Filter,
  CheckCircle,
  X,
  ChevronDown,
} from "lucide-react";
import { useWorkers } from "@/hooks/useWorkers";
import { VerificationStatus } from "@/shared/enums/authEnums";

// --- Types ---

interface ServiceCategory {
  name: string;
  value: number;
  color: string;
}

interface Worker {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  specialties: string[];
  rating: number;
  servicesCompleted: number;
  status: "Active" | "Suspended" | "Inactive";
  verificationStatus: "Approved" | "Pending" | "Rejected";
  earnings: string;
  avatarColor: string;
}

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

interface HeaderProps {
  title: string;
  subtitle: string;
  onMenuClick: () => void;
}

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

// --- Mock Data ---

const serviceCategories: ServiceCategory[] = [
  { name: "Cleaning", value: 85, color: "bg-blue-800" },
  { name: "Plumbing", value: 65, color: "bg-blue-800" },
  { name: "Electrical", value: 55, color: "bg-blue-800" },
  { name: "Gardening", value: 45, color: "bg-blue-800" },
  { name: "Painting", value: 30, color: "bg-blue-800" },
];

const workersData: Worker[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@worker.com",
    phone: "+1 (555) 123-4567",
    role: "Plumber",
    specialties: ["Plumbing", "Electrical"],
    rating: 4.9,
    servicesCompleted: 156,
    status: "Active",
    verificationStatus: "Approved",
    earnings: "$8,940",
    avatarColor: "bg-blue-600",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@worker.com",
    phone: "+1 (555) 234-5678",
    role: "Cleaner",
    specialties: ["Cleaning", "Gardening"],
    rating: 4.8,
    servicesCompleted: 142,
    status: "Active",
    verificationStatus: "Approved",
    earnings: "$8,320",
    avatarColor: "bg-emerald-600",
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike.wilson@worker.com",
    phone: "+1 (555) 345-6789",
    role: "Painter",
    specialties: ["Painting", "Repairs"],
    rating: 4.7,
    servicesCompleted: 128,
    status: "Suspended",
    verificationStatus: "Approved",
    earnings: "$7,680",
    avatarColor: "bg-indigo-600",
  },
];

// --- WORKERS PAGE COMPONENT (New) ---

const WorkersView = () => {
  const { workers, loading, error } = useWorkers();

  console.log(workers);

  if (loading) return <p className="p-6">Loading customers...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  if (!workers || workers.length === 0) {
    return <p className="p-6 text-slate-500">No workers found.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-5">
      {/* Top Stats - Specific to Workers Page */}
      <div className="flex justify-end gap-4 mb-2">
        <div className="bg-white px-6 py-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Workers</p>
            <p className="text-lg font-bold text-slate-800">{workers.length}</p>
          </div>
        </div>
        <div className="bg-white px-6 py-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Avg Rating</p>
            <p className="text-lg font-bold text-slate-800">
              {workers.length > 0
                ? (
                    workers.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
                    workers.length
                  ).toFixed(1)
                : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search Section */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-600"
            />
          </div>

          {/* Filter Toggles */}
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            {/* Status Filter */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button className="px-4 py-1.5 text-xs font-medium bg-blue-900 text-white rounded-md shadow-sm">
                All
              </button>
              <button className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900">
                Active
              </button>
              <button className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900">
                Suspended
              </button>
            </div>

            {/* Approval Filter */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button className="px-4 py-1.5 text-xs font-medium bg-[#f97316] text-white rounded-md shadow-sm">
                All
              </button>
              <button className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900">
                Approved
              </button>
              <button className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900">
                Pending
              </button>
              <button className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900">
                Rejected
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Worker Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">Worker Directory</h3>
          {/* <p className="text-sm text-slate-500">View and manage worker profiles, performance, and verification status</p> */}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-5 min-w-[200px]">Worker</th>
                <th className="p-5 min-w-[250px]">Contact & Specialties</th>
                <th className="p-5">Performance</th>
                <th className="p-5">Status</th>
                <th className="p-5">Verification</th>
                <th className="p-5">Earnings</th>
                <th className="p-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workers.map((worker) => (
                <tr
                  key={worker.user_id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  {/* Worker Column */}
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {worker.user_name}
                        </p>
                        <p className="text-xs text-slate-400">
                          ID: {worker.user_id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact & Specialties */}
                  <td className="p-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail className="w-3 h-3" />
                        {worker.email_address}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone className="w-3 h-3" />
                        {worker.phone}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {/* {worker.skills.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200 uppercase tracking-wide"
                          >
                            {tag}
                          </span>
                        ))} */}
                      </div>
                    </div>
                  </td>

                  {/* Performance */}
                  <td className="p-5">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-slate-800">
                        {worker.rating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {worker.weeklyJobCount || 0} services
                    </p>
                  </td>

                  {/* Status */}
                  <td className="p-5 text-slate-600">
                    {worker.isBlocked ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                        Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                        Active
                      </span>
                    )}
                  </td>

                  {/* Verification */}
                  <td className="p-5 text-slate-600">
                    {worker.isVerified === VerificationStatus.VERIFIED ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                        Not Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                        Verified
                      </span>
                    )}
                  </td>

                  {/* Earnings */}
                  <td className="p-5 font-semibold text-slate-700">{0}</td>

                  {/* Actions */}
                  <td className="p-5 text-right">
                    <button className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer (Static) */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
          <span>Showing 1-3 of 3 workers</span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-slate-300 rounded hover:bg-white disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border border-slate-300 rounded hover:bg-white disabled:opacity-50"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkersView;
