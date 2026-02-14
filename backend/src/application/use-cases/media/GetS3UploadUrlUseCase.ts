import { S3Service } from "../../../infrastructure/adapters/S3service";
import { IGetS3UploadUrlUseCase } from "../../interfaces/media/IGetS3UploadUrlUseCase";

export class GetS3UploadUrlUseCase implements IGetS3UploadUrlUseCase {
  constructor(private s3Service: S3Service) {}

  async execute(fileName: string, contentType: string) {
    const key = `uploads/${Date.now()}-${fileName}`;

    const uploadUrl = await this.s3Service.generatePresignedUploadUrl(
      key,
      contentType
    );

    const fileUrl = this.s3Service.getFileUrl(key);

    return {
      uploadUrl,
      fileUrl,
    };
  }
}
