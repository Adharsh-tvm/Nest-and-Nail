export interface IResetPasswordUseCase {
    execute(email: string, newPassword: string): Promise<void>;
}
