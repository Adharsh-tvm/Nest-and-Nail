import { v4 as uuidv4 } from "uuid";
import { IGenerateUserID } from "../../application/contracts/IGenerateUserID";

export class UUIDGenerator implements IGenerateUserID {
    async create(): Promise<string> {
        return uuidv4();
    }
}
