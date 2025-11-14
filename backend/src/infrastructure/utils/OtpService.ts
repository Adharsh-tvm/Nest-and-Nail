import bcrypt from "bcryptjs";
import { IOtpService } from "../../application/services/IOtpService"; 


export class OtpService implements IOtpService {
    generateOtp(): string {
        return (Math.floor(100000 + Math.random() * 900000)).toString();
    }

    async hashOtp(otp: string): Promise<string> {
        return bcrypt.hash(otp, 10);
    }

    compareOtp(otp: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(otp, hashed); 
    }
}