export interface IOtpRepository {
    save(email: string, hash: string): Promise<void>;
    findByEmail(email: string): Promise<any>;
    delete(email: string): Promise<void>;
}
