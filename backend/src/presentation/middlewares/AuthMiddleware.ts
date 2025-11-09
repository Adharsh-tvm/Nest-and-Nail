// src/presentation/middlewares/AuthMiddleware.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ITokenService } from "../../application/services/ITokenService";
import { HttpStatusCode } from "../enums/httpCodes";

declare global {
  // augment Express Request to carry user payload from JWT
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}

export class AuthMiddleware {
  constructor(private readonly _tokenService: ITokenService) {}

  public verify: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    try {
      const payload = this._tokenService.verifyAccessToken(token);
      req.user = payload;
      next();
    } catch {
      return res
        .status(HttpStatusCode.FORBIDDEN)
        .json({ message: "Invalid or expired token" });
    }
  };
}
