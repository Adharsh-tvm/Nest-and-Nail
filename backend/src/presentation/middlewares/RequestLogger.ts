import { Request, Response, NextFunction } from "express";
import { ILogger } from "../../infrastructure/logger/ILogger"; 

export function RequestLogger(logger: ILogger) {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.http?.(`${req.method} ${req.originalUrl}`);
    next();
  };
}
