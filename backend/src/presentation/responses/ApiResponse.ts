import { Response } from "express";
import { HttpStatusCode } from "../../shared/enums/httpCodes";

export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export class ResponseHandler {
    static success<T>(
        res: Response,
        data?: T,
        message = "Success",
        statusCode: HttpStatusCode = HttpStatusCode.OK
    ): Response {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            payload: data 
        });
    }



    static error(
        res: Response,
        message = "Something went wrong",
        statusCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER,
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
        } satisfies ApiResponse);
    }
}