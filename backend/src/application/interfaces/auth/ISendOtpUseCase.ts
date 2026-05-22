export interface ISendOtpUseCase {
    execute(
        email: string,
        role: string
    ): Promise<{ message: string }>;
}