
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

export class ResponseHandler {
  static success<T>(
    data: T,
    message: string,
  ): SuccessResponse<T> {
    return {
      success: true,
      message,
      payload: data,
    }
  }

  static error(
    message: string,
    error?: unknown
  ): FailedResponse {
    return {
      success: false,
      message,
      error:
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : undefined,
    }
  }
}
