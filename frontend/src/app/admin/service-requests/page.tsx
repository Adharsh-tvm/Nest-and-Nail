"use client";

import React, { useState, useEffect } from "react";
import {
    Wrench,
    Clock,
    CheckCircle,
    AlertCircle,
    Eye,
    DollarSign,
    Calendar,
    Frown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DataTable from "@/app/components/containers/widgets/DataTable";
import type { Column } from "@/app/components/containers/widgets/DataTable";
import { ServiceRequestResponse } from "@/shared/types/ServiceRequestResponse";
import { ServiceRequestStatus } from "@/shared/enums/ServiceRequestStatus";
import { getAllServiceRequestsAction } from "@/app/actions/serviceRequest/admin/adminServiceRequest.actions";
import { toast } from "react-hot-toast";

export default function ServicesPage() {
    const router = useRouter();
    const [data, setData] = useState<ServiceRequestResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await getAllServiceRequestsAction();
            if (res.success && res.payload) {
                setData(res.payload);
            } else {
                setError(res.message);
                toast.error(res.message);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    // Stats
    const totalRequests = data.length;
    const openRequests = data.filter((r) => r.status === ServiceRequestStatus.OPEN).length;
    const acceptedRequests = data.filter((r) => r.status === ServiceRequestStatus.ACCEPTED).length;

    const handleRowClick = (row: ServiceRequestResponse) => {
        router.push(`/admin/service-requests/${row.requestId}`);
    };

    const columns: Column<ServiceRequestResponse>[] = [
        {
            header: "Service Details",
            accessorKey: "title",
            className: "min-w-[300px]",
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 line-clamp-1">{row.title}</span>
                    <span className="text-xs text-gray-400 mt-1 line-clamp-1">{row.description}</span>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                            {row.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">#{row.requestId}</span>
                    </div>
                </div>
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (row) => {
                switch (row.status) {
                    case ServiceRequestStatus.OPEN:
                        return (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                                <AlertCircle size={12} /> Open
                            </span>
                        );
                    case ServiceRequestStatus.ACCEPTED:
                        return (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                                <CheckCircle size={12} /> Accepted
                            </span>
                        );
                    default:
                        return <span className="text-gray-500">{row.status}</span>;
                }
            },
        },
        {
            header: "Budget",
            accessorKey: "budget",
            cell: (row) =>
                row.budget ? (
                    <div className="flex items-center gap-1 font-semibold text-gray-700">
                        <DollarSign size={14} className="text-emerald-500" />
                        {row.budget.toFixed(2)}
                    </div>
                ) : (
                    <span className="text-gray-400 text-xs italic">Negotiable</span>
                ),
        },
        {
            header: "Created",
            accessorKey: "createdAt",
            cell: (row) => (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={14} className="text-gray-400" />
                    {new Date(row.createdAt).toLocaleDateString()}
                </div>
            ),
        },
        {
            header: "",
            className: "text-right",
            cell: (row) => (
                <div className="flex justify-end">
                    <Link
                        href={`/admin/service-requests/${row.requestId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-gray-50 hover:bg-[#1B4332] text-gray-400 hover:text-white rounded-lg transition-all duration-200 shadow-sm"
                    >
                        <Eye size={16} />
                    </Link>
                </div>
            ),
        },
    ];

    interface StatCardProps {
        title: string;
        value: string | number;
        icon: React.ElementType;
        color: string;
        iconColor: string;
    }

    const StatCard = ({ title, value, icon: Icon, color, iconColor }: StatCardProps) => (
        <div className={`p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md transition-all ${color} border border-transparent hover:border-emerald-100`}>
            <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${color.includes('text-white') ? 'text-white/70' : 'text-gray-400'}`}>
                    {title}
                </p>
                <h3 className={`text-3xl font-black ${color.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
                    {value}
                </h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color.includes('text-white') ? 'bg-white/20' : 'bg-gray-50'} group-hover:scale-110 transition-transform ${iconColor}`}>
                <Icon size={24} />
            </div>
        </div>
    );

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <Frown className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-500 max-w-md">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-[#1B4332] text-white rounded-xl hover:bg-[#2D6A4F] transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <StatCard
                    title="Total Requests"
                    value={loading ? "-" : totalRequests}
                    icon={Wrench}
                    color="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white shadow-[#1B4332]/20"
                    iconColor="text-white"
                />
                <StatCard
                    title="Open"
                    value={loading ? "-" : openRequests}
                    icon={AlertCircle}
                    color="bg-white text-gray-900"
                    iconColor="text-blue-500"
                />
                <StatCard
                    title="Accepted"
                    value={loading ? "-" : acceptedRequests}
                    icon={CheckCircle}
                    color="bg-white text-gray-900"
                    iconColor="text-emerald-500"
                />
            </div>

            {/* Table Section */}
            <div className="h-[650px] bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col">
                <DataTable<ServiceRequestResponse>
                    title="Service Requests"
                    columns={columns}
                    data={data}
                    isLoading={loading}
                    onRowClick={handleRowClick}
                    searchPlaceholder="Search services..."
                />
            </div>
        </div>
    );
}
