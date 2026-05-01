export interface ISendNotificationUseCase {
    execute(data: {
        userId: string;
        title: string;
        message: string;
        type: string;
        data?: any;
    }): Promise<void>;
}