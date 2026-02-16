export interface IGetS3UploadUrlUseCase {
  execute(fileName: string, contentType: string): Promise<{
    uploadUrl: string;
    fileUrl: string;
    signedUrl: string;
  }>;
}
