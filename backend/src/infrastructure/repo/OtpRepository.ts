import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { OtpModel } from "../database/models/OtpModel";

export class OtpRepository implements IOtpRepository {
    async save(email: string, hash: string): Promise<void> {
        await OtpModel.findOneAndUpdate(
            { email },
            {
                otp: hash,
                expiresAt: new Date(Date.now() + 2 * 60 * 1000)
            },
            { upsert: true }
        );
    }

    async findByEmail(email: string) {
        return OtpModel.findOne({ email });
    }

    async delete(email: string) {
        await OtpModel.deleteOne({ email });
    }
}