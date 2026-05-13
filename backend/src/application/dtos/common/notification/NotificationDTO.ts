export interface SendNotificationDTO {
    userId: string;
    title: string;
    message: string;
    type: string;

    data?: Record<string, unknown>;
}