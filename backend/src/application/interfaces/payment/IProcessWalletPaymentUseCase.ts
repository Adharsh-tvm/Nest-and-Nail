export interface IProcessWalletPaymentUseCase {
  execute(
    serviceId: string,
    clientId: string
  ): Promise<{
    success: boolean;
    message: string;
    walletBalance: number;
    serviceId: string;
  }>;
}