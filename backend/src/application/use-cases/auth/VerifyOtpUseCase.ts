import { IOtpService } from "../../services/IOtpService";
import { ILogger } from "../../interfaces/ILogger";
import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";

export class VerifyOtpUseCase {
    constructor(
        private readonly _otpService: IOtpService,
        private readonly _otpRepo: IOtpRepository,
        private readonly _logger?: ILogger
    ) { }

    async execute(email: string, otp: string): Promise<boolean> {
        const record = await this._otpRepo.findByEmail(email);

        if (!record || !record.expiresAt || record.expiresAt < new Date()) {
            this._logger?.warn(`OTP expired or missing for ${email}`);
            return false;
        }

        if (!record.otp) {
            return false;
        }

        const isValid = await this._otpService.compareOtp(otp, record.otp);
        if (!isValid) {
            this._logger?.warn(`Invalid OTP attempt for ${email}`);
            return false;
        }

        await this._otpRepo.delete(email);

        this._logger?.info(`OTP verified successfully for ${email}`);

        return true;
    }
}
