import { CloudinarySignedUploadService } from "../../../infrastructure/adapters/CloudinarySignedUploadService";
import { IGetCloudinaryUploadSignatureUseCase } from "../../interfaces/media/IGetCloudinaryUploadSignatureUseCase";

export class GetCloudinaryUploadSignatureUseCase implements IGetCloudinaryUploadSignatureUseCase {
    execute() {
        return CloudinarySignedUploadService.generateSignature(
            "service-requests"
        );
    }
}
