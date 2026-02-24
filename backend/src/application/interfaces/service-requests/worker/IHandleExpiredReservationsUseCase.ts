export interface IHandleExpiredReservationsUseCase {
    execute(): Promise<void>;
}