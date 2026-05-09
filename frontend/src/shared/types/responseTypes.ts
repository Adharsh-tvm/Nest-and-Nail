export type SuccessResponse<T = unknown> = {
    success: true,
    message: string,
    payload: T,
}

export type FailedResponse = {
    success: false,
    message: string,
    error: string | null
}

export type ApiResponse<T> = SuccessResponse<T> | FailedResponse;