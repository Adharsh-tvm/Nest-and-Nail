import { v4 as uuidV4 } from "uuid";
import { IGenerateServiceRequestId } from "../../application/contracts/IGenerateServiceRequestId";

export class ServiceRequestIdGenerator implements IGenerateServiceRequestId {
    generate(): string {
        const short = uuidV4().split("-")[0].toUpperCase();
        return `SR-${short}`;
    }
}