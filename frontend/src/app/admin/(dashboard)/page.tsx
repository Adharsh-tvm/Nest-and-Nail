"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  TrendingUp,
  Users,
  BriefcaseBusiness
} from "lucide-react";
import { getAdminDashboardDataAction } from "@/app/actions/admin/admin-actions";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  theme: "green" | "white";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
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

const WorkerRow = ({
  name,
  role,
}: {
  name: string;
  role: string;
}) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-emerald-50/50 rounded-2xl transition-all border border-transparent hover:border-emerald-100 cursor-pointer">
    <div className="flex items-center gap-4">
      <div>
        <h4 className="font-bold text-gray-900">{name}</h4>
        <p className="text-xs font-medium text-emerald-600">{role}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-700">
        Top Rated
      </span>
    </div>
  </div>
);

interface MonthlyChartData {
  name: string;
  revenue: number;
  sales: number;
}

interface ServiceStatusChartData {
  name: string;
  value: number;
  color: string;
}

interface CategoryChartData {
  name: string;
  value: number;
  fill: string;
}

interface TopWorkerData {
  id: string;
  name: string;
  rating: number;
  totalRatings: number;
}

interface DashboardData {
  stats: {
    totalServices: number;
    completedServices: number;
    activeJobs: number;
    pendingJobs: number;
    totalRevenue: number;
    totalRefunds: number;
  };
  charts: {
    monthlyData: MonthlyChartData[];
    servicesByStatus: ServiceStatusChartData[];
    topCategories: CategoryChartData[];
  };
  topWorkers: TopWorkerData[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboardDataAction().then((res) => {
      if (res.success) {
        setData(res.payload as DashboardData || null);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#1B4332] border-t-transparent"></div>
      </div>
    );
  }

  if (!data) {
    return <div>Failed to load dashboard data.</div>;
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h2>
          <p className="text-gray-500 mt-1 font-medium">
            Overview of platform performance, sales, and top metrics.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Services"
          value={data.stats.totalServices.toString()}
          theme="green"
        />
        <StatCard 
          title="Completed Jobs" 
          value={data.stats.completedServices.toString()} 
          theme="white" 
        />
        <StatCard 
          title="Active & Pending" 
          value={(data.stats.activeJobs + data.stats.pendingJobs).toString()} 
          theme="white" 
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${data.stats.totalRevenue.toLocaleString()}`} 
          theme="white" 
        />
        <StatCard 
          title="Total Refunds" 
          value={`₹${(data.stats.totalRefunds || 0).toLocaleString()}`} 
          theme="white" 
        />
      </div>

      {/* Charts Section 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Area Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                <TrendingUp className="text-emerald-500" size={24} />
                Revenue Over Time
              </h3>
              <p className="text-gray-500 text-sm mt-1">Last 6 months revenue progression</p>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.charts?.monthlyData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B4332" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1B4332" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(val) => `₹${val}`} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1B4332', fontWeight: 'bold' }}
                  formatter={(value: unknown) => [`₹${(Number(value) || 0).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1B4332" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Bar Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
          <div className="mb-6">
            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
              <BriefcaseBusiness className="text-emerald-500" size={24} />
              Monthly Sales (Services)
            </h3>
            <p className="text-gray-500 text-sm mt-1">Number of services booked per month</p>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.charts?.monthlyData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f0fdf4'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: unknown) => [Number(value) || 0, 'Sales']}
                />
                <Bar dataKey="sales" fill="#34d399" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Section 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Services by Status (Pie) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center h-[400px]">
          <div className="w-full mb-2">
            <h3 className="font-bold text-xl text-gray-900">Service Success Rate</h3>
            <p className="text-gray-500 text-sm mt-1">Breakdown by current status</p>
          </div>
          <div className="flex-1 w-full min-h-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.charts?.servicesByStatus || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {(data?.charts?.servicesByStatus || []).map((entry: ServiceStatusChartData, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: unknown) => [Number(value) || 0, 'Services']}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-[#1B4332] p-6 rounded-3xl shadow-lg shadow-[#1B4332]/20 flex flex-col h-[400px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="relative z-10 mb-6">
            <h3 className="font-bold text-xl text-white">Top 5 Categories</h3>
            <p className="text-emerald-200 text-sm mt-1">Most popular service categories</p>
          </div>
          <div className="flex-1 w-full min-h-0 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.charts?.topCategories || []} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#a7f3d0', fontSize: 12, fontWeight: 500}} width={100} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ borderRadius: '12px', backgroundColor: '#064e3b', border: 'none', color: 'white' }}
                  formatter={(value: unknown) => [Number(value) || 0, 'Services']}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                  {(data?.charts?.topCategories || []).map((entry: CategoryChartData, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {(data?.charts?.topCategories || []).length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-emerald-200">
                No categories data available
              </div>
            )}
          </div>
        </div>

        {/* Top Workers List */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                <Users className="text-emerald-500" size={24} />
                Top Rated Workers
              </h3>
              <p className="text-gray-500 text-sm mt-1">Highest rated professionals</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {(data?.topWorkers || []).map((worker: TopWorkerData) => (
              <WorkerRow
                key={worker.id}
                name={worker.name}
                role={`Rating: ${worker.rating.toFixed(1)} ⭐ (${worker.totalRatings} reviews)`}
              />
            ))}
            {(data?.topWorkers || []).length === 0 && (
                <div className="h-full flex items-center justify-center text-gray-400">No workers found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
