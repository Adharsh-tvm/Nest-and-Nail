import { ServiceRequest } from "../../domain/entities/ServiceRequest";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ServiceRequestStatus } from "../../shared/enums/serviceEnums";
import { ServiceRequestModel } from "../database/models/ServiceRequestModel";

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
            updatedAt: doc.updatedAt
        };
    }

    async create(
        data: Omit<ServiceRequest, "id" | "createdAt" | "updatedAt">
    ): Promise<ServiceRequest> {
        const doc = await ServiceRequestModel.create(data);
        return this.toDomain(doc);
    }

    async findOpenNearby(coordinates: [number, number], radiusMeters?: number): Promise<ServiceRequest[]> {

        const now = new Date();
        const maxDistance = radiusMeters ?? 10000;
        const results = await ServiceRequestModel.find({
            $and: [
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

        return results.map(doc => this.toDomain(doc));
    }

    async findByRequestId(requestId: string): Promise<ServiceRequest | null> {
        const result = await ServiceRequestModel.findOne({ requestId }).lean();

        return result ? this.toDomain(result) : null;
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

}