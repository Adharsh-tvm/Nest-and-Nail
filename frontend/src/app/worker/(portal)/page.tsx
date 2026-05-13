"use client";

import React, { useEffect, useState } from "react";
import { getWorkerDashboardDataAction } from "@/app/actions/worker/dashboard-actions";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  IndianRupee, Briefcase, Clock, Star, Calendar, MessageSquareQuote, Wallet, MapPin, CalendarDays, XCircle
} from "lucide-react";
import toast from "react-hot-toast";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  color?: string;
}

const StatCard = ({ title, value, icon: Icon, color = "indigo" }: StatCardProps) => {
  const colorMap: Record<string, { iconBg: string, iconColor: string }> = {
    primary: { iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    secondary: { iconBg: "bg-teal-50", iconColor: "text-teal-600" },
    info: { iconBg: "bg-sky-50", iconColor: "text-sky-600" },
    warning: { iconBg: "bg-amber-50", iconColor: "text-amber-600" },
  };
  const theme = colorMap[color] || colorMap.primary;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${theme.iconBg} ${theme.iconColor}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <p className="text-3xl font-semibold text-gray-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
};

import {
  Review,
  WorkerDashboardData
} from "@/sources/api/worker/dashboard.api";

const ReviewRow = ({ review }: { review: Review }) => (
  <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors duration-200">
    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={review.clientImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.clientName}`}
        alt={review.clientName}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start mb-1.5">
        <h4 className="font-semibold text-gray-900 truncate">{review.clientName}</h4>
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-sm font-medium text-gray-700">{review.rating.toFixed(1)}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">&quot;{review.review || "No written review"}&quot;</p>
      <p className="text-xs text-gray-400 mt-3 font-medium">
        {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
      </p>
    </div>
  </div>
);

export default function WorkerDashboardPage() {
  const [data, setData] = useState<WorkerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<number>(6);

  useEffect(() => {
    fetchData(timeRange);
  }, [timeRange]);

  const fetchData = async (months: number) => {
    setLoading(true);
    const res = await getWorkerDashboardDataAction(months);
    if (res.success) {
      setData(res.payload || null);
    } else {
      toast.error(res.message || "Failed to load dashboard data");
    }
    setLoading(false);
  };

  if (loading && !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-center text-gray-500 font-medium">Failed to load dashboard data.</div>;
  }

  // Pre-process pie chart data for specific colors
  const STATUS_COLORS: Record<string, string> = {
    'Completed': '#059669', // emerald-600
    'In Progress': '#0d9488', // teal-600
    'Pending': '#0ea5e9', // sky-500
    'Cancelled': '#f43f5e', // rose-500
  };

  const enhancedPieData = (data?.charts?.jobsByStatus || []).map((item) => ({
    ...item,
    color: STATUS_COLORS[item.name] || item.color
  }));

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-16 px-4 sm:px-6 lg:px-8 pt-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium tracking-wide uppercase">Portal Overview</span>
          </div>
          <h2 className="text-3xl tracking-tight font-semibold text-gray-900">My Workspace</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-sm h-full">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="flex flex-col pr-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Wallet Balance</span>
              <span className="text-lg font-semibold text-gray-900 leading-none">₹{(data.stats.walletBalance || 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-2 shadow-sm h-full">
            <div className="p-2 text-gray-400">
              <Calendar className="w-4 h-4" />
            </div>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="bg-transparent border-none text-sm font-medium text-gray-700 py-1.5 pr-8 pl-1 focus:ring-0 cursor-pointer outline-none"
            >
              <option value={3}>Last 3 Months</option>
              <option value={6}>Last 6 Months</option>
              <option value={12}>Last 1 Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Earnings"
          value={`₹${data.stats.totalEarnings.toLocaleString()}`}
          icon={IndianRupee}
          color="primary"
        />
        <StatCard 
          title="Completed Jobs" 
          value={data.stats.totalJobs.toString()} 
          icon={Briefcase}
          color="secondary" 
        />
        <StatCard 
          title="Pending / Ongoing" 
          value={(data.stats.ongoingJobs + data.stats.pendingJobs).toString()} 
          icon={Clock}
          color="info" 
        />
        <StatCard 
          title="Cancelled Jobs" 
          value={(data.stats.cancelledJobs || 0).toString()} 
          icon={XCircle}
          color="warning" 
        />
        <StatCard 
          title={`Rating (${data.stats.totalRatings})`}
          value={`${(data.stats.rating || 0).toFixed(1)}`} 
          icon={Star}
          color="primary" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Earnings Line Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col xl:col-span-2 h-[400px]">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                Revenue Trajectory
              </h3>
              <p className="text-gray-500 text-sm mt-1">Your income progression over the selected period</p>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-0 relative">
            {loading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                 <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.charts?.monthlyEarnings || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  cursor={{stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4'}}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#111827', fontWeight: '600', fontSize: '14px' }}
                  labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                  formatter={(value: unknown) => [`₹${Number(value).toLocaleString()}`, 'Earnings']}
                />
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#059669" 
                  strokeWidth={2} 
                  dot={{ fill: '#ffffff', stroke: '#059669', strokeWidth: 2, r: 4 }} 
                  activeDot={{ r: 6, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jobs by Status (Radial Pie) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[400px]">
          <div className="w-full mb-6">
            <h3 className="font-semibold text-lg text-gray-900">
              Service Status
            </h3>
            <p className="text-gray-500 text-sm mt-1">Overview of your job pipeline</p>
          </div>
          
          <div className="flex-1 w-full min-h-0 flex items-center justify-center relative">
            {loading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                 <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enhancedPieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  cornerRadius={4}
                  dataKey="value"
                  stroke="none"
                >
                  {enhancedPieData.map((entry, index: number) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}
                  labelStyle={{ display: 'none' }}
                  formatter={(value: unknown, name: unknown) => [Number(value), String(name)]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '13px', color: '#475569' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {enhancedPieData.length === 0 && !loading && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                No active jobs in this period
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule & Upcoming Service Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Next Upcoming Service */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
              Next Upcoming Service
            </h3>
            <p className="text-gray-500 text-sm mt-1">Details for your next scheduled job</p>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {data?.upcomingService ? (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.upcomingService.clientImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.upcomingService.clientName}`} alt="client" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900 leading-tight mb-1">{data.upcomingService.title}</h4>
                    <p className="text-gray-600 text-sm font-medium">{data.upcomingService.clientName}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    <span>{new Date(data.upcomingService.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{new Date(data.upcomingService.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{data.upcomingService.location}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                <CalendarDays className="w-8 h-8 text-gray-400 mb-3" />
                <p className="font-medium text-gray-600">No upcoming services scheduled.</p>
                <p className="text-sm mt-1">Take a break or find new jobs!</p>
              </div>
            )}
          </div>
        </div>

        {/* Schedules / Calendar View */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[400px]">
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-gray-900">
              Service Timeline
            </h3>
            <p className="text-gray-500 text-sm mt-1">Your upcoming job schedule</p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-4 space-y-4 custom-scrollbar pb-2">
            {(() => {
              const schedules = data?.schedules || [];
              return schedules.length > 0 ? (
                schedules.slice(0, 10).map((schedule, idx: number) => {
                  const isToday = new Date().toDateString() === new Date(schedule.date).toDateString();
                  return (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="flex flex-col items-center mt-2">
                        <div className={`w-3 h-3 rounded-full ${isToday ? 'bg-emerald-500 ring-4 ring-emerald-50' : 'bg-gray-300'}`} />
                        {idx !== (schedules.length - 1) && <div className="w-px h-12 bg-gray-200 my-1" />}
                      </div>
                      <div className={`flex-1 p-4 rounded-xl border ${isToday ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-gray-100'}`}>
                        <h4 className="font-semibold text-sm text-gray-900 mb-1">{schedule.title}</h4>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 flex items-center gap-1.5">
                            {new Date(schedule.date).toLocaleDateString()} at {new Date(schedule.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide rounded-md ${schedule.status === 'IN_PROGRESS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                            {schedule.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center text-center text-gray-500 text-sm">
                  No schedules available.
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Reviews */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              Recent Endorsements
            </h3>
            <p className="text-gray-500 text-sm mt-1">What clients are saying about your work</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data?.recentReviews || []).map((review) => (
            <ReviewRow key={review.id} review={review} />
          ))}
        </div>
        
        {(data?.recentReviews || []).length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
            <MessageSquareQuote className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="font-medium text-gray-600">No reviews received yet.</p>
            <p className="text-sm mt-1">Complete more jobs to earn feedback!</p>
          </div>
        )}
      </div>

    </div>
  );
}
