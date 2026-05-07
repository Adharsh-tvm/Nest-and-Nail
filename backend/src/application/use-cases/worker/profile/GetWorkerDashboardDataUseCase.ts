import { IGetWorkerDashboardDataUseCase } from "../../../interfaces/worker/profile/IGetWorkerDashboardDataUseCase";
import { ServiceModel } from "../../../../infrastructure/database/models/ServiceModel";
import { TransactionModel } from "../../../../infrastructure/database/models/TransactionModel";
import { WorkerModel } from "../../../../infrastructure/database/models/WorkerModel";
import { ReviewModel } from "../../../../infrastructure/database/models/ReviewModel";
import { ClientModel } from "../../../../infrastructure/database/models/ClientModel";
import { WalletModel } from "../../../../infrastructure/database/models/WalletModel";
import { ServiceStatus } from "../../../../shared/enums/serviceEnums";
import { transactionType, transactionStatus, transactionSource } from "../../../../shared/enums/transactionEnums";

export class GetWorkerDashboardDataUseCase implements IGetWorkerDashboardDataUseCase {
    async execute(workerId: string, months: number = 6): Promise<any> {
        // Fetch worker stats
        const worker = await WorkerModel.findOne({ userId: workerId }).lean();
        if (!worker) {
            throw new Error("Worker not found");
        }

        const dateFilter = new Date();
        dateFilter.setMonth(dateFilter.getMonth() - months);
        dateFilter.setHours(0, 0, 0, 0);

        const totalJobs = await ServiceModel.countDocuments({ workerId, status: ServiceStatus.COMPLETED, createdAt: { $gte: dateFilter } });
        const ongoingJobs = await ServiceModel.countDocuments({ workerId, status: ServiceStatus.IN_PROGRESS, createdAt: { $gte: dateFilter } });
        const pendingJobs = await ServiceModel.countDocuments({ workerId, status: ServiceStatus.PENDING, createdAt: { $gte: dateFilter } });
        const cancelledJobs = await ServiceModel.countDocuments({ 
            workerId, 
            status: { $in: [ServiceStatus.CANCELLED, ServiceStatus.CANCELLED_BY_CLIENT, ServiceStatus.CANCELLED_BY_WORKER] },
            createdAt: { $gte: dateFilter }
        });

        // Total Earnings (Filtered by date)
        const earningTransactions = await TransactionModel.find({
            userId: workerId,
            type: transactionType.CREDIT,
            status: transactionStatus.SUCCESS,
            createdAt: { $gte: dateFilter }
        });
        const totalEarnings = earningTransactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);

        // Wallet Balance
        const wallet = await WalletModel.findOne({ userId: workerId }).lean();
        const walletBalance = wallet ? wallet.balance : 0;

        // Earnings by month (last `months` months)
        const monthlyData = await TransactionModel.aggregate([
            { 
                $match: { 
                    userId: workerId, 
                    type: transactionType.CREDIT,
                    status: transactionStatus.SUCCESS,
                    createdAt: { $gte: dateFilter }
                } 
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    earnings: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedMonthlyData = [];
        for (let i = months - 1; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const year = d.getFullYear();
            const month = d.getMonth() + 1;
            
            const found = monthlyData.find(m => m._id.year === year && m._id.month === month);
            formattedMonthlyData.push({
                name: monthNames[month - 1],
                earnings: found ? found.earnings : 0,
            });
        }

        // Jobs by Status (Pie Chart)
        const jobsByStatus = [
            { name: 'Completed', value: totalJobs, color: '#10b981' },
            { name: 'In Progress', value: ongoingJobs, color: '#f59e0b' },
            { name: 'Pending', value: pendingJobs, color: '#3b82f6' },
            { name: 'Cancelled', value: cancelledJobs, color: '#ef4444' },
        ].filter(s => s.value > 0);

        // Recent Reviews
        const recentReviews = await ReviewModel.find({ workerId })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // Populate client names for reviews
        const reviewsWithClients = await Promise.all(
            recentReviews.map(async (review) => {
                const client = await ClientModel.findOne({ userId: review.clientId }).select('name profilePictureUrl').lean();
                return {
                    id: review._id,
                    rating: review.rating,
                    review: review.review,
                    createdAt: review.createdAt,
                    clientName: client ? client.name : 'Unknown Client',
                    clientImage: client ? client.profilePictureUrl : ''
                };
            })
        );

        // Upcoming Service
        const upcomingService = await ServiceModel.findOne({
            workerId,
            status: { $in: [ServiceStatus.PENDING, ServiceStatus.IN_PROGRESS] },
            scheduledDate: { $gte: new Date() }
        })
        .sort({ scheduledDate: 1 })
        .lean();

        let formattedUpcomingService = null;
        if (upcomingService) {
            const client = await ClientModel.findOne({ userId: upcomingService.clientId }).select('name profilePictureUrl').lean();
            formattedUpcomingService = {
                title: upcomingService.title,
                date: upcomingService.scheduledDate,
                location: upcomingService.address?.city || "Remote",
                clientName: client?.name || "Unknown",
                clientImage: client?.profilePictureUrl || "",
                status: upcomingService.status
            };
        }

        // Schedules for Calendar
        const schedules = await ServiceModel.find({
            workerId,
            status: { $in: [ServiceStatus.PENDING, ServiceStatus.IN_PROGRESS] }
        }).select('title scheduledDate status').lean();

        return {
            stats: {
                totalJobs,
                ongoingJobs,
                pendingJobs,
                cancelledJobs,
                totalEarnings,
                walletBalance,
                rating: worker.rating || 0,
                totalRatings: worker.totalRatings || 0
            },
            schedules: schedules.map(s => ({ title: s.title, date: s.scheduledDate, status: s.status })),
            upcomingService: formattedUpcomingService,
            charts: {
                monthlyEarnings: formattedMonthlyData,
                jobsByStatus: jobsByStatus
            },
            recentReviews: reviewsWithClients
        };
    }
}
