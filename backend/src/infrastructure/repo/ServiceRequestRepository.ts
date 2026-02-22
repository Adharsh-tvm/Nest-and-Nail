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
            serviceDate: doc.serviceDate,
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

    async findByRequestId(requestId: string): Promise<ServiceRequest | null> {
        const result = await ServiceRequestModel.findOne({ requestId }).lean();

        if (!result) return null;

        const domainEntity = this.toDomain(result);

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

    async updateByRequestId(
        requestId: string,
        updateData: Partial<ServiceRequest>
    ): Promise<ServiceRequest | null> {

        const updatedDoc = await ServiceRequestModel.findOneAndUpdate(
            { requestId },
            { $set: updateData },
            { new: true }
        ).lean();

        if (!updatedDoc) return null;

        const domainEntity = this.toDomain(updatedDoc);

        if (!domainEntity.client) {
            const user = await UserModel.findOne({ userId: updatedDoc.clientId })
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

    async reserveRequest(
        requestId: string,
        workerId: string,
        expiresAt: Date
    ): Promise<boolean> {

        const updated = await ServiceRequestModel.findOneAndUpdate(
            {
                requestId,
                status: ServiceRequestStatus.OPEN,
                reservedBy: null
            },
            {
                reservedBy: workerId,
                reservationExpiresAt: expiresAt,
                status: ServiceRequestStatus.RESERVED
            },
            { new: true }
        );

        return !!updated;
    }

    async addTriedWorker(requestId: string, workerId: string): Promise<void> {

        await ServiceRequestModel.updateOne(
            { requestId },
            { $addToSet: { triedWorkers: workerId } }
        );
    }

    async markNoWorkersAvailable(requestId: string): Promise<void> {

        await ServiceRequestModel.updateOne(
            { requestId },
            { status: ServiceRequestStatus.NO_WORKERS_AVAILABLE }
        );
    }

    async delete(requestId: string): Promise<boolean> {
        const result = await ServiceRequestModel.deleteOne({ requestId });
        return result.deletedCount === 1;
    }

}