export interface IGetMessagesUseCase {
    execute(chatId: string): Promise<any[]>;
}