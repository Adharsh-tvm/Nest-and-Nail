export interface IUploadWorkerDocumentUseCase {
    execute(workerId: string, filePath: string): Promise<{ url: string }>;
}
