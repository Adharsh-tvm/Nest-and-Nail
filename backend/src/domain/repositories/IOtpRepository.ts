export interface IOtp {
    email: string;
    otp: string;
    expiresAt: Date;
}

export interface IOtpRepository {
    save(email: string, hash: string): Promise<void>;
    findByEmail(email: string): Promise<IOtp | null>;
    delete(email: string): Promise<void>;
}
