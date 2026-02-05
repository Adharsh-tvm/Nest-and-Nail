export interface IGetCloudinaryUploadSignatureUseCase {
  execute(): {
    cloudName: string;
    apiKey: string;
    timestamp: number;
    signature: string;
    folder: string;
  };
}
