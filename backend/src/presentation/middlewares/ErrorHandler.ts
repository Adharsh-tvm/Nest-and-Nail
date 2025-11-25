import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../enums/httpCodes";
import {
  DomainError,
  AuthenticationError,
  UserNotFoundError
} from "../../domain/errors/DomainError";
import { ValidationError } from "../../application/validators/AuthValidator";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HttpStatusCode.INTERNAL_SERVER,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("❌ Error:", err.name, err.message);

  // Handle domain errors
  if (err instanceof AuthenticationError) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      status: "error",
      message: err.message,
      code: err.code
    });
  }

  if (err instanceof UserNotFoundError) {
    return res.status(HttpStatusCode.NOT_FOUND).json({
      status: "error",
      message: err.message,
      code: err.code
    });
  }

  if (err instanceof DomainError) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: "error",
      message: err.message,
      code: err.code
    });
  }

  // Handle AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  if (err instanceof ValidationError) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: "error",
      message: err.message,
      code: "VALIDATION_ERROR"
    });
  }

  // Unknown errors
  res.status(HttpStatusCode.INTERNAL_SERVER).json({
    status: "error",
    message: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
  });
}