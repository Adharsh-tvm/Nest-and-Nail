export interface WorkerDashboardStatsDTO {
  totalJobs: number;
  ongoingJobs: number;
  pendingJobs: number;
  cancelledJobs: number;
  totalEarnings: number;
  walletBalance: number;
  rating: number;
  totalRatings: number;
}

export interface WorkerScheduleItemDTO {
  title?: string;
  date: Date;
  status: string;
}

export interface WorkerUpcomingServiceDTO {
  title?: string;
  date: Date;
  location: string;
  clientName: string;
  clientImage: string;
  status: string;
}

export interface MonthlyEarningDTO {
  name: string;
  earnings: number;
}

export interface JobStatusChartDTO {
  name: string;
  value: number;
  color: string;
}

export interface WorkerDashboardChartsDTO {
  monthlyEarnings: MonthlyEarningDTO[];
  jobsByStatus: JobStatusChartDTO[];
}

export interface WorkerRecentReviewDTO {
  id: string;
  rating: number;
  review: string;
  createdAt: Date;
  clientName: string;
  clientImage: string;
}

export interface WorkerDashboardResponseDTO {
  stats: WorkerDashboardStatsDTO;
  schedules: WorkerScheduleItemDTO[];
  upcomingService: WorkerUpcomingServiceDTO | null;
  charts: WorkerDashboardChartsDTO;
  recentReviews: WorkerRecentReviewDTO[];
}
