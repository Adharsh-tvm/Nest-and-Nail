"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
  Users,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import DataTable from "@/app/components/containers/widgets/DataTable";
import type { Column } from "@/app/components/containers/widgets/DataTable";
import { useUsers } from "@/hooks/useUsers";
import { toggleUserAccessAction } from "@/app/actions/admin/admin-actions";
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

import UserDetailsModal from "./UserDetailsModal";
import BlockConfirmationModal from "./BlockConfirmationModal";

/**
 * ----------------------------------------------------------------------------
 * MAIN CLIENTS VIEW COMPONENT
 * ----------------------------------------------------------------------------
 */
const UsersView = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get state from URL params
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const isBlockedParam = searchParams.get("isBlocked");
  const isBlocked = isBlockedParam === "true" ? true : isBlockedParam === "false" ? false : undefined;
  const isVerifiedParam = searchParams.get("isVerified");
  const isVerified = isVerifiedParam && isVerifiedParam !== "ALL" ? (isVerifiedParam as VerificationStatus) : undefined;

  // Hardcoded limit
  const limit = 5;

  // Local state for search input to handle debouncing
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Sync local search term with URL params (e.g. on back/forward navigation)
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  // Debounce URL update
  useEffect(() => {
    const timer = setTimeout(() => {
      const urlSearch = searchParams.get("search") || "";
      if (searchTerm !== urlSearch) {
        updateUrl("search", searchTerm || null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { users, loading, error, total, totalPages } = useUsers({
    page,
    limit,
    search: search, // The hook uses the URL param directly, which is updated after debounce
    isBlocked,
    isVerified,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [localUsers, setLocalUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState<any>(null);

  // Helper to update URL params
  const updateUrl = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // When filtering or searching, reset to page 1
    if (key !== "page") {
      params.set("page", "1");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (newPage: number) => {
    updateUrl("page", String(newPage));
  };

  useEffect(() => {
    if (users) setLocalUsers(users);
  }, [users]);

  const handleBlockToggle = (row: any) => {
    setUserToBlock(row);
    setBlockConfirmOpen(true);
  };

  const onConfirmBlock = async () => {
    if (!userToBlock) return;

    try {
      const updatedUser = await toggleUserAccessAction(userToBlock.id);

      setLocalUsers((prev) =>
        prev.map((u) =>
          u.id === updatedUser.id
            ? { ...u, isBlocked: updatedUser.isBlocked }
            : u
        )
      );
      setBlockConfirmOpen(false);
      setUserToBlock(null);
      toast.success(
        updatedUser.isBlocked
          ? "User blocked successfully"
          : "User unblocked successfully"
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status");
    }
  };

  const handleViewDetails = (row: any) => {
    setSelectedUser(row);
    setIsModalOpen(true);
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
                <img
                  src={row.profileImageUrl}
                  alt={row.name}
                  className="w-full h-full object-cover"
                />
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
            <div className="font-bold text-gray-900 text-base">
              {row.name || "Unknown"}
            </div>
            <div className="text-xs text-gray-400 font-mono mt-0.5">
              ID: {row.id?.toString().slice(0, 8)}...
            </div>
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
      header: "Verification",
      accessorKey: "isVerified",
      cell: (row) => {
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
      header: "Active Status",
      accessorKey: "isBlocked",
      cell: (row) => {
        if (row.isBlocked) {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
              <Ban size={14} /> Blocked
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
            <CheckCircle size={14} /> Active
          </span>
        );
      },
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

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    iconColor,
    trend,
  }: any) => (
    <div
      className={`p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md transition-all ${color}`}
    >
      <div>
        <p
          className={`text-xs font-bold uppercase tracking-wider mb-1 ${color.includes("text-white") ? "text-white/70" : "text-gray-400"}`}
        >
          {title}
        </p>
        <h3
          className={`text-3xl font-black ${color.includes("text-white") ? "text-white" : "text-gray-900"}`}
        >
          {value}
        </h3>
        {trend && (
          <p
            className={`text-xs font-bold flex items-center gap-1 mt-2 ${color.includes("text-white") ? "text-white/90" : "text-emerald-600"}`}
          >
            <TrendingUp size={12} /> {trend}
          </p>
        )}
      </div>
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color.includes("text-white") ? "bg-white/20" : "bg-gray-50"} group-hover:scale-110 transition-transform ${iconColor}`}
      >
        <Icon size={28} />
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
      {/* Header Stats */}
      {/* Note: Showing verified/blocked counts based on current page might be confusing, so we just show available stats or placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Total Users"
          value={total}
          icon={Users}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-200"
          iconColor="text-white/80"
          trend=""
        />
        {/* We could fetch global stats for these, but for now let's hide or keep them standard */}
        {/* <StatCard ... /> */}
      </div>

      {/* Main Table */}
      <div className="h-[750px] bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col">
        <DataTable<ClientRow>
          title="User Management"
          columns={columns}
          data={localUsers}
          isLoading={loading}
          searchPlaceholder="Search by name, email..."
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          actions={
            <div className="flex gap-2">
              <select
                className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1B4332]/10"
                value={isVerifiedParam || "ALL"}
                onChange={(e) => {
                  const val = e.target.value;
                  updateUrl("isVerified", val === "ALL" ? null : val);
                }}
              >
                <option value="ALL">All Verification</option>
                <option value={VerificationStatus.VERIFIED}>Verified</option>
                <option value={VerificationStatus.PENDING}>Pending</option>
                <option value={VerificationStatus.NOT_VERIFIED}>Unverified</option>
              </select>

              <select
                className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1B4332]/10"
                value={isBlockedParam === null ? "ALL" : isBlockedParam}
                onChange={(e) => {
                  const val = e.target.value;
                  updateUrl("isBlocked", val === "ALL" ? null : val);
                }}
              >
                <option value="ALL">All Status</option>
                <option value="false">Active</option>
                <option value="true">Blocked</option>
              </select>
            </div>
          }
        />
      </div>

      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />

      <BlockConfirmationModal
        isOpen={blockConfirmOpen}
        onClose={() => {
          setBlockConfirmOpen(false);
          setUserToBlock(null);
        }}
        onConfirm={onConfirmBlock}
        userName={userToBlock?.name || "User"}
        isBlocked={userToBlock?.isBlocked || false}
      />
    </div>
  );
};

export default UsersView;
