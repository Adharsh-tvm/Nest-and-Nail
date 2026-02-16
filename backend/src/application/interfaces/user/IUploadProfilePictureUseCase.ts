export interface IUploadProfilePictureUseCase {
    execute(workerId: string, filePath: string, mimetype: string): Promise<{ url: string }>;
}
