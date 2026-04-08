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
  Search,
  List,
  Activity,
  CheckSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import DataTable, {
  Column,
} from "@/app/components/containers/widgets/DataTable";
import {
  AdminServiceResponseDTO,
  ServiceStatus,
  PaymentStatus,
} from "@/shared/types/serviceTypes";
import { getAdminServicesAction } from "@/app/actions/admin/service-actions";

const AdminServicesPage = () => {
  const router = useRouter();
  const [services, setServices] = useState<AdminServiceResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await getAdminServicesAction();

      if (!res.success) {
        throw new Error(res.error || "Failed to load services");
      }

      setServices(res.data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter((s) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      s.category.toLowerCase().includes(searchLower) ||
      s.client.name.toLowerCase().includes(searchLower) ||
      s.worker.name.toLowerCase().includes(searchLower) ||
      s.status.toLowerCase().includes(searchLower)
    );
  });

  // Stats
  const totalServices = services.length;
  const activeServices = services.filter(
    (s) =>
      s.status === "OPEN" ||
      s.status === "PENDING" ||
      s.status === "CONFIRMED" ||
      s.status === "IN_PROGRESS",
  ).length;
  const completedServices = services.filter(
    (s) => s.status === "COMPLETED",
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
      header: "Service",
      accessorKey: "category",
      className: "min-w-[200px]",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 transition-all hover:scale-110">
            <Wrench size={18} />
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
      header: "Schedule",
      accessorKey: "scheduledDate",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-gray-800 font-medium">
            <Calendar size={14} className="text-indigo-400" />
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
              router.push(`/admin/services/${row.serviceId}`);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-lg text-gray-600 hover:text-indigo-600 transition-all shadow-sm"
            title="View Details"
          >
            <Eye size={16} />
            <span className="text-xs font-bold">View</span>
          </button>
        </div>
      ),
    },
  ];

  const StatCard = ({ title, value, icon: Icon, color, iconColor }: any) => (
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
            Services Management
          </h1>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <StatCard
          title="Total Services"
          value={totalServices}
          icon={List}
          iconColor="text-indigo-500"
        />
        <StatCard
          title="Active Services"
          value={activeServices}
          icon={Activity}
          iconColor="text-amber-500"
        />
        <StatCard
          title="Completed Services"
          value={completedServices}
          icon={CheckSquare}
          iconColor="text-emerald-500"
        />
      </div>

      <div className="h-[650px] bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col">
        <DataTable<AdminServiceResponseDTO>
          title="All Services"
          columns={columns}
          data={filteredServices}
          isLoading={loading}
          searchPlaceholder="Search services by category, client, worker, or status..."
        />
      </div>
    </div>
  );
};

export default AdminServicesPage;
