import { ConcernResponseDTO } from "../../dtos/concern/ConcernDTO";

export interface IGetAllConcernsUseCase {
  execute(query: {
    status?: string;
    search?: string; 
    page?: number;
    limit?: number;
  }): Promise<{
    concerns: ConcernResponseDTO[];
    total: number;
    totalPages: number;
  }>;
}