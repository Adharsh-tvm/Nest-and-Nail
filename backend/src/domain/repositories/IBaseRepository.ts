export interface IBaseRepository<T> {
    findByEmail(email: string): Promise<T | null>;
    findById(id: string): Promise<T | null>;
    create(user: T): Promise<T>;
    findAll(): Promise<T[]>;
    update(email: string, updateData: Partial<T>): Promise<T | null>;
    updateById(userId: string, updateData: Partial<T>): Promise<T | null>;
    delete(email: string): Promise<boolean>;
    deleteByUserId(userId: string): Promise<boolean>;
    findWithQuery(
        filter: {
            isBlocked?: boolean;
            isVerified?: string | boolean;
            search?: string;
            role?: string | Record<string, unknown>;
        },
        options: {
            sortBy: string;
            sortOrder: "asc" | "desc";
            page: number;
            limit: number;
        }
    ): Promise<T[]>;
    findWithPagination(
        filter: {
            isBlocked?: boolean;
            isVerified?: string | boolean;
            search?: string;
            role?: string | Record<string, unknown>;
        },
        options: {
            sortBy: string;
            sortOrder: "asc" | "desc";
            page: number;
            limit: number;
        }
    ): Promise<{ users: T[]; total: number; totalPages: number }>;
}
