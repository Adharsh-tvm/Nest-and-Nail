import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../../config/env";
import fs from "fs";

export class S3Service {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async generatePresignedUploadUrl(
    key: string,
    contentType: string
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(this.s3, command, {
      expiresIn: 60 * 5, // 5 minutes
    });
  }

  getFileUrl(key: string): string {
    return `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
  }

  async uploadFile(filePath: string, key: string, contentType: string): Promise<string> {
    const fileContent = fs.readFileSync(filePath);
    const command = new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
    });

    await this.s3.send(command);

    // Clean up local file
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error("Error deleting local file:", error);
    }

    return `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
  }

  async getPresignedDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(this.s3, command, {
      expiresIn: 3600, // 1 hour
    });
  }
}
