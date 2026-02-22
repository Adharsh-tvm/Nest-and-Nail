import { Role, VerificationStatus } from "../../shared/enums/authEnums";

export interface ListUsersQuery {
  role?: Role;
  isBlocked?: boolean;
  isVerified?: VerificationStatus;
  search?: string;

  sortBy?: "createdAt" | "name" | "email";
  sortOrder?: "asc" | "desc";

  page?: number;
  limit?: number;
}
