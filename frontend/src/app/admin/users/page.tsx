"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  MoreHorizontal,
  User,
  ShieldAlert,
  CheckCircle2,
  BadgeCheck,
  Eye,
  Ban,
  Unlock,
  Shield,
} from "lucide-react";

import DataTable from "@/app/components/containers/DataTable";
import type { Column } from "@/app/components/containers/DataTable";
import { useUsers } from "@/hooks/useUsers";
import { VerificationStatus } from "@/enums/enums";

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

  // Close menu when clicking outside
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
        onClick={() => setIsOpen((prev) => !prev)}
        className="action-menu-trigger p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#1B4332] transition-colors"
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div className="action-menu-content absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onViewDetails(row);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye size={14} className="text-gray-400" /> View Details
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onBlockToggle(row);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-gray-50 ${
                row.isBlocked ? "text-green-600" : "text-red-600"
              }`}
            >
              {row.isBlocked ? (
                <>
                  <Unlock size={14} /> Unblock User
                </>
              ) : (
                <>
                  <Ban size={14} /> Block User
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

  console.log(users);

  // Handlers for action menu
  const handleBlockToggle = (row: any) => {
    alert(
      `${row.isBlocked ? "Unblocking" : "Blocking"} user: ${row.user_name}`
    );
    // Implement actual logic here
  };

  const handleViewDetails = (row: any) => {
    alert(`Viewing details for: ${row.user_name}`);
    // Navigate to details page
  };

  type ClientRow = (typeof users)[number];

  // --- Column Configuration ---
  const columns: Column<ClientRow>[] = [
    {
      header: "User Profile",
      className: "min-w-[250px]",
      cell: (row) => (
        <div className="flex items-center gap-3">
          {/* Profile Picture */}
          <div className="relative flex-shrink-0">
            {row.profileImageUrl ? (
              <img
                src={row.profileImageUrl}
                alt={row.user_name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#1B4332] font-bold text-sm">
                {row.user_name?.charAt(0) || <User size={16} />}
              </div>
            )}

            {/* Verified Badge Overlay */}
            {row.isVerified === VerificationStatus.VERIFIED && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <BadgeCheck size={14} className="text-blue-500 fill-blue-50" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900">
                {row.user_name || "Unknown"}
              </span>
            </div>
            <div className="text-xs text-gray-400">ID: {row.user_id}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      cell: (row) => (
        <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">
          {row.user_role}
        </span>
      ),
    },
    {
      header: "Contact Info",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs">
            <Mail size={12} className="text-gray-400" />
            <span className="truncate max-w-[180px] text-gray-600">
              {row.email_address || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Phone size={12} className="text-gray-400" />
            <span className="text-gray-600">{row.phone_number || "—"}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Verification",
      cell: (row) => {
        if (row.isVerified === VerificationStatus.VERIFIED) {
          return (
            <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
              <BadgeCheck size={14} /> Verified
            </span>
          );
        }

        if (row.isVerified === VerificationStatus.PENDING) {
          return (
            <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
              <Shield size={14} /> Pending
            </span>
          );
        }

        return (
          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
            <Shield size={14} /> Not verified
          </span>
        );
      },
    },

    {
      header: "Status",
      cell: (row) =>
        row.isBlocked ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-100 text-xs font-bold">
            <ShieldAlert size={12} /> Blocked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-xs font-bold">
            <CheckCircle2 size={12} /> Active
          </span>
        ),
    },
    {
      header: "",
      className: "text-right",
      cell: (row) => (
        <ActionMenu
          row={row}
          onBlockToggle={handleBlockToggle}
          onViewDetails={handleViewDetails}
        />
      ),
    },
  ];

  // --- Error State ---
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-2">
        <ShieldAlert size={20} />
        <span>Error loading users: {error as any}</span>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="w-full h-full space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
              Total Users
            </p>
            <h3 className="text-2xl font-extrabold text-[#1B4332] mt-1">
              {users?.length || 0}
            </h3>
          </div>
          <div className="p-3 bg-green-50 text-[#1B4332] rounded-xl">
            <User size={20} />
          </div>
        </div>
      </div>

      {/* Reusable Data Table */}
      <div className="h-[calc(100vh-200px)] min-h-[400px]">
        <DataTable<ClientRow>
          title="Customer List"
          columns={columns}
          data={users || []}
          isLoading={loading}
          searchPlaceholder="Search users by name or email..."
        />
      </div>
    </div>
  );
};

export default UsersView;
