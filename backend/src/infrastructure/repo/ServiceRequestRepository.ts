import { ServiceRequest } from "../../domain/entities/ServiceRequest";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ServiceRequestStatus } from "../../shared/enums/serviceEnums";
import { ServiceRequestModel } from "../database/models/ServiceRequestModel";
import { UserModel } from "../database/models/UserModel";

export class ServiceRequestRepository implements IServiceRequestRepository {

    private toDomain(doc: any): ServiceRequest {
        return {
            id: doc._id.toString(),
            requestId: doc.requestId,

            clientId: doc.clientId,
            title: doc.title,
            description: doc.description,
            category: doc.category,

            location: doc.location,
            budget: doc.budget,
            servicePhotos: doc.servicePhotos ?? [],

            status: doc.status,
            reservedBy: doc.reservedBy,
            reservationExpiresAt: doc.reservationExpiresAt,

            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,

            client: doc.client ? {
                name: doc.client.name,
                email: doc.client.email,
                phone: doc.client.phone,
                profilePictureUrl: doc.client.profilePictureUrl
            } : undefined
        };
    }

    async create(
        data: Omit<ServiceRequest, "id" | "createdAt" | "updatedAt">
    ): Promise<ServiceRequest> {
        const doc = await ServiceRequestModel.create({
            ...data,
            client: data.client
        });
        return this.toDomain(doc);
    }

    async findOpenNearby(
        coordinates: [number, number],
        workerId: string,
        radiusMeters?: number
    ): Promise<ServiceRequest[]> {

        const now = new Date();
        const maxDistance = radiusMeters ?? 10000;

        const results = await ServiceRequestModel.find({
            $and: [
                { clientId: { $ne: workerId } },
                {
                    $or: [
                        { status: ServiceRequestStatus.OPEN },
                        {
                            status: ServiceRequestStatus.RESERVED,
                            reservationExpiresAt: { $lt: now }
                        }
                    ]
                },
                {
                    location: {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates
                            },
                            $maxDistance: maxDistance
                        }
                    }
                }
            ]
        }).lean();

        // Extract client IDs
        const clientIds = [...new Set(results.map(r => r.clientId))];

        // Fetch user details
        const users = await UserModel.find({ userId: { $in: clientIds } })
            .select("userId name email phone profilePictureUrl")
            .lean();

        // Create a map for quick lookup
        const userMap = new Map(users.map(u => [u.userId, u]));

        return results.map(doc => {
            const domainEntity = this.toDomain(doc);
            const user = userMap.get(doc.clientId);

            if (user) {
                domainEntity.client = {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    profilePictureUrl: user.profilePictureUrl
                };
            }

            return domainEntity;
        });
    }


    async findByRequestId(requestId: string): Promise<ServiceRequest | null> {
        const result = await ServiceRequestModel.findOne({ requestId }).lean();

        if (!result) return null;

        const domainEntity = this.toDomain(result);

        // Fallback for old records where client details are not persisted
        if (!domainEntity.client) {
            const user = await UserModel.findOne({ userId: result.clientId })
                .select("name email phone profilePictureUrl")
                .lean();

            if (user) {
                domainEntity.client = {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    profilePictureUrl: user.profilePictureUrl
                };
            }
        }

        return domainEntity;
    }

    async reserveByRequestId(requestId: string, workerId: string, expiresAt: Date): Promise<boolean> {

        const now = new Date();
        const updated = await ServiceRequestModel.findOneAndUpdate(
            {
                requestId,
                $or: [
                    { status: ServiceRequestStatus.OPEN },
                    {
                        status: ServiceRequestStatus.RESERVED,
                        reservationExpiresAt: { $lt: now }
                    }
                ]
            },
            {
                $set: {
                    status: ServiceRequestStatus.RESERVED,
                    reservedBy: workerId,
                    reservationExpiresAt: expiresAt
                }
            },
            { new: true }
        );
        return !!updated;
    }

    async releaseReservationByRequestId(requestId: string): Promise<void> {
        await ServiceRequestModel.updateOne(
            {
                requestId,
                status: ServiceRequestStatus.RESERVED
            },
            {
                $set: {
                    status: ServiceRequestStatus.OPEN
                },
                $unset: {
                    reservedBy: "",
                    reservationExpiresAt: ""
                }
            }
        )
    }

    async findByClientId(clientId: string): Promise<ServiceRequest[]> {
        const docs = await ServiceRequestModel.find({ clientId })
            .sort({ createdAt: -1 })
            .lean();

        return docs.map(this.toDomain);
    }

    async findAll(): Promise<ServiceRequest[]> {
        const docs = await ServiceRequestModel.find()
            .sort({ createdAt: -1 })
            .lean();

        return docs.map(doc => this.toDomain(doc));
    }

    async delete(requestId: string): Promise<boolean> {
        const result = await ServiceRequestModel.deleteOne({ requestId });
        return result.deletedCount === 1;
    }

}