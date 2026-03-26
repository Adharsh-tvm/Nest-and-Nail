import { Service } from "../../domain/entities/Service";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import { ServiceStatus } from "../../shared/enums/serviceEnums";
import { ServiceModel } from "../database/models/ServiceModel";

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
                $in : [
                    ServiceStatus.IN_PROGRESS
                ]
            }
        });
        return service as Service;
    }    
}