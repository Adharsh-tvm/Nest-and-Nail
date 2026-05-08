export interface DashboardStatsDTO {
    totalServices: number;
    completedServices: number;
    activeJobs: number;
    pendingJobs: number;
    totalRevenue: number;
    totalRefunds: number;
}

export interface TopCategoryDTO {
    name: string;
    value: number;
    fill: string;
}

export interface MonthlyDataDTO {
    name: string;
    revenue: number;
    sales: number;
}

export interface ServiceStatusChartDTO {
    name: string;
    value: number;
    color: string;
}

export interface TopWorkerDTO {
    id: string;
    name: string;
    role: string;
    rating?: number;
    totalRatings?: number;
    profilePictureUrl?: string;
}

export interface AdminDashboardResponseDTO {
    stats: DashboardStatsDTO;

    charts: {
        topCategories: TopCategoryDTO[];
        monthlyData: MonthlyDataDTO[];
        servicesByStatus: ServiceStatusChartDTO[];
    };

    topWorkers: TopWorkerDTO[];
}