"use client";

import React, { useEffect, useState } from "react";
import { getWorkerDashboardDataAction } from "@/app/actions/worker/dashboard-actions";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  IndianRupee, Briefcase, Clock, Star, Calendar, MessageSquareQuote, TrendingUp, Wallet, MapPin, CalendarDays, XCircle
} from "lucide-react";
import toast from "react-hot-toast";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  color?: string;
}

const StatCard = ({ title, value, icon: Icon, color = "indigo" }: StatCardProps) => {
  const colorMap: Record<string, string> = {
    indigo: "from-indigo-500/10 to-indigo-500/5 text-indigo-600 border-indigo-100",
    violet: "from-violet-500/10 to-violet-500/5 text-violet-600 border-violet-100",
    blue: "from-blue-500/10 to-blue-500/5 text-blue-600 border-blue-100",
    amber: "from-amber-500/10 to-amber-500/5 text-amber-600 border-amber-100",
  };

  const bgClasses = colorMap[color] || colorMap.indigo;

  return (
    <div className={`p-6 rounded-3xl border bg-gradient-to-br bg-white shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group`}>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${bgClasses} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} strokeWidth={2} />
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-sm font-medium mb-1 text-gray-500">{title}</h3>
        <p className="text-3xl font-extrabold tracking-tight text-gray-900">{value}</p>
      </div>
      
      {/* Decorative gradient orb */}
      <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-br ${bgClasses} blur-2xl opacity-50`} />
    </div>
  );
};

interface Review {
  id: string;
  clientName: string;
  clientImage?: string;
  rating: number;
  review?: string;
  createdAt: string;
}

const ReviewRow = ({ review }: { review: Review }) => (
  <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 group">
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
      <img
        src={review.clientImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.clientName}`}
        alt={review.clientName}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-bold text-gray-900 truncate">{review.clientName}</h4>
        <div className="flex items-center bg-amber-50 px-2 py-1 rounded-full border border-amber-100/50">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
          <span className="text-xs font-bold text-amber-700">{review.rating.toFixed(1)}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2 mt-1 font-medium">"{review.review || "No written review"}"</p>
      <p className="text-xs text-gray-400 mt-2 font-medium">
        {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
      </p>
    </div>
  </div>
);

interface DashboardStats {
  walletBalance: number;
  totalEarnings: number;
  totalJobs: number;
  ongoingJobs: number;
  pendingJobs: number;
  cancelledJobs?: number;
  totalRatings: number;
  rating: number;
}

interface UpcomingService {
  title: string;
  clientName: string;
  clientImage?: string;
  date: string;
  location: string;
}

interface ScheduleItem {
  title: string;
  date: string;
  status: string;
}

