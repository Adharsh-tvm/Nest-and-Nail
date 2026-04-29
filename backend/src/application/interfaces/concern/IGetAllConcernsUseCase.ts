import { Concern } from "../../../domain/entities/Concern";

export interface IGetAllConcernsUseCase {
  execute(query: {
    status?: string;
    search?: string; 
    page?: number;
    limit?: number;
  }): Promise<{
    concerns: Concern[];
    total: number;
    totalPages: number;
  }>;
}