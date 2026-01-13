import { ISendOtpUseCase } from "../../interfaces/ISendOtpUseCase";
import { IEmailService } from "../../services/IEmailService";
import { IOtpService } from "../../services/IOtpService";
import { OtpRepository } from "../../../infrastructure/repo/OtpRepository";
import { ILogger } from "../../interfaces/ILogger";
import { Role } from "../../../shared/enums/authEnums";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";

export class SendOtpUseCase implements ISendOtpUseCase {
    constructor(
        private readonly _emailService: IEmailService,
        private readonly _otpService: IOtpService,
        private readonly _otpRepo: OtpRepository,
        private readonly _userRepositoryFactory: IUserRepositoryFactory,
        private readonly _logger?: ILogger
    ) { }


    async execute(email: string, role: "client" | "worker") {

        // Convert string → Role enum
        const userRole = role.toLowerCase() as Role;

        // Validate the role
        if (!Object.values(Role).includes(userRole)) {
            throw new Error("Invalid role provided");
        }

        // Check if user exists
        const repository = this._userRepositoryFactory.getRepository(userRole);

        const existing = await repository.findByEmail(email);

        if (existing) {
            this._logger?.warn(`OTP request blocked. User already exists: ${email}`);
            throw new Error("User already exists");
        }

        // Generate OTP
        const otp = this._otpService.generateOtp();
        const hashed = await this._otpService.hashOtp(otp);

        // Save OTP
        await this._otpRepo.save(email, hashed);

        // Send Email
        await this._emailService.sendEmail(
            email,
            "Your OTP Code",
            `<p>Your OTP is <b>${otp}</b>. It is valid for 1 minute.</p>`
        );

        this._logger?.info(`OTP sent to ${email}`);
        return { message: "OTP sent" };
    }


}
