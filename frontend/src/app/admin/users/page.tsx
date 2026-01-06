"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  MoreHorizontal,
  User,
  ShieldAlert,
  BadgeCheck,
  Eye,
  Ban,
  Unlock,
  Shield,
  TrendingUp,
  Users
} from "lucide-react";

import DataTable from "@/app/components/containers/DataTable";
import type { Column } from "@/app/components/containers/DataTable";
import { useUsers } from "@/hooks/useUsers";
import { toggleUserAccessAction } from "@/app/actions/admin-actions";
import { VerificationStatus } from "@/shared/enums/authEnums";

/**
 * ----------------------------------------------------------------------------
 * HELPER: ACTION MENU COMPONENT
 * ----------------------------------------------------------------------------
 */
const ActionMenu = ({
  row,
  onBlockToggle,
  onViewDetails,
}: {
  row: any;
  onBlockToggle: (row: any) => void;
  onViewDetails: (row: any) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="action-menu-trigger p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#1B4332] transition-colors"
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div className="action-menu-content absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onViewDetails(row);
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <Eye size={16} className="text-gray-400" /> View Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onBlockToggle(row);
              }}
              className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${row.isBlocked ? "text-emerald-600" : "text-amber-600"
                }`}
            >
              {row.isBlocked ? (
                <>
                  <Unlock size={16} /> Unblock User
                </>
              ) : (
                <>
                  <Ban size={16} /> Block User
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * ----------------------------------------------------------------------------
 * MAIN CLIENTS VIEW COMPONENT
 * ----------------------------------------------------------------------------
 */
const UsersView = () => {
  const { users, loading, error } = useUsers();
  const [localUsers, setLocalUsers] = useState<any[]>([]);

  useEffect(() => {
    if (users) setLocalUsers(users);
  }, [users]);

  // Derive stats
  const totalUsers = localUsers.length;
  const verifiedUsers = localUsers.filter(u => u.isVerified === VerificationStatus.VERIFIED).length;
  const blockedUsers = localUsers.filter(u => u.isBlocked).length;

  async function handleBlockToggle(row: any) {
    try {
      const response = await toggleUserAccessAction(row.user_id);
      const updatedUser = response.user;

      setLocalUsers((prev) =>
        prev.map((u) =>
          u.user_id === row.user_id
            ? { ...u, isBlocked: updatedUser.isBlocked }
            : u
        )
      );
    } catch (err) {
      console.error(err);
      // Ideally show toast
    }
  }

  const handleViewDetails = (row: any) => {
    alert(`Viewing details for: ${row.name || row.email}`);
  };

  type ClientRow = (typeof users)[number];

  // --- Column Configuration ---
  const columns: Column<ClientRow>[] = [
    {
      header: "User Profile",
      className: "min-w-[280px]",
      accessorKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-[#1B4332] font-bold text-lg shadow-sm border border-emerald-100/50 overflow-hidden">
              {row.profileImageUrl ? (
                <img src={row.profileImageUrl} alt={row.name} className="w-full h-full object-cover" />
              ) : (
                row.name?.charAt(0) || <User size={20} />
              )}
            </div>
            {row.isVerified === VerificationStatus.VERIFIED && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <BadgeCheck size={16} className="text-blue-500 fill-blue-50" />
              </div>
            )}
          </div>
          <div>
            <div className="font-bold text-gray-900 text-base">{row.name || "Unknown"}</div>
            <div className="text-xs text-gray-400 font-mono mt-0.5">ID: {row.id?.toString().slice(0, 8)}...</div>
          </div>
        </div>
      ),
    },
    {
      header: "Contact",
      accessorKey: "email",
      cell: (row) => (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
            <Mail size={14} className="text-gray-400" />
            {row.email}
          </div>
          {row.phone_number && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Phone size={14} className="text-gray-400" />
              {row.phone_number}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "isVerified",
      cell: (row) => {
        if (row.isBlocked) {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
              <Ban size={14} /> Blocked
            </span>
          );
        }
        if (row.isVerified === VerificationStatus.VERIFIED) {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
              <BadgeCheck size={14} /> Verified
            </span>
          );
        }
        if (row.isVerified === VerificationStatus.PENDING) {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold border border-amber-100">
              <Shield size={14} /> Pending
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-gray-500 text-xs font-bold border border-gray-100">
            <Shield size={14} /> Unverified
          </span>
        );
      },
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (row) => (
        <span className="font-medium text-gray-600 text-sm bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
          {row.role}
        </span>
      ),
    },
    {
      header: "",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end">
          <ActionMenu
            row={row}
            onBlockToggle={handleBlockToggle}
            onViewDetails={handleViewDetails}
          />
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-red-600 flex flex-col items-center justify-center gap-3 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <ShieldAlert size={24} />
        </div>
        <h3 className="font-bold text-lg">Failed to load</h3>
        <p className="text-sm opacity-80">{error as any}</p>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
      <div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#1B4332] transition-colors">{value}</h3>
        {trend && <p className="text-green-600 text-xs font-bold flex items-center gap-1 mt-2">
          <TrendingUp size={12} /> {trend}
        </p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          color="bg-emerald-50 text-emerald-600"
          trend="+12% this month"
        />
        <StatCard
          title="Verified"
          value={verifiedUsers}
          icon={BadgeCheck}
          color="bg-blue-50 text-blue-600"

        />
        <StatCard
          title="Active Now"
          value={Math.round(totalUsers * 0.8)}
          icon={User}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Blocked"
          value={blockedUsers}
          icon={Ban}
          color="bg-red-50 text-red-600"
        />
      </div>

      {/* Main Table */}
      <div className="h-[600px] lg:h-[700px]">
        <DataTable<ClientRow>
          title="User Management"
          columns={columns}
          data={localUsers}
          isLoading={loading}
          searchPlaceholder="Search by name, email or role..."
          actions={
            <button className="px-4 py-2.5 bg-[#1B4332] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#1B4332]/20 hover:bg-[#153426] transition-all flex items-center gap-2">
              <Users size={16} />
              <span>Add User</span>
            </button>
          }
        />
      </div>
    </div>
  );
};

export default UsersView;
