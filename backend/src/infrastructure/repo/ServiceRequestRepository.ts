import mongoose from "mongoose";
import { ServiceRequest } from "../../domain/entities/ServiceRequest";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ServiceRequestStatus } from "../../shared/enums/serviceEnums";
import { ServiceRequestModel } from "../database/models/ServiceRequestModel";

export class ServiceRequestRespository implements IServiceRequestRepository {

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

    async create(data: Partial<ServiceRequest>): Promise<ServiceRequest> {
        const doc = await ServiceRequestModel.create(data);
        return this.toDomain(doc);
    }

    async findOpenNearby(coordinates: [number, number], radiusMeters?: number): Promise<ServiceRequest[]> {
        const results = await ServiceRequestModel.find({
            status: ServiceRequestStatus.OPEN,
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates
                    },
                    $maxDistance: radiusMeters
                }
            }
        }).lean();

        return results.map(doc => this.toDomain(doc));
    }

    async findByRequestId(requestId: string): Promise<ServiceRequest | null> {
        const result = await ServiceRequestModel.findOne({ requestId }).lean();

        return result ? this.toDomain(result) : null;
    }

    async reserveByRequestId(requestId: string, workerId: string, expiresAt: Date): Promise<boolean> {
        const updated = await ServiceRequestModel.findOneAndUpdate(
            {
                requestId,
                status: ServiceRequestStatus.OPEN
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
}