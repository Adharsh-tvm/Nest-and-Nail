import { Request, Response, NextFunction } from "express";
import { loggerInstance } from "../../infrastructure/logger/Logger"; 

export function RequestLogger(req: Request, res: Response, next: NextFunction) {
  loggerInstance.http?.(`${req.method} ${req.originalUrl}`);
  next();
}
