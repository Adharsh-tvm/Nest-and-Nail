// src/presentation/middlewares/AuthMiddleware.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ITokenService } from "../../application/contracts/ITokenService";
import { HttpStatusCode } from "../../shared/enums/httpCodes";
import { Role } from "../../shared/enums/authEnums";



export class AuthMiddleware {
  constructor(private readonly _tokenService: ITokenService) { }

  public verify: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    let token = (req.cookies as Record<string, string> | undefined)?.accessToken;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
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
    } catch {
      return res
        .status(HttpStatusCode.FORBIDDEN)
        .json({ message: "Invalid or expired token" });
    }
  };

  public adminOnly: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    this.verify(req, res, () => {
      if (req.user && req.user.role === Role.ADMIN) {
        next();
      } else {
        res
          .status(HttpStatusCode.FORBIDDEN)
          .json({ message: "Admin access required" });
      }
    });
  };
}