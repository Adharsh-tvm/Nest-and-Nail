import { Service } from "../../domain/entities/Service";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import { ServiceStatus } from "../../shared/enums/serviceEnums";
import { ServiceModel } from "../database/models/ServiceModel";
import { UpdateVideoCallDTO } from "../../application/dtos/videoCallDTO";
import { FilterQuery } from "mongoose";

export class ServiceRepository implements IServiceRepository {

    async create(service: Service): Promise<Service> {
        const created = await ServiceModel.create(service);

        const obj = created.toObject();

        const { _id, __v, ...clean } = obj;

        return clean as Service;
    }

    async findById(serviceId: string): Promise<Service | null> {
        const doc = await ServiceModel.findOne({ serviceId }).lean();
        return doc as Service | null;
    }

    async updateStatus(
        serviceId: string,
        update: Partial<Service>
    ): Promise<Service | null> {

        const updated = await ServiceModel.findOneAndUpdate(
            { serviceId },
            update,
            { new: true }
        ).lean();

        return updated as Service | null;
    }

    async findByClientId(clientId: string): Promise<Service[]> {
        const docs = await ServiceModel.find({ clientId })
            .sort({ createdAt: -1 })
            .lean();

        return docs as Service[];
    }

    async findByWorkerId(workerId: string): Promise<Service[]> {
        const services = await ServiceModel.find({ workerId })
            .sort({ createdAt: -1 })
            .lean();;

        return services as Service[];
    }

    async findActiveByWorkerId(workerId: string): Promise<Service | null> {
        const service = await ServiceModel.findOne({
            workerId,
            status: {
                $in: [
                    ServiceStatus.IN_PROGRESS
                ]
            }
        });
        return service as Service;
    }

    async findAllWithDetails(): Promise<unknown[]> {
        return await ServiceModel.aggregate([
            {
                $lookup: {
                    from: "users", // client collection
                    localField: "clientId",
                    foreignField: "userId",
                    as: "client"
                }
            },
            { $unwind: "$client" },

            {
                $lookup: {
                    from: "users", // worker collection
                    localField: "workerId",
                    foreignField: "userId",
                    as: "worker"
                }
            },
            { $unwind: "$worker" },

            {
                $project: {
                    serviceId: 1,
                    clientId: 1,
                    workerId: 1,
                    category: 1,
                    status: 1,
                    paymentStatus: 1,
                    scheduledDate: 1,
                    selectedSlots: 1,
                    location: 1,
                    createdAt: 1,

                    client: {
                        userId: "$client.userId",
                        name: "$client.name",
                        email: "$client.email",
                        profilePictureUrl: "$client.profilePictureUrl",
                        profileImageUrl: "$client.profileImageUrl"
                    },

                    worker: {
                        userId: "$worker.userId",
                        name: "$worker.name",
                        rating: "$worker.rating",
                        profilePictureUrl: "$worker.profilePictureUrl",
                        profileImageUrl: "$worker.profileImageUrl"
                    }
                }
            },

            { $sort: { createdAt: -1 } }
        ]);
    }

    async findDetailedByServiceId(serviceId: string): Promise<unknown | null> {

        const result = await ServiceModel.aggregate([
            {
                $match: { serviceId }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "clientId",
                    foreignField: "userId",
                    as: "client"
                }
            },
            { $unwind: "$client" },

            {
                $lookup: {
                    from: "users",
                    localField: "workerId",
                    foreignField: "userId",
                    as: "worker"
                }
            },
            { $unwind: "$worker" },

            {
                $project: {
                    serviceId: 1,
                    clientId: 1,
                    workerId: 1,
                    category: 1,
                    status: 1,
                    paymentStatus: 1,

                    scheduledDate: 1,
                    selectedSlots: 1,
                    location: 1,
                    title: 1,
                    description: 1,
                    numberOfDays: 1,

                    createdAt: 1,
                    updatedAt: 1,
                    videoCall: 1,

                    client: {
                        userId: "$client.userId",
                        name: "$client.name",
                        email: "$client.email",
                        phone: "$client.phone",
                        address: "$client.address",
                        profilePictureUrl: "$client.profilePictureUrl",
                        profileImageUrl: "$client.profileImageUrl"
                    },

                    worker: {
                        userId: "$worker.userId",
                        name: "$worker.name",
                        rating: "$worker.rating",
                        skills: "$worker.skills",
                        profilePictureUrl: "$worker.profilePictureUrl",
                        profileImageUrl: "$worker.profileImageUrl"
                    }
                }
            }
        ]);

        return result[0] || null;
    }

    async getMeetingsByClient(clientId: string): Promise<Service[]> {
        const docs = await ServiceModel.find({
            clientId,
            category: "VIDEO_CALL"
        })
            .sort({ createdAt: -1 })
            .lean();

        return docs as Service[];
    }

    async getMeetingsByWorker(workerId: string): Promise<Service[]> {
        const docs = await ServiceModel.find({
            workerId,
            category: "VIDEO_CALL"
        })
            .sort({ createdAt: -1 })
            .lean();

        return docs as Service[];
    }

    async updateVideoCall(serviceId: string, videoCall: UpdateVideoCallDTO): Promise<unknown> {
        return await ServiceModel.findOneAndUpdate(
            { serviceId },
            { $set: { videoCall } },
            { new: true }
        );
    }

    async updatePaymentStatus(
        serviceId: string,
        paymentStatus: string
    ): Promise<void> {
        await ServiceModel.updateOne(
            { serviceId },
            { $set: { paymentStatus } }
        );
    }

    async getAllMeetingsForAdmin(query: {
        page: number;
        limit: number;
        search?: string;
        status?: string;
    }): Promise<unknown> {
        const { page, limit, search, status } = query;

        const filter: FilterQuery<typeof ServiceModel> = {
            meeting: { $exists: true }
        };

        if (status) {
            filter["meeting.status"] = status;
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (page - 1) * limit;

        const services = await ServiceModel
            .find(filter)
            .populate("clientId workerId")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ServiceModel.countDocuments(filter);

        return {
            data: services,
            total,
            page,
            limit
        };
    }

    async getMeetingByIdForAdmin(serviceId: string): Promise<unknown> {
        return await ServiceModel
            .findById(serviceId)
            .populate("clientId workerId");
    }

    async cancelService(
        serviceId: string,
        data: { cancelledAt: Date; reason?: string }
    ): Promise<void> {
        await ServiceModel.updateOne(
            { serviceId },
            {
                $set: {
                    status: ServiceStatus.CANCELLED,
                    cancelledAt: data.cancelledAt,
                    cancellationReason: data.reason,
                },
            }
        );
    }
}