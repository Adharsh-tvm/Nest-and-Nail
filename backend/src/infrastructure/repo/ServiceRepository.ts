import { Service } from "../../domain/entities/Service";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
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
}