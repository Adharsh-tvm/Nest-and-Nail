// src/presentation/middlewares/AuthMiddleware.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ITokenService } from "../../application/services/ITokenService";
import { HttpStatusCode } from "../enums/httpCodes";

declare global {
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}

export class AuthMiddleware {
  constructor(private readonly _tokenService: ITokenService) {}

  public verify: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    // Try to get token from cookie first
    let token = req.cookies?.accessToken;
    
    // If not in cookie, try Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    try {
      const payload = this._tokenService.verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      return res
        .status(HttpStatusCode.FORBIDDEN)
        .json({ message: "Invalid or expired token" });
    }
  };
}