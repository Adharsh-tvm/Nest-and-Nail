import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/shared/types/responseTypes";
import { WORKER_ROUTES } from "@/sources/constant-api/worker.routes";

export interface Review {
  id: string;
  clientName: string;
  clientImage?: string;
  rating: number;
  review?: string;
  createdAt: string;
}

export interface DashboardStats {
  walletBalance: number;
  totalEarnings: number;
  totalJobs: number;
  ongoingJobs: number;
  pendingJobs: number;
  cancelledJobs?: number;
  totalRatings: number;
  rating: number;
}

export interface UpcomingService {
  title: string;
  clientName: string;
  clientImage?: string;
  date: string;
  location: string;
}

export interface ScheduleItem {
  title: string;
  date: string;
  status: string;
}

export interface WorkerDashboardData {
  stats: DashboardStats;
  upcomingService?: UpcomingService | null;
  schedules?: ScheduleItem[];
  recentReviews?: Review[];
  charts?: {
    monthlyEarnings?: { name: string; earnings: number }[];
    jobsByStatus?: { name: string; value: number; color?: string }[];
  };
}

export async function fetchWorkerDashboardData(months?: number): Promise<ApiResponse<WorkerDashboardData>> {
  const query = months ? `?months=${months}` : '';
  const res = await axiosInstance.get<ApiResponse<WorkerDashboardData>>(`${WORKER_ROUTES.DASHBOARD}${query}`);
  return res.data;
}
