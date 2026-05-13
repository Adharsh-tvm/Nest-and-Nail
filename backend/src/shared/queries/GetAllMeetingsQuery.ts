import { ServiceStatus } from "../enums/serviceEnums";

export interface GetAllMeetingsQuery {
    search?: string;

    status?: ServiceStatus;

    page?: number;

    limit?: number;

    sortBy?: string;

    sortOrder?: "asc" | "desc";
}