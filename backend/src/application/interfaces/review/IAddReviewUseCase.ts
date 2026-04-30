export interface IAddReviewUseCase {
    execute(
        serviceId: string,
        clientId: string,
        rating: number,
        review?: string
    ): Promise<void>;
}