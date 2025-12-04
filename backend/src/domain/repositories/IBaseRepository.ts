export interface IBaseRepository<T> {
    findByEmail(email: string): Promise<T | null>;
    findById(id: string): Promise<T | null>;
    create(user: T): Promise<T>;
    findAll(): Promise<T[]>;
    update(email: string, updateData: Partial<T>): Promise<T | null>;
    updateById(userId: string, updateData: Partial<T>): Promise<T | null>;
    delete(email: string): Promise<boolean>;
    deleteByUserId(userId: string): Promise<boolean>; 
}