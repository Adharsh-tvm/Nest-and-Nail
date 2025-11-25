import { v4 as uuidv4 } from "uuid";
import { IGenerateUserID } from "../../application/services/IGenerateUserID";

export class UUIDGenerator implements IGenerateUserID {
    async create(): Promise<string> {
        return uuidv4();
    }
}
