"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  Calendar,
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  User,
  Wrench,
  Activity,
  CheckSquare,
  Video
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import DataTable, {
  Column,
} from "@/app/components/containers/widgets/DataTable";
import {
  AdminServiceResponseDTO,
} from "@/shared/types/serviceTypes";
import { getAdminServicesAction } from "@/app/actions/admin/service-actions";

const AdminMeetingsPage = () => {
  const router = useRouter();
  const [meetings, setMeetings] = useState<AdminServiceResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await getAdminServicesAction();

      if (!res.success) {
        throw new Error(res.error || "Failed to load meetings");
      }

      const meetingsOnly = (res.data || []).filter(s => s.category === "VIDEO_CALL");
      setMeetings(meetingsOnly);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const filteredMeetings = meetings.filter((m) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      m.category.toLowerCase().includes(searchLower) ||
      m.client.name.toLowerCase().includes(searchLower) ||
      m.worker.name.toLowerCase().includes(searchLower) ||
      m.status.toLowerCase().includes(searchLower)
    );
  });

  // Stats
  const totalMeetings = meetings.length;
  const activeMeetings = meetings.filter(
    (m) =>
      m.status === "OPEN" ||
      m.status === "PENDING" ||
      m.status === "CONFIRMED" ||
      m.status === "IN_PROGRESS",
  ).length;
  const completedMeetings = meetings.filter(
    (m) => m.status === "COMPLETED",
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "CONFIRMED":
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "PENDING":
      case "OPEN":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "CANCELLED":
      case "CANCELLED_BY_CLIENT":
      case "CANCELLED_BY_WORKER":
      case "EXPIRED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle size={14} className="mr-1" />;
      case "CONFIRMED":
      case "IN_PROGRESS":
        return <Activity size={14} className="mr-1" />;
      case "PENDING":
      case "OPEN":
        return <Clock size={14} className="mr-1" />;
      case "CANCELLED":
      case "CANCELLED_BY_CLIENT":
      case "CANCELLED_BY_WORKER":
      case "EXPIRED":
        return <XCircle size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  const columns: Column<AdminServiceResponseDTO>[] = [
    {
      header: "Meeting",
      accessorKey: "category",
      className: "min-w-[200px]",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 transition-all hover:scale-110">
            <Video size={18} />
          </div>
          <div>
            <div className="font-bold text-gray-900 capitalize">
              {row.category}
            </div>
            <div className="text-xs text-gray-400 font-mono mt-0.5">
              ID: {row.serviceId.substring(0, 8)}...
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Client & Worker",
      accessorKey: "client",
      cell: (row) => (
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2">
            <User size={14} className="text-blue-500" />
            <span className="font-semibold text-gray-800">
              {row.client.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-emerald-500" />
            <span className="text-gray-600">{row.worker.name}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Meeting Schedule",
      accessorKey: "scheduledDate",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-gray-800 font-medium">
            <Calendar size={14} className="text-purple-400" />
            {new Date(row.scheduledDate).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="flex gap-1 flex-wrap mt-1">
            {row.selectedSlots?.slice(0, 2).map((slot, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200"
              >
                {slot.slotType.replace("_", " ")}
              </span>
            ))}
            {row.selectedSlots?.length > 2 && (
              <span className="text-[10px] bg-gray-100 text-gray-600 px-1 py-0.5 rounded-full border border-gray-200">
                +{row.selectedSlots.length - 2}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <div className="flex flex-col gap-2">
          <div
            className={`flex items-center w-fit px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(row.status)}`}
          >
            {getStatusIcon(row.status)}
            <span>{row.status.replace(/_/g, " ")}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Duration",
      accessorKey: "duration",
      cell: (row) => (
        <div className="text-sm font-bold text-emerald-600">
          {row.videoCall?.duration || "—"}
        </div>
      ),
    },
    {
      header: "Payment",
      accessorKey: "paymentStatus",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-sm font-semibold">
          <CreditCard
            size={16}
            className={
              row.paymentStatus === "COMPLETED"
                ? "text-emerald-500"
                : "text-gray-400"
            }
          />
          <span
            className={
              row.paymentStatus === "COMPLETED"
                ? "text-emerald-700"
                : "text-gray-600"
            }
          >
            {row.paymentStatus}
          </span>
        </div>
      ),
    },
    {
      header: "",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/meetings/${row.serviceId}`);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 rounded-lg text-gray-600 hover:text-purple-600 transition-all shadow-sm"
            title="View Details"
          >
            <Eye size={16} />
            <span className="text-xs font-bold">View</span>
          </button>
        </div>
      ),
    },
  ];

  interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color?: string;
    iconColor?: string;
  }

  const StatCard = ({ title, value, icon: Icon, color, iconColor }: StatCardProps) => (
    <div
      className={`p-6 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100 bg-white hover:shadow-md transition-shadow`}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-black text-gray-900">{value}</h3>
      </div>
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50 ${iconColor}`}
      >
        <Icon size={28} />
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Meetings Management
          </h1>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <StatCard
          title="Total Meetings"
          value={totalMeetings}
          icon={Calendar}
          iconColor="text-purple-500"
        />
        <StatCard
          title="Active Meetings"
          value={activeMeetings}
          icon={Activity}
          iconColor="text-amber-500"
        />
        <StatCard
          title="Completed Meetings"
          value={completedMeetings}
          icon={CheckSquare}
          iconColor="text-emerald-500"
        />
      </div>

      <div className="h-[650px] bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col">
        <DataTable<AdminServiceResponseDTO>
          title="All Meetings"
          columns={columns}
          data={filteredMeetings}
          isLoading={loading}
          searchPlaceholder="Search meetings by category, client, worker, or status..."
        />
      </div>
    </div>
  );
};

export default AdminMeetingsPage;
