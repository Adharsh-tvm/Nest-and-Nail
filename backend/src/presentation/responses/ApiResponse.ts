import { Response } from "express";
import { HttpStatusCode } from "../../shared/enums/httpCodes";

export class ResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: HttpStatusCode = HttpStatusCode.OK
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      payload: data, 
    });
  }

  static error(
    res: Response,
    message: string,
    statusCode: HttpStatusCode,
    error?: unknown
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      error:
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : undefined,
    });
  }
}
