
export interface IValidateUserUseCase {
    execute(userId: string): Promise<{
        success: boolean;
        payload?: {
            id: string;
            role: string;
            isBlocked: boolean;
        };
        message?: string;
    }>;
}
