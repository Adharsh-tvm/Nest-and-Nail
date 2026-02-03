export interface IOtpService{
    generateOtp(): string;
    hashOtp(otp: string): Promise<string>;
    compareOtp(otp: string, hashed: string): Promise<boolean>;
}