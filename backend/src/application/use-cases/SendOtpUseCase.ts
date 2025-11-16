import { ISendOtpUseCase } from "../interfaces/ISendOtpUseCase";
import { IEmailService } from "../services/IEmailService";
import { IOtpService } from "../services/IOtpService";
import { OtpRepository } from "../../infrastructure/repo/OtpRepository";
import { ILogger } from "../interfaces/ILogger";

export class SendOtpUseCase implements ISendOtpUseCase {
    constructor(
        private emailService: IEmailService,
        private otpService: IOtpService,
        private otpRepo: OtpRepository,
        private logger?: ILogger  
    ) { }

    async execute(email: string) {
        const otp = this.otpService.generateOtp();
        const hashed = await this.otpService.hashOtp(otp);

        await this.otpRepo.save(email, hashed);

        await this.emailService.sendEmail(
            email,
            "Your OTP Code",
            `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`
        );

        this.logger?.info(`OTP sent to ${email}`);

        return { message: "OTP sent" };
    }
}
