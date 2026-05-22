import { Concern } from "../entities/Concern";

export interface IConcernRepository {
    create(data: Concern): Promise<Concern>;
    findByUser(userId: string): Promise<Concern[]>;
    findByService(serviceId: string): Promise<Concern[]>;
    findAll(query: {
        status?: string;
        search?: string;
        page: number;
        limit: number;
    }): Promise<{
        concerns: Concern[];
        total: number;
        totalPages: number;
    }>;
    findById(concernId: string): Promise<Concern | null>;
    update(concernId: string, data: Partial<Concern>): Promise<Concern | null>;
}