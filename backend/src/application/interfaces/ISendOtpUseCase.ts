export interface ISendOtpUseCase {
  execute(email: string): Promise<{ message: string }>;
}