interface WorkerDashboardData {
  stats: DashboardStats;
  upcomingService?: UpcomingService | null;
  schedules?: ScheduleItem[];
  recentReviews?: Review[];
  charts?: {
    monthlyEarnings?: { name: string; earnings: number }[];
    jobsByStatus?: { name: string; value: number; color?: string }[];
  };
}

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
      setData(res.payload);
    } else {
      toast.error(res.message || "Failed to load dashboard data");
    }
    setLoading(false);
  };

  if (loading && !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-center text-gray-500">Failed to load dashboard data.</div>;
  }

  // Pre-process pie chart data for specific colors
  const STATUS_COLORS: Record<string, string> = {
    'Completed': '#4f46e5', // indigo-600
    'In Progress': '#8b5cf6', // violet-500
    'Pending': '#0ea5e9', // sky-500
    'Cancelled': '#f43f5e', // rose-500
  };

  const enhancedPieData = (data?.charts?.jobsByStatus || []).map((item) => ({
    ...item,
    color: STATUS_COLORS[item.name] || item.color
  }));

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wider uppercase">Portal Overview</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Workspace</h2>
        
        </div>
        
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-2xl py-2.5 px-4 shadow-sm h-full">
            <Wallet className="w-5 h-5 text-indigo-500" />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Wallet Balance</span>
              <span className="text-sm font-black text-indigo-700">₹{(data.stats.walletBalance || 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-1 shadow-inner h-full">
            <Calendar className="w-5 h-5 text-gray-400 ml-3" />
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="bg-transparent border-none text-sm font-bold text-gray-700 py-2.5 pr-10 focus:ring-0 cursor-pointer"
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
          color="indigo"
        />
        <StatCard 
          title="Completed Jobs" 
          value={data.stats.totalJobs.toString()} 
          icon={Briefcase}
          color="violet" 
        />
        <StatCard 
          title="Pending / Ongoing" 
          value={(data.stats.ongoingJobs + data.stats.pendingJobs).toString()} 
          icon={Clock}
          color="blue" 
        />
        <StatCard 
          title="Cancelled Jobs" 
          value={(data.stats.cancelledJobs || 0).toString()} 
          icon={XCircle}
          color="amber" 
        />
        <StatCard 
          title={`Rating (${data.stats.totalRatings})`}
          value={`${(data.stats.rating || 0).toFixed(1)}`} 
          icon={Star}
          color="indigo" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Earnings Line Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col xl:col-span-2 h-[420px] relative overflow-hidden">
          <div className="mb-6 flex justify-between items-start relative z-10">
            <div>
              <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                <TrendingUp className="text-indigo-500" size={24} />
                Revenue Trajectory
              </h3>
              <p className="text-gray-500 text-sm mt-1">Your income progression over the selected period</p>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-0 relative z-10">
            {loading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
                 <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.charts?.monthlyEarnings || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  cursor={{stroke: '#e0e7ff', strokeWidth: 2, strokeDasharray: '4 4'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                  formatter={(value: unknown) => [`₹${Number(value).toLocaleString()}`, 'Earnings']}
                />
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#4f46e5" 
                  strokeWidth={4} 
                  dot={{ fill: '#ffffff', stroke: '#4f46e5', strokeWidth: 3, r: 6 }} 
                  activeDot={{ r: 8, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        </div>

        {/* Jobs by Status (Radial Pie) */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center h-[420px] relative overflow-hidden">
          <div className="w-full mb-2 relative z-10">
            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
              <Briefcase className="text-violet-500" size={24} />
              Service Status
            </h3>
            <p className="text-gray-500 text-sm mt-1">Overview of your job pipeline</p>
          </div>
          
          <div className="flex-1 w-full min-h-0 flex items-center justify-center relative z-10">
            {loading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
                 <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"></div>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enhancedPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={105}
                  paddingAngle={8}
                  cornerRadius={8}
                  dataKey="value"
                  stroke="none"
                >
                  {enhancedPieData.map((entry, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                  formatter={(value: unknown) => [Number(value), 'Jobs']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '13px', fontWeight: 500 }}
                />
              </PieChart>
            </ResponsiveContainer>
            {enhancedPieData.length === 0 && !loading && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-medium">
                No active jobs in this period
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        </div>
      </div>

      {/* Schedule & Upcoming Service Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Next Upcoming Service */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 mb-6">
            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
              <Briefcase className="text-blue-500" size={24} />
              Next Upcoming Service
            </h3>
            <p className="text-gray-500 text-sm mt-1">Details for your next scheduled job</p>
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            {data?.upcomingService ? (
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm border border-blue-100 flex-shrink-0">
                    <img src={data.upcomingService.clientImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.upcomingService.clientName}`} alt="client" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 leading-tight">{data.upcomingService.title}</h4>
                    <p className="text-sm font-medium text-blue-600">{data.upcomingService.clientName}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-5">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <CalendarDays className="w-5 h-5 text-gray-400" />
                    <span>{new Date(data.upcomingService.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>{new Date(data.upcomingService.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>{data.upcomingService.location}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-500">
                <CalendarDays className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                You don't have any upcoming services scheduled right now.
              </div>
            )}
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        </div>

        {/* Schedules / Calendar View */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden flex flex-col h-[400px]">
          <div className="relative z-10 mb-6">
            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
              <CalendarDays className="text-indigo-500" size={24} />
              Service Schedule
            </h3>
            <p className="text-gray-500 text-sm mt-1">Your upcoming job timeline</p>
          </div>
          
          <div className="relative z-10 flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {(() => {
              const schedules = data?.schedules || [];
              return schedules.length > 0 ? (
                schedules.slice(0, 10).map((schedule, idx: number) => {
                  const isToday = new Date().toDateString() === new Date(schedule.date).toDateString();
                  return (
                    <div key={idx} className="flex gap-4 items-start group">
                      <div className="flex flex-col items-center mt-1">
                        <div className={`w-3 h-3 rounded-full ${isToday ? 'bg-indigo-500 ring-4 ring-indigo-100' : 'bg-gray-300'}`} />
                        {idx !== (schedules.length - 1) && <div className="w-0.5 h-12 bg-gray-100 my-1" />}
                      </div>
                      <div className={`flex-1 p-3 rounded-xl border transition-all ${isToday ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-gray-100 group-hover:border-indigo-100 group-hover:shadow-sm'}`}>
                        <h4 className="font-bold text-sm text-gray-900">{schedule.title}</h4>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">
                          {new Date(schedule.date).toLocaleDateString()} at {new Date(schedule.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${schedule.status === 'IN_PROGRESS' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}`}>
                          {schedule.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center text-center text-gray-500">
                  No schedules available.
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Reviews */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="mb-6 flex justify-between items-center relative z-10">
          <div>
            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
              <MessageSquareQuote className="text-amber-500" size={24} />
              Recent Endorsements
            </h3>
            <p className="text-gray-500 text-sm mt-1">What clients are saying about your work</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {(data?.recentReviews || []).map((review) => (
            <ReviewRow key={review.id} review={review} />
          ))}
        </div>
        
        {(data?.recentReviews || []).length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-500 font-medium relative z-10">
            <MessageSquareQuote className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            No reviews received yet. Complete more jobs to earn feedback!
          </div>
        )}
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-amber-500/5 blur-[100px] pointer-events-none rounded-full" />
      </div>

    </div>
  );
}
