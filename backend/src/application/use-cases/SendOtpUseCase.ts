import { ISendOtpUseCase } from "../interfaces/ISendOtpUseCase";
import { IEmailService } from "../services/IEmailService";
import { IOtpService } from "../services/IOtpService";
import { OtpRepository } from "../../infrastructure/repo/OtpRepository";
import { ILogger } from "../interfaces/ILogger";
import { UserRepositoryFactory } from "../../infrastructure/repo/UserRepositoryFactory";
import { Role } from "../../shared/enums/enums";

export class SendOtpUseCase implements ISendOtpUseCase {
    constructor(
        private emailService: IEmailService,
        private otpService: IOtpService,
        private otpRepo: OtpRepository,
        private userRepositoryFactory: UserRepositoryFactory,
        private logger?: ILogger
    ) { }


    async execute(email: string, role: "client" | "worker") {

        // Convert string → Role enum
        const userRole = role.toLowerCase() as Role;

        // Validate the role
        if (!Object.values(Role).includes(userRole)) {
            throw new Error("Invalid role provided");
        }

        // Check if user exists
        const repository = this.userRepositoryFactory.getRepository(userRole);

        const existing = await repository.findByEmail(email);

        if (existing) {
            this.logger?.warn(`OTP request blocked. User already exists: ${email}`);
            throw new Error("User already exists");
        }

        // Generate OTP
        const otp = this.otpService.generateOtp();
        const hashed = await this.otpService.hashOtp(otp);

        // Save OTP
        await this.otpRepo.save(email, hashed);

        // Send Email
        await this.emailService.sendEmail(
            email,
            "Your OTP Code",
            `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`
        );

        this.logger?.info(`OTP sent to ${email}`);
        return { message: "OTP sent" };
    }


}
