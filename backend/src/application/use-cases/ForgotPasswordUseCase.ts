import { IEmailService } from "../services/IEmailService";
import { IOtpService } from "../services/IOtpService";
import { ILogger } from "../interfaces/ILogger";
import { Role } from "../../shared/enums/authEnums";
import { IForgotPasswordUseCase } from "../interfaces/IForgotPasswordUseCase";
import { UserNotFoundError } from "../../domain/errors/DomainError";
import { IUserRepositoryFactory } from "../../domain/repositories/IUserRepositoryFactory";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
    constructor(
        private readonly _emailService: IEmailService,
        private readonly _otpService: IOtpService,
        private readonly _otpRepo: IOtpRepository,
        private readonly _userRepoFactory: IUserRepositoryFactory,
        private readonly _logger?: ILogger
    ) { }

    async execute(email: string) {

        const roles = [Role.CLIENT, Role.WORKER, Role.ADMIN];
        let user = null;
        let foundRole: Role | null = null;

        for (const role of roles) {
            const repo = this._userRepoFactory.getRepository(role);
            const u = await repo.findByEmail(email);
            if (u) {
                user = u;
                foundRole = role;
                break;
            }
        }

        if (!user || !foundRole) {
            throw new UserNotFoundError()
        }

        // Generate OTP
        const otp = this._otpService.generateOtp();
        const hashedOtp = await this._otpService.hashOtp(otp);

        await this._otpRepo.save(email, hashedOtp);

        await this._emailService.sendEmail(
            email,
            "Reset Password OTP",
            `<p>Your password reset OTP is <b>${otp}</b>. It is valid for 2 minutes.</p>`
        );

        this._logger?.info(`Password reset OTP sent to ${email}`);

        return { message: "OTP sent for password reset" };
    }
}
