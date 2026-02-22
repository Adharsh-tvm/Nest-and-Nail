
export interface IDeleteServiceRequestUseCase {
    execute(requestId: string, clientId: string): Promise<boolean>;
}
