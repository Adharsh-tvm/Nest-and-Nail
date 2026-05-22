import { S3Service } from "../../../infrastructure/adapters/S3service";
import { IGetS3UploadUrlUseCase } from "../../interfaces/media/IGetS3UploadUrlUseCase";

export class GetS3UploadUrlUseCase implements IGetS3UploadUrlUseCase {
  constructor(private s3Service: S3Service) { }

  async execute(fileName: string, contentType: string) {
    const key = `uploads/${String(Date.now())}-${fileName}`;

    const uploadUrl = await this.s3Service.generatePresignedUploadUrl(
      key,
      contentType
    );

    const signedUrl = await this.s3Service.getPresignedDownloadUrl(key);

    return {
      uploadUrl,
      fileUrl: key, // Store this key in DB
      signedUrl,    // Use this for immediate preview
      key,
    };
  }
}
