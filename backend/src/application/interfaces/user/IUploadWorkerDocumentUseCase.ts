export interface IUploadWorkerDocumentUseCase {
    execute(workerId: string, filePath: string, mimetype: string): Promise<{ url: string }>;
}
