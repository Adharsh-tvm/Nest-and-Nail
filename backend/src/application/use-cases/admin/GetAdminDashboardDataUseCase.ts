import { IGetAdminDashboardDataUseCase } from "../../../application/interfaces/admin/IGetAdminDashboardDataUseCase";
import { ServiceModel } from "../../../infrastructure/database/models/ServiceModel";
import { TransactionModel } from "../../../infrastructure/database/models/TransactionModel";
import { WorkerModel } from "../../../infrastructure/database/models/WorkerModel";
import { CategoryModel } from "../../../infrastructure/database/models/CategoryModel";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";
import { transactionSource, transactionStatus } from "../../../shared/enums/transactionEnums";
import { AdminDashboardResponseDTO } from "../../dtos/admin/AdminDashboardDTO";

interface MonthlyDataAgg {
    _id: {
        year: number;
        month: number;
    };
    revenue: number;
    sales: number;
}

export class GetAdminDashboardDataUseCase implements IGetAdminDashboardDataUseCase {
    async execute(): Promise<AdminDashboardResponseDTO> {
        const totalServices = await ServiceModel.countDocuments();
        const completedServices = await ServiceModel.countDocuments({ status: ServiceStatus.COMPLETED });
        const activeJobs = await ServiceModel.countDocuments({ status: ServiceStatus.IN_PROGRESS });
        const pendingJobs = await ServiceModel.countDocuments({ status: ServiceStatus.PENDING });
        const cancelledJobs = await ServiceModel.countDocuments({ status: ServiceStatus.CANCELLED });

        // Total Revenue
        const completedServicesData = await ServiceModel.find({ status: ServiceStatus.COMPLETED });
        const totalRevenue = completedServicesData.reduce((acc, service) => acc + (service.totalAmount ?? 0), 0);

        // Total Refunds
        const refundedTransactions = await TransactionModel.find({
            source: transactionSource.REFUND,
            status: transactionStatus.SUCCESS
        });
        const totalRefunds = refundedTransactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);

        // Top rated workers
        const topWorkers = await WorkerModel.find({ role: 'worker' })
            .sort({ rating: -1 })
            .limit(5)
            .select('name role rating totalRatings profilePictureUrl')
            .lean();

        // Services by category (Top 5)
        const categories = await CategoryModel.find().lean();
        const categoryGraphData = await Promise.all(
            categories.map(async (cat) => {
                const count = await ServiceModel.countDocuments({ category: (cat._id as { toString(): string }).toString() });
                const countByName = await ServiceModel.countDocuments({ category: cat.name });
                return {
                    name: cat.name,
                    value: count + countByName,
                    fill: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}` // Random color
                };
            })
        );
        const topCategories = categoryGraphData.sort((a, b) => b.value - a.value).slice(0, 5);

        // Revenue & Sales by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const monthlyData = (await ServiceModel.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    revenue: {
                        $sum: {
                            $cond: [{ $eq: ["$status", ServiceStatus.COMPLETED] }, "$totalAmount", 0]
                        }
                    },
                    sales: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ])) as unknown as MonthlyDataAgg[];

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Ensure all 6 months are present
        const formattedMonthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const year = d.getFullYear();
            const month = d.getMonth() + 1; // 1-12

            const found = monthlyData.find(m => m._id.year === year && m._id.month === month);
            formattedMonthlyData.push({
                name: months[month - 1],
                revenue: found ? found.revenue : 0,
                sales: found ? found.sales : 0,
            });
        }

        // Services by Status (Pie Chart)
        const servicesByStatus = [
            { name: 'Completed', value: completedServices, color: '#10b981' },
            { name: 'In Progress', value: activeJobs, color: '#f59e0b' },
            { name: 'Pending', value: pendingJobs, color: '#3b82f6' },
            { name: 'Cancelled', value: cancelledJobs, color: '#ef4444' },
        ].filter(s => s.value > 0);

        return {
            stats: {
                totalServices,
                completedServices,
                activeJobs,
                pendingJobs,
                totalRevenue,
                totalRefunds
            },
            charts: {
                topCategories: topCategories,
                monthlyData: formattedMonthlyData,
                servicesByStatus: servicesByStatus
            },
            topWorkers: topWorkers.map(w => ({
                id: (w._id as { toString(): string }).toString(),
                name: w.name,
                role: 'Worker',
                rating: w.rating,
                totalRatings: w.totalRatings,
                profilePictureUrl: w.profilePictureUrl
            }))
        };
    }
}
