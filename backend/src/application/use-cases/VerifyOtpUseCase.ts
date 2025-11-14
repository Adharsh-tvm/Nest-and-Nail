import { OtpRepository } from "../../infrastructure/repo/OtpRepository";
import { IOtpService } from "../services/IOtpService";
import { ILogger } from "../interfaces/ILogger";

export class VerifyOtpUseCase {
    constructor(
        private otpService: IOtpService,
        private otpRepo: OtpRepository,
        private logger?: ILogger   // OPTIONAL
    ) { }

    async execute(email: string, otp: string): Promise<boolean> {
        const record = await this.otpRepo.findByEmail(email);

        if (!record || !record.expiresAt || record.expiresAt < new Date()) {
            this.logger?.warn(`OTP expired or missing for ${email}`);
            return false;
        }

        if (!record.otp) {
            return false;
        }

        const isValid = await this.otpService.compareOtp(otp, record.otp);
        if (!isValid) {
            this.logger?.warn(`Invalid OTP attempt for ${email}`);
            return false;
        }

        await this.otpRepo.delete(email);

        this.logger?.info(`OTP verified successfully for ${email}`);

        return true;
    }
}
