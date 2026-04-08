import { IUpdateVerificationStatusUseCase } from "../../interfaces/admin/IUpdateVerificationStatusUseCase";
import { VerificationStatus } from "../../../shared/enums/authEnums";
import { UserMapper } from "../../mappers/UserMapper";
import { ILogger } from "../../../infrastructure/logger/ILogger";
import { Role } from "../../../shared/enums/authEnums";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { IEmailService } from "../../contracts/IEmailService";

export class UpdateVerificationStatusUseCase implements IUpdateVerificationStatusUseCase {
    constructor(
        private readonly _repoFactory: IUserRepositoryFactory,
        private readonly _emailService: IEmailService,
        private readonly _logger: ILogger
    ) { }

    async execute(userId: string, status: VerificationStatus, reason: string) {
        // this._logger.info(`Updating verification status for user ${userId} → ${status}`);

        const clientRepo = this._repoFactory.getRepository(Role.CLIENT);
        const workerRepo = this._repoFactory.getRepository(Role.WORKER);

        let user = await clientRepo.findById(userId);
        if (!user) user = await workerRepo.findById(userId);

        if (!user) throw new Error("User not found");

        const repo = user.role === Role.WORKER ? workerRepo : clientRepo;

        const updated = await repo.updateById(userId, { isVerified: status });

        if (!updated) throw new Error("Failed to update verification status");

        if (status === VerificationStatus.REJECTED) {
            await this._emailService.sendEmail(
                updated.email,
                "Verification Rejected – Action Required",
                `
          <div style="font-family: Arial, sans-serif">
            <h2>Hello ${updated.name},</h2>
            <p>Your verification request has been <b>rejected</b>.</p>
            <p><strong>Reason:</strong></p>
            <blockquote style="background:#f9f9f9;padding:10px;border-left:4px solid #e11d48">
              ${reason}
            </blockquote>
            <p>Please update your documents and submit again.</p>
            <br/>
            <p>— Nest & Nail Team</p>
          </div>
        `
            );
            this._logger.info(`Rejection email sent to ${updated.email}`);
        }

        return UserMapper.toResponseDTO(updated);
    }
}
