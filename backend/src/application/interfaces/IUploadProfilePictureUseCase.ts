export interface IUploadProfilePictureUseCase {
    execute(workerId: string, filePath: string): Promise<{ url: string }>;
}
