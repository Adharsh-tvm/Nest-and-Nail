
export interface IBaseRepository <T > {
    findByEmail(email: string): Promise<T | null>;
    findById(id: string): Promise<T | null>;
    create(user: T): Promise<T>;
}