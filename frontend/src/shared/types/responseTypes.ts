export type SuccessResponse<T = any> = {
    success: true,
    message: string,
    payload: T,
}

export type FailedResponse = {
    success: false,
    message: string,
    error: any
}

export type ApiResponse<T> = SuccessResponse<T> | FailedResponse;