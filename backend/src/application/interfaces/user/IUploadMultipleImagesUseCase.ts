export interface IUploadMultipleImagesUseCase {
  execute(files: Express.Multer.File[]): Promise<string[]>;
}
